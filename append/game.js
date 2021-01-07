
  var drawFaction_orig = drawFaction;
  var drawFaction_mod;
  drawFaction_mod = function(name) {
    let faction = state.factions[name];
    let color = faction.color;
    let container = new Element('div', { class: 'faction-board' });
    container.id = faction.name;
    let title = factionDisplayName(faction);
    if (faction.passed) {
      container.style.opacity = '0.5';
      title = new Element("span").insert(title).insert(
          makeTextSpan(", passed"));
    }
    if (faction.dropped) {
      container.style.opacity = '0.25';
      title = new Element("span").insert(title).insert(
          makeTextSpan(", dropped"));
    }
    if (faction.start_player) {
      title = new Element("span").insert(title).insert(
          makeTextSpan(", start player"));
    }
    let header = new Element('div');
    header.style.padding = '1px 1px 1px 1px';
    header.style['margin-bottom'] = '5px';
    header.style['background-color'] = colors[color];
    header.style.color = contrastColor[color];
    header.insert(title);
    container.insert(header);
    if (!faction.placeholder) {
      drawRealFaction_mod(faction, container);
    }

    renderTreasury(container, faction, name);

    $("factions").insert(container);

  }
  drawFaction = function(name) {
    let implementedFactions = [
      'alchemists',
      'auren',
      'chaosmagicians',
      'cultists',
      'darklings',
      'dwarves',
      'engineers',
      'fakirs',
      'giants',
      'halflings',
      'mermaids',
      'nomads',
      'swarmlings',
      'witches',
    ]
    if (implementedFactions.includes(name)) {
      drawFaction_mod(name);
    } else {
      drawFaction_orig(name);
    }
  }

  /* faction board */
  var drawRealFaction_mod = function(faction, container) {
      let name = faction.name;
      let factionBoardCanvasWidth = 620;
      let factionBoardCanvasHeight = 399;
      // faction board
      {
          let factionBoardCanvas = new Element('canvas');
          container.insert(factionBoardCanvas);
          //factionBoardCanvas.style.float = 'left';
          factionBoardCanvas.style.background = 'url(' + urls['faction_'+name] + ')';
          factionBoardCanvas.style.opacity = 1;
          factionBoardCanvas.style.float = 'left';
          factionBoardCanvas.style['margin-right'] = '20px';
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
          //ctx.fillStyle = '#000000' + '77';
          let factionAction = {
              'auren': 'ACTA',
              'chaosmagicians': 'ACTC',
              'engineers': 'ACTE',
              'giants': 'ACTG',
              'nomads': 'ACTN',
              'swarmlings': 'ACTS',
              'witches': 'ACTW',
          }
          if (name in factionAction) {
              factionBoardCanvas.id = 'action/' + factionAction[name];
              if (factionAction[name] in state.map && state.map[factionAction[name]].blocked == 1) {
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
      // resources
      {
          let resourcesDiv = new Element('div');
          container.insert(resourcesDiv);
          // 1.1 coins
          {
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
          }
          // 1.2 workers
          {
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
          }
          // 1.3 priests
          {
            let priestsDiv = new Element('span');
            resourcesDiv.appendChild(priestsDiv);
            let priestImg = new Element('img');
            priestImg.src = urls['priest_'+faction.color];
            priestImg.alt = '1p';
            priestImg.height = 45;
            for (let f=0; f<faction.P; f++) {
                priestsDiv.appendChild(priestImg.cloneNode());
            }
          }
          // 1.4. table overview (resources & income)
          let income_id = "income-" + name;
          let income = new Element('table', {'class': 'income-table', 'id': income_id});
          resourcesDiv.insert(income);

          function styleDisplayNone(className, prop) {
            prop = prop || {};
            prop.class = className;
            prop.style = prop.style || '';
            if (prop.style.length > 0 && !prop.style.trim().substr(-1) == ';') {
              prop.style += ';';
            }
            prop.style += 'display: none;';
            return prop;
          }
          function styleAlignRight(prop) {
            prop = prop || {};
            prop.style = prop.style || '';
            if (prop.style.length > 0 && !prop.style.trim().substr(-1) == ';') {
              prop.style += ';';
            }
            prop.style += 'text-align: right';
            return prop;
          }

          let row;
          let vp_breakdown_id;
          // 1.4.1. resources
          {
            row = new Element('tr');
            row.insert(new Element("td").updateText("Resources:"));
            row.insert(new Element("td").updateText("total"));
            row.insert(new Element("td", styleAlignRight()).updateText(faction.C + " c"));
            row.insert(new Element("td", styleAlignRight()).updateText(faction.W + " w"));
            row.insert(new Element("td", styleAlignRight()).updateText(faction.P + " p"));
            row.insert(new Element("td", styleAlignRight()).updateText(faction.P3 + " pw"));
            vp_breakdown_id = faction.name + "-vp";
            row.insert(new Element("td", styleAlignRight()).updateText(faction.VP + " vp "));
            let vp_link = makeToggleLink('+', function() { toggleVP_mod(vp_breakdown_id); });
            row.insert(new Element('td').insert(vp_link));
            row.insert(new Element("td", {'style': 'color: #888;'}).updateText((faction.MAX_P - faction.P) + " p"));
            row.insert(new Element("td", {'style': 'color: #888;'}).updateText(faction.BRIDGE_COUNT + " b"));
            income.insert(row);
          }
          // vp source
          if (faction.vp_source) {
              let vp_breakdown = income;
              let hr = new Element("tr", styleDisplayNone(vp_breakdown_id)).insert(
                new Element("td")).insert(
                new Element("td", {colspan: 6}).insert(
                new Element("hr")));
              vp_breakdown.insert(hr);
              $H(faction.vp_source).sortBy(function(a) { return -a.value}).each(function(record) {
                  row = new Element("tr", styleDisplayNone(vp_breakdown_id));
                  row.insert(new Element("td"));
                  row.insert(new Element("td", {colspan: 5}).updateText(record.key));
                  row.insert(new Element("td", styleAlignRight()).updateText(record.value+' vp'));
                  vp_breakdown.insert(row);
              });
              vp_breakdown.insert(hr.cloneNode(true));
          }
          // gain when passing
          let pass_id;
          let pass_income = {};
          if (faction.passed == 0 && !state.finished == 1) {
            // calculate sources of pass-vp
            ['BON6', 'BON7', 'BON9', 'BON10', 'FAV12'].forEach( elem => {
                if (elem in faction && faction[elem] == '1') {
                  pass_income[elem] = pass_income[elem] || {};
                  pass_income[elem].vp = pass_income[elem].vp || 0;
                  let type;
                  switch (elem.slice(0,3)) {
                    case "BON":
                      type = 'bonus_tiles';
                      break;
                    case "FAV":
                      type = 'favors';
                      break;
                  }
                  let passvp = state[type][elem].pass_vp;
                  for (let vpSource in passvp) {
                    let playerHas;
                    if (vpSource == 'ship') {
                      playerHas = faction[vpSource].level;
                    } else if (vpSource in faction.buildings) {
                      playerHas = faction.buildings[vpSource].level;
                    }
                    let gainVp = passvp[vpSource][playerHas];
                    pass_income[elem].vp += gainVp;
                  }
                }
            });
            if (faction.name == "engineers" && faction.buildings.SH.level == 1) {
              let bridge_vp = 0;
              for (let i=0; i<state.bridges.length; i++) {
                let b = state.bridges[i];
                if (b.color == "gray") {
                  let hexagon1 = state.map[b.from];
                  let hexagon2 = state.map[b.to];
                  if (hexagon1.color == "gray" && hexagon1.building && hexagon2.color == "gray" && hexagon2.building) {
                    bridge_vp += 3;
                  }
                }
              }
              pass_income.SH = pass_income.SH || {};
              pass_income.SH.vp = bridge_vp;
            }
            // output
            if (Object.keys(pass_income).length > 0) {
              let pass_income_total = {};
              for (let s in pass_income) {
                for (let r in pass_income[s]) {
                  pass_income_total[r] = pass_income_total[r] || 0;
                  pass_income_total[r] += pass_income[s][r];
                }
              }
              row = new Element('tr');
              row.insert(new Element('td').updateText("Passing:"));
              row.insert(new Element('td').updateText('total'));
              ['C', 'W', 'P', 'PW', 'vp'].forEach(r => {
                let cell = new Element('td', styleAlignRight());
                if (pass_income_total[r]) {
                  cell.updateText(pass_income_total[r] + ' ' + r.toLowerCase());
                }
                row.insert(cell);
              });
              pass_id = faction.name + '-pass';
              let pass_link = makeToggleLink('+', function() { toggleVP_mod(pass_id); });
              row.insert(new Element('td').insert(pass_link));
              income.insert(row);
            }
          }
          // passing VP details
          if (faction.passed == 0 && Object.keys(pass_income).length > 0) {
            let hr = new Element('tr', styleDisplayNone(pass_id)).insert(
                new Element('td')).insert(
                new Element("td", { colspan: 6 }).insert(
                    new Element("hr")));
            income.insert(hr);
            for (let source in pass_income) {
              row = new Element('tr', styleDisplayNone(pass_id));
              row.insert(new Element('td'));
              row.insert(new Element('td').updateText(source));
              ['C', 'W', 'P', 'PW', 'vp'].forEach(r => {
                let cell = new Element('td', styleAlignRight());
                if (pass_income[source][r]) {
                  cell.updateText(pass_income[source][r] + ' ' + r.toLowerCase());
                }
                row.insert(cell);
              });
              income.insert(row);
            }
            income.insert(hr.cloneNode(true));
          }
          // vp projection (round 6 only)
          if (faction.vp_projection) {
              let vp_proj_id = "vp-projection-" + name;
              let vp_proj = income;
              row = new Element('tr');
              row.insert(new Element('td').updateText('VP projection:'));
              row.insert(new Element('td', {colspan: 5}).updateText('total'));
              row.insert(new Element('td', styleAlignRight()).updateText(faction.vp_projection.total + ' vp'));
              row.insert(new Element('td').insert(makeToggleLink("+", function() { toggleVP_mod(vp_proj_id) })));
              vp_proj.insert(row);

              let hr = Element('tr', styleDisplayNone(vp_proj_id)).insert(
                new Element("td")).insert(
                  new Element("td", { colspan: 6 }).insert(
                      new Element("hr")))
              vp_proj.insert(hr);
              ['FIRE', 'WATER', 'EARTH', 'AIR'].forEach(cult => {
                let row = new Element('tr', styleDisplayNone(vp_proj_id));
                row.insert(new Element("td"));
                row.insert(new Element("td", {colspan: 5}).updateText(cult));
                let cultScore = faction.vp_projection[cult] || 0;
                row.insert(new Element("td", styleAlignRight()).updateText(cultScore + ' vp'));
                vp_proj.insert(row);
              });
              [
                'network',
                'connected-clusters',
                'connected-distance',
                'building-on-edge',
                'connected-sa-sh-distance'
              ].forEach(score => {
                if (faction.vp_projection[score]) {
                  let match = faction.vp_projection[score].match(/([0-9]+) (\[.+\])/);
                  let vp = match[1];
                  let size = match[2];
                  let row = new Element('tr', styleDisplayNone(vp_proj_id));
                  row.insert(new Element("td"));
                  row.insert(new Element("td", {colspan: 5}).updateText(score + ' ' + size));
                  row.insert(new Element("td", styleAlignRight()).updateText(vp + ' vp'));
                  vp_proj.insert(row);
                }
              });
              if (faction.vp_projection.resources) {
                let row = new Element('tr', styleDisplayNone(vp_proj_id));
                row.insert(new Element("td"));
                row.insert(new Element("td", {colspan: 5}).updateText('resources'));
                row.insert(new Element("td", styleAlignRight()).updateText(faction.vp_projection.resources + ' vp'));
                vp_proj.insert(row);
              }
              vp_proj.insert(hr.cloneNode(true));
          }
          // 1.4.2. income
          if (faction.income) {
              row = new Element('tr');
              row.insert(new Element("td").updateText("Income:"));
              row.insert(new Element("td").updateText("total"));
              row.insert(new Element("td", styleAlignRight()).updateText(faction.income.C + " c"));
              row.insert(new Element("td", styleAlignRight()).updateText(faction.income.W + ' w'));
              let P_class = '';
              if (faction.income.P > faction.MAX_P - faction.P) {
                  P_class = 'faction-info-income-overflow';
              }
              row.insert(new Element("td", styleAlignRight()).insert(
                  makeTextSpan(
                    faction.income.P + " p",
                    P_class)));
              let PW_class = '';
              if (faction.income.PW > faction.P1 * 2 + faction.P2) {
                  PW_class = 'faction-info-income-overflow';
              }
              row.insert(new Element("td", styleAlignRight()).insert(
                  makeTextSpan(
                    faction.income.PW + " pw",
                    PW_class))
              );
              row.insert(new Element("td"));
              row.insert(new Element('td').insert(
                  makeToggleLink("+", function() { toggleVP_mod(income_id); }))
              );
              income.insert(row);
          }
          // 1.4.3. income breakdown
          if (faction.income_breakdown) {
              let hr = Element('tr', styleDisplayNone(income_id)).insert(new Element('td')).insert(
                  new Element("td", { colspan: 6 }).insert(
                      new Element("hr")))
              income.insert(hr);
              $H(faction.income_breakdown).each(function(elem, ind) {
                  if (!elem.value) {
                      return;
                  }
                  row = new Element('tr', styleDisplayNone(income_id));
                  row.insert(new Element("td"));
                  row.insert(new Element("td").updateText(elem.key));
                  row.insert(new Element("td", styleAlignRight()).updateText(elem.value.C + ' c'));
                  row.insert(new Element("td", styleAlignRight()).updateText(elem.value.W + ' w'));
                  row.insert(new Element("td", styleAlignRight()).updateText(elem.value.P + ' p'));
                  row.insert(new Element("td", styleAlignRight()).updateText(elem.value.PW + ' pw'));
                  income.insert(row);
              });
              if (faction.passed == 0) {
                  row = new Element('tr', {'class': income_id, 'style': 'display: none; color: #888;'});
                  row.insert(new Element("td"));
                  row.insert(new Element("td").updateText('bonus'));
                  row.insert(new Element("td", styleAlignRight()).updateText('? c'));
                  row.insert(new Element("td", styleAlignRight()).updateText('? w'));
                  row.insert(new Element("td", styleAlignRight()).updateText('? p'));
                  row.insert(new Element("td", styleAlignRight()).updateText('? pw'));
                  income.insert(row);
              }
              income.insert(hr.cloneNode(true));
          }
          // 1.4.4. projected resources (rounds 0-5 only)
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
  }

  toggleVP_mod = function(className) {
      let tds = document.getElementsByClassName(className);
      let elems = Array.prototype.slice.call(tds);
      elems.forEach(elem => {
        elem.style.display = (elem.style.display == 'none' ? '' : 'none');
      });
  }

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

      var container = $("scoring");
      container.width = 140;
      container.style.width = container.width + 'px';
      container.clearContent();

      scoringTileIds.push('scoring_final');

      for (let x of [
        'connected-distance',
        'connected-sa-sh-distance',
        'building-on-edge',
        'connected-clusters'
      ]) {
        if (state.final_scoring && state.final_scoring[x]) {
          let newkey = x.replace(/-/g, '_');
          newkey = 'scoring_final_' + newkey;
          scoringTileIds.push(newkey);
          break;
        }
      }

      let roundNum = 0;
      scoringTileIds.each(function (elem) {
          roundNum++;
          let img = new Image();
          img.width = 140;
          if (roundNum < 7) {
            img.height = 78;
          }
          img.alt = elem;
          img.src = urls[elem];
          img.setAttribute('data-round', roundNum);
          if (img.src.substr(-3) == 'svg') {
              // new code for svgs
              img.onload = function() {
                SVGInject(this, {
                  afterInject: function(img, svg) {
                    fixSvgImageUrl(svg);
                    let backgroundLayer;
                    let lastRoundLayer;
                    // get layers
                    let layers = svg.getElementsByTagName('g');
                    for (let i in layers) {
                      let layerId = layers[i].id;
                      if (layerId && layerId.startsWith('RoundOver')) {
                        backgroundLayer = layers[i];
                      }
                      if (layerId && layerId.startsWith('LastRound')) {
                        lastRoundLayer = layers[i];
                      }
                      if (backgroundLayer && lastRoundLayer) {
                        break;
                      }
                    }
                    // mouse over
                    if (img.dataset.round < state.round || (img.dataset.round == 6 && state.finished)) {
                        showSvgLayer(backgroundLayer);
                        svg.onmouseover = function() {
                            hideSvgLayer(backgroundLayer);
                        }
                        svg.onmouseout = function() {
                            showSvgLayer(backgroundLayer);
                        }
                    } else {
                        hideSvgLayer(backgroundLayer);
                    }
                    // don't show cult income for round 6
                    if (img.dataset.round == 6) {
                        showSvgLayer(lastRoundLayer);
                    } else {
                        hideSvgLayer(lastRoundLayer);
                    }
                  }
                });
              };
          } else {
              // old code for pngs
              if (roundNum < state.round || (roundNum == 6 && state.finished)) {
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
              if (roundNum == 6) {
                  // not possible, use svg instead
              }
          }
          container.prepend(img);
      });
  }

  insertAction = function(parent, name, key) {
      var container = new Element('img', {
          'id': 'action/' + key, 'class': 'action', 'width': 100, 'height': 170});
      parent.insert(container);
      renderAction(container, name, key, '#000');
      return container;
  }

  renderAction = function(container, name, key, border_color) {
      let width = 145;
      let height = 73;
      container.width = width;
      container.height = height;
      container.style.width = width+'px';
      container.style.height = height+'px';
      container.style.padding = '5px';

      container.parentNode.style.height = height;

      container.src = urls[key];
      container.onload = function() {
        SVGInject(this, {
          afterInject: function(img, svg) {
            fixSvgImageUrl(svg);
            let actionTakenLayer;
            // get layers
            let layers = svg.getElementsByTagName('g');
            for (let i in layers) {
              let layerId = layers[i].id;
              if (layerId && layerId.startsWith('ActionTaken')) {
                actionTakenLayer = layers[i];
                break;
              }
            }
            if (actionTakenLayer) {
              // show or hide action taken token
              if (state.map[key] && state.map[key].blocked == 1) {
                showSvgLayer(actionTakenLayer);
                svg.onmouseover = function() {
                    hideSvgLayer(actionTakenLayer);
                }
                svg.onmouseout = function() {
                    showSvgLayer(actionTakenLayer);
                }
              } else {
                hideSvgLayer(actionTakenLayer);
              }
            }
          }
        });
      };
  }

  renderTreasuryTile = function(board, faction, name, count) {
      if (count < 1) {
          return;
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
          let tileDiv = new Element('div', {class: 'bonus'});
          board.insert(tileDiv);
          let div = board.childElements().last();
          renderBonus(div, name, faction);
      } else if (name.startsWith("FAV")) {
          let tileDiv = new Element('div', {class: 'favor'});
          board.insert(tileDiv);
          let div = board.childElements().last();
          renderFavor(div, name, faction, count);
      } else if (name.startsWith("TW")) {
        let renderCount;
        if (faction == 'pool') {
          renderCount = 1;
        } else {
          renderCount = count;
        }
        for (let i=0; i<renderCount; i++) {
          let tileDiv = new Element('div', {class: 'town'});
          board.insert(tileDiv);
          let div = board.childElements().last();
          renderTown(div, name, faction, count);
        }
      }
  }

  renderBonus = function(div, name, faction) {
    let nameSpan = new Element('div');
    let nameText = name;
    if (state.bonus_coins[name] && state.bonus_coins[name].C) {
        nameText += " [#{C}c]".interpolate(state.bonus_coins[name]);
    }
    nameSpan.updateText(nameText);
    div.insert(nameSpan);

    if (name in urls) {
        let tileImg;
        tileImg = new Element('img');
        tileImg.src = urls[name];
        tileImg.height = 230;
        tileImg.width = 80;
        if (name == 'BON1') {

          if (state.map[name + '/' + faction] && state.map[name + '/' + faction].blocked == 1) {
            tileImg.class = "action_possible"
          } else {
            tileImg.class = "action_taken"
          }
          tileImg.onload = function() {
            SVGInject(this, {
              afterInject: function(img, svg) {
                fixSvgImageUrl(svg);
              }
            });
          };

        } else {
          tileImg.onload = function() {
            SVGInject(this, {
              afterInject: function(img, svg) {
                fixSvgImageUrl(svg);
                let actionTakenLayer;
                // get action-taken layer
                let layers = svg.getElementsByTagName('g');
                for (let i in layers) {
                  if (layers[i].id && layers[i].id.startsWith('ActionTaken')) {
                    actionTakenLayer = layers[i];
                    break;
                  }
                }
                if (actionTakenLayer) {
                  // mouse over actions
                  if (state.map[name + '/' + faction] && state.map[name + '/' + faction].blocked == 1) {
                    showSvgLayer(actionTakenLayer);
                    svg.onmouseover = function() {
                      hideSvgLayer(actionTakenLayer);
                    };
                    svg.onmouseout = function() {
                      showSvgLayer(actionTakenLayer);
                    }
                  } else {
                    hideSvgLayer(actionTakenLayer);
                  }
                }
              }
            });
          };
        }
        if (faction == 'pool') {
          tileImg.id = 'action/PASS/' + name;
          tileImg.class = tileImg.class + " " + "pass_possible";
        } else if (['BON1', 'BON2'].includes(name)) {
          tileImg.id = 'action/' + name + '/' + faction;
        }
        div.insert(tileImg);
    }
  }

  renderFavor = function(div, name, faction, count) {
    let nameSpan = new Element('div');
    nameSpan.style.position = 'absolute';
    let nameText = name;
    if (count > 1) {
        nameText += " (x" + count + ")";
    }
    nameSpan.updateText(nameText);
    if (name in urls) {
        let tileImg;
        tileImg = new Element('img');
        tileImg.src = urls[name];
        tileImg.style.float = 'left';
        tileImg.height = 110;
        tileImg.width = 165;
        tileImg.onload = function() {
          SVGInject(this, {
            afterInject: function(img, svg) {
              fixSvgImageUrl(svg);
              let actionTakenLayer;
              // get action-taken layer
              let layers = svg.getElementsByTagName('g');
              for (let i in layers) {
                if (layers[i].id && layers[i].id.startsWith('ActionTaken')) {
                  actionTakenLayer = layers[i];
                  break;
                }
              }
              if (actionTakenLayer) {
                // mouse over actions
                if (state.map[name + '/' + faction] && state.map[name + '/' + faction].blocked == 1) {
                  showSvgLayer(actionTakenLayer);
                  svg.onmouseover = function() {
                    hideSvgLayer(actionTakenLayer);
                  };
                  svg.onmouseout = function() {
                    showSvgLayer(actionTakenLayer);
                  }
                } else {
                  hideSvgLayer(actionTakenLayer);
                }
              }
            }
          });
        };
        if (['FAV6'].includes(name) && faction != 'pool') {
            tileImg.id = 'action/' + name + '/' + faction;
        }
        div.insert(tileImg);
    }
    div.insert(nameSpan);
  }

  renderTown = function(tile, name, faction, count) {
    let nameSpan = new Element('div');
    nameSpan.style.position = 'absolute';
    let nameSpanText = name;
    if (faction == 'pool' && count > 1) {
      nameSpanText += " (x" + count + ")";
    }
    nameSpan.updateText(nameSpanText);

    if (name == 'TW7') {
      let username = document.cookie.match(/session-username=([A-Za-z0-9._-]+)/);
      username = (username ? username[1] : '');
      if (faction == 'fakirs' || (faction == 'pool' && 'fakirs' in state.factions && state.factions.fakirs.username == username)) {
        name += '_carpet';
      } else {
        name += '_ship';
      }
    }
    if (name in urls) {
        let tileImg = new Element('img');
        tileImg.style.float = 'left';
        tileImg.src = urls[name];
        tileImg.height = 110;
        tileImg.width = 110;
        tileImg.onload = function() {
          SVGInject(this, {
            afterInject: function(img, svg) {
              fixSvgImageUrl(svg);
            }
          });
        };
        tile.insert(tileImg);
    }
    tile.insert(nameSpan);
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
        let left, top, right, bottom;
        if (name == 'ACTE') { // bottom-right action
          left = 424;
          top = 284;
          right = 607;
          bottom = 387;
        } else { // stronghold action
          left = 125;
          top = 210;
          right = 179;
          bottom = 263;
        }
          ctx.rect(left, top, right-left, bottom-top);
          ctx.stroke();
          canvas.addEventListener('click', function(event) {
              let position = canvas.getBoundingClientRect();
              let x = event.clientX - position.left;
              let y = event.clientY - position.top;
              // alert('x='+x+', y='+y);
              // create context menu
              let title = "Special action";
              let loc = 'Action';
              let menu_items;
              if (left<x && x<right && top<y && y<bottom) {
                  switch (name) {
                      case "ACTA":
                          title = "Advance 2 spaces on 1 cult track";
                          menu_items = {
                            "Advance": {
                                "fun": function() { appendAndPreview('action ACTA'); },
                                "label": '',
                            }
                          };
                          break;
                      case "ACTC":
                          title = "Double turn";
                          menu_items = {
                              "Take a double turn": {
                                  "fun": function() { appendAndPreview('action ACTC'); },
                                  "label": '',
                              }
                          };
                          break;
                      case "ACTG":
                          title = "Terraform";
                          menu_items = {
                              "Get 2 spades": {
                                  "fun": function() { appendAndPreview('action ACTG'); },
                                  "label": '',
                              }
                          };
                          break;
                      case "ACTS":
                          title = "Upgrade to TP";
                          menu_items = {
                              "Upgrade to TP": {
                                  "fun": function() { appendAndPreview('action ACTS'); },
                                  "label": '',
                              }
                          };
                          break;
                      case "ACTE":
                          let actionData = state.actions.ACTE;
                          title = "Bridge";
                          menu_items = {
                              "Place bridge": {
                                  "fun": function() { appendAndPreview('action ACTE'); },
                                  "label": effectString(actionData.cost, actionData.gains),
                              }
                          };
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
                      case "ACTW":
                          title = "Witches' Ride";
                          menu_items = {
                              "Place dwelling": {
                                  "fun": function() { appendAndPreview('action ACTW'); },
                                  "label": '',
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
                              let label = new Element('span');
                              let getImg = {'C': urls.coin1, 'W': urls.worker, 'P': urls['priest_'+faction.color], 'PW': urls.power};
                              for (let fromCounter=0; fromCounter<i*rate; fromCounter++) {
                                let img = new Image();
                                img.src = getImg[from_type];
                                img.height = 10;
                                label.insert(img);
                              }
                              label.insert(new Element('span').updateText(' -> '));
                              for (let toCounter=0; toCounter<i; toCounter++) {
                                let img = new Image();
                                img.src = getImg[to_type];
                                img.height = 10;
                                label.insert(img);
                              }
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
          if (faction.dig && (faction.dig.level < faction.dig.max_level) && faction.dig.advance_cost && canAfford(faction, [faction.dig.advance_cost], 1)) {
              markActionAsPossible(canvas, "ADV1", "ADV1/"+faction.name);
          }
          if (faction.ship && (faction.ship.level < faction.ship.max_level) && faction.ship.advance_cost && canAfford(faction, [faction.ship.advance_cost], 1)) {
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

  addTakeTileButtons = function(parent, index, prefix, id) {
      var div = new Element("div", { "id": "leech-" + index + "-" + id,
                                     "style": "padding-left: 2em" });
      var count = 0;
      $H(state.pool).sortBy(naturalSortKey).each(function(tile) {
          if (tile.value < 1 || !tile.key.startsWith(prefix)) {
              return;
          }

          if (prefix == "FAV" &&
              state.factions[currentFaction] &&
              state.factions[currentFaction][tile.key] > 0) {
              return;
          }

          var container = new Element("div", {"style": "display: inline-block"});

          var button = new Element("button").updateText(tile.key);
          button.onclick = function() {
              gainResource(index, '', tile.key, id);
          };
          container.insert(button);
          container.insert(new Element("br"));

          renderTreasuryTile(container, 'pool',
                             tile.key, state.pool[tile.key]);

          div.insert(container);
          ++count;
      });
      if (prefix == "FAV" && count == 0) {
          var container = new Element("div", {"style": "display: inline-block"});
          div.insert(container);
          container.insert(makeDeclineButton("GAIN_FAVOR", 1));
      }
      parent.insert(div);
  }


  /* init */
  init = function(root) {
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
        <td colspan=2> \
          <div style="display: inline-block; vertical-align: top"> \
            <div id="shared-actions"></div> \
          </div> \
      <tr> \
        <td> <div id="turn-order"></div> \
        <td> <a style="color: black" href="#" onclick="toggleColorBlindMode()">Toggle color blind mode</a> \
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

    let svgInjectScript = new Element('script');
    svgInjectScript.src = urls.libSvgInject;
    svgInjectScript.type = 'text/javascript';
    svgInjectScript.language = 'javascript';
    document.head.appendChild(svgInjectScript);

    loadGame(document.location.host, document.location.pathname);
    fetchGames($("user-info"), "user", "running", showActiveGames);

    setInterval(function() {
        fetchGames($("user-info"), "user", "running", showActiveGames);
    }, 0.3*60*1000);
  }
