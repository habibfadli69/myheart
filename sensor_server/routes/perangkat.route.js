var passport = require('passport');
require('../config/passport')(passport);
var jwt = require('jsonwebtoken');
var express = require('express');
var router = express.Router();
const perangkat_controller = require('../controllers/perangkat.controller');

// router.post('/create',passport.authenticate('jwt', { session: false}), sapi_controller.create);
// router.delete('/:id/delete',passport.authenticate('jwt', { session: false}), sapi_controller.sapi_delete);
router.put('/:id/update',perangkat_controller.data_update);
// router.get('/showsapi',passport.authenticate('jwt', { session: false}),sapi_controller.sapi_show_by_farmer);
router.get('/:id/detail',passport.authenticate('jwt', { session: false}),perangkat_controller.perangkat_detail);

module.exports = router;
