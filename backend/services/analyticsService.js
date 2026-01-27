const db = require('../db');

/**
 * Compute analytics for a user from pipeline tables
 * Uses: user_history, song_artists, artist_genres
 */
async function computeAnalytics(userId) {
  // 1. Top Genres
  const topGenresQuery = `
    SELECT g.genre, COUNT(*) AS count
    FROM user_history uh
    JOIN song_artists sa ON uh.song_id = sa.song_id
    JOIN artist_genres ag ON sa.artist_id = ag.artist_id
    JOIN genres g ON ag.genre = g.genre
    WHERE uh.user_id = $1
    GROUP BY g.genre
    ORDER BY count DESC
    LIMIT 5;
  `;

  const topGenresRes = await db.query(topGenresQuery, [userId]);
  const topGenres = topGenresRes.rows;

  // 2. Mood Score (TEMPORARY simple logic)
  // Since audio_features are not yet stored in DB,
  // we compute a neutral score for now.
  const moodScore = 50;

  return {
    topGenres,
    moodScore
  };
}

/**
 * Save analytics snapshot (optional caching)
 */
async function saveAnalytics(userId, analytics) {
  const { topGenres, moodScore } = analytics;

  const query = `
    INSERT INTO analytics (user_id, top_genres, mood_score)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;

  const res = await db.query(query, [
    userId,
    JSON.stringify(topGenres),
    moodScore
  ]);

  return res.rows[0];
}

/**
 * Get latest analytics for a user
 */
async function getLatestAnalytics(userId) {
  const query = `
    SELECT *
    FROM analytics
    WHERE user_id = $1
    ORDER BY created_at DESC
    LIMIT 1;
  `;

  const res = await db.query(query, [userId]);
  return res.rows[0];
}

module.exports = {
  computeAnalytics,
  saveAnalytics,
  getLatestAnalytics
};
