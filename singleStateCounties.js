(function() {
    var width  = 800;
    var height = 600;

    var ustate = {};

    ustate.drawCounties = function(stateFile, csvValueFile) {
    	d3.select("#mapSVG").remove();
        d3.select("#tooltip").remove();

    	var mapDiv = d3.select("body")
    					.append("div")
    					.attr("id", "mapSVG")
    					.style("width", "800px")
    					.style("margin", "0 auto");

    	var vis = mapDiv.append("svg")
                        .attr("width", width)
                        .attr("height", height)
                        .on("click", click);

        var color = d3.scale.quantize()
                            .range(makeRange(2));

        d3.select("body")
            .append("div")
            .attr("id", "tooltip");

        d3.csv("json/countyPokes/"+csvValueFile, function(data) {

        	d3.json("json/stateJSON/"+stateFile, function(json) {

                min = d3.min(data, function(d) { return d.poke_ratio; });
                max = d3.max(data, function(d) { return d.poke_ratio; });
                color.domain([min,max]);

                //Merge the ag. data and GeoJSON
                //Loop through once for each ag. data value
                for (var i = 0; i < data.length; i++) {
                    //Grab state name
                    var dataState = data[i].county;

                    var part = dataState.split(" ");

                    // if the last thing is county/borough get rid of it
                    var len = part.length;
                    if (part[len-1] == "County" || part[len-1] == "Borough") {
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
                var offset = [width/2, height/2];
                var projection = d3.geo.mercator().scale(scale).center(center)
                    .translate(offset);

                // create the path
                var path = d3.geo.path().projection(projection);

                // using the path determine the bounds of the current map and use 
                // these to determine better values for the scale and translation
                var bounds  = path.bounds(json);
                var hscale  = scale*width  / (bounds[1][0] - bounds[0][0]);
                var vscale  = scale*height / (bounds[1][1] - bounds[0][1]);
                var scale   = (hscale < vscale) ? hscale : vscale;
                var offset  = [width - (bounds[0][0] + bounds[1][0])/2,
                                  height - (bounds[0][1] + bounds[1][1])/2];

                // new projection
                projection = d3.geo.mercator().center(center)
                  				.scale(scale).translate(offset);
                path = path.projection(projection);

                // add a rectangle to see the bound of the svg
                vis.append("rect").attr('width', width).attr('height', height)
                  .style('stroke', 'black').style('fill', 'none');

                vis.selectAll("path")
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
                    .on("mouseover", mouseOver)
                    .on("mouseout", mouseOut);

            });
        });
    }

    var mouseOver = function(d) {
        d3.select("#tooltip").transition().duration(200).style("opacity", .9);      
        d3.select("#tooltip").html(tooltipHtml(d.properties.NAME, d.properties.poke_ratio))  
            .style("left", (d3.event.pageX) + "px")     
            .style("top", (d3.event.pageY - 28) + "px");
    }
    
    var mouseOut = function() {
        d3.select("#tooltip").transition().duration(500).style("opacity", 0);      
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

    var click = function() {
        var poke_data = "json/poke_ratio_correct2.csv";
        var map_json_file = "json/us-states.json";

        gradientMap.drawMap(map_json_file, poke_data);
    }

    function tooltipHtml(n, d){ /* function to create html content string in tooltip div. */
        var specified_value = 0;
        if(typeof d !== 'undefined'){
            specified_value = d.toFixed(2);
        };
        var feat = "Poke_ratio";
        return "<h4>"+n+"</h4><table>"+
            "<tr><td>"+feat+": </td><td>"+(specified_value)+"</td></tr>"+
            "</table>";
    }

    this.ustate = ustate;
})();