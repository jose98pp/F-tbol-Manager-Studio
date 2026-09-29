import React, { useState } from 'react';
import { BrandProfile, DEFAULT_BRAND_PROFILES } from '../data/brands';
import { X, Tv, Plus, Check, Radio, Palette, Share2, Smartphone, Facebook, Instagram, Youtube, Twitter } from 'lucide-react';

interface BrandProfilesModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeBrandId: string;
  onSelectBrand: (brand: BrandProfile) => void;
}

export const BrandProfilesModal: React.FC<BrandProfilesModalProps> = ({
  isOpen,
  onClose,
  activeBrandId,
  onSelectBrand
}) => {
  const [brands, setBrands] = useState<BrandProfile[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('futbol_banner_brand_profiles_v1');
        return raw ? JSON.parse(raw) : DEFAULT_BRAND_PROFILES;
      } catch (e) {
        return DEFAULT_BRAND_PROFILES;
      }
    }
    return DEFAULT_BRAND_PROFILES;
  });

  const [showNewBrandForm, setShowNewBrandForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newHandle, setNewHandle] = useState('');
  const [newTagline, setNewTagline] = useState('');
  const [newTheme, setNewTheme] = useState<'neon-gaming' | 'tv-broadcast' | 'fire-red' | 'electric-blue'>('neon-gaming');
  const [newPrimaryColor, setNewPrimaryColor] = useState('#10b981');
  const [newSecondaryColor, setNewSecondaryColor] = useState('#06b6d4');
  const [newLogoUrl, setNewLogoUrl] = useState('');
  const [newConnected, setNewConnected] = useState({
    facebook: true,
    tiktok: true,
    instagram: true,
    youtube: true,
    twitter: true
  });

  if (!isOpen) return null;

  const handleCreateBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newBrand: BrandProfile = {
      id: `brand-${Date.now()}`,
      name: newName.trim(),
      channelHandle: newHandle.trim() || `@${newName.toLowerCase().replace(/\s+/g, '')}`,
      tagline: newTagline.trim() || 'Transmisiones de Fútbol en Vivo',
      theme: newTheme,
      primaryColor: newPrimaryColor,
      secondaryColor: newSecondaryColor,
      logoUrl: newLogoUrl.trim() || undefined,
      connectedAccounts: {
        facebook: newConnected.facebook,
        facebookPageName: `${newName.trim()} Oficial`,
        tiktok: newConnected.tiktok,
        tiktokHandle: `@${newName.toLowerCase().replace(/\s+/g, '')}`,
        instagram: newConnected.instagram,
        instagramHandle: `@${newName.toLowerCase().replace(/\s+/g, '')}`,
        youtube: newConnected.youtube,
        youtubeChannel: newName.trim(),
        twitter: newConnected.twitter,
        twitterHandle: `@${newName.toLowerCase().replace(/\s+/g, '')}`
      }
    };

    const updated = [...brands, newBrand];
    setBrands(updated);
    try {
      localStorage.setItem('futbol_banner_brand_profiles_v1', JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving brand profiles:', e);
    }

    onSelectBrand(newBrand);
    setShowNewBrandForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-3 sm:p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-xs text-slate-100">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
              <Tv className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-montserrat flex items-center gap-2">
                <span>Marcas y Canales Separados</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-purple-300 font-mono">
                  Multi-Brand
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Cambia de canal, logo, paleta de colores y cuentas conectadas con un solo clic
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowNewBrandForm(!showNewBrandForm)}
              className="px-3 py-1.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold flex items-center gap-1.5 transition-colors cursor-pointer text-xs shadow-md"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Añadir Nuevo Canal / Marca</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* New Brand Form Drawer */}
        {showNewBrandForm && (
          <form onSubmit={handleCreateBrand} className="p-4 bg-slate-950 border-b border-purple-500/40 space-y-3">
            <span className="font-bold text-white text-xs block font-montserrat">
              Crear perfil de nuevo canal o marca deportiva
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Nombre del Canal / Medio:</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Deporte Total Bolivia, Radio Gol..."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-bold text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Handle principal / Usuario:</label>
                <input
                  type="text"
                  placeholder="@DeporteTotalBo"
                  value={newHandle}
                  onChange={(e) => setNewHandle(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Tema visual:</label>
                <select
                  value={newTheme}
                  onChange={(e) => setNewTheme(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-bold text-xs capitalize cursor-pointer"
                >
                  <option value="neon-gaming">Neon Gaming (Esmeralda/Cyan)</option>
                  <option value="tv-broadcast">TV Broadcast (Paceña Rojo/Oro)</option>
                  <option value="electric-blue">Electric Blue (Azul Rey)</option>
                  <option value="fire-red">Fire Red (Fuego/Pasión)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Slogan / Bajada:</label>
                <input
                  type="text"
                  placeholder="La emoción del fútbol en vivo..."
                  value={newTagline}
                  onChange={(e) => setNewTagline(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">URL de Logo (Opcional):</label>
                <input
                  type="url"
                  placeholder="https://ejemplo.com/logo.png"
                  value={newLogoUrl}
                  onChange={(e) => setNewLogoUrl(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowNewBrandForm(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-purple-500 text-slate-950 font-bold hover:bg-purple-400 shadow"
              >
                Crear Marca
              </button>
            </div>
          </form>
        )}

        {/* Brand Profiles List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {brands.map(brand => {
              const isSelected = brand.id === activeBrandId;

              return (
                <div
                  key={brand.id}
                  onClick={() => {
                    onSelectBrand(brand);
                    onClose();
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-slate-800/90 border-purple-500 shadow-xl ring-2 ring-purple-500/50'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3.5 h-3.5 rounded-full"
                          style={{ backgroundColor: brand.primaryColor }}
                        />
                        <span className="font-bold text-white text-sm font-montserrat">
                          {brand.name}
                        </span>
                      </div>

                      {isSelected && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>Activo</span>
                        </span>
                      )}
                    </div>

                    <span className="text-[11px] font-bold text-purple-400 block mb-1">
                      {brand.channelHandle}
                    </span>
                    <p className="text-[10px] text-slate-400 mb-3">
                      {brand.tagline}
                    </p>

                    {/* Connected social accounts badges */}
                    <div className="pt-2 border-t border-slate-800 flex items-center gap-1.5 flex-wrap">
                      <span className="text-[9px] text-slate-500 uppercase font-bold block w-full mb-0.5">
                        Cuentas conectadas:
                      </span>
                      {brand.connectedAccounts.facebook && (
                        <span className="p-1 rounded bg-blue-900/40 text-blue-400" title="Facebook">
                          <Facebook className="w-3 h-3" />
                        </span>
                      )}
                      {brand.connectedAccounts.tiktok && (
                        <span className="p-1 rounded bg-cyan-900/40 text-cyan-400" title="TikTok">
                          <Smartphone className="w-3 h-3" />
                        </span>
                      )}
                      {brand.connectedAccounts.instagram && (
                        <span className="p-1 rounded bg-pink-900/40 text-pink-400" title="Instagram">
                          <Instagram className="w-3 h-3" />
                        </span>
                      )}
                      {brand.connectedAccounts.youtube && (
                        <span className="p-1 rounded bg-red-900/40 text-red-400" title="YouTube">
                          <Youtube className="w-3 h-3" />
                        </span>
                      )}
                      {brand.connectedAccounts.twitter && (
                        <span className="p-1 rounded bg-slate-800 text-slate-300" title="Twitter / X">
                          <Twitter className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="capitalize font-mono">Tema: {brand.theme.split('-')[0]}</span>
                    <span className="font-bold text-purple-400">Seleccionar Perfil →</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
