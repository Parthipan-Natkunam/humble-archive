const express = require('express');
const ScrapingController = require('../../application/controllers/ScrapingController');
const GroupsController = require('../../application/controllers/GroupsController');

const router = express.Router();

// Initialize controllers
const scrapingController = new ScrapingController();
const groupsController = new GroupsController();

// Scrape data endpoint
router.post('/scrape-data', (req, res, next) => {
  scrapingController.scrapeData(req, res, next);
});

// Groups endpoints
router.get('/groups', (req, res, next) => {
  groupsController.getAllGroups(req, res, next);
});

router.get('/groups/:id/books', (req, res, next) => {
  groupsController.getGroupById(req, res, next);
});

module.exports = router; 