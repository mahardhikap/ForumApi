const {addArticle, getArticle ,getPostId, searchSortPost, editPost, sortPostUser, deletePost} = require('../controller/postController')
const {protect} = require('../middleware/jwt')
const upload = require('../middleware/multer')

const app = require('express');
const router = app.Router()

router.post('/addpost', protect, upload.single('pic'), addArticle)
router.get('/allpost', getArticle)
router.get('/post/:id', getPostId)
router.get('/sort', searchSortPost)
router.put('/updatepost/:id', protect, upload.single('pic'), editPost)
router.get('/userpost', protect, sortPostUser)
router.delete('/deletepost/:id', protect, deletePost)

module.exports = router