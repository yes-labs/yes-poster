'use strict';

const subHead = document.getElementById("subhead");
const download = document.getElementById("download");
const fullLogo = document.getElementById("full-logo");

const colours = ["1BA0CE", "D5344D", "1E988B", "4E5391", "E8883C"];

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

function selectElementContents(el) {
  var range = document.createRange();
  range.selectNodeContents(el);
  var sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}

function setEndOfContenteditable(contentEditableElement) {
  let range = document.createRange();
  range.selectNodeContents(contentEditableElement);
  range.collapse(false);
  let selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
}

const update = debounce(() => {
  let pos = subHead.innerText.length;
  let divisor = Math.floor(subHead.innerText.length / colours.length) + 1;
  let html = [];
  for (let i = 0; i < subHead.innerText.length; i++) {
    let character = subHead.innerText[i];
    let colour = colours[Math.floor(i / divisor)];
    html.push(`<span style="color: #${colour}">${character}</span>`);
  }
  let content = html.join("");
  subHead.innerHTML = content;
  setEndOfContenteditable(subHead);
}, 250);

function downloadUri(filename, uri) {
	var link = document.createElement("a");
 	link.download = filename;
 	link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

async function generateDownload() {
	let canvas = await html2canvas(fullLogo);
	let dataUri = canvas.toDataURL('image/png');
  downloadUri("Yes.png", dataUri)
}

selectElementContents(subHead);
subHead.addEventListener("input", update);
download.addEventListener("click", generateDownload);
