require('dotenv').config();
const App = require('./infrastructure/web/app');
const dbConnection = require('./infrastructure/database/DatabaseConnection');

const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    console.log('Starting Book Scraper Server...');
    
    // Initialize the application
    const app = new App();
    await app.initialize();
    
    // Start the server
    const server = app.getApp().listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
      console.log(`API documentation: http://localhost:${PORT}/`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down gracefully');
      server.close(() => {
        console.log('Server closed');
        dbConnection.close();
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('SIGINT received, shutting down gracefully');
      server.close(() => {
        console.log('Server closed');
        dbConnection.close();
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer(); 