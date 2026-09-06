import React, { useRef, useState } from 'react';
import { NeuralNetwork } from './lib/NeuralNetwork';
import { NeuralGrid } from './components/NeuralGrid';
import { TeachInterface } from './components/TeachInterface';
import { RecallInterface } from './components/RecallInterface';
import { ControlPanel } from './components/ControlPanel';
import { StateDebugPanel } from './components/StateDebugPanel';
import { BDHModule } from './components/BDHModule';
import { SixtySecondTest } from './components/SixtySecondTest';
import { GuidedTour } from './components/GuidedTour';
import { ExperimentStageRail, type ExperimentStage } from './components/ExperimentStageRail';
import { ConnectionInspector, type ConnectionFeedback } from './components/ConnectionInspector';
import { CompetingMemoryPanel } from './components/CompetingMemoryPanel';
import { TeachingHistory } from './components/TeachingHistory';
import type { Association, Connection, Node } from './types';

const VOCABULARY = ['DOG', 'ANIMAL', 'PET', 'CAT', 'BIRD', 'FISH'];

const STAGES: ExperimentStage[] = [
  { id: 1, label: 'First connection', detail: 'DOG → ANIMAL' },
  { id: 2, label: 'Strengthen it', detail: 'Repeat the pulse' },
  { id: 3, label: 'Recall', detail: 'Choose a route' },
  { id: 4, label: 'The fork', detail: 'DOG → PET' },
  { id: 5, label: 'Competing paths', detail: 'Compare the margin' },
];

type Tab = 'simulation' | 'bdh' | 'test';
type SelectionFocus = 'input' | 'output';

interface RecallSnapshot {
  input: string;
  predicted: string;
  connectionStrength: number;
  allScores: Map<string, number>;
}

function App() {
  const [network] = useState(() => new NeuralNetwork(VOCABULARY, 0.1));
  const [, setUpdateTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState<Tab>('simulation');
  const [activeStage, setActiveStage] = useState(1);
  const [completedStages, setCompletedStages] = useState<number[]>([]);
  const [selectedInput, setSelectedInput] = useState('DOG');
  const [selectedOutput, setSelectedOutput] = useState('ANIMAL');
  const [selectionFocus, setSelectionFocus] = useState<SelectionFocus>('input');
  const [repetitions, setRepetitions] = useState(3);
  const [recallInput, setRecallInput] = useState('DOG');
  const [highlightedConnection, setHighlightedConnection] = useState<{ from: string; to: string } | null>(null);
  const [teachingPhase, setTeachingPhase] = useState<'idle' | 'firing' | 'done'>('idle');
  const [feedback, setFeedback] = useState<ConnectionFeedback | null>(null);
  const [recallSnapshot, setRecallSnapshot] = useState<RecallSnapshot | null>(null);
  const [history, setHistory] = useState<ConnectionFeedback[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const simulationRef = useRef<HTMLElement>(null);

  const forceUpdate = () => setUpdateTrigger((previous) => previous + 1);

  const playTone = (frequency: number, duration = 0.12, type: OscillatorType = 'sine') => {
    if (!soundEnabled || typeof window === 'undefined') return;
    const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const context = new AudioContextClass();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.06, context.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + duration + 0.02);
    window.setTimeout(() => void context.close(), 300);
  };

  const nodes: Node[] = (() => {
    const centerX = 300;
    const centerY = 200;
    const radius = 130;
    const activations = network.getActivations();
    return VOCABULARY.map((word, index) => {
      const angle = (index / VOCABULARY.length) * 2 * Math.PI - Math.PI / 2;
      return { id: word, label: word, x: centerX + radius * Math.cos(angle), y: centerY + radius * Math.sin(angle), activation: activations[index] };
    });
  })();

  const connections: Connection[] = (() => {
    const weights = network.getWeights();
    const result: Connection[] = [];
    for (let i = 0; i < VOCABULARY.length; i += 1) {
      for (let j = 0; j < VOCABULARY.length; j += 1) {
        if (i !== j && weights[i][j] > 0.01) result.push({ from: VOCABULARY[i], to: VOCABULARY[j], weight: weights[i][j] });
      }
    }
    return result;
  })();

  const currentWeight = network.getWeight(selectedInput, selectedOutput);
  const learningRate = network.getLearningRate();
  const saturation = currentWeight >= 0.999;

  const completed = (stage: number) => {
    setCompletedStages((previous) => previous.includes(stage) ? previous : [...previous, stage].sort((a, b) => a - b));
  };

  const selectStage = (stage: number) => {
    setActiveStage(stage);
    if (stage === 1 || stage === 2 || stage === 4) {
      setSelectedInput('DOG');
      setSelectedOutput(stage === 4 ? 'PET' : 'ANIMAL');
      setSelectionFocus('input');
    }
    if (stage === 3 || stage === 5) setRecallInput('DOG');
    simulationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleNodeSelect = (word: string) => {
    if (selectionFocus === 'input') {
      setSelectedInput(word);
      if (word === selectedOutput) setSelectedOutput(VOCABULARY.find((candidate) => candidate !== word) ?? 'ANIMAL');
      setSelectionFocus('output');
    } else {
      if (word !== selectedInput) setSelectedOutput(word);
      setSelectionFocus('input');
    }
    playTone(230, 0.08);
  };

  const handleTeach = (association: Association, count: number) => {
    if (teachingPhase !== 'idle') return;
    setSelectedInput(association.input);
    setSelectedOutput(association.output);
    setTeachingPhase('firing');
    setHighlightedConnection({ from: association.input, to: association.output });
    playTone(260, 0.16, 'triangle');

    window.setTimeout(() => {
      const result = network.teach(association.input, association.output, count);
      const nextFeedback: ConnectionFeedback = {
        input: association.input,
        output: association.output,
        previousWeight: result.previousWeight,
        newWeight: result.newWeight,
        deltaWeight: result.deltaWeight,
        repetitions: count,
      };
      setFeedback(nextFeedback);
      setHistory((previous) => [nextFeedback, ...previous].slice(0, 8));
      setTeachingPhase('done');
      forceUpdate();
      playTone(520, 0.22);

      if (association.input === 'DOG' && association.output === 'ANIMAL') {
        completed(1);
        completed(2);
        setActiveStage(2);
      }
      if (association.input === 'DOG' && association.output === 'PET') {
        completed(4);
        setActiveStage(5);
      }

      window.setTimeout(() => {
        setHighlightedConnection(null);
        setTeachingPhase('idle');
      }, 1800);
    }, 80);
  };

  const handleRecall = (inputWord: string) => {
    const result = network.recall(inputWord);
    setRecallSnapshot({ input: inputWord, predicted: result.word, connectionStrength: result.confidence, allScores: result.allScores });
    setHighlightedConnection(result.word ? { from: inputWord, to: result.word } : null);
    playTone(380, 0.2);

    if (inputWord === 'DOG') {
      completed(3);
      const hasCompetingPath = history.some((entry) => entry.input === 'DOG' && entry.output === 'PET');
      if (hasCompetingPath) completed(5);
      setActiveStage(hasCompetingPath ? 5 : 4);
    }
    window.setTimeout(() => setHighlightedConnection(null), 2000);
  };

  const handleReset = () => {
    network.reset();
    setActiveStage(1);
    setCompletedStages([]);
    setSelectedInput('DOG');
    setSelectedOutput('ANIMAL');
    setRecallInput('DOG');
    setSelectionFocus('input');
    setFeedback(null);
    setRecallSnapshot(null);
    setHistory([]);
    setHighlightedConnection(null);
    setTeachingPhase('idle');
    forceUpdate();
    playTone(180, 0.12);
  };

  const firstWeight = network.getWeight('DOG', 'ANIMAL');
  const secondWeight = network.getWeight('DOG', 'PET');
  const margin = recallSnapshot ? Math.abs(firstWeight - secondWeight) : null;
  const navItems: Array<{ id: Tab; label: string; note: string }> = [
    { id: 'simulation', label: 'The ride', note: 'live experiment' },
    { id: 'bdh', label: 'Toy model → BDH', note: 'research context' },
    { id: 'test', label: 'Can you predict?', note: 'knowledge check' },
  ];

  return (
    <div className="app-shell">
      <header className="site-header">
        <button className="brand-lockup" onClick={() => { setActiveTab('simulation'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} aria-label="Return to synaptiCITY home">
          <span className="brand-mark"><span /><span /><span /></span>
          <span>
            <strong>synaptiCITY</strong>
            <small>when connections become memory</small>
          </span>
        </button>
        <div className="header-tools">
          <span className="model-status"><i /> MODEL ONLINE</span>
          <button className={`sound-toggle ${soundEnabled ? 'is-on' : ''}`} onClick={() => setSoundEnabled((value) => !value)} aria-pressed={soundEnabled}>
            {soundEnabled ? 'SOUND ON' : 'SOUND OFF'}
          </button>
          <span className="eta-readout mono">η {learningRate.toFixed(2)}</span>
        </div>
      </header>

      <nav className="primary-nav" aria-label="Primary">
        {navItems.map((item) => (
          <button key={item.id} className={`nav-tab ${activeTab === item.id ? 'is-active' : ''}`} onClick={() => setActiveTab(item.id)}>
            <span>{item.label}</span><small>{item.note}</small>
          </button>
        ))}
      </nav>

      <main className="app-main">
        {activeTab === 'simulation' && (
          <div className="simulation-world">
            <section className="hero-intro hero-landing">
              <div className="hero-copy">
                <span className="eyebrow">AN INTERACTIVE NEURAL LEARNING EXPERIENCE</span>
                <h2>Learning isn't a<br /><em>button press.</em></h2>
                <p className="hero-lede">Ride through a tiny learning network and watch connections strengthen with experience.</p>
                <div className="hero-actions">
                  <button className="hero-cta" onClick={() => simulationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>START THE RIDE <span>↗</span></button>
                  <button className="hero-link" onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>HOW IT WORKS <span>↓</span></button>
                </div>
              </div>
              <div className="hero-visual" aria-label="Animated neural network preview">
                <div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" />
                <div className="hero-track track-a" /><div className="hero-track track-b" /><div className="hero-track track-c" />
                {['DOG', 'ANIMAL', 'PET', 'CAT', 'BIRD', 'FISH'].map((word, index) => (
                  <span key={word} className={`hero-node hero-node-${index}`}><b>{word.slice(0, 1)}</b><small>{word}</small></span>
                ))}
                <span className="hero-pulse pulse-a" /><span className="hero-pulse pulse-b" />
                <div className="hero-visual-label"><i /> LIVE MODEL / 06 NODES</div>
              </div>
            </section>

            <section className="welcome-panel" id="how-it-works">
              <div>
                <span className="eyebrow">WELCOME ABOARD / 00</span>
                <h3>Every idea begins as a connection.</h3>
                <p>Every repetition can strengthen that connection. Your job: teach the network, ride the signal, and discover what it remembers.</p>
              </div>
              <div className="metaphor-map">
                <span><b>WORD</b><i>NODE</i></span><em>→</em>
                <span><b>CONNECTION</b><i>SYNAPSE</i></span><em>→</em>
                <span><b>REPETITION</b><i>STRENGTH</i></span><em>→</em>
                <span><b>RECALL</b><i>PATH SELECTION</i></span>
              </div>
            </section>

            <ExperimentStageRail stages={STAGES} activeStage={activeStage} completedStages={completedStages} onSelect={selectStage} />
            <GuidedTour step={activeStage} completedStages={completedStages} onNext={() => setActiveStage(activeStage >= 5 ? 1 : activeStage + 1)} onSkip={() => setActiveStage(1)} />

            <section className="lab-layout ride-layout" ref={simulationRef}>
              <div className="graph-column">
                <div className="section-label"><span>STATION 01 — NEURAL RIDE</span><span className="mono">{connections.length.toString().padStart(2, '0')} visible paths</span></div>
                <div className="graph-frame ride-stage">
                  <div className="stage-overlay"><span className="stage-chip">LIVE COMPUTATION</span><span className="mono">TRACK STATE / {teachingPhase === 'idle' ? 'RESTING' : 'FIRING'}</span></div>
                  <NeuralGrid nodes={nodes} connections={connections} highlightedConnection={highlightedConnection} selectedNodes={{ input: selectedInput, output: selectedOutput }} selectionFocus={selectionFocus} onNodeSelect={handleNodeSelect} />
                  {teachingPhase !== 'idle' && <div className="computation-state"><span className="status-dot" />{teachingPhase === 'firing' ? 'CO-ACTIVATING NODES' : 'UPDATING SYNAPSE'}</div>}
                </div>
                <div className="graph-caption"><span>Click a node to choose {selectionFocus === 'input' ? 'the source' : 'the target'}.</span><span className="mono">weight → track width + glow</span></div>
              </div>

              <div className="control-column">
                <TeachInterface vocabulary={VOCABULARY} input={selectedInput} output={selectedOutput} selectionFocus={selectionFocus} repetitions={repetitions} currentWeight={currentWeight} learningRate={learningRate} onInputChange={(value) => { setSelectedInput(value); setSelectionFocus('output'); }} onOutputChange={(value) => { setSelectedOutput(value); setSelectionFocus('input'); }} onFocusSelection={setSelectionFocus} onRepetitionsChange={setRepetitions} onTeach={handleTeach} disabled={teachingPhase !== 'idle'} />
                <ConnectionInspector feedback={feedback} learningRate={learningRate} selectedInput={selectedInput} selectedOutput={selectedOutput} currentWeight={currentWeight} saturation={saturation} />
                <ControlPanel learningRate={learningRate} onLearningRateChange={(rate) => { network.setLearningRate(rate); forceUpdate(); }} onReset={handleReset} disabled={teachingPhase !== 'idle'} />
              </div>
            </section>

            <section className="science-callout">
              <span className="equation-mark">Δw</span>
              <div><span className="eyebrow">WHY DID THE CONNECTION CHANGE?</span><h3>When two units fire together, this toy model wires them together.</h3><p>The actual Hebbian rule is <strong className="mono">Δw = η × aᵢ × aⱼ</strong>. Watch the before, after, and delta after every teaching event.</p></div>
              <span className="rule-note mono">REAL WEIGHTS<br />NO FAKE METRICS</span>
            </section>

            <section className="recall-layout">
              <RecallInterface vocabulary={VOCABULARY} input={recallInput} result={recallSnapshot} onInputChange={setRecallInput} onRecall={handleRecall} disabled={teachingPhase !== 'idle'} />
              <CompetingMemoryPanel input="DOG" firstOutput="ANIMAL" secondOutput="PET" firstWeight={firstWeight} secondWeight={secondWeight} predicted={recallSnapshot?.predicted ?? null} margin={margin} hasRecall={Boolean(recallSnapshot)} />
            </section>

            <section className="honesty-panel">
              <div><span className="eyebrow">SCIENTIFIC HONESTY</span><h3>What this simulation is — and isn't.</h3></div>
              <div className="honesty-columns"><p><b>THIS IS</b>A small educational neural-network model; a live demonstration of weighted associations and Hebbian-style learning.</p><p><b>THIS IS NOT</b>A biological brain simulation, a literal model of human memory, or an implementation of BDH.</p><p><b>IMPORTANT LIMIT</b>Associations can coexist. Teaching PET does not biologically erase or weaken ANIMAL in this toy model.</p></div>
            </section>

            <section className="lower-lab-grid">
              <TeachingHistory entries={history} />
              <StateDebugPanel weights={network.getWeights()} vocabulary={VOCABULARY} activations={network.getActivations()} />
            </section>
          </div>
        )}

        {activeTab === 'bdh' && <div className="standalone-module"><div className="module-heading"><span className="eyebrow">RESEARCH CONTEXT / 02</span><h2>From toy memory<br /><em>to BDH.</em></h2><p>Zoom out from the live experiment. Explore the conceptual bridge without confusing this toy model for the research concept.</p></div><BDHModule /></div>}
        {activeTab === 'test' && <div className="standalone-module"><div className="module-heading"><span className="eyebrow">KNOWLEDGE CHECK / 03</span><h2>Can you read<br /><em>the synapse?</em></h2><p>Use what you observed in the laboratory, not a memorized definition.</p></div><SixtySecondTest /></div>}
      </main>

      <footer className="site-footer"><span>synaptiCITY / educational neural model</span><span className="mono">the animation visualizes the computation</span></footer>
    </div>
  );
}

export default App;