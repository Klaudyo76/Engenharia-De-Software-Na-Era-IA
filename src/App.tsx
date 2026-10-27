import { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { CalculatorDisplay } from './components/CalculatorDisplay';
import { Keypad } from './components/Keypad';
import { PythonKeypad } from './components/PythonKeypad';
import { HistoryPanel } from './components/HistoryPanel';
import { PythonTerminal } from './components/PythonTerminal';
import { PythonCodeModal } from './components/PythonCodeModal';
import { CalculatorMode, HistoryItem } from './types/calculator';
import {
  evaluatePythonExpression,
  sanitizeToPython,
} from './utils/pythonEvaluator';
import { playKeyClick } from './utils/audio';
import { Code2, Terminal, Sparkles, BookOpen, Download } from 'lucide-react';

export default function App() {
  const [expression, setExpression] = useState<string>('');
  const [result, setResult] = useState<string>('0');
  const [isCalculated, setIsCalculated] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [memory, setMemory] = useState<number>(0);
  const [mode, setMode] = useState<CalculatorMode>('standard');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState<boolean>(false);
  const [customInput, setCustomInput] = useState<string>('');

  // History state with localStorage fallback
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('calc_py_history');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return [
      {
        id: 'sample-1',
        expression: '128 × 4 + 16',
        pythonExpression: '128 * 4 + 16',
        result: '528',
        timestamp: new Date(),
      },
      {
        id: 'sample-2',
        expression: '2 ** 8',
        pythonExpression: '2 ** 8',
        result: '256',
        timestamp: new Date(),
      },
    ];
  });

  const saveHistory = useCallback((newHistory: HistoryItem[]) => {
    setHistory(newHistory);
    try {
      localStorage.setItem('calc_py_history', JSON.stringify(newHistory));
    } catch {
      // ignore
    }
  }, []);

  const triggerSound = useCallback(
    (type: 'number' | 'operator' | 'action' | 'equals' = 'number') => {
      if (soundEnabled) {
        playKeyClick(type);
      }
    },
    [soundEnabled]
  );

  // Clear display
  const handleClear = useCallback(() => {
    triggerSound('action');
    setExpression('');
    setResult('0');
    setError(undefined);
    setIsCalculated(false);
  }, [triggerSound]);

  // Backspace
  const handleBackspace = useCallback(() => {
    triggerSound('action');
    setError(undefined);

    if (isCalculated) {
      setExpression('');
      setResult('0');
      setIsCalculated(false);
      return;
    }

    if (expression.length > 0) {
      const updated = expression.slice(0, -1);
      setExpression(updated);
      setResult(updated || '0');
    }
  }, [expression, isCalculated, triggerSound]);

  // Handle number digit
  const handleDigit = useCallback(
    (digit: string) => {
      triggerSound('number');
      setError(undefined);

      if (isCalculated) {
        setExpression(digit);
        setResult(digit);
        setIsCalculated(false);
        return;
      }

      if (expression === '0') {
        setExpression(digit);
        setResult(digit);
      } else {
        const next = expression + digit;
        setExpression(next);
        setResult(next);
      }
    },
    [expression, isCalculated, triggerSound]
  );

  // Handle operators (+, -, ×, ÷, %, etc.)
  const handleOperator = useCallback(
    (op: string) => {
      triggerSound('operator');
      setError(undefined);

      if (isCalculated) {
        setIsCalculated(false);
        const next = result + ' ' + op + ' ';
        setExpression(next);
        return;
      }

      if (!expression) {
        if (op === '-') {
          setExpression('-');
          setResult('-');
        }
        return;
      }

      // Check if last token is an operator, replace it if so
      const trimmed = expression.trim();
      const lastChar = trimmed[trimmed.length - 1];

      if (['+', '-', '×', '÷', '%'].includes(lastChar)) {
        setExpression(trimmed.slice(0, -1) + op + ' ');
      } else {
        setExpression(expression + ' ' + op + ' ');
      }
    },
    [expression, isCalculated, result, triggerSound]
  );

  // Decimal point
  const handleDecimal = useCallback(() => {
    triggerSound('number');
    setError(undefined);

    if (isCalculated) {
      setExpression('0.');
      setResult('0.');
      setIsCalculated(false);
      return;
    }

    // Split by operators to see if last operand already has decimal
    const parts = expression.split(/[\s+\-×÷%]+/);
    const lastPart = parts[parts.length - 1];

    if (!lastPart.includes('.')) {
      if (!expression || expression.endsWith(' ')) {
        setExpression(expression + '0.');
        setResult(expression + '0.');
      } else {
        setExpression(expression + '.');
        setResult(expression + '.');
      }
    }
  }, [expression, isCalculated, triggerSound]);

  // Invert sign (±)
  const handleToggleSign = useCallback(() => {
    triggerSound('action');
    setError(undefined);

    if (result && result !== '0') {
      try {
        const currentVal = Number(result);
        if (!Number.isNaN(currentVal)) {
          const inverted = (-currentVal).toString();
          setResult(inverted);
          setExpression(inverted);
          setIsCalculated(true);
        }
      } catch {
        // ignore
      }
    }
  }, [result, triggerSound]);

  // Insert Python snippet (e.g. `**`, `//`, `sqrt(`, `pi`)
  const handleInsertPythonSnippet = useCallback(
    (snippet: string) => {
      triggerSound('operator');
      setError(undefined);

      if (isCalculated) {
        setIsCalculated(false);
        if (snippet === '**' || snippet === '**2' || snippet === '//') {
          setExpression(result + snippet);
          setResult(result + snippet);
        } else {
          setExpression(snippet);
          setResult(snippet);
        }
        return;
      }

      const next = expression + snippet;
      setExpression(next);
      setResult(next);
    },
    [expression, isCalculated, result, triggerSound]
  );

  // Calculate (=)
  const handleCalculate = useCallback(() => {
    triggerSound('equals');
    const toEval = expression.trim();
    if (!toEval) return;

    const res = evaluatePythonExpression(toEval);

    if (res.success && res.result !== undefined) {
      const output = res.result;
      setResult(output);
      setIsCalculated(true);
      setError(undefined);

      // Add to history
      const newItem: HistoryItem = {
        id: `hist-${Date.now()}`,
        expression: toEval,
        pythonExpression: sanitizeToPython(toEval),
        result: output,
        timestamp: new Date(),
      };
      saveHistory([newItem, ...history.slice(0, 49)]);
    } else {
      setError(res.error || 'Erro na expressão');
      setIsCalculated(true);
    }
  }, [expression, history, saveHistory, triggerSound]);

  // Memory Handlers
  const handleMemoryClear = useCallback(() => {
    triggerSound('action');
    setMemory(0);
  }, [triggerSound]);

  const handleMemoryRecall = useCallback(() => {
    triggerSound('action');
    if (memory !== 0) {
      const memStr = memory.toString();
      if (isCalculated) {
        setExpression(memStr);
        setResult(memStr);
        setIsCalculated(false);
      } else {
        setExpression(expression + memStr);
        setResult(expression + memStr);
      }
    }
  }, [expression, isCalculated, memory, triggerSound]);

  const handleMemoryAdd = useCallback(() => {
    triggerSound('action');
    const val = Number(result);
    if (!Number.isNaN(val)) {
      setMemory((prev) => prev + val);
    }
  }, [result, triggerSound]);

  const handleMemorySubtract = useCallback(() => {
    triggerSound('action');
    const val = Number(result);
    if (!Number.isNaN(val)) {
      setMemory((prev) => prev - val);
    }
  }, [result, triggerSound]);

  // Custom expression submit
  const handleCustomInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    setExpression(customInput);
    const res = evaluatePythonExpression(customInput);
    if (res.success && res.result !== undefined) {
      setResult(res.result);
      setError(undefined);
      setIsCalculated(true);

      const newItem: HistoryItem = {
        id: `hist-${Date.now()}`,
        expression: customInput,
        pythonExpression: sanitizeToPython(customInput),
        result: res.result,
        timestamp: new Date(),
      };
      saveHistory([newItem, ...history.slice(0, 49)]);
      setCustomInput('');
    } else {
      setError(res.error || 'Erro');
      setIsCalculated(true);
    }
  };

  // Keyboard shortcut support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing inside an input
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      if (e.key >= '0' && e.key <= '9') {
        handleDigit(e.key);
      } else if (e.key === '.' || e.key === ',') {
        handleDecimal();
      } else if (e.key === '+') {
        handleOperator('+');
      } else if (e.key === '-') {
        handleOperator('-');
      } else if (e.key === '*') {
        handleOperator('×');
      } else if (e.key === '/') {
        e.preventDefault();
        handleOperator('÷');
      } else if (e.key === '%') {
        handleOperator('%');
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleCalculate();
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    handleDigit,
    handleDecimal,
    handleOperator,
    handleCalculate,
    handleBackspace,
    handleClear,
  ]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* Header complying with Top Bar Contract */}
      <Header
        currentMode={mode}
        onSelectMode={setMode}
        onOpenCode={() => setIsCodeModalOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Contextual Mode Tabs (Mobile / Quick Switcher) */}
        <div className="flex md:hidden items-center justify-between gap-2 mb-4 p-1 bg-neutral-900 rounded-xl border border-neutral-800 text-xs">
          <button
            type="button"
            onClick={() => setMode('standard')}
            className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
              mode === 'standard'
                ? 'bg-orange-600 text-white font-semibold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Padrão
          </button>
          <button
            type="button"
            onClick={() => setMode('python')}
            className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
              mode === 'python'
                ? 'bg-orange-600 text-white font-semibold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Científica
          </button>
          <button
            type="button"
            onClick={() => setMode('terminal')}
            className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
              mode === 'terminal'
                ? 'bg-orange-600 text-white font-semibold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Console
          </button>
        </div>

        {/* Dynamic View based on Mode */}
        {mode === 'terminal' ? (
          <div className="max-w-3xl mx-auto">
            <PythonTerminal />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left/Center Column: Calculator Hardware housing (Laranja, Preto e Branco) */}
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col items-center">
              <div className="w-full max-w-[420px] bg-neutral-950 border border-neutral-800/90 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col gap-4 relative overflow-hidden">
                {/* Subtle orange accent glow at top */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-orange-500/80 rounded-b-full blur-[1px]" />

                {/* Calculator Brand Badge in Casing */}
                <div className="flex items-center justify-between text-xs text-neutral-400 px-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold tracking-wider text-white">PYTHON</span>
                    <span className="text-[10px] text-orange-400 font-mono">v3.12</span>
                  </div>
                  <span className="text-[11px] text-neutral-400 font-mono">
                    {mode === 'python' ? 'MODO CIENTÍFICO' : 'PADRÃO'}
                  </span>
                </div>

                {/* OLED Display */}
                <CalculatorDisplay
                  expression={expression}
                  result={result}
                  error={error}
                  hasMemory={memory !== 0}
                  onClear={handleClear}
                />

                {/* Direct Python Expression Quick Input */}
                <form
                  onSubmit={handleCustomInputSubmit}
                  className="w-full flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1.5"
                >
                  <span className="text-orange-500 font-mono text-xs font-bold">
                    {'py>'}
                  </span>
                  <input
                    type="text"
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder="Digite expressão direta (ex: 2**8 + 15)..."
                    className="flex-1 bg-transparent border-0 text-white font-mono text-xs focus:outline-none placeholder:text-neutral-500"
                  />
                  <button
                    type="submit"
                    className="text-xs font-mono px-2 py-0.5 rounded bg-orange-600 hover:bg-orange-500 text-white font-semibold transition-colors"
                  >
                    =
                  </button>
                </form>

                {/* Python Extended Functions (when in python mode) */}
                {mode === 'python' && (
                  <PythonKeypad onInsertPythonSnippet={handleInsertPythonSnippet} />
                )}

                {/* Tactile Keypad */}
                <Keypad
                  onDigit={handleDigit}
                  onOperator={handleOperator}
                  onClear={handleClear}
                  onBackspace={handleBackspace}
                  onEquals={handleCalculate}
                  onToggleSign={handleToggleSign}
                  onDecimal={handleDecimal}
                  onMemoryClear={handleMemoryClear}
                  onMemoryRecall={handleMemoryRecall}
                  onMemoryAdd={handleMemoryAdd}
                  onMemorySubtract={handleMemorySubtract}
                  hasMemory={memory !== 0}
                />
              </div>

              {/* Keyboard Shortcuts Hint */}
              <div className="mt-4 text-xs text-neutral-400 flex items-center gap-3 font-mono">
                <span>Atalhos: [0-9] Números</span>
                <span>·</span>
                <span>[+, -, *, /] Operadores</span>
                <span>·</span>
                <span>[Enter] =</span>
                <span>·</span>
                <span>[Esc] Limpar</span>
              </div>
            </div>

            {/* Right Column: Calculation History & Python Code Quick Card */}
            <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-5">
              {/* History Panel */}
              <HistoryPanel
                history={history}
                onSelectResult={(val) => {
                  triggerSound('action');
                  setExpression(val);
                  setResult(val);
                  setIsCalculated(true);
                }}
                onClearHistory={() => saveHistory([])}
              />

              {/* Python Desktop Code Quick Banner */}
              <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <div className="w-6 h-6 rounded bg-orange-600 flex items-center justify-center text-white text-xs font-mono">
                    py
                  </div>
                  <span>Código Python Desktop Disponível</span>
                </div>

                <p className="text-xs text-neutral-400 leading-relaxed">
                  Criamos o código completo em Python com as bibliotecas{' '}
                  <strong className="text-white">CustomTkinter</strong> e{' '}
                  <strong className="text-white">Tkinter</strong>, nas mesmas cores
                  laranja (#FF6B00), preto e branco, pronto para rodar no seu computador.
                </p>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsCodeModalOpen(true)}
                    className="flex-1 py-2 px-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    Ver Código Fonte Python
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Educational Info Section */}
        <section className="mt-12 pt-8 border-t border-neutral-800/80 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-neutral-950/60 border border-neutral-800/60 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2 text-orange-400 font-mono text-sm font-semibold">
              <Terminal className="w-4 h-4" />
              Operadores Python
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Diferente de calculadoras comuns, aceita operadores nativos como{' '}
              <code className="text-orange-300 font-mono">**</code> para potência,{' '}
              <code className="text-orange-300 font-mono">//</code> para divisão inteira e{' '}
              <code className="text-orange-300 font-mono">%</code> para módulo.
            </p>
          </div>

          <div className="bg-neutral-950/60 border border-neutral-800/60 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2 text-orange-400 font-mono text-sm font-semibold">
              <Sparkles className="w-4 h-4" />
              Paleta Laranja, Preto e Branco
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Design moderno focado em ergonomia visual: Preto (#0D0D0D) para
              descanso ocular, Laranja vibrante (#FF6B00) nos operadores principais e
              Branco puro (#FFFFFF) para alta legibilidade.
            </p>
          </div>

          <div className="bg-neutral-950/60 border border-neutral-800/60 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2 text-orange-400 font-mono text-sm font-semibold">
              <BookOpen className="w-4 h-4" />
              Como Rodar no seu PC
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Clique em <strong>"Código .py"</strong> no topo, copie o arquivo e execute com{' '}
              <code className="text-neutral-300 font-mono">python calculadora.py</code>.
              Compatível com Windows, macOS e Linux.
            </p>
          </div>
        </section>
      </main>

      {/* Python Code Viewer / Download Modal */}
      <PythonCodeModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
      />
    </div>
  );
}
