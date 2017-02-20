window.onload = function() {
	var i = 0, j = 0, x = 0, y = 0;
	var c = document.getElementById('canv');
	var ctx = c.getContext("2d");
	
	ctx.fillStyle = "#2aff6a";
	ctx.shadowBlur = 5;
	ctx.shadowColor = "#2aff6a";
	
	for (i=0; i<60; i++) {
		j = i * 6 * (Math.PI / 180);
		x = 160 + Math.round(Math.sin(j) * 105);
		y = 160 - Math.round(Math.cos(j) * 105);
		if (i % 5 == 0) {
			ctx.translate(x, y);
			ctx.rotate(j);
			ctx.fillRect(-1, -4, 2, 8);
			ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset Transform
		} else {
			ctx.fillRect(x-1, y-1, 2, 2);
		}
	}
}
