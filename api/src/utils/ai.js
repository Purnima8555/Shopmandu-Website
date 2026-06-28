import { GoogleGenAI } from "@google/genai";
import config from "../config/config.js";

const ai = new GoogleGenAI({
    apiKey: config.gemini_key,
});

const promptAI = async (promptMessage) => {

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: promptMessage,
    });

    return response.text;
}

export default promptAI;