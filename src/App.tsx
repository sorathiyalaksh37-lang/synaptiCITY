import React, { useRef, useState, useEffect } from 'react';
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
import { ThemeSwitcher } from './components/ThemeSwitcher';
import { WeightHeatmap } from './components/WeightHeatmap';
import { TutorialOverlay } from './components/TutorialOverlay';
import { KeyboardShortcutsPanel } from './components/KeyboardShortcutsPanel';
import { ExportImportPanel } from './components/ExportImportPanel';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { playWhooshSound } from './utils/transitionSound';
import { saveNetworkState, loadNetworkState, hasStoredState, type NetworkState } from './utils/storage';
import { Logo } from './components/Logo';
import { SharePanel } from './components/SharePanel';
import { CommunityLibrary } from './components/CommunityLibrary';
import { SubmitNetwork, type NetworkSubmission } from './components/SubmitNetwork';
import { VocabularyBuilder } from './components/VocabularyBuilder';
import { LearningRuleSelector } from './components/LearningRuleSelector';
import { AchievementPanel } from './components/AchievementPanel';
import { AdminDashboard } from './components/AdminDashboard';
import { UserProfile } from './components/UserProfile';
import type { Association, Connection, Node } from './types';

const VOCABULARY = ['DOG', 'ANIMAL', 'PET', 'CAT', 'BIRD', 'FISH'];

const STAGES: ExperimentStage[] = [
  { id: 1, label: 'First connection', detail: 'DOG → ANIMAL' },
  { id: 2, label: 'Strengthen it', detail: 'Repeat the pulse' },
  { id: 3, label: 'Recall', detail: 'Choose a route' },
  { id: 4, label: 'The fork', detail: 'DOG → PET' },
  { id: 5, label: 'Competing paths', detail: 'Compare the margin' },
];

type Tab = 'simulation' | 'bdh' | 'test' | 'community' | 'advanced' | 'account';
type SelectionFocus = 'input' | 'output';
type ViewMode = 'graph' | 'heatmap';
type CommunityTab = 'browse' | 'share' | 'submit';
type AccountTab = 'profile' | 'admin';

interface RecallSnapshot {
  input: string;
  predicted: string;
  connectionStrength: number;
  allScores: Map<string, number>;
}

function App() {
  const [network] = useState(() => new NeuralNetwork(VOCABULARY, 0.1));
  const [, setUpdateTrigger] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('graph');
  const [showTutorial, setShowTutorial] = useState(false);
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
  const [communityTab, setCommunityTab] = useState<CommunityTab>('browse');
  const [accountTab, setAccountTab] = useState<AccountTab>('profile');
  const [selectedRule, setSelectedRule] = useState<'hebbian' | 'stdp' | 'bcm' | 'oja'>('hebbian');
  const [forgettingEnabled, setForgettingEnabled] = useState(false);
  const [forgettingRate, setForgettingRate] = useState(0.02);
  const stageGuideRef = useRef<HTMLDivElement>(null);
  const simulationRef = useRef<HTMLElement>(null);
  const recallRef = useRef<HTMLElement>(null);
  const completionRef = useRef<HTMLElement>(null);

  const forceUpdate = () => setUpdateTrigger((previous) => previous + 1);

  // Load saved state on mount
  useEffect(() => {
    if (hasStoredState()) {
      const savedState = loadNetworkState();
      if (savedState) {
        // Restore network weights
        const weights = savedState.weights;
        weights.forEach((row, i) => {
          row.forEach((weight, j) => {
            if (i !== j && weight > 0) {
              network.teach(VOCABULARY[i], VOCABULARY[j], 1);
            }
          });
        });
        network.setLearningRate(savedState.learningRate);
        
        // Restore history
        setHistory(savedState.history);
        forceUpdate();
      }
    }
  }, []);

  // Save state whenever network changes
  useEffect(() => {
    const state = {
      weights: network.getWeights(),
      vocabulary: VOCABULARY,
      learningRate: network.getLearningRate(),
      history,
      timestamp: Date.now(),
    };
    saveNetworkState(state);
  }, [history, network]);

  const handleTutorialComplete = () => {
    setShowTutorial(false);
  };

  const handleImportState = (state: NetworkState) => {
    // Reset network
    network.reset();
    
    // Restore weights
    state.weights.forEach((row, i) => {
      row.forEach((weight, j) => {
        if (i !== j && weight > 0.01) {
          const repetitions = Math.ceil(weight / state.learningRate);
          network.teach(state.vocabulary[i], state.vocabulary[j], repetitions);
        }
      });
    });
    
    network.setLearningRate(state.learningRate);
    setHistory(state.history);
    forceUpdate();
  };

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 't',
      description: 'Teach association',
      action: () => {
        if (teachingPhase === 'idle' && activeTab === 'simulation') {
          handleTeach({ input: selectedInput, output: selectedOutput }, repetitions);
        }
      },
    },
    {
      key: 'r',
      description: 'Test recall',
      action: () => {
        if (teachingPhase === 'idle' && activeTab === 'simulation') {
          handleRecall(recallInput);
        }
      },
    },
    {
      key: 'r',
      shift: true,
      description: 'Reset network',
      action: () => {
        if (teachingPhase === 'idle') {
          handleReset();
        }
      },
    },
    {
      key: 'd',
      description: 'Toggle theme',
      action: () => {
        const theme = document.documentElement.getAttribute('data-theme');
        document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'light' : 'dark');
      },
    },
    {
      key: 'g',
      description: 'Graph view',
      action: () => setViewMode('graph'),
    },
    {
      key: 'h',
      description: 'Heatmap view',
      action: () => setViewMode('heatmap'),
    },
    {
      key: ']',
      ctrl: true,
      description: 'Next tab',
      action: () => {
        const tabs: Tab[] = ['simulation', 'bdh', 'test'];
        const currentIndex = tabs.indexOf(activeTab);
        setActiveTab(tabs[(currentIndex + 1) % tabs.length]);
      },
    },
    {
      key: '[',
      ctrl: true,
      description: 'Previous tab',
      action: () => {
        const tabs: Tab[] = ['simulation', 'bdh', 'test'];
        const currentIndex = tabs.indexOf(activeTab);
        setActiveTab(tabs[(currentIndex - 1 + tabs.length) % tabs.length]);
      },
    },
  ]);

  const scrollToTarget = (element: HTMLElement | null) => {
    if (!element) return;
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    element.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  const handleStartRide = () => {
    selectStage(1);
    scrollToTarget(stageGuideRef.current);
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
    const highestCompletedStage = completedStages.length > 0 ? Math.max(...completedStages) : 0;
    if (stage > highestCompletedStage + 1) return; // reject illegal jump
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
  };

  const handleTeach = (association: Association, count: number) => {
    if (teachingPhase !== 'idle') return;
    setSelectedInput(association.input);
    setSelectedOutput(association.output);
    setTeachingPhase('firing');
    setHighlightedConnection({ from: association.input, to: association.output });

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

      if (association.input === 'DOG' && association.output === 'ANIMAL') {
        const priorAnimalTeaches = history.filter(
          (entry) => entry.input === 'DOG' && entry.output === 'ANIMAL'
        ).length;
        if (priorAnimalTeaches === 0) {
          completed(1);
          setActiveStage(2);
          scrollToTarget(simulationRef.current);
        } else if (priorAnimalTeaches >= 1) {
          completed(2);
          setActiveStage(3);
          scrollToTarget(recallRef.current);
        }
      }
      if (association.input === 'DOG' && association.output === 'PET' && completedStages.includes(3)) {
        completed(4);
        setActiveStage(5);
        scrollToTarget(recallRef.current);
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

    if (inputWord === 'DOG') {
      const hasCompetingPath = history.some((entry) => entry.input === 'DOG' && entry.output === 'PET');
      const stage4Done = hasCompetingPath;

      if (!completedStages.includes(3)) {
        completed(3);
        setActiveStage(4);
        setSelectedInput('DOG');
        setSelectedOutput('PET');
        setSelectionFocus('input');
        scrollToTarget(simulationRef.current);
      } else if (stage4Done && !completedStages.includes(5)) {
        completed(5);
        setActiveStage(5);
        scrollToTarget(completionRef.current);
      }
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
  };

  const firstWeight = network.getWeight('DOG', 'ANIMAL');
  const secondWeight = network.getWeight('DOG', 'PET');
  const margin = recallSnapshot ? Math.abs(firstWeight - secondWeight) : null;

  // Community handlers
  const handleLoadCommunityNetwork = (snapshot: any) => {
    // Reset and load the community network
    network.reset();
    
    // Restore weights
    snapshot.weights.forEach((row: number[], i: number) => {
      row.forEach((weight: number, j: number) => {
        if (i !== j && weight > 0.01) {
          const repetitions = Math.ceil(weight / snapshot.learningRate);
          network.teach(snapshot.vocabulary[i], snapshot.vocabulary[j], repetitions);
        }
      });
    });
    
    network.setLearningRate(snapshot.learningRate);
    setSelectedRule(snapshot.rule);
    forceUpdate();
    
    // Show success notification
    alert(`✓ Loaded network: "${snapshot.name}" by ${snapshot.author}`);
  };

  const handleSubmitNetwork = (submission: NetworkSubmission) => {
    console.log('Network submitted to community:', submission);
    // In production, this would send to backend API
    // For now, just log it
  };

  const navItems: Array<{ id: Tab; label: string; note: string }> = [
    { id: 'simulation', label: 'The ride', note: 'live experiment' },
    { id: 'bdh', label: 'Toy model → BDH', note: 'research context' },
    { id: 'test', label: 'Can you predict?', note: 'knowledge check' },
    { id: 'community', label: 'Community', note: 'share & explore' },
    { id: 'advanced', label: 'Advanced', note: 'tools & features' },
    { id: 'account', label: 'Account', note: 'profile & settings' },
  ];

  return (
    <div className="app-shell">
      <TutorialOverlay onComplete={handleTutorialComplete} />
      <KeyboardShortcutsPanel />
      
      <header className="site-header">
        <button className="brand-lockup" onClick={() => { setActiveTab('simulation'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} aria-label="Return to synaptiCITY home">
          <Logo className="logo-icon" />
          <span>
            <strong>synaptiCITY</strong>
            <small>when connections become memory</small>
          </span>
        </button>
        <div className="header-tools">
          <ThemeSwitcher />
          <button
            className="keyboard-help-btn"
            onClick={() => {}}
            title="Keyboard shortcuts (press ?)"
            aria-label="Show keyboard shortcuts"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect x="2" y="4" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M5 7H5.5M7.5 7H8M10 7H10.5M12.5 7H13M5 10H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          <span className="model-status"><i /> MODEL ONLINE</span>
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
                  <button className="hero-cta" onClick={handleStartRide}>START THE RIDE <span>↗</span></button>
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
              <div className="metaphor-map w-full">
                <span><b>WORD</b><i>NODE</i></span><em>→</em>
                <span><b>CONNECTION</b><i>SYNAPSE</i></span><em>→</em>
                <span><b>REPETITION</b><i>STRENGTH</i></span><em>→</em>
                <span><b>RECALL</b><i>PATH SELECTION</i></span>
              </div>
            </section>

            <div ref={stageGuideRef} style={{ scrollMarginTop: '80px' }}>
              <ExperimentStageRail stages={STAGES} activeStage={activeStage} completedStages={completedStages} onSelect={selectStage} />
              <GuidedTour step={activeStage} completedStages={completedStages} onNext={() => setActiveStage(activeStage >= 5 ? 1 : activeStage + 1)} onSkip={() => setActiveStage(1)} />
            </div>

            <section className="lab-layout ride-layout" ref={simulationRef} style={{ scrollMarginTop: '80px' }}>
              <div className="graph-column">
                <div className="section-label">
                  <span>STATION 01 — NEURAL RIDE</span>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <button
                      className={`view-toggle ${viewMode === 'graph' ? 'is-active' : ''}`}
                      onClick={() => setViewMode('graph')}
                      title="Graph view"
                    >
                      GRAPH
                    </button>
                    <button
                      className={`view-toggle ${viewMode === 'heatmap' ? 'is-active' : ''}`}
                      onClick={() => setViewMode('heatmap')}
                      title="Heatmap view"
                    >
                      HEATMAP
                    </button>
                    <span className="mono">{connections.length.toString().padStart(2, '0')} visible paths</span>
                  </div>
                </div>
                
                {viewMode === 'graph' ? (
                  <>
                    <div className="graph-frame ride-stage">
                      <div className="stage-overlay"><span className="stage-chip">LIVE COMPUTATION</span><span className="mono">TRACK STATE / {teachingPhase === 'idle' ? 'RESTING' : 'FIRING'}</span></div>
                      <NeuralGrid nodes={nodes} connections={connections} highlightedConnection={highlightedConnection} selectedNodes={{ input: selectedInput, output: selectedOutput }} selectionFocus={selectionFocus} onNodeSelect={handleNodeSelect} />
                      {teachingPhase !== 'idle' && <div className="computation-state"><span className="status-dot" />{teachingPhase === 'firing' ? 'CO-ACTIVATING NODES' : 'UPDATING SYNAPSE'}</div>}
                    </div>
                    <div className="graph-caption"><span>Click a node to choose {selectionFocus === 'input' ? 'the source' : 'the target'}.</span><span className="mono">weight → track width + glow</span></div>
                  </>
                ) : (
                  <WeightHeatmap weights={network.getWeights()} vocabulary={VOCABULARY} />
                )}
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

            <section className="recall-layout" ref={recallRef} style={{ scrollMarginTop: '80px' }}>
              <RecallInterface vocabulary={VOCABULARY} input={recallInput} result={recallSnapshot} onInputChange={setRecallInput} onRecall={handleRecall} disabled={teachingPhase !== 'idle'} />
              <CompetingMemoryPanel input="DOG" firstOutput="ANIMAL" secondOutput="PET" firstWeight={firstWeight} secondWeight={secondWeight} predicted={recallSnapshot?.predicted ?? null} margin={margin} hasRecall={Boolean(recallSnapshot)} />
            </section>

            <section className="honesty-panel" ref={completionRef} style={{ scrollMarginTop: '80px' }}>
              <div><span className="eyebrow">SCIENTIFIC HONESTY</span><h3>What this simulation is — and isn't.</h3></div>
              <div className="honesty-columns"><p><b>THIS IS</b>A small educational neural-network model; a live demonstration of weighted associations and Hebbian-style learning.</p><p><b>THIS IS NOT</b>A biological brain simulation, a literal model of human memory, or an implementation of BDH.</p><p><b>REAL DECAY</b>Inactive connection weights decay slightly (2% per pulse) on each teaching event, demonstrating short-term synaptic memory fading.</p></div>
            </section>

            <section className="lower-lab-grid">
              <TeachingHistory entries={history} />
              <StateDebugPanel weights={network.getWeights()} vocabulary={VOCABULARY} activations={network.getActivations()} />
              <ExportImportPanel
                currentState={{
                  weights: network.getWeights(),
                  vocabulary: VOCABULARY,
                  learningRate: network.getLearningRate(),
                  history,
                  timestamp: Date.now(),
                }}
                onImport={handleImportState}
              />
            </section>
          </div>
        )}

        {activeTab === 'bdh' && <div className="standalone-module"><div className="module-heading"><span className="eyebrow">RESEARCH CONTEXT / 02</span><h2>From toy memory<br /><em>to BDH.</em></h2><p>Zoom out from the live experiment. Explore the conceptual bridge without confusing this toy model for the research concept.</p></div><BDHModule /></div>}
        {activeTab === 'test' && <div className="standalone-module"><div className="module-heading"><span className="eyebrow">KNOWLEDGE CHECK / 03</span><h2>Can you read<br /><em>the synapse?</em></h2><p>Use what you observed in the laboratory, not a memorized definition.</p></div><SixtySecondTest /></div>}
        
        {activeTab === 'community' && (
          <div className="standalone-module community-module">
            <div className="module-heading">
              <span className="eyebrow">COMMUNITY HUB / 04</span>
              <h2>Share & Discover<br /><em>Neural Networks</em></h2>
              <p>Connect with the synaptiCITY community. Share your networks, explore others, and learn together.</p>
            </div>
            
            <div className="community-tabs">
              <button
                className={`community-tab ${communityTab === 'browse' ? 'is-active' : ''}`}
                onClick={() => setCommunityTab('browse')}
              >
                🌐 Browse Library
              </button>
              <button
                className={`community-tab ${communityTab === 'share' ? 'is-active' : ''}`}
                onClick={() => setCommunityTab('share')}
              >
                📤 Share Network
              </button>
              <button
                className={`community-tab ${communityTab === 'submit' ? 'is-active' : ''}`}
                onClick={() => setCommunityTab('submit')}
              >
                ✨ Submit to Library
              </button>
            </div>

            <div className="community-content">
              {communityTab === 'browse' && (
                <CommunityLibrary onLoad={handleLoadCommunityNetwork} />
              )}
              
              {communityTab === 'share' && (
                <SharePanel
                  weights={network.getWeights()}
                  vocabulary={VOCABULARY}
                  learningRate={learningRate}
                  selectedRule={selectedRule}
                />
              )}
              
              {communityTab === 'submit' && (
                <SubmitNetwork
                  weights={network.getWeights()}
                  vocabulary={VOCABULARY}
                  learningRate={learningRate}
                  selectedRule={selectedRule}
                  onSubmit={handleSubmitNetwork}
                />
              )}
            </div>
          </div>
        )}

        {activeTab === 'advanced' && (
          <div className="standalone-module advanced-module">
            <div className="module-heading">
              <span className="eyebrow">ADVANCED TOOLS / 05</span>
              <h2>Customize & Optimize<br /><em>Your Experience</em></h2>
              <p>Access advanced features, learning rules, vocabulary customization, and achievements.</p>
            </div>
            
            <div className="advanced-grid">
              <VocabularyBuilder
                currentVocabulary={VOCABULARY}
                onVocabularyChange={(newVocab) => {
                  console.log('Vocabulary changed:', newVocab);
                  // Note: Would need to reinitialize network with new vocabulary
                }}
              />
              
              <LearningRuleSelector
                currentRule={selectedRule}
                onRuleChange={setSelectedRule}
                forgettingEnabled={forgettingEnabled}
                forgettingRate={forgettingRate}
                onForgettingToggle={() => setForgettingEnabled(!forgettingEnabled)}
                onForgettingRateChange={setForgettingRate}
              />
              
              <AchievementPanel
                achievements={[]}
                level={1}
                xp={0}
                xpForNextLevel={100}
                totalXP={0}
              />
            </div>
          </div>
        )}

        {activeTab === 'account' && (
          <div className="standalone-module account-module">
            <div className="module-heading">
              <span className="eyebrow">ACCOUNT MANAGEMENT / 06</span>
              <h2>Your Profile<br /><em>& Settings</em></h2>
              <p>Manage your account, sync across devices, and access admin tools.</p>
            </div>
            
            <div className="account-tabs">
              <button
                className={`account-tab ${accountTab === 'profile' ? 'is-active' : ''}`}
                onClick={() => setAccountTab('profile')}
              >
                👤 Profile & Sync
              </button>
              <button
                className={`account-tab ${accountTab === 'admin' ? 'is-active' : ''}`}
                onClick={() => setAccountTab('admin')}
              >
                🛡️ Admin Dashboard
              </button>
            </div>

            <div className="account-content">
              {accountTab === 'profile' && <UserProfile />}
              {accountTab === 'admin' && <AdminDashboard />}
            </div>
          </div>
        )}
      </main>

      <footer className="site-footer"><span>SynapCity / educational neural model</span><span className="mono">the animation visualizes the computation</span></footer>
    </div>
  );
}

export default App;