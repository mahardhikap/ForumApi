const {
  postBiodata,
  getBiodata,
  putBiodata,
} = require('../model/biodataModel');
const cloudinary = require('../config/cloudinary');

const {getPorto} = require('../model/portoModel')

const biodataController = {
  addBiodata: async (req, res) => {
    try {
      const { fullname, about, twitter, facebook, instagram, linkedin, other } =
        req.body;
      const roles = req.payload.roles;

      if (roles !== 'admin') {
        return res.status(403).json({
          status: 403,
          message: 'You are not allowed to edit this field!',
        });
      }

      // Cek apakah sudah ada biodata
      const existingBiodata = await getBiodata();

      if (existingBiodata.rowCount !== 0) {
        // Jika biodata sudah ada, lakukan pengeditan
        const updatedBiodata = {
          id: existingBiodata.rows[0].id,
          fullname: fullname || existingBiodata.rows[0].fullname,
          about: about || existingBiodata.rows[0].about,
          twitter: twitter || existingBiodata.rows[0].twitter,
          facebook: facebook || existingBiodata.rows[0].facebook,
          instagram: instagram || existingBiodata.rows[0].instagram,
          linkedin: linkedin || existingBiodata.rows[0].linkedin,
          other: other || existingBiodata.rows[0].other,
        };

        let result_up = null;

        if (req.file) {
          result_up = await cloudinary.uploader.upload(req.file.path, {
            folder: 'blog',
          });
          await cloudinary.uploader.destroy(existingBiodata.rows[0].photo_id);
        }

        if (result_up) {
          // Jika gambar baru diupload, update properti photo
          updatedBiodata.photo = result_up.secure_url;
          updatedBiodata.photo_id = result_up.public_id;
        } else {
          updatedBiodata.photo = existingBiodata.rows[0].photo;
          updatedBiodata.photo_id = existingBiodata.rows[0].photo_id;
        }

        const result = await putBiodata(updatedBiodata);

        if (result.rows[0]) {
          return res.status(200).json({
            status: 200,
            message: 'Edit biodata success!',
            data: result.rows[0],
          });
        } else {
          return res.status(404).json({
            status: 404,
            message: 'Edit biodata failed!',
          });
        }
      } else {
        // Jika biodata belum ada, lakukan penambahan
        const newBiodata = {
          fullname,
          about,
          twitter,
          facebook,
          instagram,
          linkedin,
          other,
        };

        if (req.file) {
          const result_up = await cloudinary.uploader.upload(req.file.path, {
            folder: 'blog',
          });
          newBiodata.photo = result_up.secure_url;
          newBiodata.photo_id = result_up.public_id;
        } else {
          newBiodata.photo =
            'https://res.cloudinary.com/dxao06apr/image/upload/v1701688202/file-upload/noimage_o1wkux.png';
          newBiodata.photo_id = 'no_image';
        }

        const result = await postBiodata(newBiodata);

        if (result.rows[0]) {
          return res.status(200).json({
            status: 200,
            message: 'Post biodata success!',
            data: result.rows[0],
          });
        }
      }
    } catch (error) {
      console.error('Post biodata error', error.message);
      return res
        .status(500)
        .json({ status: 500, message: 'Post biodata failed!' });
    }
  },
  getBio: async (req, res) => {
    try {
      const result = await getBiodata();
      if (result.rowCount > 0) {
        const myporto = await getPorto()
        return res.status(200).json({
          status: 200,
          message: 'Get biodata success!',
          data: {biodata:result.rows[0], portfolio:myporto.rows}
        });
      } else {
        return res
          .status(404)
          .json({ status: 404, message: 'Biodata not found!' });
      }
    } catch (error) {
      console.error('Error when get biodata', error.message);
      return res
        .status(500)
        .json({ status: 500, message: 'Get biodata failed!' });
    }
  },
};

module.exports = biodataController;
