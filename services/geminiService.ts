
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

export async function generateContextualFocusExercise(contextDescription: string): Promise<string> {
  if (!API_KEY) return "Error: API Key no configurada.";
  if (!contextDescription || contextDescription.trim() === "") {
    return "Error: La descripción del contexto no puede estar vacía.";
  }
  try {
    const prompt = `Eres un guía de mindfulness experto. Un usuario describe su situación actual de la siguiente manera: "${contextDescription}". Tu tarea es generar un ejercicio de mindfulness corto y práctico (de 1 a 2 minutos como máximo) que el usuario pueda realizar en ese contexto específico. Las instrucciones deben ser claras, concisas, paso a paso, y muy fáciles de seguir. No incluyas títulos, saludos, ni frases introductorias como "Aquí tienes un ejercicio:". Solo proporciona las instrucciones directas del ejercicio. Asegúrate de que el ejercicio sea relevante para la descripción proporcionada.`;
    
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: prompt,
      config: { thinkingConfig: { thinkingBudget: 0 } } // For faster response
    });
    return response.text;
  } catch (error) {
    console.error("Error generating contextual focus exercise:", error);
    return "No se pudo generar el ejercicio de enfoque contextual. Inténtalo de nuevo más tarde.";
  }
}

// generatePresenceCheckinQuestions function removed
// generateMindfulnessImage function removed
