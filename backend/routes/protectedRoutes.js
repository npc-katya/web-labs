const express = require('express');
const passport = require('passport');

const {
    createEvent,
    getEventById,
    updateEvent,
    deleteEvent,
} = require('../controllers/eventController');

const {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
} = require('../controllers/userController');

const {checkTrustedOrigin} = require('../middleware/checkTrustedOrigin');


const router = express.Router();



// события
router.post('/events', passport.authenticate('jwt', { session: false }), checkTrustedOrigin("POST"), createEvent);
router.get('/events', passport.authenticate('jwt', { session: false }), checkTrustedOrigin("GET"), getEventById);
router.put('/events/:id', passport.authenticate('jwt', { session: false }), checkTrustedOrigin("PUT"), updateEvent);
router.delete('/events/:id', passport.authenticate('jwt', { session: false }), checkTrustedOrigin("DELETE"), deleteEvent);


// пользователи
router.post('/users', passport.authenticate('jwt', { session: false }), checkTrustedOrigin("POST"), createUser);
router.get('/users', passport.authenticate('jwt', { session: false }), checkTrustedOrigin("GETS"), getUsers);
router.get('/users', passport.authenticate('jwt', { session: false }), checkTrustedOrigin("GET"), getUserById);
router.put('/users/:id', passport.authenticate('jwt', { session: false }), checkTrustedOrigin("PUT"), updateUser);
router.delete('/users/:id', passport.authenticate('jwt', { session: false }), checkTrustedOrigin("DELETE"), deleteUser);

module.exports = router;