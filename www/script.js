'use strict';

const $ = document.querySelector.bind(document);

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

let canvas;

const update = debounce(async () => {

  let name = document.getElementById("name").value;
  let radio = document.querySelector("input[name=layout]:checked");
  let layout = radio && radio.value || "a4";

  if (!(!name && layout === "a4")) {
    let params = "?" + new URLSearchParams({name, layout}).toString();
    window.history.replaceState("", "", params);
  }
  fullLogo.dataset.layout = layout;

  let sizes = {
    'a4': { width: 3508, height: 2480 },
    'square': { width: 3000, height: 3000 }
  };
  let canvasSize = sizes[layout];

  canvas = document.createElement("canvas");
  const ctx = canvas.getContext('2d');

  let width = canvas.width = canvasSize.width;
  let height = canvas.height = canvasSize.height;

  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, width, height);

  let subHeadHeight = height / 10;

  let img = await loadImage("yes.svg");
  let marginTop = (height - (img.height + subHeadHeight)) / 2.2;

  ctx.drawImage(img, (width - img.width) / 2, marginTop,
                img.width, img.height);

  ctx.font = subHeadHeight + "px gilroyblack";
  let size = ctx.measureText(name);
  let y = img.height + marginTop + 350;
  let divisor = Math.floor(name.length / colours.length) + 1;
  let start = (width - size.width) / 2;

  for (let i = 0; i < name.length; i++) {
    ctx.fillStyle = "#" + colours[Math.floor(i / divisor)];
    ctx.fillText(name[i], start, y);
    start += ctx.measureText(name[i]).width;
  }

  fullLogo.innerHTML = '';
  fullLogo.appendChild(canvas);

}, 250);

function loadImage(url) {
  return new Promise(resolve => {
    var img = new Image();
    // Size of the source SVG
    img.width = 731 * 3;
    img.height = 297 * 3;
    img.onload = function() { resolve(img); }
    img.src = url;
  });
}

function downloadUri(filename, uri) {
  var link = document.createElement("a");
 	link.download = filename;
 	link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

async function generateDownload() {
  downloadUri("yes.png", canvas.toDataURL('image/png'));
}

var params = new URLSearchParams(window.location.search);

if (params.has("name")) {
  $("#name").value = params.get("name");
}

if (params.has("layout")) {
  let layout = params.get("layout");
  let radio = $(`input[name=layout][value=${layout}]`).checked = true;
}

$("#name").addEventListener("input", update);
$("#layout").addEventListener("input", update);
download.addEventListener("click", generateDownload);

(async function () {
  await document.fonts.ready;
  await document.fonts.load("10pt gilroyblack");
  update();
})();
