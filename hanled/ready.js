/* Ready */
$(document).ready(function() {
	// Default size
	$("#container").css("width", t_width + "px");
	$("#container").css("height", t_height + "px");

	$("#blinder").css("width", t_width + "px");
	$("#blinder").css("height", t_height + "px");
	$("#blinder").css("margin-bottom", t_height * -1 + "px");

	$("#blinker").css("width", t_width + "px");
	$("#blinker").css("height", t_height + "px");
	$("#blinker").css("margin-bottom", t_height * -1 + "px");

	/* All load */
	var promises = [];
	for (var i = 0; i < font_imgs.length; i++) {
		(function(url, promise) {
			var img = new Image();
			img.onload = function() {
				promise.resolve();
			};
			img.src = url;
			$("#" + font_imgs[i]["name"]).attr("src", url);
		})(font_imgs[i]["src"], promises[i] = $.Deferred());
	}
	$.when.apply($, promises).done(function(){
		var rfh = setInterval(function(){ ready_for_hangul() }, 10);
		function ready_for_hangul () {
			if (han_standby >= 2) {
				clearInterval(rfh);
				hangul_load();
			}
		}
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
			img_standby += 1;
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
			img_standby += 1;
		});
		$("#ani_img").ready(function() {
			var img = document.getElementById("ani_img");
			var c = document.getElementById("ani_canv");
			var ctx = c.getContext("2d");
			ctx.drawImage(img, 0, 0);
			var imgData = ctx.getImageData(0, 0, 256, 64);
			for (var i=0; i<imgData.data.length; i+=4) {
				if (imgData.data[i] + imgData.data[i+1] + imgData.data[i+2] == 0) {
					imgData.data[i+3] = 0;
				}
			}
			ctx.putImageData(imgData, 0, 0);
			img_standby += 1;
		});

		$("#han_img").ready(function() { han_standby += 1; });
		$("#natja_img").ready(function() { han_standby += 1; });
		function hangul_load() {
			var img = document.getElementById("han_img");
			var natja = document.getElementById("natja_img");
			var c = document.getElementById("han_canv");
			var ctx = c.getContext("2d");
			var c2 = document.getElementById("han2_canv");
			var ctx2 = c2.getContext("2d");
			ctx.drawImage(img, 0, 0);
			ctx.drawImage(img, -256, 128);
			ctx.drawImage(natja, 64, 128);
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
			img_standby += 2;
		}
	});
});
