import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Loader } from 'lucide-react';
import api from '../api/axios';

const Consultation = () => {
  const [concern, setConcern] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!concern.trim()) {
      setError('Please provide your health or fitness concern.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.post('/ai/generate-plan', { concern });
      navigate(`/plan/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate plan. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '600px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <Sparkles color="var(--accent-primary)" />
          <h2 className="gradient-text" style={{ margin: 0 }}>AI Health Consultation</h2>
        </div>
        
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Describe your fitness goals, current challenges, and any specific dietary requirements or preferences. The more detail you provide, the better your personalized plan will be!
        </p>

        {error && (
          <div style={{ backgroundColor: 'rgba(255, 51, 102, 0.1)', color: 'var(--error)', padding: '0.8rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid var(--error)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <textarea 
              className="input-field" 
              rows="6"
              value={concern}
              onChange={(e) => setConcern(e.target.value)}
              placeholder="e.g. I want to lose 5kg in 2 months. I prefer a vegetarian diet and can bring out 4 days a week for gym..."
              style={{ resize: 'vertical', fontFamily: 'inherit' }}
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }} 
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader className="animate-spin" size={20} style={{ animation: 'spin 1s linear infinite' }} />
                <span>Generating your personalized plan...</span>
              </>
            ) : (
              <>
                <Sparkles size={20} />
                <span>Generate Plan</span>
              </>
            )}
          </button>
        </form>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
};

export default Consultation;
