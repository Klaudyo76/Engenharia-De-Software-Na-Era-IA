import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { sanitizeToPython } from '../utils/pythonEvaluator';

interface CalculatorDisplayProps {
  expression: string;
  result: string;
  error?: string;
  hasMemory: boolean;
  onClear: () => void;
}

export function CalculatorDisplay({
  expression,
  result,
  error,
  hasMemory,
}: CalculatorDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = error ? expression : result || '0';
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const pythonPreview = sanitizeToPython(expression);

  // Dynamic font size depending on result string length
  const getResultFontSize = (len: number) => {
    if (len > 16) return 'text-2xl sm:text-3xl';
    if (len > 12) return 'text-3xl sm:text-4xl';
    if (len > 8) return 'text-4xl sm:text-5xl';
    return 'text-5xl sm:text-6xl';
  };

  return (
    <div className="relative w-full rounded-2xl bg-neutral-950 border border-neutral-800/90 p-5 sm:p-6 shadow-inner flex flex-col justify-between min-h-[148px]">
      {/* Top Metadata Row: Memory flag + Python Expression preview + Copy button */}
      <div className="flex items-center justify-between text-xs text-neutral-400 mb-2 gap-2">
        <div className="flex items-center gap-2">
          {hasMemory && (
            <span className="font-mono font-semibold text-orange-400 bg-orange-950/60 border border-orange-800/50 px-1.5 py-0.5 rounded text-[10px]">
              M
            </span>
          )}
          {pythonPreview && (
            <span className="font-mono text-neutral-400 truncate max-w-[200px] sm:max-w-[280px]" title={`Python: ${pythonPreview}`}>
              py: <span className="text-neutral-300">{pythonPreview}</span>
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="text-neutral-400 hover:text-white transition-colors p-1 rounded hover:bg-neutral-800 flex items-center gap-1 shrink-0"
          title="Copiar resultado"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-orange-400" />
              <span className="text-[11px] text-orange-400">Copiado</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span className="text-[11px] hidden sm:inline">Copiar</span>
            </>
          )}
        </button>
      </div>

      {/* Expression Line */}
      <div className="w-full text-right font-mono text-sm sm:text-base text-neutral-400 tracking-wide overflow-x-auto whitespace-nowrap scrollbar-none min-h-[22px]">
        {expression || ' '}
      </div>

      {/* Main Display: Current number or evaluated result or error */}
      <div className="w-full text-right mt-1">
        {error ? (
          <div className="text-right text-orange-400 font-mono text-base sm:text-lg font-medium truncate">
            {error}
          </div>
        ) : (
          <div
            className={`font-mono tabular-nums font-bold text-white tracking-tight leading-none overflow-x-auto whitespace-nowrap scrollbar-none ${getResultFontSize(
              (result || '0').length
            )}`}
          >
            {result || '0'}
          </div>
        )}
      </div>
    </div>
  );
}
