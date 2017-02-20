window.onload = function() {
	var i = 0, j = 0, x = 0, y = 0;
	var c = document.getElementById('canv');
	var ctx = c.getContext("2d");
	
	ctx.shadowBlur = 5;
	
	for (i=0; i<60; i++) {
		j = i * 6;
		k = j * (Math.PI / 180);
		x = 160 + Math.round(Math.sin(k) * 105);
		y = 160 - Math.round(Math.cos(k) * 105);
		ctx.fillStyle = "hsl(" + j + ", 100%, 50%)";
		ctx.shadowColor = "hsl(" + j + ", 100%, 50%)";
		if (i % 5 == 0) {
			ctx.translate(x, y);
			ctx.rotate(k);
			ctx.fillRect(-1, -4, 2, 8);
			ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset Transform
		} else {
			ctx.fillRect(x-1, y-1, 2, 2);
		}
	}
}
