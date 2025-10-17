const { PI, sum } = require("./module");
const fs = require("fs"); // 내장모듈. file systeme

// 비동기처리 => callback함수
// fs.writeFile("sample.txt", "Hello, World", (err) => {
//   if (err) {
//     console.log(new Error(err));
//   }
//   console.log("write done!!");
// });

// fs.writeFileSync("sample2.txt", "비동기처리 완료", "utf-8");
// console.log("쓰기 완료!");

//비동기처리
fs.readFile("sample.txt", (err, data) => {
  //(err,data)에러가 뜨면 에러 났다고 표기
  if (err) {
    console.log(err);
    return;
  }
  console.log(data.toString());
});

let data = fs.readFileSync("sample2.txt", "utf-8");
console.log(data.toString());

console.log(PI);
console.log(sum(1, 2));
