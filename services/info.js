const express = require("express");
const app = express();
const path = require("path");
const router = express.Router();
const bodyParser = require("body-parser");
var oracledb = require("oracledb");
const exphbs = require("express-handlebars");

router.use(bodyParser.urlencoded({ extended: true }));

router.get("/", function(request, res, next) {
  // console.log("Hello world");
  var track = request.query.id;
  if (track == undefined) {
    // console.log("No parameters received");
    res.render("info.handlebars");
  } else {
    // console.log(track);
    var query = `Select count(*) from ${track}`;
    oracledb.getConnection(
      {
        user: "ssarthak",
        password: "Database1",
        connectString:
          "(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=oracle.cise.ufl.edu)(PORT=1521))(CONNECT_DATA=(SERVER=DEDICATED)(SERVICE_NAME=orcl)))"
      },
      function(err, connection) {
        if (err) {
          console.error(err);
          return;
        }
        connection.execute(
          query,
          // [updated_date, data.starttime, data.endtime, data.area],
          function(err, result) {
            if (err) {
              console.error(err);
              return;
            } else {
              res.render("info.handlebars", { [track]: result.rows });
            }
          }
        );
        // connection.close();
      }
    );
  }

  // if (request.query.id == "Area") console.log("In Area");
});

/* router.get("/:id", function(request, res, next) {
  // console.log("Hello world");
  var track = request.params.id;
  var query = `Select count(*) from ${track}`;
  oracledb.getConnection(
    {
      user: "aj3",
      password: "Database1",
      connectString:
        "(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=oracle.cise.ufl.edu)(PORT=1521))(CONNECT_DATA=(SERVER=DEDICATED)(SERVICE_NAME=orcl)))"
    },
    function(err, connection) {
      if (err) {
        console.error(err);
        return;
      }
      connection.execute(
        query,
        // [updated_date, data.starttime, data.endtime, data.area],
        function(err, result) {
          if (err) {
            console.error(err);
            return;
          } else {
            res.render("info.handlebars", { [track]: result.rows });
          }
        }
      );
    }
  );
}); */

module.exports = router;
