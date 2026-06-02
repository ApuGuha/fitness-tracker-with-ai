import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User as UserIcon, Calendar, Activity, ChevronRight, Save } from 'lucide-react';
import api from '../api/axios';

const Dashboard = () => {
  const [profile, setProfile] = useState({});
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, plansRes] = await Promise.all([
          api.get('/profile'),
          api.get('/plans')
        ]);
        setProfile(profileRes.data.profile || {});
        setFormData(profileRes.data.profile || {});
        setPlans(plansRes.data);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/profile', formData);
      setProfile(res.data.profile);
      setEditing(false);
    } catch (err) {
      console.error('Failed to update profile', err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem' }}>
        <h3 className="gradient-text">Loading Dashboard...</h3>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="gradient-text">Your Dashboard</h1>
        <Link to="/consultation" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity size={18} />
          New Consultation
        </Link>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        
        {/* Profile Section */}
        <div className="glass-panel animate-fade-in" style={{ flex: '1 1 350px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
              <UserIcon color="var(--accent-primary)" /> Profile Details
            </h3>
            {!editing ? (
              <button className="btn-secondary" onClick={() => setEditing(true)} style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>Edit</button>
            ) : (
              <button className="btn-primary" onClick={() => setEditing(false)} style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', background: 'transparent', border: '1px solid var(--error)', color: 'var(--error)' }}>Cancel</button>
            )}
          </div>

          {!editing ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', color: 'var(--text-muted)' }}>
              <div><strong style={{ color: 'var(--text-main)' }}>Age:</strong> {profile.age || 'Not set'}</div>
              <div><strong style={{ color: 'var(--text-main)' }}>Height:</strong> {profile.height ? `${profile.height} cm` : 'Not set'}</div>
              <div><strong style={{ color: 'var(--text-main)' }}>Weight:</strong> {profile.weight ? `${profile.weight} kg` : 'Not set'}</div>
              <div><strong style={{ color: 'var(--text-main)' }}>Target Weight:</strong> {profile.targetWeight ? `${profile.targetWeight} kg` : 'Not set'}</div>
              <div style={{ gridColumn: 'span 2' }}><strong style={{ color: 'var(--text-main)' }}>Goals:</strong> {profile.fitnessGoals || 'Not set'}</div>
              <div style={{ gridColumn: 'span 2' }}><strong style={{ color: 'var(--text-main)' }}>Activity Level:</strong> {profile.activityLevel || 'Not set'}</div>
              <div style={{ gridColumn: 'span 2' }}><strong style={{ color: 'var(--text-main)' }}>Diet:</strong> {profile.dietaryPreferences || 'Not set'}</div>
            </div>
          ) : (
            <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Age</label>
                  <input type="number" name="age" className="input-field" value={formData.age || ''} onChange={handleInputChange} style={{ width: '100%', padding: '0.6rem' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Height (cm)</label>
                  <input type="number" name="height" className="input-field" value={formData.height || ''} onChange={handleInputChange} style={{ width: '100%', padding: '0.6rem' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Weight (kg)</label>
                  <input type="number" name="weight" className="input-field" value={formData.weight || ''} onChange={handleInputChange} style={{ width: '100%', padding: '0.6rem' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Target (kg)</label>
                  <input type="number" name="targetWeight" className="input-field" value={formData.targetWeight || ''} onChange={handleInputChange} style={{ width: '100%', padding: '0.6rem' }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Fitness Goals</label>
                <input type="text" name="fitnessGoals" className="input-field" value={formData.fitnessGoals || ''} onChange={handleInputChange} style={{ width: '100%', padding: '0.6rem' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Activity Level</label>
                <select name="activityLevel" className="input-field" value={formData.activityLevel || ''} onChange={handleInputChange} style={{ width: '100%', padding: '0.6rem', color: 'var(--text-main)', background: 'var(--bg-card)' }}>
                   <option value="">Select Level</option>
                   <option value="Sedentary">Sedentary</option>
                   <option value="Lightly Active">Lightly Active</option>
                   <option value="Moderately Active">Moderately Active</option>
                   <option value="Very Active">Very Active</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Dietary Preferences</label>
                <input type="text" name="dietaryPreferences" className="input-field" value={formData.dietaryPreferences || ''} onChange={handleInputChange} style={{ width: '100%', padding: '0.6rem' }} />
              </div>
              <button type="submit" className="btn-primary" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                <Save size={16} /> Save Profile
              </button>
            </form>
          )}
        </div>

        {/* Plan History Section */}
        <div className="glass-panel animate-fade-in" style={{ flex: '2 1 500px', animationDelay: '0.1s' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <Calendar color="var(--accent-primary)" /> Plan History
          </h3>
          
          {plans.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>
              <p>You haven't generated any plans yet.</p>
              <Link to="/consultation" style={{ color: 'var(--accent-primary)', textDecoration: 'underline', marginTop: '1rem', display: 'inline-block' }}>Get Started</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {plans.map(plan => (
                <Link to={`/plan/${plan._id}`} key={plan._id} style={{ display: 'block' }}>
                  <div style={{ 
                    padding: '1.5rem', 
                    background: 'rgba(0, 0, 0, 0.2)', 
                    borderRadius: '8px', 
                    border: '1px solid rgba(255,255,255,0.05)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
                  onMouseOut={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'}
                  >
                    <div>
                      <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-main)', fontSize: '1.1rem' }}>
                         {plan.concern.length > 50 ? plan.concern.substring(0, 50) + '...' : plan.concern}
                      </h4>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {new Date(plan.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <ChevronRight color="var(--accent-secondary)" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
