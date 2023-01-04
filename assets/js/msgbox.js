---
---

document.write(`<link rel="stylesheet" type="text/css" href="{{ site.baseurl }}/assets/css/msgbox.css"/>`);

const msgbox = html.querySelector("#msgbox-container");
const f_msgbox = function(msg, type) {
	if ( !type ) { type = "mormal"; }
	let x = document.createElement("div");
	x.className = "msgbox";
	x.innerHTML = '<div class="' + type + '">' + msg + '</div>';
	msgbox.prepend(x);

	setTimeout(function() {
		x.classList.add("show");
	}, 10);

	function msg_hide() {
		x.classList.add("hide");
		setTimeout(function() {
			x.remove();
		}, 500);
	}

	if (type == "warning") {
		setTimeout(function() {
			msg_hide();
		}, 3000);
	} else if (type == "error") {
		setTimeout(function() {
			msg_hide();
		}, 4000);
	} else { /* normal, success, etc. */
		setTimeout(function() {
			msg_hide();
		}, 2000);
	}
}
