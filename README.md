
# ⚔️ VigilanteAI: AI-Powered Web Vulnerability Scanner

**VigilanteAI** is an advanced, web-based cybersecurity tool designed to **scan, analyze, and report web vulnerabilities** using the power of **Generative AI**. This platform provides an intuitive interface for security researchers and developers to gain insights into a website's security posture through automated scanning and intelligent data enrichment.

Developed as a **B.Tech 7th Semester Major Project**, this application showcases a modern, serverless architecture that integrates multiple cutting-edge technologies.

![VigilanteAI Dashboard](https://raw.githubusercontent.com/Abhinav-Kumar-Singh-03/VigilanteAI-Ver2.0-Major-Project/main/Screenshots/Screenshot%202024-07-29%20185906.png)

---

## 🧠 Project Overview

VigilanteAI allows users to initiate a vulnerability scan on any given URL. The system simulates a security audit by generating a set of plausible vulnerabilities, which are then analyzed and contextualized by AI. The platform enriches these findings with Open-Source Intelligence (OSINT) data to provide a comprehensive security overview.

The project demonstrates the integration of:
- **Serverless Web Architecture** with Next.js and Firebase.
- **Generative AI** for security analysis, summarization, and remediation.
- **Real-time Data Processing** and interactive dashboard reporting.
- **Third-Party API Integration** for threat intelligence.

---

## 🚀 Key Features

✅ **AI-Powered Analysis** – Leverages Google's Gemini model via Genkit to generate vulnerability reports, create attack path simulations, and provide natural language explanations.  
✅ **Dynamic Web Scanning** – Enter any URL to initiate a scan, with real-time progress updates and logging.  
✅ **OSINT Enrichment** – Automatically gathers data from **VirusTotal, Shodan, WHOIS, and SSLMate** to provide context on the target's infrastructure.  
✅ **Interactive Dashboard** – A clean, modern UI built with ShadCN and Tailwind CSS to visualize scan results, severity breakdowns, and historical data.  
✅ **Automated Report Generation** – Export comprehensive scan reports in **PDF** or **CSV** format for documentation and auditing.  
✅ **Secure User Authentication** – Built with Firebase Authentication, supporting both email/password and Google federated login.  
✅ **Cloud-Native & Scalable** – Deployed on Firebase App Hosting, utilizing a serverless architecture for reliability and scale.

---

## 🧩 Tech Stack

**Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS, ShadCN UI  
**Backend & Database:** Firebase (Authentication, Firestore)  
**Generative AI:** Google Genkit, Gemini 2.5 Flash  
**OSINT APIs:** VirusTotal, Shodan, WHOIS (via WhoisXMLAPI), SSLMate (via CertSpotter)  
**Charting & Visualization:** Recharts  
**Deployment:** Firebase App Hosting  

---

## 🏗️ Architecture Overview

VigilanteAI is built on a modern, serverless architecture that separates the client, backend services, and AI processing.

```
  User ─────> (Browser)
      │
┌─────▼─────┐
│  Next.js  │
│   Client  │ (React, ShadCN UI)
└─────┬─────┘
      │
      ├─► Firebase Auth (Login/Signup)
      │
      ├─► Firestore DB (User & Scan Data)
      │
┌─────▼─────┐
│  Next.js  │ (Server Actions/Components)
│   Server  │
└─────┬─────┘
      │
┌─────▼─────┐
│   Genkit  │ (AI Flows & Tools)
└─────┬─────┘
      │
      ├─► Gemini API (AI Analysis)
      │
      └─► OSINT APIs (VirusTotal, etc.)

```

---

## 🧪 How to Run Locally

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/VigilanteAI.git
cd VigilanteAI
```

### 2️⃣ Install Dependencies
Ensure you have Node.js and npm installed.
```bash
npm install
```

### 3️⃣ Set Up Environment Variables
Create a `.env` file in the root of the project and add your API keys:
```env
VIRUSTOTAL_API_KEY=your_virustotal_key
WHOISXML_API_KEY=your_whoisxml_key
SHODAN_API_KEY=your_shodan_key
SSLMATE_API_KEY=your_sslmate_key

# You may also need your Firebase project's GEMINI_API_KEY
GEMINI_API_KEY=your_gemini_key
```

### 4️⃣ Run the Development Server
```bash
npm run dev
```
The application will be available at 👉 **[http://localhost:3000](http://localhost:3000)**.

---

## 📄 AI Reports & Visualization

* The **AI Assistant** provides detailed, conversational explanations for any vulnerability.
* The **Attack Path Simulation** generates a plausible step-by-step narrative of how an attacker might exploit the findings.
* **Severity Breakdown** charts and **OSINT cards** offer at-a-glance insights into the target's security posture.

---

## 👨‍💻 Contributors

| Name                | Roll Number | LinkedIn Profile                                        |
| ------------------- | ----------- | ------------------------------------------------------- |
| Abhinav Kumar Singh | 22051564    | [linkedin.com/in/abhinavkrsingh03](https://www.linkedin.com/in/abhinavkrsingh03/) |
| Aniket Kumar        | 22053293    | [linkedin.com/in/aniket-kumar-85a539229](https://www.linkedin.com/in/aniket-kumar-85a539229/) |
| Anshu Kumar         | 22053284    | [linkedin.com/in/anshu-kumar-108b35248](https://www.linkedin.com/in/anshu-kumar-108b35248/)   |
| Yash Vardhan        | 22052323    | [linkedin.com](https://www.linkedin.com/)               |

---

## 🧭 Project Guide

**Dr. Ranjita Kumari Dash**
*Professor, School of Computer Engineering, KIIT*  
[KIIT Faculty Profile](https://cse.kiit.ac.in/profiles/ranjita-kumari-dash/)

---

> *"Security isn't a product — it's a continuous mindset. VigilanteAI was built to make that mindset intelligent."*
