
function showSvgLayer(layer) {
  layer.style = null;
}

function hideSvgLayer(layer) {
  layer.style.display = 'none';
}

function fixSvgImageUrl(layer) {
  let images = layer.getElementsByTagName('image');
  for (let i=0; i<images.length; i++) {
    let img = images[i];
    let relUrl = img.getAttribute('xlink:href');
    let absUrl = urls.EXT_BASE_URL + 'images/' + relUrl;
    img.setAttribute('xlink:href', absUrl);
  }
}
