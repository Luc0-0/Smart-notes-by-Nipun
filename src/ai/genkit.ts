import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// In a production environment (like Firebase App Hosting), the API key will be
// set as a secret environment variable. In local development, it will be
// loaded from .env.local. This setup prevents the build from failing in
// production if the key isn't available at build time.
export const ai = genkit({
  plugins: [googleAI({apiKey: process.env.GEMINI_API_KEY})],
  model: 'googleai/gemini-2.0-flash',
});
