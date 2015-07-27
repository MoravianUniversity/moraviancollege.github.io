function mapManager() {
    
    this.mapList = [];
    
    this.addMap = function(map) {
        
        this.mapList.push(map);
        
        return this;
        
    };
    
    return this;
    
};