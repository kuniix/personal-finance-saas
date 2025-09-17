const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const reportController = require('../controllers/reportController');

// @route   GET /api/reports/category
// @desc    Get financial summary by category
// @access  Private
router.get('/category', auth, reportController.getCategoryReport);

// @route   GET /api/reports/time-period
// @desc    Get financial summary by time period
// @access  Private
router.get('/time-period', auth, reportController.getTimePeriodReport);

module.exports = router;
