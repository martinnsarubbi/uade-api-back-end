var express = require('express')
var router = express.Router()
var ChildController = require('../../controllers/child.controller');

var Authorization = require('../../auth/authorization');

router.get('/test', function(req, res, next) {
    res.send('Llegaste a la ruta de  api/user.routes');
  });
router.post('/createChild', Authorization, ChildController.createChild)

module.exports = router;