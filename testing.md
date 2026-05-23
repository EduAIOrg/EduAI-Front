# Testing Workflow: EduAI Africa

This document outlines the execution flow to test the entire EduAI Africa application easily using predefined mock data. No backend configuration is required to test the core UX flows!

## 1. Authentication (Mocked)
The authentication flow has been mocked so you can enter the dashboard without needing a real database.

1. Navigate to the **Login Page** (`/login`).
2. Enter the following test credentials:
   - **Email:** `test@eduai.africa`
   - **Password:** `password123` (or anything else, it accepts it for the test email)
3. Click "Se connecter". You will be successfully redirected to the `/dashboard`.

*Note: You can also use the **Register Page** (`/register`) with the email `test@eduai.africa` to simulate account creation.*

## 2. Navigating the Dashboard

Once logged in, you'll land on the main Dashboard. Test the following features:

### Light/Dark Mode
- On the sidebar (or mobile menu), you won't see the theme toggle, but if you navigate back to the Landing Page (by clicking on "EduAI Africa" logo), you can use the **Sun/Moon icon** in the navbar to toggle themes globally.

### Documents Management (`/dashboard/documents`)
- Go to the **Documents** page.
- Test uploading a file via the drag-and-drop zone (click "Uploader un PDF"). The UI will simulate an upload progress bar and then add the document to the list (mocked action).
- Click on a document (e.g., "Cours d'Algorithmes.pdf") to enter the **Document View**.
  - In the left pane, you'll see a mock PDF Viewer.
  - In the right pane, explore the **Tabs**:
    - **Résumé**: See the AI-generated summary.
    - **Chat**: Interact with the AI specifically regarding this document.
    - **Quiz**: Click "Générer un quiz" to instantly create a test based on the document content.

### Chat AI (`/dashboard/chat`)
- Go to the **Chat** page.
- Try creating a **Nouvelle conversation**.
- Select a specific source document from the dropdown or leave it blank.
- Send messages and observe the typing indicator and automated AI responses (simulated locally).

### Quiz System (`/dashboard/quiz`)
- Go to the **Quiz** page.
- Open a predefined quiz or generate one.
- In the Quiz View (`/dashboard/quiz/[id]`), answer the questions:
  - Select options and see the immediate correct/incorrect feedback.
  - Complete the quiz to see the beautifully animated **Results Screen** (Circular Score Chart, Recommendations).

### Translation Panel (`/dashboard/translate`)
- Go to the **Traduction** page.
- Type some text in French. The right panel will instantly simulate a translation.
- Try toggling the "Conserver le contexte pédagogique" switch.
- Try clicking the **Swap Languages** button to see the smooth framer-motion rotation and state swap.
- Check the history list at the bottom.

### Voice Assistant (`/dashboard/voice`)
- Go to the **Mode Vocal** page.
- Click the glowing microphone button. 
- *Note: This uses the browser's native Web Speech API. If you allow microphone access, it will transcribe your speech and simulate an AI voice response.*

### Progress Tracking (`/dashboard/progress`)
- Go to the **Mes Progrès** page.
- Observe the interactive Area Chart for the 7d/30d score progression.
- View the "Lacunes détectées" (Knowledge Gaps) and click on the "Travailler cette notion" buttons.

## 3. Logout
- Click on your profile at the bottom of the sidebar and select **Déconnexion** to return to the Login page.
