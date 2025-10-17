const express = require("express");
const router = express.Router();

// '/board' get/post/put/delete
router
  .route("/board")
  .get((req, es) => {
    res.send("Board GET");
  })
  .post((req, es) => {
    res.send("Board POST");
  })
  .put((req, es) => {
    res.send("Board PUT");
  })
  .delete((req, es) => {
    res.send("Board DELETE");
  });

module.exports = router;
