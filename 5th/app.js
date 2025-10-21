const express = require("express");
const mysql = require("./sql");
const xlsx = require("xlsx");
const multer = require("multer");
const cron = require("node-cron");
const nodemailer = require("nodemailer");
const fs = require("fs");
const app = express();
const port = 3000;

// ⭐ Cron Job 제어용 전역 변수 ⭐
let scheduledTask = null;

// ⭐ Nodemailer Transport 설정 (transporter로 정의) ⭐
const transporter = nodemailer.createTransport({
  host: "smtp.daum.net",
  port: 465,
  secure: true,
  auth: {
    user: "sun.88110@daum.net",
    pass: "xhjvkhbjontsywdu",
  },
});

//정적디렉토리 설정
app.use(express.static("public"));

// parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

app.use(
  express.json({
    limit: "50mb",
  })
);

// 파일업로드 설정.
const storage = multer.diskStorage({
  // 업로드된 파일이 저장될 위치 설정.
  destination: function (req, file, cb) {
    const uploadDir = "uploads/";
    if (!fs.existsSync(uploadDir)) {
      // 폴더가 없으면 동기적으로 생성합니다.
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  }, // 업로드된 파일의 이름 설정.
  filename: function (req, file, cb) {
    // 파일명에 포함된 한글을 Buffer로 처리하여 안전한 파일명 생성
    const originalname = Buffer.from(file.originalname, "latin1").toString(
      "utf8"
    );
    cb(null, new Date().valueOf() + "-" + originalname); // 2025-08-20-시간+홍길동.jpg
  },
});
// multer 객체 생성.
const upload = multer({ storage: storage });

// 라우팅 정보.
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// ------------------------------------------------------------------
// ⭐ 재사용 가능한 이메일 발송 작업 함수 정의 ⭐
// ------------------------------------------------------------------
async function sendCustomerEmailJob() {
  let customers;
  try {
    // 1. MySQL에서 고객 데이터 조회
    customers = await mysql.queryExecute(
      "SELECT id, name, email, phone, address FROM customers",
      []
    );
    if (customers.length === 0) {
      console.log("CRON: 전송할 고객 데이터가 없습니다.");
      return;
    } // 2. 엑셀 파일 생성

    const workbook = xlsx.utils.book_new();
    const sheet = xlsx.utils.json_to_sheet(customers, {
      header: ["id", "name", "email", "phone", "address"],
    });
    xlsx.utils.book_append_sheet(workbook, sheet, "CustomerList");
    const excelFileName = `./files/customer_list_${new Date().valueOf()}.xlsx`;
    xlsx.writeFile(workbook, excelFileName); // 동기적 파일 저장 // 3. 이메일 전송 준비

    const mailOptions = {
      from: transporter.options.auth.user, // ✅ transport -> transporter 수정
      to: "sun.88110@daum.net",
      subject: `[CRON] 고객 정보 목록 (${new Date().toLocaleDateString()})`,
      html: "<p>10분 주기 작업으로 요청된 고객 데이터 목록이 첨부되었습니다.</p>",
      attachments: [{ filename: "customer_list.xlsx", path: excelFileName }],
    }; // 4. 이메일 전송 및 임시 파일 삭제

    let info = await transporter.sendMail(mailOptions); // ✅ transport -> transporter 수정
    console.log("CRON: 메일 전송 성공:", info.response);
    await fs.promises.unlink(excelFileName);
  } catch (err) {
    console.error("CRON 작업 중 오류 발생:", err);
  }
}
// ------------------------------------------------------------------

// customer 테이블 조회 => 엑셀 => 이메일전송 시 첨부파일.
// '/customerInfo' GET 요청 처리.
app.get("/customerInfo", async (req, res) => {
  // 1. MySQL에서 고객 데이터 조회
  let customers;
  try {
    customers = await mysql.queryExecute(
      "SELECT id, name, email, phone, address FROM customers",
      []
    );
    if (customers.length === 0) {
      return res.status(404).send("고객 데이터가 없습니다.");
    }
  } catch (err) {
    console.error("DB 조회 오류:", err);
    return res.status(500).send("DB 조회 중 오류가 발생했습니다.");
  } // 2. 엑셀 파일 생성 (메모리 또는 임시 파일)

  const workbook = xlsx.utils.book_new();
  const sheet = xlsx.utils.json_to_sheet(customers, {
    header: ["id", "name", "email", "phone", "address"],
  });
  xlsx.utils.book_append_sheet(workbook, sheet, "CustomerList"); // 파일명 설정

  const excelFileName = `./files/customer_list_${new Date().valueOf()}.xlsx`; // 엑셀 파일을 임시로 저장

  try {
    // [주의] 이 작업은 비동기 fs 모듈을 사용해야 안전하지만,
    // xlsx.writeFile이 동기적으로 처리되므로 일단 그대로 사용합니다.
    xlsx.writeFile(workbook, excelFileName);
  } catch (err) {
    console.error("엑셀 파일 생성 오류:", err);
    return res.status(500).send("엑셀 파일 생성 중 오류가 발생했습니다.");
  } // 3. 이메일 전송 준비 (첨부 파일 포함)

  const mailOptions = {
    from: transporter.options.auth.user, // ✅ transport -> transporter 수정
    to: "sun.88110@example.com", // ★ 실제 수신자 이메일 주소로 변경 필요
    subject: "고객 정보 Excel 파일입니다.",
    html: "<p>요청하신 고객 데이터 목록이 첨부되었습니다.</p>",
    attachments: [
      {
        filename: "customer_list.xlsx", // 첨부 파일 이름
        path: excelFileName, // 임시로 저장된 파일 경로
      },
    ],
  }; // 4. 이메일 전송

  try {
    let info = await transporter.sendMail(mailOptions); // ✅ transport -> transporter 수정
    console.log("메일 전송 성공:", info.response); // 5. 전송 완료 후 임시 파일 삭제 (비동기 처리)

    await fs.promises.unlink(excelFileName);

    res.send("고객 목록 조회 및 Excel 파일 이메일 전송 완료.");
  } catch (err) {
    console.error("메일 전송 또는 파일 삭제 오류:", err); // 메일 전송이 실패했더라도 임시 파일은 삭제 시도

    try {
      await fs.promises.unlink(excelFileName);
    } catch (e) {}

    return res.status(500).send("이메일 전송 중 오류가 발생했습니다.");
  }
});

// ------------------------------------------------------------------
// ⭐ cron/start 라우트: 10분마다 실행 예약 및 즉시 실행 ⭐
// ------------------------------------------------------------------
app.get("/cron/start", async (req, res) => {
  if (scheduledTask) {
    return res
      .status(200)
      .send("✅ Cron Job은 이미 실행 중입니다. (10분 간격)");
  } // Cron Job 예약: '*/10 * * * *' -> 매 10분마다

  scheduledTask = cron.schedule("*/10 * * * *", () => {
    console.log(
      `[CRON START] 10분 주기 작업 실행: ${new Date().toLocaleString()}`
    );
    sendCustomerEmailJob(); // 분리된 함수 호출
  }); // Cron Job 시작 시 한 번 즉시 실행

  sendCustomerEmailJob();

  res.send("✅ 고객 정보 이메일 발송 Cron Job이 시작되었습니다. (10분 간격)");
});

// ------------------------------------------------------------------
// ⭐ cron/stop 라우트: Cron Job 종료 ⭐
// ------------------------------------------------------------------
app.get("/cron/stop", (req, res) => {
  if (scheduledTask) {
    scheduledTask.stop(); // 예약된 작업 종료
    scheduledTask = null;
    return res.send("🛑 Cron Job이 성공적으로 종료되었습니다.");
  }
  res.status(200).send("⚠️ Cron Job이 현재 실행 중이 아닙니다.");
});

//파일 저장
app.post("/upload/:productId/:type/:fileName", (req, res) => {
  const dir = `uploads/${req.params.productId}/${req.params.type}`;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const filePath = `${dir}/${req.params.fileName}`;
  const base64Data = req.body.imageBase64.slice(
    req.body.imageBase64.indexOf(";base64") + 8
  );
  fs.writeFile(`${filePath}`, base64Data, "base64", (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("파일 저장 중 오류가 발생했습니다.");
    }
    console.log("파일이 성공적으로 저장되었습니다.");
  });
  res.send("OK");
});

app.post("/upload/excels", upload.single("excelFile"), async (req, res) => {
  // 멀티파트 폼데이터 처리. => db저장.
  console.log(req.file.path);

  const workbook = xlsx.readFile(`${req.file.path}`);
  const firstSheetName = workbook.SheetNames[0]; //첫번째 시트명
  const firstSheet = workbook.Sheets[firstSheetName]; //첫번째 시트
  const excelData = xlsx.utils.sheet_to_json(firstSheet); // 시트 -> json배열

  try {
    //비동기처리로 인한 응답지연 방지
    // json배열 -> mysql insert
    for (const item of excelData) {
      console.log(item);
      await mysql.queryExecute("insert into customers set ?", [item]);
    }
    res.send("임무 완료!");
  } catch (err) {
    console.error(err);
    return res.status(500).send("오류다!!!!!비상!!!!");
  } finally {
    //업로드 된 파일 삭제
    console.log("파일 경로");
  }
});

// 지난 1분 동안 updated_at이 갱신된(내용이 변경된) 건수를 조회하는 비동기 함수
async function getUpdatedCount() {
  const query = `
        SELECT COUNT(*) AS updated_count 
        FROM customers 
        WHERE updated_at >= DATE_SUB(NOW(), INTERVAL 1 MINUTE)
    `;
  try {
    const result = await mysql.queryExecute(query, []); // 조회된 'updated_count' 값을 반환
    return result[0].updated_count;
  } catch (err) {
    console.error("업데이트 건수 조회 오류:", err);
    return 0;
  }
}
// 매분 0초마다 실행되어 내용이 변경된 건수를 추적합니다.
cron.schedule("0 * * * * *", async () => {
  // 1. DB에서 변경된 건수를 조회합니다.
  const changedCount = await getUpdatedCount(); // 2. 결과를 출력합니다.

  if (changedCount > 0) {
    console.log(
      `[${new Date().toLocaleTimeString(
        "ko-KR"
      )}] 🚨 customers 내용 변경 감지: ${changedCount} 건`
    );
  } else {
    console.log(
      `[${new Date().toLocaleTimeString("ko-KR")}] customers 변경 없음.`
    );
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = {
  getUpdatedCount: getUpdatedCount,
};
