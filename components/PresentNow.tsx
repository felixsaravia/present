
import React, { useState } from 'react';
import Modal from './Modal';
import LoadingSpinner from './LoadingSpinner';
import { generatePresentNowActivity } from '../services/geminiService';
import useTimer from '../hooks/useTimer';

const PresentNow: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activity, setActivity] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { timeLeft, isRunning, isFinished, start, reset } = useTimer(); // Duration will be ~1 min

  const handleOpenModal = async () => {
    setIsModalOpen(true);
    setIsLoading(true);
    setError(null);
    setActivity(null);
    reset(); 
    try {
      const generatedActivity = await generatePresentNowActivity();
      if (generatedActivity.startsWith("Error:") || generatedActivity.startsWith("No se pudo")) {
        setError(generatedActivity);
      } else {
        setActivity(generatedActivity);
        start(60); // Start a 1-minute timer
      }
    } catch (err) {
      setError("Error al cargar la actividad.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setActivity(null);
    setError(null);
    reset();
  };
  
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <>
      <button
        onClick={handleOpenModal}
        className="fixed bottom-24 right-4 sm:bottom-20 sm:right-6 bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 px-3 rounded-full shadow-lg transition-transform hover:scale-105 z-40 flex items-center justify-center"
        title="Presente Ahora"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5" />
        </svg>
         <span className="sr-only">Actividad Rápida Presente Ahora</span>
      </button>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Momento Presente Rápido">
        {isLoading && <LoadingSpinner text="Cargando actividad..." />}
        {error && (
          <div className="text-red-600 bg-red-100 p-3 rounded-md">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        )}
        {activity && !isFinished && (
          <div>
            <div className="text-center mb-4">
              <p className="text-3xl font-mono text-rose-600">{formatTime(timeLeft)}</p>
            </div>
            <p className="text-slate-700 whitespace-pre-line prose">{activity}</p>
          </div>
        )}
        {isFinished && activity && (
           <div className="text-center py-4">
            <p className="text-xl text-emerald-600 font-semibold mb-2">¡Bien hecho!</p>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-emerald-500 mx-auto mb-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-slate-600">Esperamos te sientas más centrado.</p>
          </div>
        )}
         <div className="mt-6 flex justify-end">
            <button
                onClick={handleCloseModal}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-2 px-4 rounded transition-colors"
            >
                Cerrar
            </button>
        </div>
      </Modal>
    </>
  );
};

export default PresentNow;
