
import React, { createContext, useContext, ReactNode } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { JournalEntry } from '../types';

interface JournalContextType {
  entries: JournalEntry[];
  addEntry: (doing: string, feeling: string) => void;
  deleteEntry: (id: string) => void;
}

const JournalContext = createContext<JournalContextType | undefined>(undefined);

export const JournalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [entries, setEntries] = useLocalStorage<JournalEntry[]>('journalEntries', []);

  const addEntry = (doing: string, feeling: string) => {
    const newEntry: JournalEntry = {
      id: new Date().toISOString(),
      doing,
      feeling,
      timestamp: Date.now(),
    };
    setEntries(prevEntries => [newEntry, ...prevEntries]);
  };

  const deleteEntry = (id: string) => {
    setEntries(prevEntries => prevEntries.filter(entry => entry.id !== id));
  };

  return (
    <JournalContext.Provider value={{ entries, addEntry, deleteEntry }}>
      {children}
    </JournalContext.Provider>
  );
};

export const useJournal = (): JournalContextType => {
  const context = useContext(JournalContext);
  if (context === undefined) {
    throw new Error('useJournal must be used within a JournalProvider');
  }
  return context;
};
