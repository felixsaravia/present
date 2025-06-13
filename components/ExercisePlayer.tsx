
import React, { useState, useEffect, useRef, useCallback } from 'react';
import useTimer from '../hooks/useTimer';
import { MindfulnessExercise, ExerciseFocus } from '../types';
import { generateMindfulnessExercise } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';

interface ExercisePlayerProps {
  focus: ExerciseFocus;
  durationMinutes: number;
  onClose: () => void;
}

const SpeakerWaveIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
  </svg>
);

const SpeakerXMarkIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0L17.25 14.25M19.5 12l2.25-2.25L19.5 12l2.25 2.25M12.75 4.97v14.06M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
  </svg>
);


const BREATH_CYCLE_CONFIG = {
  inhale: { duration: 4000, text: "Inhala..." },
  holdIn: { duration: 2000, text: "Sostén..." },
  exhale: { duration: 6000, text: "Exhala..." },
  holdOut: { duration: 1000, text: "Mantén..." },
};
type BreathPhase = keyof typeof BREATH_CYCLE_CONFIG;


const ExercisePlayer: React.FC<ExercisePlayerProps> = ({ focus, durationMinutes, onClose }) => {
  const [exercise, setExercise] = useState<MindfulnessExercise | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { timeLeft, isRunning, isFinished, start, pause, resume, reset } = useTimer();

  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const [breathPhase, setBreathPhase] = useState<BreathPhase>('inhale');
  const [breathText, setBreathText] = useState<string>(BREATH_CYCLE_CONFIG.inhale.text);
  const animationIntervalRef = useRef<number | null>(null);

  const isBreathExercise = focus === ExerciseFocus.BREATH;

  const stableStart = useCallback(start, []);

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

    return () => {
      if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
        window.speechSynthesis.cancel();
      }
      setIsAudioMuted(false); 
      if (animationIntervalRef.current) {
        clearTimeout(animationIntervalRef.current);
      }
    };
  }, [focus, durationMinutes]);


  useEffect(() => {
    if (exercise && !isFinished && !isLoading) { // Ensure not to start timer while loading exercise
      stableStart(exercise.durationMinutes * 60);
      if (exercise.instructions) {
        const utterance = new SpeechSynthesisUtterance(exercise.instructions);
        utterance.lang = 'es-ES';
        // utterance.onend is not strictly needed with the new centralized audio logic
        speechUtteranceRef.current = utterance;
      } else {
        speechUtteranceRef.current = null;
      }
    }
  }, [exercise, stableStart, isFinished, isLoading]);


  const handleToggleMute = useCallback(() => {
    setIsAudioMuted(prevMuted => {
      const newMutedState = !prevMuted;
      if (newMutedState) { // If muting
        window.speechSynthesis.cancel();
      }
      // If unmuting, the central useEffect will handle playback
      return newMutedState;
    });
  }, []);
  
  // Centralized Audio Logic
  useEffect(() => {
    const utterance = speechUtteranceRef.current;

    if (!isRunning || isAudioMuted || isFinished) {
      if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
        window.speechSynthesis.cancel();
      }
      return;
    }

    // If we reach here, audio should play: isRunning=true, isAudioMuted=false, isFinished=false
    
    if (isBreathExercise) {
      if (breathText) {
        if(window.speechSynthesis.speaking || window.speechSynthesis.pending) window.speechSynthesis.cancel(); // ensure only one thing speaks
        const phaseUtterance = new SpeechSynthesisUtterance(breathText);
        phaseUtterance.lang = 'es-ES';
        window.speechSynthesis.speak(phaseUtterance);
      }
    } else { // Not a breath exercise
      if (utterance) {
        // Check if it's the same utterance and was paused, then resume
        // This simple version will restart if it was paused or if it's a new play.
        if(window.speechSynthesis.speaking || window.speechSynthesis.pending) window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
      }
    }
  }, [isRunning, isAudioMuted, isFinished, isBreathExercise, breathText, speechUtteranceRef]);


  // Breathing Animation Cycle Logic
  useEffect(() => {
    if (!isBreathExercise || !isRunning || isFinished) {
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
  }, [isBreathExercise, isRunning, isFinished]);


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
        {speechUtteranceRef.current && (
          <button
            onClick={handleToggleMute}
            className={`p-2 rounded-full transition-colors ${!isAudioMuted ? 'bg-sky-500 text-white' : 'text-slate-500 hover:bg-slate-100 border border-slate-300'}`}
            aria-label={!isAudioMuted ? "Silenciar audio" : "Reactivar audio"}
          >
            {!isAudioMuted ? <SpeakerWaveIcon className="w-6 h-6 sm:w-7 sm:h-7"/> : <SpeakerXMarkIcon className="w-6 h-6 sm:w-7 sm:h-7"/>}
          </button>
        )}
      </div>
      
      {isFinished ? (
        <div className="text-center py-8">
          <p className="text-2xl text-emerald-600 font-semibold mb-4">¡Ejercicio completado!</p>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-emerald-500 mx-auto mb-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-slate-600 mb-6">Esperamos te sientas más presente y calmado.</p>
          <button
            onClick={() => {
              if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
                window.speechSynthesis.cancel();
              }
              setIsAudioMuted(false); 
              onClose();
            }}
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

          {isBreathExercise && isRunning && (
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
                if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
                     window.speechSynthesis.cancel();
                }
                setIsAudioMuted(false); 
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
