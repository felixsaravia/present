
import React, { useState } from 'react';
import { DEFAULT_EXERCISE_DURATIONS } from '../constants';
import ExercisePlayer from '../components/ExercisePlayer';
import { ExerciseFocus as ExerciseFocusEnum } from '../types';
import { generateDynamicMeditation, generateEgoReflection } from '../services/geminiService';
import LoadingSpinner from '../components/LoadingSpinner';
import ReflectionViewer from '../components/ReflectionViewer';

const SparklesIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L1.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.25 12L17 13.75M19.5 15l-1.25-1.75M19.5 15V12.5M19.5 15H17M12.75 18.25L11 17M5.25 6.75L4 5M18.75 3.75h.75M19.5 6.75v.75m0-.75L18 5.25m1.5 1.5H18.5" /></svg>;
const EgoIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}><path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM12 8.25h.01M12 15.75h.01" /></svg>;


const FocusOptionButton: React.FC<{
  focus: ExerciseFocusEnum;
  selectedFocus: ExerciseFocusEnum | null;
  onClick: (focus: ExerciseFocusEnum) => void;
  children: React.ReactNode;
}> = ({ focus, selectedFocus, onClick, children }) => (
  <button
    onClick={() => onClick(focus)}
    className={`w-full py-3 px-4 rounded-lg text-left font-medium transition-all border
                ${selectedFocus === focus ? 'bg-sky-600 text-white border-sky-600' : 'bg-white hover:bg-sky-50 text-sky-700 border-slate-300 hover:border-sky-400'}`}
  >
    {children}
  </button>
);

const DurationOptionButton: React.FC<{
  duration: number;
  selectedDuration: number | null;
  onClick: (duration: number) => void;
}> = ({ duration, selectedDuration, onClick }) => (
  <button
    onClick={() => onClick(duration)}
    className={`py-2 px-4 rounded-md font-medium transition-all min-w-[4rem] border
                ${selectedDuration === duration ? 'bg-sky-600 text-white border-sky-600' : 'bg-white hover:bg-sky-50 text-sky-700 border-slate-300 hover:border-sky-400'}`}
  >
    {duration} min
  </button>
);


const ExercisesPage: React.FC = () => {
  const [selectedFocus, setSelectedFocus] = useState<ExerciseFocusEnum | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [currentExerciseMode, setCurrentExerciseMode] = useState<'player' | 'reflection' | null>(null);

  // States for Dynamic Meditation
  const [dynamicMeditationInput, setDynamicMeditationInput] = useState<string>('');
  const [generatedMeditationScript, setGeneratedMeditationScript] = useState<string | null>(null);
  const [isLoadingDynamicMeditation, setIsLoadingDynamicMeditation] = useState<boolean>(false);
  const [dynamicMeditationError, setDynamicMeditationError] = useState<string | null>(null);

  // States for Ego Reflection
  const [egoSituationInput, setEgoSituationInput] = useState<string>('');
  const [generatedReflection, setGeneratedReflection] = useState<string | null>(null);
  const [isLoadingReflection, setIsLoadingReflection] = useState<boolean>(false);
  const [reflectionError, setReflectionError] = useState<string | null>(null);


  const handleStartExercise = async () => {
    if (!selectedFocus) return;

    if (selectedFocus === ExerciseFocusEnum.DYNAMIC_MEDITATION) {
      if (!dynamicMeditationInput.trim() || !selectedDuration) return;
      setIsLoadingDynamicMeditation(true);
      setDynamicMeditationError(null);
      setGeneratedMeditationScript(null);
      try {
        const script = await generateDynamicMeditation(dynamicMeditationInput, selectedDuration);
        if (script.startsWith("Error:") || script.startsWith("No se pudo")) {
          setDynamicMeditationError(script);
        } else {
          setGeneratedMeditationScript(script);
          setCurrentExerciseMode('player');
        }
      } catch (error) {
        console.error("Error generating dynamic meditation:", error);
        setDynamicMeditationError("Ocurrió un error inesperado al generar la meditación.");
      } finally {
        setIsLoadingDynamicMeditation(false);
      }
    } else if (selectedFocus === ExerciseFocusEnum.EGO_REFLECTION) {
      if (!egoSituationInput.trim()) {
        setReflectionError("Por favor, describe la situación que activó tu ego.");
        return;
      }
      setIsLoadingReflection(true);
      setReflectionError(null);
      setGeneratedReflection(null);
      try {
          const reflection = await generateEgoReflection(egoSituationInput);
          if (reflection.startsWith("Error:") || reflection.startsWith("No se pudo")) {
              setReflectionError(reflection);
          } else {
              setGeneratedReflection(reflection);
              setCurrentExerciseMode('reflection');
          }
      } catch (error) {
          console.error("Error generating ego reflection:", error);
          setReflectionError("Ocurrió un error inesperado al generar la reflexión.");
      } finally {
          setIsLoadingReflection(false);
      }
    } else {
      // Standard exercise
      if (!selectedDuration) return;
      setCurrentExerciseMode('player');
    }
  };

  const handleCloseExercise = () => {
    setCurrentExerciseMode(null);
    setGeneratedMeditationScript(null);
    setGeneratedReflection(null);
  };

  if (currentExerciseMode === 'reflection' && generatedReflection) {
      return <ReflectionViewer 
                situation={egoSituationInput} 
                reflectionText={generatedReflection} 
                onClose={handleCloseExercise} 
             />;
  }
  
  if (currentExerciseMode === 'player' && selectedFocus && selectedDuration) {
    if (selectedFocus === ExerciseFocusEnum.DYNAMIC_MEDITATION && generatedMeditationScript) {
      return <ExercisePlayer 
                focus={selectedFocus} 
                durationMinutes={selectedDuration} 
                onClose={handleCloseExercise} 
                customInstructions={generatedMeditationScript}
                customTitle="Meditación Dinámica Personalizada"
             />;
    } else if (selectedFocus !== ExerciseFocusEnum.DYNAMIC_MEDITATION && selectedFocus !== ExerciseFocusEnum.EGO_REFLECTION) {
      return <ExercisePlayer 
                focus={selectedFocus} 
                durationMinutes={selectedDuration} 
                onClose={handleCloseExercise} 
             />;
    }
    if(selectedFocus === ExerciseFocusEnum.DYNAMIC_MEDITATION && !generatedMeditationScript && !isLoadingDynamicMeditation){
        setCurrentExerciseMode(null); 
    }
  }


  const getButtonText = () => {
    if (selectedFocus === ExerciseFocusEnum.DYNAMIC_MEDITATION) return 'Generar Meditación Personalizada';
    if (selectedFocus === ExerciseFocusEnum.EGO_REFLECTION) return 'Generar Reflexión';
    return 'Comenzar Ejercicio';
  };
  
  const isReadyToStart = (selectedFocus && selectedFocus !== ExerciseFocusEnum.EGO_REFLECTION && selectedDuration) || 
                          (selectedFocus === ExerciseFocusEnum.EGO_REFLECTION && egoSituationInput.trim() !== '');


  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">Ejercicios de Mindfulness</h2>

      <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 space-y-8">
        <div>
          <h3 className="text-xl font-semibold text-sky-700 mb-4">1. Elige tu Práctica</h3>
          <div className="space-y-3">
            {(Object.values(ExerciseFocusEnum) as ExerciseFocusEnum[]).map((focusEnumMember) => (
               <FocusOptionButton
                key={focusEnumMember}
                focus={focusEnumMember}
                selectedFocus={selectedFocus}
                onClick={(f) => {
                  setSelectedFocus(f);
                  setSelectedDuration(null);
                  setDynamicMeditationInput(''); 
                  setDynamicMeditationError(null);
                  setGeneratedMeditationScript(null);
                  setEgoSituationInput('');
                  setReflectionError(null);
                  setGeneratedReflection(null);
                  setCurrentExerciseMode(null); 
                }}
              >
                <div className="flex items-center">
                  {focusEnumMember === ExerciseFocusEnum.DYNAMIC_MEDITATION && <SparklesIcon className="w-5 h-5 mr-2 text-yellow-400" />}
                  {focusEnumMember === ExerciseFocusEnum.EGO_REFLECTION && <EgoIcon className="w-5 h-5 mr-2 text-purple-400" />}
                  {focusEnumMember}
                </div>
              </FocusOptionButton>
            ))}
          </div>
        </div>
        
        {selectedFocus === ExerciseFocusEnum.DYNAMIC_MEDITATION && (
          <div>
            <h3 className="text-xl font-semibold text-sky-700 mb-2">Describe tu necesidad para la meditación:</h3>
            <textarea
              value={dynamicMeditationInput}
              onChange={(e) => {
                setDynamicMeditationInput(e.target.value);
                if(dynamicMeditationError) setDynamicMeditationError(null);
              }}
              rows={4}
              className="w-full p-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
              placeholder="Ej: Estoy estresado por el trabajo, quiero sentir más calma y claridad..."
            />
            {dynamicMeditationError && <p className="text-sm text-red-600 mt-1">{dynamicMeditationError}</p>}
          </div>
        )}

        {selectedFocus === ExerciseFocusEnum.EGO_REFLECTION && (
          <div>
            <h3 className="text-xl font-semibold text-sky-700 mb-2">Describe la situación:</h3>
            <p className="text-sm text-slate-600 mb-3">¿Qué pensamiento o evento activó una reacción de tu ego? (Ej: "Sentí envidia al ver el éxito de un amigo", "Me molestó que no reconocieran mi trabajo", "Necesitaba tener la razón en una discusión").</p>
            <textarea
                value={egoSituationInput}
                onChange={(e) => {
                    setEgoSituationInput(e.target.value);
                    if (reflectionError) setReflectionError(null);
                }}
                rows={4}
                className="w-full p-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                placeholder="Describe brevemente lo que pasó y cómo te sentiste..."
            />
            {reflectionError && <p className="text-sm text-red-600 mt-1">{reflectionError}</p>}
          </div>
        )}

        {selectedFocus && selectedFocus !== ExerciseFocusEnum.EGO_REFLECTION && ( 
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
        
        {isLoadingDynamicMeditation && (
          <div className="pt-6 border-t border-slate-200">
            <LoadingSpinner text="Generando tu meditación personalizada..." />
          </div>
        )}
        
        {isLoadingReflection && (
          <div className="pt-6 border-t border-slate-200">
            <LoadingSpinner text="Generando tu reflexión..." />
          </div>
        )}

        {isReadyToStart && !isLoadingDynamicMeditation && !isLoadingReflection && ( 
          <div className="mt-8 pt-6 border-t border-slate-200">
            <button
              onClick={handleStartExercise}
              disabled={ (selectedFocus === ExerciseFocusEnum.DYNAMIC_MEDITATION && !dynamicMeditationInput.trim()) || (selectedFocus === ExerciseFocusEnum.EGO_REFLECTION && !egoSituationInput.trim()) }
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {getButtonText()}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExercisesPage;