# Smart Notes: An Intelligent Note-Taking App

This project is a feature-rich, intelligent note-taking application built with Next.js, Firebase, and Google's Gemini AI through Genkit. It provides a seamless and powerful experience for capturing thoughts, organizing projects, and enhancing creativity with AI-driven tools.

This application was bootstrapped and developed within Firebase Studio.

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
- **Subscription & Billing:** A complete billing system integrated with Stripe, including a pricing page and customer portal for managing subscriptions. Pro-tier features are gated.
- **Customizable Themes:** Choose between Light, Dark, and the signature "Aurora" theme, with a smooth onboarding experience for new users.

## Tech Stack

- **Framework:** Next.js (with App Router)
- **UI:** React, ShadCN UI, Tailwind CSS
- **AI:** Google Gemini via Genkit
- **Backend & Database:** Firebase (Authentication, Firestore)
- **Billing:** Stripe

## Getting Started: Local Development

### Prerequisites
- Node.js (v18 or later)
- An NPM package manager (npm, yarn, or pnpm)
- A Firebase project with Firestore and Authentication enabled.
- A Google AI API key for Genkit.

### 1. Installation
Clone the repository and install the dependencies:
```bash
npm install
```

### 2. Firebase Configuration
Update the Firebase configuration object in `src/lib/firebase/config.ts` with your own project's credentials.

### 3. Environment Variables
Create a `.env.local` file in the root of your project and add your Google AI API key:
```
GEMINI_API_KEY=your_google_ai_api_key_here
```

### 4. Run the Development Servers
You need to run two processes simultaneously in separate terminals:
- **Next.js App:**
  ```bash
  npm run dev
  ```
- **Genkit AI Flows:**
  ```bash
  npm run genkit:dev
  ```
Your application will be available at `http://localhost:9002` and the Genkit developer UI at `http://localhost:4000`.

## Deployment: Professional CI/CD Workflow

This project is configured for a professional CI/CD (Continuous Integration/Continuous Deployment) workflow using Firebase App Hosting and GitHub.

### Step 1: Push to a Git Repository
Initialize a Git repository and push your project to a new repository on GitHub.
```bash
git init
git add .
git commit -m "Initial commit of Smart Notes application"

# Follow GitHub's instructions to connect and push your local repo
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### Step 2: Connect Firebase App Hosting to GitHub
1.  Open your project in the **Firebase Console**.
2.  Navigate to the **App Hosting** section.
3.  Select your backend and click **"Connect GitHub repository"**.
4.  Follow the prompts to authorize Firebase and select the repository you just created.
5.  Configure the production branch to be `main`.

Once connected, every `git push` to your `main` branch will automatically trigger a new build and deploy your application. You can monitor the status of these deployments directly in the Firebase Console.
