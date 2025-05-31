
import { PresenceCheckinPrompt } from './types';

export const APP_NAME = "Mindful Moments";
export const GEMINI_API_KEY_ENV_VAR = "API_KEY"; // This is an illustrative constant, actual key is from process.env

export const DEFAULT_EXERCISE_DURATIONS = [1, 2, 3, 4, 5]; // minutes

export const INITIAL_PRESENCE_CHECKIN_PROMPTS: PresenceCheckinPrompt[] = [
  { id: "pc1", question: "¿En qué estás pensando ahora?" },
  { id: "pc2", question: "¿Puedes nombrar 3 cosas que ves a tu alrededor?" },
  { id: "pc3", question: "Siente tus pies en el suelo por 10 segundos. ¿Qué notas?" },
  { id: "pc4", question: "¿Qué sonido puedes escuchar en este momento si prestas atención?" },
  { id: "pc5", question: "¿Cómo se siente tu respiración en este instante?" },
];

export const FOCUS_GAME_MOVING_DOT_ID = "moving-dot";
export const FOCUS_GAME_SEQUENCE_MEMORY_ID = "sequence-memory";
export const FOCUS_GAME_REACTION_ID = "reaction-visual";

export const GEMINI_TEXT_MODEL = "gemini-2.5-flash-preview-04-17";
