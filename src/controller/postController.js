const {
  postArticle,
  getPostAll,
  getPostById,
  getSearchSortPost,
  getPostCount,
  getPostByUser,
  putPostById,
  getSortPostByUser,
  delPostById,
} = require('../model/postModel');
const cloudinary = require('../config/cloudinary');
const {hashPassword} = require('../middleware/bcrypt')

const postController = {
    addArticle: async (req, res) => {
        try {
            const {title, article, post_pass} = req.body
            const reg_id = req.payload.id
            if(!reg_id){
              return res.status(404).json({status:404, message:'ID Token invalid or missing! Not match any user in database.'})
            }

            let post = {
              title: title,
              article: article,
              reg_id
            }

            if (post_pass) {
              post.post_pass = await hashPassword(post_pass);
            }

            if (req.file) {
              const result_up = await cloudinary.uploader.upload(req.file.path, {
                folder: 'blog',
              });
              post.pic = result_up.secure_url;
              post.pic_id = result_up.public_id;
            } else {
              post.pic = 'https://i.ibb.co/M2JSRmW/noimage.png';
              post.pic_id = 'no_image';
            }

            const result = await postArticle(post);
            if (result.rows[0]) {
              return res.status(200).json({
                status: 200,
                message: 'Post article success!',
                data: result.rows[0],
              });
            }
        } catch (error) {
          console.error('Post article error', error.message);
          return res
            .status(500)
            .json({ status: 500, message: 'Post article failed!' });
        }
    },
    getArticle: async (req, res) => {
      try {
        const result = await getPostAll();
        if (result.rowCount > 0) {
          return res.status(200).json({
            status: 200,
            message: 'Get post success!',
            data: result.rows,
          });
        } else {
          return res
            .status(404)
            .json({ status: 404, message: 'Post not found!' });
        }
      } catch (error) {
        console.error('Error when get post all', error.message);
        return res.status(500).json({ status: 500, message: 'Get post failed!' });
      }
    },
    getPostId: async (req, res) => {
      try {
        const { id } = req.params;
        const result = await getPostById(id);
        // console.log('cek hasil RESULT')
        // return console.log(result)

        if (result.rows[0]) {
          return res.status(200).json({
            status: 200,
            message: 'Get post by id success!',
            data: result.rows[0],
          });
        } else {
          return res
            .status(404)
            .json({ status: 404, message: 'Post not found!' });
        }
      } catch (error) {
        console.error('Error when get post by id', error.message);
        return res
          .status(500)
          .json({ status: 500, message: 'Get post by id failed!' });
      }
    },
    searchSortPost: async (req, res) => {
      try {
        const { searchby, search, sortby, sort, limit } = req.query;
        let page = parseInt(req.query.page) || 1;
        let limiter = parseInt(limit) || 5;
  
        const post = {
          sortby: sortby || 'created_at',
          sort: sort || 'ASC',
          limit: parseInt(limit) || 5,
          offset: (page - 1) * limiter,
          searchby: searchby || 'title',
          search: search,
        };
        const result = await getSearchSortPost(post);
        const resultCount = await getPostCount(post)
        // return console.log('ini result total',resultCount)
        let pagination = {
          totalPage: Math.ceil(resultCount.rows[0].count / limiter),
          totalData: parseInt(result.rowCount),
          pageNow: page,
        };
  
        if (result.rows.length > 0) {
          return res.status(200).json({
            status: 200,
            message: 'Get post success!',
            data: { rows: result.rows, pages: pagination },
          });
        } else {
          return res
            .status(404)
            .json({ status: 404, message: 'Post not found!' });
        }
      } catch (error) {
        console.error('Error when get post sort & search', error.message);
        return res.status(500).json({ status: 500, message: 'Get post failed!' });
      }
    },
    editPost: async (req, res) => {
      try {
        const { id } = req.params;
        const { title, article, post_pass } = req.body;
  
        const data = await getPostById(id);
        if (data.rowCount === 0) {
          return res
            .status(404)
            .json({ status: 404, message: 'Post not found!' });
        }
        let result_up = null;
  
        if (req.file) {
          result_up = await cloudinary.uploader.upload(req.file.path, {
            folder: 'blog',
          });
          await cloudinary.uploader.destroy(data.rows[0].pic_id);
        }
  
        let post = {
          id: id,
          title: title || data.rows[0].title,
          article: article || data.rows[0].article,
          // post_pass: post_pass || data.rows[0].post_pass
        };

        if (post_pass) {
          post.post_pass = await hashPassword(post_pass);
        } else {
          post.post_pass = undefined;
        }
  
        if (result_up) {
          // Jika gambar baru diupload, update properti photo
          post.pic = result_up.secure_url;
          post.pic_id = result_up.public_id;
        } else {
          post.pic = data.rows[0].pic;
          post.pic_id = data.rows[0].pic_id;
        }
  
        let reg_id = req.payload.id;
  
        if (reg_id !== data.rows[0].reg_id) {
          return res
            .status(404)
            .json({ status: 404, message: 'This is not your post!' });
        }
  
        const result = await putPostById(post);
        if (result.rows[0]) {
          return res
            .status(200)
            .json({
              status: 200,
              message: 'Edit post success!',
              data: result.rows[0],
            });
        }
      } catch (error) {
        console.error('Error when update post', error.message);
        return res
          .status(500)
          .json({ status: 500, message: 'Update post failed!' });
      }
    },
    sortPostUser: async (req, res) => {
      try {
        const { sortby, sort, limit } = req.query;
        const reg_id = req.payload.id;
        let page = parseInt(req.query.page) || 1;
        let limiter = limit || 5;
  
        const post = {
          sortby: sortby || 'created_at',
          sort: sort || 'ASC',
          limit: limit || 5,
          offset: (page - 1) * limiter,
          reg_id: reg_id,
        };
        const resultTotal = await getPostByUser(reg_id);
        const result = await getSortPostByUser(post);
  
        let pagination = {
          totalPage: Math.ceil(resultTotal.rowCount / limiter),
          totalData: parseInt(result.rowCount),
          pageNow: page,
        };
  
        if (result.rows.length > 0) {
          return res.status(200).json({
            status: 200,
            message: 'Get post success!',
            data: { rows: result.rows, pages: pagination },
          });
        } else {
          return res
            .status(404)
            .json({ status: 404, message: 'Post not found!' });
        }
      } catch (error) {
        console.error('Error when get post sort by user', error.message);
        return res.status(500).json({ status: 500, message: 'Get post failed!' });
      }
    },
    deletePost: async (req, res) => {
      try {
        const { id } = req.params;
        const data = await getPostById(id);
        if (data) {
          await cloudinary.uploader.destroy(data.rows[0].pic_id);
        }
  
        if (data.rows[0].reg_id !== req.payload.id) {
          return res
            .status(404)
            .json({ status: 404, message: 'This is not your post!' });
        }
  
        const result = await delPostById(id);
        if (result.rows[0]) {
          return res.status(200).json({
            status: 200,
            message: 'Delete post success!',
            data: result.rows[0],
          });
        } else {
          return res
            .status(404)
            .json({ status: 404, message: 'Post not found!' });
        }
      } catch (error) {
        console.error('Error when delete post', error.message);
        return res
          .status(500)
          .json({ status: 500, message: 'Delete post failed!' });
      }
    }
}

module.exports = postController