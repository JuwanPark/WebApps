function wresize () {
	//console.log("Hello, world!");
	$("#ledcontainer").css("height", $(window).innerHeight() );
	$("#ledframe").css("left", ( $("#ledcontainer").outerWidth() -
		parseInt($("#ledcontainer").css("padding") ) * 2 - 512) / 2) ;
	$("#ledframe").css("top", ( $("#ledcontainer").outerHeight() -
		parseInt($("#ledcontainer").css("padding") ) * 2 - 128) / 2) ;
	
	var zoomratio = Math.min( $("#ledcontainer").outerWidth() / 512,
		$("#ledcontainer").outerHeight() / 128 );

	$("#ledframe").css({
		msTransform:      'scale(' + zoomratio + ', ' + zoomratio + ')',
		webkitTransform:  'scale(' + zoomratio + ', ' + zoomratio + ')',
		transform:        'scale(' + zoomratio + ', ' + zoomratio + ')'
	});

}

function forcescroll () {
	window.scrollTo(0, $("#ledcontainer").position().top);
}

/* Ready */
$(document).ready(function() {
	wresize();
	$("#ledcontainer").click(function() {
		forcescroll();
	});
});

$(window).resize(function() {
	wresize();
	forcescroll();
});
