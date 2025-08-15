import React from 'react';

interface ReflectionViewerProps {
  situation: string;
  reflectionText: string;
  onClose: () => void;
}

const ReflectionViewer: React.FC<ReflectionViewerProps> = ({ situation, reflectionText, onClose }) => {
  return (
    <div className="p-4 sm:p-6 bg-white rounded-lg border border-slate-200 max-w-lg mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-sky-700">Reflexión del Ego</h2>
      </div>
      
      <div className="space-y-6">
        <div>
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Tu Situación</h3>
            <p className="text-slate-600 italic bg-slate-50 p-3 rounded-md border border-slate-200">"{situation}"</p>
        </div>
        <div>
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Una Perspectiva para Reflexionar</h3>
            <div className="prose prose-slate max-w-none whitespace-pre-line text-slate-700 leading-relaxed bg-sky-50 p-4 rounded-md border border-sky-200">
              {reflectionText}
            </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={onClose}
          className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2.5 px-8 rounded-lg transition-colors text-lg"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default ReflectionViewer;
