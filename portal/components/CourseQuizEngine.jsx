'use client';

import React, { useState, useEffect } from 'react';
import { Icon } from './Icons';

export default function CourseQuizEngine({
  moduleId,
  enrollmentId,
  onClose,
  onQuizCompleted,
}) {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState(null);

  useEffect(() => {
    async function loadQuiz() {
      try {
        setLoading(true);
        const res = await fetch(`/api/quizzes?moduleId=${moduleId}`);
        const data = await res.json();
        if (data.success && data.quiz) {
          setQuiz(data.quiz);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (moduleId) {
      loadQuiz();
    }
  }, [moduleId]);

  if (loading) {
    return (
      <div className="dash-panel" style={{ textAlign: 'center', padding: '40px' }}>
        <p style={{ color: 'var(--color-green-primary)', fontWeight: '700' }}>
          Loading assessment questions...
        </p>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="dash-panel" style={{ textAlign: 'center', padding: '40px' }}>
        <p style={{ color: 'var(--text-muted)' }}>No quiz configured for this module.</p>
        <button onClick={onClose} className="btn-table-action" style={{ marginTop: '10px' }}>
          Back to Lessons
        </button>
      </div>
    );
  }

  const currentQ = quiz.questions[currentIndex];
  const totalQuestions = quiz.questions.length;
  const isAnswered = selectedAnswers[currentIndex] !== undefined;
  const isLastQuestion = currentIndex === totalQuestions - 1;

  const handleSelectOption = (optIndex) => {
    if (quizResult) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: optIndex,
    }));
  };

  const handleSubmitQuiz = async () => {
    setIsSubmitting(true);
    try {
      const answersArray = quiz.questions.map((_, idx) => selectedAnswers[idx] ?? -1);
      const res = await fetch('/api/quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enrollmentId,
          quizId: quiz.id,
          answers: answersArray,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setQuizResult(data.result);
        if (onQuizCompleted) onQuizCompleted(data.result);
      } else {
        alert(data.error || 'Failed to submit quiz.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        background: 'var(--color-white)',
        border: '2px solid var(--color-gold-primary)',
        borderRadius: '20px',
        padding: '32px',
        boxShadow: 'var(--shadow-elevated)',
        maxWidth: '720px',
        margin: '0 auto',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1.5px solid var(--border-light)', paddingBottom: '16px', marginBottom: '24px' }}>
        <div>
          <span className="dashboard-user-badge" style={{ marginBottom: '4px' }}>
            Tajweed Assessment • Passing Grade: {quiz.passingScore}%
          </span>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', fontWeight: '700', color: 'var(--color-green-primary)' }}>
            {quiz.title}
          </h3>
        </div>

        <button
          onClick={onClose}
          className="btn-table-action"
          style={{ fontSize: '13px' }}
        >
          Exit Assessment ✕
        </button>
      </div>

      {/* Result Card if submitted */}
      {quizResult ? (
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <div style={{ fontSize: '56px', marginBottom: '12px' }}>
            {quizResult.passed ? '🎉' : '📖'}
          </div>

          <h4
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '28px',
              fontWeight: '700',
              color: quizResult.passed ? '#166534' : '#991B1B',
              marginBottom: '8px',
            }}
          >
            {quizResult.passed ? 'Alhamdulillah! You Passed!' : 'Revision Recommended'}
          </h4>

          <p style={{ fontSize: '15px', color: 'var(--text-body)', marginBottom: '20px' }}>
            You scored <strong style={{ fontSize: '18px', color: 'var(--color-green-primary)' }}>{quizResult.score}%</strong> ({quizResult.correctCount} of {quizResult.totalQuestions} correct).
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              onClick={onClose}
              className="btn-auth-submit"
              style={{ margin: 0, width: 'auto', padding: '10px 24px' }}
            >
              Return to Course Syllabus
            </button>
            <button
              onClick={() => {
                setQuizResult(null);
                setCurrentIndex(0);
                setSelectedAnswers({});
              }}
              className="btn-table-action"
            >
              Retake Assessment
            </button>
          </div>
        </div>
      ) : (
        /* Question Form */
        <div>
          {/* Progress Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--color-gold-deep)' }}>
              Question {currentIndex + 1} of {totalQuestions}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              ⏱ {quiz.timeLimitMinutes} Mins Allocated
            </span>
          </div>

          <div style={{ width: '100%', height: '6px', background: '#E2E8F0', borderRadius: '999px', overflow: 'hidden', marginBottom: '24px' }}>
            <div
              style={{
                width: `${((currentIndex + 1) / totalQuestions) * 100}%`,
                height: '100%',
                background: 'linear-gradient(90deg, var(--color-green-primary) 0%, var(--color-gold-primary) 100%)',
                transition: 'width 0.3s ease',
              }}
            />
          </div>

          {/* Question Prompt */}
          <h4 style={{ fontSize: '21px', fontWeight: '700', color: 'var(--color-green-deep)', marginBottom: '22px', lineHeight: '1.45' }}>
            {currentQ.prompt}
          </h4>

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
            {currentQ.options.map((opt, oIdx) => {
              const isSelected = selectedAnswers[currentIndex] === oIdx;

              return (
                <div
                  key={oIdx}
                  onClick={() => handleSelectOption(oIdx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '16px 20px',
                    borderRadius: '14px',
                    border: isSelected ? '2px solid var(--color-gold-primary)' : '1.5px solid var(--border-light)',
                    background: isSelected ? 'var(--color-gold-light)' : 'var(--color-white)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      border: isSelected ? '2px solid var(--color-gold-deep)' : '2px solid #CBD5E1',
                      background: isSelected ? 'var(--color-green-primary)' : 'transparent',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '13px',
                      fontWeight: '700',
                      flexShrink: 0,
                    }}
                  >
                    {String.fromCharCode(65 + oIdx)}
                  </span>
                  <span style={{ fontSize: '16px', fontWeight: isSelected ? '700' : '500', color: 'var(--text-main)', lineHeight: '1.5' }}>
                    {opt}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="btn-table-action"
              style={{ opacity: currentIndex === 0 ? 0.4 : 1 }}
            >
              ← Previous
            </button>

            {isLastQuestion ? (
              <button
                onClick={handleSubmitQuiz}
                disabled={!isAnswered || isSubmitting}
                className="btn-auth-submit"
                style={{ margin: 0, width: 'auto', padding: '10px 24px' }}
              >
                {isSubmitting ? 'Grading Answers...' : 'Submit Assessment for Grading ✓'}
              </button>
            ) : (
              <button
                onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                disabled={!isAnswered}
                className="btn-auth-submit"
                style={{ margin: 0, width: 'auto', padding: '10px 20px', opacity: !isAnswered ? 0.5 : 1 }}
              >
                <span>Next Question →</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
