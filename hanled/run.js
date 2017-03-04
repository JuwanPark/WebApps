// Ready
var rft = setInterval(function(){ ready_for_ticker() }, 10);
var anima;
function ready_for_ticker () {
	if (prepared >= 4) {
		clearInterval(rft);
		startload();
	}
}

function startload() {
	// Default size
	$("#container").css("width", t_width + "px");
	$("#container").css("height", t_height + "px");
	// Read XML
	if ( receive_get_data("data") ) {
		$.ajax({
			type: "GET",
			url: receive_get_data("data"),
			dataType: "xml",
			cache: false,
			success: function (xml) {
				// Parse the xml file and get data
				$(xml).find("ticker").each(function(){
					var r_color, r_delay;
					// Resize
					t_width = $(this).attr("cols") * 32;
					t_height = $(this).attr("rows") * 64;
					$("#container").css("width", t_width + "px");
					$("#container").css("height", t_height + "px");
					
					// Default color
					if ( $(this).attr("defaultcolor") ) {
						main_def_color = parseInt( $(this).attr("defaultcolor") );
					}
					next_term = parseInt( $(this).attr("nextterm") );
					if (isNaN(next_term) )  { next_term = 2; }
					
					// Get textes
					$(this).find("text").each(function(){
						if ( $(this).attr("color") ) {
							r_color = parseInt( $(this).attr("color") );
						} else {
							r_color = main_def_color;
						}
						r_delay = parseInt( $(this).attr("delay") );
						if (isNaN(r_delay) )  { r_delay = 4; }

						list_of_item.push( { "text": $(this).text(),
						                     "color": r_color,
						                     "in": String( $(this).attr("in") ).toLowerCase(),
						                     "out": String( $(this).attr("out") ).toLowerCase(),
						                     "delay": r_delay,
						                     "pause": parseInt( "0" + $(this).attr("pause") ) });
					});
				});
				// Start
				start_item(current_item);
			}
		});
	}
}

function start_item (item_no) {
	disptxt( list_of_item[item_no]["text"], list_of_item[item_no]["color"] );
	switch(list_of_item[item_no]["in"]) {
		case "immediately":
			$("#ticker").css("left", 0);
			$("#ticker").css("top", 0);
			$("#ticker").css("opacity", 1);
			break;
		case "fade":
			$("#ticker").css("left", 0);
			$("#ticker").css("top", 0);
			$("#ticker").css("opacity", 0);
			break;
		case "upward":
			$("#ticker").css("left", 0);
			$("#ticker").css("top", t_height);
			$("#ticker").css("opacity", 1);
			break;
		case "downward":
			$("#ticker").css("left", 0);
			$("#ticker").css("top", $("#ticker").height() * -1);
			$("#ticker").css("opacity", 1);
			break;
		case "rightward":
			$("#ticker").css("left", $("#ticker").width() * -1);
			$("#ticker").css("top", 0);
			$("#ticker").css("opacity", 1);
			break;
		case "leftward":
		default:
			$("#ticker").css("left", t_width);
			$("#ticker").css("top", 0);
			$("#ticker").css("opacity", 1);
	}
	anima = setInterval(function(){ moving_item(item_no) },
		10 * list_of_item[item_no]["delay"]);
}

function moving_item (item_no) {
	var finished = false;
	switch(list_of_item[item_no]["in"]) {
		case "immediately":
			finished = true;
			break;
		case "fade":
			if (parseFloat( $("#ticker").css("opacity") ) < 1 ) {
				$("#ticker").css("opacity", parseFloat( $("#ticker").css("opacity") ) + 0.1);
			} else {
				finished = true;
			}
			break;
		case "upward":
			if ($("#ticker").position().top > t_height - $("#ticker").height() ) {
				$("#ticker").css("top", ($("#ticker").position().top - 4) + "px");
			} else {
				finished = true;
			}
			break;
		case "downward":
			if ($("#ticker").position().top < 0 ) {
				$("#ticker").css("top", ($("#ticker").position().top + 4) + "px");
			} else {
				finished = true;
			}
			break;
		case "rightward":
			if ($("#ticker").position().left < 0 ) {
				$("#ticker").css("left", ($("#ticker").position().left + 4) + "px");
			} else {
				finished = true;
			}
			break;
		case "leftward":
		default:
			if ($("#ticker").position().left > t_width - $("#ticker").width() ) {
				$("#ticker").css("left", ($("#ticker").position().left - 4) + "px");
			} else {
				finished = true;
			}
	}
	if (finished) {
		clearInterval(anima);
		setTimeout(function(){
			anima = setInterval(function(){ outing_item(item_no) },
				10 * list_of_item[item_no]["delay"]);
		}, list_of_item[item_no]["pause"] * 500);
	}
}

function outing_item (item_no) {
	var finished = false;
	switch(list_of_item[item_no]["out"]) {
		case "immediately":
			$("#ticker").css("top", ($("#ticker").height() * -1) + "px");
			finished = true;
			break;
		case "fade":
			if (parseFloat( $("#ticker").css("opacity") ) > 0 ) {
				$("#ticker").css("opacity", parseFloat( $("#ticker").css("opacity") ) - 0.1);
			} else {
				finished = true;
			}
			break;
		case "upward":
			if ($("#ticker").position().top > $("#ticker").height() * -1 ) {
				$("#ticker").css("top", ($("#ticker").position().top - 4) + "px");
			} else {
				finished = true;
			}
			break;
		case "downward":
			if ($("#ticker").position().top < t_height ) {
				$("#ticker").css("top", ($("#ticker").position().top + 4) + "px");
			} else {
				finished = true;
			}
			break;
		case "rightward":
			if ($("#ticker").position().left < t_width ) {
				$("#ticker").css("left", ($("#ticker").position().left + 4) + "px");
			} else {
				finished = true;
			}
			break;
		case "leftward":
		default:
			if ($("#ticker").position().left > $("#ticker").width() * -1 ) {
				$("#ticker").css("left", ($("#ticker").position().left - 4) + "px");
			} else {
				finished = true;
			}
	}
	if (finished) {
		clearInterval(anima);
		setTimeout(function(){
			current_item++;
			if (current_item >= list_of_item.length)  { current_item -= list_of_item.length; }
			start_item(current_item);
		}, next_term * 500);
	}
}