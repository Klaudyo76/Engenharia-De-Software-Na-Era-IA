import React from 'react';
import { Delete } from 'lucide-react';

interface KeypadProps {
  onDigit: (digit: string) => void;
  onOperator: (op: string) => void;
  onClear: () => void;
  onBackspace: () => void;
  onEquals: () => void;
  onToggleSign: () => void;
  onDecimal: () => void;
  onMemoryClear: () => void;
  onMemoryRecall: () => void;
  onMemoryAdd: () => void;
  onMemorySubtract: () => void;
  hasMemory: boolean;
}

export function Keypad({
  onDigit,
  onOperator,
  onClear,
  onBackspace,
  onEquals,
  onToggleSign,
  onDecimal,
  onMemoryClear,
  onMemoryRecall,
  onMemoryAdd,
  onMemorySubtract,
  hasMemory,
}: KeypadProps) {
  return (
    <div className="w-full flex flex-col gap-2.5">
      {/* Memory Function Row */}
      <div className="grid grid-cols-4 gap-2 text-xs font-mono">
        <button
          type="button"
          onClick={onMemoryClear}
          disabled={!hasMemory}
          className={`py-2 rounded-lg font-medium transition-all ${
            hasMemory
              ? 'bg-neutral-900 text-orange-400 hover:bg-neutral-800 active:scale-95 border border-orange-950/40'
              : 'bg-neutral-950/60 text-neutral-600 cursor-not-allowed border border-neutral-900'
          }`}
          title="Memory Clear (MC)"
        >
          MC
        </button>
        <button
          type="button"
          onClick={onMemoryRecall}
          disabled={!hasMemory}
          className={`py-2 rounded-lg font-medium transition-all ${
            hasMemory
              ? 'bg-neutral-900 text-orange-400 hover:bg-neutral-800 active:scale-95 border border-orange-950/40'
              : 'bg-neutral-950/60 text-neutral-600 cursor-not-allowed border border-neutral-900'
          }`}
          title="Memory Recall (MR)"
        >
          MR
        </button>
        <button
          type="button"
          onClick={onMemoryAdd}
          className="py-2 rounded-lg font-medium bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800 active:scale-95 border border-neutral-800/80 transition-all"
          title="Memory Add (M+)"
        >
          M+
        </button>
        <button
          type="button"
          onClick={onMemorySubtract}
          className="py-2 rounded-lg font-medium bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800 active:scale-95 border border-neutral-800/80 transition-all"
          title="Memory Subtract (M-)"
        >
          M-
        </button>
      </div>

      {/* Primary Keypad Grid */}
      <div className="grid grid-cols-4 gap-2.5 sm:gap-3 text-lg font-medium">
        {/* Row 1: Clear, Backspace, Modulo (%), Division (÷) */}
        <button
          type="button"
          onClick={onClear}
          className="h-14 sm:h-16 rounded-xl bg-neutral-800/90 hover:bg-neutral-700/90 text-white font-semibold transition-all active:scale-[0.96] flex items-center justify-center border border-neutral-700/50"
          title="Limpar tudo (Esc)"
        >
          C
        </button>
        <button
          type="button"
          onClick={onBackspace}
          className="h-14 sm:h-16 rounded-xl bg-neutral-800/90 hover:bg-neutral-700/90 text-white transition-all active:scale-[0.96] flex items-center justify-center border border-neutral-700/50"
          title="Apagar caractere (Backspace)"
        >
          <Delete className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => onOperator('%')}
          className="h-14 sm:h-16 rounded-xl bg-neutral-800/90 hover:bg-neutral-700/90 text-white font-semibold transition-all active:scale-[0.96] flex items-center justify-center border border-neutral-700/50"
          title="Módulo / Porcentagem (%)"
        >
          %
        </button>
        <button
          type="button"
          onClick={() => onOperator('÷')}
          className="h-14 sm:h-16 rounded-xl bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-bold text-xl transition-all active:scale-[0.96] flex items-center justify-center shadow-sm shadow-orange-600/30"
          title="Divisão (/)"
        >
          ÷
        </button>

        {/* Row 2: 7, 8, 9, Multiplication (×) */}
        <button
          type="button"
          onClick={() => onDigit('7')}
          className="h-14 sm:h-16 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xl transition-all active:scale-[0.96] flex items-center justify-center border border-neutral-800/80"
        >
          7
        </button>
        <button
          type="button"
          onClick={() => onDigit('8')}
          className="h-14 sm:h-16 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xl transition-all active:scale-[0.96] flex items-center justify-center border border-neutral-800/80"
        >
          8
        </button>
        <button
          type="button"
          onClick={() => onDigit('9')}
          className="h-14 sm:h-16 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xl transition-all active:scale-[0.96] flex items-center justify-center border border-neutral-800/80"
        >
          9
        </button>
        <button
          type="button"
          onClick={() => onOperator('×')}
          className="h-14 sm:h-16 rounded-xl bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-bold text-xl transition-all active:scale-[0.96] flex items-center justify-center shadow-sm shadow-orange-600/30"
          title="Multiplicação (*)"
        >
          ×
        </button>

        {/* Row 3: 4, 5, 6, Subtraction (-) */}
        <button
          type="button"
          onClick={() => onDigit('4')}
          className="h-14 sm:h-16 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xl transition-all active:scale-[0.96] flex items-center justify-center border border-neutral-800/80"
        >
          4
        </button>
        <button
          type="button"
          onClick={() => onDigit('5')}
          className="h-14 sm:h-16 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xl transition-all active:scale-[0.96] flex items-center justify-center border border-neutral-800/80"
        >
          5
        </button>
        <button
          type="button"
          onClick={() => onDigit('6')}
          className="h-14 sm:h-16 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xl transition-all active:scale-[0.96] flex items-center justify-center border border-neutral-800/80"
        >
          6
        </button>
        <button
          type="button"
          onClick={() => onOperator('-')}
          className="h-14 sm:h-16 rounded-xl bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-bold text-2xl transition-all active:scale-[0.96] flex items-center justify-center shadow-sm shadow-orange-600/30"
          title="Subtração (-)"
        >
          −
        </button>

        {/* Row 4: 1, 2, 3, Addition (+) */}
        <button
          type="button"
          onClick={() => onDigit('1')}
          className="h-14 sm:h-16 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xl transition-all active:scale-[0.96] flex items-center justify-center border border-neutral-800/80"
        >
          1
        </button>
        <button
          type="button"
          onClick={() => onDigit('2')}
          className="h-14 sm:h-16 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xl transition-all active:scale-[0.96] flex items-center justify-center border border-neutral-800/80"
        >
          2
        </button>
        <button
          type="button"
          onClick={() => onDigit('3')}
          className="h-14 sm:h-16 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xl transition-all active:scale-[0.96] flex items-center justify-center border border-neutral-800/80"
        >
          3
        </button>
        <button
          type="button"
          onClick={() => onOperator('+')}
          className="h-14 sm:h-16 rounded-xl bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-bold text-xl transition-all active:scale-[0.96] flex items-center justify-center shadow-sm shadow-orange-600/30"
          title="Adição (+)"
        >
          +
        </button>

        {/* Row 5: Invert sign (±), 0, Decimal point (.), Equals (=) */}
        <button
          type="button"
          onClick={onToggleSign}
          className="h-14 sm:h-16 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-lg transition-all active:scale-[0.96] flex items-center justify-center border border-neutral-800/80"
          title="Inverter sinal (+/-)"
        >
          ±
        </button>
        <button
          type="button"
          onClick={() => onDigit('0')}
          className="h-14 sm:h-16 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xl transition-all active:scale-[0.96] flex items-center justify-center border border-neutral-800/80"
        >
          0
        </button>
        <button
          type="button"
          onClick={onDecimal}
          className="h-14 sm:h-16 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xl transition-all active:scale-[0.96] flex items-center justify-center border border-neutral-800/80"
          title="Ponto decimal (.)"
        >
          .
        </button>
        <button
          type="button"
          onClick={onEquals}
          className="h-14 sm:h-16 rounded-xl bg-orange-500 hover:bg-orange-400 active:bg-orange-600 text-white font-bold text-2xl transition-all active:scale-[0.96] flex items-center justify-center shadow-lg shadow-orange-500/30 ring-1 ring-orange-400/40"
          title="Calcular resultado (Enter)"
        >
          =
        </button>
      </div>
    </div>
  );
}
