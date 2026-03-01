<div align="center">
  <h1>⚖️ EquiLaw</h1>
  <p><strong>AI-Powered Labor Law Violation Analysis & One-Click Complaint Filing Service</strong></p>
  <p>Submission for the Gemini 3.0 API Hackathon</p>
</div>

---

## 🎬 Final Demo Video
*(Click the video below to watch the demonstration)*

https://github.com/user-attachments/assets/f25f8a44-db21-4af7-bd68-0976af482ef9


---

## 💡 About the Project

**EquiLaw** is an innovative solution designed to help workers who have experienced unfair treatment (e.g., unpaid wages, unfair dismissal, workplace harassment) navigate complex legal procedures easily and swiftly using AI.

When a user uploads various forms of evidence—such as screenshots of KakaoTalk conversations, images of employment contracts, or voice recordings—EquiLaw leverages the **powerful multimodal analysis capabilities of the Google Gemini API** to identify violated labor laws and calculate unpaid wages. Furthermore, based on the analyzed data, it automatically generates a formal complaint tailored to the Ministry of Employment and Labor's format, and facilitates direct faxing to the competent jurisdiction or one-click simulation filing on the Labor Portal.

### 🌟 Background
Ordinary workers lacking legal knowledge often spend immense amounts of time and money on extensive paperwork, searching for relevant laws, and organizing evidence just to claim their rights. EquiLaw was developed to bridge this information asymmetry and empower anyone to easily seek legal remedy.

---

## ✨ Key Features

### 1. Multimodal Evidence AI Analysis (Image & Audio)
- Extracts text (OCR) from image files like chat screenshots and receipts.
- Analyzes call recordings and audio files to identify legal issues.
- Utilizes the Gemini API for deep context awareness and **mapping to specific labor law violation clauses**.

### 2. Smart Unpaid Wage Calculator
- Automatically calculates delayed base salary and overtime/night shift allowances based on extracted contract info and work logs.
- Provides an interactive UI where users can verify and directly modify the calculated data.

### 3. Automated Complaint Generation (Auto-generation)
- Automatically writes a professional, 3-page formal complaint containing appropriate legal terminology based on the analyzed evidence, legal clauses, and calculated amounts.
- Users can review the completed complaint and immediately print or download it as a PDF.

### 4. One-Click Labor Office Filing Simulation & Direct Faxing
- **Automatic Jurisdiction Mapping**: Automatically finds the optimal competent labor office based on the user's workplace address.
- **RPA Filing Simulation**: Visualizes an AI Action Agent automatically filling out the complex complaint form on the Ministry of Employment and Labor's portal.
- **Direct Internet Fax**: Sends the finalized document directly to the competent labor office via fax with a single click.

### 5. Transparent AI Agent Activity Monitor
- Features a terminal-style console UI that allows users to monitor the AI's background processes (extraction, analysis, calculation, form filling, etc.) in real-time.

---

## 🛠 Tech Stack

### Frontend
- **Framework:** Next.js 15 (App Router), React 19
- **Styling:** Tailwind CSS, PostCSS
- **Icons & UI:** Lucide React

### Backend & AI
- **AI Model:** Google Gemini API (`@google/genai`) - Multimodal (Text, Image, Audio) Prompting
- **API Routes:** Next.js Route Handlers (`/api/analyze`, `/api/generate-complaint`)

### Infrastructure
- **Deployment:** Google Cloud Run (GCP), Docker (Containerized)
- **CI/CD:** Google Cloud Build

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/equilaw.git
cd equilaw
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
Create a `.env.local` file in the root directory and add your Gemini API key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Run the Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser to see the application in action.

---

## 📝 Application Flow & Screenshots

1. **Main & File Upload** - Upload multimodal data like chat screenshots and audio recordings.
2. **AI Analysis Dashboard** - Detect legal violations and use the unpaid wage calculator.
3. **Complaint Viewer** - Review the automatically completed formal complaint document.
4. **Auto-Filing Simulation** - Watch the animated auto-filling of the Labor Portal form.
5. **Fax Transmission & Completion** - Receive the submission reference number and next steps guide.

---

## 🤝 Contributors

- **Development & Product Design** : Youngmin Ko
- **Contact** : ymk5292@psu.edu

---

> **Disclaimer**: This service is a prototype developed as a hackathon submission. The provided legal information and generated complaint contents do not substitute for official legal counsel. Please consult a professional, such as a certified labor attorney, before taking actual legal action.
