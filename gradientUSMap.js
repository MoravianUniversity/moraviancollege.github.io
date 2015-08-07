//GradientMap prototype file

makeId = (function(){
    var counter = 0;

    return function(){
        var ret = counter;
        counter += 1;
        return ret;
    };
})();

function GradientMap(feature){
   
    //Give id to map
    this.id = makeId();
    
    //User added variables
    this.feature_desired = feature;
    
    //map variables
    this.svgScaler = 1;
    this.columnWidth = "col-md-12";
    this.columnMargin;

    this.comboExists = false;
    this.w = 800 * this.svgScaler;
    this.h = 600 * this.svgScaler;
    this.min = "0";
    this.max = "0";
    this.current_gradient = 2;
    this.manager = null;
    this.observers = [];
    

    var newThis = this;
    
    this.svg = null;
    this.grad_svg = null;
    
    this.projection = null;
    this.path = null;
    
    //turn off zoom for firefox
    this.canZoom = true;
    this.x = "User-agent header sent: " + navigator.userAgent;
    this.s = this.x.split(" ");
    this.y = this.s[11];
    this.q = this.y.split("/");
    if(this.q[0] === "Gecko"){
        this.canZoom = false;;
    }
    
    this.zoomed = function(){
        
        newThis.svg.attr("transform", "translate(" + d3.event.translate + 	")scale(" + d3.event.scale + ")");
        
    }
    
    this.zoomWithObservers = function(){
        
        newThis.zoomed();
        
        for(var i = 0; i < newThis.observers.length; i += 1){
            
            newThis.observers[i].zoomed();
            
        }
        
    }
    
    this.getFeat = function() {
    
    	return newThis.feature_desired;
    	
    }
    
    this.zoom = d3.behavior.zoom()
        .scaleExtent([1, 10])
        .on("zoom", this.zoomWithObservers);
    
    this.setup = function(){
        
        //d3.select("#mapContainer")
        //    .append("div")
        //    .attr("id", "comboDiv" + this.id.toString());
        
        //this.makeCombo();

        // Creates the map div
        this.mapDiv = d3.select("#mapContainer")
            .append("div")
            .attr("id", "mapSVG" + this.id.toString())
            .attr("class", this.columnWidth)
            .style("width", this.w.toString() + "px")
            //.style("height", this.h.toString() + "px");
            .style("margin", "0" + newThis.columnMargin);

        // Appends an svg with the map controls/gradient to the div
        this.grad_svg = this.mapDiv.append("svg")
            .attr("width", this.svgScaler * 800)
            .attr("height", 40);

        // Checks to see if the zoom function is compatible with the web browser being used
        if(this.canZoom){
            
            this.svg = this.mapDiv.append("svg")
                .attr("style", "border: thin solid gray; border-radius: 5px;")
                .attr("width", this.w)
                .attr("height", this.h)
                .attr("id", "map" + this.id.toString())
                .call(this.zoom)
                .append("g");
            
        } else {
            // Appends an svg to the div for us to put a map into
            this.svg = this.mapDiv.append("svg")
                .attr("style", "border: thin solid gray; border-radius: 5px;")
                .attr("width", this.w)
                .attr("height", this.h)
                .attr("id", "map" + this.id.toString())
                .append("g");
            
        }

        d3.select("#mapContainer")
            .append("div")
            .attr("id", "tooltip" + this.id.toString())
            .attr("class", "tooltip");
        
        return this;
        
    };

    // This function resets the map to its original scale and position
    this.reset = function(){

        this.zoom.scale(1);
        this.zoom.translate([0, 0]);
        this.svg.transition().duration(0).
            attr("transform", "translate(" + this.zoom.translate() + ") scale(" + this.zoom.scale() + ")");
            
    }
    
    this.mouseOut = function() {
    
        d3.select("#tooltip" + newThis.id.toString()).transition().duration(2500).style("opacity", 0);
        
    }
    
    this.mouseOutWithObservers = function(){
        
        newThis.mouseOut();
        
        for (var i = 0; i < newThis.observers.length; i += 1){
            
            newThis.observers[i].mouseOut();
            
        }
        
    }
    var Location=this.id%2;
    this.mouseOver = function(d){
        

        d3.select("#tooltip" + newThis.id.toString()).transition().duration(200).style("opacity", 0.97);
        
        //If the browser is Firefox or built with the Gecko engine
        if(newThis.q[0] === "Gecko") {
            if(Location==0){
            var coord = d3.mouse(this);
            var c_x = (coord[0] + 100) +"px";
            var c_y = (coord[1] + 680 + (newThis.id* 200)) + "px";}
            else{
            var coord = d3.mouse(this);
            if(newThis.id > 2){
            var c_x = (coord[0] + 100+(newThis.id*125)) +"px"
            var c_y = (coord[1] + 680+(newThis.id* 100)) + "px";}
            else{
            var c_x = (coord[0] + 100+(newThis.id*450)) +"px";
            var c_y = (coord[1] + 680) + "px";}}
        } else{
            var x_offset = (function () {
                var offset_temp = window.getComputedStyle(document.getElementById("Main_Content")).marginLeft;
                var length = offset_temp.length - 2;
                return Number(offset_temp.substr(0, length));
            })();

            var zoom = (function () {
                var zoom_temp = detectZoom.zoom();
                if (zoom_temp > 1.0) {
                    return zoom = [zoom_temp, 175];
                } else {
                    return zoom = [zoom_temp, 300];
                }
            })();


            var c_x = ((event.screenX - x_offset)/  zoom[0]) +"px";
            var c_y = ((window.pageYOffset + event.screenY - zoom[1])/zoom[0]) + "px";


            console.log("event.screenX ,", event.screenX + "px");
            console.log("event.screenY ,", event.screenY + "px");
            console.log("Zoom:", detectZoom.zoom());
        }
        
        //state
        if(d.properties.name) {
            
            d3.select("#tooltip" + newThis.id.toString()).html(newThis.tooltipHtml(d.properties.name, getStateDictionaries()))
                .style("left", c_x)
                .style("top", c_y);
            
        }
        //county
        else if(d.properties.value){
            d3.select("#tooltip" + newThis.id.toString()).html(newThis.tooltipHtml(d.properties.NAME, getCountyDictionaries()))
                .style("left", c_x)
                .style("top", c_y);
        }
        //county without data
        else{
            
            d3.select("#tooltip" + newThis.id.toString()).html(newThis.tooltipHtml(d.properties.NAME, 0))
                .style("left", c_x)
                .style("top", c_y);
            
        }
        
    }
    
    this.mouseOverWithObservers = function(d){
        
        newThis.mouseOver(d);
        
        for (var i = 0; i < newThis.observers.length; i += 1){
            
            newThis.observers[i].mouseOver(d);
            
        }
        
    }
    
    this.drawMap = function() {
        
        newThis.svg.selectAll("path").remove();
        newThis.grad_svg.selectAll("#stateName").remove();
        this.mouseOut();
        this.reset();
        
        //Define map projection
        this.projection = d3.geo.albersUsa()
            .translate([this.w/2, this.h/2])
            .scale([this.svgScaler * 900]);
        
        //Path of GeoJSON
        this.path = d3.geo.path()
            .projection(this.projection);
        
        var color;
        var continuous = false;
        
        //Define quantize scale to sort data values into buckets of color
        if(this.current_gradient != -1) {
            color = d3.scale.quantize()
                .range(makeRange(newThis.current_gradient, newThis.start_color, newThis.end_color));
        }
        // this means they want a continuous gradient
        else{
            continuous = true;
        }
        
        d3.csv(this.csvUSValueFile, function(data) {
            
            newThis.min = d3.min(data, function(d) { return +d[newThis.feature_desired]; }).toString();
            newThis.max = d3.max(data, function(d) { return +d[newThis.feature_desired]; }).toString();
            
            //use this for migrant housing dataset
			//var newMin = 8;
			//var newMax = 2209;
			//newThis.min = newMin.toString();
			//newThis.max = newMax.toString();
			
            if(!continuous){
                
                color.domain([newThis.min, newThis.max]);

                newThis.rangeBoxes(newThis.current_gradient);
                
            }
            else{
                newThis.drawContinuousGrad();
            }
            
            d3.json(newThis.usMapFile, function(json) {
                
                newThis.svg.selectAll("path")
                    .data(json.features)
                    .enter()
                    .append("svg:path")
                    .attr("d", newThis.path)
                    .attr("id", function(d) {
                        return d.properties.name;
                    })
                    .attr("stroke", "black")
                    .attr("stroke-width", "1")
                    .style("fill", function(d) {
                        //Get data value
                        d.properties.value = getStateValuesFunction(data, d.properties.name, newThis.feature_desired);
                        var value = d.properties.value;
                        
                        if(!continuous && value) {//If value exists...
                            return color(value);
                        }
                        else if(continuous && value) {
                            return d3.interpolate(newThis.start_color, newThis.end_color)((value - newThis.min)/(newThis.max-newThis.min));
                        }
                        else{//If value is undefined...
                            return "#ccc";
                        }
                        
                    })
                // Apply these attributes to this map object
                .on("click", newThis.linkWithObservers)
                .on("mouseover", newThis.mouseOver)
                .on("mouseout", newThis.mouseOut)
                
            })
        })
        
        return this;
        
    };
    
    this.linkWithObservers = function(d){
        
        newThis.link(d);
        
        for (var i = 0; i < newThis.observers.length; i += 1){
            
            newThis.observers[i].link(d);
            
        }
        
    }
    
    this.change_gradient = function(val) {


        
        var inter = false;
        if(val==-1){
            inter = true;
            this.drawContinuousGrad();
        }
        else{


            var newcolor = d3.scale.quantize()
                .range(makeRange(val, newThis.start_color, newThis.end_color));
            newcolor.domain([
                newThis.min, newThis.max
            ]);
            newThis.drawBoxes(val, newThis.max);
        }
        
        d3.select("#mapSVG" + newThis.id.toString()).selectAll("path")
            .style("fill", function(d){
                //Get data value
                var value = d.properties.value;
                if (!inter && value) {//If value exists...
                    return newcolor(value);
                }
                else if(inter && value) {
                    return d3.interpolate(newThis.start_color, newThis.end_color)((value - newThis.min)/(newThis.max - newThis.min));
                }
                else {//If value is undefined...
                    return "#ccc";
                }
            });
        
    };
    
    this.setFunctions = function(function1, function2){
        this.getStateValuesFunction = function1;
        this.getCountyValuesFunction = function2;
        return this;
    };

    this.setScaler = function(scale, column_width, column_margins) {
        this.svgScaler = scale;
        this.columnWidth =column_width;
        this.columnMargin = column_margins;
        this.w = 800 * this.svgScaler;
        this.h = 600 * this.svgScaler;

        return this;
    };

   this.setColors = function(start, end){
        this.start_color = start;
        this.end_color = end;
        return this;
    };
    this.setFeature = function(feature){
        this.feature_desired = feature;
        return this;
    };
    
    this.setPaths = function(usPath, uscsvPath, countyPath, countycsvPath) {
        this.usMapFile       = usPath;
        this.csvUSValueFile  = uscsvPath;
        this.countyMapPath   = countyPath;
        this.countyValuePath = countycsvPath;
        return this;
    };
    
    this.setStartingGradient = function(number) {
        if (number == -1) {
            return this;
        }

        this.current_gradient = number;
        return this;
    };
    
    this.setStateAbbreviations = function(st_abbr) {

        this.state_abbreviations = st_abbr;
        return this;

    };
    
    this.rangeBoxes = function(numOfBoxes) {

        this.drawMinLabel();
        this.drawBoxes(numOfBoxes);
    };
    
    this.removeMap = function(){
        this.mapDiv.remove();
        return this;
    };
    
    this.link = function(d){
        
        newThis.grad_svg.select("#stateName").remove();
        //This is where the SVG generates the state name with x and y coordinates
        newThis.grad_svg.append("text")
            .attr("x", this.svgScaler * 625)
            .attr("y", 30)
            .text(d.properties.name)
            .attr("fill", "black")
            .attr("class", "text")
            .attr("id", "stateName");
        
        var abbreviation = state_abbreviations[d.properties.name];
        var path = abbreviation + "Counties.json";
        
        var csvPath = abbreviation + newThis.rest_of_filename;
        
        newThis.mouseOut();
        
        newThis.drawCounties(path, csvPath);
        
    };
    
    this.setRestFileName = function(new_name) {

        this.rest_of_filename = new_name;
        return this;
    };

    this.drawBoxes = function(boxNum){

        var colorArray = makeRange(boxNum, newThis.start_color, newThis.end_color);
        newThis.grad_svg.selectAll(".rectangle").remove();
        var i = 0;
        while(i < boxNum){
            this.grad_svg.append("rect")
                .attr("x", 55 + 25*i)
                .attr("y", 10)
                .attr("width", 25)
                .attr("height", 25)
                .attr("class", "rectangle")
                .style("fill", colorArray[i]);
            i += 1
        }
        this.drawMaxLabel(50 + 25*boxNum);  
    };
    
    this.drawMinLabel = function(){
        newThis.grad_svg.select("#minLabel").remove();
        this.grad_svg.append("text")
            .attr("x", 0)
            .attr("y", 25)
            .text("\00  min = " + Number(this.min).toFixed(2) + " ")
            .attr("font-family", "sans-serif")
            .attr("font-size", "10px")
            .attr("fill", "black")
            .attr("class", "text")
            .attr("id", "minLabel");
    };
    
    this.drawMaxLabel = function(position){
        newThis.grad_svg.select("#maxLabel").remove();
        this.grad_svg.append("text")
            .attr("x", 8 + position)
            .attr("y", 25)
            .text("\00  max = " + Number(this.max).toFixed(2))
            .attr("font-family", "sans-serif")
            .attr("font-size", "10px")
            .attr("fill", "black")
            .attr("class", "text")
            .attr("id", "maxLabel");
    };
    
    this.drawContinuousGrad = function(){
        var minY = 15;
        var maxY = 300;
        
        d3.select("linearGradient").remove();
        
        var gradient = this.grad_svg
            .append("linearGradient")
            .attr("y1", "0")
            .attr("y2", "0")
            .attr("x1", minY)
            .attr("x2", maxY)
            .attr("id", "gradient")
            .attr("gradientUnits", "userSpaceOnUse");
        
        gradient
            .append("stop")
            .attr("offset", "0")
            .attr("stop-color", this.start_color);
        
        gradient
            .append("stop")
            .attr("offset", "1")
            .attr("stop-color", this.end_color);
        
        this.grad_svg
            .append("rect")
            .attr("x", 54)
            .attr("y", 10)
            .attr("width", 250)
            .attr("height", 25)
            .attr("fill", "url(#gradient)")
            .attr("class", "rectangle");
        
        this.drawMinLabel();
        this.drawMaxLabel(298);
    };
    
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
        
        function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16);}
        function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16);}
        function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16);}
        function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h;}
        
        rang = [];
        
        var i = 0;
        var newR, newG, newB;
        while(i < step) {
            newR = (Rstart + i*Rstep).toFixed(0);
            newG = (Gstart + i*Gstep).toFixed(0);
            newB = (Bstart + i*Bstep).toFixed(0);
            rang.push("rgb(" + newR + "," + newG + "," + newB + ")");
            i += 1
        }
        
        return rang;
        
    };

    this.tooltipHtml = function(n, d){    /* function to create html content string in tooltip div. */
        var fancy_features = [];
        console.log(d);
        for(var x = 0; x < getFeatures().length; x++){
            var feat = getFeatures()[x];
            feat = feat.replace("_", "&nbsp");
            var feat_words = feat.split("&nbsp");
            feat = "";
            for(var i = 0; i < feat_words.length; i += 1) {

                feat_words[i] = feat_words[i].charAt(0).toUpperCase() + feat_words[i].slice(1);
                if(i != feat_words.length){
                    feat_words[i] = feat_words[i] + "&nbsp";
                }
                feat = feat + feat_words[i];
            }
            fancy_features.push(feat);
        }
        if(d == 0){
            if(Object.keys(getCountyDictionaries()).length && Object.keys(getStateDictionaries()).length === 1){
                return "<h4>"+n+"</h4><table>"+"<tr><td>"+fancy_features[0]+":</td><td> "+d.toFixed(2)+"</td></tr>"+"</table>";
            }
            else{
                var return_string = "<h4>"+n+"</h4><table>"+"<tr><td>"+fancy_features[0]+":</td><td>"+d.toFixed(2)+"</td></tr>";
                for(var x = 1; x < getFeatures().length; x++){
                    var feature = getFeatures()[x];
                    if(getCountyDictionaries()[feature][n] === undefined){
                        return_string = return_string + "<tr><td>" + fancy_features[x] + ":</td><td>" + d.toFixed(2)+"</td></tr>";
                    }
                    else{
                        return_string = return_string + "<tr><td>" + fancy_features[x] + ":</td><td>" + getCountyDictionaries()[feature][n].toFixed(2)+"</td></tr>";
                    }
                }
                return return_string + "</table>";
            }
        }
        else if(Object.keys(d).length == 1){
            var feature = getFeatures()[0];
            var specified_value = (Math.round(d[feature][n]*100)/100).toFixed(2);
            return "<h4>"+n+"</h4><table>"+
                "<tr><td>"+fancy_features[0]+":</td><td>"+(specified_value)+"</td></tr>"+
                "</table>";
            //use this for migrant housing dataset
			/* return "<h4>"+n+"</h4><table>"+
				"<tr><td>"+"Migrant Housing"+":</td><td>"+(specified_value)+"</td></tr>"+
				"</table>"; */
        }
        else{
            return_string = "<h4>"+n+"</h4><table>";
            for(var x = 0; x < Object.keys(d).length; x++){
                var feature = getFeatures()[x];
                if(x != Object.keys(d).length){
                    return_string = return_string +"<tr><td>" + fancy_features[x] + ":</td><td>" + (Math.round(d[feature][n]*100)/100).toFixed(2) +"</td>";
                }
                else{
                    return_string = return_string + "<td>" + fancy_features[x] + ":</td><td>" + (Math.round(d[feature][n]*100)/100).toFixed(2)+"</td></tr>";
                }
            }
            return return_string + "</table>";
        }
    };
    
    this.makeCombo = function(){
        
        if(this.comboExists){
            return;
        }
        
        this.comboExists = true;
        // this function creates the drop down menu for changing the grid scale
        // color selector is how many colors you want displayed
        
        var combo = d3.select("#comboDiv")
            .append("select")
            .attr("id", "color-selector")
            .style("right-margin", "50%");
        
        var i = 2;
        while (i <= 10) {
            combo.append("option")
                .attr("id", "option" + i.toString())
                .attr("value", i)
                .text(i);
            i += 1
        }
        combo.append("option")
            .attr("id", "optionc")
            .attr("value", -1)
            .text("continuous");
        
        if(newThis.current_gradient == -1) {
            d3.select("#optionc")
                .attr("selected", "selected");
        }
        else {

            d3.select("#option"+newThis.current_gradient.toString())
                .attr("selected", "selected");
        }
        
        d3.select("select").on("change", function() {
            var value = this.options[this.selectedIndex].value;
            newThis.change_gradient(value);
            newThis.current_gradient = value;
        });
        
    };

    // This function computes the geometric center of each state based on the furthest points of the country/state
    // rather than the center of mass
    this.computeCenter = function(data){
        
        var nums = [];
        var allNums = [];
        
        var bigLat = 0;
        var smallLat = 500;
        var bigLong = 0;
        var smallLong = -500;
        //return center
        
        for (x = 0; x < data.features.length; x+=1){
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
        
    };
    
    //edit from var to this
    this.drawCounties = function(stateFile, csvFile) {
        
        newThis.svg.selectAll("path").remove();
        newThis.mouseOut();
        newThis.reset();
        
        d3.select("#floatingBarsG")
            .style("visibility", "visible");
        
        var color;
        var continuous = false;
        //Define quantize scale to sort data values into buckets of color
        if (newThis.current_gradient != -1) {
            //edit
            //var newThis = this;

            color = d3.scale.quantize()
                .range(makeRange(newThis.current_gradient, newThis.start_color, newThis.end_color));
        }
        // this means they want a continuous gradient
        else {
            continuous = true;
        }
        
        d3.csv(this.countyValuePath+csvFile, function(data) {
            
            newThis.min = d3.min(data, function(d) { return +d[newThis.feature_desired]; }).toString();
            newThis.max = d3.max(data, function(d) { return +d[newThis.feature_desired]; }).toString();
            
            if (!continuous) {
                color.domain([newThis.min,newThis.max]);
                newThis.rangeBoxes(newThis.current_gradient);
            }
            else{
                newThis.drawContinuousGrad();
            }
            
            d3.json(newThis.countyMapPath+stateFile, function(json) {
                
                // create a first guess for the projection
                var center = newThis.computeCenter(json);
                var scale  = 10;
                var offset = [newThis.w/2, newThis.h/2];
                newThis.projection = d3.geo.mercator().scale(scale)
                    .center(center).translate(offset);
                
                // create the path
                newThis.path = d3.geo.path().projection(newThis.projection);
                
                // using the path determine the bounds of the current map and use
                // these to determine better values for the scale and translation
                var bounds  = newThis.path.bounds(json);
                
                var hscale, vscale, scale, offset;
                
                if (stateFile.substring(0,2) == "AK") {
                    hscale  = scale*newThis.w*5 / (bounds[1][0] - bounds[0][0]);
                    vscale  = scale*newThis.h*5 / (bounds[1][1] - bounds[0][1]);
                    scale   = (hscale < vscale) ? hscale : vscale;
                    offset  = [newThis.w - (bounds[0][0] + bounds[1][0])/2.5,
                        newThis.h - (bounds[0][1] + bounds[1][1])/2.1];
                }
                else{
                    hscale  = scale*newThis.w*0.75  /(bounds[1][0] - bounds[0][0]);
                    vscale  = scale*newThis.h*0.75 / (bounds[1][1] - bounds[0][1]);
                    scale   = (hscale < vscale) ? hscale : vscale;
                    offset  = [ newThis.w-(bounds[0][0] + bounds[1][0])/2,
                        newThis.h-(bounds[0][1] + bounds[1][1])/2.1];
                }
                
                // new projection
                newThis.projection = d3.geo.mercator().scale(scale)
                    .center(center).translate(offset);
                
                newThis.path = newThis.path.projection(newThis.projection);
                
                newThis.svg.selectAll("path")
                    .data(json.features)
                    .enter()
                    .append("path")
                    .attr("d", newThis.path)
                    .attr("id", function(d) {
                        return d.properties.NAME;
                    })
                    .style("fill", function(d) {
                        //Get data value
                        if ( d.properties.LSAD == "city")
                        {
                            d.properties.NAME += " City";
                        }
                        
                        d.properties.value = newThis.getCountyValuesFunction(data, d.properties.NAME, newThis.feature_desired);
                        var value = d.properties.value;
                        
                        if (newThis.max == newThis.min) {
                            return newThis.end_color;
                        }
                        
                        if (!continuous && value) {//If value exists…
                            return color(value);
                        }
                        else if (continuous && value) {
                            return d3.interpolate(newThis.start_color, newThis.end_color)((value - newThis.min)/(newThis.max-newThis.min));
                        }
                        else {//If value is undefined…
                            return "#ccc";
                        }
                    })
                    // Apply these attributes to this map object
                    .style("stroke-width", "1")
                    .style("stroke", "black")
                    .on("click", newThis.clickWithObservers)
                    .on("mouseover", newThis.mouseOver)
                    .on("mouseout", newThis.mouseOut);
                
            })
            
            d3.select("#floatingBarsG")
                .style("visibility", "hidden");
            
        })
        
    };
    
    var click = function() {
        var poke_data = this.csvUSValueFile;
        var map_json_file = this.usMapFile;

        //newThis.drawMap(map_json_file, poke_data);
        newThis.drawMap();
    };
    
    this.setManager = function(man){
        this.manager = man;
        return this;
    }
    
    this.addObserver = function(map){
        this.observers.push(map);
        return this;
    }
    
    this.clickWithObservers = function(){
        
        newThis.drawMap();
        
        for (var i = 0; i < newThis.observers.length; i += 1){
            
            newThis.observers[i].drawMap();
            
        }
        
    }
    
    return this;
    
};