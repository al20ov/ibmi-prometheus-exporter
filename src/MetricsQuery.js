const client = require("prom-client");

class MetricsQuery {
  constructor(table, metricsList, register) {
    this.table = table;
    this.metricsList = metricsList;
    this.query = this.generateQuery();
    this.gauges = this.generateGauges(register);
  }

  // Generators
  generateQuery() {
    return `select ${
      this.metricsList.map((metric) => metric)
    } from ${this.table}`;
  }

  generateGauges(register) {
    let gauges = {};

    this.metricsList.map((metric) => {
      gauges[metric] = new client.Gauge({
        name: metric,
        help: `"${metric.toLowerCase()}" metric`,
      });
      register.registerMetric(gauges[metric]);
    });
    return gauges;
  }

  updateGauges(statement) {
    const data = statement.execSync(this.query)[0];

    statement.closeCursor();
    for (const [metricName, gauge] of Object.entries(this.gauges)) {
      gauge.set(Number(data[metricName]));
    }
  }
}

module.exports = MetricsQuery;
