const { Router } = require('express');

const SessionController = require('./app/controllers/SessionController');
const UserController = require('./app/controllers/UserController');
const CategoryController = require('./app/controllers/CategoryController');

const authMiddleware = require('./app/middlewares/authMiddleware');

const router = Router();

router.post('/users', UserController.store);
router.put('/users/:id', authMiddleware, UserController.update);

router.post('/sessions', SessionController.authenticate);

router.use(authMiddleware);
router.get('/categories', CategoryController.index);
router.get('/categories/:id', CategoryController.show);
router.post('/categories', CategoryController.store);
router.put('/categories/:id', CategoryController.update);

module.exports = router;
