// Load the GeoJSON data.
var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


// Get the data with d3.
d3.json(queryURL).then(function(data){
    createFeatures(data.features);
  });

// Create a createFeatures function to build the markers
function createFeatures(earthquakeData) {
  
   // Add a popup to the markers with magnitude, location and depth of each earthquake
  function onEachFeature(feature, layer){
    layer.bindPopup("<h3>Magnitude: " + feature.properties.mag + "<br />Location: " + feature.properties.place + "<br />Depth: " + feature.geometry.coordinates[2] + "</h3>");
  }
  
  // Create a createMarker function and set the design for the markers
  function createMarker (feature, latlng) {
    let earthquakeMagnitude = feature.properties.mag
    let earthquakeDepth = feature.geometry.coordinates[2];

    let iconDetails = {
      radius:earthquakeMagnitude*3,
      fillColor: markerColors(earthquakeDepth),
      color: markerColors(earthquakeDepth),
      weight: 1,
      fillOpacity: 0.5
    }
    return L.circleMarker(latlng,iconDetails);
  }
  
// Create an earthquakes variable to hold latlng and build the layer content
let earthquakes = L.geoJSON(earthquakeData, {
  onEachFeature: onEachFeature,
  pointToLayer: createMarker
});

    // Add the earthquakes layer using the createMap function to be called later
    createMap(earthquakes);
}

// Create a function to define the colours to use for markers based on the earthquake depth
function markerColors(earthquakeDepth){
  switch(true){
      case(1 <= earthquakeDepth && earthquakeDepth <5):
          return "#2E86C1";
      case (5 <= earthquakeDepth && earthquakeDepth <10):
          return "#1ABC9C";
      case (10 <= earthquakeDepth && earthquakeDepth <20):
          return "#2ECC71";
      case (20 <= earthquakeDepth && earthquakeDepth <50):
          return "#F7DC6F";
      case (50 <= earthquakeDepth && earthquakeDepth <150):
          return "#D35400";
      case (150 <= earthquakeDepth):
          return "#E74C3C";
      default:
          return "#9B59B6";
  }
}

  // Create a legend
  let legend = L.control({position: "bottomright"});

  legend.onAdd = function() {
    let div = L.DomUtil.create("div", "legend");
    let grades = [1.0, 5.0, 10.0, 20.0, 50.0, 150.0];
    let labels = [];
  
    // Add a title for the legend
    let legendInfo = '<h3 style="text-align: right;">Magnitude</h3>';

    div.innerHTML = legendInfo

    // Create the labels for the legend based on the bands and colours defined above
    for (var i = 0; i < grades.length; i++) {
      labels.push('<ul style="text-align: right; font-size: 18px; background-color:' + markerColors(grades[i] + 1) + '"> <span>' + grades[i] + (grades[i + 1] ? ' &ndash; ' + grades[i + 1] + '' : '+') + '</span></ul>');
    }

    // Add the labels to the legend
    div.innerHTML += "<ul>" + labels.join("") + "</ul>";

    return div;
  };

  // Create the createMap function to build the map
  function createMap(earthquakes) {

    // Create the tile layer that will be the background of our map
    let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
  
  
    // Create a baseMaps object to hold the streetmap layer
    let baseMaps = {
      "Street Map": streetmap
    };
  
    // Create an overlayMaps object to hold the bikeStations layer
    let overlayMaps = {
      "Earthquakes": earthquakes
    };
  
    // Create the map object with options
    let myMap = L.map("map", {
      center: [50, 20],
      zoom: 3,
      layers: [streetmap, earthquakes]
    });
  
    // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
    legend.addTo(myMap);
  }
  


