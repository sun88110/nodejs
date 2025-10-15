// Array.prototype.sort();
"abc".split("").sort();
// ['a', 'b', 'c']
let fruits = ["banana", "apple", "mango"];
console.log(fruits.sort());

let points = [2, 14, 10, 100, 1];
points.sort(function (a, b) {
  //아무것도 안넣으면 유니코드 기준으로 정렬
  // return a - b 오름차순 -값 반환 a가 b보다 작으면 위치를 바꿔라
  // return b - a 내림차순
  console.log(a, b);
  if (a > b) {
    return 1;
  } else if (a < b) {
    return -1;
  } else {
    return 0;
  }
});
console.log(points); // [1, 10, 100, 14, 2]

const students = [];
students.push({ sno: 100, sname: "홍길동", score: 78 });
students.push({ sno: 200, sname: "김찬성", score: 55 });
students.push({ sno: 300, sname: "박인규", score: 95 });

students.sort(function (a, b) {
  if (a.sname < b.sname) {
    return -1;
  } else {
    return 1;
  }
});

console.log(students);

//filter(function(elem, index, array){ })
let result = students.filter((elem) => elem.score < 80);
console.log(result);

//map(function) => 매핑(A -> A') 학생번호 + 이름 + 점수 => 학생번호 + 이름 + 통과
result = students.map(function (sno, sname, score) {
  //{ sno, sname, score }=> elem > object destructuring.
  const obj = {};
  obj.no = elem.sno;
  obj.name = elem.sname;
  obj.pass = elem.score >= 60 ? "합격" : "불합격";
  return obj;
});
console.log(result);
