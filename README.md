# IBM i Prometheus exporter

A configurable Prometheus exporter for IBM i metrics data

![image](https://user-images.githubusercontent.com/21371349/173723964-d088bb5a-e9f1-4027-ba72-f51999d82e41.png)

## Who is this project for?

Companies and organizations with a Grafana + Prometheus stack who want to be
able to extract metric data from IBM i such as ASP usage, memory usage, number
of jobs running, etc... or even add metrics with custom DB2 queries (using data
in QSYS2 or the COUNT() statement).

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
