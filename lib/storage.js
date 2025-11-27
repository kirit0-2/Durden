const STORAGE_PREFIX = 'dualpersona:v1:';
const CONVERSATIONS_KEY = `${STORAGE_PREFIX}conversations`;

// Helper to generate IDs
export const generateId = () => `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
export const generateMessageId = () => `m_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// --- Image Handling ---

const MAX_IMAGE_SIZE_BYTES = 300 * 1024; // 300KB

export const compressImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Resize if too large (max dimension 500px)
        const MAX_DIM = 500;
        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height *= MAX_DIM / width;
            width = MAX_DIM;
          } else {
            width *= MAX_DIM / height;
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Compress to JPEG
        let quality = 0.9;
        let dataUrl = canvas.toDataURL('image/jpeg', quality);

        // Reduce quality if still too big
        while (dataUrl.length > MAX_IMAGE_SIZE_BYTES && quality > 0.1) {
          quality -= 0.1;
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

// --- Storage Methods ---

export const getConversationsList = () => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(CONVERSATIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Failed to load conversations list", e);
    return [];
  }
};

export const getConversation = (id) => {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(`${STORAGE_PREFIX}${id}`);
    return stored ? JSON.parse(stored) : null;
  } catch (e) {
    console.error(`Failed to load conversation ${id}`, e);
    return null;
  }
};

export const saveConversation = (conversation) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${conversation.conversationId}`, JSON.stringify(conversation));
    
    // Update list if new
    const list = getConversationsList();
    if (!list.includes(conversation.conversationId)) {
      list.unshift(conversation.conversationId);
      localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(list));
    }
  } catch (e) {
    console.error("Failed to save conversation", e);
    if (e.name === 'QuotaExceededError') {
      alert("Storage full! Please delete some conversations.");
    }
  }
};

export const createConversation = (title = "New Conversation") => {
  const id = generateId();
  const newConv = {
    version: 1,
    conversationId: id,
    title,
    createdAt: Date.now(),
    activePersona: "A",
    personas: {
      A: { id: "A", name: "Me", avatar: null },
      B: { id: "B", name: "Alter", avatar: null }
    },
    messages: []
  };
  saveConversation(newConv);
  return newConv;
};

export const deleteConversation = (id) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(`${STORAGE_PREFIX}${id}`);
    const list = getConversationsList().filter(cid => cid !== id);
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(list));
  } catch (e) {
    console.error("Failed to delete conversation", e);
  }
};

export const updatePersona = (conversationId, personaId, updates) => {
  const conv = getConversation(conversationId);
  if (!conv) return;
  
  if (conv.personas[personaId]) {
    conv.personas[personaId] = { ...conv.personas[personaId], ...updates };
    saveConversation(conv);
  }
  return conv;
};

export const addMessage = (conversationId, message) => {
  const conv = getConversation(conversationId);
  if (!conv) return;
  
  conv.messages.push(message);
  saveConversation(conv);
  return conv;
};

export const deleteMessage = (conversationId, messageId) => {
    const conv = getConversation(conversationId);
    if (!conv) return;
    
    conv.messages = conv.messages.filter(m => m.id !== messageId);
    saveConversation(conv);
    return conv;
};
