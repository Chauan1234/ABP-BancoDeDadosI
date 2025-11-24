const express = require('express');
const router = express.Router();
const controller = require('../controllers/materiasPrimasController');

router.get('/', controller.getAll);
router.get('/:codigo', controller.getByCodigo);
router.post('/', controller.create);
router.put('/:codigo', controller.update);
router.delete('/:codigo', controller.remove);

module.exports = router;
