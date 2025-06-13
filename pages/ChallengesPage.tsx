
import React from 'react';
import { useChallenges } from '../contexts/ChallengesContext';
import LoadingSpinner from '../components/LoadingSpinner';
import useLocalStorage from '../hooks/useLocalStorage';
import { MindfulnessChallenge } from '../types';

const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2 text-yellow-500"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L1.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.25 12L17 13.75M19.5 15l-1.25-1.75M19.5 15V12.5M19.5 15H17M12.75 18.25L11 17M5.25 6.75L4 5M18.75 3.75h.75M19.5 6.75v.75m0-.75L18 5.25m1.5 1.5H18.5" /></svg>;

const ChallengesPage: React.FC = () => {
  const { 
    currentChallenge, 
    isLoadingChallenge, 
    challengeError, 
    toggleChallengeCompletion, 
    fetchNewChallenge,
    currentSystemDate 
  } = useChallenges();
  
  const [allChallenges] = useLocalStorage<MindfulnessChallenge[]>('mindfulnessChallenges', []);

  const todayDateForDisplay = currentSystemDate; 

  const sortedChallenges = [...allChallenges]
    .filter(c => !c.id.startsWith("error-")) 
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const isCurrentChallengeValid = currentChallenge && !currentChallenge.id.startsWith("error-") && !challengeError;

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">Retos de Atención Plena</h2>

      {/* Current Day's Challenge */}
      <section className="bg-white p-6 rounded-xl border border-slate-200 mb-8">
        <h3 className="text-xl font-semibold text-sky-700 mb-3 flex items-center">
            <SparklesIcon /> Reto de Hoy ({new Date(todayDateForDisplay + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })})
        </h3>
        {isLoadingChallenge && <LoadingSpinner text="Cargando reto de hoy..." />}
        {challengeError && !isLoadingChallenge && <p className="text-red-500 bg-red-100 p-3 rounded-md">{challengeError}</p>}
        
        {isCurrentChallengeValid && !isLoadingChallenge && (
          <div>
            <p className="text-slate-700 text-lg mb-4">{currentChallenge.description}</p>
            <button
              onClick={() => toggleChallengeCompletion(currentChallenge.id)}
              disabled={currentChallenge.id.startsWith("error-")}
              className={`w-full py-2.5 px-4 rounded-md font-semibold transition-colors flex items-center justify-center text-base
                ${currentChallenge.isCompleted 
                  ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border border-emerald-500' 
                  : 'bg-sky-500 hover:bg-sky-600 text-white'}
                ${currentChallenge.id.startsWith("error-") ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {currentChallenge.isCompleted && <CheckIcon />}
              <span className="ml-2">{currentChallenge.isCompleted ? 'Completado ¡Sigue Así!' : 'Marcar como Completado'}</span>
            </button>
          </div>
        )}

         {((!currentChallenge && !isLoadingChallenge && !challengeError) || (currentChallenge && currentChallenge.id.startsWith("error-") && !isLoadingChallenge && !challengeError)) && (
          <div className="text-center">
            <p className="text-slate-500 mb-3">No se pudo cargar el reto de hoy.</p>
            <button 
              onClick={fetchNewChallenge}
              className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-md"
            >
              Intentar de Nuevo
            </button>
          </div>
        )}
      </section>

      {/* Past Challenges */}
      <section>
        <h3 className="text-xl font-semibold text-slate-700 mb-4">Historial de Retos</h3>
        {sortedChallenges.length > 0 ? (
          <div className="space-y-4">
            {sortedChallenges.filter(c => c.date !== todayDateForDisplay).map((challenge) => (
              <div key={challenge.id} className={`p-4 rounded-lg ${challenge.isCompleted ? 'bg-emerald-50 border-l-4 border-emerald-400' : 'bg-slate-50 border-l-4 border-slate-300'}`}>
                <p className="text-xs text-slate-500 mb-1">{new Date(challenge.date + 'T00:00:00').toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p className="text-slate-700 mb-2">{challenge.description}</p>
                {challenge.isCompleted && (
                  <p className="text-sm text-emerald-600 font-medium flex items-center">
                    <CheckIcon /> <span className="ml-1">Completado</span>
                  </p>
                )}
                 {!challenge.isCompleted && (
                   <button
                    onClick={() => toggleChallengeCompletion(challenge.id)}
                    className="text-xs py-1 px-2 rounded bg-slate-200 hover:bg-slate-300 text-slate-600 transition-colors"
                   >
                    Marcar como completado
                   </button>
                 )}
              </div>
            ))}
             {sortedChallenges.filter(c => c.date !== todayDateForDisplay).length === 0 && (
                <p className="text-slate-500 text-center py-4">Aún no hay retos pasados en tu historial.</p>
            )}
          </div>
        ) : (
          <p className="text-slate-500 text-center py-4">Aún no hay retos en tu historial.</p>
        )}
      </section>
    </div>
  );
};

export default ChallengesPage;
