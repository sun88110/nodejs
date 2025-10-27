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

// 모든 쿼리를 실행하는 중앙 함수
const queryExecute = async (sql, params = []) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    const [rows] = await conn.query(sql, params);
    return rows;
  } catch (error) {
    console.error("MySQL query execution error:", error.message);
    throw error; // 에러를 호출자(app.js)에게 다시 던집니다.
  } finally {
    if (conn) conn.release(); // 연결 해제
  }
};

module.exports = { queryExecute };
