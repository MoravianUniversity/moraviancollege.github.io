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
							.range(gradientMap.makeRange(2));
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

			gradientMap.rangeBoxes(2, 100, min, max);

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
			       .on("mouseover", gradientMap.mouseOver)
			       .on("mouseout", gradientMap.mouseOut);
			});

		});
	};

	gradientMap.mouseOver = function(d) {
		d3.select("#tooltip").transition().duration(200).style("opacity", .9);

		// state
		if (d.properties.name) {
			d3.select("#tooltip").html(gradientMap.tooltipHtml(d.properties.name, d.properties.poke_ratio))  
				.style("left", (d3.event.pageX) + "px")     
				.style("top", (d3.event.pageY - 28) + "px");
		}
		// county
		else if (d.properties.poke_ratio) {
			d3.select("#tooltip").html(gradientMap.tooltipHtml(d.properties.NAME, d.properties.poke_ratio))  
				.style("left", (d3.event.pageX) + "px")     
				.style("top", (d3.event.pageY - 28) + "px");
		}
		// county without a poke ratio
		else {
			d3.select("#tooltip").html(gradientMap.tooltipHtml(d.properties.NAME, 0))  
				.style("left", (d3.event.pageX) + "px")     
				.style("top", (d3.event.pageY - 28) + "px");
		}

		
	}
	
	gradientMap.mouseOut = function() {
		d3.select("#tooltip").transition().duration(500).style("opacity", 0);      
	}

	gradientMap.change_gradient = function(val) {

		var inter = false;
		if (val == -1) {
			inter = true;
			drawContinuousGrad();
		}

		else {
			var newcolor = d3.scale.quantize()
								.range(gradientMap.makeRange(val));
			newcolor.domain([
            	min,max
    		]);
    		drawBoxes(val, max);
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

	gradientMap.rangeBoxes = function(numOfBoxes, maxLabelPosition) {
		drawMinLabel();
		drawBoxes(numOfBoxes);
	}

	var link = function(d) {
		var abbreviation = state_abbreviations[d.properties.name];
		var path = abbreviation + "Counties.json";

		var csvPath = abbreviation + "poke.csv";

		gradientMap.mouseOut();

		gradientMap.drawCounties(path, csvPath);
	}

	var drawBoxes = function(boxNum) {
		var colorArray = gradientMap.makeRange(boxNum);
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
		d3.select("#minLabel").remove();
		svg.append("text")
        	.attr("x", 0)
            .attr("y", 25)
            .text("min = " + min.substring(0,4))
        	.attr("font-family", "sans-serif")
            .attr("font-size", "10px")
            .attr("fill", "black")
            .attr("class", "text")
            .attr("id", "minLabel");
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

	gradientMap.makeRange = function(step) {
		rang = [];
		numGradientBox = step;
		steps = 100 / step;
		for (var i = 0; i < 100; i+=steps) {
			var num = Math.round(255 - i/100 * 255);
			rang.push("rgb(0," + num + ",0)");
		}
		return rang;
	}

	gradientMap.tooltipHtml = function(n, d){	/* function to create html content string in tooltip div. */
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
			gradientMap.change_gradient(this.options[this.selectedIndex].value);
		});
	}

	gradientMap.drawCounties = function(stateFile, csvValueFile) {
    	d3.selectAll("path").remove();
        gradientMap.mouseOut();

    	svg = d3.select("svg");

        d3.csv("json/countyPokes/"+csvValueFile, function(data) {

            var color = d3.scale.quantize()
                            .range(gradientMap.makeRange(2));

            min = d3.min(data, function(d) { return d.poke_ratio; });
            max = d3.max(data, function(d) { return d.poke_ratio; });
            color.domain([min,max]);

            gradientMap.rangeBoxes(2, 100, min, max);

        	d3.json("json/stateJSON/"+stateFile, function(json) {

                //Merge the ag. data and GeoJSON
                //Loop through once for each ag. data value
                for (var i = 0; i < data.length; i++) {
                    //Grab state name
                    var dataState = data[i].county;

                    var part = dataState.split(" ");

                    // if the last thing is county/borough get rid of it
                    var len = part.length;
                    if (part[len-1] == "County" || part[len-1] == "Borough" || part[len-1] == "Parish") {
                        var str = "";
                        for (var k = 0; k < len-1; k++) {
                            str += part[k];
                            if (k != len-2) {
                                str += " ";
                            }
                        }
                        dataState = str;
                    }

                    //Grab data value, and convert from string to float
                    var dataValue = parseFloat(data[i].poke_ratio);
                    //Find the corresponding state inside the GeoJSON
                    for (var j = 0; j < json.features.length; j++) {
                        var jsonState = json.features[j].properties.NAME;
                        if (dataState == jsonState) {
                            //Copy the data value into the JSON
                            json.features[j].properties.poke_ratio = dataValue;
                            //Stop looking through the JSON
                            break;
                        }
                    }
                }

                // create a first guess for the projection
                var center = d3.geo.centroid(json)
                var scale  = 150; // MAKES NO SENSE WHY DOES IT HAVE TO BE A VARIABLE AND WHY DOES IT CHANGE NOTHING
                var offset = [w/2, h/2];
                var projection = d3.geo.mercator().scale(scale).center(center)
                    .translate(offset);

                // create the path
                var path = d3.geo.path().projection(projection);

                // using the path determine the bounds of the current map and use 
                // these to determine better values for the scale and translation
                var bounds  = path.bounds(json);
                var hscale  = scale*w  / (bounds[1][0] - bounds[0][0]);
                var vscale  = scale*h / (bounds[1][1] - bounds[0][1]);
                var scale   = (hscale < vscale) ? hscale : vscale;
                var offset  = [w - (bounds[0][0] + bounds[1][0])/2,
                                  h - (bounds[0][1] + bounds[1][1])/2];

                // new projection
                projection = d3.geo.mercator().center(center)
                  				.scale(scale).translate(offset);
                path = path.projection(projection);

                // add a rectangle to see the bound of the svg
                svg.append("rect").attr('width', w).attr('height', h)
                  .style('stroke', 'black').style('fill', 'none');

                svg.selectAll("path")
                    .data(json.features)
                    .enter()
                    .append("path")
                    .attr("d", path)
                    .attr("id", function(d) {
                        return d.properties.NAME;
                    })
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
                    .style("stroke-width", "1")
                    .style("stroke", "black")
                    .on("click", click)
                    .on("mouseover", gradientMap.mouseOver)
                    .on("mouseout", gradientMap.mouseOut);

            });
        });
    }

    var click = function() {
        var poke_data = "json/poke_ratio_correct2.csv";
        var map_json_file = "json/us-states.json";

        gradientMap.drawMap(map_json_file, poke_data);
    }
	

	this.gradientMap = gradientMap;
})();