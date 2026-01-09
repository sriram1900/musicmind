# MusicMind – Phase 3 Final API Contract

Here is the complete API documentation for Phase 3 integration.

## 1. Backend Configuration
*   **Base URL**: `http://localhost:8888`
*   **Credentials**: Ensure `withCredentials: true` is set in your Axios/Fetch requests to handle cookies.
*   **Frontend Environment Variables**:
    ```env
    VITE_API_BASE_URL=http://localhost:8888
    ```

## 2. Authentication Flow
*   **Mechanism**: HttpOnly Cookie (`musicmind-session-v2`).
*   **Login URL**: `http://localhost:8888/auth/login` (Redirects to Spotify)
*   **Callback**: Handled internally. On success, redirects to: `http://localhost:5173/dashboard?login=success`
*   **Check Session**: GET `/auth/me` (Returns User Profile or 401)
*   **Logout**: GET `/auth/logout`

## 3. API Endpoints

### 📊 Dashboard
**GET** `/api/analytics/dashboard`
*   **Headers**: None (Cookie required)
*   **Response**:
    ```json
    {
      "topGenres": [
        { "genre": "Pop", "count": 15, "percentage": 30 },
        { "genre": "Indie", "count": 10, "percentage": 20 }
      ],
      "moodScore": 75.5,
      "topTracks": [
        {
          "name": "Blinding Lights",
          "artist": "The Weeknd",
          "image": "https://i.scdn.co/image/...",
          "preview": "https://p.scdn.co/mp3/..."
        }
      ],
      "totalTracksAnalyzed": 50,
      "generatedAt": "2024-03-21T10:00:00Z"
    }
    ```

### 👥 Friends (Social)
**GET** `/friends/search`
*   **Query Param**: `?q=username`
*   **Response**:
    ```json
    [
      { "spotify_id": "user123", "display_name": "John Doe" },
      { "spotify_id": "user456", "display_name": "Johnny" }
    ]
    ```

**POST** `/friends/request`
*   **Body**: `{ "receiverId": "spotify_user_id" }`
*   **Response**:
    ```json
    {
      "id": 1,
      "requester_id": "me",
      "receiver_id": "them",
      "status": "pending"
    }
    ```

**GET** `/friends`
*   **Purpose**: Get accepted friends list.
*   **Response**:
    ```json
    [
      { "spotify_id": "user99", "display_name": "Best Friend" }
    ]

**POST** `/friends/compare`
*   **Body**: `{ "targetUserId": "spotify_id_of_friend" }`
*   **Response**:
    ```json
    {
      "compatibility": 85,
      "commonGenres": ["Pop", "Rock"],
      "moodDifference": 5,
      "targetUserMood": 60
    }
    ```
    ```

### 🎵 Recommendations
**POST** `/api/recommend/generate`
*   **Purpose**: Trigger AI generation.
*   **Response**: `{ "status": "processing", "estimated_time": "5 seconds" }`

**GET** `/recommendations`
*   **Purpose**: Get past recommendations.
*   **Response**: `[]` (Currently empty, waiting for AI engine integration)

## 4. Error Responses
All endpoints follow this error format:
```json
{
  "error": "Short error message",
  "details": "Detailed debugging info (optional)"
}
```
*   **401 Unauthorized**: User is not logged in / Session expired.
*   **500 Internal Server Error**: Backend failure.
