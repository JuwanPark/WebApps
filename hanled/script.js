var all_standby = false;
var img_standby = 0;
var han_standby = 0;

var t_width = 512, t_height = 64;

//                 ㅏ ㅐ ㅑ ㅒ ㅓ ㅔ ㅕ ㅖ ㅗ ㅘ ㅙ ㅚ ㅛ ㅜ ㅝ ㅞ ㅟ ㅠ ㅡ ㅢ ㅣ
var jung_to_cho =  [0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 3, 1, 2, 4, 4, 4, 2, 1, 3, 0];
var jung_to_jong = [0, 2, 0, 2, 1, 2, 1, 2, 3, 3, 3, 3, 3, 3, 1, 2, 1, 3, 3, 1, 1];

var list_of_item = [];
var reversed = false;
var current_item = 0;
var def_term, def_blink_delay, def_ani_delay;
var offset_x = 0, offset_y = 0;
var crop_h = 0, crop_v = 0;

var dayname = [{"han": "일",  "eng": "Sun", "engs": "Sunday"},
               {"han": "월",  "eng": "Mon", "engs": "Monday"},
               {"han": "화",  "eng": "Tue", "engs": "Tuesday"},
               {"han": "수",  "eng": "Wed", "engs": "Wednesday"},
               {"han": "목",  "eng": "Thu", "engs": "Thursday"},
               {"han": "금",  "eng": "Fri", "engs": "Friday"},
               {"han": "토",  "eng": "Sat", "engs": "Saturday"}];
var ampm = [{"han": "오전", "eng": "am", "engs": "AM"},
            {"han": "오후", "eng": "pm", "engs": "PM"}];
var monname = [{"eng": "Jan", "engs": "January"},
               {"eng": "Feb", "engs": "February"},
               {"eng": "Mar", "engs": "March"},
               {"eng": "Apr", "engs": "April"},
               {"eng": "May", "engs": "May"},
               {"eng": "Jun", "engs": "June"},
               {"eng": "Jul", "engs": "July"},
               {"eng": "Aug", "engs": "August"},
               {"eng": "Sep", "engs": "September"},
               {"eng": "Oct", "engs": "October"},
               {"eng": "Nov", "engs": "November"},
               {"eng": "Dec", "engs": "December"}];

window.addEventListener('error', function(e) {
    console.log(e);
	$("#loading").html("Error");
}, true);

/**
 * Trigger a callback when 'this' image is loaded:
 * @param {Function} callback
 */
(function($){
    $.fn.imgLoad = function(callback) {
        return this.each(function() {
            if (callback) {
                if (this.complete || /*for IE 10-*/ $(this).height() > 0) {
                    callback.apply(this);
                }
                else {
                    $(this).on('load', function(){
                        callback.apply(this);
                    });
                }
            }
        });
    };
})(jQuery);

/* Pre Function */
function receive_get_data(param) {
	var result = null, tmp = [];
	var items = window.location.search.substr(1).split("&");
	for (var i = 0; i < items.length; i++) {
		tmp = items[i].split("=");
		if (tmp[0] === param) result = decodeURIComponent(tmp[1]);
	}
	return result;
}

/* Draw */
function get_baschar_img (cod = 32) {
	var c = document.getElementById("basic_canv");
	var ctx = c.getContext("2d");
	img_combined = ctx.getImageData( (cod % 32) * 8, (Math.floor(cod / 32) - 1) * 16, 8, 16);
	return img_combined;
}

function get_hangul_img (cho = 0, jung = 0, jong = 0) {
	var c = document.getElementById("han_canv");
	var ctx = c.getContext("2d");
	var c2 = document.getElementById("han2_canv");
	var ctx2 = c2.getContext("2d");
	var cho_y = jung_to_cho[jung], jung_y = 0, jong_y = jung_to_jong[jung];
	var img_cho, img_jung, img_jong, img_combined;
	img_combined = ctx2.getImageData(240, 240, 16, 16);  // Empty
	jong--;
	if (jong >= 0) { // Jongseong
		if      (cho_y == 0)               { cho_y = 5; }
		else if (cho_y == 1 || cho_y == 2) { cho_y = 6; }
		else if (cho_y == 3 || cho_y == 4) { cho_y = 7; }
		if (jong >= 16) {
			jong -= 16;
			jong_y += 8;
		}
		img_jong = ctx2.getImageData( jong * 16, (jong_y+4) * 16, 16, 16);
	} else { // No jongseong
		img_jong = ctx2.getImageData(240, 240, 16, 16);  // Empty
	}
	// Choseong
	if (cho >= 16) {
		cho -= 16;
		cho_y += 8;
	}
	img_cho = ctx.getImageData(cho * 16, cho_y * 16, 16, 16);
	// Jungseong
	if (cho != 0 && cho != 10) { jung_y = 1; }   // Except choseong ㄱ or ㅋ
	if (jong >= 0)             { jung_y += 2; }  // With jongseong
	if (jung >= 16) {
		jung -= 16;
		jung_y += 8;
	}
	img_jung = ctx2.getImageData(jung * 16, jung_y * 16, 16, 16);
	// Combine
	for (var i = 0; i < 1024; i+=4) {
		if (img_cho.data[i+3] + img_jung.data[i+3] + img_jong.data[i+3] == 0) { // Empty px
			img_combined.data[i]   = 0;    img_combined.data[i+1] = 0;
			img_combined.data[i+2] = 0;    img_combined.data[i+3] = 0;
		} else {
			img_combined.data[i]   = 255;  img_combined.data[i+1] = 255;
			img_combined.data[i+2] = 255;  img_combined.data[i+3] = 255;
		}
	}
	return img_combined;
}

function get_natja_img (cod) {
	var c = document.getElementById("han_canv");
	var ctx = c.getContext("2d");
	img_combined = ctx.getImageData(cod % 12 * 16 + 64, Math.floor(cod / 12) * 16 + 128, 16, 16);
	return img_combined;
}

function get_spechar_img (x = 0, y = 0) {
	var c = document.getElementById("spe_canv");
	var ctx = c.getContext("2d");
	img_combined = ctx.getImageData(x * 16, y * 16, 16, 16);
	return img_combined;
}

function drawchr (col, row, color, imgdat, chrwidth = 1, target = "ticker") {
	var c = document.getElementById(target);
	var ctx = c.getContext("2d");
	ctx.shadowColor = text_colors[color]["norm"];
	ctx.shadowOffsetX = 0;
	ctx.shadowOffsetY = 0;
	var ix, iy;
	for (var i = 0; i < 128 * chrwidth; i++) {
		ix = (i % (8 * chrwidth) ) * 4 + col * 32 + offset_x * 4 - crop_h * 16;
		iy = Math.floor(i / (8 * chrwidth) ) * 4 + row * 64 + offset_y * 4 - crop_v * 32;
		if ( imgdat.data[i*4+3] > 0 ^ reversed ) {
			ctx.fillStyle = text_colors[color]["norm"];
			ctx.shadowBlur = 5;
			ctx.fillRect(ix + .5, iy + .5, 3, 3);
			ctx.fillStyle = text_colors[color]["high"];
			ctx.shadowBlur = 0;
			ctx.fillRect(ix + 1, iy + 1, 2, 2);
		}
	}
}

function drawani (col, row, color, symno, target = "anisym") {
	var cs = document.getElementById("ani_canv");
	var ctxs = cs.getContext("2d");
	var c = document.getElementById("ani_temp");
	var ctx = c.getContext("2d");
	ctx.clearRect(0, 0, c.width, c.height);
	ctx.shadowColor = text_colors[color]["norm"];
	ctx.shadowOffsetX = 0;
	ctx.shadowOffsetY = 0;
	var ix, iy, imgdat;
	var jx = symno % 4, jy = Math.floor(symno / 4);
	var anitarget;
	
	var pos_x = col * 32 + offset_x * 4 - crop_h * 16;
	var pos_y = row * 64 + offset_y * 4 - crop_v * 32;

	for (var j = 0; j < 4; j++) {
		imgdat = ctxs.getImageData( (jx * 4 + j) * 16, jy * 16, 16, 16);
		for (var i = 0; i < 256; i++) {
			ix = (i % 16) * 4 + (j % 2) * 72 + 4;
			iy = Math.floor(i / 16) * 4 + Math.floor(j / 2) * 72 + 4;
			if ( imgdat.data[i*4+3] > 0 ^ reversed ) {
				ctx.fillStyle = text_colors[color]["norm"];
				ctx.shadowBlur = 5;
				ctx.fillRect(ix + .5, iy + .5, 3, 3);
				ctx.fillStyle = text_colors[color]["high"];
				ctx.shadowBlur = 0;
				ctx.fillRect(ix + 1, iy + 1, 2, 2);
			}
		}
	}
	$("#" + target).append('<span class="ani" style="left: ' + (pos_x - 4) +
		'px; top: ' + (pos_y - 4) + 'px; background-image: url(\'' +
		c.toDataURL('image/png') + '\');"></span>');
}

function disptxt (txt, color) {
	// reset
	var maxcols = 0, maxrows = 1;
	var curcols = 0, currows = 0;
	var special_flag = false;
	var ani_flag = false;
	var mute_flag = false;
	var img_chrdat;
	var curcolor = color;
	var target = "ticker";
	reversed = false;
	var cho_c = 0, jung_c = 0, jong_c = 0, spex = 0, spey = 0;
	// calcuate text size
	for (var i = 0; i < txt.length; i++) {
		if (special_flag) {
			if (txt.substr(i, 1) == "n") {
				curcols = 0;
				maxrows += 1;
			} else if (txt.substr(i, 1) == "`") { // `
				curcols += 1;
			} else if (txt.substr(i, 1) == "g") { // back 1
				curcols -= 1;
			} else if (txt.substr(i, 1) == "G") { // back 4
				curcols -= 4;
			} else if (txt.substr(i, 1) == "!") { // back first
				curcols = 0;
			} else if (txt.substr(i, 1) == "z") { // mute
				mute_flag = !mute_flag;
			}
			special_flag = false;
		} else if (ani_flag) {
			if ( !isNaN( parseInt(txt.substr(i, 1), 16) ) ) { // ani
				curcols += 2;
			} else if (txt.charCodeAt(i) >= 32 && txt.charCodeAt(i) < 127) {
				curcols += 1;
			}
			ani_flag = false;
		} else {
			if (txt.substr(i, 1) == "`" ) {
				special_flag = true;
			} else if (txt.substr(i, 1) == "$" ) {
				ani_flag = true;
			} else if (txt.charCodeAt(i) < 880) {
				if (!mute_flag) { curcols += 1; }
			} else {
				if (!mute_flag) { curcols += 2; }
			}
		}
		if (curcols > maxcols)  { maxcols = curcols; }
	}
	// Reset current cols and special flag
	curcols = 0;
	special_flag = false;
	ani_flag = false;
	mute_flag = false;
	offset_x = 0;  offset_y = 0;
	
	if (maxcols < 1)  { maxcols = 1; }
	if (crop_h >= maxcols)  { crop_h = maxcols - 1; }
	if (crop_v >= maxrows)  { crop_v = maxrows - 1; }
	// Resize
	$("#blinkchar").attr("width", (maxcols - crop_h) * 32);
	$("#blinkchar").attr("height", (maxrows - crop_v) * 64);
	$("#blinkchar").css("margin-bottom", ( (maxrows - crop_v) * -64) + "px");

	$("#ticker").attr("width", (maxcols - crop_h) * 32);
	$("#ticker").attr("height", (maxrows - crop_v) * 64);
	$("#ticker").css("margin-bottom", ( (maxrows - crop_v) * -64) + "px");

	$("#anisym").css("width", (maxcols - crop_h) * 32);
	$("#anisym").css("height", (maxrows - crop_v) * 64);
	$("#anisym").css("margin-bottom", ( (maxrows - crop_v) * -64) + "px");

	$("#aniblink").css("width", (maxcols - crop_h) * 32);
	$("#aniblink").css("height", (maxrows - crop_v) * 64);
	$("#aniblink").css("margin-bottom", ( (maxrows - crop_v) * -64) + "px");
	
	// Draw
	for (var i = 0; i < txt.length; i++) {
		if (special_flag) {
			if ( !isNaN( parseInt(txt.substr(i, 1), 16) ) ) {
				// Color change
				curcolor = parseInt(txt.substr(i, 1), 16);
			} else {
				switch ( txt.substr(i, 1) ) {
					case "`":
						img_chrdat = get_baschar_img(96);
						drawchr(curcols, currows, curcolor, img_chrdat, 1);
						curcols += 1;
						break;
					case "n": // New line
						curcols = 0;  currows += 1;  break;
					case "r": // Reversed
						reversed = !reversed;        break;
					case "k": // Blink
						if (target == "ticker") { target = "blinkchar"; }
						else { target = "ticker"; }  break;
					case "^": // Offset Up 4p
						offset_y -= 4;  break;
					case "v": // Offset Down 4p
						offset_y += 4;  break;
					case "(": // Offset Left 4p
						offset_x -= 4;  break;
					case ")": // Offset Right 4p
						offset_x += 4;  break;
					case "~": // Offset Up 1p
						offset_y -= 1;  break;
					case "V": // Offset Down 1p
						offset_y += 1;  break;
					case "{": // Offset Left 1p
						offset_x -= 1;  break;
					case "}": // Offset Right 1p
						offset_x += 1;  break;
					case "x": // Offset Reset
						offset_x = 0;  offset_y = 0;  break;
					case "g": // Back -1 char
						curcols -= 1;  break;
					case "G": // Back -4 char
						curcols -= 4;  break;
					case "!": // Back to first
						curcols = 0;  break;
					case "z": // Mute
						mute_flag = !mute_flag;  break;
				}
			}
			special_flag = false;
		} else if (ani_flag) {
			if ( !isNaN( parseInt(txt.substr(i, 1), 16) ) ) { // ani
				if (target == "blinkchar") {
					drawani(curcols, currows, curcolor, parseInt(txt.substr(i, 1), 16), "aniblink");
				} else {
					drawani(curcols, currows, curcolor, parseInt(txt.substr(i, 1), 16), "anisym");
				}
				curcols += 2;
			} else if (txt.charCodeAt(i) >= 32 && txt.charCodeAt(i) < 127) {
				// Basic
				img_chrdat = get_baschar_img( txt.charCodeAt(i) );
				drawchr(curcols, currows, curcolor, img_chrdat, 1, target);
				curcols += 1;
			}
			ani_flag = false;
		} else {
			if (txt.substr(i, 1) == "`" ) {
				special_flag = true;
			} else if (txt.substr(i, 1) == "$" ) {
				ani_flag = true;
			} else if (!mute_flag) {
				if (txt.charCodeAt(i) >= 32 && txt.charCodeAt(i) < 127) {
					// Basic
					img_chrdat = get_baschar_img( txt.charCodeAt(i) );
					drawchr(curcols, currows, curcolor, img_chrdat, 1, target);
					curcols += 1;
				} else if (txt.charCodeAt(i) >= 44032 && txt.charCodeAt(i) <= 55203) {
					// Hangul
					cho_c = Math.floor( (txt.charCodeAt(i) - 44032) / 588);
					jung_c = Math.floor( ( (txt.charCodeAt(i) - 44032) % 588) / 28);
					jong_c = (txt.charCodeAt(i) - 44032) % 28;
					img_chrdat = get_hangul_img(cho_c, jung_c, jong_c);
					drawchr(curcols, currows, curcolor, img_chrdat, 2, target);
					curcols += 2;
				} else if (txt.charCodeAt(i) >= 12593 && txt.charCodeAt(i) <= 12686) {
					// Natja
					img_chrdat = get_natja_img(txt.charCodeAt(i) - 12593);
					drawchr(curcols, currows, curcolor, img_chrdat, 2, target);
					curcols += 2;
				} else {
					if ( han_specs.indexOf(txt.substr(i, 1) ) >= 0 ) {
						spex = han_specs.indexOf(txt.substr(i, 1) ) % 16;
						spey = Math.floor(han_specs.indexOf(txt.substr(i, 1) ) / 16);
						img_chrdat = get_spechar_img(spex, spey);
						drawchr(curcols, currows, curcolor, img_chrdat, 2, target);
					}
					curcols += 2;
				}
			}
		}
	}
}

function clearticker() {
	var c = document.getElementById("ticker");
	var ctx = c.getContext("2d");
	ctx.clearRect(0, 0, c.width, c.height);
	
	c = document.getElementById("blinkchar");
	ctx = c.getContext("2d");
	ctx.clearRect(0, 0, c.width, c.height);
}
