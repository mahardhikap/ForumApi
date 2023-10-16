const {register, login, getUserId, getUserByPayload, allUser, editUser, verify, sendForget, forgetPass, deleteUser} = require('../controller/userController')
const {protect} = require('../middleware/jwt')
const upload = require('../middleware/multer')

const app = require('express');
const router = app.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/user/:id', getUserId)
router.get('/user',protect, getUserByPayload)
router.get('/member', allUser)
router.put('/updateprofile',protect, upload.single('photo'), editUser)
router.get('/activate/:id', verify)
router.post('/otp/:email', sendForget)
router.put('/changepassword', forgetPass)
router.delete('/userdelete', protect, deleteUser)

module.exports = router