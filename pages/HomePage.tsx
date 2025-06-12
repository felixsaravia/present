
import React from 'react';
import { Link } from 'react-router-dom';
import { useChallenges } from '../contexts/ChallengesContext';
import LoadingSpinner from '../components/LoadingSpinner';
// Removed INITIAL_PRESENCE_CHECKIN_PROMPTS, PresenceCheckinPrompt, generatePresenceCheckinQuestions
import PresentNow from '../components/PresentNow';


const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-yellow-500"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L1.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.25 12L17 13.75M19.5 15l-1.25-1.75M19.5 15V12.5M19.5 15H17M12.75 18.25L11 17M5.25 6.75L4 5M18.75 3.75h.75M19.5 6.75v.75m0-.75L18 5.25m1.5 1.5H18.5" /></svg>;

// PresenceCheckinCard component definition removed

const HomePage: React.FC = () => {
  const { currentChallenge, isLoadingChallenge, challengeError, toggleChallengeCompletion, fetchNewChallenge } = useChallenges();

  return (
    <div className="space-y-8">
      <PresentNow />
      <header className="text-center">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Bienvenido/a a Mindful Moments</h2>
        <p className="text-lg text-slate-600">Tu espacio para encontrar calma y claridad en el día a día.</p>
      </header>

      {/* Daily Challenge Section */}
      <section className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold text-sky-700 mb-3 flex items-center">
          <SparklesIcon /> Reto de Atención Plena del Día
        </h3>
        {isLoadingChallenge && <LoadingSpinner text="Buscando tu reto..." />}
        {challengeError && <p className="text-red-500 bg-red-100 p-3 rounded-md">{challengeError}</p>}
        {currentChallenge && !isLoadingChallenge && !challengeError && (
          <div>
            <p className="text-slate-700 text-lg mb-4">{currentChallenge.description}</p>
            <button
              onClick={() => toggleChallengeCompletion(currentChallenge.id)}
              className={`w-full py-2 px-4 rounded-md font-semibold transition-colors flex items-center justify-center
                ${currentChallenge.isCompleted 
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white' 
                  : 'bg-sky-500 hover:bg-sky-600 text-white'}`}
            >
              {currentChallenge.isCompleted && <CheckIcon />}
              {currentChallenge.isCompleted ? 'Completado ¡Bien Hecho!' : 'Marcar como Completado'}
            </button>
          </div>
        )}
        {!currentChallenge && !isLoadingChallenge && !challengeError && (
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

      {/* Presence Check-in Section Removed */}
      {/* <PresenceCheckinCard /> */}

      {/* Quick Links Section */}
      <section>
        <h3 className="text-xl font-semibold text-slate-700 mb-4">Explora</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link to="/exercises" className="block p-6 bg-sky-500 hover:bg-sky-600 text-white rounded-xl shadow-lg transition-all hover:shadow-xl transform hover:-translate-y-1">
            <h4 className="text-lg font-semibold mb-1">Ejercicios Guiados</h4>
            <p className="text-sm opacity-90">Encuentra calma con nuestras prácticas de 1-5 minutos.</p>
          </Link>
          <Link to="/focus" className="block p-6 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-lg transition-all hover:shadow-xl transform hover:-translate-y-1">
            <h4 className="text-lg font-semibold mb-1">Entrenamiento del Enfoque</h4>
            <p className="text-sm opacity-90">Juegos para mejorar tu concentración.</p>
          </Link>
          <Link to="/journal" className="block p-6 bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow-lg transition-all hover:shadow-xl transform hover:-translate-y-1">
            <h4 className="text-lg font-semibold mb-1">Bitácora del Presente</h4>
            <p className="text-sm opacity-90">Conecta con tus pensamientos y emociones.</p>
          </Link>
           <Link to="/challenges" className="block p-6 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl shadow-lg transition-all hover:shadow-xl transform hover:-translate-y-1">
            <h4 className="text-lg font-semibold mb-1">Ver todos los Retos</h4>
            <p className="text-sm opacity-90">Revisa tus desafíos de atención plena.</p>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
