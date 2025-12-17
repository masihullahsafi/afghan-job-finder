
// This service handles communication with our Backend API

// We use a relative path '/api'. 
// In Development: Vite proxy forwards this to http://localhost:5050/api
// In Production: The Express server serves the frontend and handles /api routes on the same port.
const API_BASE = '/api';

/**
 * Uploads a file to the backend, which sends it to Cloudinary.
 * @param file The file object from input.
 * @returns Promise resolving to the URL string.
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
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return data.url; // The secure Cloudinary URL
  } catch (error) {
    console.error("API Upload Error:", error);
    throw error;
  }
};

/**
 * Calls the backend AI proxy to generate text.
 */
export const generateAIContent = async (prompt: string, model: string = 'gemini-2.5-flash', config?: any) => {
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
