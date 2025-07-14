import React, { useState, useEffect } from 'react';
import './App.css';

const API_BASE_URL = 'http://localhost:4000/api';

function App() {
  const [clientRequests, setClientRequests] = useState([]);
  const [talents, setTalents] = useState([]);
  const [matches, setMatches] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('requests');

  // Form states
  const [newRequest, setNewRequest] = useState({
    id: '',
    name: '',
    type: '',
    industry: '',
    city: '',
    style_preferences: '',
    communication_style: '',
    client_tier: ''
  });

  const [newTalent, setNewTalent] = useState({
    id: '',
    name: '',
    city: '',
    hometown: '',
    categories: '',
    skills: '',
    style_tags: '',
    budget_range: '',
    experience_years: '',
    platforms: '',
    soft_skills: {
      communication: '',
      punctuality: '',
      collaboration: '',
      initiative: '',
      adaptability: ''
    },
    software_skills: [],
    languages: '',
    past_credits: '',
    endorsements: '',
    interest_tags: '',
    availability_calendar: '',
    tier_tags: '',
    portfolio: ''
  });
  const [softwareSkillInput, setSoftwareSkillInput] = useState({ name: '', level: '' });

  // Fetch client requests
  const fetchClientRequests = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/clients/requests`);
      const data = await response.json();
      if (data.success) {
        setClientRequests(data.data);
      }
    } catch (error) {
      console.error('Error fetching client requests:', error);
    }
  };

  // Fetch talents
  const fetchTalents = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/talents`);
      const data = await response.json();
      if (data.success) {
        setTalents(data.data.talents);
      }
    } catch (error) {
      console.error('Error fetching talents:', error);
    }
  };

  // Create new client request
  const createClientRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const requestData = {
        ...newRequest,
        style_preferences: newRequest.style_preferences.split(',').map(s => s.trim()).filter(Boolean)
      };
      const response = await fetch(`${API_BASE_URL}/clients/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      const data = await response.json();
      if (data.success) {
        setNewRequest({
          id: '',
          name: '',
          type: '',
          industry: '',
          city: '',
          style_preferences: '',
          communication_style: '',
          client_tier: ''
        });
        fetchClientRequests();
        alert('Client request created successfully!');
      }
    } catch (error) {
      console.error('Error creating client request:', error);
      alert('Error creating client request');
    } finally {
      setLoading(false);
    }
  };

  // Create new talent
  const createTalent = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const talentData = {
        ...newTalent,
        categories: newTalent.categories.split(',').map(s => s.trim()).filter(Boolean),
        skills: newTalent.skills.split(',').map(s => s.trim()).filter(Boolean),
        style_tags: newTalent.style_tags.split(',').map(s => s.trim()).filter(Boolean),
        platforms: newTalent.platforms.split(',').map(s => s.trim()).filter(Boolean),
        languages: newTalent.languages.split(',').map(s => s.trim()).filter(Boolean),
        past_credits: newTalent.past_credits.split(',').map(s => s.trim()).filter(Boolean),
        endorsements: newTalent.endorsements.split(',').map(s => s.trim()).filter(Boolean),
        interest_tags: newTalent.interest_tags.split(',').map(s => s.trim()).filter(Boolean),
        availability_calendar: newTalent.availability_calendar.split(';').map(item => {
          const [city, from, to] = item.split(',').map(s => s.trim());
          if (city && from && to) return { city, from, to };
          return null;
        }).filter(Boolean),
        tier_tags: newTalent.tier_tags.split(',').map(s => s.trim()).filter(Boolean),
        portfolio: newTalent.portfolio.split(';').map(item => {
          const [title, tags, keywords] = item.split('|').map(s => s.trim());
          return {
            title: title || '',
            tags: tags ? tags.split(',').map(s => s.trim()).filter(Boolean) : [],
            keywords: keywords ? keywords.split(',').map(s => s.trim()).filter(Boolean) : []
          };
        }).filter(item => item.title),
        experience_years: parseInt(newTalent.experience_years) || 0,
        budget_range: newTalent.budget_range,
        software_skills: newTalent.software_skills.filter(s => s.name && s.level)
      };
      const response = await fetch(`${API_BASE_URL}/talents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(talentData),
      });
      const data = await response.json();
      if (data.success) {
        setNewTalent({
          id: '',
          name: '',
          city: '',
          hometown: '',
          categories: '',
          skills: '',
          style_tags: '',
          budget_range: '',
          experience_years: '',
          platforms: '',
          soft_skills: {
            communication: '',
            punctuality: '',
            collaboration: '',
            initiative: '',
            adaptability: ''
          },
          software_skills: [],
          languages: '',
          past_credits: '',
          endorsements: '',
          interest_tags: '',
          availability_calendar: '',
          tier_tags: '',
          portfolio: ''
        });
        setSoftwareSkillInput({ name: '', level: '' });
        fetchTalents();
        alert('Talent created successfully!');
      }
    } catch (error) {
      console.error('Error creating talent:', error);
      alert('Error creating talent');
    } finally {
      setLoading(false);
    }
  };

  // Add software skill to newTalent
  const addSoftwareSkill = (e) => {
    e.preventDefault();
    if (softwareSkillInput.name && softwareSkillInput.level) {
      setNewTalent({
        ...newTalent,
        software_skills: [
          ...newTalent.software_skills,
          { name: softwareSkillInput.name, level: parseInt(softwareSkillInput.level) }
        ]
      });
      setSoftwareSkillInput({ name: '', level: '' });
    }
  };

  // Remove software skill
  const removeSoftwareSkill = (idx) => {
    setNewTalent({
      ...newTalent,
      software_skills: newTalent.software_skills.filter((_, i) => i !== idx)
    });
  };

  // Get matches for a client request
  const getMatches = async (requestId) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/clients/requests/${requestId}/top-matches`);
      const data = await response.json();
      if (data.success) {
        setMatches(data.data.topMatches);
        setSelectedRequest(clientRequests.find(req => req._id === requestId));
      }
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientRequests();
    fetchTalents();
  }, []);

  const renderClientRequestForm = () => (
    <div className="form-container">
      <h2>Create New Client Request</h2>
      <form onSubmit={createClientRequest} className="form">
        <div className="form-group">
          <label>Client ID:</label>
          <input
            type="text"
            value={newRequest.id}
            onChange={(e) => setNewRequest({...newRequest, id: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <label>Client Name:</label>
          <input
            type="text"
            value={newRequest.name}
            onChange={(e) => setNewRequest({...newRequest, name: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <label>Type:</label>
          <input
            type="text"
            value={newRequest.type}
            onChange={(e) => setNewRequest({...newRequest, type: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <label>Industry:</label>
          <input
            type="text"
            value={newRequest.industry}
            onChange={(e) => setNewRequest({...newRequest, industry: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <label>City:</label>
          <input
            type="text"
            value={newRequest.city}
            onChange={(e) => setNewRequest({...newRequest, city: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <label>Style Preferences (comma-separated):</label>
          <input
            type="text"
            value={newRequest.style_preferences}
            onChange={(e) => setNewRequest({...newRequest, style_preferences: e.target.value})}
            placeholder="Vibrant, Boho"
          />
        </div>
        <div className="form-group">
          <label>Communication Style:</label>
          <input
            type="text"
            value={newRequest.communication_style}
            onChange={(e) => setNewRequest({...newRequest, communication_style: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <label>Client Tier:</label>
          <input
            type="text"
            value={newRequest.client_tier}
            onChange={(e) => setNewRequest({...newRequest, client_tier: e.target.value})}
            required
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Creating...' : 'Create Request'}
        </button>
      </form>
    </div>
  );

  const renderTalentForm = () => (
    <div className="form-container">
      <h2>Add New Talent</h2>
      <form onSubmit={createTalent} className="form">
        <div className="form-group">
          <label>Talent ID:</label>
          <input
            type="text"
            value={newTalent.id}
            onChange={(e) => setNewTalent({...newTalent, id: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            value={newTalent.name}
            onChange={(e) => setNewTalent({...newTalent, name: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <label>City:</label>
          <input
            type="text"
            value={newTalent.city}
            onChange={(e) => setNewTalent({...newTalent, city: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <label>Hometown:</label>
          <input
            type="text"
            value={newTalent.hometown}
            onChange={(e) => setNewTalent({...newTalent, hometown: e.target.value})}
          />
        </div>
        <div className="form-group">
          <label>Categories (comma-separated):</label>
          <input
            type="text"
            value={newTalent.categories}
            onChange={(e) => setNewTalent({...newTalent, categories: e.target.value})}
            placeholder="Director, Photographer"
          />
        </div>
        <div className="form-group">
          <label>Skills (comma-separated):</label>
          <input
            type="text"
            value={newTalent.skills}
            onChange={(e) => setNewTalent({...newTalent, skills: e.target.value})}
            placeholder="Fashion Shoots, Corporate Shoots, Weddings"
          />
        </div>
        <div className="form-group">
          <label>Style Tags (comma-separated):</label>
          <input
            type="text"
            value={newTalent.style_tags}
            onChange={(e) => setNewTalent({...newTalent, style_tags: e.target.value})}
            placeholder="documentary, vibrant, cinematic"
          />
        </div>
        <div className="form-group">
          <label>Budget Range:</label>
          <input
            type="text"
            value={newTalent.budget_range}
            onChange={(e) => setNewTalent({...newTalent, budget_range: e.target.value})}
            placeholder="₹33546–₹66470"
          />
        </div>
        <div className="form-group">
          <label>Experience Years:</label>
          <input
            type="number"
            value={newTalent.experience_years}
            onChange={(e) => setNewTalent({...newTalent, experience_years: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <label>Platforms (comma-separated):</label>
          <input
            type="text"
            value={newTalent.platforms}
            onChange={(e) => setNewTalent({...newTalent, platforms: e.target.value})}
            placeholder="Personal Website, Behance"
          />
        </div>
        <div className="form-group">
          <label>Soft Skills:</label>
          <div className="form-row">
            <input type="text" placeholder="Communication" value={newTalent.soft_skills.communication} onChange={e => setNewTalent({...newTalent, soft_skills: {...newTalent.soft_skills, communication: e.target.value}})} />
            <input type="text" placeholder="Punctuality" value={newTalent.soft_skills.punctuality} onChange={e => setNewTalent({...newTalent, soft_skills: {...newTalent.soft_skills, punctuality: e.target.value}})} />
            <input type="text" placeholder="Collaboration" value={newTalent.soft_skills.collaboration} onChange={e => setNewTalent({...newTalent, soft_skills: {...newTalent.soft_skills, collaboration: e.target.value}})} />
            <input type="text" placeholder="Initiative" value={newTalent.soft_skills.initiative} onChange={e => setNewTalent({...newTalent, soft_skills: {...newTalent.soft_skills, initiative: e.target.value}})} />
            <input type="text" placeholder="Adaptability" value={newTalent.soft_skills.adaptability} onChange={e => setNewTalent({...newTalent, soft_skills: {...newTalent.soft_skills, adaptability: e.target.value}})} />
          </div>
        </div>
        <div className="form-group">
          <label>Software Skills:</label>
          <div className="form-row">
            <input type="text" placeholder="Software Name" value={softwareSkillInput.name} onChange={e => setSoftwareSkillInput({...softwareSkillInput, name: e.target.value})} />
            <input type="number" placeholder="Level" value={softwareSkillInput.level} onChange={e => setSoftwareSkillInput({...softwareSkillInput, level: e.target.value})} />
            <button className="btn-secondary" onClick={addSoftwareSkill} type="button">Add</button>
          </div>
          <ul style={{ marginTop: '0.5rem' }}>
            {newTalent.software_skills.map((s, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {s.name} (Level: {s.level})
                <button type="button" onClick={() => removeSoftwareSkill(idx)} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
              </li>
            ))}
          </ul>
        </div>
        <div className="form-group">
          <label>Languages (comma-separated):</label>
          <input
            type="text"
            value={newTalent.languages}
            onChange={(e) => setNewTalent({...newTalent, languages: e.target.value})}
            placeholder="Tamil, Marathi"
          />
        </div>
        <div className="form-group">
          <label>Past Credits (comma-separated):</label>
          <input
            type="text"
            value={newTalent.past_credits}
            onChange={(e) => setNewTalent({...newTalent, past_credits: e.target.value})}
            placeholder="Baxter-Peterson, Salazar, Campbell-Strickland"
          />
        </div>
        <div className="form-group">
          <label>Endorsements (comma-separated):</label>
          <input
            type="text"
            value={newTalent.endorsements}
            onChange={(e) => setNewTalent({...newTalent, endorsements: e.target.value})}
            placeholder="Andre Maldonado, Nathaniel White"
          />
        </div>
        <div className="form-group">
          <label>Interest Tags (comma-separated):</label>
          <input
            type="text"
            value={newTalent.interest_tags}
            onChange={(e) => setNewTalent({...newTalent, interest_tags: e.target.value})}
            placeholder="sports, music, lifestyle"
          />
        </div>
        <div className="form-group">
          <label>Availability Calendar (semicolon-separated, each: city,from,to):</label>
          <input
            type="text"
            value={newTalent.availability_calendar}
            onChange={(e) => setNewTalent({...newTalent, availability_calendar: e.target.value})}
            placeholder="Mumbai,2025-09-24,2025-11-09"
          />
        </div>
        <div className="form-group">
          <label>Tier Tags (comma-separated):</label>
          <input
            type="text"
            value={newTalent.tier_tags}
            onChange={(e) => setNewTalent({...newTalent, tier_tags: e.target.value})}
            placeholder="intermediate, potential backup"
          />
        </div>
        <div className="form-group">
          <label>Portfolio (semicolon-separated, each: title|tags,comma|keywords,comma):</label>
          <input
            type="text"
            value={newTalent.portfolio}
            onChange={(e) => setNewTalent({...newTalent, portfolio: e.target.value})}
            placeholder="Branding Portfolio 1|vibrant,minimal|mood,natural light,portrait"
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Creating...' : 'Add Talent'}
        </button>
      </form>
    </div>
  );

  const renderClientRequests = () => (
    <div className="requests-container">
      <h2>Client Requests</h2>
      <div className="requests-grid">
        {clientRequests.map((request) => (
          <div key={request._id} className="request-card">
            <h3>{request.name}</h3>
            <p><strong>Type:</strong> {request.type}</p>
            <p><strong>Industry:</strong> {request.industry}</p>
            <p><strong>City:</strong> {request.city}</p>
            <p><strong>Style Preferences:</strong> {request.style_preferences?.join(', ')}</p>
            <p><strong>Communication Style:</strong> {request.communication_style}</p>
            <p><strong>Client Tier:</strong> {request.client_tier}</p>
            <button 
              onClick={() => getMatches(request._id)}
              className="btn-secondary"
            >
              Find Matches
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTalents = () => (
    <div className="talents-container">
      <h2>Available Talents</h2>
      <div className="talents-grid">
        {talents.map((talent) => (
          <div key={talent._id} className="talent-card">
            <h3>{talent.name}</h3>
            <p><strong>City:</strong> {talent.city}</p>
            <p><strong>Hometown:</strong> {talent.hometown}</p>
            <p><strong>Categories:</strong> {talent.categories?.join(', ')}</p>
            <p><strong>Skills:</strong> {talent.skills?.join(', ')}</p>
            <p><strong>Style Tags:</strong> {talent.style_tags?.join(', ')}</p>
            <p><strong>Budget Range:</strong> {talent.budget_range}</p>
            <p><strong>Experience:</strong> {talent.experience_years} years</p>
            <p><strong>Platforms:</strong> {talent.platforms?.join(', ')}</p>
            <p><strong>Soft Skills:</strong> {talent.soft_skills && Object.entries(talent.soft_skills).map(([k, v]) => `${k}: ${v}`).join(', ')}</p>
            <p><strong>Software Skills:</strong> {talent.software_skills && talent.software_skills.map(s => `${s.name} (${s.level})`).join(', ')}</p>
            <p><strong>Languages:</strong> {talent.languages?.join(', ')}</p>
            <p><strong>Past Credits:</strong> {talent.past_credits?.join(', ')}</p>
            <p><strong>Endorsements:</strong> {talent.endorsements?.join(', ')}</p>
            <p><strong>Interest Tags:</strong> {talent.interest_tags?.join(', ')}</p>
            <p><strong>Availability Calendar:</strong> {talent.availability_calendar && talent.availability_calendar.map(a => `${a.city} (${a.from} to ${a.to})`).join('; ')}</p>
            <p><strong>Tier Tags:</strong> {talent.tier_tags?.join(', ')}</p>
            <p><strong>Portfolio:</strong> {talent.portfolio && talent.portfolio.map(p => `${p.title} [tags: ${p.tags?.join(', ')} | keywords: ${p.keywords?.join(', ')}]`).join('; ')}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMatches = () => (
    <div className="matches-container">
      <h2>Top Matches</h2>
      {selectedRequest && (
        <div className="selected-request">
          <h3>For: {selectedRequest.name}</h3>
          <p><strong>Type:</strong> {selectedRequest.type}</p>
          <p><strong>Industry:</strong> {selectedRequest.industry}</p>
          <p><strong>City:</strong> {selectedRequest.city}</p>
          <p><strong>Style Preferences:</strong> {selectedRequest.style_preferences?.join(', ')}</p>
        </div>
      )}
      
      {loading ? (
        <div className="loading">Finding matches...</div>
      ) : (
        <div className="matches-grid">
          {matches.map((match) => (
            <div key={match.talent.id} className="match-card">
              <div className="match-header">
                <h3>#{match.rank} - {match.talent.name}</h3>
                <div className="match-score">
                  <span className="score">{match.totalScore.toFixed(1)}</span>
                  <span className="score-label">Match Score</span>
                </div>
              </div>
              <div className="talent-info">
                <p><strong>City:</strong> {match.talent.city}</p>
                <p><strong>Categories:</strong> {match.talent.categories?.join(', ')}</p>
                <p><strong>Skills:</strong> {match.talent.skills?.join(', ')}</p>
                <p><strong>Experience:</strong> {match.talent.experience_years} years</p>
                <p><strong>Style Tags:</strong> {match.talent.style_tags?.join(', ')}</p>
                <p><strong>Portfolio:</strong> {match.talent.portfolio && match.talent.portfolio.map(p => `${p.title} [tags: ${p.tags?.join(', ')} | keywords: ${p.keywords?.join(', ')}]`).join('; ')}</p>
              </div>
              <div className="score-breakdown">
                <h4>Score Breakdown:</h4>
                <div className="scores">
                  <span>Location: {match.scores.location}</span>
                  <span>Skills: {match.scores.skills}</span>
                  <span>Categories: {match.scores.categories}</span>
                  <span>Experience: {match.scores.experience}</span>
                  <span>Style: {match.scores.stylePreferences}</span>
                  <span>Portfolio: {match.scores.portfolioKeywords}</span>
                </div>
              </div>
              <div className="explanation">
                <h4>Why this match?</h4>
                <p>{match.explanation}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="app">
      <header className="header">
        <h1>🎨 BreadButter Talent Matchmaking</h1>
        <p>Connect clients with the perfect creative professionals</p>
      </header>
      <nav className="nav">
        <button 
          className={`nav-btn ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          Client Requests
        </button>
        <button 
          className={`nav-btn ${activeTab === 'talents' ? 'active' : ''}`}
          onClick={() => setActiveTab('talents')}
        >
          Talents
        </button>
        <button 
          className={`nav-btn ${activeTab === 'matches' ? 'active' : ''}`}
          onClick={() => setActiveTab('matches')}
        >
          Matches
        </button>
        <button 
          className={`nav-btn ${activeTab === 'new-request' ? 'active' : ''}`}
          onClick={() => setActiveTab('new-request')}
        >
          New Request
        </button>
        <button 
          className={`nav-btn ${activeTab === 'new-talent' ? 'active' : ''}`}
          onClick={() => setActiveTab('new-talent')}
        >
          Add Talent
        </button>
      </nav>
      <main className="main">
        {activeTab === 'requests' && renderClientRequests()}
        {activeTab === 'talents' && renderTalents()}
        {activeTab === 'matches' && renderMatches()}
        {activeTab === 'new-request' && renderClientRequestForm()}
        {activeTab === 'new-talent' && renderTalentForm()}
      </main>
    </div>
  );
}

export default App;
