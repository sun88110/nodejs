// const nodemailer = require("nodemailer");

// //nodemailer setup
// const transporter = nodemailer.createTransport({
//   host: "smtp.daum.net",
//   port: 465,
//   secure: true,
//   auth: {
//     user: "sun.88110@daum.net",
//     pass: "xhjvkhbjontsywdu",
//   },
// });

// function mailSendFunc() {
//   //mail 발송 함수
//   function myMailingFunc(to, subject, html) {
//     const data = {
//       from: "sun.88110@daum.net",
//       to: "sun.88110@daum.net",
//       subject: subject,
//       html: "sample content",
//       attachments: [
//         {
//           filename: "customers.xlsx",
//           path: "./files/customers.xlsx",
//         },
//       ],
//     };

//     transporter.sendMail(data, (err, info) => {
//       if (err) {
//         console.log(err);
//         // resizeBy.status(500).send({ error: err.message });
//       } else {
//         console.log(info);
//         //resizeBy.send("Email sent successfully");
//         //resolve(info);
//       }
//     });
//   }
// }

// mailSendFunc();

const nodemailer = require("nodemailer");

// nodemailer setup
const transporter = nodemailer.createTransport({
  host: "smtp.daum.net",
  port: 465,
  secure: true,
  auth: {
    user: "sun.88110@daum.net",
    pass: "xhjvkhbjontsywdu",
  },
});

// [수정] 함수 정의 대신, 즉시 실행되는 로직으로 변경
const subject = "노드메일러 테스트 발송";
const htmlContent = "<h1>안녕하세요. 테스트 본문입니다.</h1>";

const data = {
  from: "sun.88110@daum.net",
  to: "sun.88110@daum.net", // ★ 발송 테스트를 위해 수신자 주소를 본인 주소로 설정
  subject: subject,
  html: htmlContent,
  attachments: [
    {
      filename: "customers.xlsx",
      path: "./files/customers.xlsx",
    },
  ],
};

// 메일 발송 실행
transporter.sendMail(data, (err, info) => {
  if (err) {
    console.error("이메일 발송 실패 오류:", err);
  } else {
    console.log("이메일이 성공적으로 발송되었습니다.");
    console.log("응답 정보:", info);
  }
});

// 이전의 mailSendFunc() 함수와 myMailingFunc() 함수는 제거되었습니다.
