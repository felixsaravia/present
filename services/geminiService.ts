
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GEMINI_TEXT_MODEL }
from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY environment variable is not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! }); // Exclamation mark assumes API_KEY will be set by the environment

export async function generateMindfulnessExercise(focus: string, durationMinutes: number): Promise<string> {
  if (!API_KEY) return "Error: API Key no configurada.";
  try {
    const prompt = `Genera un ejercicio de mindfulness de ${durationMinutes} minutos enfocado en ${focus.toLowerCase()}. 
    Proporciona instrucciones claras y concisas, paso a paso. 
    El resultado debe ser un solo bloque de texto. No incluyas títulos ni introducciones como "Aquí tienes un ejercicio". Solo las instrucciones.`;
    
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating mindfulness exercise:", error);
    return "No se pudo generar el ejercicio. Inténtalo de nuevo más tarde.";
  }
}

export async function generateDailyChallenge(): Promise<string> {
  if (!API_KEY) return "Error: API Key no configurada.";
  try {
    const prompt = `Genera un reto de atención plena diario, simple y único, relacionado con actividades cotidianas.
    El resultado debe ser una sola frase concisa. Por ejemplo: "Hoy, camina prestando atención a cada paso." o "Come algo lentamente, saboreando cada bocado."
    No incluyas frases como "Aquí tienes tu reto:" o "Tu reto para hoy es:". Solo el reto en sí.`;
    
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating daily challenge:", error);
    return "No se pudo generar el reto. Inténtalo de nuevo más tarde.";
  }
}

export async function generatePresentNowActivity(): Promise<string> {
  if (!API_KEY) return "Error: API Key no configurada.";
  try {
    const prompt = `Genera una técnica de anclaje al presente de 1 minuto para ayudar a reducir la ansiedad y centrar la atención. 
    Proporciona instrucciones muy concisas y directas. El resultado debe ser un solo bloque de texto.
    No incluyas títulos ni introducciones. Solo las instrucciones.`;
    
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: prompt,
      config: { thinkingConfig: { thinkingBudget: 0 } } // For faster response
    });
    return response.text;
  } catch (error) {
    console.error("Error generating Present Now activity:", error);
    return "No se pudo generar la actividad. Inténtalo de nuevo más tarde.";
  }
}

export async function generatePresenceCheckinQuestions(count: number = 1): Promise<string[]> {
  if (!API_KEY) return ["Error: API Key no configurada."];
  try {
    const prompt = `Genera ${count} pregunta${count > 1 ? 's' : ''} corta${count > 1 ? 's' : ''} y distinta${count > 1 ? 's' : ''} para fomentar la autorreflexión sobre el momento presente.
    Cada pregunta debe estar en una nueva línea. No incluyas numeración ni viñetas.`;
    
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: prompt,
    });
    const text = response.text;
    return text.split('\n').map(q => q.trim()).filter(q => q.length > 0);
  } catch (error) {
    console.error("Error generating presence check-in questions:", error);
    return ["No se pudieron generar preguntas. Intenta de nuevo."];
  }
}
