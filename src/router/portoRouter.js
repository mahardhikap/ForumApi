const {addPorto, getAllPorto, getPortoId, editPorto, deletePorto} = require('../controller/portoController')
const {protect} = require('../middleware/jwt')
const upload = require('../middleware/multer')

const app = require('express');
const router = app.Router()

router.post('/addporto', protect, upload.single('photo'), addPorto)
router.get('/portfolio', getAllPorto)
router.get('/portfolio/:id', getPortoId)
router.put('/editporto/:id', protect, upload.single('photo'), editPorto )
router.delete('/deleteporto/:id', protect, deletePorto )

module.exports = router