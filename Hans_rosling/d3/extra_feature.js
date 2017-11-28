document.addEventListener('DOMContentLoaded', function() {

// Define margins
var margin = {top: 10, right: 30, bottom: 25, left: 200};

//Width and height
var outer_width = 200;
var outer_height = 250;
var svg_width = outer_width - margin.left - margin.right;
var svg_height = outer_height - margin.top - margin.bottom;

var svg = d3.select("#extra_feature")
			.append("svg")
			.attr("width", svg_width + margin.left + margin.right)
			.attr("height", svg_height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
	
		svg.append("text")
			.attr("dx","-11.2em")
			.attr("dy","0.2em")
			.style("fill","white")
			.style("stroke","#33c33e")
			.text("Highest Per-Capita Income");

generateExtraFeature = function generateExtraFeature(display_year){
	var filtered_datset = dataset.filter(function yearFilter(value){
					return (value.Year == display_year)});


	// Per capita income = GDP / Population for each country for that year
	var testArray = d3.map(filtered_datset, function(d) { return d.GDP/d.Population})
	top10 = testArray.keys().sort(function(a, b){return b-a}).slice(0,10);

	per_capita_dataset = []
	for(i = 0 ; i < top10.length; i++){
		text = testArray['$'+top10[i]].Country;
		per_capita_dataset.push(text);
	}

	var top5Countries = svg.selectAll("#list_of_countries")
		  				 	.data(per_capita_dataset, function key(d){
		  				 		return d;
		  				 	});

		top5Countries.enter()
			.append("text")
			.style("fill", "white")
			.attr("y",function(d,i){ return i*20+100;})
			.attr("dx","-10em")
			.attr("dy","-3.5em")
			.attr("font-size",20)
			.attr("opacity", 0.8)
			.style("stroke","rgb(245, 177, 56")
			.attr("id","list_of_countries")
			.text(function(d,i){ return i+1 + ")" + d; });
		
		top5Countries
			.transition()
			.duration(500)
			.style("fill", "white")
			.attr("y",function(d,i){ return i*20+100;})
			.attr("dx","-10em")
			.attr("dy","-3.5em")
			.attr("opacity", 0.8)
			.attr("font-size",20)
			.style("stroke","rgb(245, 177, 56")
			.attr("id","list_of_countries")
			.text(function(d,i){ return i+1 + ")" + d; });
		top5Countries.exit().remove();

			

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

		// Generate the visualisation
		// generateExtraFeature(display_year);

	}
});

})