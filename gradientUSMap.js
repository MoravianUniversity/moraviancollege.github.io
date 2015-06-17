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

            min = d3.min(data, function(d) { return +d[feature_desired]; }).toString();
            max = d3.max(data, function(d) { return +d[feature_desired]; }).toString();
            

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
			
			var zoom = d3.behavior.zoom()
    			.on("zoom",function() {
        		g.attr("transform","translate("+ 
            	d3.event.translate.join(",")+")scale("+d3.event.scale+")");
        		g.selectAll("path")  
            	.attr("d", path.projection(projection)); 
  			});
  			
  			var g = svg.append("g");

			svg.call(zoom)

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
		return this;
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
		return this;
		
	}

	gradientMap.rangeBoxes = function(numOfBoxes) {
		drawMinLabel();
		drawBoxes(numOfBoxes);
	}
	
	var rest_of_filename = "poke.csv";

	var link = function(d) {

		d3.select("#stateName").remove();
		//This is where the SVG generates the state name with x and y coordinates
		svg.append("text")
        	.attr("x", 650)
            .attr("y", 30)
            .text(d.properties.name)
            .attr("fill", "black")
            .attr("class", "text")
            .attr("id", "stateName");
			
		

		var abbreviation = state_abbreviations[d.properties.name];
		var path = abbreviation + "Counties.json";
		
		
		var csvPath = abbreviation + rest_of_filename;

		mouseOut();

		drawCounties(path, csvPath);
	}
	
	gradientMap.setRestFileName = function(new_name) {
		
		rest_of_filename = new_name;
		return this;
		
	}

	var drawBoxes = function(boxNum) {
		var colorArray = makeRange(boxNum, start_color, end_color);
		d3.selectAll(".rectangle").remove();
		for(var i = 0; i < boxNum; i++){
			svg.append("rect")
			   .attr("x", 55 + 25*i)
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
            .text("\00  min = " + Number(min).toFixed(2) + " ")
        	.attr("font-family", "sans-serif")
            .attr("font-size", "10px")
            .attr("fill", "black")
            .attr("class", "text")
            .attr("id", "minLabel");
	}

	var drawMaxLabel = function(position) {
		d3.select("#maxLabel").remove();
		svg.append("text")
        	.attr("x", 8 + position)
            .attr("y", 25)
            .text("\00  max = " + Number(max).toFixed(2))
        	.attr("font-family", "sans-serif")
            .attr("font-size", "10px")
            .attr("fill", "black")
            .attr("class", "text")
            .attr("id", "maxLabel");
        
        
	}

	var drawContinuousGrad = function(){
		var minY = 15;
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
		    .attr("x", 54)
		    .attr("y", 10)
		    .attr("width", 250)
		    .attr("height", 25)
		    .attr("fill", "url(#gradient)")
		    .attr("class", "rectangle");

		drawMinLabel();
		drawMaxLabel(298);

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
		// this function creates the drop down menu for changing the grid scale
		// color selector is how many colors you want displayed
		var combo = d3.select("#comboDiv")
						.append("select")
					  	.attr("id", "color-selector")
					  	.style("right-margin", "50%");

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
		function computeCenter(data){
	
		var nums = []
		var allNums =[]
	
		var bigLat = 0
    	var smallLat = 500
    	var bigLong = 0
    	var smallLong = -500
		// return the center
		
		for (x = 0; x < data.features.length; x+=1) {
			for (y = 0; y < data.features[x].geometry.coordinates.length; y +=1) {
				for(z = 0; z < data.features[x].geometry.coordinates[y].length; z+=1) {
					
					nums.push(data.features[x].geometry.coordinates[y][z]);
				}
			}
		}

		for(i = 0; i< nums.length; i++) {
			for(j = 0; j< nums[i].length; j++) {
				allNums.push(nums[i][j]);
			}
		}
			
			
		for (val in allNums) {

			var save = allNums[val]	
			if(save < 0) {
				if (save < bigLong) {
					bigLong = save;				
				}
			}
			
			if(save > 0) {
				if (save > bigLat) {
					bigLat = save;				
				}
			}
			
			if (save < 0 && save > bigLong) {
				if (save > smallLong) {
					smallLong = save;
				}
			}
			
			if (save > 0 && save < bigLat) {
				if (save < smallLat) {
					smallLat = save;
				}
			}
		}
	return [(bigLong+smallLong)/2, (bigLat+smallLat)/2];
		
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
			
			
            min = d3.min(data, function(d) { return +d[feature_desired]; }).toString();
            max = d3.max(data, function(d) { return +d[feature_desired]; }).toString();
            //test edit
            //document.write(d3.min(data, function(d) { return +d.poke_ratio; }));
            
           	if (!continuous) {
				color.domain([min,max]);
				gradientMap.rangeBoxes(current_gradient);
			}
			else {
				drawContinuousGrad();
			}

        	d3.json(countyMapPath+stateFile, function(json) {

                // create a first guess for the projection
                var center = computeCenter(json);              
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
                                  h - (bounds[0][1] + bounds[1][1])/2];
                }
                else {
      				hscale  = scale*w*.75  /(bounds[1][0] - bounds[0][0]);
                	vscale  = scale*h*.75 / (bounds[1][1] - bounds[0][1]);
                	scale   = (hscale < vscale) ? hscale : vscale;
                	offset  = [ w-(bounds[0][0] + bounds[1][0])/2,	
                                  h-(bounds[0][1] + bounds[1][1])/2.1];
                    
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
                            if ( d.properties.LSAD == "city")
                            {
                            	d.properties.NAME += " City";
                            }
                            
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
            var zoom = d3.behavior.zoom()
    			.on("zoom",function() {
        		g.attr("transform","translate("+ 
            	d3.event.translate.join(",")+")scale("+d3.event.scale+")");
        		g.selectAll("path")  
            	.attr("d", path.projection(projection)); 
  			});
  			
  			var g = svg.append("g");

			svg.call(zoom)
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
