import React, { useState } from 'react';
import type { TestQuestion } from '../types';

const questions: TestQuestion[] = [
  {
    id: 1,
    question: "What changes when a neural network 'learns' an association?",
    options: [
      "The neurons themselves are replaced",
      "The connection weights between neurons strengthen",
      "New neurons are created",
      "The activation function changes"
    ],
    correctAnswer: 1,
    explanation: "Learning happens through synaptic plasticity—the strengthening or weakening of connections between neurons, not by adding/removing neurons."
  },
  {
    id: 2,
    question: "What happens when you teach conflicting associations (e.g., DOG→ANIMAL then DOG→PET)?",
    options: [
      "The first memory is completely erased",
      "Both connections strengthen equally",
      "Interference occurs—both connections may weaken",
      "The network creates a new neuron for the second association"
    ],
    correctAnswer: 2,
    explanation: "Interference is a fundamental limitation of synaptic memory. Competing associations can weaken each other, demonstrating why memory management is challenging."
  },
  {
    id: 3,
    question: "How does BDH differ from traditional transformer attention?",
    options: [
      "BDH uses more parameters",
      "BDH stores attention as synaptic memory instead of large KV caches",
      "BDH doesn't use any form of attention",
      "BDH only works for small models"
    ],
    correctAnswer: 1,
    explanation: "BDH reformulates attention as synaptic memory through Hebbian-style writes, enabling efficient in-context learning without massive key-value caches."
  }
];

export const SixtySecondTest: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [startTime] = useState(Date.now());
  const [endTime, setEndTime] = useState<number | null>(null);

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setEndTime(Date.now());
      setShowResults(true);
    }
  };

  const resetTest = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setEndTime(null);
  };

  const score = selectedAnswers.filter(
    (answer, index) => answer === questions[index].correctAnswer
  ).length;

  const timeTaken = endTime ? Math.round((endTime - startTime) / 1000) : 0;

  if (showResults) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 space-y-4 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-4">Test Results</h2>
        
        <div className="bg-gray-900 rounded-lg p-6 text-center space-y-4">
          <div className="text-6xl font-bold">
            {score === 3 ? '🎉' : score === 2 ? '👍' : '📚'}
          </div>
          
          <div className="text-3xl font-bold text-white">
            {score} / {questions.length}
          </div>
          
          <div className="text-lg text-gray-300">
            Completed in {timeTaken} seconds
          </div>

          {score === 3 && (
            <div className="text-green-400 font-semibold">
              Perfect! You understand synaptic plasticity!
            </div>
          )}
          {score === 2 && (
            <div className="text-yellow-400 font-semibold">
              Good job! Review the concepts you missed.
            </div>
          )}
          {score < 2 && (
            <div className="text-orange-400 font-semibold">
              Try exploring the simulation more before retaking.
            </div>
          )}
        </div>

        {/* Show explanations */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">Explanations</h3>
          {questions.map((q, index) => (
            <div key={q.id} className="bg-gray-900 rounded-lg p-4 space-y-2">
              <div className="flex items-start gap-2">
                <span className={`text-xl ${selectedAnswers[index] === q.correctAnswer ? 'text-green-400' : 'text-red-400'}`}>
                  {selectedAnswers[index] === q.correctAnswer ? '✓' : '✗'}
                </span>
                <div className="flex-1">
                  <p className="font-semibold text-white">{q.question}</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Your answer: {q.options[selectedAnswers[index]]}
                  </p>
                  {selectedAnswers[index] !== q.correctAnswer && (
                    <p className="text-sm text-green-400 mt-1">
                      Correct answer: {q.options[q.correctAnswer]}
                    </p>
                  )}
                  <p className="text-sm text-gray-300 mt-2 italic">
                    {q.explanation}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={resetTest}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Retake Test
        </button>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="bg-gray-800 rounded-lg p-6 space-y-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white">Sixty-Second Test</h2>
        <div className="text-sm text-gray-400">
          Question {currentQuestion + 1} of {questions.length}
        </div>
      </div>

      <div className="bg-gray-900 rounded-lg p-6 space-y-4">
        <p className="text-lg text-white font-medium">{question.question}</p>

        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              className="w-full text-left bg-gray-700 hover:bg-gray-600 text-white p-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <span className="font-semibold mr-2">
                {String.fromCharCode(65 + index)}.
              </span>
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
        />
      </div>
    </div>
  );
};
