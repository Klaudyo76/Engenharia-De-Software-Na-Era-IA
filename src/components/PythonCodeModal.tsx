import { useState } from 'react';
import { X, Copy, Check, Download, Terminal } from 'lucide-react';
import { CUSTOMTKINTER_CODE, TKINTER_STANDARD_CODE } from '../data/pythonSourceCode';
import { PythonLibrary } from '../types/calculator';

interface PythonCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PythonCodeModal({ isOpen, onClose }: PythonCodeModalProps) {
  const [selectedLib, setSelectedLib] = useState<PythonLibrary>('customtkinter');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentCode =
    selectedLib === 'customtkinter' ? CUSTOMTKINTER_CODE : TKINTER_STANDARD_CODE;
  const fileName =
    selectedLib === 'customtkinter'
      ? 'calculadora_moderna.py'
      : 'calculadora_padrao.py';

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([currentCode], { type: 'text/x-python;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-4xl bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-900/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              Py
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Código Fonte em Python (.py)
              </h2>
              <p className="text-xs text-neutral-400">
                Visual moderno com as cores Laranja, Preto e Branco
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Library Selector Tabs & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-3 border-b border-neutral-800 bg-neutral-950">
          {/* Segmented Control */}
          <div className="flex items-center gap-1.5 p-1 bg-neutral-900 rounded-xl border border-neutral-800 text-xs font-medium">
            <button
              type="button"
              onClick={() => setSelectedLib('customtkinter')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedLib === 'customtkinter'
                  ? 'bg-orange-600 text-white font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              CustomTkinter (Mais Moderno)
            </button>
            <button
              type="button"
              onClick={() => setSelectedLib('tkinter')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedLib === 'tkinter'
                  ? 'bg-orange-600 text-white font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Tkinter Nativo (Sem Instalação)
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="px-3.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-white border border-neutral-800 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-orange-400" />
                  <span className="text-orange-400 font-semibold">Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Código</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="px-3.5 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar {fileName}</span>
            </button>
          </div>
        </div>

        {/* Quick Instructions Banner */}
        <div className="px-6 py-2.5 bg-neutral-900/40 border-b border-neutral-800/80 text-xs text-neutral-300 flex items-center gap-3">
          <Terminal className="w-4 h-4 text-orange-400 shrink-0" />
          <div className="flex-1 font-mono text-[11px] truncate">
            {selectedLib === 'customtkinter' ? (
              <span>
                1. <span className="text-orange-400">pip install customtkinter</span>{' '}
                &nbsp;|&nbsp; 2.{' '}
                <span className="text-white">python calculadora_moderna.py</span>
              </span>
            ) : (
              <span>
                Execução direta sem instalar nada:{' '}
                <span className="text-orange-400">python calculadora.py</span>
              </span>
            )}
          </div>
        </div>

        {/* Code Content View */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 bg-black/60 font-mono text-xs text-neutral-300 leading-relaxed selection:bg-orange-500 selection:text-white">
          <pre className="whitespace-pre overflow-x-auto">{currentCode}</pre>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-neutral-800 bg-neutral-900/60 flex items-center justify-between text-xs text-neutral-400">
          <span>Paleta: Laranja (#FF6B00), Preto (#0D0D0D) e Branco (#FFFFFF)</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-medium transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
