#Using the Gradient Map with your data

##What we have for you to use
This project currently contains tools to show a map with data on average poke ratios for each state, as well as each county in these states. In order to do this, there is a JSON file that is used to draw the map of the nation, as well as a JSON file to draw each state. There are also csv files containing the data that pertains to the average poke ratios for these areas. These allow you to see the data for the state or county that the cursor is over. The poke ratio example of this can be seen at http://moraviancollege.github.io/ .

##How to use Gradient Map for your data

###What you need

In order to use the Gradient Map for your data, you will need to have or be able to use the following:

* A file that contains your nationwide data (the poke ratio example contains a file called poke_ratio_correct2.csv. That is the equivelant to the nationwide data). It is recommended that you use a csv file that contains states/provinces in one column and the values in another.
* A JSON file that is used to draw your nation (if you are using data that pertains to the United States, you can use our JSON file, located in the json folder as us-states.json)
* A folder that contains your data for each state/province (the poke ratio example contains a folder called countyPokes in the json folder. That is the equivelant to the state/province data). It is recommended that you use a csv file that contains counties/cities in one column and the values in another. These files should be named starting with some word that defines the location that it represents (such as the abbreviation of a state)
* A folder with JSON files that are used to draw your states/provinces (if you are using data that pertains to the United States, and divides data into counties, then you can use our stateJSON folder, which is located in the json folder)
* A dictionary that contains the names of each state/province mapped to its abbreviation.

In addition to this, you will need to write a function that takes in data and the state/province name (in that order) and returns the data values for each state/province in the file that contains this information, as well as a function that takes in data and the county/city name (in that order) and returns the data values for each county/city in a state/province.

###How to insert it into Gradient Map

In order to use your data and methods, you will need to insert them into your gradient map. There are functions that allow you to do this.

* The first step of creating the Gradient Map is using the constructor. It takes your desired feature as a parameter.
* You will need to use the setColors function to set the colors, where the first parameter is the starting color, and the second is the end color.
* The setRestFileName is used to define the end of the filename that you have given the state/province data files.
* The setFunctions function takes in your state-data and county-data functions in that order.
* The setStateAbbreviations function takes in your state/province dictionary.
* The setPaths function takes in the nation JSON file, the nation data file, the path to the county JSON files, and

An example for how to write this in your file would go as follows:

	var map = new GradientMap('poke_ratio')
		.setColors('#EBF5FF','#002966')
		.setRestFileName('poke.csv')
		.setFunctions(getStateValuesFunction, getCountyValuesFunction)
		.setStateAbbreviations(state_abbreviations)
		.setPaths(map_json_file, us_poke_data_file, county_path_file, county_poke_data_file);

After creating this map, you will have to create a mapManager object. After creating this object, call its makeCombo function to allow it to create the objects that allow it to manipulate your maps. Then add your map to the mapManager using the addMap function. An example of this would go as follows:

	var manager = new mapManager();
		manager.makeCombo();
		manager.addMap(map);
		manager.addMap(map2);

##Our Suggestion

We have written code for our poke ratio example that can be slightly changed to fit other forms of data. If your data contains two columns, one for locations and one for values, then you can write your functions in a similar way to how the poke ratio example is written. To write the function that you are using to get the values from your national data, we recommend that you use your state/province name parameter as a key. You could go through your data until you find the state/province that you are looking for, and then take the value from that space and return it. This could also work for the function that you are writing to get data from your city/county data. The reason that these are separate functions is that you might want to treat the data differently. For example, the poke ratio example adjusts for words such as "County", "Borough", and "Parish" in getCountyValuesFunction().

If you are using data that pertains to the United States, you can create a state_abbreviations dictionary like so:

	var state_abbreviations = {};
	state_abbreviations["Alabama"] = "AL";
	state_abbreviations["Alaska"] = "AK";
	
You would continue this for each state that you were using.

(If you are including more territories, you can add them the same way every other location was added)

After this, you create the map, like so:

	var map = new GradientMap('poke_ratio')
						.setColors('#EBF5FF','#002966')
						.setRestFileName('poke.csv')
						.setFunctions(getStateValuesFunction, getCountyValuesFunction)
						.setStateAbbreviations(state_abbreviations)
						.setPaths(map_json_file, us_poke_data_file, county_path_file, county_poke_data_file);
	

After creating the map, create your map manager, run its makeCombo function, and add the map to it. For example:

	var manager = new mapManager();
	manager.makeCombo();
	manager.addMap(map);

Finally, call your map manager's drawMaps function to draw all maps in the manager.

	manager.drawMaps();