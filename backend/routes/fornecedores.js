const express = require('express');
const router = express.Router();
const controller = require('../controllers/fornecedoresController');

router.get('/', controller.getAll);
router.get('/:cnpj', controller.getByCnpj);
router.post('/', controller.create);
router.put('/:cnpj', controller.update);
router.delete('/:cnpj', controller.remove);

module.exports = router;
