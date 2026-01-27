import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TiltCard from './TiltCard';
import { getDashboardData } from '../services/api';
import './Dashboard.css';

const MusicInsightsPage = () => {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    getDashboardData()
      .then(res => setData(res))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="dashboard-container visible" style={{ paddingTop: '100px' }}>
        Loading insights...
      </div>
    );
  }

  const topTracks = data?.topTracks || [];
  const genres = data?.genres || [];

  // Derive artists from topTracks (backend does not send artists separately)
  const artists = [...new Set(topTracks.map(t => t.artist))];

  return (
    <div className="dashboard-container visible" style={{ paddingTop: '100px' }}>
      <nav className="glass-panel navbar">
        <button onClick={() => navigate('/dashboard')} className="back-btn">
          ← Back
        </button>
        <h2 className="logo">Music Insights</h2>
      </nav>

      <main className="dashboard-grid" style={{ maxWidth: '1000px', gap: '3rem' }}>

        {/* -------- TOP SONGS -------- */}
        <TiltCard
          className="glass-panel section-card"
          style={{ height: 'auto', minHeight: '400px' }}
        >
          <h3>Top Songs</h3>

          {topTracks.length === 0 && (
            <p style={{ textAlign: 'center', opacity: 0.7 }}>
              No top songs available
            </p>
          )}

          <ul className="song-list">
            {topTracks.map((song, i) => (
              <li key={i} className="song-item">
                <span className="rank">{i + 1}</span>
                <div className="song-info">
                  <div className="song-title">{song.name}</div>
                  <div className="song-artist">{song.artist}</div>
                </div>
              </li>
            ))}
          </ul>
        </TiltCard>

        {/* -------- TOP GENRES -------- */}
        <TiltCard
          className="glass-panel section-card"
          style={{ height: 'auto', minHeight: '300px' }}
        >
          <h3>Top Genres</h3>

          {genres.length === 0 && (
            <p style={{ textAlign: 'center', opacity: 0.7 }}>
              No genre data available
            </p>
          )}

          <div className="genre-bars">
            {genres.map(g => (
              <div key={g.name} className="genre-row">
                <span>{g.name}</span>
                <div className="progress-bar-bg">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${g.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </TiltCard>

        {/* -------- TOP ARTISTS -------- */}
        <TiltCard
          className="glass-panel section-card"
          style={{ height: 'auto', minHeight: '300px' }}
        >
          <h3>Top Artists</h3>

          {artists.length === 0 && (
            <p style={{ textAlign: 'center', opacity: 0.7 }}>
              No artists available
            </p>
          )}

          <ul className="song-list">
            {artists.map((artist, i) => (
              <li
                key={artist}
                className="song-item"
                style={{ justifyContent: 'flex-start', gap: '1rem' }}
              >
                <span className="rank">{i + 1}</span>
                <div className="song-info">
                  <div className="song-title" style={{ fontSize: '1.2rem' }}>
                    {artist}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </TiltCard>

      </main>
    </div>
  );
};

export default MusicInsightsPage;
