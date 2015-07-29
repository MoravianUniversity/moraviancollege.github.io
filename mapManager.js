function mapManager() {
    
    this.mapList = [];
    this.current_gradient = 2;
    this.mapCounter = 0;
    var newThis = this;

	this.maps = function() {
	
		return newThis.mapList;
		
	}
	
    this.addMap = function(map) {
        this.mapCounter ++;

        map.setManager(this);
        
        this.mapList.push(map);
        
        if(this.mapList.length != 1){
            
            for(var i = 0; i < this.mapList.length - 1; i += 1){
                
                this.mapList[i].addObserver(this.mapList[this.mapList.length - 1]);
                this.mapList[this.mapList.length - 1].addObserver(this.mapList[i]);
                
            }
            
        }
        
        return this;
        
    };
    
    this.drawMaps = function(){
        var scale;
        var column_width;
        var column_margin;

        if (this.mapCounter == 1) {
            scale = 1;
            column_width = "row";
            column_margin = " auto";

        } else {
            scale = 0.65;
            column_width = "col-md-7 col-md-offset-1";
            column_margin = " 2.5%"
        }

        for(var i = 0; i < this.mapList.length; i += 1){
            console.log(scale);
            this.mapList[i].setScaler(scale, column_width, column_margin);
            console.log(this.mapList[i].svgScaler);
            this.mapList[i].setup();
            this.mapList[i].drawMap();
        }
        
    };

    this.setMapColors = function(min_color, max_color){
        for(var i = 0; i < this.mapList.length; i += 1){
            this.mapList[i].setColors(min_color, max_color);
            this.mapList[i].change_gradient(this.mapList[i].current_gradient);
        }
    }

    this.makeCombo = function() {
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

            d3.select("#option" + newThis.current_gradient.toString())
                .attr("selected", "selected");
        }

        d3.select("select").on("change", function() {
            var value = this.options[this.selectedIndex].value;
            for(var i = 0; i < newThis.mapList.length; i += 1) {
                newThis.mapList[i].change_gradient(value);
                newThis.mapList[i].current_gradient = value;
            };
        });
    };

    this.redraw = function() {

        for (var i = 0; i < this.mapList.length; i += 1) {
            this.mapList[i].setColors(String(getColor("min_color_picker")), String(getColor("max_color_picker"))).drawMap();
        };
    };

    return this;

};