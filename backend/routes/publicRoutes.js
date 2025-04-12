const express = require('express');
const { getEvents } = require('../controllers/eventController');
const {checkTrustedOrigin} = require('../middleware/checkTrustedOrigin');
const router = express.Router();

router.get('/events', checkTrustedOrigin("GETS"), getEvents);

module.exports = router;