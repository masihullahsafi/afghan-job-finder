
import React, { useState, useEffect } from 'react';
import { X, Sparkles, Send, ChevronRight, ChevronLeft, Loader2, MessageSquare, Briefcase, User, FileText, CheckCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { generateInterviewQuestions, evaluateInterviewAnswer } from '../services/geminiService';
import { InterviewSession } from '../types';

interface InterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId?: string;
  jobTitle: string;
  jobDescription: string;
  companyName: string;
}

export const InterviewModal: React.FC<InterviewModalProps> = ({ 
  isOpen, onClose, jobId, jobTitle, jobDescription, companyName 
}) => {
  const { t, user, applications, addInterviewSession } = useAppContext();
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  
  // Session Recording
  const [sessionTranscript, setSessionTranscript] = useState<{question: string, answer: string, feedback: string}[]>([]);
  
  // Loading States
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Reset state when opening
      setQuestions([]);
      setCurrentQuestionIndex(0);
      setUserAnswer('');
      setFeedback(null);
      setSessionTranscript([]);
      loadQuestions();
    }
  }, [isOpen]);

  const loadQuestions = async () => {
    setIsLoadingQuestions(true);
    
    // 1. Construct Profile Context
    let userProfile = "";
    if (user) {
        userProfile = `Candidate Name: ${user.name}\nProfessional Title: ${user.jobTitle || 'Not specified'}\nBio/Summary: ${user.bio || 'Not specified'}`;
        
        if (user.resume) {
          userProfile += `\nResume Filename: ${user.resume} (Assume typical skills for this role)`;
        }
    }

    // 2. Find specific application context if available
    let coverLetter = "";
    if (user && jobId) {
        const app = applications.find(a => a.jobId === jobId && a.seekerId === user.id);
        if (app) {
            coverLetter = app.coverLetter;
            userProfile += `\n\n[Application Status: ${app.status}]`;
            if (app.resumeUrl) {
               userProfile += `\nSubmitted Resume: ${app.resumeUrl}`;
            }
        }
    }

    // 3. Generate Questions using rich context
    const generated = await generateInterviewQuestions(jobTitle, jobDescription, userProfile, coverLetter);
    setQuestions(generated);
    setIsLoadingQuestions(false);
  };

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) return;
    setIsEvaluating(true);
    const result = await evaluateInterviewAnswer(questions[currentQuestionIndex], userAnswer, jobDescription);
    setFeedback(result);
    
    // Record interaction
    const newInteraction = {
        question: questions[currentQuestionIndex],
        answer: userAnswer,
        feedback: result
    };
    
    setSessionTranscript(prev => {
        const updated = [...prev];
        updated[currentQuestionIndex] = newInteraction; // Update or Add
        return updated;
    });

    setIsEvaluating(false);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setFeedback(null);
      setUserAnswer('');
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
       finishSession();
    }
  };

  const finishSession = () => {
      if (user && sessionTranscript.length > 0) {
          // Calculate mock score based on transcript length/completion
          const completionRate = sessionTranscript.length / questions.length;
          const score = Math.round(completionRate * (70 + Math.random() * 30)); // Random score 70-100 if completed

          const session: InterviewSession = {
              id: Date.now().toString(),
              userId: user.id,
              jobTitle,
              companyName,
              date: new Date().toISOString().split('T')[0],
              transcript: sessionTranscript,
              score
          };
          
          addInterviewSession(session);
          alert(`Practice session saved! You scored ${score}/100.`);
      }
      onClose();
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
        const prevIdx = currentQuestionIndex - 1;
        setCurrentQuestionIndex(prevIdx);
        // Load previous answer if exists
        if (sessionTranscript[prevIdx]) {
            setUserAnswer(sessionTranscript[prevIdx].answer);
            setFeedback(sessionTranscript[prevIdx].feedback);
        } else {
            setUserAnswer('');
            setFeedback(null);
        }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
             <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
               <Sparkles className="text-purple-600" /> {t('interviewPrep')}
             </h2>
             <div className="text-xs text-gray-500 mt-1 flex flex-col sm:flex-row gap-x-4 gap-y-1">
               <span className="flex items-center gap-1"><Briefcase size={12}/> {jobTitle} at {companyName}</span>
               {user && (
                 <span className="flex items-center gap-1 text-purple-600">
                   <User size={12}/> 
                   Context: {user.name} {jobId && applications.find(a => a.jobId === jobId && a.seekerId === user.id) ? '(Applied)' : '(General)'}
                 </span>
               )}
             </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition"><X size={24} /></button>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto">
           {isLoadingQuestions ? (
             <div className="flex flex-col items-center justify-center py-16 text-center">
                <Loader2 size={48} className="text-purple-600 animate-spin mb-6"/>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{t('analyzing')}</h3>
                <p className="text-sm text-gray-500 max-w-sm mx-auto">
                   Our AI is reviewing the job requirements ({jobDescription.substring(0, 50)}...) and your profile to generate tailored questions.
                </p>
             </div>
           ) : questions.length > 0 ? (
             <div className="space-y-6">
                {/* Progress Bar */}
                <div className="w-full bg-gray-100 rounded-full h-2">
                   <div 
                     className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                     style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                   ></div>
                </div>
                
                {/* Question Card */}
                <div className="bg-purple-50 p-6 rounded-xl border border-purple-100 shadow-sm">
                   <span className="text-xs font-bold text-purple-700 uppercase tracking-wide mb-2 block">{t('question')} {currentQuestionIndex + 1} of {questions.length}</span>
                   <h3 className="text-xl font-bold text-gray-900 leading-relaxed">{questions[currentQuestionIndex]}</h3>
                </div>

                {/* Answer Area */}
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">{t('yourAnswer')}</label>
                   <textarea 
                     value={userAnswer}
                     onChange={(e) => setUserAnswer(e.target.value)}
                     rows={6}
                     placeholder="Type your answer here as if you are in the interview..."
                     className="w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none text-gray-800"
                     disabled={!!feedback || isEvaluating}
                   ></textarea>
                </div>

                {/* Feedback Area */}
                {feedback && (
                    <div className="bg-green-50 p-6 rounded-xl border border-green-100 animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-sm">
                        <h4 className="flex items-center gap-2 font-bold text-green-800 mb-4 border-b border-green-200 pb-2">
                           <MessageSquare size={18}/> {t('feedback')}
                        </h4>
                        <div className="prose prose-sm prose-green max-w-none text-gray-700">
                           {feedback.split('**').map((part, index) => {
                             if (index % 2 === 1) return <strong key={index} className="text-green-900 block mt-3 mb-1">{part}</strong>;
                             return <span key={index}>{part}</span>;
                           })}
                        </div>
                    </div>
                )}
             </div>
           ) : (
             <div className="text-center py-12">
               <p className="text-red-500">Failed to load questions. Please try again later.</p>
             </div>
           )}
        </div>

        {/* Footer / Controls */}
        {!isLoadingQuestions && questions.length > 0 && (
          <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center rounded-b-2xl">
             <button 
                onClick={handlePrev}
                disabled={currentQuestionIndex === 0}
                className="text-gray-500 hover:text-gray-800 font-medium px-4 py-2 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 hover:bg-gray-100 transition"
             >
                <ChevronLeft size={18}/> {t('prevQuestion')}
             </button>

             {feedback ? (
                <button 
                  onClick={handleNext}
                  className="bg-purple-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-purple-700 transition flex items-center gap-2 shadow-lg shadow-purple-500/30"
                >
                  {currentQuestionIndex === questions.length - 1 ? 'Finish Practice' : t('nextQuestion')} <ChevronRight size={18}/>
                </button>
             ) : (
                <button 
                  onClick={handleSubmitAnswer}
                  disabled={isEvaluating || !userAnswer.trim()}
                  className="bg-primary-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-primary-700 transition flex items-center gap-2 disabled:opacity-70 shadow-lg shadow-primary-500/20"
                >
                  {isEvaluating ? (
                    <>
                      <Loader2 size={18} className="animate-spin"/> Analyzing...
                    </>
                  ) : (
                    <>
                      <Send size={18}/> {t('getFeedback')}
                    </>
                  )}
                </button>
             )}
          </div>
        )}
      </div>
    </div>
  );
};
