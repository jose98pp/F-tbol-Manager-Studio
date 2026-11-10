import React, { useState } from 'react';
import { googleAuthProvider, signInWithPopup, signOut } from '../lib/firebase';
import { auth } from '../lib/firebase';
import { useFirebase } from '../context/FirebaseContext';
import { LogIn, LogOut, Cloud, RefreshCw, CheckCircle2 } from 'lucide-react';

export const FirebaseAuthButton: React.FC = () => {
  const { user, authLoading, isCloudConnected, cloudSyncStatus, lastSyncedAt } = useFirebase();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSignIn = async () => {
    try {
      setIsSigningIn(true);
      await signInWithPopup(auth, googleAuthProvider);
    } catch (error) {
      console.error('Firebase Auth sign-in error:', error);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Firebase Auth sign-out error:', error);
    }
  };

  if (authLoading) {
    return (
      <div className="h-7 w-20 animate-pulse bg-slate-800 rounded-xl" />
    );
  }

  if (user && isCloudConnected) {
    return (
      <div className="flex items-center gap-2 bg-slate-900 border border-emerald-500/40 pl-2 pr-1.5 py-1 rounded-xl text-xs shadow-sm">
        <div className="flex items-center gap-1.5">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName || 'Usuario'}
              className="w-5 h-5 rounded-full border border-emerald-400 shrink-0"
            />
          ) : (
            <div className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center text-[10px] shrink-0">
              {user.email ? user.email[0].toUpperCase() : 'U'}
            </div>
          )}
          <div className="hidden sm:flex flex-col text-left leading-none">
            <span className="text-[11px] font-bold text-white max-w-[90px] truncate">
              {user.displayName || user.email?.split('@')[0]}
            </span>
            <span className="text-[9px] text-emerald-400 font-mono flex items-center gap-0.5">
              <Cloud className="w-2.5 h-2.5 inline" />
              <span>Firestore Sync</span>
            </span>
          </div>
        </div>

        {cloudSyncStatus === 'syncing' ? (
          <span title="Sincronizando con Firebase...">
            <RefreshCw className="w-3 h-3 text-cyan-400 animate-spin ml-0.5" />
          </span>
        ) : (
          <span title="Datos guardados en Firebase Firestore">
            <CheckCircle2 className="w-3 h-3 text-emerald-400 ml-0.5" />
          </span>
        )}

        <button
          onClick={handleSignOut}
          title="Cerrar sesión de Firebase"
          className="text-slate-400 hover:text-red-400 transition-colors p-1 rounded cursor-pointer ml-1"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleSignIn}
      disabled={isSigningIn}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-emerald-500/30 text-xs font-semibold text-emerald-300 transition-colors cursor-pointer shrink-0"
      title="Conectar con Firebase (Google Sign-In) para guardar plantillas, marcas y publicaciones en Firestore"
    >
      <Cloud className="w-3.5 h-3.5 text-emerald-400" />
      <span className="hidden sm:inline">Conectar Nube</span>
      <LogIn className="w-3 h-3 text-emerald-400 sm:hidden" />
    </button>
  );
};
