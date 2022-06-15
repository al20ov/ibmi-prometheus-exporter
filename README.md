[![Node.js CI](https://github.com/al20ov/ibmi-prometheus-exporter/actions/workflows/dependencies.yml/badge.svg?branch=main)](https://github.com/al20ov/ibmi-prometheus-exporter/actions/workflows/dependencies.yml)

# IBM i Prometheus exporter

A configurable Prometheus exporter for IBM i metrics data

![image](https://user-images.githubusercontent.com/21371349/173723964-d088bb5a-e9f1-4027-ba72-f51999d82e41.png)

## Who is this project for?

Companies and organizations with a Grafana + Prometheus stack who want to be
able to extract metric data from IBM i such as ASP usage, memory usage, number
of jobs running, etc... or even add metrics with custom DB2 queries (using data
in QSYS2 or the COUNT() statement).

<p align="center">
  <img width="700" src="https://user-images.githubusercontent.com/21371349/173734026-b8266ae7-d68f-450e-8d96-427be2d561a8.svg">
</p>

## Installing the exporter on IBM i

To install the exporter, you need to have access to the PASE environment, as
well as some open-source software, notably `Node.js`.
Other open-source software is also recommended, such as `bash` or `zsh` for a
sensible shell, although `qsh` could do the trick.

Once you have all of that set up, you can move on to these steps:

1. Clone this repo using git, or download it as a zip on a separate computer and
transfer it over to the IBM i partition you want to install it on using Putty,
scp or FTP.

2. `ssh` into the machine and `cd` into the repository

3. Run `npm i` to install the dependencies

4. Start the exporter with `npm start`. By default, it runs on TCP port `7203`,
but you can override this with an environment variable, for example, for a
one-off override, you can run it with `PORT=8080 npm start`

## Prometheus configuration

Here is an example `prometheus.yml` config to scrape data from the exporter:

```yml
global:
  scrape_interval: '5s'

scrape_configs:
  - job_name: 'ibmi'
    scrape_interval: '5s'
    static_configs:
      - targets: [ '<IP or hostname of the IBM i partition the exporter is running on>:7203' ]
```

## Adding/removing metrics to query

Adding metrics beyond those already included in metrics.json can require
modifying some of the code in `src/router.js` and `src/MetricsQuery.js` to fit
your needs, however, we think the code is simple enough and you should be able
to understand it.

All the metrics that this tool queries are configured in `config/metrics.json`.
The schema this JSON file uses is an array of objects that contains the
following:

```json
{
  "name": "Name of the metric",
  "table": "Name of the DB2 table containing these metrics",
  "metricsList": [
    "column 1",
    "column 2",
    "column 3"
  ]
}
```

Refer to the metrics.json file provided in this repo if you need an example.

The metrics.json file provided by default only includes one DB2 query for some
metrics, but it does not include certain metrics such as CPU usage. To add CPU
usage metrics, add these lines to `config/metrics.json` right at the end of the
array:

```json
{
  "name": "SYSTEM_ACTIVITY_INFO",
  "table": "QSYS2.SYSTEM_ACTIVITY_INFO",
  "metricsList": [
    "AVERAGE_CPU_RATE",
    "AVERAGE_CPU_UTILIZATION",
    "MINIMUM_CPU_UTILIZATION",
    "MAXIMUM_CPU_UTILIZATION"
  ]
}
```

Keep in mind that access to `QSYS2.SYSTEM_ACTIVITY_INFO` requires `*JOBCTL`
authority.
