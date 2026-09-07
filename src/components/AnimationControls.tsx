import React from 'react';

export interface AnimationState {
  isPlaying: boolean;
  speed: number;
  currentFrame: number;
  totalFrames: number;
}

interface AnimationControlsProps {
  state: AnimationState;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onSpeedChange: (speed: number) => void;
  onFrameSeek: (frame: number) => void;
}

export const AnimationControls: React.FC<AnimationControlsProps> = ({
  state,
  onPlay,
  onPause,
  onReset,
  onStepForward,
  onStepBackward,
  onSpeedChange,
  onFrameSeek,
}) => {
  const progress = state.totalFrames > 0 ? (state.currentFrame / state.totalFrames) * 100 : 0;

  return (
    <div className="animation-controls">
      <div className="controls-header">
        <h4>Animation Controls</h4>
        <span className="frame-counter">
          Frame {state.currentFrame} / {state.totalFrames}
        </span>
      </div>

      <div className="playback-controls">
        <button
          className="control-btn"
          onClick={onReset}
          title="Reset to beginning"
          aria-label="Reset"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M2 8L2 2M2 2L8 2M2 2L6 6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <button
          className="control-btn"
          onClick={onStepBackward}
          title="Step backward"
          aria-label="Previous frame"
          disabled={state.currentFrame === 0}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M10 4L6 8L10 12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <button
          className="control-btn control-btn-primary"
          onClick={state.isPlaying ? onPause : onPlay}
          title={state.isPlaying ? 'Pause' : 'Play'}
          aria-label={state.isPlaying ? 'Pause' : 'Play'}
        >
          {state.isPlaying ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="4" y="3" width="3" height="10" rx="1" fill="currentColor" />
              <rect x="9" y="3" width="3" height="10" rx="1" fill="currentColor" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M5 3L13 8L5 13V3Z"
                fill="currentColor"
              />
            </svg>
          )}
        </button>

        <button
          className="control-btn"
          onClick={onStepForward}
          title="Step forward"
          aria-label="Next frame"
          disabled={state.currentFrame >= state.totalFrames}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M6 4L10 8L6 12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div className="timeline">
        <input
          type="range"
          min="0"
          max={state.totalFrames}
          value={state.currentFrame}
          onChange={(e) => onFrameSeek(parseInt(e.target.value, 10))}
          className="timeline-slider"
          aria-label="Seek timeline"
        />
        <div className="timeline-progress" style={{ width: `${progress}%` }} />
      </div>

      <div className="speed-control">
        <label className="speed-label">
          <span>Playback Speed</span>
          <span className="speed-value">{state.speed.toFixed(1)}×</span>
        </label>
        <div className="speed-options">
          {[0.25, 0.5, 1, 2, 4].map((speed) => (
            <button
              key={speed}
              className={`speed-btn ${state.speed === speed ? 'is-active' : ''}`}
              onClick={() => onSpeedChange(speed)}
            >
              {speed}×
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
