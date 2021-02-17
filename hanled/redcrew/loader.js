function wresize () {
	$("#maincontainer").css("min-height", $(window).innerHeight() );
	$("#maincontainer").css("max-height", $(window).innerHeight() );
	$(".width100").css("width", $(window).innerWidth() );

	$("#undercontainer").css("min-height", $(window).innerHeight() );
	
	$("#ledcontainer").css("height", $(window).innerHeight() );
	$("#ledframe").css("left", ( $("#ledcontainer").outerWidth() -
		parseInt($("#ledcontainer").css("padding") ) * 2 - TickerWidth) / 2) ;
	$("#ledframe").css("top", ( $("#ledcontainer").outerHeight() -
		parseInt($("#ledcontainer").css("padding") ) * 2 - TickerHeight) / 2) ;
	
	if ($("#ledrotate").val() == '90deg' || $("#ledrotate").val() == '270deg') {
		var zoomratio = Math.min( $("#ledcontainer").outerHeight() / TickerWidth,
			$("#ledcontainer").outerWidth() / TickerHeight );
	} else {
		var zoomratio = Math.min( $("#ledcontainer").outerWidth() / TickerWidth,
			$("#ledcontainer").outerHeight() / TickerHeight );
	}

	$("#ledframe").css({
		msTransform:      'scale(' + zoomratio + ', ' + zoomratio + ') rotate(' + $("#ledrotate").val() + ')',
		webkitTransform:  'scale(' + zoomratio + ', ' + zoomratio + ') rotate(' + $("#ledrotate").val() + ')',
		transform:        'scale(' + zoomratio + ', ' + zoomratio + ') rotate(' + $("#ledrotate").val() + ')'
	});

}

function forcescroll () {
	// window.scrollTo(0, $("#ledcontainer").position().top);
	$("#maincontainer").scrollTop( $('#header').outerHeight() );
}

function underscroll () {
	$("#maincontainer").scrollTop( $('#header').outerHeight() + $('#ledcontainer').outerHeight() );
}

/* function changetext (fname) {
	$("#ledframe").attr('src', 'core.html?data=' + fname);
} */

/* Ready */
$(document).ready(function() {
	wresize();

	$("#ledcontainer").click(function()    {  forcescroll();  } );
	$("#ledcontainer").dblclick(function() {  underscroll();  } );
	
	$(".textchange").click(function() {
		//$("#ledframe").attr('src', 'core.html?data=xml/' + $(this).attr("data-filename") + '.xml');
		window.ledframe.location.replace('core.html?data=xml/' + $(this).attr("data-filename") + '.xml');
		forcescroll();
	});

	$("#ledrotate").click(function() { wresize(); } );
});

$(window).resize(function() {
	wresize();
	forcescroll();
});
