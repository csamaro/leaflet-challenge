// get data from the past week

let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Create basic map
let myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
  });
// add title layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

function onEachFeature(feature, layer) {
    let depth = feature.geometry.coordinates[2]
    let magnitude = feature.properties.mag
    let places = feature.properties.place
    let date = (new Date(feature.properties.time))
    layer.bindPopup(`<text><b>Magnitude</b>: ${magnitude}</text><br>
                     <text><b>Location</b>: ${places}</text><br>
                     <text><b>Depth</b>: ${depth}km</text><br>
                     <text><b>Time</b>: ${date}`)
}

function marks(feature, latlng) {
    return L.circleMarker(latlng, {
        radius: markerSize(feature.properties.mag),
        fillColor: circColor(feature.geometry.coordinates[2]),
        opacity: .5,
        color: circColor(feature.geometry.coordinates[2]),
        weight: .25,
        fillOpacity: 0.3
    })
}

function markerSize(magnitude){
    return magnitude*8;
}

function circColor(depth){
    if (depth < 0){
        return "yellow";
    }
    if (depth < 5){
        return "lightgreen";
    }
    else if (depth < 10){
        return "pink";
    }
    else if (depth < 20){
        return "red";
    }
    else if (depth < 40){
        return "purple"
    }
    else if (depth < 70){
        return "grey"
    }
    else {
        return "black";
    }

}

// call our data from the url
d3.json(url).then(function(data){
    console.log(data)

    // create map markers
    L.geoJSON(data,
        {
        onEachFeature:onEachFeature,
        pointToLayer:marks
        }).addTo(myMap)

    //Create a Legend
    let legend = L.control({ position: "bottomright" });
    // Define legend attributes and HTML inserts
    // Refer to CSS for additional legend attributes
    legend.onAdd = function(){
        let div = L.DomUtil.create("div","info legend")

        // Legend header
        div.innerHTML += `<h4>Depth (km)</h4><br>`

        // Legend contents
        let labels = [];
        let depths = ["-10-0","0-5","5-10","10-20","20-40","40-70","70+"];
        let colorCat = ["yellow", "lightgreen", "pink", "red", "purple", "grey", "black"];

        for (const i in depths)
        {
            labels.push("<li> <i style=\"background-color: " + (colorCat[i] ? colorCat[i] : '+') + "\">__</i> "
            + (depths[i] ? depths[i] : '+')
            + "</li>"); 
        }
        div.innerHTML = labels.join('<br>');
        return div
    }

    // Add legend to map
    legend.addTo(myMap)

});