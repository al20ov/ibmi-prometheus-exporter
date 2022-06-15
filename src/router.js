const { dbconn, dbstmt } = require("idb-connector");

const client = require("prom-client");

const metricsList = require("../config/metrics.json");

const MetricsQuery = require("./MetricsQuery");

const connection = new dbconn();
connection.conn("*LOCAL");
const statement = new dbstmt(connection);

const metricsRequestCounter = new client.Counter({
  name: "PROCESS_METRICS_REQUEST_COUNTER",
  help: "Total number of requests to the metrics endpoint",
});

let metricsQueries = [];

const generateMetricsQueries = (register) => {
  register.registerMetric(metricsRequestCounter);
  for (const source of metricsList) {
    const newMetricsQuery = new MetricsQuery(
      source.table,
      source.metricsList,
      register,
    );

    metricsQueries.push(newMetricsQuery);
  }
};

const metrics = async (req, res, register) => {
  metricsRequestCounter.inc();
  console.log(
    `${req.connection.remoteAddress} - - [${new Date()}] "GET /metrics" 200 -`,
  );
  metricsQueries.forEach((metric) => metric.updateGauges(statement));
  res.setHeader("Content-Type", register.contentType);

  res.end(await register.metrics());
};

const getMetrics = (res) => {
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(metricsList));
};

const notFound = (res) => {
  res.setHeader("Content-Type", "text/plain");
  res.statusCode = 404;
  res.end("Not found");
};

module.exports = {
  metrics,
  getMetrics,
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
