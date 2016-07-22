var FG_INDEX = 0;
var BG_INDEX = 1;
var AA_SMALL_MIN = 4.5;
var AA_LARGE_MIN = 3;
var AAA_SMALL_MIN = 7;
var AAA_LARGE_MIN = 4.5;

var rgbColours = [[0,0,0],[255,255,255]];

function updateColours(colourInput, colourType) {
	var isColourValid = false;

	var col = $(colourInput).val().toUpperCase();
	if (col.charAt(0) == "#") {
		col = col.substring(1, col.length);
	}

	if (col.indexOf('RGB(') == 0) {
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
	} else if (/^[0-9A-F]{3}$|^[0-9A-F]{6}$/.test(col)){
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
