// board 서버 프로그램 생성.
const express = require("express");
const mysql = require("./sql/index");
const cors = require("cors");

const app = express();
const port = 3000;

//정적디렉토리 설정.
app.use(cors());
app.use(express.static("public"));

// middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/boards", async (req, res) => {
  let result = await mysql.queryExecute("select * from tb1_board", []);
  res.send(result);
});

app.post("/board", async (req, res) => {
  console.log("클라이언트 요청 데이터:", req.body.param); // 전송된 데이터 확인
  const param = req.body.param;

  try {
    let result = await mysql.queryExecute("insert into tb1_board set ?", [
      param,
    ]);
    res.status(201).send(result);
  } catch (error) {
    // 🚨 이 부분이 서버 콘솔에 MySQL 오류를 출력합니다.
    console.error("데이터베이스 삽입 오류 상세:", error);
    res
      .status(500)
      .send({ message: "DB 오류", error: error.sqlMessage || error.message });
  }
});

app.get("/board/:id", async (req, res) => {
  const id = req.params.id;
  let result = await mysql.queryExecute(
    "select * from tb1_board where id = ?",
    [id]
  );
  res.send(result);
});

// app.put("/board", async (req, res) => {
//   // const id = req.body.id;
//   const param = req.body.param;
//   let result = await mysql.queryExecute(`update tb1_board set ? where id = ?`, [
//     param,
//   ]);
//   res.send(result);
// });
app.put("/board", async (req, res) => {
  const param = req.body.param;
  const { id, ...updateData } = param;

  if (!id) return res.status(400).send({ message: "ID가 누락되었습니다." });

  const setClauses = Object.keys(updateData)
    .map((col) => `${col} = ?`)
    .join(", ");
  const values = Object.values(updateData);
  const sql = `UPDATE tb1_board SET ${setClauses} WHERE id = ?`;

  try {
    const result = await mysql.queryExecute(sql, [...values, id]);
    res.send(result);
  } catch (error) {
    console.error("게시글 수정 중 DB 오류:", error.message);
    res.status(500).send({ message: "서버 오류", detail: error.message });
  }
});

app.delete("/board/:id", async (req, res) => {
  const id = req.params.id;
  let result = await mysql.queryExecute(`delete from tb1_board where id = ?`, [
    id,
  ]);
  res.send(result);
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
