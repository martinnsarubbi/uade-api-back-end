var express = require('express')
var router = express.Router()
var RegistryController = require('../../controllers/registry.controller');

var Authorization = require('../../auth/authorization');

router.get('/test', function(req, res, next) {
    res.send('Llegaste a la ruta de  api/registry.routes');
  });
router.post('/createRegistry', Authorization, RegistryController.createRegistry)
//router.post('/childRegistries', Authorization, RegistryController.getChildRegistries)

module.exports = router;