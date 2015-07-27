function mapManager() {
    
    this.mapList = [];
    
    this.addMap = function(map) {
        
        this.mapList.push(map);
        
        return this;
        
    };
    
    this.drawMaps = function(){
        
        for(var i = 0; i < this.mapList.length; i += 1){
            this.mapList[i].setup();
            this.mapList[i].drawMap();
        }
        
    };

    this.setMapColors = function(min_color, max_color){
        for(var i = 0; i < this.mapList.length; i += 1){
            this.mapList[i].setColors(min_color, max_color);
            this.mapList[i].drawMap();
        }
    }


    return this;

};