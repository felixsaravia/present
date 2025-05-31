
import React, { useState, useEffect } from 'react';
import useTimer from '../hooks/useTimer';
import { MindfulnessExercise, ExerciseFocus } from '../types';
import { generateMindfulnessExercise } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';

interface ExercisePlayerProps {
  focus: ExerciseFocus;
  durationMinutes: number;
  onClose: () => void;
}

const ExercisePlayer: React.FC<ExercisePlayerProps> = ({ focus, durationMinutes, onClose }) => {
  const [exercise, setExercise] = useState<MindfulnessExercise | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { timeLeft, isRunning, isFinished, start, pause, resume, reset } = useTimer();

  useEffect(() => {
    const fetchExercise = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const instructions = await generateMindfulnessExercise(focus, durationMinutes);
        if (instructions.startsWith("Error:") || instructions.startsWith("No se pudo")) {
          setError(instructions);
          setExercise(null);
        } else {
          setExercise({
            id: `ex-${Date.now()}`,
            title: `Ejercicio de ${focus}`,
            durationMinutes,
            focus,
            instructions,
          });
        }
      } catch (err) {
        setError("Error al cargar el ejercicio.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchExercise();
  }, [focus, durationMinutes]);

  useEffect(() => {
    if (exercise && !isFinished) {
      start(exercise.durationMinutes * 60);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise]); // isFinished removed to prevent restart on finish if exercise details change (not expected here)


  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  if (isLoading) {
    return <LoadingSpinner text="Preparando tu ejercicio..." />;
  }

  if (error) {
    return (
      <div className="text-center p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
        <p className="font-semibold">Error</p>
        <p>{error}</p>
        <button
          onClick={onClose}
          className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Cerrar
        </button>
      </div>
    );
  }

  if (!exercise) {
    return <p className="text-center text-slate-600">No se pudo cargar el ejercicio.</p>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-xl max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-sky-700 mb-4">{exercise.title} - {exercise.durationMinutes} min</h2>
      
      {isFinished ? (
        <div className="text-center py-8">
          <p className="text-2xl text-emerald-600 font-semibold mb-4">¡Ejercicio completado!</p>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-emerald-500 mx-auto mb-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-slate-600 mb-6">Esperamos te sientas más presente y calmado.</p>
          <button
            onClick={onClose}
            className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-6 rounded-lg transition-colors text-lg"
          >
            Finalizar
          </button>
        </div>
      ) : (
        <>
          <div className="text-center mb-6">
            <p className="text-5xl font-mono text-sky-600">{formatTime(timeLeft)}</p>
          </div>
          <div className="prose prose-slate max-w-none mb-6 whitespace-pre-line text-slate-700">
            {exercise.instructions}
          </div>
          <div className="flex justify-center space-x-4 mt-6">
            {isRunning ? (
              <button
                onClick={pause}
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                Pausar
              </button>
            ) : (
              <button
                onClick={resume}
                disabled={timeLeft === 0}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded disabled:bg-slate-300 transition-colors"
              >
                Continuar
              </button>
            )}
            <button
              onClick={() => { reset(); onClose(); }}
              className="bg-slate-500 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Detener y Salir
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ExercisePlayer;
