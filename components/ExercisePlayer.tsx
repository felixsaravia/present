
import React, { useState, useEffect, useRef, useCallback } from 'react';
import useTimer from '../hooks/useTimer';
import { MindfulnessExercise, ExerciseFocus } from '../types';
import { generateMindfulnessExercise } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';

interface ExercisePlayerProps {
  focus: ExerciseFocus;
  durationMinutes: number;
  onClose: () => void;
  customInstructions?: string;
  customTitle?: string;
}

const BREATH_CYCLE_CONFIG = {
  inhale: { duration: 4000, text: "Inhala..." },
  holdIn: { duration: 2000, text: "Sostén..." },
  exhale: { duration: 6000, text: "Exhala..." },
  holdOut: { duration: 1000, text: "Mantén..." },
};
type BreathPhase = keyof typeof BREATH_CYCLE_CONFIG;


const ExercisePlayer: React.FC<ExercisePlayerProps> = ({ focus, durationMinutes, onClose, customInstructions, customTitle }) => {
  const [exercise, setExercise] = useState<MindfulnessExercise | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { timeLeft, isRunning, isFinished, start, pause, resume, reset } = useTimer();

  const [breathPhase, setBreathPhase] = useState<BreathPhase>('inhale');
  const [breathText, setBreathText] = useState<string>(BREATH_CYCLE_CONFIG.inhale.text);
  const animationIntervalRef = useRef<number | null>(null);

  const isStandardBreathExercise = focus === ExerciseFocus.BREATH && !customInstructions;

  const stableStart = useCallback(start, []);

  useEffect(() => {
    const setupExercise = async () => {
      setIsLoading(true);
      setError(null);
      try {
        if (customInstructions) {
          setExercise({
            id: `ex-dynamic-${Date.now()}`,
            title: customTitle || `Meditación de ${focus}`,
            durationMinutes,
            focus,
            instructions: customInstructions,
          });
        } else {
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
        }
      } catch (err) {
        setError("Error al configurar el ejercicio.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    setupExercise();

    return () => {
      if (animationIntervalRef.current) {
        clearTimeout(animationIntervalRef.current);
      }
    };
  }, [focus, durationMinutes, customInstructions, customTitle]);


  useEffect(() => {
    if (exercise && !isFinished && !isLoading) { 
      stableStart(exercise.durationMinutes * 60);
    }
  }, [exercise, stableStart, isFinished, isLoading]);
  
  // Breathing Animation Cycle Logic
  useEffect(() => {
    if (!isStandardBreathExercise || !isRunning || isFinished) {
      if (animationIntervalRef.current) {
        clearTimeout(animationIntervalRef.current);
        animationIntervalRef.current = null;
      }
      return;
    }

    let currentPhaseIndex = 0;
    const phases: BreathPhase[] = ['inhale', 'holdIn', 'exhale', 'holdOut'];

    const nextPhase = () => {
      currentPhaseIndex = (currentPhaseIndex + 1) % phases.length;
      const newPhase = phases[currentPhaseIndex];
      setBreathPhase(newPhase);
      setBreathText(BREATH_CYCLE_CONFIG[newPhase].text);
      
      if (animationIntervalRef.current) clearTimeout(animationIntervalRef.current); 
      animationIntervalRef.current = window.setTimeout(nextPhase, BREATH_CYCLE_CONFIG[newPhase].duration);
    };

    setBreathPhase(phases[0]); 
    setBreathText(BREATH_CYCLE_CONFIG[phases[0]].text);
    if (animationIntervalRef.current) clearTimeout(animationIntervalRef.current);
    animationIntervalRef.current = window.setTimeout(nextPhase, BREATH_CYCLE_CONFIG[phases[0]].duration);
    
    return () => {
      if (animationIntervalRef.current) {
        clearTimeout(animationIntervalRef.current); 
      }
    };
  }, [isStandardBreathExercise, isRunning, isFinished]);


  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const getBreathCircleStyle = () => {
    let scale = 1;
    let transitionDuration = '3s'; 

    switch (breathPhase) {
      case 'inhale':
        scale = 1.5;
        transitionDuration = `${BREATH_CYCLE_CONFIG.inhale.duration / 1000}s`;
        break;
      case 'holdIn':
        scale = 1.5;
        transitionDuration = `${BREATH_CYCLE_CONFIG.holdIn.duration / 1000}s`;
        break;
      case 'exhale':
        scale = 1;
        transitionDuration = `${BREATH_CYCLE_CONFIG.exhale.duration / 1000}s`;
        break;
      case 'holdOut':
        scale = 1;
        transitionDuration = `${BREATH_CYCLE_CONFIG.holdOut.duration / 1000}s`;
        break;
    }
    return {
      transform: `scale(${scale})`,
      transition: `transform ${transitionDuration} ease-in-out`,
    };
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
          className="mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors"
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
    <div className="p-4 sm:p-6 bg-white rounded-lg border border-slate-200 max-w-lg mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-sky-700">{exercise.title} - {exercise.durationMinutes} min</h2>
      </div>
      
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

          {isStandardBreathExercise && isRunning && (
            <div className="mt-10 mb-6 text-center">
              <div
                className="mx-auto w-32 h-32 sm:w-40 sm:h-40 bg-sky-500 rounded-full flex items-center justify-center relative"
                style={getBreathCircleStyle()}
              >
              </div>
              <p className="mt-12 text-xl text-sky-600 font-medium">{breathText}</p>
            </div>
          )}

          <div className="prose prose-slate max-w-none mb-6 whitespace-pre-line text-slate-700 text-sm sm:text-base leading-relaxed">
            {exercise.instructions}
          </div>
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 mt-6">
            {isRunning ? (
              <button
                onClick={pause}
                className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 px-5 rounded-lg transition-colors"
              >
                Pausar
              </button>
            ) : (
              <button
                onClick={resume}
                disabled={timeLeft === 0}
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 px-5 rounded-lg disabled:bg-slate-300 transition-colors"
              >
                Continuar
              </button>
            )}
            <button
              onClick={() => { 
                reset(); 
                onClose(); 
              }}
              className="w-full sm:w-auto bg-slate-500 hover:bg-slate-600 text-white font-bold py-2.5 px-5 rounded-lg transition-colors"
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
