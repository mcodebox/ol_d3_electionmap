// OpenLayers Map -------------------------------------
var map = new ol.Map({
  view: new ol.View({
    center: [1163030.7515295409, 6650243.907942198],
    zoom: 6
  }),
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM({})
    })
  ],
  controls: []
});
map.setTarget('js-map');
// Zoom Buttons
var zoomButtons = new ol.control.Zoom();
map.addControl(zoomButtons);
// Attribution
map.addControl(new ol.control.Attribution({
  collapsible: true
}));
// Scale Line -------------------------------------
var scaleBar = new ol.control.ScaleLine({
  units: 'metric',
});
map.addControl(scaleBar);
// geoJSON Layer -------------------------------------
var b_laender = new ol.layer.Vector({
  source: new ol.source.Vector({
    url: 'data/b_laender.geojson',
    format: new ol.format.GeoJSON()
  })
});
map.addLayer(b_laender);

// Popup -------------------------------------
// Popup elements
var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');
// Popup overlay
var popupOverlay = new ol.Overlay( /** @type {olx.OverlayOptions} */ ({
  element: container,
  autoPan: true,
  autoPanAnimation: {
    duration: 1000
  }
}));
// Popup close button
closer.onclick = function() {
  popupOverlay.setPosition(undefined);
  closer.blur();
  return false;
};
// map.addOverlay(popupOverlay);

// select Layer -------------------------------------
var selectClick = new ol.interaction.Select({
  condition: ol.events.condition.click
});
map.addInteraction(selectClick);

// Indicator if chart is already created -------------------------------------
var chartCreated = "no";
// Indicator if there is a feature on click -------------------------------------
var featureAvailable = "no";

// Show data function -------------------------------------
var displayFeatureInfo = function(pixel) {

  // Get feature at clicked pixel in map
  var feature = map.forEachFeatureAtPixel(pixel, function(feature) {
    return feature;
  });

  if (feature) {
    featureAvailable = "yes";
  } else {
    featureAvailable = "no";
  }

  // Create dataset -------------------------------------
  var dataset;
  var ergCDU;
  var ergSPD;
  var ergGRN;
  var ergLNK;
  var ergSNS;

  if (feature) {
    ergCDU = ergebnisse[(feature.getId())]["CDU/CSU"];
    ergSPD = ergebnisse[(feature.getId())].SPD;
    ergGRN = ergebnisse[(feature.getId())].GRUENE;
    ergLNK = ergebnisse[(feature.getId())].LINKE;
    ergSNS = ergebnisse[(feature.getId())].Sonstige;

    dataset = [{
        label: 'CDU/CSU',
        count: ergCDU
      },
      {
        label: 'SPD',
        count: ergSPD
      },
      {
        label: 'B90/DIE GRÜNEN',
        count: ergGRN
      },
      {
        label: 'DIE LINKE',
        count: ergLNK
      },
      {
        label: 'Sonstige',
        count: ergSNS
      }
    ];

  }


  // Update Info -------------------------------------
  var info = document.getElementById('infoboxdiv');
  if (feature) {
    info.innerHTML = "(ID: " + feature.getId() + ") " + feature.get('NAME_1');
  } else {
    info.innerHTML = "";
  }

  // Update Ergebnisse -------------------------------------
  if (feature) {
    // Ergebnisdiv
    ergebnissediv.innerHTML = "CDU/CSU: " + ergCDU +
      "%, SPD: " + ergSPD + "%, B90/DIE GRÜNEN: " + ergGRN + "%, DIE LINKE: " + ergLNK +
      "%, Sonstige: " + ergSNS + "%";
  } else {
    ergebnissediv.innerHTML = "";
  }

  // Pie Chart settings -------------------------------------
  var pieWidth = 260;
  var pieHeight = 260;
  var pieRadius = Math.min(pieWidth, pieHeight) / 2;
  var pieColor = d3.scaleOrdinal()
    .range(['#191919', '#CC0001', '#80B11A', '#C4598B', '#B2B2B2']);

  // Arc/Radius for the pie
  var arc = d3.arc()
    .innerRadius(0)
    .outerRadius(pieRadius);

  // Arc/Radius for the labels
  var labelArc = d3.arc()
    .outerRadius(pieRadius - 60)
    .innerRadius(pieRadius - 60);

  // Create Pie Chart Function -------------------------------------
  var createChart = function() {

    // remove old chart (if there is one)
    d3.select("svg").remove();

    // append new chart
    var svg = d3.select('#piechartdiv')
      // var svg = d3.select('#popup-content')
      .append('svg')
      .attr('width', pieWidth)
      .attr('height', pieHeight)
      .append('g') // g element that centers the chart
      .attr('transform', 'translate(' + (pieWidth / 2) + ',' + (pieHeight / 2) + ')'); // moving the center point

    // start and end angles of each segment
    var pie = d3.pie()
      .value(function(d) {
        return d.count;
      })
      .sort(null);

    var path = svg.selectAll('path')
      .data(pie(dataset))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', function(d, i) {
        return pieColor(d.data.label);
      })
      .each(function(d) {
        this._current = d;
      }); // store the initial angles;

    // Labels
    svg.selectAll('arc')
      .data(pie(dataset))
      .enter()
      .append("text")
      .attr("transform", function(d) {
        return "translate(" + labelArc.centroid(d) + ")";
      })
      .text(function(d) {
        return "\u2022 " + d.data.label;
      })
      .style("fill", "#fff")
      .style("font-family", "Verdana")
      .style("font-size", "10px")
      .each(function(d) {
        this._current = d;
      }); // store the initial angles;

  };


  // Update/Change Chart function-------------------------------------
  function changeChart() {

    var pie = d3.pie()
      .value(function(d) {
        return d.count;
      })(dataset);
    path = d3.select("#piechartdiv").selectAll("path").data(pie); // compute new angles
    path.transition().duration(500).attrTween("d", arcTween); // Smooth transition with arcTween

    d3.selectAll("text").data(pie).transition().duration(500).attrTween("transform", labelarcTween); // Smooth transition with labelarcTween
  }

  // Transition Functions
  function arcTween(a) {
    var i = d3.interpolate(this._current, a);
    this._current = i(0);
    return function(t) {
      return arc(i(t));
    };
  }

  function labelarcTween(a) {
    var i = d3.interpolate(this._current, a);
    this._current = i(0);
    return function(t) {
      return "translate(" + labelArc.centroid(i(t)) + ")";
    };
  }

  // Execute Chart functions-------------------------------------
  if (feature && chartCreated == "no") {
    createChart();
    chartCreated = "yes";
    console.log("Chart created.");
  } else if (feature && chartCreated == "yes") {
    changeChart();
    console.log("Chart updated.");
  } else {
    piechartdiv.innerHTML = "";
    chartCreated = "no";
    console.log("Chart removed.");
  }

};

var testVar = document.getElementById('infoboxdiv');

// Use show data function on click
map.on('click', function(evt) {
  displayFeatureInfo(evt.pixel);

  if (featureAvailable == "yes") {
    map.addOverlay(popupOverlay);
    var coordinate = evt.coordinate;

    var theInfo = document.getElementById('infoboxdiv');
    var thePie = document.getElementById('piechartdiv');

    document.getElementById('infoboxdiv').align = 'center';
    document.getElementById('ergebnissediv').align = 'center';

    content.appendChild(theInfo);
    content.appendChild(thePie);

    popupOverlay.setPosition(coordinate);
  } else {
    closer.onclick();
  }
});
