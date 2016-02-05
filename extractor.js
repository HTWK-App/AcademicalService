'use strict';

const cheerio = require('cheerio');
const request = require('request');
const server = require('./server');

let ws = {},
  ss = {},
  retry = false;

module.exports = {
  getCalender: function(semester) {
    switch (semester) {
      case "ss":
        return ss;
      case "ws":
        return ws;
      default:
        return null;
    }
  },

  fillCalender: function() {
    retry = false;

    request('https://www.htwk-leipzig.de/de/studierende/aktuelles-kalender/akademischer-kalender/sommersemester/', (error, response, body) => {
      if (!error && response.statusCode === 200) {
        extractInfo(body, "ss");
      } else {
        server.log('info', error);
        failed();
      }
    });

    request('https://www.htwk-leipzig.de/de/studierende/aktuelles-kalender/akademischer-kalender/wintersemester/', (error, response, body) => {
      if (!error && response.statusCode === 200) {
        extractInfo(body, "ws");
      } else {
        server.log('info', error);
        failed();
      }
    });
    //onece per day
    setTimeout(module.exports.fillCalender, 86400000);
  }
};

function extractInfo(data, toSave) {
  try {
    let $ = cheerio.load(data);
    let semester = extractSemester($);
    let outage = extractOutage($);
    let checkback = extractCheckback($);
    let importantDates = extractImportantDates($);
    let applicationDates = extractApplicationDates($);
    let saveTo = "";
    saveTo = toSave === "ws" ? ws : ss;
    Object.assign(saveTo, semester, outage, checkback, importantDates, applicationDates);
  } catch (e) {
    server.log('error', e);
    failed();
  }
}

function extractSemester($) {
  let sem = $('#content').children().eq(1);
  let last = "";
  let value = sem.find('tr').toArray().map((tr) => {
    let prefix = $(tr).children().first().text();
    last = prefix !== "" ? prefix : last;
    return last + " " + $(tr).children().last().text();
  });
  let key = sem.find('h2').text();
  let result = {};
  result[key] = value;
  return result;
}

function extractOutage($) {
  let sem = $('#content').children().eq(2);
  let last = "";
  let value = sem.find('tr').toArray().map((tr) => {
    let prefix = $(tr).children().last().text();
    let suffix = $(tr).children().first().text();
    last = prefix !== "" ? prefix : last;
    if (suffix === "")
      return;
    else
      return last + ": " + suffix;
  });
  value = value.filter((a) => a !== undefined);
  let key = sem.find('h3').text();
  let result = {};
  result[key] = value;
  return result;
}

function extractCheckback($) {
  let h3 = $('h3:contains("Einschreib- und Rückmeldetermine")');
  let index = $('#content').children().index(h3.parent());
  let h3Next = $('h3:contains("Weitere wichtige Termine")');
  let indexNext = $('#content').children().index(h3Next.parent());
  let key = h3.text();
  let values = [];
  for (var i = index + 1; i < indexNext; i++) {
    values = values.concat($('#content').children().eq(i).find('tr').toArray());
  }
  values = values.map((tr) => {
    let prefix = $(tr).children().last().text();
    let suffix = $(tr).children().first().text();
    return prefix + ": " + suffix;
  });
  let result = {};
  result[key] = values;
  return result;
}

//This is so damn hacky.....but due to the bad structure of the page, it has to be done this way.
function extractApplicationDates($) {
  let h3 = $('h3:contains("Bewerbungstermine")');
  let index = $('#content').children().index(h3.parent());
  let indexNext = $('#content').children().length - 1;
  let key = h3.text();
  let values = [];
  for (var i = index + 1; i < indexNext; i++) {
    values = values.concat($('#content').children().eq(i).find('tr').toArray());
  }
  values = values.map((tr) => {
    //hack to replace <br> with space
    let prefix = cheerio.load('<div>' + $(tr).children().last().html().replace('<br>', " ") + '</div>')('div').text();
    let suffix = $(tr).children().first().text();
    return prefix + ": " + suffix;
  });
  let result = {};
  result[key] = values;
  return result;
}

//This is so damn hacky.....but due to the bad structure of the page, it has to be done this way.
function extractImportantDates($) {
  let h3 = $('h3:contains("Weitere wichtige Termine")');
  let index = $('#content').children().index(h3.parent());
  let h3Next = $('h3:contains("Bewerbungstermine")');
  let indexNext = $('#content').children().index(h3Next.parent());
  let key = h3.text();
  let values = [];
  for (var i = index + 1; i < indexNext; i++) {
    values = values.concat($('#content').children().eq(i).find('tr').toArray());
  }
  values = values.map((tr) => {
    let prefix = $(tr).children().last().text();
    let suffix = $(tr).children().first().text();
    return prefix + ": " + suffix;
  });
  let result = {};
  result[key] = values;
  return result;
}

function failed() {
  if (retry !== true) {
    server.log('info','Retry to extract data in 1 minute');
    setTimeout(module.exports.fillCalender, 60000);
    retry = true;
  }
}
