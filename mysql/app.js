const express = require("express");
const mysql = require("./sql/index");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

// express app setup
const app = express();
const port = 3000;

//정적디렉토리 설정.
app.use(express.static("public"));

const transporter = nodemailer.createTransport({
  host: "smtp.daum.net",
  port: 465,
  secure: true,
  auth: {
    user: "sun.88110",
    pass: "rtibywiyhtwpwfgn",
  },
});

// middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// app.get("/sendmail", async (req, res) => {
//   console.log("req.body");
//   const { userid, phone } = req.query;
//   let result = await mysql.queryExecute(
//     "select * from customers where name=? and phone=?",
//     [userid, phone]
//   );

//   console.log(result);

//   if (result.length === 0) {
//     return res.send("No matching user found");
//   }
//   // to, subject, html
//   const to = result[0].email;
//   const subject = "Your Requested Information";
//   const html = `<h3>Your New Password is 12345</h3>`;

//   result = await mailer.myMailingFunc(to, subject, html);
//   res.send(result);
// });

//이메일 전송
app.get("/sendmail", async (req, res) => {
  console.log(req.query);
  const { userid, phone } = req.query;
  let result = await mysql.queryExecute(
    "select * from customers where name=? and phone=?",
    [userid, phone]
  );
  console.log(result);
  if (result.length === 0) {
    return res.send("No matching user found");
  }
  const data = {
    from: "sun.88110@daum.net",
    to: result[0].email,
    subject: "Test Email from Node.js",
    text: "<p>This is a test email sent from a <b>Node.js</b> application using Nodemailer.</p>",
    html: `<p>New password is <b>12345</b> for ${result[0].name}.</p>`,
  };

  transporter.sendMail(data, (err, info) => {
    if (err) {
      console.log(err);
      res.status(500).send({ error: err.message });
    } else {
      console.log(info);
      res.send("Email sent successfull");
    }
  });
});

//회원가입
app.post("/signup", async (req, res) => {
  try {
    const { userid, password, email, phone } = req.body;
    const name = userid;

    const promise = new Promise((resolve, reject) => {
      let salt = crypto.randomBytes(64).toString("base64");

      crypto.pbkdf2(password, salt, 100000, 64, "sha512", (err, key) => {
        if (err) {
          return reject(err);
        }
        console.log(key.toString("base64"));
        // 키 이름을 명확하게 Password로 변경하여 사용합니다.
        resolve({ salt: salt, password: key.toString("base64") });
      });
    });

    let cryptoData = await promise;

    // 5. DB 삽입을 위한 param 객체 완성 (🚨 이 부분을 수정해야 합니다)
    const param = {
      name: name,
      email: email, // 추가된 부분
      phone: phone, // 추가된 부분 // ⬇️ DB 컬럼 이름에 맞게 키 이름을 수정
      password_hash: cryptoData.password,
      password_salt: cryptoData.salt,
      // address 컬럼이 NULL 허용이므로, 주소를 입력받지 않았다면 생략해도 됨.
    };

    // 6. DB 저장 및 응답 로직
    let result = await mysql.queryExecute(`insert into customers set ?`, param);
    res.send({ message: "회원가입 성공", result: result });
  } catch (error) {
    console.error("회원가입 처리 오류:", error);
    res
      .status(500)
      .send({ error: "회원가입 처리 중 서버 오류가 발생했습니다." });
  }
});

// 로그인 라우트 구현
app.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    let userResult = await mysql.queryExecute(
      "SELECT * FROM customers WHERE email = ?",
      [email]
    );

    if (userResult.length === 0) {
      return res
        .status(401)
        .send({ message: "로그인 실패: 이메일(ID)을 찾을 수 없습니다." });
    }

    const user = userResult[0];
    const salt = user.password_salt; // DB에 저장된 Salt 값

    //사용자 입력 비밀번호를 DB에 저장된 Salt를 이용해 다시 해싱합니다.
    const { hashedPassword } = await new Promise((resolve, reject) => {
      crypto.pbkdf2(password, salt, 100000, 64, "sha512", (err, key) => {
        if (err) return reject(err);
        resolve({ hashedPassword: key.toString("base64") });
      });
    });

    //새로 해싱된 비밀번호와 DB의 해시 값을 비교합니다.
    if (hashedPassword === user.password_hash) {
      res.send({
        message: "로그인 성공",
        user: { id: user.id, name: user.name, email: user.email },
      });
    } else {
      //비밀번호 불일치 처리
      res
        .status(401)
        .send({ message: "로그인 실패: 비밀번호가 일치하지 않습니다." });
    }
  } catch (error) {
    console.error("로그인 처리 오류:", error);
    res.status(500).send({ error: "로그인 처리 중 서버 오류가 발생했습니다." });
  }
});

// customers table - select all
app.get("/customers", async (req, res) => {
  let result = await mysql.queryExecute("select * from customers", []);
  res.send(result);
});
//검색
app.get("/customer/:id", async (req, res) => {
  const id = req.params.id;
  let result = await mysql.queryExecute("select * from customers", [id]);
  res.send(result);
});
//추가
app.post("/customer", async (req, res) => {
  const param = req.body.param;
  let result = await mysql.queryExecute(`insert into customers set ?`, param);
  res.send(result);
});
//삭제
app.delete("/customer/:id", async (req, res) => {
  const id = req.params.id;
  let result = await mysql.queryExecute(`delete from customers where id = ?`, [
    id,
  ]);
  res.send(result);
});
//수정
app.put("/customer", async (req, res) => {
  const param = req.body.param;
  console.log(param);
  let result = await mysql.queryExecute(
    `update customers set ? where id = ?`,
    param
  );
  res.send(result);
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
