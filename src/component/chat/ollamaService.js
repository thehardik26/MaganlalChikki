import axios from "axios";

// Default proxy URL to avoid CORS, with direct fallback
export const DEFAULT_OLLAMA_PROXY = "/ollama-api";
export const DEFAULT_DIRECT_OLLAMA = "http://127.0.0.1:11434";

// System instructions that inform Ollama about Maganlal Chikki
export const MAGANLAL_SYSTEM_PROMPT = `You are "Maganlal Sweet Advisor", the friendly, knowledgeable, and polite AI chatbot for Maganlal Chikki — India's legendary and most famous Chikki brand founded in Lonavala since 1888.

About Maganlal Chikki:
- Origin: Established in 1888 in Lonavala, Maharashtra by Bhivraj Agarwal.
- Heritage: Originally served to rail workers building the Mumbai-Pune railway line, now an iconic Indian treat known worldwide.
- Specialties: Handcrafted Chikkis made with crunchy roasted peanuts, sesame seeds (Til), cashews, almonds, and traditional jaggery (gur) or sugar.
- Key Categories:
  1. Traditional Chikkis: Whole Groundnut Chikki (₹50-₹200), Til (Sesame) Chikki (₹50-₹100), Super Crush Mix Chikki (₹320), Strawberry Groundnut Crushed Chikki (₹140), Strawberry Peanut Malai Chikki (₹160), Kaju Chikki, Badam Chikki.
  2. Famous Lonavala Fudges: Rich Chocolate Walnut Fudge, Plain Chocolate Fudge, Kaju Chocolate Fudge, Mango Fudge.
  3. Dry Fruit Rolls: Anjeer (Fig) Roll, Kaju Roll, Badam Pista Roll (Sugar-free and natural sweetness).
  4. Namkeens & Snacks: Lonavala Farsan, Special Chivda, Bhakarwadi, Banana Chips.
- Health & Quality: Made with high-protein peanuts, iron-rich jaggery, pure ingredients, zero artificial preservatives in traditional recipes.
- Shelf Life: Chikkis last 3-4 months when stored in a cool dry place. Fudges are best consumed within 15-20 days (refrigerate after opening).
- Shipping: Pan-India fast shipping with secure tamper-proof packaging.
- Store Locations: Main heritage store in Lonavala market, express highway outlets, and this official online web store.

Your Persona & Tone:
- Warm, hospitable, enthusiastic, and authentic like a warm Indian confectioner.
- Answer questions about ingredients, shelf life, dietary preferences (jaggery/vegan/sugar-free), prices, recommendations for gifts, festivals, travel snacks, or kids.
- Keep answers concise, clear, and well-structured with bullet points or emojis when helpful.
- If a customer wants to buy, suggest specific items from the catalog.`;

// Pre-compiled store catalog knowledge for fast recommendations & fallback responses
export const STORE_CATALOG = [
  {
    id: 6,
    cat_id: 1,
    title: "Whole Groundnut Chikki – 100 Gm",
    price: 50,
    category: "Chikki",
    image: "https://appy.trycatchtech.com/uploads/maganlalchikki/17168098861.jpg",
    description: "The classic iconic Lonavala peanut chikki made with crunchy roasted groundnuts and pure jaggery.",
    tags: ["bestseller", "peanut", "groundnut", "jaggery", "traditional", "classic", "cheap"]
  },
  {
    id: 5,
    cat_id: 1,
    title: "Whole Groundnut Chikki – 200 Gm",
    price: 100,
    category: "Chikki",
    image: "https://appy.trycatchtech.com/uploads/maganlalchikki/17168098411.jpg",
    description: "Generous pack of crunch from roasted peanuts and golden jaggery. Most popular tea-time companion.",
    tags: ["bestseller", "peanut", "groundnut", "jaggery", "traditional", "popular"]
  },
  {
    id: 2,
    cat_id: 1,
    title: "Whole Groundnut Chikki 400 Gms",
    price: 200,
    category: "Chikki",
    image: "https://appy.trycatchtech.com/uploads/maganlalchikki/17168050801.jpg",
    description: "Family pack of authentic Lonavala peanut chikki. High energy and protein-packed.",
    tags: ["family", "peanut", "groundnut", "value", "bestseller"]
  },
  {
    id: 8,
    cat_id: 1,
    title: "Til (Sesame) Chikki – 100 Gm",
    price: 50,
    category: "Chikki",
    image: "https://appy.trycatchtech.com/uploads/maganlalchikki/17168099751.jpg",
    description: "Nutritious roasted sesame seeds blended with natural jaggery. Rich in calcium and winter favorite.",
    tags: ["til", "sesame", "healthy", "calcium", "jaggery", "traditional", "winter"]
  },
  {
    id: 7,
    cat_id: 1,
    title: "Til (Sesame) Chikki – 200 Gm",
    price: 100,
    category: "Chikki",
    image: "https://appy.trycatchtech.com/uploads/maganlalchikki/17168099271.jpg",
    description: "Crunchy, sweet, and aromatic sesame seed chikki with wholesome goodness.",
    tags: ["til", "sesame", "healthy", "jaggery", "bestseller"]
  },
  {
    id: 9,
    cat_id: 1,
    title: "Super Crush Mix Chikki – 500 Gm",
    price: 320,
    category: "Chikki",
    image: "https://appy.trycatchtech.com/uploads/maganlalchikki/17168100111.jpg",
    description: "Delicious mix of Cocoa powder, peanuts, cardamom, mango, strawberry and pineapple flavours.",
    tags: ["crush", "mix", "fruit", "cocoa", "gift", "variety", "assorted"]
  },
  {
    id: 12,
    cat_id: 1,
    title: "Strawberry Groundnut Crushed Chikki – 200 Gm",
    price: 140,
    category: "Chikki",
    image: "https://appy.trycatchtech.com/uploads/maganlalchikki/17168101571.jpg",
    description: "Crunchy crushed roasted peanuts infused with fragrant strawberry essence.",
    tags: ["strawberry", "crush", "kids", "fruity"]
  },
  {
    id: 11,
    cat_id: 1,
    title: "Strawberry Peanut Malai Chikki – 250 Gm",
    price: 160,
    category: "Chikki",
    image: "https://appy.trycatchtech.com/uploads/maganlalchikki/17168101081.jpg",
    description: "Soft melt-in-mouth malai texture with rich peanut and strawberry delight.",
    tags: ["malai", "soft", "strawberry", "premium"]
  },
  {
    id: 201,
    cat_id: 2,
    title: "Signature Chocolate Walnut Fudge – 250 Gm",
    price: 240,
    category: "Fudge",
    image: "https://appy.trycatchtech.com/uploads/maganlalchikki/232357d5dd392f5f923dc0ca8adbbfc5.jpeg",
    description: "The world-famous Lonavala Chocolate Walnut Fudge. Gooey, decadent, loaded with toasted California walnuts.",
    tags: ["fudge", "chocolate", "walnut", "famous", "bestseller", "sweet", "dessert"]
  },
  {
    id: 401,
    cat_id: 4,
    title: "Royal Dry Fruit Anjeer Roll – 250 Gm",
    price: 380,
    category: "DRY FRUIT ROLL",
    image: "https://appy.trycatchtech.com/uploads/maganlalchikki/563c29cb884cfdd3107634b159772a0b.jpg",
    description: "Naturally sweetened premium dried figs (Anjeer) blended with crunchy cashews, pistachios and almonds. Zero added sugar.",
    tags: ["dryfruit", "anjeer", "sugar-free", "healthy", "gift", "premium", "nuts"]
  },
  {
    id: 501,
    cat_id: 5,
    title: "Special Lonavala Bhakarwadi – 250 Gm",
    price: 120,
    category: "Namkeens",
    image: "https://appy.trycatchtech.com/uploads/maganlalchikki/a2199c70211fc2c6416ebca0623e9d73.jpg",
    description: "Crispy spiral bites stuffed with sweet, spicy, and tangy coconut-sesame masala. Iconic Maharashtra savory snack.",
    tags: ["namkeen", "snack", "bhakarwadi", "spicy", "crispy"]
  }
];

/**
 * Check if Ollama server is reachable and fetch list of models
 */
export async function getOllamaInfo(serverUrl = DEFAULT_OLLAMA_PROXY) {
  const urlsToTry = [
    serverUrl,
    DEFAULT_OLLAMA_PROXY,
    DEFAULT_DIRECT_OLLAMA
  ];

  for (const url of urlsToTry) {
    try {
      const response = await axios.get(`${url}/api/tags`, { timeout: 3500 });
      if (response && response.data) {
        return {
          connected: true,
          endpoint: url,
          models: (response.data.models || []).map((m) => m.name || m.model || m),
        };
      }
    } catch {
      // try next
    }
  }

  return {
    connected: false,
    endpoint: serverUrl,
    models: [],
    error: "Ollama server not responding on localhost:11434",
  };
}

/**
 * Send chat message to Ollama API
 */
export async function sendOllamaMessage({
  messages,
  model = "tinyllama",
  serverUrl = DEFAULT_OLLAMA_PROXY,
  systemPrompt = MAGANLAL_SYSTEM_PROMPT,
  onChunk = null
}) {
  const formattedMessages = [
    { role: "system", content: systemPrompt },
    ...messages.map((m) => ({
      role: m.sender === "user" ? "user" : "assistant",
      content: m.text,
    }))
  ];

  const payload = {
    model: model,
    messages: formattedMessages,
    stream: !!onChunk,
    options: {
      temperature: 0.7,
      top_p: 0.9,
    }
  };

  // If streaming requested
  if (onChunk) {
    const response = await fetch(`${serverUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Ollama error: HTTP ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let accumulated = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n").filter((l) => l.trim() !== "");
      for (const line of lines) {
        try {
          const parsed = JSON.parse(line);
          if (parsed.message?.content) {
            accumulated += parsed.message.content;
            onChunk(accumulated);
          }
        } catch {
          // ignore stream parse errors
        }
      }
    }

    return accumulated;
  }

  // Non-streaming call
  const res = await axios.post(`${serverUrl}/api/chat`, payload, {
    timeout: 60000,
  });

  return res.data?.message?.content || "No response received from model.";
}

/**
 * Fallback Intelligent Store Advisor logic (works 100% offline or when Ollama model is downloading)
 */
export function getSmartStoreResponse(userInput) {
  const text = (userInput || "").toLowerCase().trim();

  // Search for matching products to attach as cards
  const matchedProducts = STORE_CATALOG.filter((p) => {
    return p.tags.some((tag) => text.includes(tag)) ||
      text.includes(p.title.toLowerCase()) ||
      text.includes(p.category.toLowerCase());
  }).slice(0, 3);

  // 1. Bestsellers & recommendations
  if (text.includes("bestseller") || text.includes("popular") || text.includes("famous") || text.includes("recommend") || text.includes("top")) {
    return {
      text: "🌟 **Our All-Time Bestsellers from Lonavala:**\n\n1. **Whole Groundnut Chikki** (₹50 - ₹200) — The timeless classic with crunchy roasted peanuts & pure jaggery.\n2. **Signature Chocolate Walnut Fudge** (₹240) — Decadent, melt-in-the-mouth, loaded with toasted walnuts.\n3. **Til (Sesame) Chikki** (₹50 - ₹100) — Iron & calcium powerhouse with golden jaggery sweetness.\n4. **Super Crush Mix Chikki** (₹320) — An assorted fruity & cocoa peanut delight!\n\nCheck out the recommended items below:",
      products: matchedProducts.length ? matchedProducts : [STORE_CATALOG[0], STORE_CATALOG[8], STORE_CATALOG[3]]
    };
  }

  // 2. Sugar-free / healthy / jaggery
  if (text.includes("sugar free") || text.includes("sugar-free") || text.includes("jaggery") || text.includes("gur") || text.includes("healthy") || text.includes("diet")) {
    const healthProducts = STORE_CATALOG.filter((p) => p.tags.includes("jaggery") || p.tags.includes("sugar-free") || p.tags.includes("healthy")).slice(0, 3);
    return {
      text: "🍯 **Healthy & Wholesome Delights:**\n\n- **Traditional Jaggery Chikkis**: Our Whole Groundnut and Til Chikkis use authentic unrefined jaggery (gur), naturally rich in iron and minerals.\n- **Royal Dry Fruit Anjeer Roll** (₹380): Naturally sweetened with pure dried figs, cashews, almonds and pistachios — **zero added refined sugar**!\n- **Til (Sesame) Chikki**: Packed with plant calcium and healthy fats.\n\nHere are the top health-conscious picks:",
      products: healthProducts
    };
  }

  // 3. Chocolate Fudge
  if (text.includes("fudge") || text.includes("chocolate") || text.includes("walnut")) {
    const fudgeProducts = STORE_CATALOG.filter((p) => p.category === "Fudge");
    return {
      text: "🍫 **Iconic Lonavala Chocolate Walnut Fudge!**\n\nOur world-famous fudge is prepared fresh with rich Dutch cocoa, creamy dairy condensed milk, and crunchy Californian walnuts. It has a glossy, melt-in-mouth texture that chocolate lovers swear by.\n\n💡 *Pro-tip: Warm it for 10 seconds in a microwave or enjoy it chilled with vanilla ice cream! Shelf life is 15-20 days.*",
      products: fudgeProducts.length ? fudgeProducts : [STORE_CATALOG[8]]
    };
  }

  // 4. Groundnut / Peanut Chikki
  if (text.includes("peanut") || text.includes("groundnut") || text.includes("singdana")) {
    const peanutProducts = STORE_CATALOG.filter((p) => p.tags.includes("peanut")).slice(0, 3);
    return {
      text: "🥜 **Authentic Lonavala Groundnut Chikki:**\n\nWe select the finest grade Saurashtra peanuts, slow-roast them to golden perfection, and combine them with jaggery to produce that signature shatter-crunch!\n\nAvailable in whole nut slabs (100g, 200g, 400g) as well as crushed and malai variations.",
      products: peanutProducts
    };
  }

  // 5. Til / Sesame Chikki
  if (text.includes("til") || text.includes("sesame")) {
    const tilProducts = STORE_CATALOG.filter((p) => p.tags.includes("til"));
    return {
      text: "✨ **Til (Sesame) Chikki:**\n\nA traditional delicacy specially loved during winter & Makar Sankranti, but enjoyed year-round for its rich nutty aroma and high calcium content. Made with white sesame seeds and pure jaggery.",
      products: tilProducts
    };
  }

  // 6. Gifting / Combos / Festivals
  if (text.includes("gift") || text.includes("festival") || text.includes("diwali") || text.includes("box") || text.includes("assorted") || text.includes("family")) {
    return {
      text: "🎁 **Perfect Gifting Collections:**\n\nFor festivals, corporate gifting, or sharing with friends and family, our **Super Crush Mix Chikki (500g)** and **Royal Dry Fruit Rolls** make luxurious, beautifully packaged presents!\n\nYou can also mix and match Peanut Chikki + Chocolate Fudge + Special Bhakarwadi for the ultimate Lonavala experience.",
      products: [STORE_CATALOG[5], STORE_CATALOG[9], STORE_CATALOG[8]]
    };
  }

  // 7. Namkeen & snacks
  if (text.includes("namkeen") || text.includes("snack") || text.includes("bhakarwadi") || text.includes("farsan") || text.includes("spicy")) {
    const namkeen = STORE_CATALOG.filter((p) => p.category === "Namkeens");
    return {
      text: "🌶️ **Crispy Savory Snacks (Namkeens):**\n\nBalance the sweetness with authentic Maharashtrian savory bites! Our **Special Lonavala Bhakarwadi** features crispy fried dough wheels filled with a spiced poppy, sesame, and coconut masala filling.",
      products: namkeen
    };
  }

  // 8. Shelf life / Storage / Expiry
  if (text.includes("shelf life") || text.includes("expiry") || text.includes("how long") || text.includes("storage") || text.includes("keep")) {
    return {
      text: "📦 **Storage & Shelf Life Guide:**\n\n- **Chikkis**: 3 to 4 months. Store in an airtight container at room temperature away from direct sunlight.\n- **Fudges**: 15 to 20 days. Best kept refrigerated after receiving to maintain ideal texture.\n- **Dry Fruit Rolls**: 2 to 3 months in airtight cool conditions.\n- **Namkeens / Bhakarwadi**: 2 months in an airtight container.",
      products: []
    };
  }

  // 9. Shipping / Delivery / Payment
  if (text.includes("delivery") || text.includes("shipping") || text.includes("courier") || text.includes("track") || text.includes("order")) {
    return {
      text: "🚚 **Shipping & Delivery:**\n\n- **Pan-India Delivery**: We ship across all Indian pin codes via express couriers.\n- **Dispatch**: Orders are freshly packaged and dispatched within 24-48 hours.\n- **Delivery Time**: Usually 2 to 4 business days depending on your location.\n- **Packaging**: Moisture-sealed and tamper-proof packaging to preserve crispness.",
      products: []
    };
  }

  // 10. Origin / History / Location
  if (text.includes("history") || text.includes("lonavala") || text.includes("about") || text.includes("since") || text.includes("store") || text.includes("shop location") || text.includes("where")) {
    return {
      text: "🏛️ **The Maganlal Chikki Legacy (Since 1888):**\n\nStarted over 135 years ago by Bhivraj Agarwal in Lonavala to provide high-energy snacks for workers building the historic rail lines through the Western Ghats. Today, Maganlal Chikki is an iconic brand synonymous with Lonavala.\n\nOur original heritage stores are located in Lonavala market, along the Mumbai-Pune highway, and right here on our official online store!",
      products: [STORE_CATALOG[0], STORE_CATALOG[8]]
    };
  }

  // 11. Greetings
  if (text.includes("hi") || text.includes("hello") || text.includes("hey") || text.includes("namaste") || text.includes("good morning") || text.includes("good evening")) {
    return {
      text: "🙏 **Namaste! Welcome to Maganlal Chikki!**\n\nI am your AI Sweet Advisor. How can I help you today?\n\n- 🌟 Explore our famous Lonavala Chikkis & Fudges\n- 🍯 Check out Sugar-free & Jaggery options\n- 🎁 Discover festive gift assortments\n- 🚚 Ask about shipping, shelf life, or ingredients\n\nWhat are you craving today?",
      products: matchedProducts.length ? matchedProducts : [STORE_CATALOG[0], STORE_CATALOG[8]]
    };
  }

  // Default helpful response
  return {
    text: `Delighted to assist you with Maganlal Chikki! We offer authentic Lonavala handcrafted treats including Whole Groundnut Chikki, Til Chikki, Chocolate Walnut Fudge, Dry Fruit Rolls, and savory snacks.\n\nCould you tell me if you are looking for sweet recommendations, dietary options (jaggery/sugar-free), or shipping details?`,
    products: matchedProducts.length ? matchedProducts : [STORE_CATALOG[0], STORE_CATALOG[8]]
  };
}

export const POPULAR_MODELS = [
  { name: "tinyllama", label: "TinyLlama", size: "637 MB", desc: "Ultra-fast, lightweight & responsive" },
  { name: "llama3.2:1b", label: "Llama 3.2 (1B)", size: "1.3 GB", desc: "Meta's efficient lightweight model" },
  { name: "qwen2.5:0.5b", label: "Qwen 2.5 (0.5B)", size: "398 MB", desc: "Compact & speedy multi-lingual LLM" },
  { name: "llama3.2", label: "Llama 3.2 (3B)", size: "2.0 GB", desc: "Meta's powerful smart small model" },
  { name: "mistral", label: "Mistral (7B)", size: "4.1 GB", desc: "Popular high capability model" },
  { name: "phi3:mini", label: "Phi-3 Mini", size: "2.2 GB", desc: "Microsoft's high reasoning model" },
];

/**
 * Pull / download an Ollama model from the client
 */
export async function pullOllamaModel({
  modelName,
  serverUrl = DEFAULT_OLLAMA_PROXY,
  onProgress,
}) {
  const response = await fetch(`${serverUrl}/api/pull`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: modelName, stream: true }),
  });

  if (!response.ok) {
    throw new Error(`Failed to pull model: HTTP ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split("\n").filter((l) => l.trim() !== "");
    for (const line of lines) {
      try {
        const data = JSON.parse(line);
        if (onProgress) {
          onProgress(data);
        }
      } catch {
        // ignore JSON chunk errors
      }
    }
  }

  return true;
}

/**
 * Helper to parse word or numeric quantities
 */
function parseQuantity(text) {
  const wordMap = {
    one: 1, two: 2, three: 3, four: 4, five: 5,
    six: 6, seven: 7, eight: 8, nine: 9, ten: 10
  };
  const digitMatch = text.match(/\b([1-9]|10)\b/);
  if (digitMatch) return parseInt(digitMatch[1], 10);

  for (const [word, val] of Object.entries(wordMap)) {
    if (new RegExp(`\\b${word}\\b`, "i").test(text)) {
      return val;
    }
  }
  return 1;
}

/**
 * Detect cart action intents (e.g. single item, multiple different items, or "add all")
 */
export function detectCartAction(userInput, recentProducts = []) {
  const text = (userInput || "").toLowerCase().trim();

  // Clear cart intent
  const isClear = text.includes("clear cart") ||
    text.includes("empty cart") ||
    text.includes("clear chart") ||
    text.includes("remove all items");

  if (isClear) {
    return { type: "clear" };
  }

  // View cart intent
  const isView = text.includes("view cart") ||
    text.includes("view chart") ||
    text.includes("show cart") ||
    text.includes("show chart") ||
    text.includes("what's in my cart") ||
    text.includes("what is in my cart") ||
    text.includes("my cart");

  if (isView) {
    return { type: "view" };
  }

  // Add intent check
  const isAdd = text.includes("add to cart") ||
    text.includes("add to chart") ||
    text.includes("add in cart") ||
    text.includes("add in chart") ||
    text.includes("buy ") ||
    text.includes("order ") ||
    text.includes("add all") ||
    text.includes("add both") ||
    text.includes("add these") ||
    text.startsWith("add ");

  if (isAdd) {
    // 1. Intent: "Add all" / "Add both" / "Add these" / "Add bestsellers"
    const isAddAll = text.includes("add all") ||
      text.includes("add both") ||
      text.includes("add these") ||
      text.includes("add everything") ||
      text.includes("add them all") ||
      text.includes("add bestsellers");

    if (isAddAll) {
      const targetProducts = recentProducts.length > 0
        ? recentProducts
        : [STORE_CATALOG[0], STORE_CATALOG[8], STORE_CATALOG[3]]; // Groundnut, Fudge, Til Chikki

      // Deduplicate by id
      const uniqueTargets = [];
      const seen = new Set();
      for (const p of targetProducts) {
        if (!seen.has(p.id)) {
          seen.add(p.id);
          uniqueTargets.push(p);
        }
      }

      return {
        type: "add",
        items: uniqueTargets.map((product) => ({
          product,
          quantity: 1,
        })),
      };
    }

    // 2. Multi-item detection: check every item in STORE_CATALOG against user input
    const detectedItems = [];
    const detectedProductIds = new Set();

    // Map common keywords to specific items
    const productKeywords = [
      { id: 201, keywords: ["fudge", "chocolate fudge", "walnut fudge"] },
      { id: 6, keywords: ["whole groundnut", "groundnut chikki", "peanut chikki", "singdana"] },
      { id: 8, keywords: ["til chikki", "sesame chikki", "til", "sesame"] },
      { id: 9, keywords: ["super crush", "crush mix", "mix chikki"] },
      { id: 12, keywords: ["strawberry chikki", "strawberry groundnut", "strawberry crush"] },
      { id: 11, keywords: ["strawberry malai", "malai chikki"] },
      { id: 401, keywords: ["anjeer roll", "dry fruit roll", "dryfruit roll"] },
      { id: 501, keywords: ["bhakarwadi", "namkeen", "farsan"] },
    ];

    // Check clauses split by 'and', '&', ',', '+'
    const segments = text.split(/,| and | & |\+/g);

    for (const segment of segments) {
      let matchedInSegment = false;
      const segQty = parseQuantity(segment);

      for (const pk of productKeywords) {
        const hasKeyword = pk.keywords.some((kw) => segment.includes(kw));
        if (hasKeyword && !detectedProductIds.has(pk.id)) {
          const product = STORE_CATALOG.find((p) => p.id === pk.id);
          if (product) {
            detectedItems.push({
              product,
              quantity: segQty,
            });
            detectedProductIds.add(pk.id);
            matchedInSegment = true;
          }
        }
      }
    }

    // Fallback search across whole text if segments didn't catch multiple
    if (detectedItems.length === 0) {
      for (const pk of productKeywords) {
        const hasKeyword = pk.keywords.some((kw) => text.includes(kw));
        if (hasKeyword && !detectedProductIds.has(pk.id)) {
          const product = STORE_CATALOG.find((p) => p.id === pk.id);
          if (product) {
            // Check if there is a quantity near this keyword
            const regex = new RegExp(`(\\d+|one|two|three|four|five)\\s+(?:packets?|boxes?|packs?|of\\s+)?(?:${pk.keywords.join("|")})`, "i");
            const match = text.match(regex);
            const qty = match ? parseQuantity(match[1]) : parseQuantity(text);

            detectedItems.push({
              product,
              quantity: qty,
            });
            detectedProductIds.add(pk.id);
          }
        }
      }
    }

    // If still no products detected from keywords, check recentProducts or default
    if (detectedItems.length === 0) {
      if (recentProducts.length > 0) {
        detectedItems.push({
          product: recentProducts[0],
          quantity: parseQuantity(text),
        });
      } else {
        detectedItems.push({
          product: STORE_CATALOG[0],
          quantity: parseQuantity(text),
        });
      }
    }

    return {
      type: "add",
      items: detectedItems,
    };
  }

  return null;
}


