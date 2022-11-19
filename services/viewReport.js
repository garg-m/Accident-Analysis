const express = require("express");
const app = express();
const path = require("path");
const router = express.Router();
const bodyParser = require("body-parser");
var oracledb = require("oracledb");
const exphbs = require("express-handlebars");

router.use(bodyParser.urlencoded({ extended: true }));

// Register Handlebars view engine

//  app.use("/", router);
// app.listen(process.env.port || 3000);
router.get("/", function(request, res, next) {
  // console.log("Hello world");
  res.render("tempdisplay.handlebars");
  // res.sendFile(path.join(__dirname + "/view.html"));

  //__dirname : It will resolve to your project folder.
});

router.post("/", function(request, res) {
  // console.log(request.body.date);
  console.log(request.body.date);
  array = request.body.date.split("-");
  getmonth = array[1];
  mapMonth = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  array[1] = mapMonth[getmonth - 1];
  updated_date = array[2] + "-" + array[1] + "-" + array[0];

  var data = {
    area: request.body.area,
    date: request.body.date,
    starttime: request.body.starttime,
    endtime: request.body.endtime
  };

  console.log(data);
  var form_query = "";
  var binds = [];
  var dateformat = "HH:MM";
  var yearformat = "YYYY:DD:MM";
  //if all areas are selected
  if (data.area == "all") {
    // Date is blank
    // console.log("ALL AREAS");
    if (data.date == "undefined-undefined-") {
      // Start time or endtime is blank
      if (data.starttime == "" || data.endtime == "") {
        // give results of all rows and columns
        // console.log("DATE EMPTY AND --- START OR END TIME BLANK");
        form_query =
          "SELECT * FROM ACCIDENT WHERE ROWNUM <= 500";
        binds = [];
      } else {
        // give result of crime occurred between that time
        // console.log("DATE BLANK --- START TIME OR END TIME GIVEN");
        form_query =
          "SELECT * FROM Acident, Caused WHERE Accident.ID = Caused.ID AND :1 >= (SELECT TO_CHAR(start_time, :2) FROM Caused) AND :3 <= (SELECT TO_CHAR(start_time, :2) FROM Caused ) AND ROWNUM <=500";
        binds = [data.starttime, dateformat, data.endtime];
      }
    }
    // Date is filled
    else {
      if (data.starttime == "" || data.endtime == "") {
        // Start time or endtime is blank
        // console.log("DATE FILLED --- START OR END TIME BLANK");
        form_query =
          "SELECT * FROM ACCIDENT, CAUSED as c WHERE ACCIDENT.ID = c.ID AND :1 = (SELECT TO_CHAR(start_time, :2) FROM Caused WHERE Caused.id = c.id)";
        binds = [data.date, yearformat];
      } else {
        // console.log("DATE FILLED --- START and END TIME FILLED");
        form_query =
          "SELECT I.dr_no, c.description, time_occurred,  DATE_REPORTED, v.age, v.sex, ds.description, cs.description as STATUS FROM incident I JOIN REPORTS R ON I.DR_NO = R.DR_NO JOIN CASE_STATUS CS ON CS.STATUS_CODE = I.STATUS_CODE JOIN VICTIM V ON V.VICTIM_ID = R.VICTIM_ID JOIN CRIME C ON c.crime_code = r.crime_code JOIN LOCATION L ON r.coordinates = l.coordinates JOIN AREA A ON a.area_id = l.area_id JOIN DESCENT ds ON v.descent = ds.descent_code where date_occurred = :1 AND time_occurred BETWEEN :2 AND :3";
        binds = [updated_date, data.starttime, data.endtime];
      }
    }
  }

  // A particular area is selected
  else {
    // console.log("Area given");
    if (data.date == "undefined-undefined-") {
      // Start time or endtime is blank
      if (data.starttime == "" || data.endtime == "") {
        // give results of all rows and columns
        form_query =
          "SELECT I.dr_no, c.description, time_occurred,  DATE_REPORTED, v.age, v.sex, ds.description, cs.description as STATUS FROM incident I JOIN REPORTS R ON I.DR_NO = R.DR_NO JOIN CASE_STATUS CS ON CS.STATUS_CODE = I.STATUS_CODE JOIN VICTIM V ON V.VICTIM_ID = R.VICTIM_ID JOIN CRIME C ON c.crime_code = r.crime_code JOIN LOCATION L ON r.coordinates = l.coordinates JOIN AREA A ON a.area_id = l.area_id JOIN DESCENT ds ON v.descent = ds.descent_code WHERE AREA_NAME = :1 AND rownum <= 500 ORDER BY DATE_OCCURRED DESC";
        binds = [data.area];
      } else {
        // give result of crime occurred between that time
        form_query =
          "SELECT I.dr_no, c.description, time_occurred,  DATE_REPORTED, v.age, v.sex, ds.description, cs.description as STATUS FROM incident I JOIN REPORTS R ON I.DR_NO = R.DR_NO JOIN CASE_STATUS CS ON CS.STATUS_CODE = I.STATUS_CODE JOIN VICTIM V ON V.VICTIM_ID = R.VICTIM_ID JOIN CRIME C ON c.crime_code = r.crime_code JOIN LOCATION L ON r.coordinates = l.coordinates JOIN AREA A ON a.area_id = l.area_id JOIN DESCENT ds ON v.descent = ds.descent_code where AREA_NAME = :1 AND time_occurred BETWEEN :2 AND :3 AND rownum <= 500 ORDER BY DATE_OCCURRED DESC";
        binds = [data.area, data.starttime, data.endtime];
      }
    }
    // Date is filled
    else {
      if (data.starttime == "" || data.endtime == "") {
        // Start time or endtime is blank
        form_query =
          "SELECT I.dr_no, c.description, time_occurred,  DATE_REPORTED, v.age, v.sex, ds.description, cs.description as STATUS FROM incident I JOIN REPORTS R ON I.DR_NO = R.DR_NO JOIN CASE_STATUS CS ON CS.STATUS_CODE = I.STATUS_CODE JOIN VICTIM V ON V.VICTIM_ID = R.VICTIM_ID JOIN CRIME C ON c.crime_code = r.crime_code JOIN LOCATION L ON r.coordinates = l.coordinates JOIN AREA A ON a.area_id = l.area_id JOIN DESCENT ds ON v.descent = ds.descent_code where AREA_NAME = :1 AND date_occurred = :2";
        binds = [data.area, updated_date];
      } else {
        form_query =
          "SELECT I.dr_no, c.description, time_occurred,  DATE_REPORTED, v.age, v.sex, ds.description, cs.description as STATUS FROM incident I JOIN REPORTS R ON I.DR_NO = R.DR_NO JOIN CASE_STATUS CS ON CS.STATUS_CODE = I.STATUS_CODE JOIN VICTIM V ON V.VICTIM_ID = R.VICTIM_ID JOIN CRIME C ON c.crime_code = r.crime_code JOIN LOCATION L ON r.coordinates = l.coordinates JOIN AREA A ON a.area_id = l.area_id JOIN DESCENT ds ON v.descent = ds.descent_code where AREA_NAME = :1 AND date_occurred = :2 AND time_occurred BETWEEN :3 AND :4";
        binds = [data.area, updated_date, data.starttime, data.endtime];
      }
    }
  }

  /* console.log(updated_date);
  console.log(data.starttime);
  console.log(data.endtime);
  console.log(data.area);
  console.log(form_query); */
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
        form_query,
        binds,
        
        // [updated_date, data.starttime, data.endtime, data.area],
        function(err, result) {
          if (err) {
            console.error(err);
            return;
          } else {
            if (result.rows.length == 0) {
              res.render("tempdisplay.handlebars", {
                NOCRIME: "No crimes committed"
              });
            }// else {
            //   for (var i = 0; i < result.rows.length; i++) {
            //     // used to parse date object
            //     result.rows[i][3] = result.rows[i][3]
            //       .toString()
            //       .substring(0, 15);
            //   }
              res.render("tempdisplay.handlebars", { data: result.rows });
              // console.log(result.rows.length);
              // console.log(result.rows);
            //}
          }
        }
      );
      // connection.close();
    }
  );
});

// app.use("/", router);
// console.log("Running at Port 3000");
module.exports = router;
