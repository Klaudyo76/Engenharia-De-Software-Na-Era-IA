/**
 * Safe evaluator for Python-like mathematical expressions.
 * Supports +, -, *, /, %, // (floor div), ** (power), and standard math functions.
 */

export interface EvaluationResult {
  success: boolean;
  result?: string;
  error?: string;
  numericValue?: number;
}

export function sanitizeToPython(displayExpr: string): string {
  let expr = displayExpr;

  // Replace visual multiplication and division symbols
  expr = expr.replace(/×/g, '*');
  expr = expr.replace(/÷/g, '/');
  expr = expr.replace(/−/g, '-');

  return expr;
}

export function sanitizeToDisplay(pythonExpr: string): string {
  let expr = pythonExpr;
  expr = expr.replace(/\*\*/g, '^');
  expr = expr.replace(/\*/g, '×');
  expr = expr.replace(/\/\//g, ' // ');
  expr = expr.replace(/\//g, '÷');
  return expr;
}

export function evaluatePythonExpression(input: string): EvaluationResult {
  if (!input || input.trim() === '') {
    return { success: true, result: '0', numericValue: 0 };
  }

  const rawExpr = sanitizeToPython(input.trim());

  // Check for division by zero before evaluation
  if (/\/\s*0(?![0-9.])/.test(rawExpr) || /\/\/\s*0(?![0-9.])/.test(rawExpr)) {
    return {
      success: false,
      error: 'ZeroDivisionError: divisão por zero',
    };
  }

  // Safe token validation: only allow numbers, math identifiers, and standard operators
  const safeTokensRegex = /^[0-9+\-*/%().,\s_]|(\*\*)|(\/\/)|(math\.(sqrt|sin|cos|tan|pi|e|log|log10|pow|abs))|(sqrt|sin|cos|tan|pi|e|log|abs|round)/g;
  
  const stripped = rawExpr.replace(safeTokensRegex, '');
  if (stripped.length > 0) {
    return {
      success: false,
      error: `SyntaxError: símbolo ou comando não reconhecido '${stripped[0]}'`,
    };
  }

  try {
    let jsCode = rawExpr;

    // Handle math functions
    jsCode = jsCode.replace(/\bmath\.sqrt\(/g, 'Math.sqrt(');
    jsCode = jsCode.replace(/\bsqrt\(/g, 'Math.sqrt(');
    jsCode = jsCode.replace(/\bmath\.sin\(/g, 'Math.sin(');
    jsCode = jsCode.replace(/\bsin\(/g, 'Math.sin(');
    jsCode = jsCode.replace(/\bmath\.cos\(/g, 'Math.cos(');
    jsCode = jsCode.replace(/\bcos\(/g, 'Math.cos(');
    jsCode = jsCode.replace(/\bmath\.tan\(/g, 'Math.tan(');
    jsCode = jsCode.replace(/\btan\(/g, 'Math.tan(');
    jsCode = jsCode.replace(/\bmath\.log10\(/g, 'Math.log10(');
    jsCode = jsCode.replace(/\bmath\.log\(/g, 'Math.log(');
    jsCode = jsCode.replace(/\babs\(/g, 'Math.abs(');
    jsCode = jsCode.replace(/\bround\(/g, 'Math.round(');

    // Handle constants
    jsCode = jsCode.replace(/\bmath\.pi\b/g, 'Math.PI');
    jsCode = jsCode.replace(/\bpi\b/g, 'Math.PI');
    jsCode = jsCode.replace(/\bmath\.e\b/g, 'Math.E');
    jsCode = jsCode.replace(/\be\b(?![a-zA-Z0-9])/g, 'Math.E');

    // Handle Python floor division `//`
    while (jsCode.includes('//')) {
      const match = jsCode.match(/([0-9.]+|\([^()]+\))\s*\/\/\s*([0-9.]+|\([^()]+\))/);
      if (match) {
        const full = match[0];
        const left = match[1];
        const right = match[2];
        jsCode = jsCode.replace(full, `Math.floor((${left}) / (${right}))`);
      } else {
        break;
      }
    }

    // Evaluate safely
    const evalFn = new Function('Math', `"use strict"; return (${jsCode});`);
    const val = evalFn(Math);

    if (val === undefined || val === null || Number.isNaN(val)) {
      return {
        success: false,
        error: 'Erro: resultado indefinido (NaN)',
      };
    }

    if (!Number.isFinite(val)) {
      return {
        success: false,
        error: 'OverflowError: valor infinito',
      };
    }

    const num = Number(val);
    let formattedResult = '';
    if (Number.isInteger(num)) {
      formattedResult = num.toString();
    } else {
      const precisionCleaned = parseFloat(num.toFixed(10));
      formattedResult = precisionCleaned.toString();
    }

    return {
      success: true,
      result: formattedResult,
      numericValue: num,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro na expressão';
    return {
      success: false,
      error: `SyntaxError: ${message}`,
    };
  }
}
