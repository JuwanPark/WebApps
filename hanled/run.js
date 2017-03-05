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
					var r_color, r_delay, r_h_adj, r_v_adj, r_outd, r_term;
					// Resize
					t_width = $(this).attr("cols") * 32;
					t_height = $(this).attr("rows") * 64;
					$("#container").css("width", t_width + "px");
					$("#container").css("height", t_height + "px");

					$("#blinder").css("width", t_width + "px");
					$("#blinder").css("height", t_height + "px");
					$("#blinder").css("margin-bottom", t_height * -1 + "px");
					
					// Default color
					if ( $(this).attr("default-color") ) {
						main_def_color = parseInt( $(this).attr("default-color") );
					}
					def_term = parseInt( $(this).attr("default-term") );
					if (isNaN(def_term) )  { def_term = 2; }
					
					// Get textes
					$(this).find("text").each(function(){
						if ( $(this).attr("color") ) {
							r_color = parseInt( $(this).attr("color") );
						} else {
							r_color = main_def_color;
						}
						r_delay = parseInt( $(this).attr("delay") );
						r_h_adj = parseInt( $(this).attr("h-adjust") );
						r_v_adj = parseInt( $(this).attr("v-adjust") );
						r_outd = parseInt( $(this).attr("out-delay") );
						r_term = parseInt( $(this).attr("next-term") );
						if (isNaN(r_delay) )  { r_delay = 4; }
						if (isNaN(r_h_adj) )  { r_h_adj = 0; }
						if (isNaN(r_v_adj) )  { r_v_adj = 0; }
						if (isNaN(r_outd) )  { r_outd = r_delay; }
						if (isNaN(r_term) )  { r_term = def_term; }

						if (r_delay < 1)  { r_delay = 1; }
						if (r_outd < 1)  { r_outd = 1; }
						
						list_of_item.push( { "text": $(this).text(),
						                     "color": r_color,
						                     "in": String( $(this).attr("in") ).toLowerCase(),
						                     "out": String( $(this).attr("out") ).toLowerCase(),
						                     "delay": r_delay, "out-delay": r_outd, "next-term": r_term,
						                     "h-adjust": r_h_adj, "v-adjust": r_v_adj, 
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
	clearticker();
	disptxt( list_of_item[item_no]["text"], list_of_item[item_no]["color"] );
	var h_adj = list_of_item[item_no]["h-adjust"] * 32;
	var v_adj = list_of_item[item_no]["v-adjust"] * 64;
	$("#blinder").css("opacity", 0);
	$("#blinder").css("left", 0);
	$("#blinder").css("top", 0);
	switch(list_of_item[item_no]["in"]) {
		case "immediately":
		case "fade":
		case "slideup":
		case "slidedown":
		case "slideleft":
		case "slideright":
			$("#ticker").css("left", (t_width - $("#ticker").width() + h_adj ) / 2 );
			$("#ticker").css("top", (t_height - $("#ticker").height() + v_adj ) / 2 );
			if (list_of_item[item_no]["in"] != "immediately") {
				$("#blinder").css("opacity", 1);
			}
			switch(list_of_item[item_no]["in"]) {
				case "slideup":
					$("#blinder").css("top",
						Math.min($("#ticker").height() + $("#ticker").position().top - t_height, 0) );
					break;
				case "slidedown":
					$("#blinder").css("top", Math.max($("#ticker").position().top, 0) );
					break;
				case "slideleft":
					$("#blinder").css("left",
						Math.min($("#ticker").width() + $("#ticker").position().left - t_width, 0) );
					break;
				case "slideright":
					$("#blinder").css("left", Math.max($("#ticker").position().left, 0) );
					break;
			}
			break;
		case "upward":
			$("#ticker").css("left", (t_width - $("#ticker").width() + h_adj ) / 2 );
			$("#ticker").css("top", t_height);
			break;
		case "downward":
			$("#ticker").css("left", (t_width - $("#ticker").width() + h_adj ) / 2 );
			$("#ticker").css("top", $("#ticker").height() * -1);
			break;
		case "rightward":
			$("#ticker").css("left", $("#ticker").width() * -1);
			$("#ticker").css("top", (t_height - $("#ticker").height() + v_adj ) / 2 );
			break;
		case "leftward":
		default:
			$("#ticker").css("left", t_width);
			$("#ticker").css("top", (t_height - $("#ticker").height() + v_adj ) / 2 );
	}
	anima = setInterval(function(){ moving_item(item_no) },
		10 * list_of_item[item_no]["delay"]);
}

function moving_item (item_no) {
	var h_adj = list_of_item[item_no]["h-adjust"] * 16;
	var v_adj = list_of_item[item_no]["v-adjust"] * 32;
	var finished = false;
	switch(list_of_item[item_no]["in"]) {
		case "immediately":
			finished = true;
			break;
		case "fade":
			if (parseFloat( $("#blinder").css("opacity") ) > 0 ) {
				$("#blinder").css("opacity", parseFloat( $("#blinder").css("opacity") ) - 0.1);
			} else {
				finished = true;
			}
			break;
		case "slideup":
			if ($("#blinder").position().top > t_height * -1 + Math.max($("#ticker").position().top, 0) ) {
				$("#blinder").css("top", ($("#blinder").position().top - 4) + "px");
			} else {
				finished = true;
			}
			break;
		case "slidedown":
			if ($("#blinder").position().top < Math.min(t_height, $("#ticker").position().top + $("#ticker").height() ) ) {
				$("#blinder").css("top", ($("#blinder").position().top + 4) + "px");
			} else {
				finished = true;
			}
			break;
		case "slideleft":
			if ($("#blinder").position().left > t_width * -1 + Math.max($("#ticker").position().left, 0) ) {
				$("#blinder").css("left", ($("#blinder").position().left - 4) + "px");
			} else {
				finished = true;
			}
			break;
		case "slideright":
			if ($("#blinder").position().left < Math.min(t_width, $("#ticker").position().left + $("#ticker").width() ) ) {
				$("#blinder").css("left", ($("#blinder").position().left + 4) + "px");
			} else {
				finished = true;
			}
			break;
		case "upward":
			if ($("#ticker").position().top > ( t_height - $("#ticker").height() ) / 2 + v_adj ) {
				$("#ticker").css("top", ($("#ticker").position().top - 4) + "px");
			} else {
				finished = true;
			}
			break;
		case "downward":
			if ($("#ticker").position().top < ( t_height - $("#ticker").height() ) / 2 + v_adj ) {
				$("#ticker").css("top", ($("#ticker").position().top + 4) + "px");
			} else {
				finished = true;
			}
			break;
		case "rightward":
			if ($("#ticker").position().left < ( t_width - $("#ticker").width() ) / 2 + h_adj ) {
				$("#ticker").css("left", ($("#ticker").position().left + 4) + "px");
			} else {
				finished = true;
			}
			break;
		case "leftward":
		default:
			if ($("#ticker").position().left > ( t_width - $("#ticker").width() ) / 2 + h_adj ) {
				$("#ticker").css("left", ($("#ticker").position().left - 4) + "px");
			} else {
				finished = true;
			}
	}
	if (finished) {
		clearInterval(anima);
		setTimeout(function(){
			$("#blinder").css("opacity", 1);
			$("#blinder").css("left", 0);
			$("#blinder").css("top", 0);
			switch(list_of_item[item_no]["out"]) {
			case "slideup":
				$("#blinder").css("top", Math.min(t_height, $("#ticker").height() + $("#ticker").position().top) );
				break;
			case "slidedown":
				$("#blinder").css("top", Math.max(t_height * -1, $("#ticker").position().top - t_height) );
				break;
			case "slideleft":
				$("#blinder").css("left", Math.min(t_width, $("#ticker").width() + $("#ticker").position().left) );
				break;
			case "slideright":
				$("#blinder").css("left", Math.max(t_width * -1, $("#ticker").position().left - t_width) );
				break;
			default:
				$("#blinder").css("opacity", 0);
			}
			anima = setInterval(function(){ outing_item(item_no) },
				10 * list_of_item[item_no]["out-delay"]);
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
		case "slideup":
			if ($("#blinder").position().top > Math.max($("#ticker").position().top, 0) ) {
				$("#blinder").css("top", ($("#blinder").position().top - 4) + "px");
			} else {
				finished = true;
			}
			break;
		case "slidedown":
			if ($("#blinder").position().top < Math.min(0, $("#ticker").position().top + $("#ticker").height() - t_height ) ) {
				$("#blinder").css("top", ($("#blinder").position().top + 4) + "px");
			} else {
				finished = true;
			}
			break;
		case "slideleft":
			if ($("#blinder").position().left > Math.max($("#ticker").position().left, 0) ) {
				$("#blinder").css("left", ($("#blinder").position().left - 4) + "px");
			} else {
				finished = true;
			}
			break;
		case "slideright":
			if ($("#blinder").position().left < Math.min(0, $("#ticker").position().left + $("#ticker").width() - t_width ) ) {
				$("#blinder").css("left", ($("#blinder").position().left + 4) + "px");
			} else {
				finished = true;
			}
			break;
		case "fade":
			if (parseFloat( $("#blinder").css("opacity") ) < 1 ) {
				$("#blinder").css("opacity", parseFloat( $("#blinder").css("opacity") ) + 0.1);
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
		}, list_of_item[item_no]["next-term"] * 500);
	}
}