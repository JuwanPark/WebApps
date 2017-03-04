var prepared = 0;

var t_width = 512, t_height = 64;

//                 ㅏ ㅐ ㅑ ㅒ ㅓ ㅔ ㅕ ㅖ ㅗ ㅘ ㅙ ㅚ ㅛ ㅜ ㅝ ㅞ ㅟ ㅠ ㅡ ㅢ ㅣ
var jung_to_cho =  [0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 3, 1, 2, 4, 4, 4, 2, 1, 3, 0];
var jung_to_jong = [0, 2, 0, 2, 1, 2, 1, 2, 3, 3, 3, 3, 3, 3, 1, 2, 1, 3, 3, 1, 1];

// 0: Red, 1: Orange, 2: Yellow, 3: Green Yellow, 4: Green, 5: Aqua Green,
// 6: Cyan, 7: Skyblue, 8: Blue, 9: Purple, 10: Magenta, 11: Pink, 12: White
var text_colors = ["#ff5555", "#ffaa55", "#ffff55", "#aaff55", "#55ff55", "#55ffaa",
                   "#55ffff", "#55aaff", "#5555ff", "#aa55ff", "#ff55ff", "#ff55aa",
                   "#ffffff", "#ffaaaa", "#ffaaff", "#aaaaff"];

var han_specs = "　ㄱㄲㄳㄴㄵㄶㄷㄸㄹㄺㄻㄼㄽㄾㄿ" +
                "ㅀㅁㅂㅃㅄㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎㅏ" +
                "ㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟ" +
                "ㅠㅡㅢㅣ　ㅥㅦㅧㅨㅩㅪㅫㅬㅭㅮㅯ" +
                "ㅰㅱㅲㅳㅴㅵㅶㅷㅸㅹㅺㅻㅼㅽㅾㅿ" +
                "ㆀㆁㆂㆃㆄㆅㆆㆇㆈㆉㆊㆋㆌㆍㆎ　" +
                "　　、。·‥…¨〃­―∥＼∼‘’" +
                "“”〔〕〈〉《》「」『』【】±×" +
                "÷≠≤≥∞∴°′″℃Å￠￡￥♂♀" +
                "∠⊥⌒∂∇≡≒§※☆★○●◎◇◆" +
                "□■△▲▽▼→←↑↓↔〓≪≫√∽" +
                "∝∵∫∬∈∋⊆⊇⊂⊃∪∩∧∨￢　" +
                "　⇒⇔∀∃´～ˇ˘˝˚˙¸˛¡¿" +
                "ː∮∑∏¤℉‰◁◀▷▶♤♠♡♥♧" +
                "♣⊙◈▣◐◑▒▤▥▨▧▦▩♨☏☎" +
                "☜☞¶†‡↕↗↙↖↘♭♩♪♬㉿㈜" +
                "№㏇™㏂㏘℡　　　　　　　　　　";

var list_of_item = [];
var main_def_color = 4;
var reversed = false;
var current_item = 0;
var next_term;

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
	if (jong > 0)              { jung_y += 2; }  // Wiht jongseong
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

function get_spechar_img (x = 0, y = 0) {
	var c = document.getElementById("spe_canv");
	var ctx = c.getContext("2d");
	img_combined = ctx.getImageData(x * 16, y * 16, 16, 16);
	return img_combined;
}

function drawchr (col, row, color, imgdat, chrwidth = 1) {
	var c = document.getElementById("ticker");
	var ctx = c.getContext("2d");
	ctx.fillStyle = text_colors[color];
	ctx.shadowColor = text_colors[color];
	ctx.shadowOffsetX = 0;
	ctx.shadowOffsetY = 0;
	ctx.shadowBlur = 4;
	var ix, iy;
	for (i = 0; i < 128 * chrwidth; i++) {
		ix = (i % (8 * chrwidth) ) * 4 + col * 32;
		iy = Math.floor(i / (8 * chrwidth) ) * 4 + row * 64;
		if ( imgdat.data[i*4+3] > 0 ^ reversed ) {
			ctx.fillRect(ix + .75, iy + .75, 2.5, 2.5);
			ctx.fillRect(ix + 1, iy + 1, 2, 2);
		}
	}
}

function disptxt (txt, color) {
	// reset
	var maxcols = 0, maxrows = 1;
	var curcols = 0, currows = 0;
	var special_flag = false;
	var img_chrdat;
	var curcolor = color;
	reversed = false;
	var cho_c = 0, jung_c = 0, jong_c = 0, spex = 0, spey = 0;
	// calcuate text size
	for (var i = 0; i < txt.length; i++) {
		if (special_flag) {
			if (txt.substr(i, 1) == "n") {
				curcols = 0;
				maxrows += 1;
			} else if (txt.substr(i, 1) == "r") { // Reverse
			} else if ( isNaN( parseInt(txt.substr(i, 1), 16) ) ) {
				curcols += 1;
			}
			special_flag = false;
		} else {
			if (txt.substr(i, 1) == "`" ) {
				special_flag = true;
			} else if (txt.charCodeAt(i) < 880) {
				curcols += 1;
			} else {
				curcols += 2;
			}
		}
		if (curcols > maxcols)  { maxcols = curcols; }
	}
	// Reset current cols and special flag
	curcols = 0;
	special_flag = false;
	// Resize
	$("#ticker").attr("width", maxcols * 32);
	$("#ticker").attr("height", maxrows * 64);
	// Draw
	for (var i = 0; i < txt.length; i++) {
		if (special_flag) {
			if (txt.substr(i, 1) == "n") {
				curcols = 0;
				currows += 1;
			} else if (txt.substr(i, 1) == "r") {
				reversed = !reversed;
			} else if ( !isNaN( parseInt(txt.substr(i, 1), 16) ) ) {
				curcolor = parseInt(txt.substr(i, 1), 16);
			} else {
				img_chrdat = get_baschar_img( txt.charCodeAt(i) );
				drawchr(curcols, currows, curcolor, img_chrdat, 1);
				curcols += 1;
			}
			special_flag = false;
		} else {
			if (txt.substr(i, 1) == "`" ) {
				special_flag = true;
			} else if (txt.charCodeAt(i) >= 32 && txt.charCodeAt(i) < 127) {
				// Basic
				img_chrdat = get_baschar_img( txt.charCodeAt(i) );
				drawchr(curcols, currows, curcolor, img_chrdat, 1);
				curcols += 1;
			} else if (txt.charCodeAt(i) >= 44032 && txt.charCodeAt(i) <= 55203) {
				// Hangul
				cho_c = Math.floor( (txt.charCodeAt(i) - 44032) / 588);
				jung_c = Math.floor( ( (txt.charCodeAt(i) - 44032) % 588) / 28);
				jong_c = (txt.charCodeAt(i) - 44032) % 28;
				img_chrdat = get_hangul_img(cho_c, jung_c, jong_c);
				drawchr(curcols, currows, curcolor, img_chrdat, 2);
				curcols += 2;
			} else {
				if ( han_specs.indexOf(txt.substr(i, 1) ) >= 0 ) {
					spex = han_specs.indexOf(txt.substr(i, 1) ) % 16;
					spey = Math.floor(han_specs.indexOf(txt.substr(i, 1) ) / 16);
					img_chrdat = get_spechar_img(spex, spey);
					drawchr(curcols, currows, curcolor, img_chrdat, 2);
				}
				curcols += 2;
			}
		}
	}
}

/* Ready */
$(document).ready(function() {
	// Default size
	$("#container").css("width", t_width + "px");
	$("#container").css("height", t_height + "px");
	
	$("#basic_img").ready(function() {
		var img = document.getElementById("basic_img");
		var c = document.getElementById("basic_canv");
		var ctx = c.getContext("2d");
		ctx.drawImage(img, 0, 0);
		var imgData = ctx.getImageData(0, 0, 256, 48);
		for (var i=0; i<imgData.data.length; i+=4) {
			if (imgData.data[i] + imgData.data[i+1] + imgData.data[i+2] == 0) {
				imgData.data[i+3] = 0;
			}
		}
		ctx.putImageData(imgData, 0, 0);
		prepared += 1;
	});
	$("#han_img").ready(function() {
		var img = document.getElementById("han_img");
		var c = document.getElementById("han_canv");
		var ctx = c.getContext("2d");
		var c2 = document.getElementById("han2_canv");
		var ctx2 = c2.getContext("2d");
		ctx.drawImage(img, 0, 0);
		ctx.drawImage(img, -256, 128);
		ctx.clearRect(128, 128, 128, 128);
		ctx2.drawImage(img, -256, 0);
		ctx2.drawImage(img, 0, -128);
		var imgData = ctx.getImageData(0, 0, 256, 256);
		for (var i=0; i<imgData.data.length; i+=4) {
			if (imgData.data[i] + imgData.data[i+1] + imgData.data[i+2] == 0) {
				imgData.data[i+3] = 0;
			}
		}
		ctx.putImageData(imgData, 0, 0);
		imgData = ctx2.getImageData(0, 0, 256, 256);
		for (var i=0; i<imgData.data.length; i+=4) {
			if (imgData.data[i] + imgData.data[i+1] + imgData.data[i+2] == 0) {
				imgData.data[i+3] = 0;
			}
		}
		ctx2.putImageData(imgData, 0, 0);
		prepared += 1;
	});
	$("#spe_img").ready(function() {
		var img = document.getElementById("spe_img");
		var c = document.getElementById("spe_canv");
		var ctx = c.getContext("2d");
		ctx.drawImage(img, 0, 0);
		var imgData = ctx.getImageData(0, 0, c.width, c.height);
		for (var i=0; i<imgData.data.length; i+=4) {
			if (imgData.data[i] + imgData.data[i+1] + imgData.data[i+2] == 0) {
				imgData.data[i+3] = 0;
			}
		}
		ctx.putImageData(imgData, 0, 0);
		prepared += 1;
	});
	$("#ticker").ready(function() { prepared += 1; });
});
