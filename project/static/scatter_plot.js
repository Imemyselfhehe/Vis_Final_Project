
drawScatterPlot();
function drawScatterPlot(){
    var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#scatterplot")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    //Read the data
    d3.csv("get_inventory_csv", function(data) {
        console.log(data)

    // Add X axis
    var x = d3.scaleLinear()
        // .domain([0, 4000])
        .domain([0,d3.max(data.map(function(d) { return d.new_listing_count; }))])
        .range([ 0, width ]);

    // svg.append("text")
    // .attr("class", "axis_label")
    // .attr("text-anchor", "middle")
    // .attr("transform", "translate("+ (-70) +","+(height/2)+")rotate(-90)")
    // .text("Active Listing Count")
    // .attr("font-size", 14);


    // var h = parseInt(height) + 100;

    // svg.append("text")
    // .attr("class", "axis_label")
    // .attr("text-anchor", "middle")
    // .attr("transform", "translate("+ (width/2) +","+(h)+")")
    // .text("New Listing Count")
    // .attr("font-size", 14);


    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0,d3.max(data.map(function(d) { return d.price_increased_count; }))])
        .range([ height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    // Add dots
    svg.append('g')
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return x(d.new_listing_count); } )
        .attr("cy", function (d) { return y(d.price_increased_count); } )
        .attr("r", 1.5)
        // .style("fill", "#69b3a2")
        .style("fill", "#957DAD")

        
    })
}