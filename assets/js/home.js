---
---

let content;
let codebox_container;
let codeboxs;
let selectbox;
const info = {};



const svg_color_change = function(name) {
	let input = html.querySelector(`#svgbox .info input[name="${name}"]`);
	let v = input.value;

	info[name] = v;
	localStorage[name] = v;

	if (!v) { v = input.getAttribute("placeholder"); }
	html.querySelector(`#svgbox .info input[name="${name}"]`).size = v.length;
	html.querySelector("#svgbox .icon svg> use").setAttribute(name, v);
	codebox_change(name);
}

const f_select = function(e) {
	const i = e.value;
	localStorage.select = i;
	codebox_container.innerHTML = '';
	codebox_container.append(codeboxs[i]);
}

const codebox_change = function(name) {
	for (let k in info) {
		if (name && k != name) { continue; }
		let v = info[k];
		if (!v) { v = html.querySelector(`#svgbox .info input[name="${k}"]`).getAttribute("placeholder"); }
		for (let x of content.querySelectorAll(`[svg="${k}"]`)) { x.innerText = v; }
	}
}



window.addEventListener("DOMContentLoaded", function() {
	content = html.querySelector("#content");
	const main = html.querySelector("#main");
	const svg_table = html.querySelector("#svg-table");

	const origin_code = content.querySelector("#svgbox .origin-code");
	const svg_icon = content.querySelector("#svgbox .icon");
	const svg_info = content.querySelector("#svgbox .info");
	const codes = content.querySelector("#codes");
	const svgs = svg_table.querySelectorAll("svg");
	let svgs_cnt = svgs.length;
	codebox_container = content.querySelector("#codebox-container");
	codeboxs = content.querySelectorAll(".codebox-wrapper");
	selectbox = content.querySelector("select");

	const search = get_param("search");
	const svg_name = get_param("svg");
	let real_name = svg_name;
	if (localStorage.select) {
		selectbox.children[localStorage.select*1+1].selected = true;
		f_select(selectbox);
	}



	if (search === undefined && svg_name === undefined) {
		main.classList.add("home");
	}
	if (svg_name || search == "" || search) {
		main.className = "search";

		if (search) {
			main.querySelector("input").value = search;
			let filter = search.split(" ").filter(x => x != "");

			for (let svg of svgs) {
				let a = svg.parentNode;
				a.setAttribute("href", a.getAttribute("href") + "&search=" + search);

				let tags = svg.getAttribute("src").split("/svg/")[1].split(".svg")[0];
				if (svg.hasAttribute("tags")) { tags += " " + svg.getAttribute("tags"); }
				let cnt = 0;
				for (let x of filter) {
					if (tags.toLowerCase().includes(x.toLowerCase())) { cnt++; }
				}
				if (filter.length != cnt) { svg.parentNode.parentNode.style.display = "none"; svgs_cnt--; }
			}
		}
		if (!svg_name && svgs_cnt == 0) {
			svg_table.children[1].removeAttribute("hidden");
		}
	}
	if (svg_name) {
		main.classList.remove("search");
		main.classList.add("select");
		html.querySelector("head title").innerText = `${svg_name} | ${html.querySelector("head title").innerText}`;
		real_name = svg_table.querySelector(`a[href="{{ site.baseurl }}/?svg=${svg_name}"] svg, a[href^="{{ site.baseurl }}/?svg=${svg_name}&search"] svg`).getAttribute("src").split("/svg/")[1].split(".svg")[0];

		for (let codebox of codeboxs) {
			codebox = codebox.querySelector(".codebox");
			if (codebox.getAttribute("lang") == ".svg") { codebox.setAttribute("lang", real_name + ".svg"); }
		}
	}





	for (let svg of svgs) {
		let p;
		fetch(svg.getAttribute("src")).then(res => res.text()).then(function(svg_code) {
			let tags = svg.getAttribute("tags");
			p = svg.parentNode;
			svg.outerHTML = svg_code.replace(/#5cc9ff/g, "var(--color)");
			svg = p.querySelector("svg");

			const symbol = svg.childNodes[0];
			const use = svg.childNodes[1];
			if (svg_name && svg_name == p.getAttribute("href").split("svg=")[1].split("&")[0]) {
				let svg_attr = '';
				let addAttr = svg.getAttribute("addattr");
				if (addAttr) {
					for (let x of addAttr.split(" ")) {
						if (x == "") { continue; }
						svg_attr += ` ${x}="${svg.getAttribute(x)}"`;
					}
				}

				svg.parentNode.parentNode.style.display = "none";
				if (tags && tags.includes("animation")) {
					svg_icon.innerHTML = `<svg viewBox="${svg.getAttribute("viewBox")}">${svg.children[1].outerHTML}</svg>`;
				} else {
					svg_icon.append(svg);
				}
				const viewBox = svg.getAttribute("viewBox");
				for (let x of ["fill", "stroke"]) {
					let v = use.getAttribute(x);
					if (v) { info[x] = ""; } else { 
						for (let r of content.querySelectorAll(`[svg="${x}-wrapper"]`)) { r.remove(); }
					}
				}
				svg_info.innerHTML =
					`<h2 id="svg-title">${real_name}</h2>`+
					`viewBox = "${viewBox}"`;
				for (let x in info) {
					let v = localStorage[x];
					if (!v) { v = ""; }
					let p = get_style(html, "--color");
					let s = p.length;
					svg_info.innerHTML += `<label>${x} = "<input type="text" name="${x}" placeholder="${p}" size="${s}" value="${v}" onkeyup="svg_color_change('${x}');"/>"</label>`;
					svg_color_change(x);
				}
				if (tags) {
					let tags_html = "";
					tags = tags.split(" ");
					for (let tag of tags) {
						tags_html += `<span class="tag">#${tag}</span>`;
						if (tag == "animation") {
							codeboxs[0].querySelector(".code-info").innerHTML += "<br/><strong>Animation can be restricted.</strong>";
						}
					}
					svg_info.innerHTML += `<div class="tags">${tags_html}</div>`;
				}

				info.viewBox = viewBox;
				info.name = real_name;
				info.code = symbol.innerHTML.trim();
				if (svg_attr) { info.addAttr = svg_attr; }
				codebox_change();

				f_codebox(html.querySelectorAll(".codebox"));
			}
		}).catch(function(e) {
			console.error(e)
			p.parentNode.remove();
		});
	}

	mode_toggle.addEventListener("click", function() {
		for (let x of svg_info.querySelectorAll("input")) {
			x.setAttribute("placeholder", get_style(html, "--color"));
			svg_color_change(x.name);
		}
	});
});
