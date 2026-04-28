import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BrainCircuit, CheckCircle2, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getQuizQuestions, nextQuestion, resetQuiz } from '../redux/quizSlice';

function Quiz() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // جلب البيانات من Redux
  const { 
    questions, 
    currentStep, 
    score, 
    isFinished, 
    isLoading 
  } = useSelector((state) => state.quiz);

  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);

  // 1. جلب الأسئلة عند فتح الصفحة وتصفير الحالة القديمة
  useEffect(() => {
    dispatch(resetQuiz());
    dispatch(getQuizQuestions());
  }, [dispatch]);

  // 2. إدارة التايمر (العداد التنازلي)
  useEffect(() => {
    if (timeLeft > 0 && selectedAnswer === null && questions.length > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && selectedAnswer === null && questions.length > 0) {
      handleAnswer(-1); // الوقت خلص بنعتبرها إجابة خطأ
    }
  }, [timeLeft, selectedAnswer, questions]);

  // 3. الانتقال لصفحة النتيجة عند الانتهاء
  useEffect(() => {
    if (isFinished) {
      navigate('/result', { state: { finalScore: score } });
    }
  }, [isFinished, navigate, score]);

  // دالة معالجة الاختيار
  const handleAnswer = (index) => {
    if (selectedAnswer !== null || questions.length === 0) return;

    setSelectedAnswer(index);
    
    // التصحيح السحري هنا: نقارن نص الاختيار بنص الإجابة الصحيحة من الباك أند
    const isCorrect = questions[currentStep].options[index] === questions[currentStep].correctAnswer;
    
    setTimeout(() => {
      dispatch(nextQuestion({ selectedAnswer: index, isCorrect }));
      setSelectedAnswer(null);
      setTimeLeft(30);
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="text-blue-500 animate-spin mx-auto mb-4" size={50} />
          <p className="text-gray-400 font-bold">جاري تجهيز الأسئلة...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) return null;

  const currentQuestion = questions[currentStep];
  const progressPercentage = ((currentStep + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-['Cairo']" dir="rtl">
      
      {/* تأثيرات الإضاءة الخلفية */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />

      {/* Header: التقدم والوقت */}
      <div className="z-10 w-full max-w-[800px] flex items-center justify-between mb-8 px-4">
        <div className="flex flex-col gap-2 w-2/3">
           <span className="text-2xl font-black text-blue-400">{currentStep + 1} / {questions.length}</span>
           <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
              />
           </div>
        </div>

        <div className="relative flex items-center justify-center">
          <svg className="w-20 h-20 transform -rotate-90">
            <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/5" />
            <motion.circle 
              cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="4" fill="transparent" 
              strokeDasharray="226"
              animate={{ strokeDashoffset: 226 - (226 * timeLeft) / 30 }}
              className={timeLeft < 10 ? "text-red-500" : "text-emerald-400"}
            />
          </svg>
          <span className="absolute font-bold text-xl">{timeLeft}</span>
        </div>
      </div>

      {/* كارت السؤال */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentStep}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="z-10 w-full max-w-[850px] bg-white/[0.03] backdrop-blur-[30px] border border-white/10 rounded-[40px] p-10 md:p-16 shadow-2xl relative"
        >
          <BrainCircuit className="absolute top-6 right-6 text-white/5" size={80} />
          
          <h2 className="text-3xl md:text-4xl font-bold mb-12 leading-tight text-center">
            {currentQuestion?.questionText}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQuestion?.options.map((option, index) => {
              // التصحيح في العرض أيضاً: مقارنة النص بالنص
              const isCorrectOption = option === currentQuestion.correctAnswer;
              const isSelected = selectedAnswer === index;
              
              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={selectedAnswer !== null}
                  className={`
                    group relative p-6 rounded-2xl border transition-all duration-300 text-xl font-medium flex items-center justify-between
                    ${selectedAnswer === null ? "border-white/10 hover:border-white/30 bg-white/5" : ""}
                    ${isSelected && isCorrectOption ? "border-emerald-500 bg-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.3)]" : ""}
                    ${isSelected && !isCorrectOption ? "border-red-500 bg-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.2)]" : ""}
                    ${selectedAnswer !== null && isCorrectOption ? "border-emerald-500 bg-emerald-500/10" : ""}
                    ${selectedAnswer !== null && !isSelected && !isCorrectOption ? "opacity-40 border-white/5" : ""}
                  `}
                >
                  <span>{option}</span>
                  {selectedAnswer !== null && isCorrectOption && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      <CheckCircle2 className="text-emerald-500" />
                    </motion.div>
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* الـ Score الحالي */}
      <div className="absolute bottom-10 text-white/[0.02] text-9xl font-black select-none pointer-events-none uppercase">
        Score: {score}
      </div>
    </div>
  );
}

export default Quiz;