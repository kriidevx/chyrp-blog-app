import React, { useState } from 'react';
import { Calculator, Eye } from 'lucide-react';

interface MathJaxProps {
  value?: string;
  onChange?: (value: string) => void;
}

export default function MathJax({ value = "", onChange }: MathJaxProps) {
  const [isPreview, setIsPreview] = useState(false);

  const commonFormulas = [
    { label: "Fraction", latex: "\\frac{a}{b}" },
    { label: "Square Root", latex: "\\sqrt{x}" },
    { label: "Integral", latex: "\\int_{a}^{b} f(x) dx" },
    { label: "Sum", latex: "\\sum_{i=1}^{n} x_i" }
  ];

  const insertFormula = (latex: string) => {
    onChange?.(`${value} ${latex}`);
  };

  return (
    <div className="w-full rounded-lg border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-blue-600" />
          <h3 className="font-medium text-slate-900">Math Editor</h3>
        </div>
        
        <button
          onClick={() => setIsPreview(!isPreview)}
          className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm 
            transition-all duration-200 ${
              isPreview 
                ? 'bg-blue-100 text-blue-700' 
                : 'hover:bg-slate-100 text-slate-600'
            }`}
        >
          <Eye className="w-4 h-4" />
          {isPreview ? 'Edit' : 'Preview'}
        </button>
      </div>

      {/* Quick Insert */}
      <div className="p-3 border-b border-slate-100">
        <div className="flex flex-wrap gap-2">
          {commonFormulas.map((formula) => (
            <button
              key={formula.label}
              onClick={() => insertFormula(formula.latex)}
              className="px-3 py-1 text-xs rounded-full bg-slate-100 hover:bg-blue-100 
                text-slate-600 hover:text-blue-700 transition-all duration-200"
            >
              {formula.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {isPreview ? (
          <div className="min-h-[150px] p-4 bg-slate-50 rounded-lg">
            <p className="text-slate-500 italic text-center">
              Rendered equation would appear here
            </p>
            <div className="text-center mt-4 font-mono text-lg">
              E = mc²
            </div>
          </div>
        ) : (
          <textarea
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder="Enter LaTeX equations... e.g., E = mc^2 or \frac{a}{b}"
            className="w-full min-h-[150px] resize-none border-0 outline-none 
              text-slate-900 placeholder-slate-400 font-mono"
          />
        )}
      </div>
    </div>
  );
}