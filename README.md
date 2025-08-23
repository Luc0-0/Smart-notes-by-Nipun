# Elevated Notes: An Intelligent Note-Taking App

This project is a feature-rich, intelligent note-taking application built with Next.js, Firebase, and Google's Gemini AI through Genkit. It provides a seamless and powerful experience for capturing thoughts, organizing projects, and enhancing creativity with AI-driven tools.

## Core Features

### AI Superpowers (Powered by Genkit & Gemini)
- **Summarize:** Instantly generate concise summaries of long notes.
- **Outline Generation:** Create structured outlines from a simple title.
- **Rewrite:** Rephrase your content to improve clarity and style.
- **Improve Tone:** Adjust the tone of your writing to be more professional, casual, or confident.
- **Extract Action Items:** Automatically identify and list actionable tasks from your notes, especially useful for meetings.
- **AI Note Starters:** Kickstart your writing process by generating structured note templates from a simple prompt (e.g., "A project plan for a new mobile app").
- **Auto-Tagging:** Let AI analyze your notes and automatically suggest relevant tags upon saving.

### Organization & Productivity
- **Specialized Notebooks:** Organize notes into categories like General, Projects, Meetings, and Personal, each with unique fields.
- **Tagging System:** Add custom tags to notes and browse your entire collection by tag.
- **Full-Text Search:** Instantly find notes with a responsive, client-side search that filters by title and content.
- **Archiving:** Keep your workspace clean by archiving notes you don't need right now, with the ability to restore them later.
- **Note Deletion:** Securely delete notes with a confirmation step.

### Polished User Experience
- **Rich Text Editor:** A robust editor with specialized fields that adapt to the selected notebook type.
- **Authentication:** Secure user login and signup functionality using Firebase Authentication (Email/Password and Google).
- **Dashboard:** A central hub to get a quick overview of your activity, recent notes, and notebook statistics.
- **Customizable Themes:** Choose between Light, Dark, and the signature "Aurora" theme, with a smooth onboarding experience for new users.

## Tech Stack

- **Framework:** Next.js (with App Router)
- **UI:** React, ShadCN UI, Tailwind CSS
- **AI:** Google Gemini via Genkit
- **Backend & Database:** Firebase (Authentication, Firestore)
