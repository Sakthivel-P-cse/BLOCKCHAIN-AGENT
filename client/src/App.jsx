import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Database, ShieldCheck, Activity, Download, RefreshCw, FileText } from 'lucide-react';

const API_BASE = 'http://localhost:3001';

function App() {
  const [chain, setChain] = useState([]);
  const [isValid, setIsValid] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedWeights, setSelectedWeights] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchChain = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_BASE}/chain`);
      setChain(data);
      const validateRes = await axios.get(`${API_BASE}/validate`);
      setIsValid(validateRes.data.isValid);
    } catch (err) {
      console.error('Error fetching chain:', err);
    } finally {
      setLoading(false);
    }
  };

  const showWeights = async (hash) => {
    try {
      const { data } = await axios.get(`${API_BASE}/weights/${hash}`);
      setSelectedWeights(data);
      setModalOpen(true);
    } catch (err) {
      alert('Failed to fetch off-chain weights');
    }
  };

  useEffect(() => {
    fetchChain();
  }, []);

  return (
    <div className="dashboard">
      <header className="header">
        <div>
          <h1><Database size={28} inline="true" style={{ verticalAlign: 'middle', marginRight: '10px' }} /> Agent Weight Blockchain</h1>
          <p style={{ color: 'var(--text-muted)' }}>Immutable off-chain storage with on-chain verification</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ marginBottom: '0.5rem' }}>
            Integrity: {isValid === true ? <span className="status-valid"><ShieldCheck size={18} inline="true" /> SECURE</span> : <span className="status-invalid">VERIFYING...</span>}
          </div>
          <button className="btn" onClick={fetchChain}>
            <RefreshCw size={16} inline="true" style={{ marginRight: '5px' }} /> Refresh Chain
          </button>
        </div>
      </header>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>Loading components...</div>
      ) : (
        <div className="blockchain-grid">
          {chain.slice().reverse().map((block, idx) => (
            <div key={block.hash} className="block-card">
              <div className="block-header">
                <span className="badge">BLOCK #{block.index}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {new Date(block.timestamp).toLocaleTimeString()}
                </span>
              </div>

              <div className="label">Block Hash</div>
              <div className="hash-container">{block.hash}</div>

              <div className="label">Previous Hash</div>
              <div className="hash-container" style={{ fontSize: '0.7rem', opacity: 0.7 }}>{block.previousHash}</div>

              <div className="weight-preview">
                {block.index === 0 ? (
                  <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)' }}>
                    Genesis Block - Initialized
                  </div>
                ) : (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>Episode {block.data.episode}</span>
                      <button className="btn" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }} onClick={() => showWeights(block.data.weightHash)}>
                        <FileText size={14} inline="true" /> View Off-chain Data
                      </button>
                    </div>
                    <div className="label" style={{ marginTop: '0.5rem' }}>Metadata Hash</div>
                    <div className="hash-container" style={{ backgroundColor: '#6366f120' }}>{block.data.weightHash}</div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2>Off-Chain Weight Data</h2>
              <button className="btn" onClick={() => setModalOpen(false)}>Close</button>
            </div>
            <pre>
              {JSON.stringify(selectedWeights, null, 2)}
            </pre>
            <div style={{ marginTop: '1rem', textAlign: 'right' }}>
              <button className="btn" onClick={() => {
                const blob = new Blob([JSON.stringify(selectedWeights)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `weights.json`;
                a.click();
              }}>
                <Download size={16} inline="true" /> Download JSON
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
