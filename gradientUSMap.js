(function() {
	var gradientMap = {};

	// Width and Height of the svg
	var w = 800;
	var h = 600;
	var min = "0";
	var max = "0";
	var current_gradient = 2;
	var feature_desired = "poke_ratio";
	

	// defualt path names for the files
	var usMapFile 		= "json/us-states.json";
	var csvUSValueFile 	= "json/poke_ratio_correct2.csv";
	var countyMapPath 	= "json/stateJSON/";
	var countyValuePath = "json/countyPokes/";
	var stateCenteringFile = "json/Scrape.txt";

	var getStateValuesFunction = function(data, stateName) {};

	var getCountyValuesFunction = function(data, countyName) {};
	
	// default values for the color range

	var start_color = "#FF0000";
	var end_color = "#00B800";


	var svg;

	state_abbreviations = {};
	

	gradientMap.setup = function() {

		d3.select("body")
			.append("div")
			.attr("id", "comboDiv");

		makeCombo();

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

		return this;

	}

	gradientMap.drawMap = function() {

		d3.selectAll("path").remove();
		d3.select("#stateName").remove();
        mouseOut();

		//Define map projection
		var projection = d3.geo.albersUsa()
							   .translate([w/2, h/2])
							   .scale([900]);

		// Path of GeoJSON
		var path = d3.geo.path()
						.projection(projection);

		var color;
		var continuous = false;
		//Define quantize scale to sort data values into buckets of color
		if (current_gradient != -1) {
			color = d3.scale.quantize()
							.range(makeRange(current_gradient, start_color, end_color));
		}
		// this means they want a continuous gradient
		else {
			continuous = true;
		}

		d3.csv(csvUSValueFile, function(data) {

			min = d3.min(data, function(d) { return d.poke_ratio; });
			max = d3.max(data, function(d) { return d.poke_ratio; });

			if (!continuous) {
				color.domain([min,max]);
				gradientMap.rangeBoxes(current_gradient);
			}
			else {
				drawContinuousGrad();
			}

			d3.json(usMapFile, function(json) {

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
	                    d.properties.value = getStateValuesFunction(data, d.properties.name);
	                    var value = d.properties.value;

	                    if (!continuous && value) {//If value exists…
		                	return color(value);
		                } 
		                else if (continuous && value) {
		                	return d3.interpolate(start_color, end_color)((value - min)/(max-min));
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
	}

	var mouseOver = function(d) {
		d3.select("#tooltip").transition().duration(200).style("opacity", .9);

		// state
		if (d.properties.name) {
			d3.select("#tooltip").html(gradientMap.tooltipHtml(d.properties.name, d.properties.value))  
				.style("left", (d3.event.pageX) + "px")     
				.style("top", (d3.event.pageY - 28) + "px");
		}
		// county
		else if (d.properties.value) {
			d3.select("#tooltip").html(gradientMap.tooltipHtml(d.properties.NAME, d.properties.value))  
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
								.range(makeRange(val, start_color, end_color));
			newcolor.domain([
            	min,max
    		]);
    		drawBoxes(val, max);
		}

		d3.selectAll("path")
			.style("fill", function(d) {
                //Get data value
                var value = d.properties.value;
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

	gradientMap.setFunctions = function(function1, function2) {
		getStateValuesFunction = function1;
		getCountyValuesFunction = function2;
		return this
	}

	gradientMap.setColors = function(start, end) {
		start_color = start;
		end_color = end;
		return this;
	}

	gradientMap.setFeature = function(feature) {
		feature_desired = feature;
		return this;
	}

	gradientMap.setPaths = function(usPath, uscsvPath, countyPath, countycsvPath) {
		usMapFile 		= usPath;
		csvUSValueFile 	= uscsvPath;
		countyMapPath 	= countyPath;
		countyValuePath = countycsvPath;
		return this;
	}

	gradientMap.setStartingGradient = function(number) {
		if (number == -1) {
			return this;
		}
		current_gradient = number;
		return this;
	}
	
	gradientMap.setStateAbbreviations = function(st_abbr) {
		
		state_abbreviations = st_abbr;
		return this
		
	}

	gradientMap.rangeBoxes = function(numOfBoxes) {
		drawMinLabel();
		drawBoxes(numOfBoxes);
	}

	var link = function(d) {

		d3.select("#stateName").remove();

		d3.select("#mapSVG")
			.append("text")
			.attr("x", 100)
			.attr("y", 100)
			.attr("id", "stateName")
			.text(d.properties.name);

		var abbreviation = state_abbreviations[d.properties.name];
		var path = abbreviation + "Counties.json";

		var csvPath = abbreviation + "poke.csv";

		mouseOut();

		drawCounties(path, csvPath);
	}

	var drawBoxes = function(boxNum) {
		var colorArray = makeRange(boxNum, start_color, end_color);
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
            .text("min = " + Number(min).toFixed(2))
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
            .text("max = " + Number(max).toFixed(2))
        	.attr("font-family", "sans-serif")
            .attr("font-size", "10px")
            .attr("fill", "black")
            .attr("id", "maxLabel");
	}

	var drawContinuousGrad = function(){
		var minY = 10;
		var maxY = 300;

		d3.select("linearGradient").remove();

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
		    .attr("stop-color", start_color)
		    
		gradient
		    .append("stop")
		    .attr("offset", "1")
		    .attr("stop-color", end_color)
		    
		svg
		    .append("rect")
		    .attr("x", 50)
		    .attr("y", 10)
		    .attr("width", 250)
		    .attr("height", 25)
		    .attr("fill", "url(#gradient)")
		    .attr("class", "rectangle");

		drawMinLabel();
		drawMaxLabel(300);

	}

	var makeRange = function(step, startColor, endColor) {

		var Rstart = hexToR(startColor);
		var Gstart = hexToG(startColor);
		var Bstart = hexToB(startColor);

		var Rend = hexToR(endColor);
		var Gend = hexToG(endColor);
		var Bend = hexToB(endColor);

		var Rchange = Rend - Rstart;
		var Gchange = Gend - Gstart;
		var Bchange = Bend - Bstart;

		var Rstep = Rchange/(step-1);
		var Gstep = Gchange/(step-1);
		var Bstep = Bchange/(step-1);

		function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
		function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
		function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
		function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}

		rang = [];

		for (var i = 0; i < step; i++) {
			var newR, newG, newB;
			newR = (Rstart + i*Rstep).toFixed(0);
			newG = (Gstart + i*Gstep).toFixed(0);
			newB = (Bstart + i*Bstep).toFixed(0);
			rang.push("rgb(" + newR + "," + newG + "," + newB + ")");
		}
		
		return rang;
	}

	gradientMap.tooltipHtml = function(n, d){	/* function to create html content string in tooltip div. */
		var specified_value = d.toFixed(2);
		var feat = feature_desired.replace(" ", "&nbsp");
		return "<h4>"+n+"</h4><table>"+
			"<tr><td>"+feat+":</td><td>"+(specified_value)+"</td></tr>"+
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
					.attr("id", "option" + i.toString())
					.attr("value", i)
					.text(i);
		}
		combo.append("option")
				.attr("id", "optionc")
				.attr("value", -1)
				.text("continuous");

		if (current_gradient == -1) {
			d3.select("#optionc")
				.attr("selected", "selected");
		}
		else {
			d3.select("#option"+current_gradient.toString())
				.attr("selected", "selected");
		}

		d3.select("select").on("change", function() {
			var value = this.options[this.selectedIndex].value;
			change_gradient(value);
			current_gradient = value;
		});
	}

	var drawCounties = function(stateFile, csvFile) {
    	d3.selectAll("path").remove();
        mouseOut();

        d3.select("#floatingBarsG")
        	.style("visibility", "visible");

    	var color;
		var continuous = false;
		//Define quantize scale to sort data values into buckets of color
		if (current_gradient != -1) {
			color = d3.scale.quantize()
							.range(makeRange(current_gradient, start_color, end_color));
		}
		// this means they want a continuous gradient
		else {
			continuous = true;
		}

        d3.csv(countyValuePath+csvFile, function(data) {

            min = d3.min(data, function(d) { return d.poke_ratio; });
            max = d3.max(data, function(d) { return d.poke_ratio; });

           	if (!continuous) {
				color.domain([min,max]);
				gradientMap.rangeBoxes(current_gradient);
			}
			else {
				drawContinuousGrad();
			}

        	d3.json(countyMapPath+stateFile, function(json) {

                // create a first guess for the projection
                var center = d3.geo.centroid(json)                
                var scale  = 10;
                var offset = [w/2, h/2];
                var projection = d3.geo.mercator().scale(scale).center(center)
                    .translate(offset);

                // create the path
                var path = d3.geo.path().projection(projection);

                // using the path determine the bounds of the current map and use 
                // these to determine better values for the scale and translation
                var bounds  = path.bounds(json);
                
                var hscale, vscale, scale, offset;

				if (stateFile.substring(0,2) == "AK") {
                	hscale  = scale*w*5 / (bounds[1][0] - bounds[0][0]);
                    vscale  = scale*h*5 / (bounds[1][1] - bounds[0][1]);
                    scale   = (hscale < vscale) ? hscale : vscale;
                	offset  = [w - (bounds[0][0] + bounds[1][0])/2.5,
                                  h - (bounds[0][1] + bounds[1][1])/2.5];
                }
                else {
      				hscale  = scale*w*.75  /(bounds[1][0] - bounds[0][0]);
                	vscale  = scale*h*.75 / (bounds[1][1] - bounds[0][1]);
                	scale   = (hscale < vscale) ? hscale : vscale;
                	offset  = [ w-(bounds[0][0] + bounds[1][0])/2,	
                                  h-(bounds[0][1] + bounds[1][1])/2];
                    
                }

                // new projection
                projection = d3.geo.mercator().scale(scale)
                .center(center).translate(offset);
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
                            d.properties.value = getCountyValuesFunction(data, d.properties.NAME);
                            var value = d.properties.value;

                            if (!continuous && value) {//If value exists…
				                return color(value);
				            } 
				            else if (continuous && value) {
				               	return d3.interpolate(start_color, end_color)((value - min)/(max-min));
				            }
				            else {//If value is undefined…
				                return "#ccc";
				            }
                    })
                    .style("stroke-width", "1")
                    .style("stroke", "black")
                    .on("click", click)
                    .on("mouseover", mouseOver)
                    .on("mouseout", mouseOut);

            });
			d3.select("#floatingBarsG")
        		.style("visibility", "hidden");
        });
    }

    var click = function() {
        var poke_data = csvUSValueFile;
        var map_json_file = usMapFile;

        gradientMap.drawMap(map_json_file, poke_data);
    }
	

	this.gradientMap = gradientMap;
})();
