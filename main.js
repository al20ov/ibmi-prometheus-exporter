const http = require("http");
const url = require("url");
const client = require("prom-client");

const router = require("./src/router");

const PORT = process.env.PORT || 7203;

const Registry = client.Registry;
const register = new Registry();

register.setDefaultLabels({
  service: "IBM i system metrics",
});

router.generateMetricsQueries(register);

const server = http.createServer(async (req, res) => {
  const route = url.parse(req.url, true).pathname;

  if (route === "/metrics") {
    router.metrics(req, res, register);
  } else if (route === "/metrics/list") {
    router.getMetrics(res);
  } else {
    router.notFound(res);
  }
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// For CPU metrics (not enough rights on public ibm i server)
// select * from table(QSYS2.SYSTEM_ACTIVITY_INFO())
