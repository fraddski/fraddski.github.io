
var functionFactory = {
	createSprite: function (image, person, xPos, yPos, layer){
		return function(){
			var personSprite = new Kinetic.Sprite({
                image: image,
				x: xPos,
				y: yPos,
				animations: person.animations,
                animation: 'idle',
                frameRate: 9,
                frameIndex: 0
			});
		    person.sprite = personSprite;
			layer.add(personSprite);
            personSprite.start();
		}
	},
	
	setDestination: function (cityCode){
		return function(){
			this.setRadius(marker_radius + 2);
			this.setFill(marker_sel_colour);
			markerLayer.draw();
			document.body.style.cursor = 'default';
			for (marker in mapMarkers){
                mapMarkers[marker].circle.off('mouseup');
                mapMarkers[marker].circle.off('touchend');
                mapMarkers[marker].circle.off('mouseover');
                mapMarkers[marker].circle.off('mouseout');
            }

			travelDestination = cityCode;
			for (var i=0; i < people.length; i++){
				people[i].currentRoute = people[i].travelRoutes[cityCode];
				people[i].walk();
			}
			travelInterval = setInterval(monitorTravel, 500);
		}
	},
	
	walk: function (){
		return function(){
			if (this.currentRoute !== null && this.currentRoute.length > 0){
				this.isTraveling = true;
				
				var destCode = this.currentRoute.shift();
				var destX = mapMarkers[destCode].x + this.offsetX;
				var destY = mapMarkers[destCode].y + this.offsetY;
				var xdiff = Math.abs(destX - this.sprite.getX());
				var ydiff = Math.abs(destY - this.sprite.getY());
				var dist = Math.sqrt(xdiff*xdiff + ydiff*ydiff);
				
	            if (destX < this.sprite.getX()){
	                this.sprite.setAnimation('walkleft');
	            } else {
	                this.sprite.setAnimation('walkright');
	            }
	            var tween = new Kinetic.Tween({
	                node: this.sprite, 
	                duration: dist / 80,
	                x: destX,
	                y: destY,
	                onFinish: functionFactory.arrive(this, destCode)
	            });
	            tween.play();
	        }
		}
	},
	
	arrive: function(person, cityCode){
		return function(){
			person.isTraveling = false;
			person.arrivedAt = cityCode;
			person.sprite.setAnimation('idle');
		}
	}
}



var mapStage, markerLayer, peopleLayer;
var travelDestination, travelInterval;
var map_width = 900;
var map_height = 600;
var marker_radius = 10;
var marker_colour = '#ffff00';
var marker_sel_colour = '#ffdd00';
var start_x = 100;
var start_y = 540;

var mapMarkers = {
    'sin': { x: 800, y: 550, url: './singapore' },
    'zrh': { x: 461, y: 439, url: './zurich' },
    'muc': { x: 530, y: 414, url: './munich' },
    'prg': { x: 595, y: 344, url: './prague' },
    'ber': { x: 570, y: 254, url: './berlin' },
    'cph': { x: 553, y: 134, url: './copenhagen' },
    'epr': { x: 250, y: 322, url: './eastpreston' },
    'lon': { x: 265, y: 294, url: './london' }
};

var people = [
    { 
        name: 'charlie',
        imageUrl: 'img/charlie-sprite.png',
		offsetX: -70,
		offsetY: -100,
        animations: {
	    	idle:      [ {x: 0,   y: 0,   width: 100, height: 105} ],
	        walkright: [ {x: 100, y: 0,   width: 100, height: 105},
	                     {x: 200, y: 0,   width: 100, height: 105},
	                     {x: 300, y: 0,   width: 100, height: 105},
	                     {x: 200, y: 0,   width: 100, height: 105},
	                     {x: 100, y: 0,   width: 100, height: 105},
	                     {x: 400, y: 0,   width: 100, height: 105},
	                     {x: 500, y: 0,   width: 100, height: 105},
	                     {x: 400, y: 0,   width: 100, height: 105} ],
	        walkleft:  [ {x: 100, y: 105, width: 100, height: 105},
	                     {x: 200, y: 105, width: 100, height: 105},
	                     {x: 300, y: 105, width: 100, height: 105},
	                     {x: 200, y: 105, width: 100, height: 105},
	                     {x: 100, y: 105, width: 100, height: 105},
	                     {x: 400, y: 105, width: 100, height: 105},
	                     {x: 500, y: 105, width: 100, height: 105},
	                     {x: 400, y: 105, width: 100, height: 105} ],
	        hooray:    [ {x: 0,   y: 0,   width: 100, height: 105},
	                     {x: 0,   y: 210, width: 100, height: 105},
	                     {x: 100, y: 210, width: 100, height: 105},
	                     {x: 200, y: 210, width: 100, height: 105},
	                     {x: 300, y: 210, width: 100, height: 105},
	                     {x: 400, y: 210, width: 100, height: 105},
	                     {x: 500, y: 210, width: 100, height: 105},
	                     {x: 600, y: 210, width: 100, height: 105} ]
		},
		travelRoutes: {
			sin: ['sin'],
			zrh: ['zrh'],
			muc: ['zrh', 'muc'],
			prg: ['zrh', 'muc', 'prg'],
			ber: ['zrh', 'muc', 'prg', 'ber'],
			cph: ['zrh', 'muc', 'prg', 'ber', 'epr'],
			epr: ['zrh', 'muc', 'prg', 'ber', 'epr'],
			lon: ['zrh', 'muc', 'prg', 'ber', 'epr', 'lon']
		},
		walk: functionFactory.walk()
    },
	{ 
        name: 'skye',
        imageUrl: 'img/skye-sprite.png',
		offsetX: -30,
		offsetY: -100,
        animations: {
	    	idle:      [ {x: 0,   y: 0,   width: 100, height: 105} ],
	        walkright: [ {x: 100, y: 0,   width: 100, height: 105},
	                     {x: 200, y: 0,   width: 100, height: 105},
	                     {x: 300, y: 0,   width: 100, height: 105},
	                     {x: 200, y: 0,   width: 100, height: 105},
	                     {x: 100, y: 0,   width: 100, height: 105},
	                     {x: 400, y: 0,   width: 100, height: 105},
	                     {x: 500, y: 0,   width: 100, height: 105},
	                     {x: 400, y: 0,   width: 100, height: 105} ],
	        walkleft:  [ {x: 100, y: 105, width: 100, height: 105},
	                     {x: 200, y: 105, width: 100, height: 105},
	                     {x: 300, y: 105, width: 100, height: 105},
	                     {x: 200, y: 105, width: 100, height: 105},
	                     {x: 100, y: 105, width: 100, height: 105},
	                     {x: 400, y: 105, width: 100, height: 105},
	                     {x: 500, y: 105, width: 100, height: 105},
	                     {x: 400, y: 105, width: 100, height: 105} ],
	        hooray:    [ {x: 0,   y: 0,   width: 100, height: 105},
	                     {x: 0,   y: 210, width: 100, height: 105},
	                     {x: 100, y: 210, width: 100, height: 105},
	                     {x: 200, y: 210, width: 100, height: 105},
	                     {x: 300, y: 210, width: 100, height: 105},
	                     {x: 400, y: 210, width: 100, height: 105},
	                     {x: 500, y: 210, width: 100, height: 105},
	                     {x: 600, y: 210, width: 100, height: 105} ]
		},
		travelRoutes: {
			sin: ['sin'],
			zrh: ['zrh'],
			muc: ['zrh', 'muc'],
			prg: ['zrh', 'muc', 'prg'],
			ber: ['zrh', 'muc', 'prg', 'ber'],
			cph: ['zrh', 'muc', 'prg', 'ber', 'cph'],
			epr: ['zrh', 'muc', 'prg', 'ber', 'cph'],
			lon: ['zrh', 'muc', 'prg', 'ber', 'cph', 'lon']
		},
		walk: functionFactory.walk()
    }
];

function navigate(cityCode){
	for (var i=0; i < people.length; i++){
		if (people[i].arrivedAt === travelDestination){
			people[i].sprite.setAnimation('hooray');
			var navTween = new Kinetic.Tween({
				node: people[i].sprite,
				duration: 0.9,
				x: mapMarkers[cityCode].x,
				y: mapMarkers[cityCode].y,
				scaleX: 0,
				scaleY: 0,
				easing: Kinetic.Easings.BackEaseIn,
				onFinish: function(){ setTimeout(function(){ window.location = mapMarkers[travelDestination].url; }, 300); }
			});
			navTween.play();
		}
	}
}

function manageNextMove(){
	var isArrived = false;
	for (var i=0; i < people.length; i++){
		if (people[i].arrivedAt === travelDestination){
			isArrived = true;
		} else {
			people[i].walk();
		}
	}
	if (isArrived){
		navigate(travelDestination);
	} else {
		travelInterval = setInterval(monitorTravel, 200);
	}
}

function monitorTravel(){
	for (var i=0; i < people.length; i++){
		if (people[i].isTraveling){
			return;
		}
	}
	clearInterval(travelInterval);
	manageNextMove();
}

function markerHoverIn(){
	document.body.style.cursor = 'pointer';
	this.setRadius(marker_radius + 5);
	markerLayer.draw();
}

function markerHoverOut(){
	this.setRadius(marker_radius);
	markerLayer.draw();
	document.body.style.cursor = 'default';
}

function setupMarkers(){
    markerLayer = new Kinetic.Layer();
    for (marker in mapMarkers){
        var markerCircle = new Kinetic.Circle({
            x: mapMarkers[marker].x,
            y: mapMarkers[marker].y,
            radius: marker_radius,
            fill: marker_colour,
	        shadowColor: 'black',
	        shadowOpacity: 0.2,
	        shadowOffset: { x:2, y:2 },
        });
        markerCircle.on('mouseover', markerHoverIn);
        markerCircle.on('mouseout', markerHoverOut);
		markerCircle.on('mouseup touchend', functionFactory.setDestination(marker));
        markerLayer.add(markerCircle);
        mapMarkers[marker].circle = markerCircle;
    }
    mapStage.add(markerLayer);
}

function setupPeople(){
    var peopleLayer = new Kinetic.Layer();
    for (var i=0; i < people.length; i++){
		var personImg = new Image();
		personImg.onload = functionFactory.createSprite(personImg, people[i], start_x + people[i].offsetX, start_y + people[i].offsetY, peopleLayer);
		personImg.src = people[i].imageUrl;
    }
    mapStage.add(peopleLayer);
}

function initialiseMap(containerId){
	mapStage = new Kinetic.Stage({
        container: containerId,
        width: map_width,
        height: map_height
    });
	
	setupMarkers();
	setupPeople();
}
