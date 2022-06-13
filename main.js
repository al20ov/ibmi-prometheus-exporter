const http = require("http");
const url = require("url");
const client = require("prom-client");

const keys = require("./src/keys");

const router = require("./src/router");

const PORT = process.env.PORT || 7203;

const Registry = client.Registry;
const register = new Registry();

register.setDefaultLabels({
  service: "IBM i system metrics",
});

let metricsGauges = {};

keys.map((key) => {
  metricsGauges[key] = new client.Gauge({
    name: key,
    help: `"${key.toLowerCase()}" metric`,
  });
  register.registerMetric(metricsGauges[key]);
});

const server = http.createServer(async (req, res) => {
  const route = url.parse(req.url, true).pathname;

  if (route === "/metrics") {
    router.metrics(res, register, metricsGauges);
  } else {
    router.notFound(res);
  }
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
