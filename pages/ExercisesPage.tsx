
import React, { useState } from 'react';
import { DEFAULT_EXERCISE_DURATIONS } from '../constants';
import ExercisePlayer from '../components/ExercisePlayer';
import ImageGenerationExercise from '../components/ImageGenerationExercise'; // New component
import { ExerciseFocus as ExerciseFocusEnum } from '../types';

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
  const [imagePrompt, setImagePrompt] = useState<string>('');
  const [currentExerciseMode, setCurrentExerciseMode] = useState<'player' | 'imageGenerator' | null>(null);

  const handleStartExercise = () => {
    if (selectedFocus === ExerciseFocusEnum.IMAGE_GENERATION) {
      if (imagePrompt.trim()) {
        setCurrentExerciseMode('imageGenerator');
      } else {
        alert("Por favor, escribe una idea para la imagen.");
      }
    } else if (selectedFocus && selectedDuration) {
      setCurrentExerciseMode('player');
    }
  };

  const handleCloseExercise = () => {
    setCurrentExerciseMode(null);
    // Optionally reset selections, but for image prompt, user might want to keep it to retry/adjust
    // setSelectedFocus(null);
    // setSelectedDuration(null);
    // setImagePrompt(''); 
  };

  if (currentExerciseMode === 'player' && selectedFocus && selectedFocus !== ExerciseFocusEnum.IMAGE_GENERATION && selectedDuration) {
    return <ExercisePlayer focus={selectedFocus} durationMinutes={selectedDuration} onClose={handleCloseExercise} />;
  }

  if (currentExerciseMode === 'imageGenerator' && selectedFocus === ExerciseFocusEnum.IMAGE_GENERATION) {
    return <ImageGenerationExercise prompt={imagePrompt} onClose={handleCloseExercise} />;
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
                onClick={(focus) => {
                  setSelectedFocus(focus);
                  // Reset other options if focus changes
                  setSelectedDuration(null); 
                  if (focus !== ExerciseFocusEnum.IMAGE_GENERATION) setImagePrompt('');
                }}
              />
            ))}
          </div>
        </div>

        {selectedFocus && selectedFocus === ExerciseFocusEnum.IMAGE_GENERATION && (
          <div>
            <h3 className="text-xl font-semibold text-sky-700 mb-4">2. Describe tu Imagen</h3>
            <textarea
              value={imagePrompt}
              onChange={(e) => setImagePrompt(e.target.value)}
              rows={3}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 transition-shadow shadow-sm focus:shadow-md"
              placeholder="Ej: Un bosque tranquilo al amanecer, una sensación de paz en colores pastel..."
            />
          </div>
        )}

        {selectedFocus && selectedFocus !== ExerciseFocusEnum.IMAGE_GENERATION && (
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

        {selectedFocus && 
         ((selectedFocus === ExerciseFocusEnum.IMAGE_GENERATION && imagePrompt.trim() !== '') || 
          (selectedFocus !== ExerciseFocusEnum.IMAGE_GENERATION && selectedDuration)) && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <button
              onClick={handleStartExercise}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-lg text-lg shadow-md hover:shadow-lg transition-all"
            >
              {selectedFocus === ExerciseFocusEnum.IMAGE_GENERATION ? 'Generar Imagen' : 'Comenzar Ejercicio'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExercisesPage;