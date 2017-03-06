// Ready
var rft = setInterval(function(){ ready_for_ticker() }, 10);
var anima;
function ready_for_ticker () {
	if (img_standby >= 5) {
		clearInterval(rft);
		startload();
	}
}

function startload() {
	$("#loading").hide();
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
					var r_cols, r_rows, r_effect_in, r_effect_out, r_pause;
					var r_color, r_delay, r_h_adj, r_v_adj, r_outd, r_term;
					var r_ani_delay, r_blink_delay;
					// Resize
					r_cols = $(this).attr("cols");
					r_rows = $(this).attr("rows");
					if (isNaN(r_cols) || r_cols < 1 )  { r_cols = 16; }
					if (isNaN(r_rows) || r_rows < 1 )  { r_rows = 1; }

					t_width = r_cols * 32;
					t_height = r_rows * 64;
					$("#container").css("width", t_width + "px");
					$("#container").css("height", t_height + "px");

					$("#blinder").css("width", t_width + "px");
					$("#blinder").css("height", t_height + "px");
					$("#blinder").css("margin-bottom", t_height * -1 + "px");

					$("#blinker").css("width", t_width + "px");
					$("#blinker").css("height", t_height + "px");
					$("#blinker").css("margin-bottom", t_height * -1 + "px");

					if ( $(window).innerHeight() >= $("#before_desc").offset().top ) {
						$("#sitedesc").css("display", "block");
					}

					// Default color
					if ( $(this).attr("default-color") ) {
						main_def_color = parseInt( $(this).attr("default-color") );
					}
					def_term = parseInt( $(this).attr("default-term") );
					if (isNaN(def_term) )         { def_term = 2; }

					def_blink_delay = parseInt( $(this).attr("default-blink-delay") );
					if (isNaN(def_blink_delay) )  { def_blink_delay = 8; }
					else if ( def_blink_delay < 1 ) { def_blink_delay = 1; }
					else if ( def_blink_delay > 8 ) { def_blink_delay = 8; }
					
					def_ani_delay = parseInt( $(this).attr("default-animation-delay") );
					if (isNaN(def_ani_delay) )  { def_ani_delay = 4; }
					else if ( def_ani_delay < 1 ) { def_ani_delay = 1; }
					else if ( def_ani_delay > 8 ) { def_ani_delay = 8; }
					
					// Get textes
					$(this).find("text").each(function(){
						if ( $(this).attr("color") ) {
							r_color = parseInt( $(this).attr("color") );
						} else {
							r_color = main_def_color;
						}
						r_effect_in = String( $(this).attr("in") ).toLowerCase();
						r_effect_out = String( $(this).attr("out") ).toLowerCase();
						
						r_h_adj = parseInt( $(this).attr("h-adjust") );
						r_v_adj = parseInt( $(this).attr("v-adjust") );
						r_delay = parseInt( $(this).attr("delay") );
						r_outd = parseInt( $(this).attr("out-delay") );
						r_term = parseInt( $(this).attr("next-term") );
						r_outd = parseInt( $(this).attr("out-delay") );
						r_blink_delay = parseInt( $(this).attr("blink-delay") );
						r_ani_delay = parseInt( $(this).attr("animation-delay") );
						r_pause = parseInt( "0" + $(this).attr("pause") )
						if (isNaN(r_delay) )  { r_delay = 4; }
						if (isNaN(r_h_adj) )  { r_h_adj = 0; }
						if (isNaN(r_v_adj) )  { r_v_adj = 0; }
						if (isNaN(r_outd) )  { r_outd = r_delay; }
						if (isNaN(r_term) )  { r_term = def_term; }
						if (isNaN(r_blink_delay) )  { r_blink_delay = def_blink_delay; }
						if (isNaN(r_ani_delay) )    { r_ani_delay =   def_ani_delay; }

						// Force value
						if (r_delay < 1)  { r_delay = 1; }
						if (r_outd < 1)  { r_outd = 1; }

						if (r_blink_delay < 1 )      { r_blink_delay = 1; }
						else if (r_blink_delay > 8 ) { r_blink_delay = 8; }

						if (r_ani_delay < 1 )      { r_ani_delay = 1; }
						else if (r_ani_delay > 8 ) { r_ani_delay = 8; }
						
						if (r_effect_in == "immediately" && r_effect_out == "immediately" && r_pause <= 0) {
							r_pause = 2;
						}
						
						// Push
						list_of_item.push( { "text": $(this).text(),
						                     "color": r_color,
						                     "in": r_effect_in, "out": r_effect_out,
						                     "delay": r_delay, "out-delay": r_outd, "next-term": r_term,
											 "blink-delay": r_blink_delay, "ani-delay": r_ani_delay,
						                     "h-adjust": r_h_adj, "v-adjust": r_v_adj,
						                     "h-crop": parseInt( "0" + $(this).attr("h-crop") ),
						                     "v-crop": parseInt( "0" + $(this).attr("v-crop") ),
						                     "pause": r_pause });
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
	$("#anisym").html("");
	$("#aniblink").html("");
	var txt = list_of_item[item_no]["text"];
	var cur_dt = new Date();
	
	// DateTime 
	txt = txt.replace(/`ty/g, cur_dt.getFullYear() );
	txt = txt.replace(/`tm/g, (cur_dt.getMonth() + 1) );
	txt = txt.replace(/`tM/g, (cur_dt.getMonth() + 101).toString().substr(1) );
	txt = txt.replace(/`td/g, cur_dt.getDate() );
	txt = txt.replace(/`tD/g, (cur_dt.getDate() + 100).toString().substr(1) );
	txt = txt.replace(/`to/g, monname[cur_dt.getMonth()]["eng"] );
	txt = txt.replace(/`tO/g, monname[cur_dt.getMonth()]["engs"] );
	txt = txt.replace(/`te/g, dayname[cur_dt.getDay()]["eng"] );
	txt = txt.replace(/`tE/g, dayname[cur_dt.getDay()]["engs"] );
	txt = txt.replace(/`tq/g, dayname[cur_dt.getDay()]["han"] );

	var hourstr = " " + ( (cur_dt.getHours() + 11) % 12 + 1);
	if (hourstr.length == 3)  { hourstr = hourstr.substr(1); }
	var ampm_flag = Math.floor(cur_dt.getHours() / 12);

	txt = txt.replace(/`th/g, (cur_dt.getHours() + 100).toString().substr(1) );
	txt = txt.replace(/`tH/g, cur_dt.getHours() );
	txt = txt.replace(/`tk/g, ( (cur_dt.getHours() + 11) % 12 + 1) );
	txt = txt.replace(/`tK/g, hourstr);
	txt = txt.replace(/`tc/g, ( (cur_dt.getHours() + 11) % 12 + 101).toString().substr(1) );
	txt = txt.replace(/`ta/g, ampm[ampm_flag]["eng"] );
	txt = txt.replace(/`tA/g, ampm[ampm_flag]["engs"] );
	txt = txt.replace(/`tp/g, ampm[ampm_flag]["han"] );
	txt = txt.replace(/`ti/g, (cur_dt.getMinutes() + 100).toString().substr(1) );
	txt = txt.replace(/`tI/g, cur_dt.getMinutes() );
	txt = txt.replace(/`ts/g, (cur_dt.getSeconds() + 100).toString().substr(1) );
	txt = txt.replace(/`tS/g, cur_dt.getSeconds() );

	// Set crop
	crop_h = list_of_item[item_no]["h-crop"]; crop_v = list_of_item[item_no]["v-crop"];
	
	// Display
	disptxt(txt, list_of_item[item_no]["color"] );
	
	// Set blinking delay
	$("#container").addClass("blinking");
	$(".blinking #blinker").css("-webkit-animation-duration", list_of_item[item_no]["blink-delay"] / 4 + "s");
	$(".blinking #blinker").css("animation-duration",         list_of_item[item_no]["blink-delay"] / 4 + "s");
	$(".ani").css("-webkit-animation-duration", list_of_item[item_no]["ani-delay"] / 4 + "s");
	$(".ani").css("animation-duration",         list_of_item[item_no]["ani-delay"] / 4 + "s");
	
	// Start
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
			$("#mover").css("left", (t_width - $("#ticker").width() + h_adj ) / 2 );
			$("#mover").css("top", (t_height - $("#ticker").height() + v_adj ) / 2 );
			if (list_of_item[item_no]["in"] != "immediately") {
				$("#blinder").css("opacity", 1);
			}
			switch(list_of_item[item_no]["in"]) {
				case "slideup":
					$("#blinder").css("top",
						Math.min($("#ticker").height() + $("#mover").position().top - t_height, 0) );
					break;
				case "slidedown":
					$("#blinder").css("top", Math.max($("#mover").position().top, 0) );
					break;
				case "slideleft":
					$("#blinder").css("left",
						Math.min($("#ticker").width() + $("#mover").position().left - t_width, 0) );
					break;
				case "slideright":
					$("#blinder").css("left", Math.max($("#mover").position().left, 0) );
					break;
			}
			break;
		case "upward":
			$("#mover").css("left", (t_width - $("#ticker").width() + h_adj ) / 2 );
			$("#mover").css("top", t_height);
			break;
		case "downward":
			$("#mover").css("left", (t_width - $("#ticker").width() + h_adj ) / 2 );
			$("#mover").css("top", $("#ticker").height() * -1);
			break;
		case "rightward":
			$("#mover").css("left", $("#ticker").width() * -1);
			$("#mover").css("top", (t_height - $("#ticker").height() + v_adj ) / 2 );
			break;
		case "leftward":
		default:
			$("#mover").css("left", t_width);
			$("#mover").css("top", (t_height - $("#ticker").height() + v_adj ) / 2 );
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
			if ($("#blinder").position().top > t_height * -1 + Math.max($("#mover").position().top, 0) ) {
				$("#blinder").css("top", ($("#blinder").position().top - 4) + "px");
			} else {
				finished = true;
			}
			break;
		case "slidedown":
			if ($("#blinder").position().top < Math.min(t_height, $("#mover").position().top + $("#ticker").height() ) ) {
				$("#blinder").css("top", ($("#blinder").position().top + 4) + "px");
			} else {
				finished = true;
			}
			break;
		case "slideleft":
			if ($("#blinder").position().left > t_width * -1 + Math.max($("#mover").position().left, 0) ) {
				$("#blinder").css("left", ($("#blinder").position().left - 4) + "px");
			} else {
				finished = true;
			}
			break;
		case "slideright":
			if ($("#blinder").position().left < Math.min(t_width, $("#mover").position().left + $("#ticker").width() ) ) {
				$("#blinder").css("left", ($("#blinder").position().left + 4) + "px");
			} else {
				finished = true;
			}
			break;
		case "upward":
			if ($("#mover").position().top > ( t_height - $("#ticker").height() ) / 2 + v_adj ) {
				$("#mover").css("top", ($("#mover").position().top - 4) + "px");
			} else {
				finished = true;
			}
			break;
		case "downward":
			if ($("#mover").position().top < ( t_height - $("#ticker").height() ) / 2 + v_adj ) {
				$("#mover").css("top", ($("#mover").position().top + 4) + "px");
			} else {
				finished = true;
			}
			break;
		case "rightward":
			if ($("#mover").position().left < ( t_width - $("#ticker").width() ) / 2 + h_adj ) {
				$("#mover").css("left", ($("#mover").position().left + 4) + "px");
			} else {
				finished = true;
			}
			break;
		case "leftward":
		default:
			if ($("#mover").position().left > ( t_width - $("#ticker").width() ) / 2 + h_adj ) {
				$("#mover").css("left", ($("#mover").position().left - 4) + "px");
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
				$("#blinder").css("top", Math.min(t_height, $("#ticker").height() + $("#mover").position().top) );
				break;
			case "slidedown":
				$("#blinder").css("top", Math.max(t_height * -1, $("#mover").position().top - t_height) );
				break;
			case "slideleft":
				$("#blinder").css("left", Math.min(t_width, $("#ticker").width() + $("#mover").position().left) );
				break;
			case "slideright":
				$("#blinder").css("left", Math.max(t_width * -1, $("#mover").position().left - t_width) );
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
			$("#mover").css("top", ($("#ticker").height() * -1) + "px");
			finished = true;
			break;
		case "slideup":
			if ($("#blinder").position().top > Math.max($("#mover").position().top, 0) ) {
				$("#blinder").css("top", ($("#blinder").position().top - 4) + "px");
			} else {
				finished = true;
			}
			break;
		case "slidedown":
			if ($("#blinder").position().top < Math.min(0, $("#mover").position().top + $("#ticker").height() - t_height ) ) {
				$("#blinder").css("top", ($("#blinder").position().top + 4) + "px");
			} else {
				finished = true;
			}
			break;
		case "slideleft":
			if ($("#blinder").position().left > Math.max($("#mover").position().left, 0) ) {
				$("#blinder").css("left", ($("#blinder").position().left - 4) + "px");
			} else {
				finished = true;
			}
			break;
		case "slideright":
			if ($("#blinder").position().left < Math.min(0, $("#mover").position().left + $("#ticker").width() - t_width ) ) {
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
			if ($("#mover").position().top > $("#ticker").height() * -1 ) {
				$("#mover").css("top", ($("#mover").position().top - 4) + "px");
			} else {
				finished = true;
			}
			break;
		case "downward":
			if ($("#mover").position().top < t_height ) {
				$("#mover").css("top", ($("#mover").position().top + 4) + "px");
			} else {
				finished = true;
			}
			break;
		case "rightward":
			if ($("#mover").position().left < t_width ) {
				$("#mover").css("left", ($("#mover").position().left + 4) + "px");
			} else {
				finished = true;
			}
			break;
		case "leftward":
		default:
			if ($("#mover").position().left > $("#ticker").width() * -1 ) {
				$("#mover").css("left", ($("#mover").position().left - 4) + "px");
			} else {
				finished = true;
			}
	}
	if (finished) {
		clearInterval(anima);
		$("#container").removeClass("blinking");
		setTimeout(function(){
			current_item++;
			if (current_item >= list_of_item.length)  { current_item -= list_of_item.length; }
			start_item(current_item);
		}, list_of_item[item_no]["next-term"] * 500);
	}
}
