# **App Name**: Smart Notes: Luc Edition

## Core Features:

- Authentication: Email/password and Google sign-in for user authentication and onboarding.
- Onboarding Wizard: A guided onboarding wizard to set theme preferences and import sample notes.
- Note Editor: A rich text editor using TipTap, allowing bold/italic, headings, lists, tables, code blocks, math (KaTeX), callouts, images, file attachments, markdown import/export, slash commands, @mentions, #tags.
- AI Superpowers: AI-powered feature to summarize notes, generate outlines, rewrite content, translate text, improve tone, and extract action items using Firebase Genkit and Gemini.
- Hybrid Search: Hybrid search functionality that combines keyword search using Fuse.js and semantic search powered by embeddings via Genkit/Gemini. Results are reranked server-side.
- Auto-Tagging and Summarization: Background function using Cloud Tasks to generate automatic tags and TL;DR summaries when saving notes. Use an AI tool.
- Contextual Nudges: Contextual prompts based on note content to remind users of follow-ups and important details. Uses Scheduler + Tasks + FCM.  Use an AI tool.

## Style Guidelines:

- Primary color: Saturated blue (#29ABE2), evoking reliability and intelligence. The intention of the blue aligns with a knowledge-based application, where information needs to be accessed in a secure, and trustworthy way.
- Background color: Light blue (#E5F4FB), a heavily desaturated version of the primary, providing a calm backdrop.
- Accent color: A vivid turquoise (#30D5C8) draws the user's attention to the features of this note-taking application.
- Body and headline font: 'Inter' (sans-serif) for a clean and modern aesthetic.
- Code font: 'Source Code Pro' (monospace) for clear code display.
- Employ glassmorphism panels, soft 2xl rounded cards, and subtle neumorphic shadows to create visually appealing layouts.
- Use Framer Motion for page transitions and micro-interactions on buttons, tags, and chips. Implement spring physics for drag-and-drop interactions.