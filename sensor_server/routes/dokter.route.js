var express = require('express');
var router = express.Router();
const dokter_controller = require('../controllers/dokter.controller');

// router.post('/create',passport.authenticate('jwt', { session: false}), sapi_controller.create);
// router.delete('/:id/delete',passport.authenticate('jwt', { session: false}), sapi_controller.sapi_delete);
// router.put('/:id/update',passport.authenticate('jwt', { session: false}),sapi_controller.sapi_update);
// router.get('/showsapi',passport.authenticate('jwt', { session: false}),sapi_controller.sapi_show_by_farmer);
// router.get('/:id/sapidetail',passport.authenticate('jwt', { session: false}),sapi_controller.sapi_detail);

router.post('/create-dokter', dokter_controller.createDokter);
router.post('/:id/add-pasien', dokter_controller.addPasien);
router.post('/:iddokter/:idpasien/update-pasien', dokter_controller.updatePasien);
router.delete('/:iddokter/:idpasien/delete-pasien', dokter_controller.deletePasien);
router.post('/:id/add-dokter', dokter_controller.addDokter);
router.put('/:id/update-data', dokter_controller.updateData);

router.get('/get-data', dokter_controller.getAllData);

// router.post('/data-today',passport.authenticate('jwt', { session: false}), sapi_controller.getDataToday);
// router.post('/data-in-time',passport.authenticate('jwt', { session: false}), sapi_controller.getDataInTime);
// router.get('/sapi-show-all',passport.authenticate('jwt', { session: false}), sapi_controller.sapi_show_all);
// router.get('/requested-sapi',passport.authenticate('jwt', { session: false}), sapi_controller.get_requested_sapi);
module.exports = router;
