# 🤖 Maganlal Chikki AI Chatbot & Ollama Integration Guide

A comprehensive, production-grade guide to the local LLM-powered AI Chatbot built for the **Maganlal Chikki** e-commerce platform.

---

## 📌 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Architecture & Data Flow](#architecture--data-flow)
- [Ollama Setup & Model Management](#ollama-setup--model-management)
- [CORS & Vite Proxy Configuration](#cors--vite-proxy-configuration)
- [Dual-Intelligence Engine](#dual-intelligence-engine)
  - [1. Local Ollama LLM Mode](#1-local-ollama-llm-mode)
  - [2. Smart Store Advisor Mode](#2-smart-store-advisor-mode)
- [Conversational Add-to-Cart Engine](#conversational-add-to-cart-engine)
- [Component Breakdown](#component-breakdown)
- [Testing & Verification](#testing--verification)
- [Troubleshooting & FAQs](#troubleshooting--faqs)

---

## 📖 Overview

The **Maganlal Sweet Advisor** is an intelligent AI assistant embedded directly into the Maganlal Chikki storefront. Grounded in the 135+ year heritage of Lonavala's iconic confectioner (founded in 1888), it helps shoppers discover traditional chikkis, decadent fudges, and snacks, answer dietary and shelf-life inquiries, and manage their cart through conversational natural language.

---

## ✨ Key Features

1. **Local Privacy-Preserving AI**: Powered by **Ollama**, executing open-weights models (such as `llama3.2:1b` and `tinyllama`) locally on your machine with zero third-party API costs or cloud dependencies.
2. **Instant Header Model Switcher**: Change active LLMs on the fly with a single click from the chat header.
3. **In-Browser Model Puller**: Download new models (e.g. `mistral`, `qwen2.5:0.5b`, `gemma2`) directly from the Web UI with live streaming progress bars and percentage indicators.
4. **Natural Language Multi-Item Cart Actions**:
   - Understands compound sentences: *"Add 2 peanut chikki and 1 chocolate fudge to cart"*.
   - Automatically parses item quantities (words or digits) and dispatches them to the Redux store.
   - Provides itemized receipts with sub-totals and direct checkout links.
5. **Interactive In-Chat Product Cards**:
   - Product thumbnail, category badge, and unit price.
   - Quantity stepper (`-` / `+`) allowing users to pick 1 to 10 units.
   - Direct 1-click **"Add to Cart"** and **"Add All to Cart"** buttons.
6. **Graceful Fallback Mode**: If Ollama is offline or busy, the assistant automatically routes queries to a built-in deterministic store knowledge base so users are never left without answers.

---

## 🏗️ Architecture & Data Flow

```text
┌─────────────────────────────────────────────────────────────┐
│                      Client Browser                         │
│                                                             │
│   ┌─────────────────────────┐     ┌─────────────────────┐   │
│   │     Header.jsx          │     │    ChatBotWidget    │   │
│   │  ["Ask AI" Button]      │────▶│ (Floating Chat UI)  │   │
│   └─────────────────────────┘     └──────────┬──────────┘   │
│                                              │              │
│                     ┌────────────────────────┼──────────┐   │
│                     ▼                        ▼          ▼   │
│             [Cart Actions]           [Ollama Mode] [Smart]  │
│                     │                        │          │   │
│                     ▼                        ▼          │   │
│             Redux Cart Store           Vite Proxy       │   │
│          (addToCart, clearCart)       /ollama-api       │   │
└─────────────────────┬────────────────────────┬──────────┼───┘
                      │                        │          │
                      ▼                        ▼          ▼
             Global UI Updates          Local Ollama    Store
             (Header Bag, Total)       (127.0.0.1:11434) Catalog
```

---

## 🦙 Ollama Setup & Model Management

### 1. Prerequisites
- [Ollama](https://ollama.com/) installed on your operating system.
- Ollama service running on the default port `11434`.

### 2. Launching the Ollama Daemon
Start the service in your terminal:
```bash
ollama serve
```

### 3. Installed Models
Verify which models are currently available locally:
```bash
ollama list
```

Installed models:
| Model | Size | Highlights | Recommended For |
| :--- | :---: | :--- | :--- |
| `llama3.2:1b` | 1.3 GB | Meta's efficient, high-reasoning compact model | Primary conversational advisor |
| `tinyllama:latest` | 637 MB | Ultra-fast lightweight model | Low resource / older hardware |

### 4. Pulling Additional Models
You can pull models from the terminal:
```bash
ollama run qwen2.5:0.5b
ollama run mistral
ollama run phi3:mini
```
*Or simply open the Chatbot Settings (⚙️) modal in the web app and click **Pull Model**!*

---

## 🌐 CORS & Vite Proxy Configuration

By default, web browsers block cross-origin requests to `http://localhost:11434`. To eliminate CORS errors without requiring users to alter their system environment variables, a reverse proxy is configured in [`vite.config.js`](file:///c:/Users/hardi/OneDrive/Desktop/React-Projects/MaganlalChikki/MaganlalChikki/vite.config.js):

```javascript
// vite.config.js
export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    proxy: {
      '/ollama-api': {
        target: 'http://127.0.0.1:11434',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ollama-api/, '')
      }
    }
  }
})
```

Client requests to `/ollama-api/api/tags` or `/ollama-api/api/chat` are seamlessly forwarded to Ollama at `http://127.0.0.1:11434`.

---

## 🧠 Dual-Intelligence Engine

### 1. Local Ollama LLM Mode
When active, every message sent to Ollama includes the `MAGANLAL_SYSTEM_PROMPT` giving the LLM complete grounding in:
- Heritage: Established in 1888 in Lonavala by Bhivraj Agarwal.
- Product catalog: Whole Groundnut Chikki, Til Chikki, Chocolate Walnut Fudge, Dryfruit Rolls, Bhakarwadi.
- Nutritional attributes: High-protein peanuts, iron-rich unrefined jaggery, zero artificial preservatives.
- Storage & logistics: 3-4 months shelf life for chikkis, 15-20 days for fudges, pan-India courier delivery.

### 2. Smart Store Advisor Mode
If Ollama is paused or disconnected:
- Operates 100% offline with zero latency.
- Employs keyword classification and semantic catalog matching.
- Recommends bestsellers, handles dietary queries (sugar-free/jaggery), provides history, and serves product cards.

---

## 🛒 Conversational Add-to-Cart Engine

The `detectCartAction` function in `ollamaService.js` intercepts cart commands before or during chat generation:

### Supported Intents:

| User Query | Action Performed | Redux State Impact |
| :--- | :--- | :--- |
| *"Add 2 peanut chikki and 1 chocolate fudge to cart"* | Multi-item add | Adds 2x Whole Groundnut Chikki + 1x Walnut Fudge |
| *"Add 1 groundnut chikki, 1 til chikki, and 2 fudge"* | 3-way compound add | Adds 1x Groundnut + 1x Til + 2x Fudge |
| *"Add all best sellers to cart"* | Bulk add | Adds 1 of each featured bestselling product |
| *"What is in my cart?"* | Cart summary | Generates itemized breakdown with total value |
| *"Clear cart"* | Empty cart | Dispatches `clearCart()` |

---

## 📂 Component Breakdown

| File | Purpose |
| :--- | :--- |
| [`ChatBotWidget.jsx`](file:///c:/Users/hardi/OneDrive/Desktop/React-Projects/MaganlalChikki/MaganlalChikki/src/component/chat/ChatBotWidget.jsx) | Main floating widget containing the chat window, model dropdown, suggestion chips, input field, and audio toggles. |
| [`ChatProductCard.jsx`](file:///c:/Users/hardi/OneDrive/Desktop/React-Projects/MaganlalChikki/MaganlalChikki/src/component/chat/ChatProductCard.jsx) | Interactive product item rendered inside chat bubbles with quantity selectors (`-` / `+`) and direct add-to-cart. |
| [`OllamaSettingsModal.jsx`](file:///c:/Users/hardi/OneDrive/Desktop/React-Projects/MaganlalChikki/MaganlalChikki/src/component/chat/OllamaSettingsModal.jsx) | Settings dialogue for selecting models, running connection tests, changing endpoints, and streaming new model downloads. |
| [`ollamaService.js`](file:///c:/Users/hardi/OneDrive/Desktop/React-Projects/MaganlalChikki/MaganlalChikki/src/component/chat/ollamaService.js) | Service layer managing HTTP calls to Ollama, model pulling, system prompt injection, and multi-item cart parser. |
| [`Header.jsx`](file:///c:/Users/hardi/OneDrive/Desktop/React-Projects/MaganlalChikki/MaganlalChikki/src/component/layout/Header.jsx) | Store header with sparkling **"Ask AI"** buttons on desktop and mobile. |
| [`Layout.jsx`](file:///c:/Users/hardi/OneDrive/Desktop/React-Projects/MaganlalChikki/MaganlalChikki/src/component/layout/Layout.jsx) | Global layout root hosting the chatbot widget on all store routes. |

---

## 🧪 Testing & Verification

Run the test suite or verify manually:

1. **Verify Ollama Status**:
   ```bash
   ollama list
   ```
2. **Test Proxy in Terminal**:
   ```powershell
   Invoke-RestMethod -Uri "http://localhost:5173/ollama-api/api/tags" -Method Get
   ```
3. **Verify Production Build**:
   ```bash
   npm run build
   ```

---

## ❓ Troubleshooting & FAQs

### Q: Why does the status indicator show yellow (Store Advisor Mode)?
- **Cause**: Ollama is not running in the background.
- **Fix**: Open your terminal and run `ollama serve`. Then click the **Refresh** icon in the chatbot header or settings.

### Q: How do I switch from `tinyllama` to `llama3.2:1b`?
- Click the model pill in the chat header: **`[ ⚡ Model: tinyllama ▼ ]`** and select **`llama3.2:1b`**.

### Q: Can I run remote Ollama instances?
- Yes. Open the Chatbot Settings (⚙️), replace `/ollama-api` with your remote server IP (e.g. `http://192.168.1.100:11434`), and click **Test**. Ensure the host allows external origins via `OLLAMA_ORIGINS="*"`.
