// todo.js
// sample.txt 단어 갯수 => ?개, 'e'문자가 포함된 => ?개
const fs = require("fs"); // 내장모듈. file systeme
let Evalue = 0;
let value = 0;
let data = fs.readFileSync("sample.txt", "utf-8");

fs.readFile("sample.txt", (err, data) => {
  //(err,data)에러가 뜨면 에러 났다고 표기
  if (err) {
    console.log(err);
    return;
  }
  console.log(data.toString());
  let list = data.toString().split(" ");
  console.log(list);

  for (let i = 0; i < list.length; i++) {
    const word = list[i];
    if (word.toLowerCase().includes("e")) {
      Evalue++;
    }
  }
  console.log(`e가 포함된 단어 갯수 = ${Evalue}개`);
  console.log(`총 단어 개수: ${list.length}개`);
});
//리듀스로 만든 형태
// const eContainingWordsCount = list.reduce((count, word) => {
//         // 단어를 소문자로 변환하고 'e' 포함 여부 확인
//         if (word.toLowerCase().includes("e")) {
//             return count + 1; // 'e'가 포함되면 카운트를 1 증가
//         }
//         return count; // 포함되지 않으면 카운트 유지
//     }, 0); // 초기값 (count)을 0으로 설정

//     console.log("--- 분석 결과 ---");
//     console.log(`총 단어 개수: ${list.length}개`);
//     console.log(`'e'가 포함된 단어 갯수: ${eContainingWordsCount}개`);
