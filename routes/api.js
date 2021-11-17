/**ROUTE USER APIs. */
var express = require('express')

var router = express.Router()
var users = require('./api/user.route')
var child = require('./api/child.route')

router.use('/users', users);
router.use('/children', child);

module.exports = router;
