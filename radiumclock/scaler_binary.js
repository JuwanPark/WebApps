window.onload = function() {
	var i = 0, j = 0, x = 0, y = 0;
	var c = document.getElementById('canv_bin');
	var ctx = c.getContext("2d");

	ctx.fillStyle = "#000000";
	
	ctx.fillRect(210, 10, 30, 20);
	for (x=0; x<5; x++) {
		for (y=1; y<=4; y++) {
			ctx.fillRect(x * 50 + 10, y * 40 + 10, 30, 20);
		}
	}
	for (y=2; y<=4; y++) {
		ctx.fillRect(260, y * 40 + 10, 30, 20);
	}
	ctx.fillRect(10, 370, 30, 20);
	ctx.fillRect(60, 250, 30, 20);
	for (x=1; x<=5; x++) {
		for (y=7; y<=9; y++) {
			ctx.fillRect(x * 50 + 10, y * 40 + 10, 30, 20);
		}
	}
}
