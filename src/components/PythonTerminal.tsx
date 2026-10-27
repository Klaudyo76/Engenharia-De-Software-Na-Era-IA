import { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Play, Trash2, ArrowRight } from 'lucide-react';
import { evaluatePythonExpression } from '../utils/pythonEvaluator';

interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'error';
  content: string;
}

export function PythonTerminal() {
  const [input, setInput] = useState('');
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      id: 'init-1',
      type: 'output',
      content: 'Python 3.12 (Interactive Calculator Console)',
    },
    {
      id: 'init-2',
      type: 'output',
      content: 'Digite qualquer expressão matemática em Python (ex: 2**10, 100//7, math.sqrt(144))',
    },
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleRun = (cmd?: string) => {
    const commandToRun = (cmd !== undefined ? cmd : input).trim();
    if (!commandToRun) return;

    const inputId = `in-${Date.now()}`;
    const outputId = `out-${Date.now()}`;

    const evalResult = evaluatePythonExpression(commandToRun);

    const newLines: TerminalLine[] = [
      ...lines,
      { id: inputId, type: 'input', content: commandToRun },
    ];

    if (evalResult.success) {
      newLines.push({
        id: outputId,
        type: 'output',
        content: evalResult.result || 'None',
      });
    } else {
      newLines.push({
        id: outputId,
        type: 'error',
        content: evalResult.error || 'Erro de Execução',
      });
    }

    setLines(newLines);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleRun();
    }
  };

  const handleClear = () => {
    setLines([
      {
        id: `init-${Date.now()}`,
        type: 'output',
        content: 'Console reiniciado. Digite expressões matemáticas em Python.',
      },
    ]);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const examples = [
    '2 ** 10',
    '100 // 7',
    'math.sqrt(144) + 6',
    '15 * 8 - 4.5',
    'math.pi * (5 ** 2)',
    '10 % 3',
  ];

  return (
    <div className="w-full flex flex-col bg-neutral-950 border border-neutral-800/90 rounded-2xl overflow-hidden shadow-2xl">
      {/* Console Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-neutral-900 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-4 h-4 text-orange-500" />
          <span className="text-xs font-mono font-bold text-white tracking-wide">
            terminal_python.py
          </span>
        </div>

        <button
          type="button"
          onClick={handleClear}
          className="text-xs text-neutral-400 hover:text-orange-400 flex items-center gap-1 transition-colors px-2 py-1 rounded hover:bg-neutral-800"
          title="Limpar console"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Limpar
        </button>
      </div>

      {/* Suggested Quick Examples */}
      <div className="px-4 py-2 bg-neutral-900/50 border-b border-neutral-800/60 flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
        <span className="text-neutral-400 shrink-0 font-mono">Exemplos:</span>
        {examples.map((ex) => (
          <button
            key={ex}
            type="button"
            onClick={() => handleRun(ex)}
            className="px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-orange-400 hover:text-white font-mono whitespace-nowrap transition-colors shrink-0"
          >
            {ex}
          </button>
        ))}
      </div>

      {/* Terminal Output Area */}
      <div className="p-4 sm:p-5 font-mono text-sm space-y-2 min-h-[300px] max-h-[440px] overflow-y-auto">
        {lines.map((line) => {
          if (line.type === 'input') {
            return (
              <div key={line.id} className="flex items-start gap-2 text-white">
                <span className="text-orange-500 select-none font-bold">{'>>>'}</span>
                <span className="text-neutral-100">{line.content}</span>
              </div>
            );
          }
          if (line.type === 'error') {
            return (
              <div key={line.id} className="pl-6 text-red-400 select-text">
                {line.content}
              </div>
            );
          }
          return (
            <div key={line.id} className="pl-6 text-orange-300 font-semibold select-text">
              {line.content}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input Prompt */}
      <div className="p-3 bg-neutral-900/80 border-t border-neutral-800 flex items-center gap-2">
        <span className="text-orange-500 font-mono font-bold select-none pl-2">{'>>>'}</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Digite ex: 2 ** 8 ou 50 * 3.5..."
          className="flex-1 bg-transparent border-0 text-white font-mono text-sm focus:outline-none focus:ring-0 placeholder:text-neutral-400"
        />
        <button
          type="button"
          onClick={() => handleRun()}
          className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-medium text-xs flex items-center gap-1 transition-colors"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          Executar
        </button>
      </div>
    </div>
  );
}
