
// This service handles communication with our Backend API
const API_BASE = '/api';

/**
 * Uploads a file to the backend, which sends it to Cloudinary or returns Base64.
 */
export const uploadFile = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Upload failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.url; 
  } catch (error) {
    console.error("API Upload Error:", error);
    throw error;
  }
};

/**
 * Calls the backend AI proxy to generate text.
 */
export const generateAIContent = async (prompt: string, model: string = 'gemini-3-flash-preview', config?: any) => {
  try {
    const response = await fetch(`${API_BASE}/ai/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, model, config })
    });
    
    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("AI Service Error:", error);
    return "";
  }
};
