import { Trash2, RotateCcw, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { HistoryItem } from '../types/calculator';

interface HistoryPanelProps {
  history: HistoryItem[];
  onSelectResult: (result: string) => void;
  onClearHistory: () => void;
}

export function HistoryPanel({
  history,
  onSelectResult,
  onClearHistory,
}: HistoryPanelProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (item: HistoryItem) => {
    navigator.clipboard.writeText(`${item.pythonExpression} = ${item.result}`);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="w-full h-full flex flex-col bg-neutral-950 border border-neutral-800/90 rounded-2xl p-4 sm:p-5">
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-white tracking-tight">
            Histórico
          </span>
          <span className="text-xs text-neutral-400 font-mono">
            ({history.length})
          </span>
        </div>

        {history.length > 0 && (
          <button
            type="button"
            onClick={onClearHistory}
            className="text-xs text-neutral-400 hover:text-orange-400 flex items-center gap-1 transition-colors px-2 py-1 rounded hover:bg-neutral-900"
            title="Limpar histórico"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Limpar
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto mt-3 space-y-2.5 pr-1 max-h-[380px] lg:max-h-[460px]">
        {history.length === 0 ? (
          <div className="h-44 flex flex-col items-center justify-center text-center p-4">
            <span className="text-neutral-400 text-sm">
              Nenhum cálculo registrado ainda.
            </span>
            <span className="text-neutral-500 text-xs mt-1">
              Faça contas ou digite expressões para vê-las aqui.
            </span>
          </div>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              className="p-2.5 rounded-xl bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800/60 transition-all flex flex-col gap-1 group"
            >
              <div className="flex items-center justify-between text-xs text-neutral-400 font-mono">
                <span className="truncate max-w-[200px]" title={item.expression}>
                  {item.expression}
                </span>
                <span className="text-[10px] text-neutral-500">
                  {new Date(item.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </span>
              </div>

              <div className="flex items-center justify-between mt-0.5">
                <span className="font-mono text-base font-bold text-orange-400">
                  = {item.result}
                </span>

                <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => handleCopy(item)}
                    className="p-1.5 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                    title="Copiar cálculo"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-3.5 h-3.5 text-orange-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectResult(item.result)}
                    className="p-1.5 rounded text-neutral-400 hover:text-orange-400 hover:bg-neutral-800 transition-colors flex items-center gap-1 text-xs font-mono"
                    title="Usar este resultado na calculadora"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Usar
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
