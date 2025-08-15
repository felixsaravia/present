
// Renamed from MINDFUL_REMINDERS for clarity
export const GENERAL_MINDFUL_REMINDERS = [
  "Respira. Estás aquí.",
  "El ahora es suficiente.",
  "¿Dónde está tu atención en este momento?",
  "Observa tu alrededor sin juzgar.",
  "Siente el contacto de tus pies con el suelo.",
  "Haz una pausa y simplemente sé.",
  "¿Qué sensaciones notas en tu cuerpo ahora mismo?",
  "Escucha los sonidos a tu alrededor sin etiquetarlos."
];

export const OBSERVER_MODE_REMINDERS = [
  "¿Qué ves ahora mismo, sin añadirle una historia?",
  "Observa un objeto cercano. Nota su color y textura sin nombrarlo.",
  "Escucha el sonido más lejano que puedas percibir.",
  "Siente el aire en tu piel por un momento.",
  "¿Qué olor puedes detectar en este instante?",
  "Simplemente mira por la ventana durante 30 segundos, sin expectativas.",
  "Nota la sensación de tu respiración en tu cuerpo, sin cambiarla.",
  "Observa el juego de luces y sombras a tu alrededor."
];


export const APP_NAME = "Mindful Moments";
export const GEMINI_API_KEY_ENV_VAR = "API_KEY"; // This is an illustrative constant, actual key is from process.env

export const DEFAULT_EXERCISE_DURATIONS = [1, 2, 3, 4, 5]; // minutes

export const FOCUS_GAME_MOVING_DOT_ID = "moving-dot";
export const FOCUS_GAME_SEQUENCE_MEMORY_ID = "sequence-memory";
export const FOCUS_GAME_REACTION_ID = "reaction-visual";
export const FOCUS_GAME_CONTEXTUAL_ID = "contextual-focus"; // New game ID

export const GEMINI_TEXT_MODEL = "gemini-2.5-flash";

export const APP_ICON_DATA_URI = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%230EA5E9'><path d='M12 0L13.65 8.35L22 10L13.65 11.65L12 20L10.35 11.65L2 10L10.35 8.35L12 0Z' /></svg>";

export const REMINDER_FREQUENCIES = [
    { value: 30 * 60 * 1000, label: 'Cada 30 min' },
    { value: 60 * 60 * 1000, label: 'Cada hora' },
    { value: 2 * 60 * 60 * 1000, label: 'Cada 2 horas' },
];
export const DEFAULT_REMINDER_FREQUENCY = 60 * 60 * 1000; // Default to 1 hour
