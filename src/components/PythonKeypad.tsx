interface PythonKeypadProps {
  onInsertPythonSnippet: (snippet: string) => void;
}

export function PythonKeypad({ onInsertPythonSnippet }: PythonKeypadProps) {
  const pythonFunctions = [
    { label: 'xʸ', snippet: '**', title: 'Potência em Python (ex: 2**3)' },
    { label: 'x²', snippet: '**2', title: 'Elevar ao quadrado' },
    { label: '//', snippet: '//', title: 'Divisão Inteira Python (ex: 10 // 3 = 3)' },
    { label: '√x', snippet: 'sqrt(', title: 'Raiz quadrada: math.sqrt(x)' },
    { label: '(', snippet: '(', title: 'Abre parêntese' },
    { label: ')', snippet: ')', title: 'Fecha parêntese' },
    { label: 'π', snippet: 'pi', title: 'Constante Pi (math.pi = 3.1415...)' },
    { label: 'e', snippet: 'e', title: 'Constante de Euler (math.e = 2.718...)' },
    { label: 'sin', snippet: 'sin(', title: 'Seno: math.sin(rad)' },
    { label: 'cos', snippet: 'cos(', title: 'Cosseno: math.cos(rad)' },
    { label: 'log', snippet: 'log(', title: 'Logaritmo natural: math.log(x)' },
    { label: 'abs', snippet: 'abs(', title: 'Valor absoluto: abs(x)' },
  ];

  return (
    <div className="w-full bg-neutral-950/70 border border-neutral-800/80 rounded-xl p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-mono font-medium text-orange-400">
          Operadores e Funções Python
        </span>
        <span className="text-[11px] text-neutral-400 font-mono">import math</span>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 text-xs font-mono">
        {pythonFunctions.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => onInsertPythonSnippet(item.snippet)}
            title={item.title}
            className="py-2 px-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 hover:text-orange-400 active:scale-95 text-neutral-200 border border-neutral-800 transition-all font-semibold text-center"
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
