var navTimer = null;

function showNav(){
	if (navTimer != null)
	{
		clearTimeout(navTimer);
		navTimer = null;
	}
	else
	{
		$("nav ul").slideDown();
	}	
}

function hideNav(){
	navTimer = setTimeout(function(){ 
		$("nav ul").slideUp(); 
		navTimer = null; 
	}, 400);	
}

$(document).ready(function(){
	$("nav ul").hide();

	$("nav").hover(showNav, hideNav);
	
	$("nav").focusin(showNav);
	$("nav").focusout(hideNav);
});