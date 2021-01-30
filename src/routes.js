const { Router } = require('express');

const SessionController = require('./app/controllers/SessionController');
const UserController = require('./app/controllers/UserController');

const authMiddleware = require('./app/middlewares/authMiddleware');

const router = Router();

router.post('/users', UserController.store);
router.put('/users/:id', authMiddleware, UserController.update);

router.post('/sessions', SessionController.authenticate);

module.exports = router;