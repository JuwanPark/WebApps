document.getElementById('radiumclock').addEventListener('load',function(){
	var svg = document.getElementById('radiumclock').contentDocument;
	var hour = svg.getElementById('hour');
	var min = svg.getElementById('min');
	var sec = svg.getElementById('sec');
	var h_fill = svg.getElementById('h_fill');
	var m_fill = svg.getElementById('m_fill');
	
	setInterval(rotateclock, 100);
	function rotateclock() {
		var ctime = new Date();
		var chour = ctime.getHours();
		var cmin = ctime.getMinutes();
		var csec = ctime.getSeconds();
		if (chour >= 12) { chour -= 12; }
		hour.setAttribute("transform", "rotate(" + (chour * 30 + Math.floor(cmin / 2)) + " 160 160)");
		h_fill.style.fill = "hsl(" + (chour * 30) + ", 100%, 50%)";
		min.setAttribute("transform", "rotate(" + (cmin * 6 + Math.floor(csec / 10)) + " 160 160)");
		m_fill.style.fill = "hsl(" + (cmin * 6) + ", 100%, 50%)";
		sec.setAttribute("transform", "rotate(" + (csec * 6) + " 160 160)");
	}
});
