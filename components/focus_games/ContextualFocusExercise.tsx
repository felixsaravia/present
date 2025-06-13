
import React, { useState } from 'react';
import { generateContextualFocusExercise } from '../../services/geminiService';
import LoadingSpinner from '../LoadingSpinner';

const ContextualFocusExercise: React.FC = () => {
  const [description, setDescription] = useState<string>('');
  const [exerciseText, setExerciseText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateExercise = async () => {
    if (!description.trim()) {
      setError("Por favor, describe tu situación actual.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setExerciseText(null);
    try {
      const generatedExercise = await generateContextualFocusExercise(description);
      if (generatedExercise.startsWith("Error:") || generatedExercise.startsWith("No se pudo")) {
        setError(generatedExercise);
      } else {
        setExerciseText(generatedExercise);
      }
    } catch (err) {
      console.error("Error in ContextualFocusExercise:", err);
      setError("Ocurrió un error inesperado al generar el ejercicio.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setDescription('');
    setExerciseText(null);
    setError(null);
    setIsLoading(false);
  }

  return (
<<<<<<< HEAD
    <div className="p-4 sm:p-6 bg-white rounded-xl border border-slate-200 text-center max-w-lg mx-auto">
=======
    <div className="p-4 sm:p-6 bg-white rounded-xl shadow-xl text-center max-w-lg mx-auto">
>>>>>>> ace3b414d453679bcf2f1058b3efcd60946ebab4
      <h3 className="text-2xl font-semibold text-sky-700 mb-3">Enfoque Contextual</h3>
      <p className="text-slate-600 mb-6">
        Describe dónde estás o qué estás haciendo. Recibirás un ejercicio corto y simple para ayudarte a centrarte en el momento presente.
      </p>

      {!exerciseText && !isLoading && (
        <div className="space-y-4">
          <div>
            <label htmlFor="contextDescription" className="sr-only">Describe tu situación actual</label>
            <textarea
              id="contextDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
<<<<<<< HEAD
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-1 focus:ring-sky-500 focus:border-sky-500 transition-colors"
=======
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-shadow shadow-sm focus:shadow-md"
>>>>>>> ace3b414d453679bcf2f1058b3efcd60946ebab4
              placeholder="Ej: Estoy en mi escritorio, preparándome para una reunión importante..."
              aria-label="Describe tu situación actual"
            />
          </div>
          <button
            onClick={handleGenerateExercise}
            disabled={isLoading || !description.trim()}
<<<<<<< HEAD
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
=======
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-lg text-lg shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
>>>>>>> ace3b414d453679bcf2f1058b3efcd60946ebab4
          >
            {isLoading ? 'Generando...' : 'Generar Ejercicio'}
          </button>
        </div>
      )}

      {isLoading && <LoadingSpinner text="Creando tu ejercicio personalizado..." />}

      {error && !isLoading && (
        <div className="my-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
          <button
            onClick={handleReset}
            className="mt-3 bg-red-500 hover:bg-red-600 text-white font-semibold py-1.5 px-3 rounded-md text-sm"
          >
            Intentar de Nuevo
          </button>
        </div>
      )}

      {exerciseText && !isLoading && !error && (
        <div className="my-6 text-left">
           <h4 className="text-lg font-semibold text-sky-600 mb-3">Tu Ejercicio Personalizado:</h4>
          <div className="prose prose-slate max-w-none p-4 bg-sky-50 rounded-md border border-sky-200 whitespace-pre-line text-slate-700">
            {exerciseText}
          </div>
          <p className="text-sm text-slate-500 mt-4">
            <strong className="text-slate-600">Contexto proporcionado:</strong> "{description}"
          </p>
          <button
            onClick={handleReset}
<<<<<<< HEAD
            className="mt-6 w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-2.5 px-5 rounded-lg transition-colors"
=======
            className="mt-6 w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-2.5 px-5 rounded-lg shadow-md hover:shadow-lg transition-all"
>>>>>>> ace3b414d453679bcf2f1058b3efcd60946ebab4
          >
            Crear Otro Ejercicio
          </button>
        </div>
      )}
    </div>
  );
};

export default ContextualFocusExercise;
