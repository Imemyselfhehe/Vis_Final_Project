//document.getElementById("1").classList.add('active');
geomapFlask('median_listing_price' , null);

function geoMap(feature , data) {
	if(document.getElementById("geomap") != null) 
        document.getElementById("geomap").innerHTML = "";

	var child_lis = document.querySelectorAll('.side-li');
	for (var i = 0; i < child_lis.length; i++) {
		child_lis[i].classList.remove('active');
		child_lis[i].classList.add('link-dark');
	}

	var clicked_id = feature;

	const clicked = document.getElementById(clicked_id);
	clicked.classList.add("active");
	clicked.classList.remove("link-dark");

//Width and height of map
		// var margin = {top: 50, right: 10, bottom: 30, left: 150},
    	// 	width = 1100 - margin.left - margin.right,
    	// 	height = 550 - margin.top - margin.bottom;
		var width = "80%";
		var height = "100%";


var lowColor = '#f9f9f9'
var highColor = '#bc2a66'


// D3 Projection
var projection = d3.geoAlbersUsa()
  .translate([200, 200]) // translate to center of screen
  .scale([550]); // scale things down so see entire US

// Define path generator
var path = d3.geoPath() // path generator that will convert GeoJSON to SVG paths
  .projection(projection); // tell path generator to use albersUsa projection
	//d3.select("svg").remove();
//Create SVG element and append map to the SVG

d3.selectAll("#geomap svg").remove();

var svg = d3.select("#geomap")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

//var feature = "median_listing_price";
// Load in my states data!
//d3.csv("get_inventory_csv", function(data) {
	var dataArray = [];
	for (var d = 0; d < data.length; d++) {
		dataArray.push(parseFloat(data[d][feature]))
	}
	var minVal = d3.min(dataArray)
	var maxVal = d3.max(dataArray)
	var ramp = d3.scaleLinear().domain([minVal,maxVal]).range([lowColor,highColor])
	
  // Load GeoJSON data and merge with states data
  d3.json("https://raw.githubusercontent.com/AmitD26/Air-pollution-analytics/master/static/us-states.json", function(json) {

    // Loop through each state data value in the .csv file
    for (var i = 0; i < data.length; i++) {

      // Grab State Name
      var dataState = data[i].state;
      // Grab data value 
      var dataValue = data[i][feature];

      //console.log(dataState);
      //console.log(dataValue);

      // Find the corresponding state inside the GeoJSON
      for (var j = 0; j < json.features.length; j++) {
        var jsonState = json.features[j].properties.name;

        if (dataState.toLowerCase() == jsonState.toLowerCase()) {

          // Copy the data value into the JSON
          json.features[j].properties.value = dataValue;



          // Stop looking through the JSON
          break;
        }
      }
    }


    // Bind the data to the SVG and create one path per GeoJSON feature
    svg.selectAll("path")
      .data(json.features)
      .enter()
      .append("path")
      .attr("d", path)
	  .attr("name", function(d) { return d.properties.name;})
	  .attr("id", function(d) { return d.id;})
      .style("stroke", "#fff")
      .style("stroke-width", "1")
      .style("fill", function(d) { return ramp(d.properties.value) })
	  //.on("mouseover", mouseover)
	  //.on("mouseout", mouseOutHandler)
	  .on("click", clicked );

	  function clicked(d) {
		label = d.properties.name;
		SelectState(label);
	  }
	    
		// add a legend
		var w = 80, h = 300;

		var key = d3.select("#geomap")
			.append("svg")
			.attr("width", w)
			.attr("height", h)
			.attr("class", "legend");

		var legend = key.append("defs")
			.append("svg:linearGradient")
			.attr("id", "gradient")
			.attr("x1", "100%")
			.attr("y1", "0%")
			.attr("x2", "100%")
			.attr("y2", "100%")
			.attr("spreadMethod", "pad");

		legend.append("stop")
			.attr("offset", "0%")
			.attr("stop-color", highColor)
			.attr("stop-opacity", 1);
			
		legend.append("stop")
			.attr("offset", "100%")
			.attr("stop-color", lowColor)
			.attr("stop-opacity", 1);

		key.append("rect")
			.attr("width", w - 55)
			.attr("height", h)
			.style("fill", "url(#gradient)")
			.attr("transform", "translate(5,10)");

		var y = d3.scaleLinear()
			.range([h, 0])
			.domain([minVal, maxVal]);

		var yAxis = d3.axisRight(y);

		key.append("g")
			.attr("class", "y axis")
			.attr("transform", "translate(30,10)")
			.call(yAxis)
  });
//});

}

function geomapFlask( id, date ){
    let url = "http://127.0.0.1:5000/geomap"
    // const data = { request: 'example' };
  
    fetch(url, {
      method: 'POST', // or 'PUT'
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ req: 'geomapPlot' , 'date' : date ,  'id' : id }),
  })
      .then(data => data.json())
      .then(response => {
        geomapData = JSON.parse(response.geomapPlotData);
		id = response.id;
		//feature = response.feature;
        geoMap(id , geomapData);
      });
  }