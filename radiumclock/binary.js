document.getElementById('radiumclock').addEventListener('load',function(){
	var svg = document.getElementById('radiumclock').contentDocument;

	var year = svg.getElementsByClassName('year');
	var mont = svg.getElementsByClassName('month');
	var dats = svg.getElementsByClassName('date');
	var days = svg.getElementsByClassName('day');

	var ampm = svg.getElementById('ampm');

	var hour = svg.getElementsByClassName('hour');
	var min = svg.getElementsByClassName('min');
	var sec = svg.getElementsByClassName('sec');

	setInterval(rotatebinary, 100);
	function rotatebinary() {
		var ctime = new Date();
		var b_year = (ctime.getFullYear() + 4096).toString(2);
		var b_mont = (ctime.getMonth() + 17).toString(2);
		var b_dats = (ctime.getDate() + 32).toString(2);
		var b_days = (ctime.getDay() + 8).toString(2);
		var b_min = (ctime.getMinutes() + 64).toString(2);
		var b_sec = (ctime.getSeconds() + 64).toString(2);

		if (b_days == "000") { b_days = "111"; }
		hh = ctime.getHours();
		if (hh >= 12) {
			ampm.style.fill = "#ff6a2a";
			hh -= 12;
		} else { ampm.style.fill = "transparent"; }
		if (hh == 0) { hh = 12; }
		var b_hour = (hh + 16).toString(2);

		for (i=0; i<12; i++) {
			if (b_year.substr(12 - i, 1) == "1") { year[i].style.fill = "#2aff6a";
			} else { year[i].style.fill = "transparent"; }
		}
		for (i=0; i<4; i++) {
			if (b_mont.substr(4 - i, 1) == "1") { mont[i].style.fill = "#ff6a2a";
			} else { mont[i].style.fill = "transparent"; }
			if (b_hour.substr(4 - i, 1) == "1") { hour[i].style.fill = "#2aff6a";
			} else { hour[i].style.fill = "transparent"; }
		}
		for (i=0; i<5; i++) {
			if (b_dats.substr(5 - i, 1) == "1") { dats[i].style.fill = "#2aff6a";
			} else { dats[i].style.fill = "transparent"; }
		}
		for (i=0; i<3; i++) {
			if (b_days.substr(3 - i, 1) == "1") { days[i].style.fill = "#ff6a2a";
			} else { days[i].style.fill = "transparent"; }
		}
		for (i=0; i<6; i++) {
			if (b_min.substr(6 - i, 1) == "1") { min[i].style.fill = "#ff6a2a";
			} else { min[i].style.fill = "transparent"; }
			if (b_sec.substr(6 - i, 1) == "1") { sec[i].style.fill = "#2aff6a";
			} else { sec[i].style.fill = "transparent"; }
		}
	}
});
