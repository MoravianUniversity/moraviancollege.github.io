function drawTheUSPokeRatioMap(){
	
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
	
	

	var getStateValuesFunction = function(data, stateName) {

		var stateAbbr = state_abbreviations[stateName];

		for (var i = 0; i < data.length; i++) {
            //Grab state name
            var dataState = data[i].state;

            //Grab data value, and convert from string to float
            if (dataState == stateAbbr) {
            	return parseFloat(data[i].poke_ratio);
        	}

		}
	};

	var getCountyValuesFunction = function(data, countyName) {
		//Merge the ag. data and GeoJSON
        //Loop through once for each ag. data value
        for (var i = 0; i < data.length; i++) {
            //Grab state name
            var dataCounty = data[i].county;

            var part = dataCounty.split(" ");

            // if the last thing is county/borough get rid of it
            var len = part.length;
            if (part[len-1] == "County" || part[len-1] == "Borough" || part[len-1] == "Parish"|| part[len-1] =="City") {
                var str = "";
                for (var k = 0; k < len-1; k++) {
                    str += part[k];
                    if (k != len-2) {
                        str += " ";
                    }
                }
                dataCounty = str;
            }
            else if (part[len-2] == "Census") {
            	var str = "";
                for (var k = 0; k < len-2; k++) {
                    str += part[k];
                    if (k != len-3) {
                        str += " ";
                    }
                }
                dataCounty = str;
            }

            if (dataCounty == countyName) {
            	//Grab data value, and convert from string to float
            	return parseFloat(data[i].poke_ratio);
            }
           
        }
	};
	
	var state_abbreviations = {};
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
	
	//Create file paths. Used in setPaths function
	var us_poke_data_file = " json/poke_ratio_correct2.csv";
	var map_json_file = "json/us-states.json";
	var county_path_file = "json/stateJSON/";
	var county_poke_data_file = "json/countyPokes/";
	
	//Build map
	var map = gradientMap.setColors("#002966","#B2D1FF")
				.setFeature("Poke Ratio")
				.setRestFileName("poke.csv")
				//.setDrawCounties(drawCounties)
				.setFunctions(getStateValuesFunction, getCountyValuesFunction)
				.setStateAbbreviations(state_abbreviations)
				.setPaths(map_json_file, us_poke_data_file, county_path_file, county_poke_data_file)
				.setStartingGradient(-1)
				.setup();
				
	//Draw map
	map.drawMap();
};


drawTheUSPokeRatioMap();