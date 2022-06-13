const { dbconn, dbstmt } = require("idb-connector");

const keys = require("./keys");

const sSql = "select * from QSYS2.SYSTEM_STATUS_INFO";

const connection = new dbconn();
connection.conn("*LOCAL");
const statement = new dbstmt(connection);

const metrics = async (res, register, metricsGauges) => {
  const sys_usage = statement.execSync(sSql)[0];

  statement.closeCursor();
  for (const [key, value] of Object.entries(metricsGauges)) {
    if (keys.includes(key)) {
      value.set(Number(sys_usage[key]));
    }
  }

  res.setHeader("Content-Type", register.contentType);

  res.end(await register.metrics());
  // res.end(JSON.stringify(sys_usage));
};

const notFound = (res) => {
  res.setHeader("Content-Type", "text/plain");
  res.statusCode = 404;
  res.end("Not found");
};

module.exports = {
  metrics,
  notFound,
};
