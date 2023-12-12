const pool = require('../config/db');

// porto (
//     id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
//     title VARCHAR,
//     about TEXT,
//     photo VARCHAR,
//     photo_id VARCHAR
// );

const postPorto = async (data) => {
    return new Promise((resolve, reject) => {
      console.log('Model: add portfolio', data);
      const { title, about, photo, photo_id } = data;
      pool.query(
        `INSERT INTO porto (title, about, photo, photo_id) VALUES ('${title}', '${about}', '${photo}', '${photo_id}') RETURNING *`,
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

  const getPorto = async () => {
    return new Promise((resolve, reject) => {
      console.log('Model: get portfolio');
      pool.query(
        `SELECT * FROM porto`,
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
  const getPortoById = async (id) => {
    return new Promise((resolve, reject) => {
      console.log('Model: get portfolio by id', id);
      pool.query(
        `SELECT * FROM porto WHERE id = '${id}'`,
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

  const putPorto = async (data) => {
    return new Promise((resolve, reject) => {
      console.log('Model: edit portfolio', data);
      const { title, about, photo, photo_id, id } = data;
      pool.query(
        `UPDATE porto SET title = '${title}', about = '${about}', photo = '${photo}', photo_id = '${photo_id}' WHERE id = '${id}' RETURNING *`,
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

  const delPortoById = async (id) => {
    return new Promise((resolve, reject) => {
      console.log('Model: delete portfolio by id');
      pool.query(
        `DELETE FROM porto WHERE id = '${id}' RETURNING *`,
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
    postPorto,
    getPorto,
    getPortoById,
    putPorto,
    delPortoById
  }