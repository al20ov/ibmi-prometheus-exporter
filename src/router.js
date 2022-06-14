const { dbconn, dbstmt } = require("idb-connector");

const metricsList = require("../config/metrics.json");

const MetricsQuery = require("./MetricsQuery");

const connection = new dbconn();
connection.conn("*LOCAL");
const statement = new dbstmt(connection);

let metricsQueries = [];

const generateMetricsQueries = (register) => {
  for (const source of metricsList) {
    const newMetricsQuery = new MetricsQuery(
      source.table,
      source.metricsList,
      register,
    );

    metricsQueries.push(newMetricsQuery);
  }
};

const metrics = async (res, register) => {
  metricsQueries.forEach((metric) => metric.updateGauges(statement));
  res.setHeader("Content-Type", register.contentType);

  res.end(await register.metrics());
};

const notFound = (res) => {
  res.setHeader("Content-Type", "text/plain");
  res.statusCode = 404;
  res.end("Not found");
};

module.exports = {
  metrics,
  notFound,
  generateMetricsQueries,
};

// const sys_usage = statement.execSync(sSql)[0];

// statement.closeCursor();
// for (const [key, value] of Object.entries(metricsGauges)) {
//   if (names.includes(key)) {
//     value.set(Number(sys_usage[key]));
//   }
// }
