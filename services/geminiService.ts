
import { GoogleGenAI } from "@google/genai";
import { QuizQuestion } from "../types";

// --- INTERFACES ---
export interface MatchAnalysisResult {
  score: number; 
  reason: string; 
  strengths: string[]; 
  missingSkills: string[]; 
}

// --- INITIALIZATION ---
// This relies on vite.config.ts 'define' to replace process.env.API_KEY
const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

// --- UTILITIES ---
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader(); 
    reader.readAsDataURL(file); 
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64); 
    };
    reader.onerror = error => reject(error); 
  });
};

// --- AI FUNCTIONS ---

export const generateJobDescription = async (title: string, skills: string): Promise<string> => {
  if (!apiKey) {
    console.warn("API Key is missing for Gemini Service");
    return "AI service unavailable without API Key. Please write description manually.";
  }
  try {
    const prompt = `Write a professional job description for a "${title}" position requiring: "${skills}". Include summary, responsibilities, requirements.`;
    const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
    return response.text || "Could not generate description.";
  } catch (error) { return "Error generating description."; }
};

export const suggestScreeningQuestions = async (jobTitle: string, jobDescription: string): Promise<string[]> => {
  if (!apiKey) return ["Do you have relevant experience?", "When can you start?"];
  try {
    const prompt = `Suggest 3 screening questions for "${jobTitle}". Desc: "${jobDescription.substring(0, 300)}...". Return JSON array of strings.`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) { return ["Do you have relevant experience?"]; }
};

export const improveResumeSummary = async (currentSummary: string): Promise<string> => {
   if (!apiKey) return "AI service unavailable.";
   try {
    const prompt = `Improve this professional summary for a CV: "${currentSummary}"`;
    const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
    return response.text || currentSummary;
   } catch (error) { return "Error improving summary."; }
};

export const generateExperienceBulletPoints = async (jobTitle: string, company: string): Promise<string[]> => {
  if (!apiKey) return ["Managed daily operations.", "Collaborated with team."];
  try {
    const prompt = `Generate 5 CV bullet points for "${jobTitle}" at "${company}". Return JSON array.`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) { return ["Error generating points."]; }
};

export const generateCoverLetter = async (
  jobTitle: string, companyName: string, candidateName: string, candidateProfile: string = "", resumeBase64?: string, resumeMimeType?: string
): Promise<string> => {
  if (!apiKey) return "AI service unavailable.";
  try {
    const textPrompt = `Write a cover letter for "${jobTitle}" at "${companyName}" by "${candidateName}". Profile: "${candidateProfile}". Keep it professional.`;
    let contents: any = [{ text: textPrompt }];
    if (resumeBase64 && resumeMimeType) {
      contents = [{ inlineData: { mimeType: resumeMimeType, data: resumeBase64 } }, { text: textPrompt }];
    }
    const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: { parts: contents } });
    return response.text || "Could not generate cover letter.";
  } catch (error) { return "Error generating cover letter."; }
};

export const validateResume = async (fileBase64: string, mimeType: string): Promise<{ isValid: boolean; reason?: string }> => {
  if (!apiKey || (!mimeType.includes('pdf') && !mimeType.includes('image'))) return { isValid: true };
  try {
     const prompt = `Analyze this resume image/pdf. Return JSON: { "isValid": boolean, "reason": "string" }. Valid if it looks like a CV/Resume with name/contact info.`;
     const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [{ inlineData: { mimeType, data: fileBase64 } }, { text: prompt }] },
      config: { responseMimeType: 'application/json' }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) { return { isValid: true }; }
};

export const parseResumeProfile = async (fileBase64: string, mimeType: string): Promise<{ name?: string, email?: string, phone?: string, bio?: string, skills?: string[] }> => {
    if (!apiKey) return {};
    try {
        const prompt = `Extract profile info (name, email, phone, bio, skills) from this resume. Return JSON.`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [{ inlineData: { mimeType, data: fileBase64 } }, { text: prompt }] },
            config: { responseMimeType: 'application/json' }
        });
        return JSON.parse(response.text || "{}");
    } catch (e) { return {}; }
};

export const generateInterviewQuestions = async (jobTitle: string, jobDescription: string, userProfile?: string, coverLetter?: string): Promise<string[]> => {
  if (!apiKey) return ["Tell me about yourself.", "Why this job?"];
  try {
    const prompt = `Generate 5 interview questions for "${jobTitle}". Job Desc: "${jobDescription.substring(0, 500)}". Candidate: "${userProfile}". Return JSON array of strings.`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) { return ["Tell me about yourself."]; }
};

export const evaluateInterviewAnswer = async (question: string, answer: string, jobDescription: string): Promise<string> => {
  if (!apiKey) return "Great answer!";
  try {
    const prompt = `Evaluate interview answer. Question: "${question}". Answer: "${answer}". Job: "${jobDescription.substring(0,200)}". Give strengths, weaknesses, and a better example.`;
    const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
    return response.text || "Could not evaluate.";
  } catch (error) { return "Error evaluating."; }
};

export const analyzeJobMatch = async (jobTitle: string, jobDesc: string, userProfile: string): Promise<MatchAnalysisResult | null> => {
    if (!apiKey) return { score: 75, reason: "Estimate.", strengths: [], missingSkills: [] };
    try {
        const prompt = `Match analysis. Job: "${jobTitle}". Desc: "${jobDesc.substring(0,500)}". User: "${userProfile}". Return JSON: { score: number, reason: string, strengths: string[], missingSkills: string[] }`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        return JSON.parse(response.text || "{}");
    } catch (e) { return null; }
};

export const generateCareerPath = async (currentRole: string): Promise<{title: string, steps: string[]}[]> => {
    if (!apiKey) return [];
    try {
        const prompt = `Suggest 2 career paths for "${currentRole}". Return JSON array: [{title: string, steps: string[]}]`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        return JSON.parse(response.text || "[]");
    } catch (e) { return []; }
};

export const generateSkillQuiz = async (topic: string): Promise<QuizQuestion[]> => {
    if (!apiKey) return [];
    try {
        const prompt = `Generate 5 multiple choice questions for "${topic}". Return JSON array: [{question: string, options: string[], correctAnswer: number}]`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        return JSON.parse(response.text || "[]");
    } catch (e) { return []; }
};

export const analyzeArticleSEO = async (content: string, title: string): Promise<{ seoTitle: string, seoDescription: string, keywords: string[] }> => {
    if (!apiKey) return { seoTitle: title, seoDescription: content.substring(0, 150), keywords: [] };
    try {
        const prompt = `Generate SEO metadata for article "${title}". Return JSON: { seoTitle, seoDescription, keywords[] }`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        return JSON.parse(response.text || "{}");
    } catch (e) { return { seoTitle: title, seoDescription: content.substring(0, 150), keywords: [] }; }
};
