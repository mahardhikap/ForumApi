const pool = require('../config/db');

const postArticle = async (data) => {
  return new Promise((resolve, reject) => {
    console.log('Model: add article', data);
    const { title, article, post_pass, pic, pic_id, reg_id } = data;
    pool.query(
      `INSERT INTO post (title, article, post_pass, pic, pic_id, reg_id) VALUES ('${title}', '${article}', '${post_pass}', '${pic}', '${pic_id}', ${reg_id}) RETURNING *`,
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

const getPostAll = async () => {
  return new Promise((resolve, reject) => {
    console.log('Model: get post all');
    pool.query(
      `SELECT post.id, post.title, post.article, post.pic, post.reg_id, post.pic_id, post.created_at, reg.username, reg.photo FROM post LEFT JOIN reg ON reg.id = post.reg_id`,
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

const getPostById = async (id) => {
    return new Promise((resolve, reject) => {
      console.log('Model: get post by id', id);
      pool.query(
        `SELECT post.id, post.title, post.article, post.post_pass, post.pic, post.reg_id, post.pic_id, post.created_at, reg.username, reg.photo FROM post LEFT JOIN reg ON reg.id = post.reg_id WHERE post.id = ${id}`,
        (err, results) => {
          if (!err) {
            resolve(results);
          } else {
            reject(err);
          }
        }
      );
    });
  }

  const getSearchSortPost = async (data) => {
    return new Promise((resolve, reject) => {
      console.log('Model: search and sort post', data);
      const { searchby, search, sortby, sort, offset, limit } = data;
      pool.query(
        `SELECT post.id, post.title, post.article, post.pic, post.reg_id, post.pic_id, post.created_at, reg.username, reg.photo FROM post LEFT JOIN reg ON reg.id = post.reg_id WHERE ${searchby} ILIKE '%${search}%' ORDER BY ${sortby} ${sort} OFFSET ${offset} LIMIT ${limit}`,
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

  const getPostCount = async (data) => {
    return new Promise((resolve, reject) => {
      console.log('Model: count search and sort post', data);
      const { searchby, search } = data;
      pool.query(
        `SELECT COUNT(*) FROM post JOIN reg ON post.reg_id = reg.id WHERE ${searchby} ILIKE '%${search}%'`,
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

  const getPostByUser = async (reg_id) => {
    return new Promise((resolve, reject) => {
      console.log('Model: get post by user id', reg_id);
      pool.query(
        `SELECT * FROM post WHERE reg_id = ${reg_id}`,
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
  
  const putPostById = async (post) => {
    return new Promise((resolve, reject) => {
      console.log('Model: edit post', post);
      const { title, article, post_pass, pic, pic_id, id } = post;
      pool.query(
        `UPDATE post SET title = '${title}', article = '${article}', post_pass = '${post_pass}', pic = '${pic}', pic_id = '${pic_id}' WHERE id = ${id} RETURNING *`,
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

  const getSortPostByUser = async (data) => {
    return new Promise((resolve, reject) => {
      console.log('Model: search and sort post by user', data);
      const { sortby, sort, offset, limit, reg_id } = data;
      pool.query(
        `SELECT post.id, post.title, post.article, post.pic, post.reg_id, post.pic_id, post.created_at, post.post_pass, reg.username, reg.photo FROM post LEFT JOIN reg ON reg.id = post.reg_id WHERE post.reg_id = ${reg_id} ORDER BY ${sortby} ${sort} OFFSET ${offset} LIMIT ${limit}`,
        (err, results) => {
          if (!err) {
            resolve(results);
          } else {
            reject(err);
          }
        }
      );
    });
  }

  const delPostById = async (id) => {
    return new Promise((resolve, reject) => {
      console.log('Model: delete post by id');
      pool.query(
        `DELETE FROM post WHERE id = ${id} RETURNING *`,
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
  postArticle,
  getPostAll,
  getPostById,
  getSearchSortPost,
  getPostCount,
  getPostByUser,
  putPostById,
  getSortPostByUser,
  delPostById
};
