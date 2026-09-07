import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import networkRoutes from './routes/networks';
import userRoutes from './routes/users';
import { apiLimiter } from './middleware/rateLimiter';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// ============================================================================
// MIDDLEWARE
// ============================================================================

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// CORS configuration
app.use(cors({
  origin: [FRONTEND_URL, 'https://synapti-city.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting (apply to all API routes)
app.use('/api', apiLimiter);

// Request logging (development only)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// ============================================================================
// ROUTES
// ============================================================================

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API routes
app.use('/api/networks', networkRoutes);
app.use('/api/users', userRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'synaptiCITY API',
    version: '1.0.0',
    description: 'Backend API for synaptiCITY neural network learning platform',
    endpoints: {
      health: '/health',
      networks: '/api/networks',
      users: '/api/users',
    },
    documentation: 'https://github.com/sorathiyalaksh37-lang/synaptiCITY',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`,
  });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global error handler:', err);
  
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ============================================================================
// START SERVER
// ============================================================================

app.listen(PORT, () => {
  console.log('🚀 synaptiCITY API Server');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 API endpoint: http://localhost:${PORT}/api`);
  console.log(`🎨 Frontend: ${FRONTEND_URL}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\nSIGINT received, shutting down gracefully...');
  process.exit(0);
});

export default app;
