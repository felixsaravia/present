
import React, { useState } from 'react';
import { DEFAULT_EXERCISE_DURATIONS } from '../constants';
import ExercisePlayer from '../components/ExercisePlayer';
import { ExerciseFocus as ExerciseFocusEnum } from '../types'; // Renamed import

const FocusOptionButton: React.FC<{
  focus: ExerciseFocusEnum;
  selectedFocus: ExerciseFocusEnum | null;
  onClick: (focus: ExerciseFocusEnum) => void;
}> = ({ focus, selectedFocus, onClick }) => (
  <button
    onClick={() => onClick(focus)}
    className={`w-full py-3 px-4 rounded-lg text-left font-medium transition-all
                ${selectedFocus === focus ? 'bg-sky-600 text-white shadow-md ring-2 ring-sky-300' : 'bg-white hover:bg-sky-100 text-sky-700 shadow hover:shadow-md'}`}
  >
    {focus}
  </button>
);

const DurationOptionButton: React.FC<{
  duration: number;
  selectedDuration: number | null;
  onClick: (duration: number) => void;
}> = ({ duration, selectedDuration, onClick }) => (
  <button
    onClick={() => onClick(duration)}
    className={`py-2 px-4 rounded-md font-medium transition-all min-w-[4rem]
                ${selectedDuration === duration ? 'bg-sky-600 text-white shadow-md ring-2 ring-sky-300' : 'bg-white hover:bg-sky-100 text-sky-700 shadow hover:shadow-md'}`}
  >
    {duration} min
  </button>
);


const ExercisesPage: React.FC = () => {
  const [selectedFocus, setSelectedFocus] = useState<ExerciseFocusEnum | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [showExercisePlayer, setShowExercisePlayer] = useState(false);

  const handleStartExercise = () => {
    if (selectedFocus && selectedDuration) {
      setShowExercisePlayer(true);
    }
  };

  const handleClosePlayer = () => {
    setShowExercisePlayer(false);
    // Optionally reset selections
    // setSelectedFocus(null);
    // setSelectedDuration(null);
  };

  if (showExercisePlayer && selectedFocus && selectedDuration) {
    return <ExercisePlayer focus={selectedFocus} durationMinutes={selectedDuration} onClose={handleClosePlayer} />;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">Ejercicios de Mindfulness</h2>

      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xl space-y-8">
        <div>
          <h3 className="text-xl font-semibold text-sky-700 mb-4">1. Elige tu Enfoque</h3>
          <div className="space-y-3">
            {(Object.keys(ExerciseFocusEnum) as Array<keyof typeof ExerciseFocusEnum>).map((key) => (
               <FocusOptionButton
                key={key}
                focus={ExerciseFocusEnum[key]}
                selectedFocus={selectedFocus}
                onClick={setSelectedFocus}
              />
            ))}
          </div>
        </div>

        {selectedFocus && (
          <div>
            <h3 className="text-xl font-semibold text-sky-700 mb-4">2. Elige la Duración</h3>
            <div className="flex flex-wrap gap-3">
              {DEFAULT_EXERCISE_DURATIONS.map((duration) => (
                <DurationOptionButton
                  key={duration}
                  duration={duration}
                  selectedDuration={selectedDuration}
                  onClick={setSelectedDuration}
                />
              ))}
            </div>
          </div>
        )}

        {selectedFocus && selectedDuration && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <button
              onClick={handleStartExercise}
              disabled={!selectedFocus || !selectedDuration}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-lg text-lg shadow-md hover:shadow-lg transition-all disabled:bg-slate-300 disabled:shadow-none"
            >
              Comenzar Ejercicio
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExercisesPage;