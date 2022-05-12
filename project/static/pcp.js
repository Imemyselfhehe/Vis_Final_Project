var variables = [];

PCPPlotFlask( null , null );
function drawPCPPlot(data) {
  		var margin = {top: 50, right: 30, bottom: 30, left: 250},
    		width = 850 - margin.left - margin.right,
    		height = 300 - margin.top - margin.bottom;

    d3.selectAll("#pcp svg").remove();	
    //d3.selectAll("table").remove();
    // $('body>.tooltip').remove();

var svg = d3.select("#pcp").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");	
        
var color = d3.scaleOrdinal(d3.schemeCategory10);
if(variables.length == 0){
dimensions = Object.keys(data[0]);
dimensions.splice(dimensions.indexOf("year") , 1 )
dimensions.splice(dimensions.indexOf("state") , 1 )
}else{
  dimensions = variables;
}

var y = {}
  for (i in dimensions) {
    name = dimensions[i]
    if(name == "State" || name == "County" || name == "City"){
      var temp = d3.nest()
                .key(function(d) { return d[name]; })
                .rollup(function(v) { return v.length; })
                 .entries(data);


      var values = temp.map(function(object){ return object.key;});
      y[name] =  d3.scalePoint()
      .range([height, 0])
      .domain(values);
    } else{
    y[name] = d3.scaleLinear()
      .domain([d3.min(data, function(d) { return d[name];}), d3.max(data, function(d) { return d[name];})])
      .range([height, 0])
    }
  }
  x = d3.scalePoint()
    .range([0, width])
    .domain(dimensions);
    
    var highlight = function(d){

    selected_specie = d.K_Means

    d3.selectAll(".line")
      .transition().duration(200)
      .style("stroke", "lightgrey")
      .style("opacity", "0.2")

    d3.selectAll(".a" + selected_specie)
      .transition().duration(200)
      .style("stroke", color(selected_specie))
      .style("opacity", "1")
  } 
    var doNotHighlight = function(d){
    d3.selectAll(".line")
      .transition().duration(200).delay(1000)
      .style("stroke", function(d){ return( color(d.K_Means))} )
      .style("opacity", "1")
  }

  function path(d) {
      return d3.line()(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
  }

  svg
    .selectAll("myPath")
    .data(data)
    .enter()
    .append("path")
      .attr("class", function (d) { return "line a" + d.K_Means } ) // 2 class for each line: 'line' and the group name
      .attr("d",  path)
      .style("fill", "none" )
      .style("stroke", function(d){ return( color(d.K_Means))} )
      .style("opacity", 0.5)
      .on("mouseover", highlight)
      .on("mouseleave", doNotHighlight )


  svg.selectAll("myAxis")
    .data(dimensions).enter()
    .append("g")
    .attr("class", "axis")
    .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
    .each(function(d) { d3.select(this).call(d3.axisLeft().ticks(5).scale(y[d])); })
    .append("text")
    //.attr("font-size", 20)
      .style("text-anchor", "middle")
      .attr("y", -9)
      .text(function(d) { return d; })
      .style("fill", "black")
      //.attr("font-size", 30);
      .style("font-size", "7px")

  variables = [];
 
}

// function PCPPlotFlask() {
//     $.post("", {
//         'request': 'PCPPlot'
//     }, function(result) {
//         PCPPlotData = JSON.parse(result.PCPPlotData);
//         drawPCPPlot(PCPPlotData);
//     })
// }


function PCPPlotFlask(  feature , value ){
  let url = "http://127.0.0.1:5000/pcp"
  // const data = { request: 'example' };

  fetch(url, {
    method: 'POST', // or 'PUT'
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ req: 'PCPPlot' , 'feature' : feature, 'value' : value}),
})
    .then(data => data.json())
    .then(response => {
      PCPPlotData = JSON.parse(response.PCPPlotData);
      drawPCPPlot(PCPPlotData);
    });
}