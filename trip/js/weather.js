
/***** Weather forecast *****/

var woeids = { 
				MEL: "12707339", 
				SIN: "1062617",
				ZRH: "784794",
				MUC: "676757",
				PRG: "796597",
				BER: "638242",
				CPH: "554890",
				WOR: "41169",
				EPR: "19069",
				LON: "44418"
			 };

var weatherIcons = [
	["|31|32|33|34|36|", "img/weather-sun.png"],
	["|29|30|44|", "img/weather-cloudy-with-sun.png"],
	["|21|22|24|25|27|28|", "img/weather-light-cloud.png"],
	["|19|20|26|", "img/weather-cloudy.png"],
	["|9|10|11|12|23|40|45|", "img/weather-cloudy-with-rain.png"],
	["|0|1|2|17|35|", "img/weather-rain.png"],
	["|3|4|37|38|39|47|", "img/weather-lightning.png"],
	["|7|13|14|15|16|41|42|43|", "img/weather-snow.png"],
	["|5|6|8|18|46|", "img/weather-cloudy-with-snow.png"]
];

function getWeatherIconUrl(forecastCode){
	for (var i=0; i < weatherIcons.length; i++){
		if (weatherIcons[i][0].indexOf("|" + forecastCode + "|") > -1){
			return weatherIcons[i][1];
		}
	}
}

function getWeather(weatherCtl, cityCode){
	
	// Display feedback while we load weather data
	$(weatherCtl).html("");

	var woeid = woeids[cityCode];

	// Yahoo! Weather, used with Yahoo Query Language, to allow fetching of external content.
	// See http://developer.yahoo.com/yql for details.
	// This is required due to the Same Origin Policy (http://en.wikipedia.org/wiki/Same_origin_policy).
	var url = "http://query.yahooapis.com/v1/public/yql?callback=?";
	var query = "select * from rss where url=\"http://weather.yahooapis.com/forecastrss?u=c&w=" + woeid + "\"";
	
	$.getJSON(url, { q: query, format: "json" }, function (data) {
		try{
			if (data.query && data.query.results && data.query.results.item && data.query.results.item.forecast){
				var forecastText = "";
				
				var i = 0;
				$(data.query.results.item.forecast).each(function() {
					if (i < 2){					
						//var imgUrl = "http://l.yimg.com/a/i/us/we/52/" + this.code + ".gif";
						var imgUrl = getWeatherIconUrl(this.code);	
							
						forecastText += "<div class='item'>";
						forecastText += "<img src='" + imgUrl + "' alt='" + this.text + "'/>";
						forecastText += "<div class='day'>" + this.day + "</div>";
						forecastText += "<div class='forecast'>" + this.text.toLowerCase() + "</div>";
						forecastText += "<div class='temps'><span class='low'>" + this.low + "&deg;</span>" +
										"<span class='high'>" + this.high + "&deg;</span></div>";
						forecastText += "</div>";
						i++;
					}
				});
				
				$(weatherCtl).html(forecastText);
			} else {
				weatherError(weatherCtl);			// Results are empty - display unavailable message
			}
		}catch (e){
			weatherError(weatherCtl);				// Error occurred during processing - display unavailable message
		}
		finally{
			$(weatherCtl).hide().fadeIn('slow');
		}		
	});
}


function weatherError(weatherCtl){
	$(weatherCtl).html("<p>Weather data is not currently available.</p>");
}
