const {addBiodata, getBio} = require('../controller/biodataController')
const {protect} = require('../middleware/jwt')
const upload = require('../middleware/multer')

const app = require('express');
const router = app.Router()

router.post('/addbiodata', protect, upload.single('photo'), addBiodata)
router.get('/biodata', getBio )

module.exports = router