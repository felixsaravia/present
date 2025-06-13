
import React, { useState, useEffect, useRef } from 'react';
import useTimer from '../../hooks/useTimer';

const MovingDotGame: React.FC = () => {
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const { timeLeft, isRunning: timerIsRunning, isFinished: timerIsFinished, start: startTimer, reset: resetTimer } = useTimer();
  const [dotPosition, setDotPosition] = useState({ x: 50, y: 50 }); // Percentage based
  const animationFrameId = useRef<number | null>(null);

  const GAME_DURATION_SECONDS = 30;

  const startGame = () => {
    setScore(0);
    setIsPlaying(true);
    startTimer(GAME_DURATION_SECONDS);
    randomizeDotPosition();
    if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    moveDot();
  };

  const randomizeDotPosition = () => {
    if (gameAreaRef.current) {
        const newX = Math.random() * 90 + 5; 
        const newY = Math.random() * 90 + 5;
        setDotPosition({ x: newX, y: newY });
    }
  };
  
  const moveDot = () => {
    randomizeDotPosition();
    animationFrameId.current = requestAnimationFrame(() => {
        if(timerIsRunning && isPlaying) {
            setTimeout(moveDot, 1500 + Math.random() * 1000); 
        }
    });
  };
  
  useEffect(() => {
    if (dotRef.current) {
        dotRef.current.style.left = `${dotPosition.x}%`;
        dotRef.current.style.top = `${dotPosition.y}%`;
    }
  }, [dotPosition]);


  const handleDotClick = () => {
    if (isPlaying && timerIsRunning) {
      setScore(prevScore => prevScore + 1);
      randomizeDotPosition(); 
    }
  };
  
  useEffect(() => {
    if (timerIsFinished && isPlaying) {
      setIsPlaying(false);
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    }
  }, [timerIsFinished, isPlaying]);
  
  useEffect(() => {
      return () => { 
          if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      }
  }, [])


  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className="p-6 bg-white rounded-xl border border-slate-200 text-center">
      <h3 className="text-xl font-semibold text-sky-700 mb-4">Juego: Sigue el Punto</h3>
      <p className="text-slate-600 mb-4">Haz clic en el punto rojo tantas veces como puedas antes de que acabe el tiempo.</p>
      
      <div className="mb-4 text-lg">
        <span className="font-semibold">Puntuación: {score}</span> | <span className="font-semibold">Tiempo: {formatTime(timeLeft)}</span>
      </div>

      {!isPlaying && !timerIsRunning && (
        <button
          onClick={startGame}
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-6 rounded-lg text-lg transition-colors"
        >
          Comenzar Juego
        </button>
      )}
      
      {(isPlaying || timerIsRunning) && !timerIsFinished && (
         <button
            onClick={() => { setIsPlaying(false); resetTimer(); if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);}}
            className="bg-rose-500 hover:bg-rose-600 text-white font-bold py-2 px-6 rounded-lg text-lg transition-colors mb-4"
        >
            Detener Juego
        </button>
      )}


      {timerIsFinished && (
        <div className="my-4 p-4 bg-sky-100 rounded-md">
          <p className="text-xl font-semibold text-sky-700">¡Juego Terminado!</p>
          <p className="text-lg text-slate-700">Tu puntuación final: {score}</p>
          <button
            onClick={startGame}
            className="mt-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-6 rounded-lg"
          >
            Jugar de Nuevo
          </button>
        </div>
      )}

      <div
        ref={gameAreaRef}
        className="relative w-full h-64 bg-slate-200 rounded-lg mt-4 overflow-hidden border-2 border-slate-300 cursor-pointer"
      >
        {isPlaying && timerIsRunning && (
          <div
            ref={dotRef}
            onClick={handleDotClick}
            className="absolute w-8 h-8 bg-rose-500 rounded-full cursor-pointer transition-all duration-500 ease-out transform -translate-x-1/2 -translate-y-1/2"
          ></div>
        )}
      </div>
    </div>
  );
};

export default MovingDotGame;
