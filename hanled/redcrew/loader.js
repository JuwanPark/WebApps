function wresize () {
	//console.log("Hello, world!");
	$("#ledcontainer").css("height",
		($(window).innerHeight() - $(".ui-header").outerHeight() - $(".ui-footer").outerHeight() ) );
	$("#ledframe").css("left", ( $("#ledcontainer").outerWidth() -
		parseInt($("#ledcontainer").css("padding") ) * 2 - 512) / 2) ;
	$("#ledframe").css("top", ( $("#ledcontainer").outerHeight() -
		parseInt($("#ledcontainer").css("padding") ) * 2 - 128) / 2) ;
	
	var zoomratio = Math.min( $("#ledcontainer").outerWidth() / 512,
		$("#ledcontainer").outerHeight() / 128 );

	console.log( "scale(" + zoomratio + " " + zoomratio + ")" );
	$("#ledframe").css({
		msTransform:      'scale(' + zoomratio + ', ' + zoomratio + ')',
		webkitTransform:  'scale(' + zoomratio + ', ' + zoomratio + ')',
		transform:        'scale(' + zoomratio + ', ' + zoomratio + ')'
	});
}

/* Ready */
$(document).ready(function() {
	wresize();
});

$(window).resize(function() {
	wresize();
});