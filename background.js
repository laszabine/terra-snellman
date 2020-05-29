
function getImageUrls() {
  let str = 'const urls = {';
  let urls = {
      "cult_track": 'images/cult_track.jpg',
      'ACT1': 'images/action1.png',
      'ACT2': 'images/action2.png',
      'ACT3': 'images/action3.png',
      'ACT4': 'images/action4.png',
      'ACT5': 'images/action5.png',
      'ACT6': 'images/action6.png',
      'BON1': 'images/bonus01.png',
      'BON2': 'images/bonus02.png',
      'BON3': 'images/bonus03.png',
      'BON4': 'images/bonus04.png',
      'BON5': 'images/bonus05.png',
      'BON6': 'images/bonus06.png',
      'BON7': 'images/bonus07.png',
      'BON8': 'images/bonus08.png',
      'BON9': 'images/bonus09.png',
      "FAV1": 'images/favor01.png',
      "FAV2": 'images/favor02.png',
      "FAV3": 'images/favor03.png',
      "FAV4": 'images/favor04.png',
      "FAV5": 'images/favor05.png',
      "FAV6": 'images/favor06.png',
      "FAV7": 'images/favor07.png',
      "FAV8": 'images/favor08.png',
      "FAV9": 'images/favor09.png',
      "FAV10": 'images/favor10.png',
      "FAV11": 'images/favor11.png',
      "FAV12": 'images/favor12.png',
      "TW1": 'images/town1.png',
      "TW2": 'images/town2.png',
      "TW3": 'images/town3.png',
      "TW4": 'images/town4.png',
      "TW5": 'images/town5.png',
      'coin5': 'images/coin5.png',
      'coin2': 'images/coin2.png',
      'coin1': 'images/coin1.png',
      'worker': 'images/worker.png',
      'priest_green': 'images/priest_green.png',
      'priest_yellow': 'images/priest_yellow.png',
      'priest_blue': 'images/priest_blue.png',
      'priest_brown': 'images/priest_brown.png',
      'priest_red': 'images/priest_red.png',
      'priest_black': 'images/priest_black.png',
      'priest_gray': 'images/priest_gray.png',
      'faction_alchemists': 'images/faction_alchemists.jpg',
      'faction_auren': 'images/faction_auren.jpg',
      'faction_chaosmagicians': 'images/faction_chaosmagicians.jpg',
      'faction_cultists': 'images/faction_cultists.jpg',
      'faction_darklings': 'images/faction_darklings.jpg',
      'faction_dwarves': 'images/faction_dwarves.jpg',
      'faction_engineers': 'images/faction_engineers.jpg',
      'faction_fakirs': 'images/faction_fakirs.jpg',
      'faction_giants': 'images/faction_giants.jpg',
      'faction_halflings': 'images/faction_halflings.jpg',
      'faction_mermaids': 'images/faction_mermaids.jpg',
      'faction_nomads': 'images/faction_nomads.jpg',
      'faction_swarmlings': 'images/faction_swarmlings.jpg',
      'faction_witches': 'images/faction_witches.jpg',
  };
  for (key in urls) {
    str += key + ': "' + browser.extension.getURL(urls[key]) + '", ';
  }
  str += '};'
  return str;
}

function overwriteFunctions(details) {
  console.log("game.js was requested")
  let filter = browser.webRequest.filterResponseData(details.requestId);
  let decoder = new TextDecoder("utf-8");
  let encoder = new TextEncoder();
  let enc;
  filter.ondata = async function(event) {

    // output the original content
    let orig_gamejs = decoder.decode(event.data, {stream: true});
    enc = encoder.encode(orig_gamejs);
    console.log('orig', enc);
    await filter.write(enc);

  };
  filter.onstop = async function(event) {

    // output the image urls
    let imgUrls = getImageUrls();
    enc = encoder.encode(imgUrls);
    console.log('urls', enc);
    await filter.write(enc);

    // output the new content, which overwrites the original content
    let modified_gamejs;
    let path = 'content_scripts/game.js';
    let response = await fetch(path, {mode:'same-origin'}) // <-- important
    let file = await response.blob();
    console.log('file', file);
    let reader = new FileReader();
    reader.onload = async function() {
      modified_gamejs = reader.result;
      let enc = encoder.encode(modified_gamejs);
      console.log('custom', enc);
      await filter.write(enc);
    };
    reader.onloadend = function() {

      // clean up
      filter.disconnect();
      console.log("finished parsing game.js");

    }
    reader.readAsText(file);

  };
  // things here will happen while the filter is receiving data
  return {};
}

browser.webRequest.onBeforeRequest.addListener(
  overwriteFunctions,
  {urls: ["https://terra.snellman.net/stc/game.js*"]},
  ["blocking"]
);
