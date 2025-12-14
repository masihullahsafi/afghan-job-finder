
import React, { useState } from 'react';
import { SEO } from '../components/SEO';
import { useAppContext } from '../context/AppContext';
import { Award, CheckCircle, ChevronRight, Loader2, BookOpen, AlertCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { generateSkillQuiz } from '../services/geminiService';
import { QuizQuestion } from '../types';

export const SkillAssessment: React.FC = () => {
  const { t, user, updateUserProfile } = useAppContext();
  const navigate = useNavigate();
  
  const [selectedTopic, setSelectedTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const TOPICS = [
    'General Knowledge', 'English Language', 'Project Management', 
    'React Development', 'Digital Marketing', 'Customer Service',
    'Financial Accounting', 'Graphic Design'
  ];

  const handleStartQuiz = async (topic: string) => {
      if (!user) {
          navigate('/auth', { state: { message: "Login to take assessments." } });
          return;
      }
      setSelectedTopic(topic);
      setIsGenerating(true);
      const quiz = await generateSkillQuiz(topic);
      setQuestions(quiz);
      setIsGenerating(false);
      setCurrentQuestionIdx(0);
      setAnswers([]);
      setScore(null);
      setShowResult(false);
  };

  const handleAnswer = (optionIdx: number) => {
      const newAnswers = [...answers];
      newAnswers[currentQuestionIdx] = optionIdx;
      setAnswers(newAnswers);
  };

  const handleNext = () => {
      if (currentQuestionIdx < questions.length - 1) {
          setCurrentQuestionIdx(prev => prev + 1);
      } else {
          finishQuiz();
      }
  };

  const finishQuiz = () => {
      let correctCount = 0;
      questions.forEach((q, idx) => {
          if (answers[idx] === q.correctAnswer) correctCount++;
      });
      const finalScore = (correctCount / questions.length) * 100;
      setScore(finalScore);
      setShowResult(true);

      if (finalScore >= 80) {
          // Add badge to user profile
          const currentSkills = user?.verifiedSkills || [];
          if (!currentSkills.includes(selectedTopic)) {
              updateUserProfile({
                  verifiedSkills: [...currentSkills, selectedTopic]
              });
          }
      }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <SEO title={t('skillAssessment')} description="Verify your skills with AI-powered quizzes." />
      <div className="container mx-auto px-4 max-w-3xl">
        
        {/* Back Button */}
        <button 
           onClick={() => navigate(-1)} 
           className="mb-4 flex items-center gap-1 text-gray-500 hover:text-gray-900 transition font-medium text-sm"
        >
           <ArrowLeft size={16} /> {t('back')}
        </button>

        {/* Header */}
        <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-2">
                <Award className="text-primary-600" /> {t('skillAssessment')}
            </h1>
            <p className="text-gray-600">{t('takeQuiz')}</p>
        </div>

        {/* Topic Selection */}
        {!isGenerating && questions.length === 0 && !showResult && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {TOPICS.map(topic => (
                    <button 
                        key={topic}
                        onClick={() => handleStartQuiz(topic)}
                        className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-primary-200 transition text-left flex justify-between items-center group"
                    >
                        <span className="font-bold text-gray-800">{topic}</span>
                        <ChevronRight className="text-gray-300 group-hover:text-primary-600 transition" />
                    </button>
                ))}
            </div>
        )}

        {/* Loading State */}
        {isGenerating && (
            <div className="text-center py-20">
                <Loader2 className="animate-spin text-primary-600 mx-auto mb-4" size={48} />
                <h2 className="text-xl font-bold text-gray-900">{t('generating')}</h2>
                <p className="text-gray-500">{selectedTopic}...</p>
            </div>
        )}

        {/* Quiz Interface */}
        {!isGenerating && questions.length > 0 && !showResult && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gray-900 text-white p-6 flex justify-between items-center">
                    <h2 className="font-bold text-lg">{selectedTopic}</h2>
                    <span className="bg-gray-800 px-3 py-1 rounded-full text-xs font-medium">{t('question')} {currentQuestionIdx + 1}/{questions.length}</span>
                </div>
                
                <div className="p-8">
                     <h3 className="text-xl font-bold text-gray-900 mb-6">{questions[currentQuestionIdx].question}</h3>
                     
                     <div className="space-y-3 mb-8">
                         {questions[currentQuestionIdx].options.map((option, idx) => (
                             <button
                                key={idx}
                                onClick={() => handleAnswer(idx)}
                                className={`w-full text-left p-4 rounded-xl border-2 transition flex items-center gap-3 ${
                                    answers[currentQuestionIdx] === idx 
                                    ? 'border-primary-600 bg-primary-50 text-primary-800 font-medium' 
                                    : 'border-gray-100 hover:border-gray-200 text-gray-700'
                                }`}
                             >
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                    answers[currentQuestionIdx] === idx ? 'border-primary-600' : 'border-gray-300'
                                }`}>
                                    {answers[currentQuestionIdx] === idx && <div className="w-3 h-3 bg-primary-600 rounded-full"></div>}
                                </div>
                                {option}
                             </button>
                         ))}
                     </div>

                     <div className="flex justify-end">
                         <button 
                            onClick={handleNext}
                            disabled={answers[currentQuestionIdx] === undefined}
                            className="bg-primary-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                         >
                            {currentQuestionIdx === questions.length - 1 ? 'Finish' : t('nextQuestion')} <ChevronRight size={18} />
                         </button>
                     </div>
                </div>
            </div>
        )}

        {/* Result Screen */}
        {showResult && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-10 text-center animate-in fade-in zoom-in duration-300">
                {score! >= 80 ? (
                    <>
                        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Award size={48} />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('congratulations')}</h2>
                        <p className="text-lg text-gray-600 mb-6">You passed the {selectedTopic} assessment.</p>
                        <div className="text-4xl font-extrabold text-green-600 mb-8">{score}%</div>
                        <div className="bg-green-50 text-green-800 p-4 rounded-xl mb-8 border border-green-100 flex items-center justify-center gap-2">
                            <CheckCircle size={20} /> Badge added to your profile!
                        </div>
                    </>
                ) : (
                    <>
                        <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertCircle size={48} />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('keepPracticing')}</h2>
                        <p className="text-lg text-gray-600 mb-6">You need 80% to earn a badge.</p>
                        <div className="text-4xl font-extrabold text-red-600 mb-8">{score}%</div>
                    </>
                )}

                <div className="flex justify-center gap-4">
                    <button 
                        onClick={() => { setQuestions([]); setShowResult(false); }}
                        className="px-6 py-3 border border-gray-300 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition"
                    >
                        {t('backToTopics')}
                    </button>
                    <button 
                         onClick={() => navigate('/seeker')}
                         className="px-6 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition"
                    >
                        {t('dashboard')}
                    </button>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};
