
import React from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ExercisesPage from './pages/ExercisesPage';
import ChallengesPage from './pages/ChallengesPage';
import FocusGamesPage from './pages/FocusGamesPage';
import JournalPage from './pages/JournalPage';
import { JournalProvider } from './contexts/JournalContext';
import { ChallengesProvider } from './contexts/ChallengesContext';

// Heroicon SVGs (inline for simplicity, consider a library for more icons)
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" /></svg>;
const ExerciseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>;
const ChallengeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.82m5.84-2.56a16.978 16.978 0 00-5.84-2.56M12 12A2.25 2.25 0 0114.25 14.25v4.82m-4.5 0V19.07a2.25 2.25 0 01-2.25-2.25c0-1.03.822-1.873 1.845-2.038M21.75 9.75A9 9 0 0012 3.75M3.25 9.75A9 9 0 0112 3.75m0 16.5V15" /></svg>;
const FocusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h3m-3 0V3.75A2.25 2.25 0 0112.75 1.5h.5A2.25 2.25 0 0115.5 3.75V6m-3 0h3m-3 0H7.5V3.75A2.25 2.25 0 005.25 1.5h-.5A2.25 2.25 0 002.5 3.75V6m3 0V9m6-3V9m-6 6h3m-3 0v3A2.25 2.25 0 007.5 22.5h.5a2.25 2.25 0 002.25-2.25V15m3 0h3m-3 0v3a2.25 2.25 0 012.25 2.25h.5a2.25 2.25 0 012.25-2.25V15m-3 0H16.5m0 0V9" /></svg>;
const JournalIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>;

const NavItem: React.FC<{ to: string; label: string; icon: React.ReactNode }> = ({ to, label, icon }) => {
  const location = useLocation();
  const isActive = location.pathname === to || (to === "/" && location.pathname.startsWith("/#")); // Fix for HashRouter initial load

  return (
    <Link
      to={to}
      className={`flex flex-col items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out
                  ${isActive ? 'text-sky-600 bg-sky-100' : 'text-slate-600 hover:text-sky-500 hover:bg-slate-200'}`}
    >
      {icon}
      <span className="mt-1">{label}</span>
    </Link>
  );
};

const App: React.FC = () => {
  return (
    <JournalProvider>
      <ChallengesProvider>
        <HashRouter>
          <div className="flex flex-col min-h-screen">
            <header className="bg-white shadow-md sticky top-0 z-50">
              <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-sky-700">Mindful Moments</h1>
              </div>
            </header>

            <main className="flex-grow container mx-auto px-4 py-6">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/exercises" element={<ExercisesPage />} />
                <Route path="/challenges" element={<ChallengesPage />} />
                <Route path="/focus" element={<FocusGamesPage />} />
                <Route path="/journal" element={<JournalPage />} />
              </Routes>
            </main>

            <nav className="bg-white shadow-t border-t border-slate-200 sticky bottom-0 z-50">
              <div className="container mx-auto px-2 sm:px-4 py-2 flex justify-around">
                <NavItem to="/" label="Inicio" icon={<HomeIcon />} />
                <NavItem to="/exercises" label="Ejercicios" icon={<ExerciseIcon />} />
                <NavItem to="/challenges" label="Retos" icon={<ChallengeIcon />} />
                <NavItem to="/focus" label="Enfoque" icon={<FocusIcon />} />
                <NavItem to="/journal" label="Bitácora" icon={<JournalIcon />} />
              </div>
            </nav>
          </div>
        </HashRouter>
      </ChallengesProvider>
    </JournalProvider>
  );
};

export default App;
