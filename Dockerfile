FROM node:5.5-slim
MAINTAINER Roy Meissner <roy-meissner@gmx.net>

RUN mkdir /nodeApp
WORKDIR /nodeApp

ADD ./package.json ./
RUN npm install && npm install newrelic

ADD ./ ./

# Install NewRelic Agent
RUN cp ./node_modules/newrelic/newrelic.js ./ && \
    sed -i -e "s/My Application/Academical MicroService/g" newrelic.js && \
    sed -i -e "s/license key here/bfd914d5ba7547c9cde63fa98a79a88e7bfa5e7b/g" newrelic.js && \
    sed -i -e 's/const hapi/require("newrelic");\nconst hapi/g' server.js && \
    sed -i -e 's/  host: 'localhost',//g' server.js

# Production settings
EXPOSE 9000
CMD npm start
