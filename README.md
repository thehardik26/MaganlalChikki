# 🍬 Maganlal Chikki - E-Commerce Storefront & AI Sweet Advisor

[![React](https://img.shields.io/badge/React-19.2.0-blue.svg?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.3.1-646CFF.svg?logo=vite)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4.2.1-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-2.11.2-764ABC.svg?logo=redux)](https://redux-toolkit.js.org/)
[![Ollama](https://img.shields.io/badge/Ollama-Local%20LLM-black.svg?logo=ollama)](https://ollama.com/)
[![Framer Motion](https://img.shields.io/badge/Framer%20Motion-12.38.0-FF0055.svg?logo=framer)](https://www.framer.com/motion/)

> A modern, responsive e-commerce storefront for India's legendary traditional sweets brand **Maganlal Chikki (Lonavala, Since 1888)**, enhanced with an intelligent local AI Chatbot powered by **Ollama**.

---

## 📌 Table of Contents

- [About the Brand](#about-the-brand)
- [Key Features](#key-features)
- [AI Chatbot & Ollama Integration](#ai-chatbot--ollama-integration)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Running Ollama Locally](#running-ollama-locally)
- [Available Scripts](#available-scripts)
- [Documentation](#documentation)
- [License](#license)

---

## 🏛️ About the Brand

Founded in **1888** in the misty hill station of Lonavala by Bhivraj Agarwal, **Maganlal Chikki** originated as an energy-dense, nutritious treat for railway workers constructing the historic Mumbai-Pune rail corridor through the Western Ghats. Over 135 years later, it stands as an internationally renowned symbol of handcrafted Indian confectionery—celebrated for crunchy peanut chikkis, nutritious sesame slabs, gooey chocolate walnut fudges, and savory snacks.

---

## 🌟 Key Features

### 🛒 Storefront & Shopping Experience
- **Interactive Store Catalog**: Browse chikkis, fudges, dry fruit rolls, and namkeens fetched dynamically via API and React Query.
- **Search & Filtering**: Real-time product search with keyword matching, price range filtering, and category sorting.
- **Persistent Shopping Cart**: Redux-backed cart state with quantity adjustment, item deletion, subtotal calculations, and checkout preview.
- **Wishlist / Favorites**: 1-click wishlist toggling with local persistence.
- **Responsive Layout**: Designed for mobile devices, tablets, and large desktop screens with smooth Framer Motion page transitions.

### 🤖 AI Sweet Advisor (Ollama Powered)
- **Local LLM Execution**: Runs models locally through Ollama with zero external API fees or telemetry tracking.
- **Multiple Installed Models**: Pre-configured with **`llama3.2:1b`** and **`tinyllama:latest`**.
- **Model Selector Dropdown**: Switch between installed AI models with a single click from the chat header.
- **In-Browser Model Puller**: Download new models (`qwen2.5`, `mistral`, `phi3`, etc.) straight from the chat settings UI with live progress indicators.
- **Multi-Item Conversational Add-to-Cart**: Recognizes compound commands (e.g. *"Add 2 peanut chikki and 1 chocolate fudge to cart"*), extracts quantities, and updates the cart automatically.
- **Interactive Product Cards in Chat**: Each recommendation features image thumbnails, unit pricing, a quantity stepper (`-` / `+`), and direct "Add to Cart" or "Add All" buttons.
- **Smart Knowledge Base Fallback**: Automatically provides instant store information even if Ollama is paused or disconnected.

---

## 🤖 AI Chatbot & Ollama Integration

For comprehensive architectural details, request flows, and customization guides, see our dedicated documentation:

👉 **[Read the Full AI Chatbot Documentation (AI_CHATBOT_DOCUMENTATION.md)](./AI_CHATBOT_DOCUMENTATION.md)**

### Quick Command Reference
```bash
# Start Ollama local background daemon
ollama serve

# Check downloaded models
ollama list

# Download a new lightweight model
ollama run tinyllama
# or
ollama run llama3.2:1b
```

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Core** | React 19, JavaScript (ES2023) |
| **Build Tool & Bundler** | Vite 7 (with `/ollama-api` proxy) |
| **Styling** | Tailwind CSS v4, Headless UI |
| **State Management** | Redux Toolkit, React-Redux |
| **Server State & Data Fetching** | TanStack React Query v5 |
| **Routing** | React Router v7 |
| **Animations & Transitions** | Framer Motion |
| **Icons & Media** | Lucide React, Heroicons, React Icons |
| **Notifications** | React Hot Toast |
| **AI Runtime** | Ollama Local LLMs (`llama3.2:1b`, `tinyllama`) |

---

## 📂 Project Structure

```text
MaganlalChikki/
├── public/                     # Static assets & public icons
├── src/
│   ├── assets/                 # Web logos, banners & images
│   ├── component/
│   │   ├── chat/               # 🤖 AI Chatbot System
│   │   │   ├── ChatBotWidget.jsx       # Floating Chatbot Window & Header
│   │   │   ├── ChatProductCard.jsx     # In-chat Product Cards with Stepper
│   │   │   ├── OllamaSettingsModal.jsx # Model Puller & Settings Dialog
│   │   │   └── ollamaService.js        # Ollama API Client & Intent Parser
│   │   ├── global/             # Global components (Cart, Fav, PageHeader)
│   │   ├── layout/             # Layout, Header, and Footer
│   │   ├── pages/              # Home, Shop, AboutUs, ContactUs, ProductDetails
│   │   ├── redux/              # Redux Toolkit store, cartSlice, and favSlice
│   │   └── utils/              # Product and Category API services
│   ├── App.jsx                 # Application routes & layout wrapper
│   ├── index.css               # Tailwind CSS entrypoint
│   └── main.jsx                # Application root mount
├── AI_CHATBOT_DOCUMENTATION.md # Detailed AI Chatbot architectural guide
├── vite.config.js              # Vite configuration with Ollama reverse proxy
├── package.json                # Project dependencies and scripts
└── README.md                   # Project documentation
```

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/thehardik26/MaganlalChikki.git
cd MaganlalChikki
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start Ollama (for AI Chatbot)
Ensure Ollama is installed and running:
```bash
ollama serve
```
Verify or pull a recommended model:
```bash
ollama run llama3.2:1b
```

### 4. Start the development server
```bash
npm run dev
```

Open [http://localhost:5173/](http://localhost:5173/) in your web browser.

---

## 💻 Available Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts Vite local development server on `http://localhost:5173` |
| `npm run build` | Compiles optimized production bundle in `/dist` |
| `npm run preview` | Locally previews the production build |
| `npm run lint` | Runs ESLint syntax and code-style checks |

---

## 📄 License

This project is created for demonstration and educational purposes. Maganlal Chikki branding, product names, and assets remain the intellectual property of their respective owners.
