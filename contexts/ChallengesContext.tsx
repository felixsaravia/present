
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { MindfulnessChallenge } from '../types';
import { generateDailyChallenge } from '../services/geminiService';

interface ChallengesContextType {
  currentChallenge: MindfulnessChallenge | null;
  isLoadingChallenge: boolean;
  challengeError: string | null;
  fetchNewChallenge: () => Promise<void>;
  toggleChallengeCompletion: (id: string) => void;
  completedChallengesToday: () => boolean;
  currentSystemDate: string; // Added to expose the consistently updated date
}

const ChallengesContext = createContext<ChallengesContextType | undefined>(undefined);

export const ChallengesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [challenges, setChallenges] = useLocalStorage<MindfulnessChallenge[]>('mindfulnessChallenges', []);
  const [currentChallenge, setCurrentChallenge] = useState<MindfulnessChallenge | null>(null);
  const [isLoadingChallenge, setIsLoadingChallenge] = useState<boolean>(false);
  const [challengeError, setChallengeError] = useState<string | null>(null);

  const getTodayDateString = useCallback(() => new Date().toISOString().split('T')[0], []);
  const [currentSystemDate, setCurrentSystemDate] = useState(() => getTodayDateString());

  useEffect(() => {
    const updateCurrentSystemDate = () => {
      const newDateStr = getTodayDateString();
      setCurrentSystemDate(prevDateStr => {
        if (newDateStr !== prevDateStr) {
          return newDateStr;
        }
        return prevDateStr;
      });
    };

    updateCurrentSystemDate(); 

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        updateCurrentSystemDate();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    const intervalId = setInterval(updateCurrentSystemDate, 30 * 1000); 

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(intervalId);
    };
  }, [getTodayDateString]);

  const fetchNewChallenge = useCallback(async () => {
    setIsLoadingChallenge(true);
    setChallengeError(null); 
    const todayForFetch = getTodayDateString(); 

    try {
      const existingTodayChallenge = challenges.find(c => c.date === todayForFetch);
      if (existingTodayChallenge) {
        setCurrentChallenge(existingTodayChallenge);
        setIsLoadingChallenge(false);
        return;
      }

      const description = await generateDailyChallenge();
      if (description.startsWith("Error:") || description.startsWith("No se pudo")) {
        setChallengeError(description);
        // Set a temporary currentChallenge with error status for today if API fails
        setCurrentChallenge({
          id: `error-${todayForFetch}`,
          description: "Error al cargar",
          date: todayForFetch,
          isCompleted: false,
        });

      } else {
        const newChallengeData: MindfulnessChallenge = {
          id: `challenge-${todayForFetch}`,
          description,
          date: todayForFetch,
          isCompleted: false,
        };
        setChallenges(prev => {
            const otherChallenges = prev.filter(c => c.date !== todayForFetch);
            return [newChallengeData, ...otherChallenges];
        });
        setCurrentChallenge(newChallengeData);
      }
    } catch (error) {
      console.error("Error in fetchNewChallenge:", error);
      setChallengeError("Ocurrió un error al obtener el reto.");
      setCurrentChallenge({
          id: `error-${todayForFetch}`,
          description: "Error al cargar",
          date: todayForFetch,
          isCompleted: false,
      });
    } finally {
      setIsLoadingChallenge(false);
    }
  }, [challenges, setChallenges, getTodayDateString]); // Removed currentSystemDate from here, fetch should use current moment

  useEffect(() => {
    const today = currentSystemDate; 

    if (isLoadingChallenge) {
      return; 
    }
    
    const challengeIsForToday = currentChallenge && currentChallenge.date === today;

    if (challengeIsForToday && !challengeError && !currentChallenge.description.startsWith("Error")) {
      return; // Correct challenge for today is loaded and no error
    }

    if (challengeIsForToday && (challengeError || currentChallenge.description.startsWith("Error"))) {
      return; // An attempt for today's challenge already happened and resulted in an error state, don't retry automatically.
    }
    
    if (challengeError && (!currentChallenge || currentChallenge.date !== today)) {
        setChallengeError(null); // Clear error if it's for a previous day
    }

    const challengeFromStorage = challenges.find(c => c.date === today);

    if (challengeFromStorage) {
      setCurrentChallenge(challengeFromStorage);
      if (challengeError && challengeFromStorage.date === today) { // If storage has valid, clear error
        setChallengeError(null);
      }
    } else {
      // Not in storage, and conditions above ensure we don't re-fetch if an error for 'today' already occurred.
      // This means if we reach here, it's a new day or initial load without a stored challenge for today.
      fetchNewChallenge();
    }
  }, [currentSystemDate, challenges, currentChallenge, fetchNewChallenge, isLoadingChallenge, challengeError]);


  const toggleChallengeCompletion = (id: string) => {
    const challengeToUpdate = challenges.find(c => c.id === id);
    if (!challengeToUpdate || challengeToUpdate.id.startsWith("error-")) return;


    const updatedChallenge = { ...challengeToUpdate, isCompleted: !challengeToUpdate.isCompleted };

    setChallenges(prevChallenges =>
      prevChallenges.map(c => (c.id === id ? updatedChallenge : c))
    );
    if (currentChallenge && currentChallenge.id === id) {
      setCurrentChallenge(updatedChallenge);
    }
  };

  const completedChallengesToday = () => {
    const today = getTodayDateString(); 
    return challenges.some(c => c.date === today && c.isCompleted && !c.id.startsWith("error-") );
  };


  return (
    <ChallengesContext.Provider value={{ 
        currentChallenge, 
        isLoadingChallenge, 
        challengeError, 
        fetchNewChallenge, 
        toggleChallengeCompletion, 
        completedChallengesToday,
        currentSystemDate // Expose currentSystemDate
    }}>
      {children}
    </ChallengesContext.Provider>
  );
};

export const useChallenges = (): ChallengesContextType => {
  const context = useContext(ChallengesContext);
  if (context === undefined) {
    throw new Error('useChallenges must be used within a ChallengesProvider');
  }
  return context;
};
