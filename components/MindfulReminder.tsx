
import React, { useState, useEffect, useCallback, useRef } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { OBSERVER_MODE_REMINDERS, APP_ICON_DATA_URI, REMINDER_FREQUENCIES, DEFAULT_REMINDER_FREQUENCY } from '../constants';

const EyeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.432 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>

const MindfulReminder: React.FC = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [remindersEnabled, setRemindersEnabled] = useLocalStorage('mindfulRemindersEnabled', false);
  const [frequency, setFrequency] = useLocalStorage('reminderFrequency', DEFAULT_REMINDER_FREQUENCY);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      alert('Este navegador no soporta notificaciones de escritorio.');
      return;
    }
    const status = await Notification.requestPermission();
    setPermission(status);
    if (status === 'granted') {
      setRemindersEnabled(true);
    }
  };

  const sendNotification = useCallback(() => {
    if (permission === 'granted') {
      const randomIndex = Math.floor(Math.random() * OBSERVER_MODE_REMINDERS.length);
      const randomReminder = OBSERVER_MODE_REMINDERS[randomIndex];
      new Notification('Observador Silencioso', {
        body: randomReminder,
        icon: APP_ICON_DATA_URI,
        silent: true,
      });
    }
  }, [permission]);

  useEffect(() => {
    if (remindersEnabled && permission === 'granted') {
      if (intervalRef.current) clearInterval(intervalRef.current);
      // Send one immediately for feedback when enabled or frequency changes
      sendNotification();
       // Set a new interval based on selected frequency
      intervalRef.current = window.setInterval(sendNotification, frequency);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [remindersEnabled, permission, frequency, sendNotification]);

  const handleToggle = () => {
    if (permission === 'default') {
      requestPermission();
    } else if (permission === 'granted') {
      setRemindersEnabled(prev => !prev);
    }
  };

  const handleFrequencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFrequency(Number(e.target.value));
  };
  
  const getButtonState = () => {
    if (permission === 'denied') {
      return { text: 'Notificaciones Bloqueadas', disabled: true, className: 'bg-red-200 text-red-700 cursor-not-allowed' };
    }
    if (remindersEnabled && permission === 'granted') {
      return { text: 'Desactivar Modo', disabled: false, className: 'bg-amber-500 hover:bg-amber-600 text-white' };
    }
    return { text: 'Activar Modo Observador', disabled: false, className: 'bg-sky-500 hover:bg-sky-600 text-white' };
  };

  const buttonState = getButtonState();

  if (!('Notification' in window)) {
      return null; // Don't render component if notifications are not supported
  }

  return (
    <section className="bg-white p-6 rounded-xl border border-slate-200">
      <h3 className="text-xl font-semibold text-sky-700 mb-3 flex items-center">
        <EyeIcon /> Modo: Observador Silencioso
      </h3>
      <p className="text-slate-600 mb-4">
        Recibe recordatorios para "mirar sin juzgar" lo que ocurre a tu alrededor y volver al presente.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleToggle}
          disabled={buttonState.disabled}
          className={`w-full py-2 px-4 rounded-md font-semibold transition-colors flex items-center justify-center ${buttonState.className}`}
        >
          {buttonState.text}
        </button>

        {remindersEnabled && permission === 'granted' && (
          <div className="relative w-full sm:w-auto">
             <label htmlFor="frequency-select" className="sr-only">Frecuencia</label>
            <select
              id="frequency-select"
              value={frequency}
              onChange={handleFrequencyChange}
              className="w-full h-full appearance-none bg-slate-100 border border-slate-300 text-slate-700 font-semibold py-2 px-4 pr-8 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {REMINDER_FREQUENCIES.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        )}
      </div>

      {permission === 'denied' && (
        <p className="text-xs text-slate-500 mt-2 text-center">
          Para habilitar las notificaciones, necesitas cambiar los permisos para este sitio en la configuración de tu navegador.
        </p>
      )}
    </section>
  );
};

export default MindfulReminder;
