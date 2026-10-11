import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaRobot,
  FaTimes,
  FaPaperPlane,
  FaCog,
  FaTrashAlt,
  FaCopy,
  FaCheck,
  FaVolumeUp,
  FaVolumeMute,
  FaChevronDown,
  FaShoppingCart,
  FaArrowRight,
  FaBoxOpen,
} from "react-icons/fa";
import { SparklesIcon } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";

import {
  getOllamaInfo,
  sendOllamaMessage,
  getSmartStoreResponse,
  detectCartAction,
  DEFAULT_OLLAMA_PROXY,
} from "./ollamaService";
import { addToCart, clearCart as clearCartAction } from "../redux/Store/slice/cartslice";
import ChatProductCard from "./ChatProductCard";
import OllamaSettingsModal from "./OllamaSettingsModal";

const INITIAL_GREETING = {
  id: "msg-init",
  sender: "bot",
  text: `🙏 **Namaste! Welcome to Maganlal Chikki!**\n\nI am your **AI Sweet Advisor**, powered by Ollama & Maganlal's heritage store knowledge since 1888.\n\nYou have full control to:\n- 🦙 **Select & Switch AI Models** directly in the header\n- 🛒 **Add items directly to your Cart** with custom quantities or by asking me\n- 🌟 Explore our famous Lonavala chikkis, chocolate fudges & gift packs!`,
  products: [],
  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
};

const SUGGESTIONS = [
  "🌟 Best sellers",
  "🛒 Add Peanut Chikki to Cart",
  "🍫 Famous Chocolate Fudge",
  "🍯 Sugar-free & Jaggery options",
  "👀 What is in my cart?",
  "🎁 Gift boxes for family",
  "🚚 Delivery & shelf life",
];

const ChatBotWidget = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart?.items || []);
  const cartCount = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);
  const cartTotal = cartItems.reduce(
    (acc, item) => acc + (Number(item.price || item.display_price || 0) * (item.quantity || 1)),
    0
  );

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    try {
      const saved = sessionStorage.getItem("maganlal_chat_history");
      return saved ? JSON.parse(saved) : [INITIAL_GREETING];
    } catch {
      return [INITIAL_GREETING];
    }
  });
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);

  // Configuration state
  const [config, setConfig] = useState(() => {
    try {
      const saved = localStorage.getItem("maganlal_ai_config");
      return saved
        ? JSON.parse(saved)
        : {
            serverUrl: DEFAULT_OLLAMA_PROXY,
            model: "tinyllama",
            mode: "ollama", // 'ollama' or 'smart'
          };
    } catch {
      return {
        serverUrl: DEFAULT_OLLAMA_PROXY,
        model: "tinyllama",
        mode: "ollama",
      };
    }
  });

  // Ollama status
  const [ollamaStatus, setOllamaStatus] = useState({
    connected: false,
    models: [],
    checked: false,
  });

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Check Ollama status on mount and when config changes
  const checkStatus = async () => {
    try {
      const res = await getOllamaInfo(config.serverUrl);
      setOllamaStatus({
        connected: res.connected,
        models: res.models || [],
        checked: true,
      });

      // Normalize models list
      const availableModels = (res.models || []).map((m) =>
        typeof m === "string" ? m : m.name || m.model
      );

      // If user model is not in list but list has models, keep or update
      if (res.connected && availableModels.length > 0 && !availableModels.includes(config.model)) {
        const found = availableModels.find((m) => m.startsWith(config.model.split(":")[0]));
        if (found) {
          setConfig((prev) => ({ ...prev, model: found }));
        } else {
          setConfig((prev) => ({ ...prev, model: availableModels[0] }));
        }
      }
    } catch {
      setOllamaStatus({ connected: false, models: [], checked: true });
    }
  };

  useEffect(() => {
    checkStatus();
  }, [config.serverUrl]);

  // Save chat to session storage
  useEffect(() => {
    try {
      sessionStorage.setItem("maganlal_chat_history", JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Listen for global custom event to open chat (e.g. from Header)
  useEffect(() => {
    const handleOpenEvent = () => {
      setIsOpen(true);
      setTimeout(() => inputRef.current?.focus(), 300);
    };
    window.addEventListener("open-maganlal-chat", handleOpenEvent);
    return () => window.removeEventListener("open-maganlal-chat", handleOpenEvent);
  }, []);

  // Save configuration
  const handleSaveConfig = (newConfig) => {
    setConfig(newConfig);
    try {
      localStorage.setItem("maganlal_ai_config", JSON.stringify(newConfig));
    } catch {
      // ignore
    }
    toast.success(`Active Model: ${newConfig.model}`, { icon: "⚙️" });
  };

  // Quick switch active model from header dropdown
  const handleQuickSelectModel = (selectedModelName) => {
    const updated = { ...config, model: selectedModelName, mode: "ollama" };
    setConfig(updated);
    try {
      localStorage.setItem("maganlal_ai_config", JSON.stringify(updated));
    } catch {
      // ignore
    }
    setShowModelDropdown(false);
    toast.success(`Switched AI Model to ${selectedModelName}!`, { icon: "⚡" });
  };

  // Play simple notification sound
  const playPopSound = () => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch {
      // ignore audio errors
    }
  };

  // Handle message submission
  const handleSend = async (textToSend = input) => {
    const query = (textToSend || "").trim();
    if (!query || isLoading) return;

    setInput("");
    const userMsgId = `user-${Date.now()}`;
    const userMsg = {
      id: userMsgId,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setIsLoading(true);

    try {
      // 1. Check if user intends to interact with Cart directly (e.g. "add to cart", "buy 2 fudge", "view cart")
      const recentProducts = messages
        .filter((m) => m.products && m.products.length > 0)
        .flatMap((m) => m.products);

      const cartAction = detectCartAction(query, recentProducts);

      if (cartAction) {
        if (cartAction.type === "add") {
          const itemsToAdd =
            cartAction.items && cartAction.items.length > 0
              ? cartAction.items
              : [{ product: cartAction.product, quantity: cartAction.quantity || 1 }];

          itemsToAdd.forEach(({ product, quantity }) => {
            for (let i = 0; i < quantity; i++) {
              dispatch(
                addToCart({
                  id: product.id,
                  title: product.title,
                  price: product.price,
                  images: [product.image],
                  category_id: product.cat_id || 1,
                })
              );
            }
          });

          const totalQty = itemsToAdd.reduce((sum, item) => sum + item.quantity, 0);
          const totalCost = itemsToAdd.reduce((sum, item) => sum + item.quantity * item.price, 0);

          let successMsg = "";
          if (itemsToAdd.length === 1) {
            const single = itemsToAdd[0];
            toast.success(`Added ${single.quantity}x ${single.product.title} to cart!`, { icon: "🛒" });
            successMsg = `🛒 **Added to your Cart!**\n\nI have added **${single.quantity}x ${single.product.title}** (₹${single.product.price * single.quantity}) to your cart successfully!\n\nYour cart now has **${cartCount + totalQty} items**. Click below to review your cart and checkout whenever you're ready!`;
          } else {
            toast.success(`Added ${itemsToAdd.length} different items (${totalQty} total) to cart!`, { icon: "🛒" });
            const itemsList = itemsToAdd
              .map(
                (it) =>
                  `- **${it.quantity}x ${it.product.title}** — ₹${it.product.price * it.quantity}`
              )
              .join("\n");
            successMsg = `🛒 **Added ${itemsToAdd.length} different items to your Cart!**\n\n${itemsList}\n\n**Total Added Value:** ₹${totalCost}\nYour cart now has **${cartCount + totalQty} items**!`;
          }

          const botMsg = {
            id: `bot-${Date.now()}`,
            sender: "bot",
            text: successMsg,
            products: itemsToAdd.map((it) => it.product),
            cartNotice: {
              type: "added",
              items: itemsToAdd,
            },
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          };

          setMessages((prev) => [...prev, botMsg]);
          playPopSound();
          setIsLoading(false);
        }

        if (cartAction.type === "view") {
          let cartSummaryText = "";
          if (cartItems.length === 0) {
            cartSummaryText = `🛒 **Your Cart is currently empty.**\n\nWould you like recommendations on our bestsellers, like the classic **Whole Groundnut Chikki** or the decadent **Chocolate Walnut Fudge**?`;
          } else {
            cartSummaryText = `🛒 **Here are the items in your cart:**\n\n${cartItems
              .map(
                (item, idx) =>
                  `${idx + 1}. **${item.title || item.display_name}** — ${item.quantity}x @ ₹${item.price || item.display_price} = ₹${(Number(item.price || item.display_price) * item.quantity).toFixed(0)}`
              )
              .join("\n")}\n\n**Total Estimated Value:** ₹${cartTotal.toFixed(0)}`;
          }

          const botMsg = {
            id: `bot-${Date.now()}`,
            sender: "bot",
            text: cartSummaryText,
            cartNotice: {
              type: "view",
            },
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          };

          setMessages((prev) => [...prev, botMsg]);
          playPopSound();
          setIsLoading(false);
          return;
        }

        if (cartAction.type === "clear") {
          dispatch(clearCartAction());
          toast("Cart has been cleared", { icon: "🧹" });

          const botMsg = {
            id: `bot-${Date.now()}`,
            sender: "bot",
            text: `🧹 **Your cart has been cleared.** Let me know whenever you'd like to add fresh chikkis or sweets!`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          };

          setMessages((prev) => [...prev, botMsg]);
          playPopSound();
          setIsLoading(false);
          return;
        }
      }

      // 2. Regular AI response generation
      let botResponseText = "";
      let botProducts = [];

      const shouldUseOllama = config.mode === "ollama" && ollamaStatus.connected;

      if (shouldUseOllama) {
        try {
          botResponseText = await sendOllamaMessage({
            messages: newHistory,
            model: config.model,
            serverUrl: config.serverUrl,
          });

          // Check if any products match the query for rich cards
          const smartInfo = getSmartStoreResponse(query);
          botProducts = smartInfo.products || [];
        } catch (ollamaErr) {
          console.warn("Ollama call failed, falling back to smart store logic:", ollamaErr);
          const fallback = getSmartStoreResponse(query);
          botResponseText = `${fallback.text}\n\n*(Note: Ollama returned an error, served via Maganlal Store Knowledge)*`;
          botProducts = fallback.products || [];
        }
      } else {
        const smart = getSmartStoreResponse(query);
        botResponseText = smart.text;
        botProducts = smart.products || [];
      }

      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: botResponseText,
        products: botProducts,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMsg]);
      playPopSound();
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: "I apologize, but I couldn't process that request right now. Please try again or check your Ollama configuration.",
          products: [],
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyMessage = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Copied to clipboard!", { duration: 1500 });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    setMessages([INITIAL_GREETING]);
    sessionStorage.removeItem("maganlal_chat_history");
    toast("Chat history cleared", { icon: "🧹" });
  };

  // Format markdown helper (bold, bullets, linebreaks)
  const renderFormattedText = (rawText) => {
    if (!rawText) return null;
    return rawText.split("\n").map((line, i) => {
      const isBullet = line.trim().startsWith("- ") || line.trim().startsWith("* ");
      const content = isBullet ? line.trim().substring(2) : line;

      const parts = content.split(/(\*\*.*?\*\*)/g).map((part, pIdx) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={pIdx} className="font-semibold text-amber-950">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      if (isBullet) {
        return (
          <li key={i} className="ml-4 list-disc text-xs my-0.5 leading-relaxed">
            {parts}
          </li>
        );
      }

      return line.trim() === "" ? (
        <div key={i} className="h-1.5" />
      ) : (
        <p key={i} className="text-xs leading-relaxed my-0.5">
          {parts}
        </p>
      );
    });
  };

  const handleAddAllToCart = (products) => {
    if (!products || products.length === 0) return;
    products.forEach((product) => {
      dispatch(
        addToCart({
          id: product.id,
          title: product.title,
          price: product.price,
          images: [product.image],
          category_id: product.cat_id || 1,
        })
      );
    });
    toast.success(`Added all ${products.length} different items to cart!`, { icon: "🛒" });
  };

  return (
    <>
      {/* Floating Action Button */}

      <div className="fixed bottom-6 right-6 z-40">
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative flex items-center group"
            >
              {/* Tooltip badge */}
              <div className="absolute right-full mr-3 hidden sm:flex items-center gap-1.5 bg-gray-900/90 text-white text-xs px-3 py-1.5 rounded-xl shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <SparklesIcon className="w-3.5 h-3.5 text-amber-400" />
                <span>Chat & Order with Maganlal AI</span>
              </div>

              {/* Main Button */}
              <button
                onClick={() => setIsOpen(true)}
                className="relative flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white rounded-full shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-amber-300/40 cursor-pointer"
                aria-label="Open AI Assistant"
              >
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <FaRobot className="text-amber-100 text-lg" />
                  </div>
                  <span
                    className={`absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                      ollamaStatus.connected ? "bg-emerald-500" : "bg-amber-400 animate-pulse"
                    }`}
                  />
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold leading-tight flex items-center gap-1">
                    Maganlal AI <SparklesIcon className="w-3 h-3 text-amber-300" />
                  </div>
                  <div className="text-[10px] text-amber-200 font-medium flex items-center gap-1">
                    <span>{config.model}</span>
                    {cartCount > 0 && (
                      <span className="bg-amber-500/80 px-1 rounded text-white font-bold">
                        🛒 {cartCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[94vw] sm:w-[425px] h-[610px] max-h-[88vh] bg-white rounded-3xl shadow-2xl border border-amber-200/80 flex flex-col overflow-hidden backdrop-blur-xl"
          >
            {/* Window Header */}
            <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white px-4 py-3 flex items-center justify-between shrink-0 shadow-md relative">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-9 h-9 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner">
                    <FaRobot className="text-amber-100" size={18} />
                  </div>
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-amber-800 ${
                      ollamaStatus.connected ? "bg-emerald-400" : "bg-amber-300 animate-pulse"
                    }`}
                    title={ollamaStatus.connected ? "Ollama Connected" : "Store Knowledge Mode"}
                  />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight flex items-center gap-1.5 leading-tight">
                    Maganlal Sweet Advisor
                    <span className="bg-amber-500/40 text-[9px] font-semibold px-1.5 py-0.2 rounded-full border border-amber-300/30">
                      AI
                    </span>
                  </h3>

                  {/* Header Model Selector Pill */}
                  <div className="relative mt-0.5">
                    <button
                      type="button"
                      onClick={() => setShowModelDropdown(!showModelDropdown)}
                      className="flex items-center gap-1 text-[11px] font-semibold bg-black/25 hover:bg-black/35 px-2 py-0.5 rounded-lg border border-amber-300/30 text-amber-100 transition cursor-pointer"
                      title="Click to select or switch model"
                    >
                      <span>⚡ {config.model}</span>
                      <FaChevronDown size={8} className="opacity-80" />
                    </button>

                    {/* Dropdown to select model */}
                    <AnimatePresence>
                      {showModelDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                          className="absolute left-0 top-full mt-1.5 w-52 bg-white rounded-2xl shadow-xl border border-amber-200 p-1.5 z-50 text-gray-800"
                        >
                          <div className="text-[10px] font-bold text-gray-400 px-2 py-1 uppercase tracking-wider">
                            Select Installed Model:
                          </div>

                          {ollamaStatus?.models?.length > 0 ? (
                            ollamaStatus.models.map((m) => {
                              const mName = typeof m === "string" ? m : m.name || m.model;
                              const isSelected = config.model === mName;

                              return (
                                <button
                                  key={mName}
                                  type="button"
                                  onClick={() => handleQuickSelectModel(mName)}
                                  className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                                    isSelected
                                      ? "bg-amber-100 text-amber-900 font-bold"
                                      : "hover:bg-gray-100 text-gray-700"
                                  }`}
                                >
                                  <span className="truncate">⚡ {mName}</span>
                                  {isSelected && <FaCheck size={10} className="text-amber-700" />}
                                </button>
                              );
                            })
                          ) : (
                            <div className="px-2 py-1.5 text-xs text-amber-800 bg-amber-50 rounded-lg">
                              No models detected yet
                            </div>
                          )}

                          <div className="border-t border-gray-100 mt-1 pt-1">
                            <button
                              type="button"
                              onClick={() => {
                                setShowModelDropdown(false);
                                setShowSettings(true);
                              }}
                              className="w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold text-amber-700 hover:bg-amber-50 flex items-center gap-1.5 transition cursor-pointer"
                            >
                              <FaCog size={11} />
                              <span>+ Pull & Manage Models...</span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Header Controls */}
              <div className="flex items-center gap-1 text-white/80">
                {/* Live Cart Button in Header */}
                <Link
                  to="/cart"
                  className="relative p-1.5 hover:text-white hover:bg-white/10 rounded-xl transition flex items-center"
                  title="View Shopping Cart"
                >
                  <FaShoppingCart size={13} />
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-amber-400 text-amber-950 text-[9px] font-extrabold px-1 rounded-full border border-amber-800">
                      {cartCount}
                    </span>
                  )}
                </Link>

                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="p-1.5 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
                  title={soundEnabled ? "Mute Sound" : "Enable Sound"}
                >
                  {soundEnabled ? <FaVolumeUp size={13} /> : <FaVolumeMute size={13} />}
                </button>
                <button
                  onClick={() => setShowSettings(true)}
                  className="p-1.5 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
                  title="Ollama Settings & Model Puller"
                >
                  <FaCog size={13} />
                </button>
                <button
                  onClick={clearChat}
                  className="p-1.5 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
                  title="Clear Chat"
                >
                  <FaTrashAlt size={12} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:text-white hover:bg-white/10 rounded-xl transition ml-0.5 cursor-pointer"
                  title="Close Chat"
                >
                  <FaTimes size={15} />
                </button>
              </div>
            </div>

            {/* Quick Suggestions Horizontal Bar */}
            <div className="bg-amber-50/80 border-b border-amber-100 px-3 py-1.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider shrink-0 flex items-center gap-1">
                <SparklesIcon className="w-3 h-3 text-amber-600" /> Quick:
              </span>
              {SUGGESTIONS.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(s)}
                  disabled={isLoading}
                  className="text-[11px] font-medium bg-white hover:bg-amber-100/70 text-gray-700 hover:text-amber-900 border border-amber-200/70 rounded-full px-2.5 py-0.5 whitespace-nowrap transition-colors shrink-0 shadow-2xs cursor-pointer"
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-gradient-to-b from-amber-50/20 via-white to-amber-50/10">
              {messages.map((msg) => {
                const isUser = msg.sender === "user";
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? "items-end" : "items-start"} group`}
                  >
                    <div className="flex items-end gap-1.5 max-w-[88%]">
                      {!isUser && (
                        <div className="w-6 h-6 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 shrink-0 mb-1">
                          <FaRobot size={11} />
                        </div>
                      )}

                      <div
                        className={`rounded-2xl px-3.5 py-2.5 text-xs shadow-xs relative transition-all ${
                          isUser
                            ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-br-xs"
                            : "bg-white text-gray-800 border border-amber-100/90 rounded-bl-xs"
                        }`}
                      >
                        {isUser ? (
                          <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                        ) : (
                          <div>
                            {renderFormattedText(msg.text)}

                            {/* Direct Cart Action Notice Banner */}
                            {msg.cartNotice && (
                              <div className="mt-2.5 p-2 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between gap-2">
                                <div className="text-[11px] font-bold text-emerald-800 flex items-center gap-1.5">
                                  <FaShoppingCart size={12} />
                                  <span>Cart updated ({cartCount} total)</span>
                                </div>
                                <Link
                                  to="/cart"
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-2xs transition"
                                >
                                  <span>View Cart</span>
                                  <FaArrowRight size={8} />
                                </Link>
                              </div>
                            )}

                            {/* Render Interactive Product Cards */}
                            {msg.products && msg.products.length > 0 && (
                              <div className="mt-2.5 pt-2 border-t border-amber-100/80 space-y-1">
                                <div className="text-[10px] font-bold uppercase tracking-wider text-amber-800 mb-1 flex items-center justify-between">
                                  <span>🍬 Featured Items ({msg.products.length}):</span>
                                  {msg.products.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => handleAddAllToCart(msg.products)}
                                      className="text-[10px] font-bold bg-amber-600 hover:bg-amber-700 active:scale-95 text-white px-2.5 py-0.5 rounded-lg flex items-center gap-1 shadow-2xs transition cursor-pointer"
                                      title="Add 1 of each to cart"
                                    >
                                      <FaShoppingCart size={9} />
                                      <span>Add All ({msg.products.length})</span>
                                    </button>
                                  )}
                                </div>
                                {msg.products.map((p) => (
                                  <ChatProductCard key={p.id} product={p} />
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Message meta & action */}
                        <div
                          className={`flex items-center gap-1.5 mt-1 text-[9px] ${
                            isUser ? "text-amber-200 justify-end" : "text-gray-400 justify-between"
                          }`}
                        >
                          <span>{msg.timestamp}</span>
                          {!isUser && (
                            <button
                              onClick={() => copyMessage(msg.id, msg.text)}
                              className="opacity-0 group-hover:opacity-100 hover:text-amber-700 transition cursor-pointer"
                              title="Copy response"
                            >
                              {copiedId === msg.id ? (
                                <FaCheck className="text-emerald-500" size={10} />
                              ) : (
                                <FaCopy size={10} />
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {isLoading && (
                <div className="flex items-center gap-2 text-gray-500 text-xs">
                  <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-800">
                    <FaRobot size={11} />
                  </div>
                  <div className="bg-white border border-amber-100 rounded-2xl px-3.5 py-2 shadow-xs flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-700 animate-bounce [animation-delay:0.4s]" />
                    <span className="text-[11px] text-amber-800 font-medium ml-1.5">
                      Consulting {config.model}...
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-white border-t border-amber-100 shrink-0">
              <div className="flex items-center gap-2 bg-amber-50/50 border border-amber-200/80 rounded-2xl px-3 py-1.5 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-400/20 transition-all">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a question or type 'Add 2 peanut chikki to cart'..."
                  rows={1}
                  className="w-full bg-transparent resize-none text-xs text-gray-800 placeholder-gray-400 focus:outline-none max-h-24 py-1"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isLoading}
                  className="p-2 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:bg-gray-200 text-white disabled:text-gray-400 transition-all shadow-xs shrink-0 cursor-pointer"
                  title="Send message"
                >
                  <FaPaperPlane size={12} />
                </button>
              </div>

              {/* Status footer with quick model & cart links */}
              <div className="flex items-center justify-between text-[10px] text-gray-500 mt-1.5 px-1">
                <div className="flex items-center gap-2">
                  <span
                    onClick={() => setShowModelDropdown(true)}
                    className="cursor-pointer hover:underline flex items-center gap-1 font-semibold text-amber-900"
                    title="Click to switch model"
                  >
                    <span>⚡ Model: {config.model}</span>
                    <FaChevronDown size={8} />
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to="/cart"
                    className="font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 bg-amber-100/70 px-2 py-0.5 rounded-md"
                  >
                    <FaShoppingCart size={10} />
                    <span>Cart: {cartCount} (₹{cartTotal.toFixed(0)})</span>
                  </Link>

                  <button
                    onClick={() => setShowSettings(true)}
                    className="hover:text-amber-700 underline transition cursor-pointer"
                  >
                    Settings
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ollama Settings Modal */}
      <OllamaSettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        config={config}
        onSaveConfig={handleSaveConfig}
        ollamaStatus={ollamaStatus}
        onRefreshStatus={checkStatus}
      />
    </>
  );
};

export default ChatBotWidget;
