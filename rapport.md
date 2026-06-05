# 📋 Rapport du Projet — EduAI Africa

Ce rapport présente l'analyse complète de l'application **EduAI Africa**, un assistant pédagogique intelligent conçu pour booster l'apprentissage des étudiants africains grâce à l'IA. Il détaille les fonctionnalités implémentées, l'architecture du projet et la stack technique complète (Frontend et Backend).

---

## 🎯 Fonctionnalités Clés Implémentées

### 1. Landing Page Moderne & Interactive
- **Section Hero** : Design premium pleine largeur ("largeur maximale") avec superposition de dégradés et flou d'arrière-plan. Chargement dynamique d'une illustration adaptée selon le thème (sombre ou clair).
- **Thème Clair/Sombre** : Gestion fluide et synchronisée via un store Zustand avec transition de couleurs CSS.
- **Header & Footer** : Intégration du logo personnalisé et d'un pied de page complet (produits, ressources, newsletter).
- **Animations adoucies** : Utilisation de Framer Motion pour des animations de transition très subtiles et agréables à l'œil.

### 2. Authentification Sécurisée (Avec Mode Test Autonome)
- **Logique d'inscription et de connexion** : Interface utilisateur complète validée par Zod et gérée par React Hook Form.
- **Authentification Mockée intelligente** :
  - L'utilisation de l'email `test@eduai.africa` simule instantanément une session valide en renvoyant des jetons d'authentification (`mock-jwt-token-12345`).
  - Intercepteur de réponse Axios (`api.ts`) court-circuitant toutes les requêtes d'API (profil, documents, quiz, chat) pour renvoyer des mockdatas réalistes lorsque le jeton de test est détecté. Cela permet de tester l'application en toute autonomie et sans dépendance réseau avec le backend.

### 3. Gestion Pédagogique des Documents (RAG)
- **Upload de PDF** : Interface de téléversement progressive avec barre d'état.
- **Résumés automatiques** : Extraction de texte et génération de résumés structurés.
- **Base Vectorielle** : Indexation et recherche de similarités dans le document.

### 4. Centre de Quiz Intelligent
- **Génération personnalisable** : Quiz générés à la volée selon 3 niveaux de difficulté (Facile, Moyen, Difficile) et 3 types de questions (QCM, Ouvert, Mixte).
- **Correction instantanée** : Évaluation immédiate des réponses de l'étudiant avec explication détaillée de la bonne réponse.
- **Historique** : Sauvegarde des tentatives pour suivre l'évolution des scores.

### 5. Chat Académique Interactif
- **Conversations RAG** : Chat interactif contextuel basé directement sur les cours téléversés.
- **Streaming de réponse** : Affichage fluide de la réponse de l'IA en temps réel.
- **Historique de chat** : Navigation facile entre les anciennes conversations.

### 6. Traduction Contextuelle
- **Traduction Pédagogique** : Outil de traduction de textes et de termes académiques (Français ↔ Anglais) qui conserve le contexte d'apprentissage.

### 7. Module Vocal (Whisper & TTS)
- **Transcription Audio** : Possibilité de poser des questions à l'IA en dictant vocalement (Whisper).
- **Synthèse Vocale (Text-To-Speech)** : Lecture audio de la réponse générée pour un apprentissage auditif interactif.

### 8. Dashboard de Progression ("Mes Progrès")
- **Visualisation des scores** : Graphiques d'évolution des performances de quiz (`Recharts`).
- **Analyse des lacunes** : Détection intelligente des points faibles basés sur les scores de quiz.
- **Recommandations personnalisées** : Suggestions de révision générées par l'IA pour aider l'étudiant à s'améliorer.

---

## 🛠️ Stack Technique

### 💻 Frontend (Client)
- **Framework principal** : Next.js 16 (App Router)
- **Langage** : TypeScript (Typage strict pour la sécurité)
- **Librairie UI** : React 19 / React DOM 19
- **Gestion du State** : Zustand (Stores optimisés pour Auth, Thème, Chat et Documents)
- **Gestion des requêtes & cache** : TanStack React Query v5
- **Requêtes HTTP** : Axios (avec intercepteurs pour la gestion du mode mock/test)
- **Styling** : Tailwind CSS v4 + Variables CSS dynamiques
- **Formulaires** : React Hook Form + Zod (Validation des schémas de connexion / inscription)
- **Graphiques** : Recharts
- **Animations** : Framer Motion
- **Toasts** : Sonner
- **Icônes** : Lucide React

### ⚙️ Backend (Serveur & IA)
- **Framework API** : FastAPI 0.115+ (Framework asynchrone ultra-rapide)
- **Langage** : Python 3.11+
- **Base de Données Relationnelle** : PostgreSQL 14+
- **ORM** : SQLAlchemy 2.0 (Requêtes asynchrones avec support asyncpg)
- **Migrations de BDD** : Alembic
- **Base de Données Vectorielle** : ChromaDB (Stockage et recherche sémantique des chunks de cours)
- **Traitement Asynchrone / File d'attente** : Celery 5.4+ (avec Redis comme Message Broker / Cache)
- **Framework RAG / IA** : LangChain 0.3+ (Orchestration des agents et pipelines)
- **Modèles de Langage (LLM)** : OpenAI GPT-4o-mini ou Ollama (Exécution locale de Llama3/Mistral)
- **Modèles d'Embeddings** : OpenAI Text-Embedding-3-Small ou Ollama Nomic-Embed-Text
- **Reconnaissance et Synthèse Vocale** : OpenAI Whisper (Transcription) + OpenAI TTS (Synthèse vocale)
- **Extraction PDF** : PyMuPDF (fitz)
- **Containerisation** : Docker & Docker Compose (Prêt pour la production)
