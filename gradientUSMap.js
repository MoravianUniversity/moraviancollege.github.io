(function() {
	var gradientMap = {};

	// Width and Height of the svg
	var w = 800;
	var h = 600;
	var min = "0";
	var max = "0";
	var feature_desired = "poke_ratio";
	var start_color = "#33FF00";
	var end_color = "black";

	var svg;

	state_abbreviations = {};
	state_abbreviations["Alabama"] = "AL";
	state_abbreviations["Alaska"] = "AK";
	state_abbreviations["Arizona"] = "AZ";
	state_abbreviations["Arkansas"] = "AR";
	state_abbreviations["California"] = "CA";
	state_abbreviations["Colorado"] = "CO";
	state_abbreviations["Connecticut"] = "CT";
	state_abbreviations["Delaware"] = "DE";
	state_abbreviations["Florida"] = "FL";
	state_abbreviations["Georgia"] = "GA";
	state_abbreviations["Hawaii"] = "HI";
	state_abbreviations["Idaho"] = "ID";
	state_abbreviations["Illinois"] = "IL";
	state_abbreviations["Indiana"] = "IN";
	state_abbreviations["Iowa"] = "IA";
	state_abbreviations["Kansas"] = "KS";
	state_abbreviations["Kentucky"] = "KY";
	state_abbreviations["Louisiana"] = "LA";
	state_abbreviations["Maine"] = "ME";
	state_abbreviations["Maryland"] = "MD";
	state_abbreviations["Massachusetts"] = "MA";
	state_abbreviations["Michigan"] = "MI";
	state_abbreviations["Minnesota"] = "MN";
	state_abbreviations["Mississippi"] = "MS";
	state_abbreviations["Missouri"] = "MO";
	state_abbreviations["Montana"] = "MT";
	state_abbreviations["Nebraska"] = "NE";
	state_abbreviations["Nevada"] = "NV";
	state_abbreviations["New Hampshire"] = "NH";
	state_abbreviations["New Jersey"] = "NJ";
	state_abbreviations["New Mexico"] = "NM";
	state_abbreviations["New York"] = "NY";
	state_abbreviations["North Carolina"] = "NC";
	state_abbreviations["North Dakota"] = "ND";
	state_abbreviations["Ohio"] = "OH";
	state_abbreviations["Oklahoma"] = "OK";
	state_abbreviations["Oregon"] = "OR";
	state_abbreviations["Pennsylvania"] = "PA";
	state_abbreviations["Rhode Island"] = "RI";
	state_abbreviations["South Carolina"] = "SC";
	state_abbreviations["South Dakota"] = "SD";
	state_abbreviations["Tennessee"] = "TN";
	state_abbreviations["Texas"] = "TX";
	state_abbreviations["Utah"] = "UT";
	state_abbreviations["Vermont"] = "VT";
	state_abbreviations["Virginia"] = "VA";
	state_abbreviations["Washington"] = "WA";
	state_abbreviations["West Virginia"] = "WV";
	state_abbreviations["Wisconsin"] = "WI";
	state_abbreviations["Wyoming"] = "WY";
	state_abbreviations["Puerto Rico"] = "PR";

	gradientMap.drawMap = function(usMapFile, csvValueFile) {

		d3.select("#mapSVG").remove();
        d3.select("#comboDiv").remove();
        d3.select("#tooltip").remove();

		d3.select("body")
			.append("div")
			.attr("id", "comboDiv");

		makeCombo();

		//Define map projection
		var projection = d3.geo.albersUsa()
							   .translate([w/2, h/2])
							   .scale([900]);

		// Path of GeoJSON
		var path = d3.geo.path()
							.projection(projection);

		var numGradientBox = 2;

		//Define quantize scale to sort data values into buckets of color
		var color = d3.scale.quantize()
							.range(makeRange(2));
							//Colors taken from colorbrewer.js, included in the D3 download

		var mapDiv = d3.select("body")
						.append("div")
						.attr("id", "mapSVG")
						.style("width", "800px")
						.style("margin", "0 auto");

		svg = mapDiv.append("svg")
				.attr("width", w)
				.attr("height", h);

		d3.select("body")
			.append("div")
			.attr("id", "tooltip");

		d3.csv(csvValueFile, function(data) {

			min = d3.min(data, function(d) { return d.poke_ratio; });
			max = d3.max(data, function(d) { return d.poke_ratio; });
			color.domain([min,max]);

			drawMinLabel();
			drawMaxLabel(100);
			drawBoxes(2);

			d3.json(usMapFile, function(json) {
				//Merge the ag. data and GeoJSON
		        //Loop through once for each ag. data value
		        for (var i = 0; i < data.length; i++) {
		            //Grab state name
		            var dataState = data[i].state;
		            //Grab data value, and convert from string to float
		            var dataValue = parseFloat(data[i].poke_ratio);
		            //Find the corresponding state inside the GeoJSON
		            for (var j = 0; j < json.features.length; j++) {
			            var jsonState = state_abbreviations[json.features[j].properties.name];
			            if (dataState == jsonState) {
			                //Copy the data value into the JSON
			                json.features[j].properties.poke_ratio = dataValue;
			                //Stop looking through the JSON
			                break;
			        	}
		        	}
		        }

			   svg.selectAll("path")
			       .data(json.features)
			       .enter()
			       .append("svg:path")
			       .attr("d", path)
			       .attr("id", function(d) {
			       		return d.properties.name;
			       })
			       .attr("stroke", "black")
			       .attr("stroke-width", 1)
			       .style("fill", function(d) {
	                    //Get data value
	                    var value = d.properties.poke_ratio;

	                    if (value) {//If value exists…
	                    	return color(value);
	                    } 
	                    else {//If value is undefined…
	                        return "#ccc";
	                    }
                    })
			       .on("click", link)
			       .on("mouseover", mouseOver)
			       .on("mouseout", mouseOut);
			});

		});
	};

	var mouseOver = function(d) {
		d3.select("#tooltip").transition().duration(200).style("opacity", .9);      
		d3.select("#tooltip").html(tooltipHtml(d.properties.name, d.properties.poke_ratio))  
			.style("left", (d3.event.pageX) + "px")     
			.style("top", (d3.event.pageY - 28) + "px");
	}
	
	var mouseOut = function() {
		d3.select("#tooltip").transition().duration(500).style("opacity", 0);      
	}

	var change_gradient = function(val) {

		var inter = false;
		if (val == -1) {
			inter = true;
			drawContinuousGrad();
		}

		else {
			var newcolor = d3.scale.quantize()
						.range(makeRange(val));
			newcolor.domain([
            	min,max
    		]);
    		drawBoxes(val);
		}

		d3.selectAll("path")
			.style("fill", function(d) {
                //Get data value
                var value = d.properties.poke_ratio;
                if (!inter && value) {//If value exists…
                	return newcolor(value);
                } 
                else if (inter && value) {
                	return d3.interpolate(start_color, end_color)((value - min)/(max-min));
                }
                else {//If value is undefined…
                    return "#ccc";
                }
            });

	}

	var link = function(d) {
		var abbreviation = state_abbreviations[d.properties.name];
		var path = abbreviation + "Counties.json";

		var csvPath = abbreviation + "poke.csv";

		mouseOut();

		ustate.drawCounties(path, csvPath);
	}

	var drawBoxes = function(boxNum) {
		var colorArray = makeRange(boxNum);
		d3.selectAll(".rectangle").remove();
		for(var i = 0; i < boxNum; i++){
			svg.append("rect")
			   .attr("x", 50 + 25*i)
			   .attr("y", 10)
			   .attr("width", 25)
			   .attr("height", 25)
			   .attr("class", "rectangle")
			   .style("fill", colorArray[i]);
		}

		var maxText = max.substring(0,4);

        drawMaxLabel(50 + 25*boxNum);

	}

	var drawMinLabel = function() {
		svg.append("text")
        	.attr("x", 0)
            .attr("y", 25)
            .text("min = " + min.substring(0,4))
        	.attr("font-family", "sans-serif")
            .attr("font-size", "10px")
            .attr("fill", "black")
            .attr("class", "text");
	}

	var drawMaxLabel = function(position) {
		d3.select("#maxLabel").remove();
		svg.append("text")
        	.attr("x", position)
            .attr("y", 25)
            .text("max = " + max.substring(0,4))
        	.attr("font-family", "sans-serif")
            .attr("font-size", "10px")
            .attr("fill", "black")
            .attr("id", "maxLabel");
	}

	var drawContinuousGrad = function(){
		var minY = 10;
		var maxY = 300;

		var gradient = svg
		    .append("linearGradient")
		    .attr("y1", "0")
		    .attr("y2", "0")
		    .attr("x1", minY)
		    .attr("x2", maxY)
		    .attr("id", "gradient")
		    .attr("gradientUnits", "userSpaceOnUse")
		    
		gradient
		    .append("stop")
		    .attr("offset", "0")
		    .attr("stop-color", "#33FF00")
		    
		gradient
		    .append("stop")
		    .attr("offset", "1")
		    .attr("stop-color", "black")
		    
		svg
		    .append("rect")
		    .attr("x", 50)
		    .attr("y", 10)
		    .attr("width", 250)
		    .attr("height", 25)
		    .attr("fill", "url(#gradient)")
		    .attr("class", "rectangle");

		drawMaxLabel(300);

	}

	var makeRange = function(step) {
		rang = [];
		numGradientBox = step;
		steps = 100 / step;
		for (var i = 0; i < 100; i+=steps) {
			var num = Math.round(255 - i/100 * 255);
			rang.push("rgb(0," + num + ",0)");
		}
		return rang;
	}

	function tooltipHtml(n, d){	/* function to create html content string in tooltip div. */
		var specified_value = d.toFixed(2);
		var feat = feature_desired.charAt(0).toUpperCase() + feature_desired.slice(1);
		return "<h4>"+n+"</h4><table>"+
			"<tr><td>"+feat+": </td><td>"+(specified_value)+"</td></tr>"+
			"</table>";
	}

	var makeCombo = function() {
		// maybe need to change this to append to the svg instead does not work right now
		var combo = d3.select("#comboDiv")
						.append("select")
					  	.attr("id", "color-selector")
					  	.style("left", "855px");

		for (var i = 2; i <= 10; i++) {
			combo.append("option")
					.attr("value", i)
					.text(i);
		}
		combo.append("option")
				.attr("value", -1)
				.text("continuous");

		d3.select("select").on("change", function() {
			change_gradient(this.options[this.selectedIndex].value);
		});
	}
	

	this.gradientMap = gradientMap;
})();