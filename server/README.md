# synaptiCITY Backend API

Express.js REST API with PostgreSQL (Supabase) for the synaptiCITY neural network learning platform.

## 🏗️ Architecture

- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL via Supabase
- **Authentication**: Supabase Auth (JWT-based)
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: express-validator

## 📦 Features

- ✅ User authentication & profiles
- ✅ Network CRUD operations
- ✅ Achievements & XP system
- ✅ Leaderboard & rankings
- ✅ Like/unlike networks
- ✅ Activity logging
- ✅ Rate limiting & security
- ✅ Row-level security (RLS)

## 🚀 Quick Start

### 1. Setup Supabase

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to **SQL Editor** and run the schema from `server/config/database.sql`
4. Copy your project credentials:
   - Go to **Settings** > **API**
   - Copy the **URL** and **anon/public** key
   - Copy the **service_role** key (keep this secret!)

### 2. Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Fill in your Supabase credentials:

```env
PORT=3001
NODE_ENV=development

# Supabase (from your Supabase dashboard)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_role_key_here

# JWT Secret (generate with: openssl rand -base64 32)
JWT_SECRET=your_jwt_secret_here

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### 3. Install Dependencies

Dependencies are already installed. If not:

```bash
npm install
```

### 4. Run the Server

Development mode (with auto-reload):

```bash
npm run server
```

Production mode:

```bash
npm run server:prod
```

The API will be available at: `http://localhost:3001`

## 📚 API Endpoints

### Health Check
```
GET /health
```

### Networks

```
GET    /api/networks              - Get all public networks (with filters)
GET    /api/networks/:id          - Get single network
GET    /api/networks/me/networks  - Get user's own networks
POST   /api/networks              - Create network (auth required)
PUT    /api/networks/:id          - Update network (auth required)
DELETE /api/networks/:id          - Delete network (auth required)
POST   /api/networks/:id/like     - Like network (auth required)
DELETE /api/networks/:id/like     - Unlike network (auth required)
```

**Query Parameters for GET /api/networks:**
- `page` (default: 1)
- `limit` (default: 20, max: 100)
- `sort` (recent | popular | liked)
- `tags` (comma-separated)
- `q` (search query)

### Users

```
GET  /api/users/leaderboard       - Get leaderboard
GET  /api/users/:id               - Get user profile
GET  /api/users/:id/achievements  - Get user achievements
GET  /api/users/me/profile        - Get current user profile (auth required)
PUT  /api/users/me/profile        - Update profile (auth required)
GET  /api/users/me/activity       - Get activity log (auth required)
POST /api/users/me/stats          - Update XP/stats (auth required)
```

## 🔐 Authentication

The API uses Supabase Auth. To authenticate:

1. **Sign up/Sign in** via Supabase Auth on the frontend
2. Get the **JWT token** from Supabase
3. Include in requests:

```bash
Authorization: Bearer <your-jwt-token>
```

### Example with curl:

```bash
# Get public networks (no auth)
curl http://localhost:3001/api/networks

# Create network (with auth)
curl -X POST http://localhost:3001/api/networks \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Neural Network",
    "description": "A test network",
    "vocabulary": ["cat", "dog", "bird"],
    "weights": [[0, 0.5, 0.3], [0.5, 0, 0.2], [0.3, 0.2, 0]],
    "learning_rate": 0.1,
    "learning_rule": "hebbian",
    "is_public": true,
    "tags": ["demo", "animals"]
  }'
```

## 🗄️ Database Schema

The database includes these main tables:

- **profiles** - User profiles with stats
- **networks** - User-created neural networks
- **achievements** - Achievement definitions
- **user_achievements** - User progress on achievements
- **network_likes** - Like relationships
- **network_comments** - Comments on networks
- **leaderboard** - User rankings
- **activity_log** - User activity tracking

All tables use **Row Level Security (RLS)** for data protection.

## 🔒 Security Features

### Rate Limiting

- **API routes**: 100 requests per 15 minutes
- **Auth endpoints**: 5 attempts per 15 minutes
- **Network creation**: 10 per hour
- **Interactions**: 30 per minute

### Row Level Security (RLS)

Supabase RLS policies ensure:
- Users can only modify their own data
- Public networks are visible to all
- Private networks are only visible to owners
- Activity logs are private

### Input Validation

All inputs are validated using `express-validator`:
- Network names: 3-50 characters
- Descriptions: max 300 characters
- Vocabulary: 2-50 words
- Tags: max 5 tags
- etc.

## 🧪 Testing

Test the API with the health check:

```bash
curl http://localhost:3001/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-09-04T...",
  "uptime": 123.456
}
```

## 📊 Monitoring

### Logs

Development logs are printed to console. In production, consider:
- **Sentry** for error tracking
- **Winston** or **Pino** for structured logging
- **Morgan** for HTTP request logging

### Performance

Monitor these metrics:
- Response times
- Database query performance
- Rate limit hits
- Error rates

## 🚢 Deployment

### Option 1: Railway

1. Push code to GitHub
2. Create Railway project
3. Connect GitHub repo
4. Add environment variables
5. Deploy!

### Option 2: Render

1. Create new Web Service
2. Connect GitHub repo
3. Build: `npm install`
4. Start: `npm run server:prod`
5. Add environment variables

### Option 3: Fly.io

```bash
fly launch
fly secrets set SUPABASE_URL=... SUPABASE_ANON_KEY=...
fly deploy
```

### CORS Configuration

Update `FRONTEND_URL` in production to match your deployed frontend:

```env
FRONTEND_URL=https://synapti-city.vercel.app
```

## 🔧 Troubleshooting

### "Missing Supabase environment variables"

- Ensure `.env` file exists in project root
- Check that variables are set correctly
- Restart server after changing `.env`

### "Authentication failed"

- Check JWT token is valid
- Ensure token is sent in `Authorization: Bearer <token>` header
- Verify Supabase project is active

### "Rate limit exceeded"

- Wait for the rate limit window to reset
- Adjust limits in `.env` if needed for development

### Database connection issues

- Verify Supabase project is running
- Check database schema is created
- Ensure connection pooling is configured

## 📖 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Express.js Guide](https://expressjs.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🤝 Contributing

See the main [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

## 📝 License

MIT - See [LICENSE](../LICENSE) for details.
