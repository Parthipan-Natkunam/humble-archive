const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const routes = require('./routes');
const ErrorHandler = require('../../application/middleware/ErrorHandler');
const dbConnection = require('../database/DatabaseConnection');

class App {
  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  setupMiddleware() {
    // Security middleware
    this.app.use(helmet());

    // CORS configuration
    this.app.use(cors({
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      credentials: true
    }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: {
        success: false,
        error: 'Too many requests from this IP',
        code: 'RATE_LIMIT_EXCEEDED'
      }
    });
    this.app.use('/api/', limiter);

    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Request logging
    this.app.use((req, res, next) => {
      console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
      next();
    });
  }

  setupRoutes() {
    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.json({ status: 'OK', timestamp: new Date().toISOString() });
    });

    // API routes
    this.app.use('/api', routes);

    // Root endpoint
    this.app.get('/', (req, res) => {
      res.json({
        message: 'Book Scraper API',
        version: '1.0.0',
        endpoints: {
          'POST /api/scrape-data': 'Scrape books from a URL',
          'GET /api/groups': 'Get all book groups (paginated)',
          'GET /api/groups/:id/books': 'Get books in a specific group (paginated)'
        }
      });
    });
  }

  setupErrorHandling() {
    // 404 handler
    this.app.use(ErrorHandler.notFound);

    // Global error handler
    this.app.use(ErrorHandler.handle);
  }

  async initialize() {
    try {
      // Initialize database
      const db = dbConnection.getConnection();
      dbConnection.initDatabase();
      console.log('Database initialized successfully');

      return this.app;
    } catch (error) {
      console.error('Failed to initialize application:', error);
      throw error;
    }
  }

  getApp() {
    return this.app;
  }
}

module.exports = App; 