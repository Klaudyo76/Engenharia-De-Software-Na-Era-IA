export interface HistoryItem {
  id: string;
  expression: string;
  pythonExpression: string;
  result: string;
  timestamp: Date;
}

export type CalculatorMode = 'standard' | 'python' | 'terminal';

export type PythonLibrary = 'customtkinter' | 'tkinter';
