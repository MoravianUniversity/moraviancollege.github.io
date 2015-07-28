function mapManager() {
    
    this.mapList = [];
    
    this.comboExists = false;
    
    this.addMap = function(map) {
        
        this.mapList.push(map);
        
        //this.mapList[this.mapList.length - 1].addManager(this);
        
        return this;
        
    };
    
    this.drawMaps = function(){
        
        for(var i = 0; i < this.mapList.length; i += 1){
            this.mapList[i].setup();
            this.mapList[i].drawMap();
        }
        
    };
    
    this.redraw = function(){
        
        for(var i = 0; i < this.mapList.length; i += 1){
            
            this.mapList[i].setColors(String(getColor("min_color_picker")), String(getColor("max_color_picker"))).drawMap();
            
        }
        
    }
    
    this.drawCounties = function(path, csvPath){
        
        for(var i = 0; i < this.mapList.length; i += 1){
            
            this.mapList[i].drawCounties(path, csvPath);
            
        }
        
    }
    
    this.makeCombo = function(){
        
        if(this.comboExists){
            return;
        }
        
        this.comboExist = true;
        
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
        
    }
    
    return this;
    
};