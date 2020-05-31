var init_orig = init;

var init_mod;

init = function(root) {
  var isInit = true;

  function evaluateStateOptions(root) {
    let implementedOptions = [
      'email-notify',
      'errata-cultist-power',
      'strict-chaosmagician-sh',
      'strict-darkling-sh',
      'strict-leech',
      'variable-turn-order',
    ];
    if (isInit) {
      if (Object.keys(state.options).every(val => implementedOptions.includes(val))) {
        console.log("all options are compatible with sabine's twist");
        overwrite();
        init_mod(root);
      }
      isInit = false;
    }
  }

  // draw is what gets executed in the AJAX request's onSuccess (for non-saving)
  let draw_ = draw;
  draw = function(n) {
    evaluateStateOptions(root); // overwrite & call new init
    draw_(n);
  }
  // this is what sets off the AJAX request
  init_orig(root);
}

function overwrite() {
  console.log("overwriting functions!");

  var max_width = 1190;

  /* faction board */
  drawRealFaction = function(faction, board) {
      let container = board.parentNode;
      container.id = faction.name;
      container.style.width = max_width + 'px';
      if (faction.passed) {
          board.style.opacity = 1;
          container.style.opacity = 0.5;
      }
      let name = faction.name;
      let factionBoardCanvasWidth = 620;
      let factionBoardCanvasHeight = 399;
      // 2. faction board
      {
          let factionBoardCanvas = new Element('canvas');
          board.insert(factionBoardCanvas);
          //factionBoardCanvas.style.float = 'left';
          factionBoardCanvas.style.background = 'url(' + urls['faction_'+name] + ')';
          factionBoardCanvas.style.opacity = 1;
          factionBoardCanvas.style['margin-top'] = '5px';
          factionBoardCanvas.width = factionBoardCanvasWidth;
          factionBoardCanvas.height = factionBoardCanvasHeight;
          let ctx = factionBoardCanvas.getContext('2d');
          ctx.save();
          ctx.fillStyle = colors[faction.color] + 'aa';
          // 2.1. dwellings
          for (let dw=faction.buildings.D.max_level; dw>faction.buildings.D.level; dw--) {
              ctx.fillRect(87+(dw-1)*29,345,25,35);
          }
          // 2.2. trading posts
          for (let tp=faction.buildings.TP.max_level; tp>faction.buildings.TP.level; tp--) {
              ctx.fillRect(60+(tp-1)*30,280,25,50);
          }
          // 2.3. temples
          for (let te=faction.buildings.TE.max_level; te>faction.buildings.TE.level; te--) {
              ctx.beginPath();
              ctx.arc(269+(te-1)*45,305,21,0,2*Math.PI);
              ctx.fill();
          }
          // 2.4. stronghold
          if (faction.buildings.SH.max_level > 0 && faction.buildings.SH.level == 0) {
              ctx.fillRect(62,208,55,55);
          }
          // 2.5. sanctuary
          if (faction.buildings.SA.max_level > 0 & faction.buildings.SA.level == 0) {
              ctx.fillRect(245,215,60,40);
          }
          ctx.fillStyle = colors[faction.color] + 'ff';
          // 2.6. shipping
          if (faction.ship.max_level > 0) {
              let offset = 487;
              if (name == "mermaids") {
                  offset = 445;
              }
              let ship = faction.ship.level;
              ctx.beginPath();
              ctx.arc(offset+ship*28,237,10,0,2*Math.PI);
              ctx.fill();
          }
          // 2.7. digging
          if (faction.dig && faction.dig.max_level > 0) {
              let dig = faction.dig.level;
              ctx.beginPath();
              ctx.arc(519,151-dig*31,10,0,2*Math.PI);
              ctx.fill();
          }
          ctx.restore();
          // 2.8. stronghold action
          ctx.save();
          //ctx.fillStyle = colors[state.factions[name].color] + '99';
          ctx.fillStyle = '#000000' + '77';
          let factionAction = {
              'auren': 'ACTA',
              'chaosmagicians': 'ACTC',
              'giants': 'ACTG',
              'nomads': 'ACTN',
              'swarmlings': 'ACTS',
              'witches': 'ACTW',
          }
          if (name in factionAction && factionAction[name] in state.map) {
              factionBoardCanvas.id = 'action/' + factionAction[name];
              if (state.map[factionAction[name]].blocked == 1) {
                /*
                  ctx.beginPath();
                  ctx.arc(152,237,25,0,2*Math.PI); // getestet fuer ACTW
                  ctx.fill();
                */
                let actionTakenImg = new Image();
                actionTakenImg.src = urls.ACTTAKEN;
                actionTakenImg.onload = function (event) {
                  ctx.drawImage(actionTakenImg, 127, 212, 50, 50);
                };
              }
          }
          ctx.restore();
          // 2.9 power
          ctx.save();
          ctx.fillStyle = '#ffffff';
          ctx.font = '30px Arial';
          ctx.fillText(faction.P1, 75, 150);
          ctx.fillText(faction.P2, 75, 65);
          ctx.fillText(faction.P3, 200, 110);
          ctx.restore();
      }
      // 1. resources
      {
          let resourcesDiv = new Element('div');
          //resourcesDiv.style.width = (max_width - factionBoardCanvasWidth - 10) + 'px'; // same as faction board image
          //resourcesDiv.style.float = 'right';
          container.insert(resourcesDiv);
          // 1.1 coins
          let coinsDiv = new Element('span');
          coinsDiv.style['margin-right'] = '5px';
          resourcesDiv.appendChild(coinsDiv);
          let coins5 = Math.floor(faction.C / 5);
          let coins2 = Math.floor((faction.C - coins5*5) / 2);
          let coins1 = faction.C - coins5*5 - coins2*2;
          let coin5Img = new Element('img');
          coin5Img.src = urls.coin5;
          coin5Img.alt = '5c';
          coin5Img.style['max-height'] = '50px';
          coin5Img.style['margin-right'] = '2px';
          let coin2Img = new Element('img');
          coin2Img.src = urls.coin2;
          coin2Img.alt = '2c';
          coin2Img.style['max-height'] = '40px';
          coin2Img.style['margin-right'] = '2px';
          let coin1Img = new Element('img');
          coin1Img.src = urls.coin1;
          coin1Img.alt = '1c';
          coin1Img.style['max-height'] = '30px';
          coin1Img.style['margin-right'] = '2px';
          for (let f=0; f<coins5; f++) {
              coinsDiv.appendChild(coin5Img.cloneNode());
          }
          for (let f=0; f<coins2; f++) {
              coinsDiv.appendChild(coin2Img.cloneNode());
          }
          for (let f=0; f<coins1; f++) {
              coinsDiv.appendChild(coin1Img.cloneNode());
          }
          // 1.2 workers
          let workersDiv = new Element('span');
          workersDiv.style['margin-right'] = '5px';
          resourcesDiv.appendChild(workersDiv);
          let workerImg = new Element('img');
          workerImg.src = urls.worker;
          workerImg.alt = '1w';
          workerImg.height = '40';
          workerImg.style['margin-right'] = '3px';
          for (let f=0; f<faction.W; f++) {
              workersDiv.appendChild(workerImg.cloneNode());
          }
          // 1.3 priests
          let priestsDiv = new Element('span');
          resourcesDiv.appendChild(priestsDiv);
          let priestImg = new Element('img');
          priestImg.src = urls['priest_'+faction.color];
          priestImg.alt = '1p';
          priestImg.height = 45;
          for (let f=0; f<faction.P; f++) {
              priestsDiv.appendChild(priestImg.cloneNode());
          }
          // 1.4. table overview (resources & income)
          let income_id = "income-" + name;
          let income = new Element('table', {'class': 'income-table', 'id': income_id});
          resourcesDiv.insert(income);
          // 1.4.1. resources
          let row = new Element('tr');
          row.insert(new Element("td").updateText("Resources:"));
          row.insert(new Element("td").updateText("total"));
          row.insert(new Element("td").updateText(faction.C + " c"));
          row.insert(new Element("td").updateText(faction.W + " w"));
          row.insert(new Element("td").updateText(faction.P + " p"));
          row.insert(new Element("td").updateText(faction.P3 + " pw"));
          income.insert(row);
          // 1.4.2. income
          if (faction.income) {
              let row = new Element('tr');
              row.insert(new Element("td").updateText("Income:"));
              row.insert(new Element("td").updateText("total"));
              row.insert(new Element("td").updateText(faction.income.C + " c"));
              row.insert(new Element("td").updateText(faction.income.W + " w"));

              let P_class = '';
              if (faction.income.P > faction.MAX_P - faction.P) {
                  P_class = 'faction-info-income-overflow';
              }
              row.insert(new Element("td").insert(
                  makeTextSpan(faction.income.P + " p", P_class)));

              let PW_class = '';
              if (faction.income.PW > faction.P1 * 2 + faction.P2) {
                  PW_class = 'faction-info-income-overflow';
              }
              row.insert(new Element("td").insert(
                  makeTextSpan(faction.income.PW + " pw", PW_class))
              );
              row.insert(new Element('td').insert(
                  makeToggleLink("+", function() { toggleIncome(income_id); }))
              );
              income.insert(row);
          }
          // 1.4.3. income breakdown
          if (faction.income_breakdown) {
              income.insert(Element('tr', {'style': 'display: none'}).insert(
                  new Element("td", { colspan: 6 }).insert(
                      new Element("hr"))));
              $H(faction.income_breakdown).each(function(elem, ind) {
                  if (!elem.value) {
                      return;
                  }
                  let row = new Element('tr', {'style': 'display: none'});
                  row.insert(new Element("td"));
                  row.insert(new Element("td").updateText(elem.key));
                  row.insert(new Element("td").updateText(elem.value.C));
                  row.insert(new Element("td").updateText(elem.value.W));
                  row.insert(new Element("td").updateText(elem.value.P));
                  row.insert(new Element("td").updateText(elem.value.PW));
                  income.insert(row);
              });
              if (faction.passed == 0) {
                  let row = new Element('tr', {'style': 'display: none; color: #888;'});
                  row.insert(new Element("td"));
                  row.insert(new Element("td").updateText('bonus'));
                  row.insert(new Element("td").updateText('?'));
                  row.insert(new Element("td").updateText('?'));
                  row.insert(new Element("td").updateText('?'));
                  row.insert(new Element("td").updateText('?'));
                  income.insert(row);
              }
              income.insert(Element('tr', {'style': 'display: none'}).insert(
                  new Element("td", { colspan: 6 }).insert(
                      new Element("hr"))));
          }
          // 1.4.4. projected resources
          if (faction.income) {
              row = new Element('tr');
              row.insert(new Element("td").updateText("Next round:"));
              row.insert(new Element("td").updateText("total"));
              row.insert(new Element("td").updateText(faction.C + faction.income.C + " c"));
              row.insert(new Element("td").updateText(faction.W + faction.income.W + " w"));
              row.insert(new Element("td").updateText(faction.P + faction.income.P + " p"));
              let newP1 = faction.P1;
              let newP2 = faction.P2;
              let newP3 = faction.P3;
              for (let e=0; e<faction.income.PW; e++) {
                  if (newP1 > 0) {
                      newP1--;
                      newP2++;
                  } else if (newP2 > 0) {
                      newP2--;
                      newP3++;
                  }
              }
              row.insert(new Element("td").updateText(newP3 + " pw"));
              income.insert(row);
          }
      }
      // 3. status
      {
          let statusDiv = new Element('div');
          board.insert(statusDiv);
          // 3.1. victory points
          let vp_id = faction.name + "/vp";
          let link = makeToggleLink(faction.VP, function() { toggleVP(vp_id); });
          statusDiv.insert(link);
          statusDiv.insertTextSpan(" vp, ");
          // 3.2. priests available
          statusDiv.insertTextSpan((faction.MAX_P - faction.P) + " p available, ");
          // 3.3. bridges available
          statusDiv.insertTextSpan(faction.BRIDGE_COUNT + " bridges left");
          // 3.4. VP details (onclick)
          if (faction.vp_source) {
              let vp_breakdown = new Element('table', {'id': vp_id,
                                                       'style': 'display: none',
                                                       'class': 'vp-breakdown'});
              vp_breakdown.insert(new Element("tr").insert(
                  new Element("td", { colspan: 2 }).insert(
                      new Element("b").updateText("VP breakdown"))));
              $H(faction.vp_source).sortBy(function(a) { return -a.value}).each(function(record) {
                  let row = new Element("tr");
                  row.insert(new Element("td").updateText(record.key));
                  row.insert(new Element("td").updateText(record.value));
                  vp_breakdown.insert(row);
              });
              statusDiv.insert(vp_breakdown);
          }
          // 3.5. VP projection (round 6 only)
          if (faction.vp_projection) {
          var vp_proj_id = "vp-projection-" + name;
          var vp_proj = new Element('table', {'class': 'income-table', 'id': vp_proj_id});
          statusDiv.insert(vp_proj);
          {
        var row = new Element('tr');
              row.insert(new Element('td').updateText('VP projection:'));
              row.insert(new Element('td').updateText('total'));
              row.insert(new Element('td').updateText(faction.vp_projection.total));
              row.insert(new Element('td').insert(
                  makeToggleLink("+", function() { toggleIncome(vp_proj_id) })));
              vp_proj.insert(row);
          }

          vp_proj.insert(Element('tr', {'style': 'display: none'}).insert(
              new Element("td", { colspan: 3 }).insert(
                  new Element("hr"))));
          $H(faction.vp_projection).each(function(elem, ind) {
              if (!elem.value || elem.key == "total") {
                  return;
              }

              var row = new Element('tr', {'style': 'display: none'});
              row.insert(new Element("td"));
              row.insert(new Element("td").updateText(elem.key));
              row.insert(new Element("td").updateText(elem.value));
              vp_proj.insert(row);
          });
      }

      }
  }

  toggleIncome = function(id) {
      var table = $(id);

      table.childElements().each(function (elem, index) {
          if (index != 0 && index != 1 && index != table.childElements().length-1) {
              elem.style.display = (elem.style.display == 'none' ? '' : 'none');
          }
      });
  }

  renderColorCycle = function(faction, parent) {}

  /* tiles */
  drawScoringTiles = function() {

      scoringTileIds = [];
      for (x in state.ledger) {
        let y = state.ledger[x];
        if (y.comment) {
          let found = y.comment.match(/round ([1-6]) scoring: (score\d+),/i);
          if (found) {
            let round = found[1];
            let id = found[2];
            scoringTileIds[round-1] = id;
          }
        }
      }
      console.log(scoringTileIds);

      var container = $("scoring");
      container.width = 140;
      container.style.width = container.width + 'px';
      container.clearContent();

      scoringTileIds.push('scoring_final');

      let roundNum = 0;
      let curRound = state.round;
      scoringTileIds.each(function (elem) {
          roundNum++;
          console.log(elem);
          let img = new Image();
          let img_fg;
          if (roundNum < curRound || (roundNum == 6 && state.finished)) {
            img.src = urls.scoring_bg;
            img.onmouseover = function(event) {
              this.src = urls[elem];
            }
            img.onmouseout = function(event) {
              this.src = urls.scoring_bg;
            }
          } else {
            img.src = urls[elem];
          }
          img.width = 140;
          img.alt = elem;
          container.prepend(img);
      });
  }

  renderAction = function(canvas, name, key, border_color) {
      if (!canvas.getContext) return;
      let ctx = canvas.getContext("2d");
      let width = 145;
      let height = 73;
      canvas.width = width;
      canvas.height = height;
      canvas.style.width = width+'px';
      canvas.style.height = height+'px';
      canvas.style.padding = '5px';

      canvas.parentNode.style.height = height;

      let img = new Image();
      img.src = urls[key];
      img.onload = () => {
          ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, width, height);

          if (state.map[key] && state.map[key].blocked == 1) { // TODO
            let tileImgTaken = new Image();
            tileImgTaken.src = urls['ACTTAKEN'];
            tileImgTaken.onload = () => {
                ctx.drawImage(tileImgTaken, 78, 13, 49, 49);
            }
            // ctx.save();
            /*ctx.fillStyle = '#000000' + '77';
            ctx.beginPath();
            ctx.arc(101,39,25,0,2*Math.PI); // getestet fuer ACTW
            ctx.fill();
            ctx.restore();*/
          }
      };
  }

  renderTreasuryTile = function(board, faction, name, count) {
      if (count < 1) {
          return;
      }
      if (faction == 'pool') {
        board.style.width = max_width + 'px'; // because I don't know where else to put it
      }

      if (name.startsWith("ACT")) {
          // remove the ACT-tiles for faction-specific actions; (keep the power actions!)
          if (name.match(/ACT[A-Z]/i)) return;

          var elem = insertAction(board, name, name);
          if (state.actions[name] &&
              state.actions[name].show_if &&
              !state.factions[faction][state.actions[name].show_if]) {
              elem.hide();
          }
          return;
      } else if (name.startsWith("BON")) {
          board.insert(new Element('div', {'class': 'bonus', 'style': 'height:220px; width:70px;'}));
          let div = board.childElements().last();
          renderBonus(div, name, faction);
      } else if (name.startsWith("FAV")) {
          board.insert(new Element('div', {'class': 'favor', 'style': 'height:103px; width:130px;'}));
          let div = board.childElements().last();
          renderFavor(div, name, faction, count);
          return;
      } else if (name.startsWith("TW")) {
          board.insert(new Element('div', {'class': 'town', 'style': 'height:103px;'}));
          let div = board.childElements().last();
          renderTown(div, name, faction, count);
          return;
      }
  }

  renderTile = function(tile, name, record, faction, count) {
      tile.insertTextSpan(name);
      if (state.bonus_coins[name] && state.bonus_coins[name].C) {
          tile.insertTextSpan(" [#{C}c]".interpolate(state.bonus_coins[name]));
      }
      if (count > 1) {
          tile.insertTextSpan(" (x" + count + ")");
      }
      // hier kommt die sabine
      if (name in urls) {
          let imgDiv = new Element('div');
          tile.insert(imgDiv);
          let tileCanvas = new Element('canvas');
          if (['BON1', 'BON2', 'FAV6'].includes(name)) {
              tileCanvas.id = 'action/' + name + '/' + faction;
          }
          if (name.startsWith('BON') && faction == 'pool') {
              tileCanvas.id = 'action/PASS/' + name;
          }
          imgDiv.insert(tileCanvas);
          //tileCanvas.style = 'background: url(' + urls[name] + ')';
          let actionTakenHeight = 0;
          let actionTakenWidth = 0;
          if (name.startsWith('BON')) {
              tileCanvas.height = 205;
              tileCanvas.width = 68;
              actionTakenHeight = 50;
              actionTakenWidth = 50;
          } else if (name.startsWith('FAV')) {
              tileCanvas.height = 85;
              tileCanvas.width = 128;
              actionTakenHeight = 41;
              actionTakenWidth = 79;
          } else {
              alert(name);
          }
          let ctx = tileCanvas.getContext('2d');
          let tileImg = new Image();
          tileImg.src = urls[name];
          tileImg.onload = () => {
              ctx.drawImage(tileImg, 0, 0, tileCanvas.width, tileCanvas.height);
              // draw action-is-taken marker over image
              if (state.map[name + '/' + faction] && state.map[name + '/' + faction].blocked == 1) {
                let tileImgTaken = new Image();
                tileImgTaken.src = urls['ACTTAKEN'];
                tileImgTaken.onload = () => {
                    ctx.drawImage(tileImgTaken, 9, 39, actionTakenWidth, actionTakenHeight);
                }
                  /*ctx.fillStyle = '#000000' + '77';
                  ctx.beginPath();
                  ctx.arc(actionTakenWidth, actionTakenHeight, 25, 0, 2*Math.PI);
                  ctx.fill();*/
              }
          };
      }
  }

  renderTown = function(tile, name, faction, count) {
      if (count != 1) {
          tile.insertTextSpan(name + " (x" + count + ")");
      } else {
          tile.insertTextSpan(name);
      }
      // hier kommt die sabine
      if (name in urls) {
          let tileImg = new Element('img');
          tileImg.src = urls[name];
          tileImg.height = 90;
          let imgDiv = new Element('div');
          imgDiv.insert(tileImg);
          tile.insert(imgDiv);
      }
  }

  /* actions */
  markActionAsPossible = function(canvas, name, key) {
      if (!canvas.getContext) return;
      let ctx = canvas.getContext("2d");
      ctx.save();
      ctx.strokeStyle = colors.activeUI;
      ctx.lineWidth = 4;
      ctx.beginPath();

      if (name.match(/ACT[A-Z]/i)) { // faction action
          let left = 125;
          let top = 210;
          let right = 179;
          let bottom = 263;
          ctx.rect(left, top, right-left, bottom-top);
          ctx.stroke();
          canvas.addEventListener('click', function(event) {
              let position = canvas.getBoundingClientRect();
              let x = event.clientX - position.left;
              let y = event.clientY - position.top;
              // create context menu
              let title = "Special action";
              let loc = 'Action';
              let menu_items;
              if (left<x && x<right && top<y && y<bottom) {
                  switch (name) {
                      case "ACTA":
                      case "ACTC":
                      case "ACTG":
                      case "ACTS":
                      case "ACTW":
                          alert('This is not implemented yet!');
                          break;
                      case "ACTN":
                          title = "Sandstorm"; // top line of context menu
                          menu_items = {
                              "Terraform": { // button text
                                  "fun": function() { appendAndPreview('action ACTN'); }, // will be executed as fun(loc,key) after the menu closes
                                  "label": '', // text to display to the right of the button (typically costs)
                              }
                          };
                          break;
                  }
                  menuClickHandler(title, loc, menu_items)(loc, event);
              }
          }, false);

      } else if (name.startsWith('ACT')) { // shared action
          // TO DO: change rectangle to circle
          ctx.rect(0, 0, canvas.width, canvas.height);
          ctx.stroke();
      } else if (name.startsWith('BON')) {
          // TO DO: change rectangle to circle
          ctx.rect(0, 0, canvas.width, canvas.height);
          ctx.stroke();
      } else if (name.startsWith('FAV')) {
          // TO DO: change rectangle to circle
          ctx.rect(0, 0, canvas.width, canvas.height);
          ctx.stroke();
      } else if (name.startsWith('ADV')) {
          let left, right, top, bottom;
          let title, loc, menu_items;
          title = "Advance";
          let trackName;
          if (name == 'ADV1') {
              trackName = 'dig';
              left = 500;
              top = 70;
              right = 600;
              bottom = 195;
              loc = "Digging";
          } else if (name == 'ADV2') {
              trackName = 'ship';
              left = 430;
              top = 220;
              right = 600;
              bottom = 280;
              loc = "Shipping";
          }
          ctx.rect(left, top, right-left, bottom-top);
          ctx.stroke();
          let factionName = key.substring(5); // e.g., key = 'ADV1/nomads'
          let faction = state.factions[factionName];
          menu_items = {
                  "Advance": {
                      "fun": function() { appendAndPreview('advance '+trackName); },
                      "label": effectString([ faction[trackName].advance_cost ], [ faction[trackName].advance_gain[faction[trackName].level] ]),
                  }
              };
          canvas.addEventListener('click', function(event) {
              let position = canvas.getBoundingClientRect();
              let x = event.clientX - position.left;
              let y = event.clientY - position.top;
              // create context menu
              if (left<x && x<right && top<y && y<bottom) {
                  menuClickHandler(title, loc, menu_items)(loc, event);
              }
          });
      } else if (name.startsWith('PASS')) {
          ctx.rect(0, 0, canvas.width, canvas.height);
          ctx.stroke();
          let tileName = key.substring(5); // e.g., key = PASS/BON2
          let menu_items = {
              "Pass": {
                  "fun": function() { appendAndPreview('pass ' + tileName); },
                  "label": (state.bonus_coins[tileName].C > 0 ? '+#{C}C, '.interpolate(state.bonus_coins[tileName]) : '') + tileLabel(state.bonus_tiles[tileName]),
              }
          };
          canvas.addEventListener('click', function(event) {
              menuClickHandler(tileName, "Pass & choose", menu_items)("Pass & choose", event);
          });
      } else if (name.startsWith('CONV')) {
        let left = 191;
        let right = 245;
        let top = 132;
        let bottom = 199;
        ctx.rect(left, top, right-left, bottom-top);
        ctx.stroke();
        canvas.addEventListener('click', function(event) {
          let position = canvas.getBoundingClientRect();
          let x = event.clientX - position.left;
          let y = event.clientY - position.top;
          //alert('x='+x+', y='+y);
          if (left<x && x<right && top<y && y<bottom) {
              let factionName = key.substring(5); // e.g., key = 'CONV/nomads'
              let faction = state.factions[factionName];
              let menu_items = {};
              var rates = $H(faction.exchange_rates);
                // usually {W: {C: 1}, P: {W: 1, C: 1}, PW: {P: 5, W: 3, C: 1}, C: {VP: 3}}
              rates.sortBy(naturalSortKey).reverse().each(function (from_elem) {
                  var from = from_elem.key;
                  var from_type = from;
                  var to = $H(from_elem.value);
                  to.sortBy(naturalSortKey).reverse().each(function (to_elem) {
                      var to_type = to_elem.key;
                      var rate = to_elem.value;
                      if (faction[from] >= rate) {
                          convert_possible = true;
                          for (let i = 1; rate * i <= faction[from_type] && i < 10; i++) {
                              let command = 'Convert ' + (i*rate) + from_type + ' to ' + i + to_type;
                              menu_items[command] = {
                                  "fun": () => { appendAndPreview(command); },
                                  "label": '',
                              };
                          }
                      }
                  });
              });
              menuClickHandler("Convert", "Resources", menu_items)("Resources", event);
          }
        });
      }
      ctx.restore();
  }

  let addAdvanceToMovePicker_ = addAdvanceToMovePicker;
  addAdvanceToMovePicker = function(picker, faction){
      let row = addAdvanceToMovePicker_(picker, faction);
      let canvas = document.getElementById(faction.name).getElementsByTagName('canvas')[0];
      if (faction.allowed_actions) {
          if (canAfford(faction, [faction.dig.advance_cost], 1)) {
              markActionAsPossible(canvas, "ADV1", "ADV1/"+faction.name);
          }
          if (canAfford(faction, [faction.ship.advance_cost], 1)) {
              markActionAsPossible(canvas, "ADV2", "ADV2/"+faction.name);
          }
      }
      return row;
  }

  let addPassToMovePicker_ = addPassToMovePicker;
  addPassToMovePicker = function(picker, faction) {
      let row = addPassToMovePicker_(picker, faction);
      for (tile in state.pool) {
        if (tile.startsWith('BON') && state.pool[tile] == '1') {
          let canvas = document.getElementById('action/PASS/' + tile);
          if (faction.allowed_actions) {
            markActionAsPossible(canvas, "PASS", "PASS/" + tile);
          }
        }
      }
      return row;
  }

  let addConvertToMovePicker_ = addConvertToMovePicker;
  addConvertToMovePicker = function(picker, faction) {
      let row = addConvertToMovePicker_(picker, faction);
      let canvas = document.getElementById(faction.name).getElementsByTagName('canvas')[0];
      if (faction.allowed_actions) {
        markActionAsPossible(canvas, "CONV", "CONV/" + faction.name);
      }
      return row;
  }

  /* init */
  init_mod = function(root) {
    root.innerHTML = ' \
    <table style="border-style: none" id="main-data"> \
      <tr> \
        <td rowspan=3> \
          <div id="scoring" style="width:90px"></div> \
        <td> \
          <div id="map-container"> \
            <canvas id="map" width="1600" height="1000"> \
              Browser not supported. \
            </canvas> \
          </div> \
        <td> \
          <div id="cult-container"> \
            <canvas id="cults" width="500" height="1000"> \
              Browser not supported. \
            </canvas> \
          </div> \
      <tr> \
        <td> \
        <td> <a style="color: black" href="#" onclick="toggleColorBlindMode()">Toggle color blind mode</a> \
      <tr> \
        <td colspan=2> \
          <div style="display: inline-block; vertical-align: top"> \
            <div id="shared-actions"></div> \
            <div id="turn-order"></div> \
          </div> \
    </table> \
    <div id="menu" class="menu" style="display: none"></div> \
    <div id="preview_status"></div> \
    <pre id="preview_commands"></pre> \
    <div id="error"></div> \
    <div id="action_required"></div> \
    <div id="next_game"></div> \
    <div id="data_entry"></div> \
    <div id="factions"></div> \
    <table id="ledger"> \
      <col></col> \
      <col span=2 ></col> \
      <col span=2 style="background-color: #e0e0f0"></col> \
      <col span=2 ></col> \
      <col span=2 style="background-color: #e0e0f0"></col> \
      <col span=2 ></col> \
      <col span=2 style="background-color: #e0e0f0"></col> \
    </table>';

    $('header').style['max-width'] = max_width + 'px';
    $('action_required').style['max-width'] = max_width + 'px';

    preview();
  }
}
