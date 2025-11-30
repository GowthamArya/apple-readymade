import { google } from '@ai-sdk/google';
import { embed } from 'ai';

export async function generateEmbedding(text: string) {
    try {
        const { embedding } = await embed({
            model: google.textEmbeddingModel('text-embedding-004'),
            value: text,
        });
        return embedding;
    } catch (error) {
        console.error("Error generating embedding:", error);
        throw error;
    }
}
