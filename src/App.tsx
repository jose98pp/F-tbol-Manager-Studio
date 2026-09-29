import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { toPng, toJpeg, toBlob } from 'html-to-image';
import { INITIAL_TEMPLATE_DATA, TemplateData, TemplateType } from './data/templates';
import { DEFAULT_BRANDING, BANNER_FORMATS, BannerFormat, ChannelBranding } from './data/branding';
import { Club, Player, CLUBS, getClubById } from './data/clubs';
import { Competition, COMPETITIONS, getCompetitionById } from './data/competitions';

import { FixtureBanner } from './components/banners/FixtureBanner';
import { VersusBanner } from './components/banners/VersusBanner';
import { ResultBanner } from './components/banners/ResultBanner';
import { StandingsBanner } from './components/banners/StandingsBanner';
import { LineupBanner } from './components/banners/LineupBanner';
import { GoalBanner } from './components/banners/GoalBanner';

import { ClubPickerModal } from './components/ClubPickerModal';
import { CompetitionPickerModal } from './components/CompetitionPickerModal';
import { ChannelSettingsModal } from './components/ChannelSettingsModal';
import { ClubInfoModal } from './components/ClubInfoModal';

import { LiveSimulationPanel } from './components/LiveSimulationPanel';
import { FixtureEditorPanel } from './components/FixtureEditorPanel';
import { StandingsEditorPanel } from './components/StandingsEditorPanel';
import { LineupEditorPanel } from './components/LineupEditorPanel';
import { GoalEditorPanel } from './components/GoalEditorPanel';

import { ChannelLogoBadge } from './components/ChannelLogoBadge';
import { CompetitionBadge } from './components/CompetitionBadge';

import {
  Download,
  Copy,
  Settings,
  Shield,
  Calendar,
  Swords,
  CheckCircle,
  Trophy,
  Smartphone,
  Square,
  Monitor,
  ZoomIn,
  ZoomOut,
  Flame,
  Check,
  Users,
  Info
} from 'lucide-react';

export default function App() {
  const [data, setData] = useState<TemplateData>(INITIAL_TEMPLATE_DATA);
  const [branding, setBranding] = useState<ChannelBranding>(DEFAULT_BRANDING);
  const [activeFormat, setActiveFormat] = useState<BannerFormat>(BANNER_FORMATS[0]); // default TikTok 9:16
  const [activeTab, setActiveTab] = useState<'fixture' | 'match' | 'lineup' | 'goal' | 'standings' | 'export'>('fixture');
  
  // Modals
  const [isChannelModalOpen, setIsChannelModalOpen] = useState(false);
  const [isCompetitionModalOpen, setIsCompetitionModalOpen] = useState(false);
  const [isClubPickerOpen, setIsClubPickerOpen] = useState(false);
  const [isClubInfoModalOpen, setIsClubInfoModalOpen] = useState(false);
  const [selectedClubForInfo, setSelectedClubForInfo] = useState<Club>(getClubById('bolivar'));

  const [clubPickerContext, setClubPickerContext] = useState<{
    target: 'fixture' | 'versus-home' | 'versus-away' | 'standings' | 'lineup' | 'goal-scorer' | 'goal-opponent';
    matchId?: string;
    side?: 'home' | 'away';
    standingsIndex?: number;
  }>({ target: 'versus-home' });

  // Export & View State
  const [isExporting, setIsExporting] = useState(false);
  const [exportScale, setExportScale] = useState<number>(2); // 2x default for super crisp HD
  const [exportFormat, setExportFormat] = useState<'png' | 'jpeg'>('png');
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [canvasZoom, setCanvasZoom] = useState<number>(100);
  const [mobileView, setMobileView] = useState<'canvas' | 'editor'>('canvas');

  const currentCompetition = getCompetitionById(data.competitionId);

  // Auto-fit canvas to current screen size
  const handleFitToScreen = () => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width < 480) {
        setCanvasZoom(activeFormat.id === 'tiktok-story' ? 80 : activeFormat.id === 'facebook-square' ? 65 : 60);
      } else if (width < 768) {
        setCanvasZoom(activeFormat.id === 'tiktok-story' ? 85 : 75);
      } else if (width < 1024) {
        setCanvasZoom(90);
      } else {
        setCanvasZoom(100);
      }
    }
  };

  // Handle club selection from modal
  const handleSelectClub = (club: Club) => {
    if (clubPickerContext.target === 'versus-home') {
      setData(prev => ({
        ...prev,
        singleMatch: { ...prev.singleMatch, homeClubId: club.id }
      }));
    } else if (clubPickerContext.target === 'versus-away') {
      setData(prev => ({
        ...prev,
        singleMatch: { ...prev.singleMatch, awayClubId: club.id }
      }));
    } else if (clubPickerContext.target === 'lineup') {
      const squad = club.squad || [];
      setData(prev => ({
        ...prev,
        lineup: {
          ...prev.lineup,
          clubId: club.id,
          coach: club.coach || prev.lineup.coach,
          starters: squad.slice(0, 11),
          substitutes: squad.slice(11, 16)
        }
      }));
    } else if (clubPickerContext.target === 'goal-scorer') {
      const firstPlayer = club.squad?.[0];
      setData(prev => ({
        ...prev,
        goal: {
          ...prev.goal,
          scoringClubId: club.id,
          playerName: firstPlayer?.name.toUpperCase() || 'DELANTERO',
          playerNumber: firstPlayer?.number || 9
        }
      }));
    } else if (clubPickerContext.target === 'goal-opponent') {
      setData(prev => ({
        ...prev,
        goal: { ...prev.goal, opponentClubId: club.id }
      }));
    } else if (clubPickerContext.target === 'fixture' && clubPickerContext.matchId) {
      setData(prev => ({
        ...prev,
        fixtureMatches: prev.fixtureMatches.map(m => {
          if (m.id === clubPickerContext.matchId) {
            return clubPickerContext.side === 'home'
              ? { ...m, homeClubId: club.id }
              : { ...m, awayClubId: club.id };
          }
          return m;
        })
      }));
    } else if (clubPickerContext.target === 'standings' && clubPickerContext.standingsIndex !== undefined) {
      const idx = clubPickerContext.standingsIndex;
      setData(prev => {
        const updated = [...prev.standings];
        if (updated[idx]) {
          updated[idx] = { ...updated[idx], clubId: club.id };
        }
        return { ...prev, standings: updated };
      });
    }
  };

  // Handle player selection for goal from club info modal
  const handleSelectPlayerForGoal = (player: Player, club: Club) => {
    setData(prev => ({
      ...prev,
      type: 'goal',
      goal: {
        ...prev.goal,
        scoringClubId: club.id,
        playerName: player.name.toUpperCase(),
        playerNumber: player.number,
        minute: "65'",
        goalType: '¡GOLAZO!'
      }
    }));
    setActiveTab('goal');
  };

  // Apply squad to lineup from club info modal
  const handleApplySquadToLineup = (club: Club) => {
    const squad = club.squad || [];
    setData(prev => ({
      ...prev,
      type: 'lineup',
      lineup: {
        ...prev.lineup,
        clubId: club.id,
        coach: club.coach || prev.lineup.coach,
        starters: squad.slice(0, 11),
        substitutes: squad.slice(11, 16)
      }
    }));
    setActiveTab('lineup');
  };

  // Open club info modal
  const openClubInfo = (club: Club) => {
    setSelectedClubForInfo(club);
    setIsClubInfoModalOpen(true);
  };

  // Handle competition selection
  const handleSelectCompetition = (comp: Competition) => {
    setData(prev => ({
      ...prev,
      competitionId: comp.id,
      tournament: comp.name
    }));
  };

  // Open club picker for specific match
  const openClubPickerForFixture = (matchId: string, side: 'home' | 'away') => {
    setClubPickerContext({ target: 'fixture', matchId, side });
    setIsClubPickerOpen(true);
  };

  const openClubPickerForVersus = (side: 'home' | 'away') => {
    setClubPickerContext({
      target: side === 'home' ? 'versus-home' : 'versus-away',
      side
    });
    setIsClubPickerOpen(true);
  };

  const openClubPickerForStandings = (clubId: string, index: number) => {
    setClubPickerContext({
      target: 'standings',
      standingsIndex: index
    });
    setIsClubPickerOpen(true);
  };

  // High-Resolution Image Export
  const handleExportImage = async () => {
    const node = document.getElementById('soccer-banner-capture');
    if (!node) return;

    setIsExporting(true);
    try {
      const filename = `banner-${data.type}-${currentCompetition.shortName.toLowerCase().replace(/\s+/g, '-')}-${activeFormat.id}-${Date.now()}.${exportFormat}`;

      let dataUrl: string;
      if (exportFormat === 'png') {
        dataUrl = await toPng(node, {
          pixelRatio: exportScale,
          cacheBust: true,
          quality: 0.98,
          skipFonts: true
        });
      } else {
        dataUrl = await toJpeg(node, {
          pixelRatio: exportScale,
          cacheBust: true,
          quality: 0.95,
          skipFonts: true
        });
      }

      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      link.click();

      // Confetti celebration
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.8 },
        colors: ['#22c55e', '#06b6d4', '#eab308']
      });
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // One-click clipboard copy
  const handleCopyToClipboard = async () => {
    const node = document.getElementById('soccer-banner-capture');
    if (!node) return;

    setIsExporting(true);
    try {
      const blob = await toBlob(node, {
        pixelRatio: 2,
        cacheBust: true,
        skipFonts: true
      });
      if (blob && navigator.clipboard) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        setCopiedSuccess(true);
        setTimeout(() => setCopiedSuccess(false), 2500);

        confetti({
          particleCount: 35,
          spread: 50,
          origin: { y: 0.8 },
          colors: ['#22c55e', '#06b6d4']
        });
      }
    } catch (err) {
      console.error('Copy to clipboard failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Switch template
  const handleSelectTemplateType = (type: TemplateType) => {
    setData(prev => ({ ...prev, type }));
    if (type === 'fixture') setActiveTab('fixture');
    else if (type === 'versus' || type === 'result') setActiveTab('match');
    else if (type === 'lineup') setActiveTab('lineup');
    else if (type === 'goal') setActiveTab('goal');
    else if (type === 'standings') setActiveTab('standings');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950">
      {/* TOP NAVIGATION / STUDIO BAR */}
      <header className="h-14 sm:h-16 border-b border-slate-800 bg-slate-950/95 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between z-30 shrink-0 gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="relative shrink-0">
            <ChannelLogoBadge branding={branding} size="sm" />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-950" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <h1 className="font-extrabold text-sm sm:text-base md:text-lg tracking-tight text-white font-montserrat flex items-center gap-1.5 truncate">
                <span>Fútbol Banner Studio</span>
                <span className="hidden xs:inline text-[9px] sm:text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shrink-0">
                  {branding.channelName}
                </span>
              </h1>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 hidden md:block truncate">
              Banners para TikTok y Facebook • Escudos oficiales • Alineaciones 11 y ¡GOL!
            </p>
          </div>
        </div>

        {/* Action Header Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Tournament Selector Pill */}
          <button
            onClick={() => setIsCompetitionModalOpen(true)}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-yellow-500/40 text-xs font-semibold text-yellow-300 transition-colors cursor-pointer shrink-0"
            title="Cambiar competencia o torneo"
          >
            <Trophy className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
            <span className="hidden md:inline">Torneo:</span>
            <span className="font-bold truncate max-w-[70px] sm:max-w-[120px]">{currentCompetition.shortName}</span>
          </button>

          {/* Quick Escudo Manager & History */}
          <button
            onClick={() => {
              setClubPickerContext({ target: 'versus-home' });
              setIsClubPickerOpen(true);
            }}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-xs font-semibold text-cyan-300 transition-colors cursor-pointer shrink-0"
            title="Historial de escudos y búsqueda en internet"
          >
            <Shield className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="hidden lg:inline">Escudos / Historial</span>
          </button>

          {/* Channel Customization Button */}
          <button
            onClick={() => setIsChannelModalOpen(true)}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer shrink-0"
            title="Personalizar canal"
          >
            <Settings className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="hidden xl:inline">Canal:</span>
            <span className="hidden sm:inline text-emerald-400 font-bold">{branding.channelName}</span>
          </button>

          {/* Direct Copy Button */}
          <button
            onClick={handleCopyToClipboard}
            disabled={isExporting}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-white transition-colors cursor-pointer shrink-0"
            title="Copiar imagen al portapapeles"
          >
            {copiedSuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copiedSuccess ? '¡Copiado!' : 'Copiar'}</span>
          </button>

          {/* High Res Export Button */}
          <button
            onClick={handleExportImage}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black shadow-lg shadow-emerald-500/20 transition-all cursor-pointer active:scale-95 shrink-0"
          >
            <Download className={`w-3.5 h-3.5 ${isExporting ? 'animate-bounce' : ''}`} />
            <span className="hidden xs:inline">{isExporting ? 'Generando...' : 'Descargar HD'}</span>
          </button>
        </div>
      </header>

      {/* Mobile View Mode Switcher (< lg screens) */}
      <div className="lg:hidden flex items-center bg-slate-900 border-b border-slate-800 p-1.5 shrink-0 z-20">
        <button
          onClick={() => setMobileView('canvas')}
          className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            mobileView === 'canvas'
              ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Ver Banner</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/20 font-mono">
            {activeFormat.aspectRatio}
          </span>
        </button>
        <button
          onClick={() => setMobileView('editor')}
          className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            mobileView === 'editor'
              ? 'bg-slate-800 text-emerald-400 border border-slate-700 shadow-md font-black'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Editar Datos</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 uppercase font-mono">
            {activeTab}
          </span>
        </button>
      </div>

      {/* WORKSPACE AREA: CANVAS PREVIEW + CONTROL SIDEBAR */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* LEFT / CENTER: CANVAS WORKSPACE */}
        <div
          className={`flex-1 flex-col bg-slate-950/60 border-r border-slate-800/80 overflow-hidden relative ${
            mobileView === 'editor' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Format and Template Top Controls */}
          <div className="p-2 sm:p-3 border-b border-slate-800/80 bg-slate-900/60 flex flex-col md:flex-row md:items-center justify-between gap-2 shrink-0">
            {/* Template Selector Pills (smooth horizontal scroll with hidden scrollbar) */}
            <div className="flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pb-0.5 text-xs shrink-0">
              <button
                onClick={() => handleSelectTemplateType('fixture')}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer shrink-0 ${
                  data.type === 'fixture'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Fixture</span>
              </button>

              <button
                onClick={() => handleSelectTemplateType('versus')}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer shrink-0 ${
                  data.type === 'versus'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Swords className="w-3.5 h-3.5" />
                <span>Partido</span>
              </button>

              <button
                onClick={() => handleSelectTemplateType('lineup')}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer shrink-0 ${
                  data.type === 'lineup'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Alineación 11</span>
              </button>

              <button
                onClick={() => handleSelectTemplateType('goal')}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer shrink-0 ${
                  data.type === 'goal'
                    ? 'bg-yellow-400 text-slate-950 shadow-md shadow-yellow-400/30'
                    : 'bg-slate-800 text-yellow-400 hover:bg-slate-700'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>¡GOL!</span>
              </button>

              <button
                onClick={() => handleSelectTemplateType('result')}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer shrink-0 ${
                  data.type === 'result'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Marcador</span>
              </button>

              <button
                onClick={() => handleSelectTemplateType('standings')}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer shrink-0 ${
                  data.type === 'standings'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Trophy className="w-3.5 h-3.5" />
                <span>Posiciones</span>
              </button>
            </div>

            {/* Social Network Formats Switcher */}
            <div className="flex items-center gap-1 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden text-xs shrink-0 self-start md:self-auto">
              {BANNER_FORMATS.map(fmt => {
                const isActive = activeFormat.id === fmt.id;
                return (
                  <button
                    key={fmt.id}
                    onClick={() => setActiveFormat(fmt)}
                    className={`flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer shrink-0 ${
                      isActive
                        ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                        : 'bg-slate-850 hover:bg-slate-800 text-slate-400'
                    }`}
                    title={fmt.description}
                  >
                    {fmt.id === 'tiktok-story' && <Smartphone className="w-3.5 h-3.5" />}
                    {fmt.id === 'facebook-square' && <Square className="w-3.5 h-3.5" />}
                    {fmt.id === 'facebook-feed' && <Smartphone className="w-3.5 h-3.5" />}
                    {fmt.id === 'horizontal-16-9' && <Monitor className="w-3.5 h-3.5" />}
                    <span className="text-[10px] sm:text-[11px]">{fmt.aspectRatio}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Banner Canvas Display with Zoom */}
          <div className="flex-1 overflow-auto p-2 sm:p-4 md:p-6 flex items-center justify-center relative bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
            {/* Canvas Frame Wrapper with Responsive Aspect Ratio and Fluid Width */}
            <div
              className="relative transition-all duration-300 shadow-2xl rounded-2xl overflow-hidden ring-1 ring-slate-800 shrink-0"
              style={{
                width:
                  activeFormat.id === 'tiktok-story'
                    ? 'min(100%, 380px)'
                    : activeFormat.id === 'facebook-feed'
                    ? 'min(100%, 430px)'
                    : activeFormat.id === 'facebook-square'
                    ? 'min(100%, 480px)'
                    : 'min(100%, 640px)',
                maxWidth: 'calc(100vw - 28px)',
                aspectRatio:
                  activeFormat.id === 'tiktok-story'
                    ? '9/16'
                    : activeFormat.id === 'facebook-feed'
                    ? '4/5'
                    : activeFormat.id === 'facebook-square'
                    ? '1/1'
                    : '16/9',
                maxHeight: 'min(calc(100vh - 210px), 720px)',
                transform: `scale(${canvasZoom / 100})`,
                transformOrigin: 'center center'
              }}
            >
              {/* Dynamic Banner Render based on Template Type */}
              {data.type === 'fixture' && (
                <FixtureBanner
                  data={data}
                  branding={branding}
                  format={activeFormat}
                  onSelectClubToSwap={openClubPickerForFixture}
                  onOpenCompetitionPicker={() => setIsCompetitionModalOpen(true)}
                />
              )}

              {data.type === 'versus' && (
                <VersusBanner
                  data={data}
                  branding={branding}
                  format={activeFormat}
                  onSelectClubToSwap={openClubPickerForVersus}
                  onOpenCompetitionPicker={() => setIsCompetitionModalOpen(true)}
                />
              )}

              {data.type === 'lineup' && (
                <LineupBanner
                  data={data}
                  branding={branding}
                  format={activeFormat}
                  onSelectClubToSwap={() => {
                    setClubPickerContext({ target: 'lineup' });
                    setIsClubPickerOpen(true);
                  }}
                  onOpenCompetitionPicker={() => setIsCompetitionModalOpen(true)}
                />
              )}

              {data.type === 'goal' && (
                <GoalBanner
                  data={data}
                  branding={branding}
                  format={activeFormat}
                  onSelectScoringClub={() => {
                    setClubPickerContext({ target: 'goal-scorer' });
                    setIsClubPickerOpen(true);
                  }}
                  onOpenCompetitionPicker={() => setIsCompetitionModalOpen(true)}
                />
              )}

              {data.type === 'result' && (
                <ResultBanner
                  data={data}
                  branding={branding}
                  format={activeFormat}
                  onSelectClubToSwap={openClubPickerForVersus}
                  onOpenCompetitionPicker={() => setIsCompetitionModalOpen(true)}
                />
              )}

              {data.type === 'standings' && (
                <StandingsBanner
                  data={data}
                  branding={branding}
                  format={activeFormat}
                  onSelectClubToSwap={openClubPickerForStandings}
                  onOpenCompetitionPicker={() => setIsCompetitionModalOpen(true)}
                />
              )}
            </div>

            {/* Floating Zoom & Preset Controls */}
            <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-6 flex items-center gap-1 bg-slate-900/90 border border-slate-700 p-1 sm:p-1.5 rounded-xl shadow-lg backdrop-blur-md text-xs z-10">
              <button
                onClick={() => setCanvasZoom(z => Math.max(50, z - 10))}
                className="p-1 sm:p-1.5 rounded text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer"
                title="Reducir zoom"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-[10px] sm:text-[11px] text-slate-300 px-1">{canvasZoom}%</span>
              <button
                onClick={() => setCanvasZoom(z => Math.min(140, z + 10))}
                className="p-1 sm:p-1.5 rounded text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer"
                title="Aumentar zoom"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setCanvasZoom(100)}
                className="text-[10px] px-1.5 sm:px-2 py-0.5 sm:py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold cursor-pointer"
              >
                100%
              </button>
              <button
                onClick={handleFitToScreen}
                className="text-[10px] px-1.5 sm:px-2 py-0.5 sm:py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-bold cursor-pointer border border-emerald-500/30"
                title="Ajustar a pantalla"
              >
                Ajustar
              </button>
            </div>

            {/* Mobile Bottom Quick Switch & Export Bar (< lg) */}
            <div className="lg:hidden absolute bottom-3 right-3 flex items-center gap-1.5 z-10">
              <button
                onClick={() => setMobileView('editor')}
                className="flex items-center gap-1 px-3 py-1.5 bg-slate-900/95 hover:bg-slate-800 text-emerald-400 border border-emerald-500/40 rounded-xl text-xs font-bold shadow-lg backdrop-blur-md cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Editar</span>
              </button>
              <button
                onClick={handleExportImage}
                disabled={isExporting}
                className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs shadow-lg shadow-emerald-500/30 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isExporting ? '...' : 'Descargar'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT CONTROL SIDEBAR */}
        <aside
          className={`w-full lg:w-96 bg-slate-900/90 border-t lg:border-t-0 lg:border-l border-slate-800/80 flex flex-col shrink-0 overflow-hidden ${
            mobileView === 'canvas' ? 'hidden lg:flex' : 'flex flex-1'
          }`}
        >
          {/* Active Tournament Indicator Header & Mobile Back to Canvas Button */}
          <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-2">
            <div
              onClick={() => setIsCompetitionModalOpen(true)}
              className="flex items-center gap-2 cursor-pointer hover:opacity-85 transition-opacity min-w-0"
            >
              <CompetitionBadge competition={currentCompetition} size="sm" />
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 block font-bold">Torneo Activo</span>
                <span className="text-xs font-extrabold text-white truncate max-w-[140px] sm:max-w-[170px] block font-montserrat">
                  {currentCompetition.name}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => setIsCompetitionModalOpen(true)}
                className="text-xs px-2.5 py-1 bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 rounded-lg font-bold hover:bg-yellow-500/30 transition-colors cursor-pointer"
              >
                Cambiar
              </button>
              <button
                onClick={() => setMobileView('canvas')}
                className="lg:hidden text-xs px-2.5 py-1 bg-emerald-500 text-slate-950 rounded-lg font-black hover:bg-emerald-400 transition-colors cursor-pointer flex items-center gap-1"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Ver Banner</span>
              </button>
            </div>
          </div>

          {/* Tabs header with smooth horizontal touch scroll */}
          <div className="p-1.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/70 text-xs overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden shrink-0 gap-1">
            <button
              onClick={() => {
                setActiveTab('fixture');
                setData(prev => ({ ...prev, type: 'fixture' }));
              }}
              className={`py-2 px-2 rounded-lg font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                activeTab === 'fixture'
                  ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Fixture</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('match');
                if (data.type !== 'versus' && data.type !== 'result') {
                  setData(prev => ({ ...prev, type: 'versus' }));
                }
              }}
              className={`py-2 px-2 rounded-lg font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                activeTab === 'match'
                  ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Swords className="w-3.5 h-3.5" />
              <span>Partido</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('lineup');
                setData(prev => ({ ...prev, type: 'lineup' }));
              }}
              className={`py-2 px-2 rounded-lg font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                activeTab === 'lineup'
                  ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>11 Titular</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('goal');
                setData(prev => ({ ...prev, type: 'goal' }));
              }}
              className={`py-2 px-2 rounded-lg font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                activeTab === 'goal'
                  ? 'bg-slate-800 text-yellow-400 border border-slate-700'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>¡Gol!</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('standings');
                setData(prev => ({ ...prev, type: 'standings' }));
              }}
              className={`py-2 px-2 rounded-lg font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                activeTab === 'standings'
                  ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Tabla</span>
            </button>

            <button
              onClick={() => setActiveTab('export')}
              className={`py-2 px-2 rounded-lg font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                activeTab === 'export'
                  ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar</span>
            </button>
          </div>

          {/* Active Tab Panel Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {activeTab === 'fixture' && (
              <FixtureEditorPanel
                data={data}
                onUpdateData={setData}
                onOpenClubPicker={openClubPickerForFixture}
              />
            )}

            {activeTab === 'match' && (
              <LiveSimulationPanel
                data={data}
                onUpdateData={setData}
                branding={branding}
              />
            )}

            {activeTab === 'lineup' && (
              <LineupEditorPanel
                data={data}
                onUpdateData={setData}
                onOpenClubPicker={() => {
                  setClubPickerContext({ target: 'lineup' });
                  setIsClubPickerOpen(true);
                }}
                onOpenClubInfo={openClubInfo}
              />
            )}

            {activeTab === 'goal' && (
              <GoalEditorPanel
                data={data}
                onUpdateData={setData}
                onOpenClubPickerForScorer={() => {
                  setClubPickerContext({ target: 'goal-scorer' });
                  setIsClubPickerOpen(true);
                }}
              />
            )}

            {activeTab === 'standings' && (
              <StandingsEditorPanel
                data={data}
                onUpdateData={setData}
                onOpenClubPicker={openClubPickerForStandings}
              />
            )}

            {activeTab === 'export' && (
              <div className="space-y-4 text-xs">
                <div className="p-3.5 bg-slate-950 rounded-2xl border border-emerald-500/30 space-y-3">
                  <span className="font-bold text-white block text-sm font-montserrat">
                    Exportar en Alta Resolución
                  </span>
                  <p className="text-[11px] text-slate-400">
                    Optimizado para publicación directa en TikTok (9:16 vertical) o Facebook Posts (1:1 y 4:5).
                  </p>

                  {/* Resolution / DPI Scaling */}
                  <div>
                    <label className="text-slate-300 font-bold block mb-1.5">Calidad y Escala:</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setExportScale(1)}
                        className={`p-2 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                          exportScale === 1
                            ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        <span className="block text-xs">1x HD</span>
                        <span className="text-[10px] text-slate-500">1080p</span>
                      </button>

                      <button
                        onClick={() => setExportScale(2)}
                        className={`p-2 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                          exportScale === 2
                            ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 ring-1 ring-emerald-500'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        <span className="block text-xs">2x Retina</span>
                        <span className="text-[10px] text-slate-500">Recomendado</span>
                      </button>

                      <button
                        onClick={() => setExportScale(3)}
                        className={`p-2 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                          exportScale === 3
                            ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        <span className="block text-xs">4K Ultra</span>
                        <span className="text-[10px] text-slate-500">Impresión/Max</span>
                      </button>
                    </div>
                  </div>

                  {/* Format (PNG vs JPG) */}
                  <div>
                    <label className="text-slate-300 font-bold block mb-1.5">Formato de Archivo:</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setExportFormat('png')}
                        className={`py-2 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                          exportFormat === 'png'
                            ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        PNG (Sin Pérdida / Nítido)
                      </button>
                      <button
                        onClick={() => setExportFormat('jpeg')}
                        className={`py-2 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                          exportFormat === 'jpeg'
                            ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        JPEG (Ligero)
                      </button>
                    </div>
                  </div>

                  {/* Download Action Buttons */}
                  <div className="pt-2 space-y-2">
                    <button
                      onClick={handleExportImage}
                      disabled={isExporting}
                      className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 text-xs transition-all cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>{isExporting ? 'Procesando Banner...' : 'Descargar Archivo en Alta Resolución'}</span>
                    </button>

                    <button
                      onClick={handleCopyToClipboard}
                      disabled={isExporting}
                      className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold rounded-xl flex items-center justify-center gap-2 border border-slate-700 text-xs transition-all cursor-pointer"
                    >
                      {copiedSuccess ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedSuccess ? '¡Copiado al Portapapeles!' : 'Copiar Imagen al Portapapeles'}</span>
                    </button>
                  </div>
                </div>

                {/* Social Tips */}
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-slate-400 text-[11px] space-y-1">
                  <span className="font-bold text-white block">💡 Consejos para transmisiones en vivo:</span>
                  <p>• <strong>¡GOL!:</strong> Cuando anoten durante tu stream, ve a la pestaña <strong>¡Gol!</strong>, selecciona al autor, y descarga o copia el banner en 15 segundos para tus stories.</p>
                  <p>• <strong>Alineación 11:</strong> Publica la formación antes del pitazo inicial en Facebook y TikTok para generar debate y comentarios.</p>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* MODALS */}
      <ClubPickerModal
        isOpen={isClubPickerOpen}
        onClose={() => setIsClubPickerOpen(false)}
        onSelectClub={handleSelectClub}
        onOpenClubInfo={openClubInfo}
      />

      <CompetitionPickerModal
        isOpen={isCompetitionModalOpen}
        onClose={() => setIsCompetitionModalOpen(false)}
        onSelectCompetition={handleSelectCompetition}
        currentCompetitionId={data.competitionId}
      />

      <ChannelSettingsModal
        isOpen={isChannelModalOpen}
        onClose={() => setIsChannelModalOpen(false)}
        branding={branding}
        onUpdateBranding={setBranding}
      />

      <ClubInfoModal
        isOpen={isClubInfoModalOpen}
        onClose={() => setIsClubInfoModalOpen(false)}
        club={selectedClubForInfo}
        onSelectPlayerForGoal={handleSelectPlayerForGoal}
        onApplySquadToLineup={handleApplySquadToLineup}
      />
    </div>
  );
}
