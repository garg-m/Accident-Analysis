var oracledb = require("oracledb");
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
    connection.execute("SELECT * from Accident WHERE ROWNUM <= 10", function(err, result) {
      if (err) {
        console.error(err);
        return;
      }
      console.log(result.rows);
    });
  }
);
