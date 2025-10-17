const express = require("express");
const fs = require("fs");
const path = require("path");
const cookieSession = require("cookie-session");
const multer = require("multer");

const customerRouter = require("./routes/customers");
const productRouter = require("./routes/products");
//const boardRouter = require("./routes/boards");

//서버인스턴스
const app = express();
// header / body-parser 대신 express 내장함수 사용
// parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false })); //user=1234&name=hong
// parsing application/js
app.use(express.json());
//정적디렉토리 설정
app.use(express.static("public"));

//쿠키세션 설정.
app.use(
  cookieSession({
    name: "session",
    keys: ["mySecretKey123"],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);

// 파일업로드 설정.
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "upload/images";
    if (!fs.existsSync(uploadDir)) {
      //폴더가없으면 자동생성합니다.
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, "uploads/");
  },
  // 업로드된 파일의 이름 설정.
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
// multer 객체 생성.
const upload = multer({ storage: storage });

// 라우팅 정보가 파일로 나눠서 작성.
// customers.js, products.js
app.use("/customers", customerRouter);
app.use("/products", productRouter);
//app.use("/boards", boardRouter);

// 라우팅 정보 : '/' -> 'page정보', '/list' -> ' 글목록정보 '
// get/post/put/delete 요청정보 처리결과 출력

app.get("/", (req, res) => {
  fs.readFile("./root.html", "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error reading file");
      return;
    }
    res.send(data);
  });
});

app.post("/", (req, res) => {
  console.log(req.body);
  res.send("POST request to the homepage");
});

//파일 업로드 테스트
// app.post("/upload", upload.single("profile"), (req, res) => {
//   // profile은 form에 업로드하는 파일의 name 속성 값
//   console.log(req.file); // 업로드된 파일정보
//   res.send("파일 업로드 완료!");
// });

// 숙제: 여러파일 업로드 처리.
app.post("/upload-multiple", upload.array("profiles", 100), (req, res) => {
  // req.files에 업로드된 파일 정보 배열이 들어옴
  console.log(req.files);
  res.send("여러 파일 업로드 완료!");
});

//cookie-session 테스트.
app.get("/login", (req, res) => {
  // 방문 카운트
  req.session.views = (req.session.views || 0) + 1;

  // 같은 디렉토리의 user_info.txt 읽기
  let users;
  try {
    const data = fs.readFileSync("user_info.txt", "utf8");
    users = data
      .trim()
      .split("\n")
      .map((line) => {
        const [id, pw, name] = line.split(",");
        return { id: id.trim(), pw: pw.trim(), name: name.trim() };
      });
  } catch {
    return res.status(500).send("파일 읽기 오류");
  }

  console.log("현재 사용자 목록:", users);

  // 로그인 폼 포함 HTML 응답
  res.send(`
    <h3>로그인 페이지입니다.</h3>
    <p>현재 ${req.session.views}번째 방문입니다.</p>

    <form action="/login" method="post">
      <label>아이디: </label>
      <input type="text" name="userid" required /><br><br>

      <label>비밀번호: </label>
      <input type="password" name="password" required /><br><br>

      <button type="submit">로그인</button>
    </form>

    <br>
    <a href="/logout">로그아웃</a>
  `);
});

// 로그인 처리
app.post("/login", (req, res) => {
  const { userid, password } = req.body;
  let users;
  try {
    const data = fs.readFileSync("user_info.txt", "utf8");
    users = data
      .trim()
      .split("\n")
      .map((line) => {
        const [id, pw, name] = line.split(",");
        return { id: id.trim(), pw: pw.trim(), name: name.trim() };
      });
  } catch {
    return res.status(500).send("파일 읽기 오류");
  }

  const found = users.find((u) => u.id === userid && u.pw === password);

  if (found) {
    req.session.user = found;
    res.send(`✅ 로그인 성공! 안녕하세요, ${found.name}님`);
  } else {
    res.send("❌ 로그인 실패! 아이디 또는 비밀번호를 확인하세요.");
  }
});

app.get("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});

app.post("/:user/:score", (req, res) => {
  //localhost:3000/hongkildong/90
  console.log(req.params);
  res.send("POST request to the homepage");
});

app.get("/:sn/:sname/:score", (req, res) => {
  const { sn, sname, score } = req.params;
  if (score >= 60) {
    ans = "합격";
  } else {
    ans = "불합격";
  }
  res.send(`학번: ${sn} \n
        이름: ${sname} \n
     점수: ${ans}(${score})`);
});

app.post("/test", (req, res) => {
  const { sno, sname, score } = req.body;
  if (score >= 60) {
    ans = "합격";
  } else {
    ans = "불합격";
  }
  res.send(`학번: ${sno} \n
        이름: ${sname} \n
     점수: ${ans}(${score})`);
});

app.listen(3000, () => {
  console.log("으헤~");
});
