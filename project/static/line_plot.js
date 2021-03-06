  

lineplotFlask(null , null);
function new_lineplot(data){

var margin = {top: 5, right: 30, bottom: 70, left: 40},
    // var margin = {top: 0, right: 0, bottom: 0, left: 0};
width = 350 - margin.left - margin.right,
height = 400 - margin.top - margin.bottom;

//$('body>.tooltip').remove();
d3.selectAll("#lineplot svg").remove();
var svg = d3.select("#lineplot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    // .attr("max-height", "100%")
    // .attr("max-width", "100%")
    .attr("style", "max-height: 100%; max-width: 100%;")
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");
    //console.log(svg)
    // Parse the Data


//d3.csv("get_inventory_csv", function(data) {

var x = d3.scaleLinear()
.range([0, width])
.domain([1, 12 ]);

var nsum = d3.nest()
.key(function(d) { return d.month; })
.rollup(function(v) { return d3.sum(v, function(d) { return d.median_listing_price; }); })
.entries(data);

var y = d3.scaleLinear().range([height, 0])
.domain([0, d3.max(nsum, function(d) {  return parseInt(d.value); })/1000000]);


svg.append("path")
.datum(nsum)
.attr("fill", "#cce5df")
.attr("stroke", "#69b3a2")
.attr("stroke-width", 1.5)
.attr("d", d3.area()
  .x(function(d , i) { return x( i+1 ) })
  .y0(y(0))
  .y1(function(d) { return y((parseInt(d.value))/1000000); })
  )

svg.append("g")
.attr("transform", "translate(0," + height + ")")
.call(d3.axisBottom(x));

svg.append("text")
.attr("text-anchor", "middle")
.attr("transform", "translate(170,0)")
.attr("x", width-300)
.attr("y", height+30)
.text("Months")
.attr("font-size", 14);

svg.append("g")
.call(d3.axisLeft(y));

svg.append("text")
.attr("text-anchor", "middle")
.attr("font-size", "12px")
.attr("x", -130)
.attr("y", -30)
.attr("transform", "rotate(-90)")
.text("Median Listing Price (in Millions)")
.attr("font-size", 14);

       
//svg.append("text")
// .attr("transform", "translate(100,0)")
//.attr("x", 350)
//.attr("y", -10)
//.attr("text-anchor", "middle")
//.attr("font-size", "24px")
//.text("Elbow Plot");


//});

}
function lineplotFlask( feature , value ){
    let url = "http://127.0.0.1:5000/lineplot"
    // const data = { request: 'example' };
  
    fetch(url, {
      method: 'POST', // or 'PUT'
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ req: 'linePlot' , 'feature' : feature  , 'value' : value }),
  })
      .then(data => data.json())
      .then(response => {
        lineplotData = JSON.parse(response.lineplotData);
        new_lineplot(lineplotData);
      });
  }
