import React, { useState } from 'react';

interface VocabularyBuilderProps {
  currentVocabulary: string[];
  onVocabularyChange: (vocabulary: string[]) => void;
  maxWords?: number;
  minWords?: number;
}

export const VocabularyBuilder: React.FC<VocabularyBuilderProps> = ({
  currentVocabulary,
  onVocabularyChange,
  maxWords = 20,
  minWords = 3,
}) => {
  const [newWord, setNewWord] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleAddWord = () => {
    const word = newWord.trim().toUpperCase();
    
    if (!word) {
      setError('Word cannot be empty');
      return;
    }

    if (word.length > 15) {
      setError('Word must be 15 characters or less');
      return;
    }

    if (!/^[A-Z]+$/.test(word)) {
      setError('Word must contain only letters');
      return;
    }

    if (currentVocabulary.includes(word)) {
      setError('Word already exists');
      return;
    }

    if (currentVocabulary.length >= maxWords) {
      setError(`Maximum ${maxWords} words allowed`);
      return;
    }

    onVocabularyChange([...currentVocabulary, word]);
    setNewWord('');
    setError(null);
  };

  const handleRemoveWord = (word: string) => {
    if (currentVocabulary.length <= minWords) {
      setError(`Minimum ${minWords} words required`);
      return;
    }

    onVocabularyChange(currentVocabulary.filter((w) => w !== word));
    setError(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddWord();
    }
  };

  const handleReset = () => {
    const defaultVocab = ['DOG', 'ANIMAL', 'PET', 'CAT', 'BIRD', 'FISH'];
    onVocabularyChange(defaultVocab);
    setError(null);
  };

  const presets = {
    animals: ['DOG', 'CAT', 'BIRD', 'FISH', 'LION', 'TIGER'],
    colors: ['RED', 'BLUE', 'GREEN', 'YELLOW', 'ORANGE', 'PURPLE'],
    emotions: ['HAPPY', 'SAD', 'ANGRY', 'CALM', 'EXCITED', 'TIRED'],
    science: ['ATOM', 'CELL', 'DNA', 'ENERGY', 'FORCE', 'MATTER'],
  };

  const handleLoadPreset = (preset: keyof typeof presets) => {
    onVocabularyChange(presets[preset]);
    setError(null);
  };

  return (
    <div className="vocabulary-builder">
      <button
        className="vocab-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M2 8H14M8 2V14"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <span>Custom Vocabulary</span>
        <span className="vocab-count">
          {currentVocabulary.length}/{maxWords}
        </span>
        <svg
          className={`vocab-chevron ${isExpanded ? 'is-expanded' : ''}`}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
        >
          <path d="M3 5L6 8L9 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {isExpanded && (
        <div className="vocab-content">
          <div className="vocab-input-section">
            <div className="vocab-input-group">
              <input
                type="text"
                value={newWord}
                onChange={(e) => setNewWord(e.target.value.toUpperCase())}
                onKeyPress={handleKeyPress}
                placeholder="Add new word..."
                className="vocab-input"
                maxLength={15}
              />
              <button className="vocab-add-btn" onClick={handleAddWord}>
                Add
              </button>
            </div>
            {error && <div className="vocab-error">{error}</div>}
          </div>

          <div className="vocab-presets">
            <span className="vocab-presets-label">Quick presets:</span>
            {Object.keys(presets).map((preset) => (
              <button
                key={preset}
                className="vocab-preset-btn"
                onClick={() => handleLoadPreset(preset as keyof typeof presets)}
              >
                {preset}
              </button>
            ))}
          </div>

          <div className="vocab-list">
            {currentVocabulary.map((word) => (
              <div key={word} className="vocab-item">
                <span className="vocab-word">{word}</span>
                <button
                  className="vocab-remove-btn"
                  onClick={() => handleRemoveWord(word)}
                  aria-label={`Remove ${word}`}
                  disabled={currentVocabulary.length <= minWords}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="vocab-actions">
            <button className="vocab-reset-btn" onClick={handleReset}>
              Reset to Default
            </button>
            <span className="vocab-note">
              {minWords}-{maxWords} words · A-Z only
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
