FROM node:6-slim
MAINTAINER Roy Meissner <roy-meissner@gmx.net>

RUN mkdir /nodeApp
WORKDIR /nodeApp

ADD ./package.json ./
RUN npm install && npm install newrelic

ADD ./ ./

# Install NewRelic Agent
RUN cp ./node_modules/newrelic/newrelic.js ./ && \
    sed -i -e "s/My Application/Academical MicroService/g" newrelic.js && \
    sed -i -e "s/license key here/123456789/g" newrelic.js && \
    sed -i -e 's/const hapi/require("newrelic");\nconst hapi/g' server.js && \
    sed -i -e 's?  host?//  host?g' server.js

# Production settings
EXPOSE 9000
CMD npm start
