
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

  const getTodayDateString = useCallback(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  const [currentSystemDate, setCurrentSystemDate] = useState(() => getTodayDateString());

  useEffect(() => {
    const updateCurrentSystemDate = () => {
      const newDateStr = getTodayDateString();
      setCurrentSystemDate(prevDateStr => {
        if (newDateStr !== prevDateStr) {
          // Date has changed, fetch new challenge or update view
          // This will trigger the other useEffect to fetch if necessary
          return newDateStr;
        }
        return prevDateStr;
      });
    };

    updateCurrentSystemDate(); // Initial check

    // Update when tab becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        updateCurrentSystemDate();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    // Also check periodically, e.g., every 30 seconds, in case the app is left open across midnight
    const intervalId = setInterval(updateCurrentSystemDate, 30 * 1000); 

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(intervalId);
    };
  }, [getTodayDateString]);

  const fetchNewChallenge = useCallback(async () => {
    setIsLoadingChallenge(true);
    setChallengeError(null); 
    const todayForFetch = getTodayDateString(); // Use local date for fetching

    try {
      // Check if a challenge for today (local date) already exists in localStorage
      const existingTodayChallenge = challenges.find(c => c.date === todayForFetch);
      if (existingTodayChallenge) {
        setCurrentChallenge(existingTodayChallenge);
        setIsLoadingChallenge(false);
        return;
      }

      // If not, generate a new one
      const description = await generateDailyChallenge();
      if (description.startsWith("Error:") || description.startsWith("No se pudo")) {
        setChallengeError(description);
        // Set a temporary currentChallenge with error status for today if API fails
        setCurrentChallenge({
          id: `error-${todayForFetch}`,
          description: "Error al cargar el reto.", // More user-friendly error
          date: todayForFetch,
          isCompleted: false,
        });

      } else {
        const newChallengeData: MindfulnessChallenge = {
          id: `challenge-${todayForFetch}`, // Ensure ID is based on local date
          description,
          date: todayForFetch,
          isCompleted: false,
        };
        setChallenges(prev => {
            // Remove any old challenge for this date (e.g., if there was an error entry)
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
          description: "Error al cargar el reto.",
          date: todayForFetch,
          isCompleted: false,
      });
    } finally {
      setIsLoadingChallenge(false);
    }
  }, [challenges, setChallenges, getTodayDateString]);

  useEffect(() => {
    const today = currentSystemDate; // This is now guaranteed to be local YYYY-MM-DD

    if (isLoadingChallenge) {
      return; // Don't do anything if a challenge is already being loaded
    }
    
    // Check if the currently displayed challenge is for today (local)
    const challengeIsForToday = currentChallenge && currentChallenge.date === today;

    // If correct challenge for today is loaded and no error, do nothing
    if (challengeIsForToday && !challengeError && !currentChallenge.description.startsWith("Error")) {
      return; 
    }

    // If an attempt for today's challenge already happened and resulted in an error state, don't retry automatically.
    // User can retry manually if a retry button is available on the UI.
    if (challengeIsForToday && (challengeError || (currentChallenge && currentChallenge.id.startsWith("error-")))) {
      return; 
    }
    
    // If there's an error but it's for a previous day's challenge, clear it
    if (challengeError && (!currentChallenge || currentChallenge.date !== today)) {
        setChallengeError(null); 
    }

    // Try to load challenge for 'today' (local) from storage
    const challengeFromStorage = challenges.find(c => c.date === today);

    if (challengeFromStorage) {
      setCurrentChallenge(challengeFromStorage);
      // If storage has a valid challenge for today, clear any lingering error for today
      if (challengeError && challengeFromStorage.date === today && !challengeFromStorage.id.startsWith("error-")) { 
        setChallengeError(null);
      }
    } else {
      // No challenge in storage for today (local), and conditions above ensure we don't re-fetch if an error for 'today' already occurred.
      // This means if we reach here, it's a new day (local) or initial load without a stored challenge for today.
      fetchNewChallenge();
    }
  }, [currentSystemDate, challenges, currentChallenge, fetchNewChallenge, isLoadingChallenge, challengeError]);


  const toggleChallengeCompletion = (id: string) => {
    const challengeToUpdate = challenges.find(c => c.id === id);
    // Do not allow completing an error placeholder
    if (!challengeToUpdate || challengeToUpdate.id.startsWith("error-")) return;


    const updatedChallenge = { ...challengeToUpdate, isCompleted: !challengeToUpdate.isCompleted };

    setChallenges(prevChallenges =>
      prevChallenges.map(c => (c.id === id ? updatedChallenge : c))
    );
    // Also update the currentChallenge if it's the one being toggled
    if (currentChallenge && currentChallenge.id === id) {
      setCurrentChallenge(updatedChallenge);
    }
  };

  const completedChallengesToday = () => {
    const today = getTodayDateString(); // Use local date for this check
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
        currentSystemDate // Expose currentSystemDate (now reliably local)
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
