
function calculate_bins(n_bins, data){
    var bin_width = data.length / n_bins;
    var current_bin = bin_width;
    let hist_data = [];

    let bins_x = [];
    for(b = 0; b < n_bins; b++){
        last_bin = parseInt(current_bin) - parseInt(bin_width);
        bins_x[b] = last_bin + " - " + parseInt(current_bin);
        hist_data[b] = 0
        for(i = 0; i < data.length; i ++){
            if(data[i].median_square_feet >= last_bin && data[i].median_square_feet < current_bin){
                hist_data[b] = parseInt(hist_data[b]) + parseInt(data[i].active_listing_count);
            }
        }
        current_bin += bin_width;
    }
    return {bins_x,hist_data};
}

//barchart();
barFlask( null , null );
function new_barchart( data ){
    
        // set the dimensions and margins of the graph
    var margin = {top: 30, right: 30, bottom: 70, left: 80},
    // var margin = {top: 0, right: 0, bottom: 0, left: 0};
    width = 450 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
    // var width = "350";
	// var height = "300";

    // append the svg object to the body of the page
    console.log(data);

    d3.selectAll("#barchart svg").remove();

    var svg = d3.select("#barchart")
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
        n_bins = 20;
        var {bins_x,hist_data} = calculate_bins(n_bins,data)
        // X axis
        data_new = [];
        for(i = 0 ; i < n_bins; i ++){
            data_new.push({
                median_sq_feet: bins_x[i],
                atv_listing_ct: hist_data[i],
            });
        }
        var x = d3.scaleBand()
        .range([ 0, width ])
        //.domain(data.map(function(d) { return d.Country; }))
        .domain(data_new.map(function(d) { return d.median_sq_feet; }))
        .padding(0.2);

        svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

        // Add Y axis
        var y = d3.scaleLinear()
        .domain([0, d3.max(hist_data)])
        .range([ height, 0]);
        svg.append("g")
        .call(d3.axisLeft(y));

        // Bars
        svg.selectAll("mybar")
        .data(data_new)
        .enter()
        .append("rect")
        // .attr("x", function(d) { return x(d.Country); })
        .attr("x", function(d) { return x(d.median_sq_feet); })
        .attr("y", function(d) { return y(d.atv_listing_ct); })
        //.attr("y", function(d) { return y(d.Value); })
        .attr("width", x.bandwidth())
        //.attr("height", function(d) { return height - y(d.Value); })
        .attr("height", function(d) { return height - y(d.atv_listing_ct); })
        .attr("fill", "#69b3a2")

        svg.append("text")
        .attr("class", "axis_label")
        .attr("text-anchor", "middle")
        .attr("transform", "translate("+ (-70) +","+(height/2)+")rotate(-90)")
        .text("Active Listing Count")
        .attr("font-size", 14);
        
        var h = parseInt(height) + 66;

        svg.append("text")
        .attr("class", "axis_label")
        .attr("text-anchor", "middle")
        .attr("transform", "translate("+ (width/2) +","+(h)+")")
        .text("Median Square Feet")
        .attr("font-size", 14);
    //})
}
function barFlask( feature , value ){
    let url = "http://127.0.0.1:5000/bar"
    // const data = { request: 'example' };
  
    fetch(url, {
      method: 'POST', // or 'PUT'
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ req: 'barPlot' , 'feature' : feature, 'value' : value }),
  })
      .then(data => data.json())
      .then(response => {
        barData = JSON.parse(response.barPlotData);
        new_barchart(barData);
      });
  }