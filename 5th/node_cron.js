const cron = require("node-cron"); // 주기적인 작업처리
const winston = require("winston"); //로그관리 모듈
const mysql = require("./sql");
const { getUpdatedCount } = require("./app");

//npm install node cron
//npm install winston
// sceondm minute, hour, day a month, month, day of week
// 매분마다 customers 데이터 변경된 건수를 출격.
const logger = winston.createLogger({
  level: "info", // error>warn>info>http>verbose>debug>silly 출력의 무게
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(
      (info) => `${info.timestamp} ${info.level}: ${info.message} `
    )
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "log/info.log" }),
  ],
});

async function customerlist() {
  try {
    let result = await mysql.queryExecute(
      "select count(*) as cnt from customers",
      []
    );
    logger.info(`customers 테이블의 현재건수 : ${result[0].cnt}건`);
  } catch (err) {
    logger.error(`${err}`);
  }
}

// cron.schedule("0 * * * * *", async () => {
//   const changedCount = await getUpdatedCount(); // 정의된 함수 호출

//   console.log(`customers 테이블의 현재건수 : ${changedCount}`, new Date());
// });

cron.schedule("*/5 * * * * *", () => {
  //   logger.info(`print info level`);
  //   logger.debug("print debug level");
  //   logger.error("print error level");
  customerlist();
});
