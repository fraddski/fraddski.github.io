
/***** Currency conversion *****/

var currencyCodes = {
					  	SIN: "SGD",
						ZRH: "CHF",
						MUC: "EUR",
						PRG: "CZK",
						BER: "EUR",
						CPH: "DKK",
						WOR: "GBP",
						EPR: "GBP",
						LON: "GBP"
					};


function getCurrency(currencyCtl, cityCode){

	// Display feedback while we load currency data
	$(currencyCtl).html("");

	var currencyCode = currencyCodes[cityCode];

	// xe.com, used with Yahoo Query Language, to allow fetching of external content.
	// See http://developer.yahoo.com/yql for details.
	// This is required due to the Same Origin Policy (http://en.wikipedia.org/wiki/Same_origin_policy).
	var url = "http://query.yahooapis.com/v1/public/yql?callback=?";
	var query = "select * from html where url=\"http://www.xe.com/ucc/convert/?Amount=1&From=" + currencyCode + "&To=AUD\" and xpath='//tr[contains(@class,\"uccResUnit\")]'";

	$.getJSON(url, { q: query, format: "json" }, function (data) {
		try{
			if (data.query && data.query.results && data.query.results.tr && data.query.results.tr.td &&
				data.query.results.tr.td[0] && data.query.results.tr.td[0].content){
				$(currencyCtl).html("<p>" + data.query.results.tr.td[0].content + "</p>");
			} else {
				currencyError(currencyCtl);			// Results are empty - display unavailable message
			}
		}catch (e){
			currencyError(currencyCtl);				// Error occurred during processing - display unavailable message
		}
		finally{
			$(currencyCtl).hide().fadeIn('slow');
		}
	});
}


function currencyError(currencyCtl){
	$(currencyCtl).html("<p>Currency data is not currently available</p>");
}
