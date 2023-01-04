const get_style = function(t, s) {
	return getComputedStyle(t).getPropertyValue(s).trim();
}
const set_style = function(t, s, v) {
	t.style.setProperty(s, v);
}


const params = "&" + location.search.slice(1);
const get_param = function(k) {
	let v, t = "&" + k + "=";
	if (params.includes(t)) { v = decodeURIComponent(params.split(t)[1].split("&")[0]).replace(/\+/g, " ");  }
	return v;
}



const html = document.querySelector("html");





window.addEventListener("DOMContentLoaded", function() {
	for (let x of html.querySelectorAll(`a[target="_blank"]`)) {
		let target = x.querySelector(".text");
		if (!target) { target = x; }
		target.innerHTML += '<svg width=".65em" height=".65em" style="margin-left: .25em" viewBox="0 0 64 64"><use href="#svg-externalLink" stroke="var(--color)"/></svg>';
	}
});
