const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');


router.use(authenticate);

// User management routes (Admin and Manager access)
router.get('/', authorize(['admin']), userController.getAllUsers);
router.get('/:id', authorize(['admin']), userController.getUserById);
router.put('/:id', authorize(['admin']), userController.updateUser);
router.delete('/:id', authorize(['admin']), userController.deleteUser);

module.exports = router;