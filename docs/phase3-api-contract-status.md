# Phase 3 API Config & Status

## 1. Backend Configuration
*   **Base URL**: `http://localhost:8888`
*   **Required Frontend Environment Variables**:
    ```env
    VITE_API_BASE_URL=http://localhost:8888
    ```

## 2. Authentication Flow
**Current Status**: Implemented (functional).
**Session Strategy**: HttpOnly Cookie (`musicmind-session-v2`).

| Goal | Requested Endpoint | **Actual Endpoint** | Status | Details |
| :--- | :--- | :--- | :--- | :--- |
| **Login** | `/auth/login` | `/login` | ✅ **Exists** | Redirects to Spotify OAuth. Session established on callback. |
| **Callback** | (Internal) | `/callback` | ✅ **Exists** | Handles code exchange, sets cookie, saves user to DB. |
| **Check Auth** | `/auth/me` | `/api/user/profile` | ✅ **Exists** | Returns User Profile JSON. Returns 401 if not logged in. |
| **Logout** | `/auth/logout` | `/logout` | ✅ **Exists** | Clears session cookie. |

---

## 3. API Contract for Endpoints

### Dashboard
| Requested Endpoint | Method | Status | Notes |
| :--- | :--- | :--- | :--- |
| `/dashboard/insights` | GET | ⚠️ **Partial** | Mapped to `/api/analytics/dashboard`. Returns `topGenres`, `moodScore`. <br>**Missing**: Does not strictly follow a "insights" schema if different from current. |
| `/dashboard/top-songs` | GET | ❌ **Missing** | Backend fetches top tracks internally for analytics but **does not return them** in the JSON response. <br>**Action Required**: Update `/api/analytics/dashboard` to include `topTracks` or create new endpoint. |

**Current `/api/analytics/dashboard` Response**:
```json
{
  "topGenres": [ { "genre": "Pop", "count": 10, "percentage": 20 } ],
  "moodScore": 58.5,
  "totalTracksAnalyzed": 50,
  "generatedAt": "2024-03-21T..."
}
```

### Recommendations
| Requested Endpoint | Method | Status | Notes |
| :--- | :--- | :--- | :--- |
| `/recommendations` | GET | ❌ **Missing** | No endpoint to fetch past recommendations. |
| `(Trigger)` | POST | ⚠️ **Mock Only** | Exists as `/api/recommend/generate`. Currently returns mock "processing" message. |

### Friends (New Feature)
| Requested Endpoint | Method | Status | Notes |
| :--- | :--- | :--- | :--- |
| `/friends/search` | GET | ❌ **Missing** | functionality does not exist in backend/DB. |
| `/friends/compare` | POST | ❌ **Missing** | functionality does not exist in backend/DB. |

---

## 4. Next Steps for Integration
1.  **Frontend**: Update base URL and auth paths to match "Actual Endpoint" above.
2.  **Backend**:
    *   Update `/api/analytics/dashboard` to include `topTracks` list?
    *   Implement GET `/recommendations`.
    *   Implement Python Recommendation Engine (replace Mock).
    *   **Major**: Design & Implement Friends feature (Schema + API).
