const { Router } = require('express');

const UserController = require('./app/controllers/UserController');

const router = Router();

router.post('/users', UserController.store);
router.put('/users/:id', UserController.update);

module.exports = router;
