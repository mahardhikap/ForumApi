const pool = require('../config/db');

const postRegister = async (data) => {
  return new Promise((resolve, reject) => {
    console.log('Model: register', data);
    const { username, email, password, roles, photo, photo_id, validate } =
      data;
    pool.query(
      `INSERT INTO reg (username, email, password, roles, photo, photo_id, validate) VALUES ('${username}', '${email}', '${password}', '${roles}', '${photo}', '${photo_id}', '${validate}') RETURNING *`,
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

const checkEmail = async (email) => {
  return new Promise((resolve, reject) => {
    console.log('Model: check email', email);
    pool.query(`SELECT * FROM reg WHERE email = '${email}'`, (err, results) => {
      if (!err) {
        resolve(results);
      } else {
        reject(err);
      }
    });
  });
};

const getUserById = async (id) => {
  return new Promise((resolve, reject) => {
    console.log('Model: get user by id', id);
    pool.query(`SELECT * FROM reg WHERE id = ${id}`, (err, results) => {
      if (!err) {
        resolve(results);
      } else {
        reject(err);
      }
    });
  });
};

const getUserAll = async () => {
  return new Promise((resolve, reject) => {
    console.log('Model: get user all');
    pool.query(`SELECT * FROM reg`, (err, results) => {
      if (!err) {
        resolve(results);
      } else {
        reject(err);
      }
    });
  });
};

const putUserById = async (post) => {
  return new Promise((resolve, reject) => {
    console.log('Model: edit user', post);
    const { username, email, password, photo, photo_id, id } = post;
    pool.query(
      `UPDATE reg SET username = '${username}', email = '${email}', password = '${password}', photo = '${photo}', photo_id = '${photo_id}' WHERE id = ${id} RETURNING *`,
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

const delUserById = async (id) => {
  return new Promise((resolve, reject) => {
    console.log('Model: delete user');
    pool.query(
      `DELETE FROM reg WHERE id = ${id} RETURNING *`,
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

const activateUser = async (otp) => {
  return new Promise((resolve, reject) => {
    console.log('model activate user', otp);
    pool.query(
      `UPDATE reg SET is_active = true WHERE validate = '${otp}'`,
      (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(err);
        }
      }
    );
  });
};

const forgetPassword = async (post) => {
  return new Promise((resolve, reject) => {
    console.log('model forget password');
    const { password, email, new_validate, validate } = post;
    pool.query(
      `UPDATE reg SET password = '${password}',  validate = '${new_validate}' WHERE email = '${email}' AND validate = '${validate}' RETURNING *`,
      (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(err);
        }
      }
    );
  });
};

const changeOTP = async (new_otp, email) => {
  return new Promise((resolve, reject) => {
    console.log('model changeOTP', new_otp);
    pool.query(
      `UPDATE reg SET validate = '${new_otp}' WHERE email = '${email}' RETURNING *`,
      (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(err);
        }
      }
    );
  });
};

module.exports = {
  postRegister,
  checkEmail,
  getUserById,
  getUserAll,
  putUserById,
  delUserById,
  activateUser,
  forgetPassword,
  changeOTP
};
