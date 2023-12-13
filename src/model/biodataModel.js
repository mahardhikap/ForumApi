const pool = require('../config/db');

const postBiodata = async (data) => {
  return new Promise((resolve, reject) => {
    console.log('Model: add biodata', data);
    const { fullname, about, skill, photo, photo_id, twitter, facebook, instagram, linkedin, other } = data;
    pool.query(
      `INSERT INTO biodata (fullname, about, skill, photo, photo_id, twitter, facebook, instagram, linkedin, other) VALUES ('${fullname}', '${about}', '${skill}', '${photo}', '${photo_id}', '${twitter}', '${facebook}', '${instagram}', '${linkedin}', '${other}') RETURNING *`,
      (err, results) => {
        if (!err) {
          resolve(results);
        } else {
          reject(err);
        }
      }
    );
  });
};

const getBiodata = async () => {
    return new Promise((resolve, reject) => {
      console.log('Model: get biodata');
      pool.query(
        `SELECT * FROM biodata`,
        (err, results) => {
          if (!err) {
            resolve(results);
          } else {
            reject(err);
          }
        }
      );
    });
  };  

const putBiodata = async (data) => {
    return new Promise((resolve, reject) => {
      console.log('Model: edit biodata', data);
      const { fullname, about, skill, photo, photo_id, twitter, facebook, instagram, linkedin, other, id } = data;
      pool.query(
        `UPDATE biodata SET fullname = '${fullname}', about = '${about}', skill = '${skill}', photo = '${photo}', photo_id = '${photo_id}', twitter = '${twitter}', facebook = '${facebook}', instagram = '${instagram}', linkedin = '${linkedin}', other = '${other}' WHERE id = '${id}' RETURNING *`,
        (err, results) => {
          if (!err) {
            resolve(results);
          } else {
            reject(err);
          }
        }
      );
    });
  };

module.exports = {
    postBiodata,
    getBiodata,
    putBiodata
}