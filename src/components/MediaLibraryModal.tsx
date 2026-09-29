import React, { useState, useEffect } from 'react';
import {
  MediaAsset,
  OFFICIAL_STADIUM_MEDIA,
  PLAYER_SILHOUETTES,
  getUserUploadedMedia,
  saveUserMedia,
  deleteUserMedia
} from '../data/mediaLibrary';
import { CLUBS, Club } from '../data/clubs';
import { ClubBadge } from './ClubBadge';
import { X, Image as ImageIcon, Upload, Plus, Trash2, Check, ExternalLink, Shield, MapPin, User, Sparkles } from 'lucide-react';

interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertAssetAsLayer?: (name: string, url: string) => void;
}

export const MediaLibraryModal: React.FC<MediaLibraryModalProps> = ({
  isOpen,
  onClose,
  onInsertAssetAsLayer
}) => {
  const [activeTab, setActiveTab] = useState<'shields' | 'stadiums' | 'players' | 'custom'>('shields');
  const [userMedia, setUserMedia] = useState<MediaAsset[]>([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [newMediaName, setNewMediaName] = useState('');
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newMediaTag, setNewMediaTag] = useState('');
  const [searchFilter, setSearchFilter] = useState('');

  useEffect(() => {
    setUserMedia(getUserUploadedMedia());
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const saved = saveUserMedia({
        name: file.name.replace(/\.[^/.]+$/, ''),
        url: dataUrl,
        tag: 'Subido desde dispositivo'
      });
      setUserMedia(prev => [saved, ...prev]);
      setShowUploadForm(false);
    };
    reader.readAsDataURL(file);
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMediaUrl.trim() || !newMediaName.trim()) return;

    const saved = saveUserMedia({
      name: newMediaName.trim(),
      url: newMediaUrl.trim(),
      tag: newMediaTag.trim() || 'Enlace externo'
    });
    setUserMedia(prev => [saved, ...prev]);
    setNewMediaName('');
    setNewMediaUrl('');
    setNewMediaTag('');
    setShowUploadForm(false);
  };

  const handleDeleteUserMedia = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteUserMedia(id);
    setUserMedia(prev => prev.filter(m => m.id !== id));
  };

  // Filter bolivian clubs by search
  const filteredClubs = CLUBS.filter(c =>
    c.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    c.city?.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-3 sm:p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-xs text-slate-100">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-montserrat flex items-center gap-2">
                <span>Biblioteca de Recursos y Escudos</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-cyan-400 font-mono">
                  Guardados por equipo
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Organiza escudos oficiales, estadios bolivianos y fotos para reutilizar en cualquier diseño
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowUploadForm(!showUploadForm)}
              className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center gap-1.5 transition-colors cursor-pointer text-xs shadow-md"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Subir Recurso</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Upload Form Drawer */}
        {showUploadForm && (
          <div className="p-4 bg-slate-950 border-b border-cyan-500/40 space-y-3">
            <span className="font-bold text-white text-xs block font-montserrat">
              Subir nuevo recurso multimedia a tu biblioteca
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option 1: File from Computer */}
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-700 flex flex-col justify-center items-center text-center">
                <Upload className="w-6 h-6 text-cyan-400 mb-2" />
                <span className="font-bold text-white mb-1">Subir Archivo desde tu Dispositivo</span>
                <span className="text-[10px] text-slate-400 mb-2">Soporta PNG transparente, SVG, JPG</span>
                <label className="px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs cursor-pointer hover:bg-cyan-400">
                  <span>Seleccionar Imagen</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Option 2: Image URL */}
              <form onSubmit={handleUrlSubmit} className="p-3 bg-slate-900 rounded-xl border border-slate-700 space-y-2">
                <span className="font-bold text-white block">O ingresar URL de Imagen</span>
                <input
                  type="text"
                  required
                  placeholder="Nombre: ej. Escudo Patrocinador..."
                  value={newMediaName}
                  onChange={(e) => setNewMediaName(e.target.value)}
                  className="w-full px-2.5 py-1 bg-slate-950 border border-slate-700 rounded-lg text-white font-bold text-xs"
                />
                <input
                  type="url"
                  required
                  placeholder="https://ejemplo.com/logo.png"
                  value={newMediaUrl}
                  onChange={(e) => setNewMediaUrl(e.target.value)}
                  className="w-full px-2.5 py-1 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs"
                />
                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="px-3 py-1 rounded-lg bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 text-xs"
                  >
                    Guardar Recurso
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Category Tabs */}
        <div className="p-3 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('shields')}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                activeTab === 'shields'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Escudos de Clubes</span>
            </button>

            <button
              onClick={() => setActiveTab('stadiums')}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                activeTab === 'stadiums'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Estadios de Bolivia</span>
            </button>

            <button
              onClick={() => setActiveTab('players')}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                activeTab === 'players'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Jugadores & Siluetas</span>
            </button>

            <button
              onClick={() => setActiveTab('custom')}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                activeTab === 'custom'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Mis Recursos ({userMedia.length})</span>
            </button>
          </div>

          {activeTab === 'shields' && (
            <input
              type="text"
              placeholder="Buscar club por nombre o ciudad..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="px-2.5 py-1 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs w-48 shrink-0"
            />
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* 1. Escudos Oficiales */}
          {activeTab === 'shields' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {filteredClubs.map(club => (
                <div
                  key={club.id}
                  className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl flex flex-col items-center text-center hover:border-cyan-500/60 transition-all group"
                >
                  <ClubBadge club={club} size="lg" className="my-2 group-hover:scale-105 transition-transform" />
                  <span className="font-bold text-white font-montserrat truncate w-full text-xs">
                    {club.name}
                  </span>
                  <span className="text-[10px] text-slate-400">{club.city || 'Bolivia'}</span>

                  {onInsertAssetAsLayer && (
                    <button
                      onClick={() => onInsertAssetAsLayer(`Escudo ${club.name}`, club.badgeUrl || '')}
                      className="mt-2 w-full py-1 rounded bg-slate-900 hover:bg-cyan-500 hover:text-slate-950 text-cyan-400 font-bold text-[10px] transition-colors cursor-pointer"
                    >
                      Añadir al Lienzo
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* 2. Estadios de Bolivia */}
          {activeTab === 'stadiums' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {OFFICIAL_STADIUM_MEDIA.map(stad => (
                <div
                  key={stad.id}
                  className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-lg flex flex-col justify-between group"
                >
                  <div className="h-32 w-full overflow-hidden relative">
                    <img
                      src={stad.url}
                      alt={stad.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                    <span className="absolute bottom-2 left-2 text-[10px] font-bold text-white bg-slate-900/80 px-2 py-0.5 rounded">
                      {stad.clubOrRegion}
                    </span>
                  </div>

                  <div className="p-3 space-y-1">
                    <h3 className="font-bold text-white text-xs">{stad.name}</h3>
                    <p className="text-[10px] text-slate-400">{stad.tag}</p>

                    {onInsertAssetAsLayer && (
                      <button
                        onClick={() => onInsertAssetAsLayer(stad.name, stad.url)}
                        className="mt-2 w-full py-1.5 rounded-lg bg-slate-900 hover:bg-cyan-500 hover:text-slate-950 text-cyan-400 font-bold text-[11px] transition-colors cursor-pointer flex items-center justify-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Usar Fondo en Banner</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 3. Jugadores & Siluetas */}
          {activeTab === 'players' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {PLAYER_SILHOUETTES.map(p => (
                <div
                  key={p.id}
                  className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 p-3 flex flex-col justify-between"
                >
                  <div className="h-36 rounded-xl overflow-hidden bg-slate-900 mb-2">
                    <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-xs">{p.name}</h3>
                    <span className="text-[10px] text-slate-400 block">{p.tag}</span>
                  </div>
                  {onInsertAssetAsLayer && (
                    <button
                      onClick={() => onInsertAssetAsLayer(p.name, p.url)}
                      className="mt-2 w-full py-1 rounded bg-cyan-500 text-slate-950 font-bold text-[11px] hover:bg-cyan-400"
                    >
                      Insertar Silueta
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* 4. Mis Recursos Subidos */}
          {activeTab === 'custom' && (
            <div>
              {userMedia.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <Upload className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Aún no has subido recursos propios.</p>
                  <button
                    onClick={() => setShowUploadForm(true)}
                    className="mt-2 px-3 py-1.5 rounded-xl bg-slate-800 text-cyan-400 font-bold hover:bg-slate-700"
                  >
                    Subir mi primera imagen
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {userMedia.map(m => (
                    <div
                      key={m.id}
                      className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col justify-between group"
                    >
                      <div className="h-28 rounded-xl overflow-hidden bg-slate-900 mb-2 flex items-center justify-center p-1">
                        <img src={m.url} alt={m.name} className="max-h-full max-w-full object-contain" />
                      </div>

                      <div>
                        <span className="font-bold text-white block truncate text-xs">{m.name}</span>
                        <span className="text-[10px] text-slate-400 block truncate">{m.tag}</span>
                      </div>

                      <div className="flex items-center gap-1.5 mt-2">
                        {onInsertAssetAsLayer && (
                          <button
                            onClick={() => onInsertAssetAsLayer(m.name, m.url)}
                            className="flex-1 py-1 rounded bg-cyan-500 text-slate-950 font-bold text-[10px] hover:bg-cyan-400"
                          >
                            Insertar
                          </button>
                        )}
                        <button
                          onClick={(e) => handleDeleteUserMedia(m.id, e)}
                          className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-slate-900"
                          title="Eliminar recurso"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
