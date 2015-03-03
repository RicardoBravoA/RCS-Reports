/* 
Ejm:
var chartData = [];
var year ="2013";
        var visits = Math.round(Math.random() * 10000 - 50);

        chartData.push({
            year: year,
            visits: visits
        });

*/

var chartData = [
    {
        "year": "2013",
        "duration": Math.round(Math.random() * 10000 - 50)
    },
    {
        "year": "2014",
        "duration": Math.round(Math.random() * 10000 - 50)
    },
    {
        "year": "2015",
        "duration": Math.round(Math.random() * 10000 - 50)
    }
];
var chart = AmCharts.makeChart("chartdiv-1", {
 theme: "none",
  type: "serial",
  dataDateFormat: "YYYY",
  dataProvider: chartData,

  addClassNames: true,
  startDuration: 0,
  color: "#f1f1f1",
  marginLeft: 0,

  categoryField: "year",

  valueAxes: [{
    id: "a3",
    position: "right",
    gridAlpha: 0,
    axisAlpha: 0,
    inside: true,
    ignoreAxisWidth: true
  }],
  graphs: [{
    id: "g3",
    valueField: "duration",
    type: "line",
    lineColor: "#fff",
    balloonText: "[[category]]<br><b>[[value]]</b>",
    lineThickness: 2,
    bullet: "round",
    bulletBorderColor: "#f1f1f1",
    bulletBorderThickness: 2,
    bulletBorderAlpha: 1,
    dashLengthField: "dashLength",
    animationPlayed: true
  }],

  chartCursor: {
    zoomable: false,
    categoryBalloonDateFormat: "YYYY",
    cursorAlpha: 0,
    cursorPosition: "mouse",
    valueBalloonsEnabled: false,
    valueLineEnabled:true,
    valueLineBalloonEnabled:true
  }
});

var chartData2 = [
    {
        "year": "2013",
        "duration": Math.round(Math.random() * 10000 - 50)
    },
    {
        "year": "2014",
        "duration": Math.round(Math.random() * 10000 - 50)
    },
    {
        "year": "2015",
        "duration": Math.round(Math.random() * 10000 - 50)
    }
];
var chart = AmCharts.makeChart("chartdiv-2", {
 theme: "none",
  type: "serial",
  dataDateFormat: "YYYY",
  dataProvider: chartData2,

  addClassNames: true,
  startDuration: 0,
  color: "#f1f1f1",
  marginLeft: 0,

  categoryField: "year",

  valueAxes: [{
    id: "a3",
    position: "right",
    gridAlpha: 0,
    axisAlpha: 0,
    inside: true,
    ignoreAxisWidth: true
  }],
  graphs: [{
    id: "g3",
    valueField: "duration",
    type: "line",
    lineColor: "#fff",
    balloonText: "[[category]]<br><b>[[value]]</b>",
    lineThickness: 2,
    bullet: "round",
    bulletBorderColor: "#f1f1f1",
    bulletBorderThickness: 2,
    bulletBorderAlpha: 1,
    dashLengthField: "dashLength",
    animationPlayed: true
  }],

  chartCursor: {
    zoomable: false,
    categoryBalloonDateFormat: "YYYY",
    cursorAlpha: 0,
    cursorPosition: "mouse",
    valueBalloonsEnabled: false,
    valueLineEnabled:true,
    valueLineBalloonEnabled:true
  }
});

var chartData3 = [
    {
        "year": "2013",
        "duration": Math.round(Math.random() * 10000 - 50)
    },
    {
        "year": "2014",
        "duration": Math.round(Math.random() * 10000 - 50)
    },
    {
        "year": "2015",
        "duration": Math.round(Math.random() * 10000 - 50)
    }
];
var chart = AmCharts.makeChart("chartdiv-3", {
 theme: "none",
  type: "serial",
  dataDateFormat: "YYYY",
  dataProvider: chartData2,

  addClassNames: true,
  startDuration: 0,
  color: "#f1f1f1",
  marginLeft: 0,

  categoryField: "year",

  valueAxes: [{
    id: "a3",
    position: "right",
    gridAlpha: 0,
    axisAlpha: 0,
    inside: true,
    ignoreAxisWidth: true
  }],
  graphs: [{
    id: "g3",
    valueField: "duration",
    type: "line",
    lineColor: "#fff",
    balloonText: "[[category]]<br><b>[[value]]</b>",
    lineThickness: 2,
    bullet: "round",
    bulletBorderColor: "#f1f1f1",
    bulletBorderThickness: 2,
    bulletBorderAlpha: 1,
    dashLengthField: "dashLength",
    animationPlayed: true
  }],

  chartCursor: {
    zoomable: false,
    categoryBalloonDateFormat: "YYYY",
    cursorAlpha: 0,
    cursorPosition: "mouse",
    valueBalloonsEnabled: false,
    valueLineEnabled:true,
    valueLineBalloonEnabled:true
  }
});
var chart = AmCharts.makeChart("chartdiv-4", {
 theme: "none",
  type: "serial",
  dataDateFormat: "YYYY",
  dataProvider: chartData2,

  addClassNames: true,
  startDuration: 0,
  color: "#f1f1f1",
  marginLeft: 0,

  categoryField: "year",

  valueAxes: [{
    id: "a3",
    position: "right",
    gridAlpha: 0,
    axisAlpha: 0,
    inside: true,
    ignoreAxisWidth: true
  }],
  graphs: [{
    id: "g3",
    valueField: "duration",
    type: "line",
    lineColor: "#fff",
    balloonText: "[[category]]<br><b>[[value]]</b>",
    lineThickness: 2,
    bullet: "round",
    bulletBorderColor: "#f1f1f1",
    bulletBorderThickness: 2,
    bulletBorderAlpha: 1,
    dashLengthField: "dashLength",
    animationPlayed: true
  }],

  chartCursor: {
    zoomable: false,
    categoryBalloonDateFormat: "YYYY",
    cursorAlpha: 0,
    cursorPosition: "mouse",
    valueBalloonsEnabled: false,
    valueLineEnabled:true,
    valueLineBalloonEnabled:true
  }
});