/**
 * Safe evaluator for Python mathematical expressions.
 * Supports +, -, *, /, %, // (floor division), ** (power), and standard math functions.
 */

export interface EvaluationResult {
  success: boolean;
  result?: string;
  error?: string;
  numericValue?: number;
}

export function sanitizeToPython(displayExpr: string): string {
  if (!displayExpr) return '';
  let expr = displayExpr;

  // Replace visual multiplication, division, and subtraction glyphs
  expr = expr.replace(/×/g, '*');
  expr = expr.replace(/÷/g, '/');
  expr = expr.replace(/−/g, '-');
  expr = expr.replace(/\^/g, '**');

  return expr;
}

export function sanitizeToDisplay(pythonExpr: string): string {
  if (!pythonExpr) return '';
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

  // 1. Sanitize visual symbols to Python equivalents
  let rawExpr = sanitizeToPython(input.trim());

  // Remove trailing operators like +, -, *, /, //, ** if user presses = prematurely
  rawExpr = rawExpr.replace(/\s*(\*\*|\/\/|[+\-*/%])+\s*$/, '');
  if (!rawExpr.trim()) {
    return { success: true, result: '0', numericValue: 0 };
  }

  // Support comma as decimal separator (e.g. 10,5 -> 10.5) when between numbers
  rawExpr = rawExpr.replace(/(\d+),(\d+)/g, '$1.$2');

  // 2. Validate allowed tokens
  // Strip allowed identifiers, operators, and characters to ensure nothing malicious is present
  const validationCheck = rawExpr
    .replace(/\bmath\.(sqrt|sin|cos|tan|pi|e|log|log10|pow|abs)\b/gi, '')
    .replace(/\b(sqrt|sin|cos|tan|pi|e|log|log10|pow|abs|round)\b/gi, '')
    .replace(/\*\*/g, '')
    .replace(/\/\//g, '')
    .replace(/[0-9+\-*/%().,\s_]/g, '');

  if (validationCheck.length > 0) {
    return {
      success: false,
      error: `SyntaxError: caractere '${validationCheck[0]}' não permitido`,
    };
  }

  // 3. Check for explicit division by zero before evaluation
  if (/\/\s*0(?![0-9.])/.test(rawExpr) || /\/\/\s*0(?![0-9.])/.test(rawExpr)) {
    return {
      success: false,
      error: 'ZeroDivisionError: divisão por zero',
    };
  }

  try {
    let jsCode = rawExpr;

    // Handle math functions
    jsCode = jsCode.replace(/\bmath\.sqrt\(/gi, 'Math.sqrt(');
    jsCode = jsCode.replace(/\bsqrt\(/gi, 'Math.sqrt(');
    jsCode = jsCode.replace(/\bmath\.sin\(/gi, 'Math.sin(');
    jsCode = jsCode.replace(/\bsin\(/gi, 'Math.sin(');
    jsCode = jsCode.replace(/\bmath\.cos\(/gi, 'Math.cos(');
    jsCode = jsCode.replace(/\bcos\(/gi, 'Math.cos(');
    jsCode = jsCode.replace(/\bmath\.tan\(/gi, 'Math.tan(');
    jsCode = jsCode.replace(/\btan\(/gi, 'Math.tan(');
    jsCode = jsCode.replace(/\bmath\.log10\(/gi, 'Math.log10(');
    jsCode = jsCode.replace(/\bmath\.log\(/gi, 'Math.log(');
    jsCode = jsCode.replace(/\babs\(/gi, 'Math.abs(');
    jsCode = jsCode.replace(/\bround\(/gi, 'Math.round(');

    // Handle constants
    jsCode = jsCode.replace(/\bmath\.pi\b/gi, 'Math.PI');
    jsCode = jsCode.replace(/\bpi\b/gi, 'Math.PI');
    jsCode = jsCode.replace(/\bmath\.e\b/gi, 'Math.E');
    jsCode = jsCode.replace(/\be\b(?![a-zA-Z0-9])/gi, 'Math.E');

    // Handle standalone percentage like "50%" -> "(50/100)"
    // but keep "%" when used as modulo between two expressions, e.g. "10 % 3"
    jsCode = jsCode.replace(/([0-9.]+)\s*%(?!\s*[0-9.(])/g, '($1 / 100)');

    // Handle Python floor division `//`:
    // Replace with Math.floor((a)/(b))
    let maxLoops = 10;
    while (jsCode.includes('//') && maxLoops > 0) {
      maxLoops--;
      const replaced = jsCode.replace(
        /((?:[0-9.]+|\([^()]+\)))\s*\/\/\s*((?:[0-9.]+|\([^()]+\)))/,
        'Math.floor(($1) / ($2))'
      );
      if (replaced === jsCode) {
        // Fallback if structure is complex
        jsCode = jsCode.replace(/\/\//g, '/');
        break;
      }
      jsCode = replaced;
    }

    // Auto-close open parentheses if any are missing
    const openParens = (jsCode.match(/\(/g) || []).length;
    const closeParens = (jsCode.match(/\)/g) || []).length;
    if (openParens > closeParens) {
      jsCode += ')'.repeat(openParens - closeParens);
    }

    // Safe execution sandbox
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    const evalFn = new Function('Math', `"use strict"; return (${jsCode});`);
    const val = evalFn(Math);

    if (val === undefined || val === null || Number.isNaN(val)) {
      return {
        success: false,
        error: 'Erro de Sintaxe: cálculo inválido',
      };
    }

    if (!Number.isFinite(val)) {
      return {
        success: false,
        error: 'ZeroDivisionError: divisão por zero',
      };
    }

    const num = Number(val);
    let formattedResult = '';
    if (Number.isInteger(num)) {
      formattedResult = num.toString();
    } else {
      // Clean float rounding artifacts (e.g. 0.1 + 0.2 = 0.3)
      const precisionCleaned = parseFloat(num.toFixed(10));
      formattedResult = precisionCleaned.toString();
    }

    return {
      success: true,
      result: formattedResult,
      numericValue: num,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'expressão incompleta';
    return {
      success: false,
      error: `SyntaxError: ${message}`,
    };
  }
}
