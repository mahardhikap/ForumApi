const {
    postPorto,
    getPortoById,
    getPorto,
    putPorto,
    delPortoById
  } = require('../model/portoModel');
  const cloudinary = require('../config/cloudinary');

  const portoController = {
    addPorto: async (req, res) => {
        try {
            const { title, about, stack } = req.body
            const roles = req.payload.roles
            if(roles !== 'admin'){
              return res.status(403).json({status:403, message:'You are not allowed to edit this field!'})
            }

            let post = {
              title: title,
              about: about,
              stack: stack
            }

            if (req.file) {
              const result_up = await cloudinary.uploader.upload(req.file.path, {
                folder: 'blog',
              });
              post.photo = result_up.secure_url;
              post.photo_id = result_up.public_id;
            } else {
              post.photo = 'https://res.cloudinary.com/dxao06apr/image/upload/v1701688202/file-upload/noimage_o1wkux.png';
              post.photo_id = 'no_image';
            }

            const result = await postPorto(post);
            if (result.rows[0]) {
              return res.status(200).json({
                status: 200,
                message: 'Post portfolio success!',
                data: result.rows[0],
              });
            }
        } catch (error) {
          console.error('Post portfolio error', error.message);
          return res
            .status(500)
            .json({ status: 500, message: 'Post portfolio failed!' });
        }
    },
    getAllPorto: async (req, res) => {
      try {
        const result = await getPorto();
        if (result.rowCount > 0) {
          return res.status(200).json({
            status: 200,
            message: 'Get portfolio success!',
            data: result.rows
          });
        } else {
          return res
            .status(404)
            .json({ status: 404, message: 'Portfolio not found!' });
        }
      } catch (error) {
        console.error('Error when get portfolio', error.message);
        return res
          .status(500)
          .json({ status: 500, message: 'Get portfolio failed!' });
      }
    },
    getPortoId: async (req, res) => {
      try {
        const { id } = req.params;
        const result = await getPortoById(id);
        // console.log('cek hasil RESULT')
        // return console.log(result)

        if (result.rows[0]) {
          return res.status(200).json({
            status: 200,
            message: 'Get portfolio by id success!',
            data: result.rows[0],
          });
        } else {
          return res
            .status(404)
            .json({ status: 404, message: 'Portfolio not found!' });
        }
      } catch (error) {
        console.error('Error when get portfolio by id', error.message);
        return res
          .status(500)
          .json({ status: 500, message: 'Get portfolio by id failed!' });
      }
    },
    editPorto: async (req, res) => {
        try {
          const { id } = req.params;
          const { title, about, stack } = req.body;
    
          const data = await getPortoById(id);
          if (data.rowCount === 0) {
            return res
              .status(404)
              .json({ status: 404, message: 'Portfolio not found!' });
          }
          let result_up = null;
    
          if (req.file) {
            result_up = await cloudinary.uploader.upload(req.file.path, {
              folder: 'blog',
            });
            await cloudinary.uploader.destroy(data.rows[0].photo_id);
          }
    
          let post = {
            id: id,
            title: title || data.rows[0].title,
            about: about || data.rows[0].about,
            stack: stack || data.rows[0].stack
          };
    
          if (result_up) {
            // Jika gambar baru diupload, update properti photo
            post.photo = result_up.secure_url;
            post.photo_id = result_up.public_id;
          } else {
            post.photo = data.rows[0].photo;
            post.photo_id = data.rows[0].photo_id;
          }
    
          let roles = req.payload.roles;
    
          if (roles !== 'admin') {
            return res
              .status(403)
              .json({ status: 403, message: 'You are not allowed to edit this field!' });
          }
    
          const result = await putPorto(post);
          if (result.rows[0]) {
            return res
              .status(200)
              .json({
                status: 200,
                message: 'Edit portfolio success!',
                data: result.rows[0],
              });
          }
        } catch (error) {
          console.error('Error when update portfolio', error.message);
          return res
            .status(500)
            .json({ status: 500, message: 'Update portfolio failed!' });
        }
      },
      deletePorto: async (req, res) => {
        try {
          const { id } = req.params;
          const data = await getPortoById(id);
          if (data) {
            await cloudinary.uploader.destroy(data.rows[0].photo_id);
          }
          const roles = req.payload.roles
          if (roles !== 'admin') {
            return res
              .status(403)
              .json({ status: 403, message:  'You are not allowed to edit this field!' });
          }
    
          const result = await delPortoById(id);
          if (result.rows[0]) {
            return res.status(200).json({
              status: 200,
              message: 'Delete portfolio success!',
              data: result.rows[0],
            });
          } else {
            return res
              .status(404)
              .json({ status: 404, message: 'Portfolio not found!' });
          }
        } catch (error) {
          console.error('Error when delete portfolio', error.message);
          return res
            .status(500)
            .json({ status: 500, message: 'Delete portfolio failed!' });
        }
      }
  }

  module.exports = portoController