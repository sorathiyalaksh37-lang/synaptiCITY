import React, { useState, useEffect } from 'react';

interface NetworkSnapshot {
  id: string;
  name: string;
  author: string;
  description: string;
  vocabulary: string[];
  weights: number[][];
  learningRate: number;
  rule: string;
  likes: number;
  downloads: number;
  thumbnail?: string;
  createdAt: number;
  tags: string[];
}

export const CommunityLibrary: React.FC<{
  onLoad: (snapshot: NetworkSnapshot) => void;
}> = ({ onLoad }) => {
  const [networks, setNetworks] = useState<NetworkSnapshot[]>([]);
  const [filter, setFilter] = useState<'popular' | 'recent' | 'liked'>('popular');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    // Load mock community networks (in real app, this would be an API call)
    loadCommunityNetworks();
  }, []);

  const loadCommunityNetworks = () => {
    // Mock data - in production, fetch from backend
    const mockNetworks: NetworkSnapshot[] = [
      {
        id: '1',
        name: 'Simple Animal Network',
        author: 'NeuralExplorer',
        description: 'A basic network demonstrating animal associations',
        vocabulary: ['cat', 'dog', 'bird', 'fish'],
        weights: [
          [0, 0.8, 0.2, 0.1],
          [0.8, 0, 0.3, 0.2],
          [0.2, 0.3, 0, 0.4],
          [0.1, 0.2, 0.4, 0],
        ],
        learningRate: 0.1,
        rule: 'hebbian',
        likes: 142,
        downloads: 89,
        createdAt: Date.now() - 86400000 * 7,
        tags: ['beginner', 'animals', 'demo'],
      },
      {
        id: '2',
        name: 'Color Associations',
        author: 'BrainBuilder',
        description: 'Network trained on color relationships and complementary colors',
        vocabulary: ['red', 'blue', 'green', 'yellow', 'purple', 'orange'],
        weights: Array(6).fill(0).map(() => Array(6).fill(0).map(() => Math.random() * 0.6)),
        learningRate: 0.15,
        rule: 'stdp',
        likes: 87,
        downloads: 56,
        createdAt: Date.now() - 86400000 * 3,
        tags: ['colors', 'intermediate', 'art'],
      },
      {
        id: '3',
        name: 'Programming Concepts',
        author: 'CodeNeuron',
        description: 'Associations between programming languages and paradigms',
        vocabulary: ['python', 'javascript', 'functional', 'oop', 'async', 'types'],
        weights: Array(6).fill(0).map(() => Array(6).fill(0).map(() => Math.random() * 0.8)),
        learningRate: 0.12,
        rule: 'bcm',
        likes: 203,
        downloads: 134,
        createdAt: Date.now() - 86400000 * 14,
        tags: ['programming', 'advanced', 'education'],
      },
      {
        id: '4',
        name: 'Music Theory Network',
        author: 'SymphonyAI',
        description: 'Network showing relationships between musical notes and chords',
        vocabulary: ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'major', 'minor'],
        weights: Array(9).fill(0).map(() => Array(9).fill(0).map(() => Math.random() * 0.7)),
        learningRate: 0.08,
        rule: 'oja',
        likes: 156,
        downloads: 92,
        createdAt: Date.now() - 86400000 * 5,
        tags: ['music', 'theory', 'creative'],
      },
      {
        id: '5',
        name: 'Emotion Recognition',
        author: 'EmotionLab',
        description: 'Network trained to associate emotions with contexts',
        vocabulary: ['happy', 'sad', 'angry', 'calm', 'excited', 'anxious', 'peaceful'],
        weights: Array(7).fill(0).map(() => Array(7).fill(0).map(() => Math.random() * 0.65)),
        learningRate: 0.11,
        rule: 'hebbian',
        likes: 178,
        downloads: 115,
        createdAt: Date.now() - 86400000 * 10,
        tags: ['psychology', 'emotions', 'research'],
      },
      {
        id: '6',
        name: 'Small World Topology',
        author: 'GraphTheory',
        description: 'Demonstration of small-world network properties',
        vocabulary: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
        weights: Array(10).fill(0).map(() => Array(10).fill(0).map(() => Math.random() * 0.5)),
        learningRate: 0.1,
        rule: 'stdp',
        likes: 99,
        downloads: 67,
        createdAt: Date.now() - 86400000 * 1,
        tags: ['topology', 'advanced', 'graph-theory'],
      },
    ];

    setNetworks(mockNetworks);
  };

  const allTags = Array.from(new Set(networks.flatMap(n => n.tags)));

  const filteredNetworks = networks
    .filter(n => {
      const matchesSearch = searchTerm === '' ||
        n.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.author.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTags = selectedTags.length === 0 ||
        selectedTags.some(tag => n.tags.includes(tag));

      return matchesSearch && matchesTags;
    })
    .sort((a, b) => {
      switch (filter) {
        case 'popular':
          return b.likes - a.likes;
        case 'recent':
          return b.createdAt - a.createdAt;
        case 'liked':
          return b.downloads - a.downloads;
        default:
          return 0;
      }
    });

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const formatTimeAgo = (timestamp: number) => {
    const days = Math.floor((Date.now() - timestamp) / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  };

  return (
    <div className="community-library">
      <div className="library-header">
        <h3>🌐 Community Library</h3>
        <p className="library-subtitle">
          Explore and learn from networks created by the community
        </p>
      </div>

      <div className="library-controls">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search networks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === 'popular' ? 'active' : ''}`}
            onClick={() => setFilter('popular')}
          >
            🔥 Popular
          </button>
          <button
            className={`filter-btn ${filter === 'recent' ? 'active' : ''}`}
            onClick={() => setFilter('recent')}
          >
            🆕 Recent
          </button>
          <button
            className={`filter-btn ${filter === 'liked' ? 'active' : ''}`}
            onClick={() => setFilter('liked')}
          >
            ⭐ Most Downloaded
          </button>
        </div>
      </div>

      <div className="tag-filters">
        {allTags.map(tag => (
          <button
            key={tag}
            className={`tag-pill ${selectedTags.includes(tag) ? 'active' : ''}`}
            onClick={() => toggleTag(tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="networks-grid">
        {filteredNetworks.length === 0 ? (
          <div className="no-results">
            <p>No networks found matching your criteria</p>
          </div>
        ) : (
          filteredNetworks.map(network => (
            <div key={network.id} className="network-card">
              <div className="card-header">
                <h4 className="network-name">{network.name}</h4>
                <div className="network-author">by {network.author}</div>
              </div>

              <p className="network-description">{network.description}</p>

              <div className="network-details">
                <div className="detail-item">
                  <span className="detail-label">Nodes:</span>
                  <span className="detail-value">{network.vocabulary.length}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Rule:</span>
                  <span className="detail-value">{network.rule.toUpperCase()}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Rate:</span>
                  <span className="detail-value">{network.learningRate}</span>
                </div>
              </div>

              <div className="network-tags">
                {network.tags.map(tag => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>

              <div className="network-stats">
                <div className="stat">
                  <span className="stat-icon">❤️</span>
                  <span className="stat-count">{network.likes}</span>
                </div>
                <div className="stat">
                  <span className="stat-icon">⬇️</span>
                  <span className="stat-count">{network.downloads}</span>
                </div>
                <div className="stat">
                  <span className="stat-icon">📅</span>
                  <span className="stat-text">{formatTimeAgo(network.createdAt)}</span>
                </div>
              </div>

              <button
                className="btn-load"
                onClick={() => onLoad(network)}
              >
                📥 Load Network
              </button>
            </div>
          ))
        )}
      </div>

      <style>{`
        .community-library {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(56, 189, 248, 0.3);
          border-radius: 12px;
          padding: 24px;
          margin: 20px 0;
        }

        .library-header h3 {
          color: #38bdf8;
          margin: 0 0 8px 0;
          font-size: 24px;
        }

        .library-subtitle {
          color: #94a3b8;
          font-size: 14px;
          margin: 0 0 24px 0;
        }

        .library-controls {
          display: flex;
          gap: 16px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }

        .search-bar {
          flex: 1;
          min-width: 250px;
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 16px;
        }

        .search-input {
          width: 100%;
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(56, 189, 248, 0.3);
          border-radius: 8px;
          padding: 10px 12px 10px 36px;
          color: #e2e8f0;
          font-size: 14px;
        }

        .search-input::placeholder {
          color: #64748b;
        }

        .filter-buttons {
          display: flex;
          gap: 8px;
        }

        .filter-btn {
          background: rgba(56, 189, 248, 0.1);
          border: 1px solid rgba(56, 189, 248, 0.3);
          border-radius: 8px;
          padding: 10px 16px;
          color: #38bdf8;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s;
        }

        .filter-btn:hover {
          background: rgba(56, 189, 248, 0.2);
        }

        .filter-btn.active {
          background: rgba(56, 189, 248, 0.3);
          border-color: #38bdf8;
        }

        .tag-filters {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 24px;
        }

        .tag-pill {
          background: rgba(56, 189, 248, 0.1);
          border: 1px solid rgba(56, 189, 248, 0.2);
          border-radius: 16px;
          padding: 6px 14px;
          color: #38bdf8;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .tag-pill:hover {
          background: rgba(56, 189, 248, 0.2);
        }

        .tag-pill.active {
          background: rgba(56, 189, 248, 0.3);
          border-color: #38bdf8;
          font-weight: 600;
        }

        .networks-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
        }

        .network-card {
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(56, 189, 248, 0.3);
          border-radius: 12px;
          padding: 20px;
          transition: all 0.3s;
        }

        .network-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(56, 189, 248, 0.2);
          border-color: rgba(56, 189, 248, 0.5);
        }

        .card-header {
          margin-bottom: 12px;
        }

        .network-name {
          color: #38bdf8;
          margin: 0 0 4px 0;
          font-size: 18px;
        }

        .network-author {
          color: #64748b;
          font-size: 12px;
        }

        .network-description {
          color: #94a3b8;
          font-size: 14px;
          line-height: 1.5;
          margin: 0 0 16px 0;
        }

        .network-details {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 16px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(56, 189, 248, 0.2);
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .detail-label {
          color: #64748b;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .detail-value {
          color: #38bdf8;
          font-size: 14px;
          font-weight: 600;
        }

        .network-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 16px;
        }

        .network-tags .tag {
          background: rgba(56, 189, 248, 0.15);
          border-radius: 12px;
          padding: 4px 10px;
          color: #38bdf8;
          font-size: 11px;
        }

        .network-stats {
          display: flex;
          gap: 16px;
          margin-bottom: 16px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(56, 189, 248, 0.2);
        }

        .stat {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .stat-icon {
          font-size: 14px;
        }

        .stat-count {
          color: #94a3b8;
          font-size: 14px;
          font-weight: 500;
        }

        .stat-text {
          color: #64748b;
          font-size: 12px;
        }

        .btn-load {
          width: 100%;
          background: rgba(56, 189, 248, 0.2);
          border: 1px solid rgba(56, 189, 248, 0.5);
          border-radius: 8px;
          padding: 12px;
          color: #38bdf8;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-load:hover {
          background: rgba(56, 189, 248, 0.3);
          transform: translateY(-2px);
        }

        .no-results {
          grid-column: 1 / -1;
          text-align: center;
          padding: 60px 20px;
          color: #64748b;
        }

        @media (max-width: 768px) {
          .library-controls {
            flex-direction: column;
          }

          .filter-buttons {
            width: 100%;
            justify-content: space-between;
          }

          .networks-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
