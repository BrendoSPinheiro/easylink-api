const { Router } = require('express');

const SessionController = require('./app/controllers/SessionController');
const UserController = require('./app/controllers/UserController');
const CategoryController = require('./app/controllers/CategoryController');
const LinkController = require('./app/controllers/LinkController');

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
router.delete('/categories/:id', CategoryController.delete);

router.get('/links', LinkController.index);
router.get('/links/:id', LinkController.show);
router.post('/links', LinkController.store);
router.put('/links/:id', LinkController.update);
router.delete('/links/:id', LinkController.delete);

module.exports = router;
