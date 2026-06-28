import promptAI from "../utils/ai.js";
import generateProductPrompt from "../utils/promptMessage.js";

class AIService {
    async generateProductDescription(data) {
        const prompt = generateProductPrompt(data);

        const description = await promptAI(prompt);

        return description;
    }
}

export default new AIService();
