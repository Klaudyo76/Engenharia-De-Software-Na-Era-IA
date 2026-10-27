import { Calculator, Terminal, Code2, Download, Volume2, VolumeX } from 'lucide-react';
import { CalculatorMode } from '../types/calculator';

interface HeaderProps {
  currentMode: CalculatorMode;
  onSelectMode: (mode: CalculatorMode) => void;
  onOpenCode: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export function Header({
  currentMode,
  onSelectMode,
  onOpenCode,
  soundEnabled,
  onToggleSound,
}: HeaderProps) {
  return (
    <header className="w-full border-b border-neutral-800/80 bg-black/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white font-bold text-base shadow-sm shadow-orange-500/20">
            Py
          </div>
          <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
            Calculadora <span className="text-orange-500">Python</span>
          </span>
        </div>

        {/* Zone 2: Navigation Links (Single line, text with active underlines/states) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button
            type="button"
            onClick={() => onSelectMode('standard')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentMode === 'standard'
                ? 'text-orange-500 font-semibold border-b-2 border-orange-500'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Padrão
          </button>

          <button
            type="button"
            onClick={() => onSelectMode('python')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentMode === 'python'
                ? 'text-orange-500 font-semibold border-b-2 border-orange-500'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Funções Python (Científica)
          </button>

          <button
            type="button"
            onClick={() => onSelectMode('terminal')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentMode === 'terminal'
                ? 'text-orange-500 font-semibold border-b-2 border-orange-500'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Console Interativo
          </button>

          <button
            type="button"
            onClick={onOpenCode}
            className="whitespace-nowrap shrink-0 transition-colors py-1 text-neutral-400 hover:text-white flex items-center gap-1.5"
          >
            <Code2 className="w-4 h-4 text-orange-400" />
            Código .py
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action + Audio Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onToggleSound}
            title={soundEnabled ? 'Silenciar cliques' : 'Ativar som dos cliques'}
            className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 border border-transparent hover:border-neutral-800 transition-colors"
            aria-label={soundEnabled ? 'Desativar som' : 'Ativar som'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-orange-400" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={onOpenCode}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-500 active:bg-orange-700 rounded-lg transition-colors shadow-sm flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            Baixar .py
          </button>
        </div>
      </div>
    </header>
  );
}
