var express = require('express');
var router = express.Router();
const perangkat_controller = require('../controllers/perangkat.controller');

router.post('/create',perangkat_controller.createPasien);
/*
router.post('/create',passport.authenticate('jwt', { session: false}), sapi_controller.create);
router.delete('/:id/delete',passport.authenticate('jwt', { session: false}), sapi_controller.sapi_delete);
router.put('/:id/update',passport.authenticate('jwt', { session: false}),sapi_controller.sapi_update);
router.get('/showsapi',passport.authenticate('jwt', { session: false}),sapi_controller.sapi_show_by_farmer);
router.get('/:id/sapidetail',passport.authenticate('jwt', { session: false}),sapi_controller.sapi_detail);
router.put('/:id/updatedata',sapi_controller.data_update);
router.post('/data-today',passport.authenticate('jwt', { session: false}), sapi_controller.getDataToday);
router.post('/data-in-time',passport.authenticate('jwt', { session: false}), sapi_controller.getDataInTime);
router.get('/sapi-show-all',passport.authenticate('jwt', { session: false}), sapi_controller.sapi_show_all);
router.get('/requested-sapi',passport.authenticate('jwt', { session: false}), sapi_controller.get_requested_sapi);
module.exports = router;
*/