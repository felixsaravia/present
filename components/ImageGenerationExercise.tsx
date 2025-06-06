
import React, { useState, useEffect } from 'react';
import { generateMindfulnessImage } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';

interface ImageGenerationExerciseProps {
  prompt: string;
  onClose: () => void;
}

const ImageGenerationExercise: React.FC<ImageGenerationExerciseProps> = ({ prompt, onClose }) => {
  const [imageData, setImageData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateImage = async () => {
      setIsLoading(true);
      setError(null);
      setImageData(null);
      try {
        const base64Image = await generateMindfulnessImage(prompt);
        if (base64Image.startsWith("Error:") || base64Image.startsWith("No se pudo")) {
          setError(base64Image);
        } else {
          setImageData(base64Image);
        }
      } catch (err) {
        console.error("Image generation component error:", err);
        setError("Ocurrió un error inesperado al generar la imagen.");
      } finally {
        setIsLoading(false);
      }
    };

    if (prompt) {
      generateImage();
    } else {
      setError("No se proporcionó un prompt para la imagen.");
      setIsLoading(false);
    }
  }, [prompt]);

  return (
    <div className="p-4 sm:p-6 bg-white rounded-lg shadow-xl max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-sky-700 mb-4 text-center">Visualiza tu Momento</h2>
      
      {isLoading && <LoadingSpinner text="Generando tu imagen..." />}
      
      {error && !isLoading && (
        <div className="text-center p-4 bg-red-100 border border-red-400 text-red-700 rounded-md my-4">
          <p className="font-semibold">Error al generar la imagen</p>
          <p>{error}</p>
        </div>
      )}

      {imageData && !isLoading && !error && (
        <div className="my-4 flex justify-center">
          <img 
            src={`data:image/jpeg;base64,${imageData}`} 
            alt="Imagen generada basada en tu prompt" 
            className="rounded-lg shadow-md max-w-full h-auto max-h-[70vh] object-contain"
          />
        </div>
      )}
      
      <p className="text-sm text-slate-600 my-3 break-words"><strong className="text-slate-700">Idea original:</strong> "{prompt}"</p>

      <div className="mt-6 flex flex-col items-center space-y-3">
         {imageData && !isLoading && !error && (
             <p className="text-emerald-600 text-center">¡Aquí tienes tu imagen! Esperamos que te inspire.</p>
         )}
        <button
          onClick={onClose}
          className="w-full max-w-xs bg-sky-600 hover:bg-sky-700 text-white font-bold py-2.5 px-6 rounded-lg transition-colors text-lg"
        >
          {imageData || error ? 'Volver' : 'Cancelar'}
        </button>
      </div>
    </div>
  );
};

export default ImageGenerationExercise;