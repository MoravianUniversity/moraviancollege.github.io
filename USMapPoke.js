function drawTheUSPokeRatioMap(){

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
            if (part[len-1] == "County" || part[len-1] == "Borough" || part[len-1] == "Parish") {
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
	
	//Create file paths. Used in setPaths function
	var us_poke_data_file = " json/poke_ratio_correct2.csv";
	var map_json_file = "json/us-states.json";
	var county_path_file = "json/stateJSON/";
	var county_poke_data_file = "json/countyPokes/";
	
	//Build map
	var map = gradientMap.setColors("#002966","#B2D1FF")
				.setFeature("Poke Ratio")
				//.setFunctions(getStateValuesFunction, getCountyValuesFunction)
				.setPaths(map_json_file, us_poke_data_file, county_path_file, county_poke_data_file)
				.setStartingGradient(-1)
				.setup();
				
	//Draw map
	map.drawMap();
};


drawTheUSPokeRatioMap();