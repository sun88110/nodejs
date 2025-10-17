// class.js
// object
let obj = new Object(); // 객체.
obj.name = "김민수";

let student1 = {
  sno: 100,
  sname: "홍길동",
  grade: 1,
  height: 170,
  weight: 65,
  showInfo: function () {
    return `학번:${this.sno}, 이름:${this.sname}`;
  },
};
let student3 = {
  sno: 300,
  sname: "최길동",
  grade: 1,
  height: 175,
  weight: 77,
  // student3의 showInfo 메소드 추가:
  showInfo: function () {
    return `학번:${this.sno}, 이름:${this.sname}`;
  },
};
console.log(student1.showInfo());
// console.log(student2.showInfo()); // ❌ ReferenceError 발생 부분을 주석 처리
console.log(student3.showInfo()); // ✅ student3 정보 출력으로 대체

// 학생 => 정의()
class Student {
  //학번,이름,학년,키,몸무게..... :속성
  // 공부한다, 밥먹는다, 잔다..... :메소드
  constructor(sno, sname, grade, height, weight) {
    this.sno = sno;
    this.sname = sname;
    this.grade = grade;
    this.height = height;
    this.weight = weight;
  }
  showInfo() {
    return `학번:${this.sno}, 이름:${this.sname}`;
  }
}

// 인스턴스 생성.
let std1 = new Student(200, "김민규", 2, 165, 56);
let std2 = new Student(400, "박민식", 3, 180, 86);
console.log(std1.showInfo());
console.log(std2.showInfo()); // ✅ std2 출력으로 수정
