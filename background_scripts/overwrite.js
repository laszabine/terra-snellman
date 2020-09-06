
function getImageUrls() {
  let str = 'const urls = {';
  let urls = {
      'EXT_BASE_URL': '',
      'libSvgInject': 'lib/svg-inject.js',
      'ACT1': 'images/action1.svg',
      'ACT2': 'images/action2.svg',
      'ACT3': 'images/action3.svg',
      'ACT4': 'images/action4.svg',
      'ACT5': 'images/action5.svg',
      'ACT6': 'images/action6.svg',
      'ACTTAKEN': 'images/src/action_taken.svg',
      'BON1': 'images/bonus01.svg',
      'BON2': 'images/bonus02.svg',
      'BON3': 'images/bonus03.svg',
      'BON4': 'images/bonus04.svg',
      'BON5': 'images/bonus05.svg',
      'BON6': 'images/bonus06.svg',
      'BON7': 'images/bonus07.svg',
      'BON8': 'images/bonus08.svg',
      'BON9': 'images/bonus09.svg',
      'BON10': 'images/bonus10.svg',
      'coin1': 'images/src/coin1.svg',
      'coin2': 'images/src/coin2.svg',
      'coin5': 'images/src/coin5.svg',
      "cult_track": 'images/cult_track.jpg',
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
      "FAV1": 'images/favor01.svg',
      "FAV2": 'images/favor02.svg',
      "FAV3": 'images/favor03.svg',
      "FAV4": 'images/favor04.svg',
      "FAV5": 'images/favor05.svg',
      "FAV6": 'images/favor06.svg',
      "FAV7": 'images/favor07.svg',
      "FAV8": 'images/favor08.svg',
      "FAV9": 'images/favor09.svg',
      "FAV10": 'images/favor10.svg',
      "FAV11": 'images/favor11.svg',
      "FAV12": 'images/favor12.svg',
      'power': 'images/src/power.svg',
      'priest_black': 'images/src/priest_black.svg',
      'priest_blue': 'images/src/priest_blue.svg',
      'priest_brown': 'images/src/priest_brown.svg',
      'priest_gray': 'images/src/priest_gray.svg',
      'priest_green': 'images/src/priest_green.svg',
      'priest_red': 'images/src/priest_red.svg',
      'priest_yellow': 'images/src/priest_yellow.svg',
      'SCORE1': 'images/scoring1.svg',
      'SCORE2': 'images/scoring2.svg',
      'SCORE3': 'images/scoring3.svg',
      'SCORE4': 'images/scoring4.svg',
      'SCORE5': 'images/scoring5.svg',
      'SCORE6': 'images/scoring6.svg',
      'SCORE7': 'images/scoring7.svg',
      'SCORE8': 'images/scoring8.svg',
      'SCORE9': 'images/scoring9.svg',
      'scoring_bg': 'images/src/scoring_bg.svg',
      'scoring_final': 'images/scoring_final.jpg',
      'scoring_final_connected_distance': 'images/scoring_final_connected-distance.png',
      'scoring_final_connected_sa_sh_distance': 'images/scoring_final_connected-sa-sh-distance.png',
      'scoring_final_building_on_edge': 'images/scoring_final_building-on-edge.png',
      'scoring_final_connected_clusters': 'images/scoring_final_connected-clusters.png',
      'scoring_last_round': 'images/src/scoring_last_round.svg',
      "TW1": 'images/town1.svg',
      "TW2": 'images/town2.svg',
      "TW3": 'images/town3.svg',
      "TW4": 'images/town4.svg',
      "TW5": 'images/town5.svg',
      'TW6': 'images/town6.svg',
      'TW7_ship': 'images/town7_ship.svg',
      'TW7_carpet': 'images/town7_carpet.svg',
      'TW8': 'images/town8.svg',
      'worker': 'images/src/worker.svg',
  };
  for (key in urls) {
    str += key + ': "' + browser.extension.getURL(urls[key]) + '", ';
  }
  str += '};'
  return str;
}

async function fileToFilter(filter, path, function_onloadend) {
  let response = await fetch(path, {mode: 'same-origin'});
  let file = await response.blob();
  let reader = new FileReader();
  let encoder = new TextEncoder();
  reader.onload = async function() {
    let content = reader.result;
    await filter.write(encoder.encode(content));
  };
  reader.onloadend = function_onloadend;
  reader.readAsText(file);
}

function appendFunctions(details) {
  console.log(details.url + " was requested; appending")
  let filename = details.url.match(/[^/\.]*\.(js|css)/i)[0];

  let filter = browser.webRequest.filterResponseData(details.requestId);
  let decoder = new TextDecoder("utf-8");
  let encoder = new TextEncoder();
  let enc;
  filter.ondata = async function(event) {

    // output the original content
    console.log('appending', filename, 'outputting original content');
    let orig = decoder.decode(event.data, {stream: true});
    await filter.write(encoder.encode(orig));

  };
  filter.onstop = async function(event) {
    console.log('appending', filename, 'begin onstop');

    if (filename == 'game.js') {

      // output the image urls
      console.log('appending', filename, 'appending urls to assets in extension');
      let imgUrls = getImageUrls();
      await filter.write(encoder.encode(imgUrls));

      // output the svg functions
      console.log('appending', filename, 'appending custom svg functions');
      await fileToFilter(filter, 'include/svg.js');
    }

    if (filename == 'faction.js' || filename == 'index.js') {

      // output the notification functions
      console.log('appending', filename, 'appending custom notification functions');
      await fileToFilter(filter, 'include/notification.js');
    }

    // output the new content, which overwrites the original content
    let path = 'append/' + filename;
    console.log('appending', filename, 'appending the contents of '+path);
    await fileToFilter(filter, path, function() {
      // clean up
      filter.disconnect();
      console.log("finished parsing " + filename);
    });

    console.log('appending', filename, 'end onstop');
  };

  // things here will happen while the filter is receiving data
  return {};
}

browser.webRequest.onBeforeRequest.addListener(
  appendFunctions,
  {
    urls: [
        "*://terra.snellman.net/stc/game.js*"
      , "*://terra.snellman.net/stc/faction.js*"
      , "*://terra.snellman.net/stc/index.js*"
    ]
  },
  ["blocking"]
);
