
import React, { useState, useEffect } from 'react';
import useTimer from '../../hooks/useTimer';

const generateSequence = (length: number): number[] => {
  return Array.from({ length }, () => Math.floor(Math.random() * 10)); // Digits 0-9
};

const SequenceMemoryGame: React.FC = () => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [level, setLevel] = useState(1);
  const [gameState, setGameState] = useState<'idle' | 'showing' | 'recalling' | 'result'>('idle');
  const [message, setMessage] = useState<string>('');
  const [score, setScore] = useState(0);

  const { timeLeft, start: startTimer, reset: resetTimer, isFinished: timerIsFinished } = useTimer();
  const SHOW_TIME_PER_ITEM_MS = 1000; 
  const RECALL_TIME_BASE_MS = 5000; 
  const RECALL_TIME_PER_ITEM_MS = 1000;

  const startGame = () => {
    setLevel(1);
    setScore(0);
    startLevel(1);
  };

  const startLevel = (currentLevel: number) => {
    setMessage('');
    setUserInput('');
    const newSequence = generateSequence(currentLevel + 2); 
    setSequence(newSequence);
    setGameState('showing');
    startTimer(Math.ceil(newSequence.length * SHOW_TIME_PER_ITEM_MS / 1000));
  };

  useEffect(() => {
    if (gameState === 'showing' && timerIsFinished) {
      setGameState('recalling');
      resetTimer(); 
      startTimer(Math.ceil((RECALL_TIME_BASE_MS + sequence.length * RECALL_TIME_PER_ITEM_MS) / 1000));
      setMessage('Ahora, escribe la secuencia que recuerdas.');
    } else if (gameState === 'recalling' && timerIsFinished) {
      checkSequence(); 
    }
  }, [timerIsFinished, gameState, sequence.length, resetTimer, startTimer]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (gameState === 'recalling') {
      setUserInput(e.target.value.replace(/[^0-9]/g, '')); 
    }
  };

  const checkSequence = () => {
    resetTimer();
    setGameState('result');
    const userSequenceArray = userInput.split('').map(Number);
    if (JSON.stringify(userSequenceArray) === JSON.stringify(sequence)) {
      setMessage(`¡Correcto! Siguiente nivel.`);
      setScore(prevScore => prevScore + sequence.length * 10);
      setTimeout(() => startLevel(level + 1), 2000);
      setLevel(prevLevel => prevLevel + 1);
    } else {
      setMessage(`Incorrecto. La secuencia era: ${sequence.join(' ')}. Tu puntuación: ${score}.`);
      setTimeout(() => setGameState('idle'), 3000);
    }
  };
  
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };


  return (
    <div className="p-6 bg-white rounded-xl border border-slate-200 text-center">
      <h3 className="text-xl font-semibold text-sky-700 mb-2">Juego: Memoria de Secuencia</h3>
      <p className="text-slate-600 mb-4">Memoriza la secuencia de números que aparece.</p>

      {gameState === 'idle' && (
        <button
          onClick={startGame}
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-6 rounded-lg text-lg"
        >
          Comenzar Juego
        </button>
      )}

      {gameState !== 'idle' && (
        <div className="mb-4 text-lg">
          <span className="font-semibold">Nivel: {level}</span> | <span className="font-semibold">Puntuación: {score}</span>
          {(gameState === 'showing' || gameState === 'recalling') && <span className="font-semibold"> | Tiempo: {formatTime(timeLeft)}</span>}
        </div>
      )}
      
      {gameState === 'showing' && (
        <div className="my-4 p-4 bg-slate-100 rounded-md min-h-[60px] flex items-center justify-center">
          <p className="text-4xl font-bold text-sky-600 tracking-widest">{sequence.join(' ')}</p>
        </div>
      )}

      {gameState === 'recalling' && (
        <div className="my-4">
          <input
            type="text"
            value={userInput}
            onChange={handleInputChange}
            className="w-full max-w-xs mx-auto p-3 border border-slate-300 rounded-md text-2xl text-center tracking-widest focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
            placeholder="Escribe la secuencia"
            maxLength={sequence.length + 2} 
          />
          <button
            onClick={checkSequence}
            className="mt-4 bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-6 rounded-lg"
          >
            Comprobar
          </button>
        </div>
      )}

      {message && (
        <p className={`mt-4 text-lg font-medium ${message.includes('Incorrecto') ? 'text-red-600' : 'text-emerald-600'}`}>
          {message}
        </p>
      )}
       {gameState !== 'idle' && gameState !== 'showing' && (
         <button
          onClick={() => { setGameState('idle'); resetTimer(); setMessage('');}}
          className="mt-6 bg-slate-400 hover:bg-slate-500 text-white font-semibold py-2 px-4 rounded-md text-sm"
        >
          Salir del Juego
        </button>
       )}
    </div>
  );
};

export default SequenceMemoryGame;
