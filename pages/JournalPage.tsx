
import React, { useState } from 'react';
import { useJournal } from '../contexts/JournalContext';
import { JournalEntry } from '../types';

const JournalEntryCard: React.FC<{ entry: JournalEntry, onDelete: (id: string) => void }> = ({ entry, onDelete }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-amber-400">
      <div className="flex justify-between items-start mb-2">
        <p className="text-xs text-slate-500">
          {new Date(entry.timestamp).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
          {' - '}
          {new Date(entry.timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
        </p>
        <button onClick={() => onDelete(entry.id)} className="text-red-400 hover:text-red-600 transition-colors" title="Eliminar entrada">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.56 0c1.153 0 2.243.096 3.298.26m-3.298-.26L2.25 5.79m0 0a58.353 58.353 0 013.527-.397m9.05-2.305a48.547 48.547 0 01-4.482 0m-4.482 0a48.517 48.517 0 00-4.482 0m6.724 0A48.49 48.49 0 0112 2.253a48.49 48.49 0 012.253.002M12 2.253v2.516" />
          </svg>
        </button>
      </div>
      <div>
        <p className="text-slate-700"><strong className="font-semibold text-slate-800">Haciendo:</strong> {entry.doing}</p>
        <p className="text-slate-700"><strong className="font-semibold text-slate-800">Sintiendo:</strong> {entry.feeling}</p>
      </div>
    </div>
  );
};

const JournalPage: React.FC = () => {
  const { entries, addEntry, deleteEntry } = useJournal();
  const [currentDoing, setCurrentDoing] = useState('');
  const [currentFeeling, setCurrentFeeling] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentDoing.trim() === '' && currentFeeling.trim() === '') {
      alert("Por favor, escribe algo en 'haciendo' o 'sintiendo'.");
      return;
    }
    addEntry(currentDoing, currentFeeling);
    setCurrentDoing('');
    setCurrentFeeling('');
    setShowForm(false); // Hide form after submission
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-slate-800 mb-6 text-center">Bitácora del Presente</h2>
      <p className="text-center text-slate-600 mb-8">
        Tómate un momento para conectar contigo. ¿Qué estás haciendo y sintiendo ahora mismo?
      </p>

      {!showForm && (
         <div className="text-center mb-8">
            <button
            onClick={() => setShowForm(true)}
            className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-lg text-lg shadow-md hover:shadow-lg transition-all"
            >
            + Nueva Entrada
            </button>
        </div>
      )}
      
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-xl mb-8 space-y-4">
          <div>
            <label htmlFor="doing" className="block text-sm font-medium text-slate-700 mb-1">
              ¿Qué estoy haciendo ahora?
            </label>
            <textarea
              id="doing"
              value={currentDoing}
              onChange={(e) => setCurrentDoing(e.target.value)}
              rows={3}
              className="w-full p-2 border border-slate-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
              placeholder="Ej: Tomando un café, escuchando música, trabajando..."
            />
          </div>
          <div>
            <label htmlFor="feeling" className="block text-sm font-medium text-slate-700 mb-1">
              ¿Qué estoy sintiendo?
            </label>
            <textarea
              id="feeling"
              value={currentFeeling}
              onChange={(e) => setCurrentFeeling(e.target.value)}
              rows={3}
              className="w-full p-2 border border-slate-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
              placeholder="Ej: Calma, ansiedad, curiosidad, gratitud..."
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-2 px-4 rounded-md transition-colors"
            >
                Cancelar
            </button>
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-5 rounded-md shadow hover:shadow-md transition-all"
            >
              Guardar Entrada
            </button>
          </div>
        </form>
      )}

      <div>
        <h3 className="text-xl font-semibold text-slate-700 mb-4">Mis Entradas</h3>
        {entries.length > 0 ? (
          <div className="space-y-4">
            {entries.map((entry) => (
              <JournalEntryCard key={entry.id} entry={entry} onDelete={deleteEntry} />
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-center py-6 bg-white rounded-lg shadow">
            Aún no has añadido ninguna entrada a tu bitácora. ¡Anímate a registrar tu momento presente!
          </p>
        )}
      </div>
    </div>
  );
};

export default JournalPage;
