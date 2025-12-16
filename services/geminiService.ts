
import { GoogleGenerativeAI } from "@google/generative-ai";
import { QuizQuestion } from "../types";

// --- INTERFACES ---
// Defines the structure for the Job Match Analysis result so TypeScript knows what to expect.
export interface MatchAnalysisResult {
  score: number; // e.g., 85 (percent match)
  reason: string; // e.g., "Strong match but missing specific tools."
  strengths: string[]; // e.g., ["React", "TypeScript"]
  missingSkills: string[]; // e.g., ["Docker", "AWS"]
}

// --- INITIALIZATION ---
// Get the API key from the environment variable provided by the build system.
const apiKey = process.env.API_KEY || ''; 

// Initialize the Google Generative AI client with the key.
// This instance ('ai') will be used for all subsequent API calls.
const ai = new GoogleGenerativeAI(apiKey);

// --- UTILITIES ---

/**
 * Converts a browser File object (from <input type="file">) to a Base64 string.
 * This is necessary because Gemini API expects images/PDFs as Base64 strings, not raw binary.
 * @param file The file selected by the user.
 * @returns A Promise resolving to the Base64 string (without the "data:image/..." prefix).
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader(); // Create a file reader
    reader.readAsDataURL(file); // Read file as Data URL (Base64)
    reader.onload = () => {
      const result = reader.result as string;
      // The result looks like "data:application/pdf;base64,JVBERi0x...", we need to remove the part before the comma.
      const base64 = result.split(',')[1];
      resolve(base64); // Return just the raw Base64 data
    };
    reader.onerror = error => reject(error); // Handle read errors
  });
};

// --- AI FUNCTIONS ---

/**
 * Generates a professional job description based on a title and skill list.
 * Used in: EmployerDashboard -> Post Job Modal.
 */
export const generateJobDescription = async (title: string, skills: string): Promise<string> => {
  // Safety check: Don't call API if key is missing.
  if (!apiKey) {
    console.warn("API Key is missing for Gemini Service");
    return "AI service unavailable without API Key. Please write description manually.";
  }

  try {
    // Construct the prompt. We give the AI a persona ("professional") and context ("Afghan job market").
    const prompt = `Write a professional job description for a "${title}" position requiring the following skills: "${skills}". Include a brief summary, key responsibilities, and requirements. Keep it professional and suitable for the Afghan job market.`;
    
    // Call the API. We use 'gemini-1.5-flash' because it's fast and good for text generation.
    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const response = await model.generateContent(prompt);

    // Return the generated text, or a fallback message if empty.
    return response.response.text() || "Could not generate description.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating description. Please try again.";
  }
};

/**
 * Suggests screening questions for employers to filter candidates.
 * Returns a JSON array of strings.
 * Used in: EmployerDashboard.
 */
export const suggestScreeningQuestions = async (jobTitle: string, jobDescription: string): Promise<string[]> => {
  if (!apiKey) {
    // Fallback mock data if no API key
    return [
      "Do you have relevant experience in this field?",
      "Are you available to start immediately?",
      "Do you have a valid work permit?"
    ];
  }

  try {
    // We explicitly ask for a JSON array in the prompt to make parsing easier.
    const prompt = `You are a Recruitment Expert. Based on the job title "${jobTitle}" and description below, suggest 3 specific screening questions to ask candidates during the application process.
    
    Job Description: "${jobDescription.substring(0, 500)}..."
    
    Questions should be short, direct, and help filter unqualified candidates.
    
    Return ONLY a JSON array of strings. Example: ["Question 1?", "Question 2?"]`;

    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const response = await model.generateContent(prompt);

    // Parse the JSON text response into a real JavaScript array.
    const text = response.response.text() || "[]";
    try {
      return JSON.parse(text);
    } catch (e) {
      // Fallback if AI returns invalid JSON
      return ["Do you have the required experience?", "Are you located in the job location?", "When can you start?"];
    }
  } catch (error) {
    console.error("Gemini API Error (Screening Questions):", error);
    return ["Do you have relevant experience?", "What is your expected salary?"];
  }
};

/**
 * Rewrites a user's bio/summary to be more professional.
 * Used in: SeekerDashboard -> Edit Profile -> AI Improve.
 */
export const improveResumeSummary = async (currentSummary: string): Promise<string> => {
   if (!apiKey) {
     return "AI service unavailable.";
   }

   try {
    const prompt = `Act as a professional career coach. Rewrite and improve the following professional summary for a CV to make it more impactful, concise, and result-oriented for the Afghan and international job market. Use strong action verbs.
    
    Current Summary: "${currentSummary}"`;
    
    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const response = await model.generateContent(prompt);
    return response.response.text() || currentSummary;
   } catch (error) {
     console.error("Gemini API Error:", error);
     return "Error improving summary. Please try again.";
   }
};

/**
 * Generates bullet points for a CV based on job title and company.
 * Used in: SeekerDashboard -> Experience Enhancer.
 */
export const generateExperienceBulletPoints = async (jobTitle: string, company: string): Promise<string[]> => {
  if (!apiKey) return ["Managed daily operations.", "Collaborated with team.", "Achieved goals."];

  try {
    const prompt = `Act as a CV Writer. Generate 5 professional, result-oriented bullet points for a resume for the role of "${jobTitle}" at "${company}".
    
    Instructions:
    1. Use strong action verbs (e.g., Spearheaded, Orchestrated, Optimized).
    2. Focus on achievements and measurable results where possible.
    3. Keep it relevant to the modern job market.
    
    Return ONLY a JSON array of strings. Example: ["Managed a team of 10...", "Increased sales by 20%..."]`;

    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const response = await model.generateContent(prompt);

    const text = response.response.text() || "[]";
    try {
      return JSON.parse(text);
    } catch (e) {
      // Fallback parser: split by newlines and remove dashes if JSON fails
      return text.split('\n').filter(line => line.trim().startsWith('-')).map(l => l.replace('-', '').trim());
    }
  } catch (error) {
    console.error("Gemini API Error (Experience):", error);
    return ["Error generating points."];
  }
};

/**
 * Writes a cover letter. Can read a Resume PDF (Multimodal) to personalize it.
 * Used in: JobDetail -> Apply Modal.
 */
export const generateCoverLetter = async (
  jobTitle: string, 
  companyName: string, 
  candidateName: string,
  candidateProfile: string = "",
  resumeBase64?: string,
  resumeMimeType?: string
): Promise<string> => {
  if (!apiKey) return "AI service unavailable.";

  try {
    const textPrompt = `Write a professional and persuasive cover letter for the position of "${jobTitle}" at "${companyName}". 
    
    Candidate Name: "${candidateName}"
    
    ${resumeBase64 ? "Review the attached resume file to extract relevant skills and experience." : `Candidate's Profile Context: "${candidateProfile}"`}
    
    Instructions:
    1. Analyze the candidate's background to highlight relevant skills and experience for this specific job.
    2. Keep it concise (under 250 words), polite, and enthusiastic.
    3. Focus on why the candidate is a good fit.
    4. Return ONLY the body of the cover letter (no placeholders like [Your Name]).`;

    // Setup content parts. If resume exists, we send [Text Part, Image/PDF Part].
    let parts: any = [textPrompt];

    if (resumeBase64 && resumeMimeType) {
      parts = [
        textPrompt,
        {
          inlineData: {
            mimeType: resumeMimeType,
            data: resumeBase64
          }
        }
      ];
    }

    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const response = await model.generateContent(parts);
    return response.response.text() || "Could not generate cover letter.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating cover letter. Please try again.";
  }
};

/**
 * Checks if an uploaded file is actually a resume using AI vision/text analysis.
 * Used in: JobDetail (Apply) and SeekerDashboard (Upload).
 */
export const validateResume = async (fileBase64: string, mimeType: string): Promise<{ isValid: boolean; reason?: string }> => {
  if (!apiKey) return { isValid: true }; // Allow if no API key configured to avoid blocking users in dev.

  // Only send PDFs and Images to Gemini. Word docs need backend parsing usually, so we skip validation for them here.
  if (!mimeType.includes('pdf') && !mimeType.includes('image')) {
    return { isValid: true };
  }

  try {
     const prompt = `You are a Resume Validator for a professional job portal. 
     Analyze the attached document content.
     
     Validation Criteria:
     1. Is this a document that looks like a Resume or CV?
     2. Does it contain a Name and Contact Information (Email or Phone)?
     3. Does it contain at least one of these sections: Work Experience, Education, or Skills?
     
     If the document is a random image, a blank page, an invoice, or unrelated text, mark it as invalid.
     
     Return ONLY a JSON object:
     { 
       "isValid": boolean, 
       "reason": "Short explanation for the user if invalid (e.g., 'Document does not appear to be a resume', 'Missing contact info'). If valid, reason can be empty." 
     }`;

     const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
     const response = await model.generateContent([
       prompt,
       { inlineData: { mimeType, data: fileBase64 } }
     ]);

    const text = response.response.text() || "{}";
    try {
      const result = JSON.parse(text);
      return result;
    } catch (e) {
      console.error("Failed to parse validation response", e);
      return { isValid: true }; // Fallback to safe
    }
  } catch (error) {
    console.error("Resume Validation Error:", error);
    return { isValid: true }; // Fallback to allow upload if AI fails
  }
};

/**
 * Extracts structured data (Name, Email, Skills) from a resume PDF.
 * Used in: SeekerDashboard -> AI Auto-Fill Profile.
 */
export const parseResumeProfile = async (fileBase64: string, mimeType: string): Promise<{ name?: string, email?: string, phone?: string, bio?: string, skills?: string[] }> => {
    if (!apiKey) return {};

    try {
        const prompt = `Extract user profile information from this resume.
        
        Return ONLY a JSON object with these keys (if found):
        {
            "name": "Full Name",
            "email": "Email Address",
            "phone": "Phone Number",
            "bio": "A short 2-3 sentence professional summary based on experience",
            "skills": ["Array", "of", "Skills"]
        }
        
        If a field is not found, exclude it from the JSON.`;

        const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const response = await model.generateContent([
          prompt,
          { inlineData: { mimeType, data: fileBase64 } }
        ]);

        const text = response.response.text() || "{}";
        return JSON.parse(text);
    } catch (e) {
        console.error("Resume parsing failed", e);
        return {};
    }
};

/**
 * Generates interview questions based on Job Description + Candidate Resume.
 * Used in: InterviewModal (Seeker) and EmployerDashboard (Interview Prep).
 */
export const generateInterviewQuestions = async (
  jobTitle: string, 
  jobDescription: string,
  userProfile?: string,
  coverLetter?: string
): Promise<string[]> => {
  if (!apiKey) {
    // Mock response for dev
    return [
      "Could you tell me about yourself and your background?",
      "Why are you interested in this position at our company?",
      "What are your key strengths relevant to this role?",
      "Describe a challenge you faced at work and how you overcame it.",
      "Where do you see yourself in five years?"
    ];
  }

  try {
    // Create a very detailed context prompt for the best results
    let contextPrompt = `You are an expert Hiring Manager and Interview Coach. Your goal is to conduct a realistic interview for a "${jobTitle}" position.
    
    Job Description & Requirements:
    "${jobDescription.substring(0, 1500)}"
    
    Candidate Profile & Resume Details:
    "${userProfile ? userProfile.substring(0, 2000) : 'Not provided'}"`;

    if (coverLetter) {
      contextPrompt += `\n\nCandidate's Cover Letter:
      "${coverLetter.substring(0, 800)}"`;
    }

    contextPrompt += `\n\nINSTRUCTIONS:
    1. CRITICAL: Analyze the Job Description to identify the top 3 HARD SKILLS and top 2 SOFT SKILLS required.
    2. Analyze the Candidate Profile/Resume to find where they match these skills and where they might have gaps.
    3. Generate 5 distinct interview questions.
       - Question 1: Open-ended introduction based on their specific background/resume.
       - Question 2: Technical/Hard Skill question directly testing one of the top required skills found in the description.
       - Question 3: Behavioral question to test a soft skill mentioned in the requirements.
       - Question 4: Deep dive into a specific experience mentioned in their profile/resume.
       - Question 5: Situational challenge relevant to the specific role and industry.
    
    Return ONLY a JSON array of strings. Example: ["Question 1", "Question 2"]`;

    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const response = await model.generateContent(contextPrompt);

    const text = response.response.text() || "[]";
    try {
       const parsed = JSON.parse(text);
       return parsed;
    } catch (e) {
       console.error("JSON parse error for interview questions", e);
       return [
         "Tell me about yourself.",
         "Why do you want this job?"
       ];
    }
  } catch (error) {
    console.error("Gemini API Error (Interview):", error);
    return [
      "Tell me about yourself.",
      "Why do you want this job?"
    ];
  }
};

/**
 * Evaluates a user's answer to an interview question.
 * Used in: InterviewModal.
 */
export const evaluateInterviewAnswer = async (question: string, answer: string, jobDescription: string): Promise<string> => {
  if (!apiKey) return "Great answer! Keep practicing.";

  try {
    const prompt = `You are an Interview Coach. Evaluate the candidate's answer to the interview question.
    
    Job Description Snippet: "${jobDescription.substring(0, 300)}..."
    Question: "${question}"
    Candidate's Answer: "${answer}"
    
    Provide constructive feedback in 3 parts:
    1. **Strengths:** What they did well.
    2. **Areas for Improvement:** What was missing or could be better.
    3. **Model Answer:** A short example of a stronger answer.
    
    Keep it encouraging but professional.`;

    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const response = await model.generateContent(prompt);

    return response.response.text() || "Could not evaluate answer.";
  } catch (error) {
    console.error("Gemini API Error (Eval):", error);
    return "Error evaluating answer.";
  }
};

/**
 * Analyzes fit between candidate and job. Returns score and reasons.
 * Used in: JobDetail -> Match Analysis Widget.
 */
export const analyzeJobMatch = async (jobTitle: string, jobDesc: string, userProfile: string): Promise<MatchAnalysisResult | null> => {
    if (!apiKey) return { score: 75, reason: "Good match based on title.", strengths: ["Experience"], missingSkills: ["Specific tools"] };

    try {
        const prompt = `Analyze the compatibility between a candidate and a job opening.
        
        Job Title: ${jobTitle}
        Job Description: ${jobDesc.substring(0, 1000)}...
        
        Candidate Profile: ${userProfile}
        
        Return ONLY a JSON object:
        {
            "score": number (0-100),
            "reason": "One sentence summary of the match.",
            "strengths": ["List 2-3 matching skills"],
            "missingSkills": ["List 2-3 missing requirements"]
        }`;

        const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const response = await model.generateContent(prompt);

        const text = response.response.text() || "{}";
        return JSON.parse(text);
    } catch (e) {
        console.error("Match analysis failed", e);
        return null;
    }
};

/**
 * Suggests career paths based on current role.
 * Used in: SeekerDashboard -> Career Path Planner.
 */
export const generateCareerPath = async (currentRole: string): Promise<{title: string, steps: string[]}[]> => {
    if (!apiKey) return [{ title: "Senior " + currentRole, steps: ["Gain 2 years experience", "Lead a project"] }];

    try {
        const prompt = `Suggest 2 potential career paths for someone currently working as a "${currentRole}".
        
        For each path, list 3-4 key milestones/steps to reach the next level.
        
        Return ONLY a JSON array:
        [
            { "title": "Path Name (e.g. Technical Lead)", "steps": ["Step 1", "Step 2"] },
            ...
        ]`;

        const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const response = await model.generateContent(prompt);

        const text = response.response.text() || "[]";
        return JSON.parse(text);
    } catch (e) {
        console.error("Career path generation failed", e);
        return [];
    }
};

/**
 * Generates a multiple-choice quiz for a skill.
 * Used in: SkillAssessment Page.
 */
export const generateSkillQuiz = async (topic: string): Promise<QuizQuestion[]> => {
    if (!apiKey) {
        return [
            { question: `What is a key concept in ${topic}?`, options: ["Option A", "Option B", "Option C", "Option D"], correctAnswer: 0 },
            { question: `Which is NOT true about ${topic}?`, options: ["False Stmt", "True Stmt", "True Stmt", "True Stmt"], correctAnswer: 0 }
        ];
    }

    try {
        const prompt = `Generate a short multiple-choice quiz (5 questions) to test a candidate's knowledge of "${topic}".
        
        Return ONLY a JSON array:
        [
            { 
              "question": "Question text", 
              "options": ["A", "B", "C", "D"], 
              "correctAnswer": 0 (index of correct option) 
            }
        ]`;

        const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const response = await model.generateContent(prompt);

        const text = response.response.text() || "[]";
        return JSON.parse(text);
    } catch (e) {
        console.error("Quiz generation failed", e);
        return [];
    }
};

/**
 * Analyzes article content to generate SEO tags automatically.
 * Used in: EmployerDashboard -> Article Writer.
 */
export const analyzeArticleSEO = async (content: string, title: string): Promise<{ seoTitle: string, seoDescription: string, keywords: string[] }> => {
    if (!apiKey) return { seoTitle: title, seoDescription: content.substring(0, 150), keywords: ["Career", "Job"] };

    try {
        const prompt = `Analyze this blog post content and generate SEO metadata.
        
        Title: "${title}"
        Content Snippet: "${content.substring(0, 1000)}..."
        
        Return ONLY a JSON object:
        {
            "seoTitle": "Optimized Title (max 60 chars)",
            "seoDescription": "Meta Description (max 160 chars)",
            "keywords": ["5-7 relevant keywords"]
        }`;

        const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const response = await model.generateContent(prompt);

        const text = response.response.text() || "{}";
        return JSON.parse(text);
    } catch (e) {
        return { seoTitle: title, seoDescription: content.substring(0, 150), keywords: [] };
    }
};
