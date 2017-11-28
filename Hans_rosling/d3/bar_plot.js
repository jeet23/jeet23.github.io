document.addEventListener('DOMContentLoaded', function() {

// Define margins
var margin = {top: 10, right: 30, bottom: 25, left: 200};

//Width and height
var outer_width = 500;
var outer_height = 300;
var svg_width = outer_width - margin.left - margin.right;
var svg_height = outer_height - margin.top - margin.bottom;


// define a function that filters data by year
function yearFilter(value){
	return (value.Year == display_year)
}

//Create SVG element as a group with the margins transform applied to it
var svg = d3.select("#bar_plot2")
			.append("svg")
			.attr("width", svg_width + margin.left + margin.right)
			.attr("height", svg_height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


var yearToDisplayBehind = svg.append("text")
							.attr("x",100)
							.attr("y",150)
							.attr("dy", ".35em")
							.style("fill","white")
							.style("font-size",25)
							.style("opacity",1)

var yScale = d3.scaleBand()
	                     .range([0, svg_height])
	                     .paddingInner(0.05)
						.paddingOuter(0.05);

var xScale = d3.scaleLinear()
				.range([0, svg_width]);
			

var yAxis = d3.axisLeft()
				  .scale(yScale);

var xAxis = d3.axisBottom()
			 .scale(xScale)
			 .ticks(5);

			  
svg.append("g")
	.attr("class", "axis")
	.attr("id", "y-axis");
		
svg.append("g")
	.attr("class", "axis")
	.attr("id", "x-axis")
	.attr("transform", "translate(0," + svg_height + ")");
svg.append("text")
	.attr("x", 6)
	.attr("y", 10)
	.attr("dx", "15.91em")
	.attr("dy", "15.20em")
	.style("text-anchor", "end")
	.style("fill","white")
	.text("No of Countries");



generateVisPlot = function generateVisPlot(display_year){
		
	// Filter the data to only include the current year
	var filtered_datset = dataset.filter(function yearFilter(value){
					return (value.Year == display_year)});

	var nested_data = d3.nest()
						.key(function(d) { return d.Region; })
						.key(function(d) { return d.Country; })
						.rollup(function(d) { return d.Country; })
						.entries(filtered_datset);

		
 	/******** PERFORM DATA JOIN ************/
  	// Join new data with old elements, if any.
  	var bars = 	svg.selectAll("rect")
	   .data(nested_data, function key(d) {
								return d.key;
							});
 	/******** HANDLE UPDATE SELECTION ************/
  	// Update the display of existing elelemnts to match new data
  	bars
  		.transition()
		.duration(500)
  		.attr("x", 0)
	   .attr("y", function(d) {
	   		return yScale(d.key) ;
	   })
	   .attr("width", function(d){
	   	return xScale(d.values.length+1);
	   })
	   .attr("height", yScale.bandwidth())
	   .style("fill", function(d){ return countryColorMap[d.key]});
		   
	/******** HANDLE ENTER SELECTION ************/
  	// Create new elements in the dataset
  	bars.enter()
		.append("rect")
		.transition()
		.duration(500)
		.attr("x", 0)
	   .attr("y", function(d) {
	   		return yScale(d.key) ;
	   })
	   .attr("width", function(d){
	   	return xScale(d.values.length+1);
	   })
	   .attr("height", yScale.bandwidth())
	   .style("fill", function(d){ return countryColorMap[d.key]})
	   

	 yearToDisplayBehind.text("Year: " +display_year);

	/******** HANDLE EXIT SELECTION ************/
	// Remove bars that not longer have a matching data eleement
	bars.exit().remove();
  		
	// Set the year label
	d3.select("#year_header").text("Year: " + display_year)

}

// Load the file data.csv and generate a visualisation based on it
d3.csv("./data/Gapminder_All_Time.csv", function(error, data){
	
	var years = d3.map(data, function(d) { return d.Year}).keys().sort()
	display_year = years[0]
	// handle any data loading errors
	if(error){
		console.log("Something went wrong");
		console.log(error);
	}else{
		console.log("Data Loaded");
		
		// Assign  the data object loaded to the global dataset variable
		dataset = data;
		
		var nested_data = d3.nest()
						.key(function(d) { return d.Region; })
						.key(function(d) { return d.Country; })
						.rollup(function(d) { return d.Country; })
						.entries(dataset);

		

		max_count = d3.max(nested_data, function(d) { return d.values.length;})
		min_count = d3.min(nested_data, function(d) { return d.values.length;})
		xScale.domain([min_count-1, max_count+1]);
		yScale.domain(dataset.map(function(d) { return d.Region ; }));
		svg.select("#x-axis").call(xAxis);

		svg.select("#y-axis").call(yAxis);
		// Generate the visualisation

		// generateVisPlot(display_year);


	}
});

})