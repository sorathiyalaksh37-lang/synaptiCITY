# synaptiCITY API Documentation

This document describes the backend API endpoints for synaptiCITY. The API is built with Express.js and TypeScript, using Supabase PostgreSQL for data storage.

## Base URL

```
Production: https://your-api.railway.app
Development: http://localhost:3001
```

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your_jwt_token>
```

### Getting a Token

Tokens are obtained through Supabase Auth (OAuth providers or email/password).

---

## Endpoints

### Health Check

#### `GET /health`

Check if the API is running.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-09-04T12:00:00.000Z",
  "uptime": 12345
}
```

---

## Networks

### Get Networks

#### `GET /api/networks`

Retrieve a list of networks with filtering and pagination.

**Query Parameters:**
| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `page` | number | Page number (1-indexed) | 1 |
| `limit` | number | Results per page (max 100) | 10 |
| `search` | string | Search by name or description | - |
| `sort` | string | Sort by: `popular`, `recent`, `liked` | `recent` |

**Response:**
```json
{
  "networks": [
    {
      "id": "uuid",
      "name": "Animal Recognition Network",
      "description": "Demonstrates DOG -> ANIMAL association",
      "user_id": "uuid",
      "author_name": "JohnDoe",
      "weights": [[0, 0.8, ...], ...],
      "vocabulary": ["DOG", "ANIMAL", "PET"],
      "learning_rate": 0.1,
      "learning_rule": "hebbian",
      "topology": "fully_connected",
      "likes_count": 42,
      "downloads_count": 128,
      "is_public": true,
      "tags": ["animal", "basic", "hebbian"],
      "created_at": "2026-09-01T10:00:00.000Z",
      "updated_at": "2026-09-04T12:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 156,
    "totalPages": 16
  }
}
```

---

### Get Single Network

#### `GET /api/networks/:id`

Retrieve a specific network by ID.

**Parameters:**
- `id` (path): Network UUID

**Response:**
```json
{
  "id": "uuid",
  "name": "Animal Recognition Network",
  "description": "Demonstrates DOG -> ANIMAL association",
  "user_id": "uuid",
  "author_name": "JohnDoe",
  "weights": [[0, 0.8, 0.3], [0.1, 0, 0.2], [0.05, 0.15, 0]],
  "vocabulary": ["DOG", "ANIMAL", "PET"],
  "learning_rate": 0.1,
  "learning_rule": "hebbian",
  "topology": "fully_connected",
  "likes_count": 42,
  "downloads_count": 128,
  "is_public": true,
  "allow_derivatives": true,
  "tags": ["animal", "basic", "hebbian"],
  "created_at": "2026-09-01T10:00:00.000Z",
  "updated_at": "2026-09-04T12:00:00.000Z"
}
```

---

### Create Network

#### `POST /api/networks`

Create a new network. Requires authentication.

**Headers:**
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "My Network",
  "description": "A test network",
  "weights": [[0, 0.5], [0.3, 0]],
  "vocabulary": ["INPUT", "OUTPUT"],
  "learning_rate": 0.1,
  "learning_rule": "hebbian",
  "topology": "fully_connected",
  "is_public": true,
  "allow_derivatives": true,
  "tags": ["test", "demo"]
}
```

**Validation:**
- `name`: Required, 3-100 characters
- `description`: Optional, max 1000 characters
- `weights`: Required, 2D array of numbers
- `vocabulary`: Required, array of strings (3-50 words)
- `learning_rate`: Required, 0.01-1.0
- `learning_rule`: One of: `hebbian`, `stdp`, `bcm`, `oja`
- `topology`: One of: `fully_connected`, `feed_forward`, `recurrent`, `small_world`, `scale_free`
- `tags`: Optional, array of strings (max 5)

**Response:**
```json
{
  "id": "uuid",
  "name": "My Network",
  ...
}
```

**Rate Limit:** 5 networks per minute

---

### Update Network

#### `PUT /api/networks/:id`

Update an existing network. Requires authentication and ownership.

**Parameters:**
- `id` (path): Network UUID

**Request Body:** Same as Create Network (all fields optional)

**Response:**
```json
{
  "id": "uuid",
  "name": "Updated Network",
  ...
}
```

---

### Delete Network

#### `DELETE /api/networks/:id`

Delete a network. Requires authentication and ownership.

**Parameters:**
- `id` (path): Network UUID

**Response:**
```json
{
  "message": "Network deleted successfully"
}
```

---

### Like Network

#### `POST /api/networks/:id/like`

Like a network. Requires authentication.

**Parameters:**
- `id` (path): Network UUID

**Response:**
```json
{
  "message": "Network liked",
  "likes_count": 43
}
```

**Rate Limit:** 10 likes per minute

---

### Unlike Network

#### `DELETE /api/networks/:id/like`

Remove like from a network. Requires authentication.

**Parameters:**
- `id` (path): Network UUID

**Response:**
```json
{
  "message": "Network unliked",
  "likes_count": 42
}
```

---

### Get My Networks

#### `GET /api/networks/my`

Get all networks created by the authenticated user.

**Query Parameters:**
| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `page` | number | Page number | 1 |
| `limit` | number | Results per page | 10 |

**Response:** Same structure as Get Networks

---

## Users

### Get User Profile

#### `GET /api/users/:id/profile`

Get a user's public profile.

**Parameters:**
- `id` (path): User UUID

**Response:**
```json
{
  "id": "uuid",
  "username": "johndoe",
  "display_name": "John Doe",
  "bio": "Neural network enthusiast",
  "avatar_url": "https://...",
  "level": 12,
  "xp": 5420,
  "networks_created": 15,
  "networks_shared": 10,
  "achievements_unlocked": 8,
  "longest_streak": 14,
  "created_at": "2026-01-15T00:00:00.000Z"
}
```

---

### Get My Profile

#### `GET /api/users/me/profile`

Get the authenticated user's full profile. Requires authentication.

**Response:**
```json
{
  "id": "uuid",
  "email": "john@example.com",
  "username": "johndoe",
  "display_name": "John Doe",
  "bio": "Neural network enthusiast",
  "avatar_url": "https://...",
  "level": 12,
  "xp": 5420,
  "xp_to_next_level": 580,
  "networks_created": 15,
  "networks_shared": 10,
  "achievements_unlocked": 8,
  "current_streak": 7,
  "longest_streak": 14,
  "last_active": "2026-09-04T12:00:00.000Z",
  "created_at": "2026-01-15T00:00:00.000Z",
  "preferences": {
    "theme": "dark",
    "analytics_enabled": true
  }
}
```

---

### Update Profile

#### `PUT /api/users/me/profile`

Update the authenticated user's profile. Requires authentication.

**Request Body:**
```json
{
  "display_name": "John Smith",
  "bio": "Updated bio",
  "avatar_url": "https://...",
  "preferences": {
    "theme": "light"
  }
}
```

**Response:**
```json
{
  "id": "uuid",
  "display_name": "John Smith",
  ...
}
```

---

### Get User Achievements

#### `GET /api/users/:id/achievements`

Get achievements earned by a user.

**Parameters:**
- `id` (path): User UUID (or `me` for authenticated user)

**Response:**
```json
{
  "achievements": [
    {
      "achievement_id": "uuid",
      "name": "Teaching Master",
      "description": "Teach 100 associations",
      "category": "teaching",
      "tier": "gold",
      "icon": "🎓",
      "xp_reward": 200,
      "unlocked_at": "2026-08-15T10:00:00.000Z"
    }
  ],
  "total": 8,
  "by_tier": {
    "bronze": 3,
    "silver": 2,
    "gold": 2,
    "platinum": 1
  }
}
```

---

### Update User Stats

#### `POST /api/users/me/stats`

Update user statistics (XP, streaks, etc.). Requires authentication.

**Request Body:**
```json
{
  "xp_gained": 15,
  "action": "teach"
}
```

**Response:**
```json
{
  "xp": 5435,
  "level": 12,
  "level_up": false,
  "achievements_unlocked": []
}
```

---

### Get Leaderboard

#### `GET /api/users/leaderboard`

Get the top users by XP.

**Query Parameters:**
| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `limit` | number | Number of users (max 100) | 10 |
| `period` | string | `all_time`, `month`, `week` | `all_time` |

**Response:**
```json
{
  "leaderboard": [
    {
      "rank": 1,
      "user_id": "uuid",
      "username": "johndoe",
      "display_name": "John Doe",
      "avatar_url": "https://...",
      "level": 25,
      "xp": 15420,
      "networks_created": 45,
      "achievements_unlocked": 16
    }
  ],
  "my_rank": 42,
  "total_users": 1523
}
```

---

### Get User Activity

#### `GET /api/users/:id/activity`

Get recent activity for a user.

**Parameters:**
- `id` (path): User UUID (or `me` for authenticated user)

**Query Parameters:**
| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `limit` | number | Number of activities (max 50) | 10 |

**Response:**
```json
{
  "activity": [
    {
      "id": "uuid",
      "action": "network_created",
      "metadata": {
        "network_id": "uuid",
        "network_name": "Animal Network"
      },
      "xp_gained": 10,
      "created_at": "2026-09-04T12:00:00.000Z"
    }
  ]
}
```

---

## Error Responses

### Standard Error Format

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 429 | Too Many Requests (rate limit) |
| 500 | Internal Server Error |

### Common Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Request validation failed |
| `UNAUTHORIZED` | Authentication required |
| `FORBIDDEN` | Access denied |
| `NOT_FOUND` | Resource not found |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `INTERNAL_ERROR` | Server error |

**Example:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request body",
    "details": {
      "fields": {
        "name": "Name must be at least 3 characters"
      }
    }
  }
}
```

---

## Rate Limits

| Endpoint | Limit |
|----------|-------|
| GET requests | 100/minute |
| POST /api/networks | 5/minute |
| POST /api/networks/:id/like | 10/minute |
| POST /api/users/me/stats | 30/minute |

**Rate Limit Headers:**
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1725451200
```

---

## Pagination

All list endpoints support pagination:

**Request:**
```http
GET /api/networks?page=2&limit=20
```

**Response:**
```json
{
  "data": [...],
  "pagination": {
    "page": 2,
    "limit": 20,
    "total": 156,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": true
  }
}
```

---

## Filtering & Sorting

### Networks

**Search:**
```http
GET /api/networks?search=animal
```

**Sort:**
```http
GET /api/networks?sort=popular
GET /api/networks?sort=recent
GET /api/networks?sort=liked
```

**Filter by tag:**
```http
GET /api/networks?tag=hebbian
```

**Combine:**
```http
GET /api/networks?search=neural&sort=popular&tag=advanced&page=1&limit=20
```

---

## WebSocket Events (Coming Soon)

Real-time updates for:
- New network submissions
- Achievement unlocks
- Leaderboard changes
- Live teaching sessions

```javascript
const ws = new WebSocket('wss://api.synapticity.com/ws');

ws.on('achievement_unlocked', (data) => {
  console.log('Achievement:', data.achievement);
});
```

---

## SDK / Client Libraries

### JavaScript/TypeScript

```typescript
import { api } from './lib/api';

// Get networks
const networks = await api.getNetworks({ page: 1, limit: 10 });

// Create network
const network = await api.createNetwork({
  name: 'My Network',
  weights: [[0, 0.5], [0.3, 0]],
  vocabulary: ['INPUT', 'OUTPUT'],
  learning_rate: 0.1
});

// Like network
await api.likeNetwork(networkId);
```

See `src/lib/api.ts` for the full client implementation.

---

## Testing

### cURL Examples

**Get networks:**
```bash
curl https://api.synapticity.com/api/networks?page=1&limit=5
```

**Create network (authenticated):**
```bash
curl -X POST https://api.synapticity.com/api/networks \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Network",
    "weights": [[0, 0.5], [0.3, 0]],
    "vocabulary": ["A", "B"],
    "learning_rate": 0.1
  }'
```

---

## Changelog

### v1.0.0 (2026-09-04)
- Initial API release
- Network CRUD operations
- User profiles and authentication
- Achievements and leaderboard
- Rate limiting and validation

---

## Support

- **Documentation**: See README.md, FAQ.md
- **Issues**: https://github.com/sorathiyalaksh37-lang/synaptiCITY/issues
- **Email**: [your-email@domain.com]

---

*Last Updated: September 4, 2026*
