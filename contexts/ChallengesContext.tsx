
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
}

const ChallengesContext = createContext<ChallengesContextType | undefined>(undefined);

export const ChallengesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [challenges, setChallenges] = useLocalStorage<MindfulnessChallenge[]>('mindfulnessChallenges', []);
  const [currentChallenge, setCurrentChallenge] = useState<MindfulnessChallenge | null>(null);
  const [isLoadingChallenge, setIsLoadingChallenge] = useState<boolean>(false);
  const [challengeError, setChallengeError] = useState<string | null>(null);

  const getTodayDateString = () => new Date().toISOString().split('T')[0];

  const fetchNewChallenge = useCallback(async () => {
    setIsLoadingChallenge(true);
    setChallengeError(null);
    try {
      const today = getTodayDateString();
      const existingTodayChallenge = challenges.find(c => c.date === today);

      if (existingTodayChallenge) {
        setCurrentChallenge(existingTodayChallenge);
      } else {
        const description = await generateDailyChallenge();
        if (description.startsWith("Error:") || description.startsWith("No se pudo")) {
          setChallengeError(description);
          setCurrentChallenge(null); // Or keep previous day's challenge? For now, null.
        } else {
          const newChallenge: MindfulnessChallenge = {
            id: `challenge-${today}`,
            description,
            date: today,
            isCompleted: false,
          };
          setChallenges(prev => [newChallenge, ...prev.filter(c => c.date !== today)]); // Replace if somehow duplicated, then add
          setCurrentChallenge(newChallenge);
        }
      }
    } catch (error) {
      console.error("Error in fetchNewChallenge:", error);
      setChallengeError("Ocurrió un error al obtener el reto.");
      setCurrentChallenge(null);
    } finally {
      setIsLoadingChallenge(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setChallenges]); // challenges dependency removed to avoid loop if generateDailyChallenge fails and returns an error string

 useEffect(() => {
    const today = getTodayDateString();
    const todayChallenge = challenges.find(c => c.date === today);
    if (todayChallenge) {
      setCurrentChallenge(todayChallenge);
    } else {
      fetchNewChallenge();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount


  const toggleChallengeCompletion = (id: string) => {
    setChallenges(prevChallenges =>
      prevChallenges.map(c => (c.id === id ? { ...c, isCompleted: !c.isCompleted } : c))
    );
    setCurrentChallenge(prev => (prev && prev.id === id ? { ...prev, isCompleted: !prev.isCompleted } : prev));
  };

  const completedChallengesToday = () => {
    const today = getTodayDateString();
    return challenges.some(c => c.date === today && c.isCompleted);
  };


  return (
    <ChallengesContext.Provider value={{ currentChallenge, isLoadingChallenge, challengeError, fetchNewChallenge, toggleChallengeCompletion, completedChallengesToday }}>
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
