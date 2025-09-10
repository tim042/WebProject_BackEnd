const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const { authenticate} = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');



// Property routes
router.post('/', authenticate, authorize(['admin', 'host']), propertyController.createProperty);
router.get('/', propertyController.getProperties);
router.get('/:id', propertyController.getPropertyById);
router.put('/:id', authenticate, authorize(['admin', 'host']),  propertyController.updateProperty);
router.delete('/:id', authenticate, authorize(['admin', 'host']), propertyController.deleteProperty);
router.patch('/:id', authenticate, authorize(['admin', 'host']), propertyController.updatePropertyPath);


module.exports = router;