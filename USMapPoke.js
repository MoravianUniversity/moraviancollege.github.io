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
				.setFunctions(getStateValuesFunction, getCountyValuesFunction)
				.setStateAbbreviations(state_abbreviations)
				.setPaths(map_json_file, us_poke_data_file, county_path_file, county_poke_data_file)
				.setStartingGradient(-1)
				.setup();
				
	//Draw map
	map.drawMap();
};


drawTheUSPokeRatioMap();