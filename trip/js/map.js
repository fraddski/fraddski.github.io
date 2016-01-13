
/***** Maps *****/

var mapPositions = { 
	                    MEL: new google.maps.LatLng(-37.813, 144.97),
					  	SIN: new google.maps.LatLng(1.2800945,103.85094909999998),
						ZRH: new google.maps.LatLng(47.3686498,8.539182500000038),
						MUC: new google.maps.LatLng(48.135,11.562),
						PRG: new google.maps.LatLng(50.0878114,14.420459800000003),
						BER: new google.maps.LatLng(52.519171,13.406091199999991),
						CPH: new google.maps.LatLng(55.6760968,12.568337100000008),
						WOR: new google.maps.LatLng(50.81787,-0.37288200000000415),
						EPR: new google.maps.LatLng(50.812,-0.474),
						LON: new google.maps.LatLng(51.5081289,-0.128005000000030120)
					};
var cityArrivals =  { 
						SIN: new google.maps.LatLng(1.3568,103.98910000000001),
						ZRH: new google.maps.LatLng(47.4503794,8.562384399999928),
						MUC: new google.maps.LatLng(48.140232,11.558334999999943000),
						PRG: new google.maps.LatLng(50.083214,14.435139),
						BER: new google.maps.LatLng(52.525592,13.369545000000016),
						CPH: new google.maps.LatLng(55.629563,12.639255000000048),
						WOR: new google.maps.LatLng(51.1554548,-0.165058499999986450),
						EPR: new google.maps.LatLng(51.1554548,-0.165058499999986450),
						LON: new google.maps.LatLng(51.1554548,-0.165058499999986450)
					};
var cityHotels =    { 
						SIN: new google.maps.LatLng(1.2934064,103.85826429999997),
						ZRH: new google.maps.LatLng(47.3726565,8.574215399999957),
						MUC: new google.maps.LatLng(48.1347652,11.566990000000033),
						PRG: new google.maps.LatLng(50.0886534,14.431707500000016),
						BER: new google.maps.LatLng(52.529388,13.401354999999967),
						CPH: new google.maps.LatLng(55.6761344,12.5701437),
						WOR: new google.maps.LatLng(),
						EPR: new google.maps.LatLng(),
						LON: new google.maps.LatLng(51.52531630000001,-0.08337299999993775)
					};

function loadMap(mapCtl, cityCode){	
	var mapOptions = {
		center: mapPositions[cityCode],
      	zoom: 14,
      	mapTypeId: google.maps.MapTypeId.ROADMAP,
	  	disableDefaultUI: true,
	  	styles: [
		{
			stylers:[{saturation: -100},
		  			 {gamma: 2}]
		},
		{
		    featureType: "poi.business",
		    elementType: "labels",
		    stylers: [{ visibility: "off" }]
		}
	  	]
    };
    var map = new google.maps.Map(mapCtl, mapOptions);
}

function loadDirectionsMap(mapCtl, cityCode){
	var mapOptions = {
		zoom: 15,
		center: new google.maps.LatLng(48.135, 11.5667),
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		mapTypeControl: false,
		scaleControl: false,
		streetViewControl: false
	};
	var map = new google.maps.Map(mapCtl, mapOptions);

	var rendererOptions = { map: map };
	
	var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
	
	var request = {
		origin: cityArrivals[cityCode],
		destination: cityHotels[cityCode],
		travelMode: google.maps.DirectionsTravelMode.WALKING
	};

	var directionsService = new google.maps.DirectionsService();
	directionsService.route(request, function(response, status) {
		if (status == google.maps.DirectionsStatus.OK) {
			directionsDisplay.setDirections(response);
		}
	});
}
