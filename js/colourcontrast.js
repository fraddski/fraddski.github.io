var FG_INDEX = 0;
var BG_INDEX = 1;
var AA_SMALL_MIN = 4.5;
var AA_LARGE_MIN = 3;
var AAA_SMALL_MIN = 7;
var AAA_LARGE_MIN = 4.5;
/* Valid colour names, with RGB values. See https://www.w3.org/TR/css3-color/#svg-color */
var NAMED_LOOKUP = { aliceblue:[240,248,255], antiquewhite:[250,235,215], aqua:[0,255,255], aquamarine:[127,255,212], azure:[240,255,255],
 	beige:[245,245,220], bisque:[255,228,196], black:[0,0,0], blanchedalmond:[255,235,205], blue:[0,0,255], blueviolet:[138,43,226],
 	brown:[165,42,42], burlywood:[222,184,135], cadetblue:[95,158,160], chartreuse:[127,255,0], chocolate:[210,105,30], coral:[255,127,80],
 	cornflowerblue:[100,149,237], cornsilk:[255,248,220], crimson:[220,20,60], cyan:[0,255,255], darkblue:[0,0,139], darkcyan:[0,139,139],
 	darkgoldenrod:[184,134,11], darkgray:[169,169,169], darkgreen:[0,100,0], darkgrey:[169,169,169], darkkhaki:[189,183,107],
	darkmagenta:[139,0,139], darkolivegreen:[85,107,47], darkorange:[255,140,0], darkorchid:[153,50,204], darkred:[139,0,0],
 	darksalmon:[233,150,122], darkseagreen:[143,188,143], darkslateblue:[72,61,139], darkslategray:[47,79,79], darkslategrey:[47,79,79],
 	darkturquoise:[0,206,209], darkviolet:[148,0,211], deeppink:[255,20,147], deepskyblue:[0,191,255], dimgray:[105,105,105],
	dimgrey:[105,105,105], dodgerblue:[30,144,255], firebrick:[178,34,34], floralwhite:[255,250,240], forestgreen:[34,139,34],
 	fuchsia:[255,0,255], gainsboro:[220,220,220], ghostwhite:[248,248,255], gold:[255,215,0], goldenrod:[218,165,32], gray:[128,128,128],
 	green:[0,128,0], greenyellow:[173,255,47], grey:[128,128,128], honeydew:[240,255,240], hotpink:[255,105,180], indianred:[205,92,92],
 	indigo:[75,0,130], ivory:[255,255,240], khaki:[240,230,140], lavender:[230,230,250], lavenderblush:[255,240,245], lawngreen:[124,252,0],
 	lemonchiffon:[255,250,205], lightblue:[173,216,230], lightcoral:[240,128,128], lightcyan:[224,255,255], lightgoldenrodyellow:[250,250,210],
 	lightgray:[211,211,211], lightgreen:[144,238,144], lightgrey:[211,211,211], lightpink:[255,182,193], lightsalmon:[255,160,122],
 	lightseagreen:[32,178,170], lightskyblue:[135,206,250], lightslategray:[119,136,153], lightslategrey:[119,136,153],
	lightsteelblue:[176,196,222], lightyellow:[255,255,224], lime:[0,255,0], limegreen:[50,205,50], linen:[250,240,230], magenta:[255,0,255],
 	maroon:[128,0,0], mediumaquamarine:[102,205,170], mediumblue:[0,0,205], mediumorchid:[186,85,211], mediumpurple:[147,112,219],
 	mediumseagreen:[60,179,113], mediumslateblue:[123,104,238], mediumspringgreen:[0,250,154], mediumturquoise:[72,209,204],
	mediumvioletred:[199,21,133], midnightblue:[25,25,112], mintcream:[245,255,250], mistyrose:[255,228,225], moccasin:[255,228,181],
 	navajowhite:[255,222,173], navy:[0,0,128], oldlace:[253,245,230], olive:[128,128,0], olivedrab:[107,142,35], orange:[255,165,0],
 	orangered:[255,69,0], orchid:[218,112,214], palegoldenrod:[238,232,170], palegreen:[152,251,152], paleturquoise:[175,238,238],
 	palevioletred:[219,112,147], papayawhip:[255,239,213], peachpuff:[255,218,185], peru:[205,133,63], pink:[255,192,203], plum:[221,160,221],
 	powderblue:[176,224,230], purple:[128,0,128], red:[255,0,0], rosybrown:[188,143,143], royalblue:[65,105,225], saddlebrown:[139,69,19],
  salmon:[250,128,114], sandybrown:[244,164,96], seagreen:[46,139,87], seashell:[255,245,238], sienna:[160,82,45], silver:[192,192,192],
 	skyblue:[135,206,235], slateblue:[106,90,205], slategray:[112,128,144], slategrey:[112,128,144], snow:[255,250,250],
	springgreen:[0,255,127], steelblue:[70,130,180], tan:[210,180,140], teal:[0,128,128], thistle:[216,191,216], tomato:[255,99,71],
 	turquoise:[64,224,208], violet:[238,130,238], wheat:[245,222,179], white:[255,255,255], whitesmoke:[245,245,245], yellow:[255,255,0],
	yellowgreen:[154,205,50] };

var rgbColours = [[0,0,0],[255,255,255]];

function updateColours(colourInput, colourType) {
	var isColourValid = false;

	var col = $(colourInput).val().trim().toLowerCase();
	if (col.charAt(0) == "#") {
		col = col.substring(1, col.length);
	}

	if (NAMED_LOOKUP[col]) {
		rgbColours[colourType] = NAMED_LOOKUP[col];
		isColourValid = true;
	} else if (col.indexOf('rgb(') == 0) {
		var rgbArray = col.slice(4).replace(')', '').split(',');
		if (rgbArray.length == 3) {
			var r = parseInt(rgbArray[0], 10);
			var g = parseInt(rgbArray[1], 10);
			var b = parseInt(rgbArray[2], 10);
			if (!isNaN(r) && r <= 255 && !isNaN(g) && g <= 255 && !isNaN(b) && b <= 255) {
				rgbColours[colourType][0] = r;
				rgbColours[colourType][1] = g;
				rgbColours[colourType][2] = b;
				isColourValid = true;
			}
		}
	} else if (/^[0-9a-f]{3}$|^[0-9a-f]{6}$/.test(col)){
		if (col.length == 3) {
			var tmpCol = col;
			col = tmpCol.charAt(0) + tmpCol.charAt(0) + tmpCol.charAt(1) + tmpCol.charAt(1) + tmpCol.charAt(2) + tmpCol.charAt(2);
		}
		rgbColours[colourType][0] = parseInt(col.substr(0,2),16);
		rgbColours[colourType][1] = parseInt(col.substr(2,2),16);
		rgbColours[colourType][2] = parseInt(col.substr(4,2),16);
		isColourValid = true;
	}
	if (isColourValid) {
		$(colourInput).removeClass("invalid");
		$(colourInput).attr("aria-invalid", "false");
	} else {
		$(colourInput).addClass("invalid");
		$(colourInput).attr("aria-invalid", "true");
	}
}

function getLuminance(rgb) {
	for (var i =0; i<rgb.length; i++) {
		if (rgb[i] <= 0.03928) {
			rgb[i] = rgb[i] / 12.92;
		} else {
			rgb[i] = Math.pow( ((rgb[i]+0.055)/1.055), 2.4 );
		}
	}
	var l = (0.2126 * rgb[0]) + (0.7152 * rgb[1]) + (0.0722 * rgb[2]);
	return l;
};

function calculateRatio() {
	if (!$("#colour_foreground").hasClass("invalid") && !$("#colour_background").hasClass("invalid")) {
		var ratio = 1;
		var l1 = getLuminance([rgbColours[FG_INDEX][0]/255, rgbColours[FG_INDEX][1]/255, rgbColours[FG_INDEX][2]/255]);
		var l2 = getLuminance([rgbColours[BG_INDEX][0]/255, rgbColours[BG_INDEX][1]/255, rgbColours[BG_INDEX][2]/255]);

		if (l1 >= l2) {
			ratio = (l1 + .05) / (l2 + .05);
		} else {
			ratio = (l2 + .05) / (l1 + .05);
		}
		ratio = Math.round(ratio * 10) / 10;

		$("#ratio").text(ratio);

		var isAAsmall = (ratio >= AA_SMALL_MIN);
		$("#aa_small").toggleClass("pass", isAAsmall);
		$("#aa_small .tooltip").html("<p>These colours <em>" + (isAAsmall ? "are" : "are not") + "</em> AA compliant for body text</p>");

		var isAAlarge = (ratio >= AA_LARGE_MIN);
		$("#aa_large").toggleClass("pass", isAAlarge);
		$("#aa_large .tooltip").html("<p>These colours <em>" + (isAAlarge ? "are" : "are not") + "</em> AA compliant for heading text</p>");

		var isAAAsmall = (ratio >= AAA_SMALL_MIN);
		$("#aaa_small").toggleClass("pass", isAAAsmall);
		$("#aaa_small .tooltip").html("<p>These colours <em>" + (isAAAsmall ? "are" : "are not") + "</em> AAA compliant for body text</p>");

		var isAAAlarge = (ratio >= AAA_LARGE_MIN);
		$("#aaa_large").toggleClass("pass", isAAAlarge);
		$("#aaa_large .tooltip").html("<p>These colours <em>" + (isAAAlarge ? "are" : "are not") + "</em> AAA compliant for heading text</p>");

		$("#sample").css("color", "rgb(" + rgbColours[FG_INDEX][0] + "," + rgbColours[FG_INDEX][1] + "," + rgbColours[FG_INDEX][2] + ")");
		$("#sample").css("background-color", "rgb(" + rgbColours[BG_INDEX][0] + "," + rgbColours[BG_INDEX][1] + "," + rgbColours[BG_INDEX][2] + ")");
	} else {
		$("#ratio").text("");
		$("#aa_small").removeClass("pass");
		$("#aa_large").removeClass("pass");
		$("#aaa_small").removeClass("pass");
		$("#aaa_large").removeClass("pass");
		$("#aa_small .tooltip").html("<p>Invalid colour entry</p>");
		$("#aa_large .tooltip").html("<p>Invalid colour entry</p>");
		$("#aaa_small .tooltip").html("<p>Invalid colour entry</p>");
		$("#aaa_large .tooltip").html("<p>Invalid colour entry</p>");
	}
}

$(document).ready(function() {
	$("#colour_foreground").change(function() {
		updateColours(this, FG_INDEX);
		calculateRatio();
	});
	$("#colour_background").change(function() {
		updateColours(this, BG_INDEX);
		calculateRatio();
	});
	calculateRatio();
});
