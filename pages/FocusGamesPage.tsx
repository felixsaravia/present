
import React, { useState } from 'react';
import MovingDotGame from '../components/focus_games/MovingDotGame';
import SequenceMemoryGame from '../components/focus_games/SequenceMemoryGame';
import ContextualFocusExercise from '../components/focus_games/ContextualFocusExercise'; 
import { FocusGame } from '../types';
import { FOCUS_GAME_MOVING_DOT_ID, FOCUS_GAME_SEQUENCE_MEMORY_ID, FOCUS_GAME_CONTEXTUAL_ID } from '../constants'; 

const GAMES_AVAILABLE: FocusGame[] = [
  { id: FOCUS_GAME_MOVING_DOT_ID, name: "Sigue el Punto", description: "Mejora tu atención sostenida siguiendo un punto en movimiento." },
  { id: FOCUS_GAME_SEQUENCE_MEMORY_ID, name: "Memoria de Secuencia", description: "Entrena tu memoria a corto plazo recordando secuencias numéricas." },
  { id: FOCUS_GAME_CONTEXTUAL_ID, name: "Enfoque Contextual", description: "Describe tu entorno o actividad y recibe un ejercicio de enfoque personalizado." },
];

const FocusGamesPage: React.FC = () => {
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);

  const renderSelectedGame = () => {
    switch (selectedGameId) {
      case FOCUS_GAME_MOVING_DOT_ID:
        return <MovingDotGame />;
      case FOCUS_GAME_SEQUENCE_MEMORY_ID:
        return <SequenceMemoryGame />;
      case FOCUS_GAME_CONTEXTUAL_ID:
        return <ContextualFocusExercise />; 
      default:
        return <p className="text-center text-slate-500">Selecciona un juego para comenzar.</p>;
    }
  };

  if (selectedGameId) {
    return (
      <div>
        <button 
          onClick={() => setSelectedGameId(null)} 
          className="mb-6 bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-md flex items-center transition-colors duration-150"
          aria-label="Volver a la lista de juegos"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Volver a la lista de juegos
        </button>
        {renderSelectedGame()}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">Entrenamiento del Enfoque</h2>
      <p className="text-center text-slate-600 mb-8">
        Elige un juego para mejorar tu concentración y atención.
      </p>
      <div className="space-y-6">
        {GAMES_AVAILABLE.map((game) => (
          <div key={game.id} className="bg-white p-6 rounded-xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50 transition-colors duration-200">
            <h3 className="text-xl font-semibold text-sky-700 mb-2">{game.name}</h3>
            <p className="text-slate-600 mb-4">{game.description}</p>
            <button
              onClick={() => setSelectedGameId(game.id)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-5 rounded-lg transition-colors duration-150"
              aria-label={`Jugar ahora: ${game.name}`}
            >
              Jugar Ahora
            </button>
          </div>
        ))}
        <div className="bg-slate-100 p-6 rounded-xl border-2 border-dashed border-slate-300 text-center">
            <h3 className="text-lg font-semibold text-slate-500 mb-2">Próximamente...</h3>
            <p className="text-slate-400">Estamos desarrollando más juegos para ayudarte a entrenar tu enfoque.</p>
        </div>
      </div>
    </div>
  );
};

export default FocusGamesPage;
