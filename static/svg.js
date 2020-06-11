
function showSvgLayer(layer) {
  layer.style = null;
}

function hideSvgLayer(layer) {
  layer.style.display = 'none';
}

function fixSvgImageUrl(layer) {
  let firstChild = layer.firstElementChild;
  if (firstChild.tagName == 'image') {
    let relUrl = firstChild.getAttribute('xlink:href');
    let absUrl = urls.EXT_BASE_URL + 'images/' + relUrl;
    firstChild.setAttribute('xlink:href', absUrl);
  }
}
