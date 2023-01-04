const header = html.querySelector("#header");



function mode_toggle_click() {
	let checked = mode_toggle.getAttribute("aria-checked");
	if (checked == "true") { checked = "false"; }
	else { checked = "true"; }
	mode_change(checked);
}

function mode_change(mode) {
	html.setAttribute("darkmode", mode);
	mode_toggle.setAttribute("aria-checked", mode);
	localStorage.darkmode = mode;
}



const mode_toggle = document.createElement("button");
mode_toggle.id = "mode-toggle";
mode_toggle.title = "Dark Mode On/Off";
mode_toggle.type = "button";
mode_toggle.role = "switch";
mode_toggle.ariaChecked = "false";
mode_toggle.ariaLabel = "Dark Mode";
mode_toggle.onclick = mode_toggle_click;
header.append(mode_toggle);

if (localStorage.darkmode) { mode_change(localStorage.darkmode); }
else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) { mode_change("true"); }
else { mode_change("false"); }





const header_height = header.clientHeight;
let scroll_bak = html.scrollTop;
header.style.top = 0 + "px";

window.addEventListener("scroll", function() {
	let scroll = html.scrollTop;
	let top = parseFloat(header.style.top) + (scroll_bak - scroll);
	if ( top > 0 ) { top = 0; }
	else if ( top < header_height*-1 ) { top = header_height*-1 }
	header.style.top = top + "px";
	scroll_bak = scroll;
});
