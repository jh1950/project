function codebox_copy(t) {
	const x = t.parentNode.parentNode.querySelector(".codebox-content pre").innerText;
	const copy_area = document.createElement("textarea");
	try {
		copy_area.className = "copy_area";
		t.after(copy_area);
		copy_area.value = x;
		copy_area.select();
		document.execCommand("copy");
		f_msgbox("Copy Successul!", "success");
	} catch (err) {
		f_msgbox("Copy Error!", "error");
	}
	copy_area.remove();
}

function codebox_highlight(t, i) {
	set_style(t, "--line", i);
}

const f_codebox = function(codeboxs) {
	for (let codebox of codeboxs) {
		let code_lang = codebox.getAttribute("lang"); codebox.removeAttribute("lang");
		if (!code_lang) { code_lang = "Plain Text"; }
		let code = codebox.innerHTML.trim();
		if (code_lang.toLowerCase().startsWith("python")) { code = code.replace(/	/g, '    '); }
		else if (code_lang.toLowerCase().startsWith("ruby")) { code = code.replace(/	/g, '  '); }
		codebox.innerHTML =
			'<div class="codebox-bg">'+
				'<span class="codebox-highlight"></span>'+
			'</div>'+
			'<code><table>'+
				'<caption class="codebox-title"><button type="button" aria-label="Copy" title="Copy!" onclick="codebox_copy(this);"><svg viewBox="0 0 57 64"><use href="#svg-copy" stroke="var(--color)"/></svg></button><span>' + code_lang + '</span></caption>'+
				'<tr>'+
					'<td class="codebox-line"><pre></pre></td>'+
					'<td class="codebox-content"><pre>' + code + '</pre></td>'+
				'</tr>'+
			'</table></code>';
		const codebox_bg = codebox.querySelector(".codebox-bg");
		const codebox_content = codebox.querySelector(".codebox-content pre");
		const codebox_line = codebox.querySelector(".codebox-line pre");
		const codebox_height = codebox_content.clientHeight;
		const codebox_lineHeight = parseFloat(get_style(codebox_content, "line-height"));

		const lines = codebox_height/codebox_lineHeight;
		let line_text = '1';
		for (let i=1; i<lines; i++) { line_text += "\n" + (i+1); }
		codebox_line.innerText = line_text;
		set_style(codebox, "--content-height", codebox_content.clientHeight + "px");
		set_style(codebox, "--line-width", codebox_line.parentNode.clientWidth + "px");

		codebox_content.parentNode.addEventListener("scroll", function() {
			set_style(this.parentNode.parentNode.parentNode.parentNode.parentNode, "--top", (this.scrollTop*-1) + "px");
		});

		codebox.querySelector("tr").onmouseout = function() {
			const codebox_bg = this.parentNode.parentNode.parentNode.parentNode.querySelector(".codebox-bg");
			codebox_highlight(codebox_bg, -1);
		}
		codebox.querySelector("tr").onmousemove = function(e) {
			const codebox = this.parentNode.parentNode.parentNode.parentNode;
			const codebox_bg = codebox.querySelector(".codebox-bg");
			const codebox_content = codebox.querySelector(".codebox-content pre");
			const x = codebox.querySelector(".codebox-content");

			const paddingTop = parseFloat(get_style(x, "padding-top"));
			const codebox_lineHeight = parseFloat(get_style(codebox_content, "line-height"));
			const y = e.clientY - this.getBoundingClientRect().top - paddingTop;
			let line = y + this.querySelector(".codebox-content").scrollTop;
			if (x.clientHeight < y+paddingTop || line < 0 || codebox_content.clientHeight < line) { codebox_highlight(codebox_bg, -1); return false; }

			line = parseInt(line / codebox_lineHeight) + 1;
			codebox_highlight(codebox_bg, line);
		}
	}
}
