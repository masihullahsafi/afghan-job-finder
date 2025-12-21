import { GoogleGenAI } from "@google/genai";
import { QuizQuestion } from "../types";

export interface MatchAnalysisResult {
  score: number; 
  reason: string; 
  strengths: string[]; 
  missingSkills: string[]; 
}

// Initializing Google GenAI client correctly using the API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const DEFAULT_MODEL = 'gemini-3-flash-preview';
const apiKey = process.env.API_KEY;

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

export const generateJobDescription = async (title: string, skills: string): Promise<string> => {
  if (!apiKey) return "AI Key missing. Please write manually.";
  try {
    const prompt = `Act as an HR expert in Afghanistan. Write a professional job description for "${title}". Requirements: "${skills}". Include intro, duties, and qualifications.`;
    const response = await ai.models.generateContent({ model: DEFAULT_MODEL, contents: prompt });
    return response.text || "Failed to generate.";
  } catch (error) { return "Error calling AI."; }
};

export const suggestScreeningQuestions = async (jobTitle: string, jobDescription: string): Promise<string[]> => {
  if (!apiKey) return ["Do you have relevant experience?"];
  try {
    const prompt = `Suggest 3 interview screening questions for "${jobTitle}" based on: "${jobDescription.substring(0, 500)}". Return ONLY a JSON array of strings.`;
    const response = await ai.models.generateContent({ model: DEFAULT_MODEL, contents: prompt, config: { responseMimeType: 'application/json' } });
    return JSON.parse(response.text || "[]");
  } catch (error) { return ["Experience level?"]; }
};

export const improveResumeSummary = async (currentSummary: string): Promise<string> => {
   if (!apiKey) return currentSummary;
   try {
    const prompt = `Rewrite this professional summary to be more impactful and concise for a resume: "${currentSummary}"`;
    const response = await ai.models.generateContent({ model: DEFAULT_MODEL, contents: prompt });
    return response.text || currentSummary;
   } catch (error) { return currentSummary; }
};

export const generateExperienceBulletPoints = async (jobTitle: string, company: string): Promise<string[]> => {
  if (!apiKey) return ["Managed team operations."];
  try {
    const prompt = `Generate 5 high-impact bullet points for a resume for "${jobTitle}" at "${company}". Return ONLY a JSON array.`;
    const response = await ai.models.generateContent({ model: DEFAULT_MODEL, contents: prompt, config: { responseMimeType: 'application/json' } });
    return JSON.parse(response.text || "[]");
  } catch (error) { return ["Achieved KPIs."]; }
};

export const generateCoverLetter = async (
  jobTitle: string, companyName: string, candidateName: string, candidateProfile: string = "", resumeBase64?: string, resumeMimeType?: string
): Promise<string> => {
  if (!apiKey) return "AI service unavailable.";
  try {
    const textPrompt = `Write a professional cover letter for "${jobTitle}" at "${companyName}". Applicant: "${candidateName}". Profile info: "${candidateProfile}". Keep it professional.`;
    let contents: any = { parts: [{ text: textPrompt }] };
    if (resumeBase64 && resumeMimeType) {
      contents = { parts: [{ inlineData: { mimeType: resumeMimeType, data: resumeBase64 } }, { text: textPrompt }] };
    }
    const response = await ai.models.generateContent({ model: DEFAULT_MODEL, contents });
    return response.text || "Failed to generate.";
  } catch (error) { return "Error generating cover letter."; }
};

export const validateResume = async (fileBase64: string, mimeType: string): Promise<{ isValid: boolean; reason?: string }> => {
  if (!apiKey) return { isValid: true };
  try {
     const prompt = `Verify if this document is a valid professional CV/Resume. Return ONLY JSON: { "isValid": boolean, "reason": "string" }`;
     const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: { parts: [{ inlineData: { mimeType, data: fileBase64 } }, { text: prompt }] },
      config: { responseMimeType: 'application/json' }
    });
    return JSON.parse(response.text || "{\"isValid\": true}");
  } catch (error) { return { isValid: true }; }
};

// UPDATED: Accepting 4 arguments to include the optional cover letter for better question generation.
export const generateInterviewQuestions = async (jobTitle: string, jobDescription: string, userProfile?: string, coverLetter?: string): Promise<string[]> => {
  if (!apiKey) return ["Tell me about yourself."];
  try {
    const prompt = `Generate 5 challenging interview questions for "${jobTitle}". 
    Description: "${jobDescription}". 
    Candidate Profile: "${userProfile || 'Not provided'}". 
    Cover Letter: "${coverLetter || 'Not provided'}".
    Return ONLY JSON array of strings.`;
    const response = await ai.models.generateContent({ model: DEFAULT_MODEL, contents: prompt, config: { responseMimeType: 'application/json' } });
    return JSON.parse(response.text || "[]");
  } catch (error) { return ["Tell me about yourself.", "Why are you interested in this role?"]; }
};

export const evaluateInterviewAnswer = async (question: string, answer: string, jobDescription: string): Promise<string> => {
  if (!apiKey) return "Great answer! Keep practicing.";
  try {
    const prompt = `Act as an Interview Coach. Evaluate the following answer for a job interview. Question: "${question}". Answer: "${answer}". Job Context: "${jobDescription}". Provide feedback and a model answer.`;
    const response = await ai.models.generateContent({ model: DEFAULT_MODEL, contents: prompt });
    return response.text || "Excellent response.";
  } catch (error) { return "Feedback unavailable."; }
};

export const analyzeJobMatch = async (jobTitle: string, jobDesc: string, userProfile: string): Promise<MatchAnalysisResult | null> => {
    if (!apiKey) return { score: 70, reason: "Manual estimate.", strengths: [], missingSkills: [] };
    try {
        const prompt = `Compare candidate to job. Job: "${jobTitle}". Profile: "${userProfile}". Return ONLY JSON: { "score": number, "reason": "string", "strengths": [string], "missingSkills": [string] }`;
        const response = await ai.models.generateContent({ model: DEFAULT_MODEL, contents: prompt, config: { responseMimeType: 'application/json' } });
        return JSON.parse(response.text || "{}");
    } catch (e) { return null; }
};

export const generateSkillQuiz = async (topic: string): Promise<QuizQuestion[]> => {
    if (!apiKey) return [];
    try {
        const prompt = `Generate a 5-question multiple choice quiz for the skill "${topic}". Return ONLY JSON array: [{question: string, options: [string], correctAnswer: number}]`;
        const response = await ai.models.generateContent({ model: DEFAULT_MODEL, contents: prompt, config: { responseMimeType: 'application/json' } });
        return JSON.parse(response.text || "[]");
    } catch (e) { return []; }
};

export const analyzeArticleSEO = async (content: string, title: string): Promise<{ seoTitle: string, seoDescription: string, keywords: string[] }> => {
    if (!apiKey) return { seoTitle: title, seoDescription: "", keywords: [] };
    try {
        const prompt = `Generate SEO tags for this blog post. Title: "${title}". Content: "${content.substring(0, 1000)}". Return ONLY JSON: { "seoTitle": "string", "seoDescription": "string", "keywords": [string] }`;
        const response = await ai.models.generateContent({ model: DEFAULT_MODEL, contents: prompt, config: { responseMimeType: 'application/json' } });
        return JSON.parse(response.text || "{}");
    } catch (e) { return { seoTitle: title, seoDescription: "", keywords: [] }; }
};