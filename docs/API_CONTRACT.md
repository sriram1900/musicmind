# MusicMind – Backend API Contract

This document defines the API responses that the backend must expose.
All data computation and normalization logic is owned by the data_pipeline.

The backend must only wrap and serve this data via APIs.
It must NOT rename keys or recompute scores.

---

## GET /api/analytics

Response:
```json
{
  "top_genres": [
    { "genre": "string", "percentage": 0 }
  ],
  "top_artists": [
    { "artist": "string", "count": 0 }
  ]
}
```

---

## GET /api/recommendations

Response:
```json
{
  "recommendations": [
    {
      "track_id": "string",
      "track_name": "string",
      "artist_name": "string",
      "score": 0.0,
      "reason": "string"
    }
  ]
}
```

---

## GET /api/compatibility/:userId

Response:
```json
{
  "user_a": "string",
  "user_b": "string",
  "score": 0,
  "shared_genres": ["string"]
}
```

---

## Rules (Non-Negotiable)

- Backend must not rename response keys
- Backend must not change response structure
- Backend must not recompute analytics or scores
- Backend only exposes data provided by data_pipeline
