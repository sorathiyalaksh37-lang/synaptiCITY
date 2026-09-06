import React, { useState } from 'react';
import type { TestQuestion } from '../types';

interface ExtendedQuestion extends TestQuestion {
  category: 'FOUNDATIONS' | 'RECALL' | 'BDH' | 'BDHCQ';
  categoryLabel: string;
}

const questions: ExtendedQuestion[] = [
  {
    id: 1,
    category: 'FOUNDATIONS',
    categoryLabel: 'SYNAPTIC PLASTICITY',
    question: "What fundamental change occurs in a neural network when a new association is learned?",
    options: [
      "New physical neurons are dynamically generated",
      "The connection weight (synaptic strength) between neurons increases",
      "The global activation threshold function changes",
      "Previous network memories are wiped clean"
    ],
    correctAnswer: 1,
    explanation: "Learning happens through synaptic plasticity—increasing or decreasing connection weights between neurons based on activity, rather than adding or deleting neurons."
  },
  {
    id: 2,
    category: 'FOUNDATIONS',
    categoryLabel: 'HEBBIAN LEARNING',
    question: "What does repeated co-activation of two connected neurons do over time according to the Hebbian rule?",
    options: [
      "It causes the network connection to decay to zero",
      "It continuously adds Δw to the connection weight according to the Hebbian rule (Δw = η × aᵢ × aⱼ)",
      "It locks the network so no other associations can be formed",
      "It forces the output node to disconnect from all other inputs"
    ],
    correctAnswer: 1,
    explanation: "Hebbian plasticity dictates that repeated co-activation of pre- and post-synaptic units repeatedly adds Δw = η × aᵢ × aⱼ, strengthening the connection over time."
  },
  {
    id: 3,
    category: 'FOUNDATIONS',
    categoryLabel: 'INITIAL ASSOCIATION',
    question: "In Stage 01, what does the first DOG → ANIMAL teaching event establish in the model?",
    options: [
      "It immediately completes the entire 5-stage experiment",
      "It forms the initial directed synaptic connection (w > 0) between DOG and ANIMAL",
      "It erases all other words in the vocabulary",
      "It sets the connection weight directly to maximum saturation (w = 1.0)"
    ],
    correctAnswer: 1,
    explanation: "The first teaching event initializes a non-zero connection weight between DOG and ANIMAL, creating the visual edge and initial association."
  },
  {
    id: 4,
    category: 'FOUNDATIONS',
    categoryLabel: 'ACCUMULATIVE REPETITION',
    question: "Why is performing a second separate DOG → ANIMAL teach event necessary in Stage 02?",
    options: [
      "The first teaching event is automatically ignored by the model",
      "A single teaching event creates the edge, but a second pulse strengthens the weight to demonstrate accumulation",
      "Stage 02 requires changing the pulse count slider instead of teaching again",
      "The network requires two pulses to unlock the recall interface"
    ],
    correctAnswer: 1,
    explanation: "Stage 02 demonstrates genuine repetition: a second separate teaching action adds another Δw increment, demonstrating how experience strengthens memory."
  },
  {
    id: 5,
    category: 'RECALL',
    categoryLabel: 'RECALL MECHANISM',
    question: "How does the toy network decide which output word to predict when recall is triggered on 'DOG'?",
    options: [
      "It always chooses the word taught most recently",
      "It randomly selects from all words in the 6-word vocabulary",
      "It evaluates outgoing weights from DOG and selects the output node with the highest score",
      "It queries a static dictionary file stored on the server"
    ],
    correctAnswer: 2,
    explanation: "Recall evaluates outgoing connection weights for the input node and retrieves whichever output node produces the highest activation score."
  },
  {
    id: 6,
    category: 'RECALL',
    categoryLabel: 'NUMERICAL REASONING',
    question: "Suppose DOG → ANIMAL has weight 0.72 and DOG → PET has weight 0.31. What will the recall mechanism output and why?",
    options: [
      "PET, because recent associations are always preferred",
      "ANIMAL, because its connection weight (0.72) is significantly higher than PET (0.31)",
      "Both words simultaneously in a single text output",
      "Neither word, because the margin is too large"
    ],
    correctAnswer: 1,
    explanation: "Because ANIMAL has a connection weight of 0.72 versus PET's 0.31, recall selects ANIMAL as the highest-scoring output."
  },
  {
    id: 7,
    category: 'RECALL',
    categoryLabel: 'COMPETING ASSOCIATIONS',
    question: "Why can DOG → ANIMAL and DOG → PET coexist in the weight matrix?",
    options: [
      "DOG → PET automatically overrides DOG → ANIMAL because it was taught later",
      "DOG → ANIMAL is deleted immediately when DOG → PET is taught",
      "Multiple paths share an input node and coexist in the matrix, competing during recall based on their weights",
      "The model triggers a runtime error due to memory conflict"
    ],
    correctAnswer: 2,
    explanation: "Associations coexist in the weight matrix. When multiple paths share the same input node, they compete during recall based on their respective weights."
  },
  {
    id: 8,
    category: 'BDH',
    categoryLabel: 'EXPERIMENT → BDH',
    question: "What is the legitimate conceptual relationship between the SynapCity experiment and BDH research?",
    options: [
      "SynapCity is a full production reimplementation of BDH and BDH-CQ",
      "Both explore memory-like behavior through internal state changes, but use different underlying mechanisms",
      "SynapCity proves that BDH is a literal, 1-to-1 simulation of the human brain",
      "There is no relationship between connection weight learning and neural AI research"
    ],
    correctAnswer: 1,
    explanation: "SynapCity demonstrates simple Hebbian weight changes, while BDH investigates recurrent latent state architectures. They are conceptually related computational ideas, not identical implementations."
  },
  {
    id: 9,
    category: 'BDH',
    categoryLabel: 'BDH vs KV CACHE',
    question: "How does BDH carry context information differently from traditional Transformer Key-Value (KV) caches?",
    options: [
      "BDH stores past tokens in a larger external database",
      "BDH updates an internal recurrent hidden state during processing instead of accumulating explicit token KV caches",
      "BDH disables context processing entirely",
      "BDH requires full model retraining for every single input token"
    ],
    correctAnswer: 1,
    explanation: "BDH reformulates attention as recurrent synaptic memory, representing context in an updated hidden state rather than accumulating an explicit KV cache."
  },
  {
    id: 10,
    category: 'BDHCQ',
    categoryLabel: 'BDH-CQ LATENT REASONING',
    question: "What distinguishes BDH-CQ from base BDH architecture research?",
    options: [
      "BDH-CQ incorporates recurrent latent reasoning for in-context learning from demonstrations",
      "BDH-CQ is a hardware microchip manufactured for phones",
      "BDH-CQ replaces neural network weights with symbolic IF-THEN rules",
      "BDH-CQ only works on 6-word vocabularies"
    ],
    correctAnswer: 0,
    explanation: "BDH-CQ extends base BDH by demonstrating how recurrent latent states can perform reasoning from demonstrations without needing explicit verbalized chain-of-thought tokens."
  }
];

export const SixtySecondTest: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null));
  const [confirmedAnswers, setConfirmedAnswers] = useState<boolean[]>(new Array(questions.length).fill(false));
  const [showResults, setShowResults] = useState(false);
  const [startTime] = useState(Date.now());
  const [endTime, setEndTime] = useState<number | null>(null);

  const handleSelectOption = (answerIndex: number) => {
    if (confirmedAnswers[currentQuestion]) return;
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleConfirmAnswer = () => {
    if (selectedAnswers[currentQuestion] === null) return;
    const newConfirmed = [...confirmedAnswers];
    newConfirmed[currentQuestion] = true;
    setConfirmedAnswers(newConfirmed);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setEndTime(Date.now());
      setShowResults(true);
    }
  };

  const resetTest = () => {
    setCurrentQuestion(0);
    setSelectedAnswers(new Array(questions.length).fill(null));
    setConfirmedAnswers(new Array(questions.length).fill(false));
    setShowResults(false);
    setEndTime(null);
  };

  const score = selectedAnswers.filter(
    (answer, index) => answer === questions[index].correctAnswer
  ).length;

  const timeTaken = endTime ? Math.max(1, Math.round((endTime - startTime) / 1000)) : 0;
  const question = questions[currentQuestion];
  const selectedForCurrent = selectedAnswers[currentQuestion];
  const isConfirmedForCurrent = confirmedAnswers[currentQuestion];
  const isCurrentCorrect = selectedForCurrent === question.correctAnswer;

  const getCategoryScore = (cat: 'FOUNDATIONS' | 'RECALL' | 'BDH' | 'BDHCQ') => {
    const catQuestions = questions.map((q, idx) => ({ ...q, idx })).filter(q => q.category === cat);
    const correctCount = catQuestions.filter(q => selectedAnswers[q.idx] === q.correctAnswer).length;
    return Math.round((correctCount / catQuestions.length) * 100);
  };

  if (showResults) {
    return (
      <div className="research-module">
        <section className="research-panel">
          <div className="panel-heading-row">
            <div>
              <span className="panel-kicker-green">KNOWLEDGE CHECK COMPLETE</span>
              <h2>Learning Progress Summary</h2>
            </div>
            <span className="action-index">10/10</span>
          </div>
          <p className="panel-intro">
            Completed {questions.length} questions in {timeTaken} seconds.
          </p>

          <div style={{ margin: '20px 0', padding: '20px', border: '1px solid var(--line)', background: 'rgba(9, 14, 17, 0.7)', textAlign: 'center' }}>
            <span className="eyebrow" style={{ display: 'block', marginBottom: '6px' }}>OVERALL ACCURACY</span>
            <div style={{ fontSize: '36px', font: '36px var(--mono)', fontWeight: 700, color: 'var(--cyan)' }}>
              {score} <span style={{ fontSize: '18px', color: 'var(--faint)' }}>/ {questions.length}</span>
            </div>
          </div>

          <div style={{ marginTop: '20px' }}>
            <span className="panel-kicker" style={{ marginBottom: '10px' }}>CONCEPT MASTERY BREAKDOWN</span>
            {(['FOUNDATIONS', 'RECALL', 'BDH', 'BDHCQ'] as const).map(cat => {
              const catScore = getCategoryScore(cat);
              const labelMap = {
                FOUNDATIONS: 'FOUNDATIONS (Plasticity & Hebbian)',
                RECALL: 'RECALL & COMPETING PATHS',
                BDH: 'BDH CONNECTION',
                BDHCQ: 'BDH-CQ LATENT REASONING',
              };
              return (
                <div key={cat} style={{ marginBottom: '12px', font: '12px var(--mono)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--muted)', marginBottom: '4px' }}>
                    <span>{labelMap[cat]}</span>
                    <span style={{ color: 'var(--cyan)', fontWeight: 600 }}>{catScore}%</span>
                  </div>
                  <div style={{ width: '100%', height: '4px', background: '#080b0e', border: '1px solid var(--line)' }}>
                    <div style={{ width: `${catScore}%`, height: '100%', background: 'var(--cyan)', transition: 'width 0.5s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="equation-block" style={{ marginTop: '20px' }}>
            <span className="equation-label">KEY TAKEAWAY</span>
            Different mechanisms can implement memory-like computation. The toy experiment demonstrates changing connection strength;
            BDH explores a different architecture centered on recurrent internal state.
          </div>

          <div style={{ marginTop: '24px' }}>
            <span className="panel-kicker" style={{ marginBottom: '12px' }}>DETAILED QUESTION REVIEW</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
              {questions.map((q, idx) => {
                const userAns = selectedAnswers[idx];
                const isCorrect = userAns === q.correctAnswer;
                return (
                  <div key={q.id} style={{ padding: '14px', border: '1px solid var(--line)', background: 'rgba(9, 14, 17, 0.7)', font: '12px var(--mono)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                      <strong style={{ color: 'var(--ink)' }}>
                        {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}. {q.question}
                      </strong>
                      <span style={{ color: isCorrect ? 'var(--green)' : 'var(--amber)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                        {isCorrect ? '✓ CORRECT' : '✗ REVIEW'}
                      </span>
                    </div>
                    <div style={{ color: 'var(--muted)', fontSize: '11px', lineHeight: '1.6' }}>
                      <div>
                        <span style={{ color: 'var(--faint)' }}>Your answer:</span> {userAns !== null ? q.options[userAns] : 'Not answered'}
                      </div>
                      {!isCorrect && (
                        <div style={{ color: 'var(--green)' }}>
                          <span style={{ color: 'var(--faint)' }}>Correct answer:</span> {q.options[q.correctAnswer]}
                        </div>
                      )}
                      <div style={{ color: 'var(--muted)', fontStyle: 'italic', marginTop: '4px' }}>
                        {q.explanation}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={resetTest}
            className="outline-button"
            style={{ marginTop: '24px', width: '100%', padding: '14px' }}
          >
            RETAKE TEST ↺
          </button>
        </section>
      </div>
    );
  }

  return (
    <div className="research-module">
      <section className="research-panel">
        <div className="panel-heading-row">
          <div>
            <span className="panel-kicker">KNOWLEDGE CHECK / QUESTION {currentQuestion + 1 < 10 ? `0${currentQuestion + 1}` : currentQuestion + 1} OF {questions.length}</span>
            <h2>{question.question}</h2>
          </div>
          <span className="action-index">{currentQuestion + 1 < 10 ? `0${currentQuestion + 1}` : currentQuestion + 1}</span>
        </div>

        <div className="quiz-progress">
          <div style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }} />
        </div>

        <p className="panel-intro">
          Category: <span className="panel-kicker" style={{ display: 'inline', color: 'var(--cyan)' }}>{question.categoryLabel}</span>
        </p>

        <div style={{ marginTop: '20px' }}>
          {question.options.map((option, index) => {
            const isSelected = selectedForCurrent === index;
            const isAnswerCorrect = index === question.correctAnswer;

            let borderColor = 'var(--line)';
            let color = 'var(--muted)';
            let background = 'rgba(16, 22, 26, 0.82)';

            if (isSelected) {
              borderColor = 'var(--cyan)';
              color = 'var(--ink)';
              background = 'rgba(102, 217, 255, 0.08)';
            }
            if (isConfirmedForCurrent) {
              if (isAnswerCorrect) {
                borderColor = 'var(--green)';
                color = 'var(--green)';
                background = 'rgba(125, 215, 170, 0.08)';
              } else if (isSelected && !isAnswerCorrect) {
                borderColor = 'var(--amber)';
                color = 'var(--amber)';
                background = 'rgba(228, 172, 105, 0.08)';
              }
            }

            return (
              <button
                key={index}
                onClick={() => handleSelectOption(index)}
                disabled={isConfirmedForCurrent}
                className="quiz-option"
                style={{ borderColor, color, background }}
              >
                <strong style={{ fontFamily: 'var(--mono)', marginRight: '10px' }}>
                  {String.fromCharCode(65 + index)}.
                </strong>
                {option}
              </button>
            );
          })}
        </div>

        {!isConfirmedForCurrent ? (
          <button
            onClick={handleConfirmAnswer}
            disabled={selectedForCurrent === null}
            className="outline-button"
            style={{ marginTop: '16px', width: '100%', opacity: selectedForCurrent === null ? 0.5 : 1 }}
          >
            CONFIRM ANSWER
          </button>
        ) : (
          <div style={{ marginTop: '18px' }}>
            <div className="equation-block" style={{ borderColor: isCurrentCorrect ? 'var(--green)' : 'var(--amber)' }}>
              <span className="equation-label" style={{ color: isCurrentCorrect ? 'var(--green)' : 'var(--amber)' }}>
                {isCurrentCorrect ? '✓ CORRECT' : '⚠ REVIEW THIS CONCEPT'}
              </span>
              {question.explanation}
            </div>
            <button
              onClick={handleNextQuestion}
              className="outline-button"
              style={{ marginTop: '12px', width: '100%', borderColor: 'var(--cyan)', color: 'var(--cyan)' }}
            >
              {currentQuestion < questions.length - 1 ? 'NEXT QUESTION →' : 'VIEW RESULTS →'}
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
