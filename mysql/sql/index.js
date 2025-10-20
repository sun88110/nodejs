const mysql = require("mysql2/promise");

// mysql connection setup
const dbConfig = {
  host: "localhost", //ip 넣어도됨
  user: "dev01",
  password: "dev01",
  database: "dev",
  port: 3306,
  connectionLimit: 10,
};

// create the connection pool
const pool = mysql.createPool(dbConfig);

//mail 발송 함수
function myMailingFunc(to, subject, html) {
  const data = {
    from: "leadon@daum.net",
    to: to,
    subject: subject,
    html: html,
  };
  return new Promise((resolve, reject) => {
    transporter.sendMail(data, (err, info) => {
      if (err) {
        console.log(err);
        resizeBy.status(500).send({ error: err.message });
      } else {
        console.log(info);
        resizeBy.send("Email sent successfully");
        resolve(info);
      }
    });
  });
}

// 쿼리처리함수.
async function queryExecute(sql, params) {
  let connection;
  return new Promise(async (resolve, reject) => {
    try {
      let conn = await pool.getConnection();
      connection = conn;
      const [rows, fields] = await connection.query(sql, params);
      resolve(rows);
    } catch (err) {
      reject(err);
    } finally {
      if (connection) connection.release();
    }
  });
}

module.exports = { queryExecute };
