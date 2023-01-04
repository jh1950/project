const slidebox = html.querySelector("#slide-container");
const slides = slidebox.querySelectorAll(".slide");
const svg_name = get_param("search");

if (svg_name) {
	slidebox.remove();
} else if (0 == slides.length) {
	slidebox.remove();
} else if (1 < slides.length) {
	let view_idx;
	let progress = 0;
	let auto_play;
	function slide_autoPlay(e) {
		if (!e || e == "stop" || e == "pause") { clearInterval(auto_play); }
		if (!e || e == "start" || e == "play") {
			if (!e || e == "start") { progress = 0; }
			auto_play = setInterval(function() {
				progress += 1;
				set_style(slidebox, "--progress", progress + "%");

				if (progress == 100) {
					slide_autoPlay("stop");
					let i = view_idx+1;
					if (i == slides.length) { i = 0; }
					slide_select(i);
				}
			}, 50);
		}
	}
	function slide_select(i) {
		if (slides[i].classList.contains("select")) { return; }
		view_idx = i;
		for (const btn of slide_btns) { btn.classList.remove("select"); }
		slide_btns[i].classList.add("select");
		set_style(slidebox, "--idx", i);

		if (!slidebox.classList.contains("stop")) { slide_autoPlay(); }
	}
	function slide_control_click() {
		// e.querySelector("svg use");
		if (slidebox.classList.contains("stop")) {
			slide_autoPlay("start");
			slidebox.classList.remove("stop");
		} else {
			slidebox.classList.add("stop");
			slide_autoPlay("stop");
		}
	}

	const slide_btnbox = document.createElement("ul");
	slide_btnbox.id = "slide-btnbox";
	slidebox.append(slide_btnbox);
	for (let i = 0; i<slides.length; i++) {
		// slides[i].setAttribute("slide", i);
		let slide_btn = document.createElement("li");
		slide_btn.innerHTML = `<button type="button" onclick="slide_select(${i})"></button>`;
		slide_btnbox.append(slide_btn);
	}
	const last_btn = document.createElement("li");
	last_btn.innerHTML =
		'<button class="slide-control" type="button" onclick="slide_control_click()">'+
			'<svg viewBox="0 0 32 64"><use href="#svg-pause" stroke="var(--bg-color)" fill="var(--color)"/></svg>'+
			'<svg viewBox="0 0 48 64"><use href="#svg-play" stroke="var(--bg-color)" fill="var(--color)"/></svg>'+
		'</button>';
	slide_btnbox.append(last_btn);
	const slide_btns = slide_btnbox.querySelectorAll("button");
	slide_select(0);



	/* Touch Event */

	let touch_startX;
	let touch_endX;
	let touch_dist;
	let touch_minX = 100;

	for (let slide of slides) {
		slide.addEventListener("touchstart", function(e) {
			if (e.touches.length != 1) { return; }
			slide_autoPlay("pause");
			slidebox.classList.add("touch");
			touch_startX = e.touches[0].clientX;
		});
		slide.addEventListener("touchmove", function(e) {
			touch_endX = e.touches[0].clientX;
			touch_dist = touch_endX - touch_startX;
			set_style(slidebox, "--touch-px", touch_dist + "px");
		});
		slide.addEventListener("touchend", function(e) {
			if (e.touches.length != 0) { return; }
			slidebox.classList.remove("touch");
			set_style(slidebox, "--touch-px", "");
			if (!slidebox.classList.contains("stop")) { slide_autoPlay("play"); }

			if (touch_minX < Math.abs(touch_dist)) {
				let next_idx = view_idx;
				if (0 < touch_dist) { next_idx--; }
				else { next_idx++; }
				if (next_idx < 0 || slides.length == next_idx) { return; }
				slide_select(next_idx);
			}
		});
	}
}
