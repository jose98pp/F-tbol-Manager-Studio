import React, { useState } from 'react';
import { ChannelBranding } from '../data/branding';
import { ChannelLogoBadge } from './ChannelLogoBadge';
import { X, Youtube, Radio, Palette, Upload, Check, Sparkles } from 'lucide-react';

interface ChannelSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  branding: ChannelBranding;
  onUpdateBranding: (updated: ChannelBranding) => void;
}

export const ChannelSettingsModal: React.FC<ChannelSettingsModalProps> = ({
  isOpen,
  onClose,
  branding,
  onUpdateBranding
}) => {
  const [formData, setFormData] = useState<ChannelBranding>({ ...branding });

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData(prev => ({
            ...prev,
            customLogoUrl: event.target?.result as string,
            logoType: 'custom-upload'
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateBranding(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl max-h-[95vh] sm:max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white font-montserrat">Personalizar Canal de YouTube</h3>
              <p className="text-xs text-slate-400">Ajusta tu nombre, redes, logo esports y estilo visual</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {/* Channel Preview & Logo Switcher */}
          <div className="p-3 bg-slate-950 rounded-xl border border-emerald-500/30 flex items-center gap-4">
            <ChannelLogoBadge branding={formData} size="lg" />
            <div className="flex-1 space-y-2">
              <span className="font-bold text-white text-sm block">Logo del Canal</span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, customLogoUrl: '', logoType: 'default-cyber' }))}
                  className={`px-3 py-1.5 rounded-lg border font-semibold ${
                    !formData.customLogoUrl
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                      : 'bg-slate-800 border-slate-700 text-slate-300'
                  }`}
                >
                  ⚡ Logo Cyber JoseCPP98
                </button>
                <label className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 cursor-pointer flex items-center gap-1.5 font-semibold">
                  <Upload className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Subir Tu Propio Logo</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
            </div>
          </div>

          {/* Basic Identity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-bold block mb-1">Nombre del Canal / Streamer</label>
              <input
                type="text"
                value={formData.channelName}
                onChange={(e) => setFormData(prev => ({ ...prev, channelName: e.target.value }))}
                placeholder="Ej. JOSECPP98"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-slate-300 font-bold block mb-1">Eslogan / Categoría</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData(prev => ({ ...prev, tagline: e.target.value }))}
                placeholder="Ej. PES 2021 & GAMING"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Social Media & Handles */}
          <div className="space-y-2">
            <label className="text-slate-300 font-bold block">Redes y Cuentas de Transmisión</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
                <Youtube className="w-4 h-4 text-red-500 shrink-0" />
                <input
                  type="text"
                  value={formData.youtubeHandle}
                  onChange={(e) => setFormData(prev => ({ ...prev, youtubeHandle: e.target.value }))}
                  placeholder="Canal YouTube: JOSECPP98"
                  className="w-full bg-transparent text-white focus:outline-none text-xs"
                />
              </div>

              <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
                <span className="font-black text-emerald-400 shrink-0">K</span>
                <input
                  type="text"
                  value={formData.kickHandle}
                  onChange={(e) => setFormData(prev => ({ ...prev, kickHandle: e.target.value }))}
                  placeholder="Kick: KICK.COM/JOSECPP98"
                  className="w-full bg-transparent text-white focus:outline-none text-xs"
                />
              </div>

              <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
                <span className="font-bold text-cyan-400 shrink-0">TikTok:</span>
                <input
                  type="text"
                  value={formData.tiktokHandle}
                  onChange={(e) => setFormData(prev => ({ ...prev, tiktokHandle: e.target.value }))}
                  placeholder="TikTok: @JOSECPP98"
                  className="w-full bg-transparent text-white focus:outline-none text-xs"
                />
              </div>

              <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
                <span className="font-bold text-blue-500 shrink-0">FB:</span>
                <input
                  type="text"
                  value={formData.facebookHandle}
                  onChange={(e) => setFormData(prev => ({ ...prev, facebookHandle: e.target.value }))}
                  placeholder="Facebook: JOSECPP98"
                  className="w-full bg-transparent text-white focus:outline-none text-xs"
                />
              </div>
            </div>
          </div>

          {/* Theme Selector */}
          <div>
            <label className="text-slate-300 font-bold block mb-2 flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-emerald-400" />
              <span>Estilo Visual del Banner</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, theme: 'neon-gaming' }))}
                className={`p-3 rounded-xl border text-left transition-all ${
                  formData.theme === 'neon-gaming'
                    ? 'bg-emerald-950/40 border-emerald-500 ring-1 ring-emerald-500'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_8px_#22c55e]" />
                  <span className="font-bold text-white">Cyber Neon Gamer</span>
                </div>
                <p className="text-[10px] text-slate-400">Verde neón, cian, fibra de carbono e iluminación esports (Estilo JoseCPP98)</p>
              </button>

              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, theme: 'tv-broadcast' }))}
                className={`p-3 rounded-xl border text-left transition-all ${
                  formData.theme === 'tv-broadcast'
                    ? 'bg-emerald-950/40 border-emerald-500 ring-1 ring-emerald-500'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-3 h-3 rounded-full bg-slate-200 shadow" />
                  <span className="font-bold text-white">Broadcast TV Oficial</span>
                </div>
                <p className="text-[10px] text-slate-400">Tarjetas claras, fondo de estadio elegante estilo Copa Paceña / Entel</p>
              </button>
            </div>
          </div>

          {/* Sponsor text */}
          <div>
            <label className="text-slate-300 font-bold block mb-1">Texto de Llamado a la Acción (Footer)</label>
            <input
              type="text"
              value={formData.sponsorText}
              onChange={(e) => setFormData(prev => ({ ...prev, sponsorText: e.target.value }))}
              placeholder="Ej. ¡TRANSMISIÓN EN VIVO Y EN ALTA DEFINICIÓN!"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-emerald-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Guardar Cambios</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
