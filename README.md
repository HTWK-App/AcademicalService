# AcademicalService

[![License](https://img.shields.io/badge/License-GPLv3-green.svg)](https://github.com/HTWK-App/AcademicalService/blob/master/LICENSE)
[![Language](https://img.shields.io/badge/Language-Javascript%20ECMA2015-lightgrey.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Language](https://img.shields.io/badge/Framework-NodeJS%205.5.0-blue.svg)](https://nodejs.org/)
[![Framework](https://img.shields.io/badge/Webserver-Hapi%2013.0.0-blue.svg)](http://hapijs.com/)
[![Lines of Code](https://img.shields.io/badge/loc--lightgrey.svg)]()

This microservice scrapes the [academical calendar](https://www.htwk-leipzig.de/de/studierende/aktuelles-kalender/akademischer-kalender/sommersemester/) of the [University of Applied Sciences Leipzig](https://www.htwk-leipzig.de/en) and provisions it through a REST-JSON API.

The data is fetched, cleaned and enhanced every 24 houres to ensure latest updates.

### Using this Service ###

Once your Server is running all you need to do is open your browser pointing to the host/port you just published and look at the raw JSON-data. The default Port is 9000, so you got to call:

``` http://localhost:9000/academical/{ws|ss} ```

in a Webbrowser.

### Compilation/Running the Server  ###

Install [NodeJS](https://nodejs.org/).

To start the server (for the first time), execute the following commands:

```
# May take some time
npm install
npm start
```

Please note that this application was designed to be deployed with docker and instrumented (Metrics, ...) by NewRelic. Inside the projects root, you'll find a scipt named **dockerDeploy.sh**. This script will build a docker image, containing the app. Execute the following to start the docker image:

```
docker run -it --rm -p 9000:9000 rmeissn/academical:latest
```
