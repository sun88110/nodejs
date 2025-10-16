// crypto.js
const crypto = require("crypto");
const { get } = require("http");

let cryptPasswd = crypto
  .createHash("sha256")
  .update("sample123")
  .digest("base64");
console.log(cryptPasswd);

// 1. DB의 값을 암호을 비교. 사용자가 입력한 값 vs 암호화 값 => 비교 후 판별
let fixedSalt =
  "1dKeFcqAaA9neexUwjQRWA9vyoDjdCts73qoeLZQYGvVDwhewS2wDHOkupNE+Xdnp7gjxleWqgesu7QKaocZow==";

async function getCryptoPassword(password) {
  // 1. salting 임의의 구문. => 동일한 비밀번호라도 매번 다른 해시값 생성
  //   let salt = crypto.randomBytes(64).toString("base64");
  let dbPass =
    "1dKeFcqAaA9neexUwjQRWA9vyoDjdCts73qoeLZQYGvVDwhewS2wDHOkupNE+Xdnp7gjxleWqgesu7QKaocZow==";
  console.log();
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, fixedSalt, 100000, 64, "sha512", (err, key) => {
      if (err) {
        console.log(err);
        return;
      }
      //console.log(dbPass == key.toString("base64") ? "same" : "different");
      resolve(dbPass == key.toString("base64") ? "same" : "different");
    });
  });
}

getCryptoPassword("sample123")
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    console.error(err);
  });
