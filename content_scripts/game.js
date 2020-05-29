/*
const urls = {
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
*/

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
        imgDiv.insert(tileCanvas);
        //tileCanvas.style = 'background: url(' + urls[name] + ')';
        let actionTakenHeight = 0;
        let actionTakenWidth = 0;
        if (name.startsWith('BON')) {
            tileCanvas.height = 205;
            tileCanvas.width = 68;
            actionTakenHeight = 63;
            actionTakenWidth = 35;
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
                ctx.fillStyle = '#000000' + '77';
                ctx.beginPath();
                ctx.arc(actionTakenWidth, actionTakenHeight, 25, 0, 2*Math.PI);
                ctx.fill();
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

drawRealFaction = function(faction, board) {
    let container = board.parentNode;
    container.id = faction.name;
    if (faction.passed) {
        board.style.opacity = 1;
        container.style.opacity = 0.5;
    }
    let name = faction.name;
    // 1. resources
    {
        let resourcesDiv = new Element('div', {'class': 'resources'});
        board.insert(resourcesDiv);
        // 1.1 coins
        let coinsDiv = new Element('span');
        resourcesDiv.appendChild(coinsDiv);
        let coins5 = Math.floor(state.factions[name].C / 5);
        let coins2 = Math.floor((state.factions[name].C - coins5*5) / 2);
        let coins1 = state.factions[name].C - coins5*5 - coins2*2;
        let coin5Img = new Element('img');
        coin5Img.src = urls.coin5;
        coin5Img.alt = '5c';
        let coin2Img = new Element('img');
        coin2Img.src = urls.coin2;
        coin2Img.alt = '2c';
        let coin1Img = new Element('img');
        coin1Img.src = urls.coin1;
        coin1Img.alt = '1c';
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
        resourcesDiv.appendChild(workersDiv);
        let workerImg = new Element('img');
        workerImg.src = urls.worker;
        workerImg.alt = '1w';
        workerImg.height = '40';
        for (let f=0; f<state.factions[name].W; f++) {
            workersDiv.appendChild(workerImg.cloneNode());
        }
        // 1.3 priests
        let priestsDiv = new Element('span');
        resourcesDiv.appendChild(priestsDiv);
        let priestImg = new Element('img');
        priestImg.src = urls['priest_'+state.factions[name].color];
        priestImg.alt = '1p';
        for (let f=0; f<state.factions[name].P; f++) {
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
    // 2. faction board
    {
        let factionBoardCanvas = new Element('canvas', {'style': 'opacity: 0;'});
        board.insert(factionBoardCanvas);
        factionBoardCanvas.style.background = 'url(' + urls['faction_'+name] + ')';
        factionBoardCanvas.style.opacity = 1;
        factionBoardCanvas.width = 620;
        factionBoardCanvas.height = 399;
        let ctx = factionBoardCanvas.getContext('2d');
        ctx.save();
        ctx.fillStyle = colors[state.factions[name].color] + 'aa';
        // 2.1. dwellings
        for (let dw=state.factions[name].buildings.D.max_level; dw>state.factions[name].buildings.D.level; dw--) {
            ctx.fillRect(87+(dw-1)*29,345,25,35);
        }
        // 2.2. trading posts
        for (let tp=state.factions[name].buildings.TP.max_level; tp>state.factions[name].buildings.TP.level; tp--) {
            ctx.fillRect(60+(tp-1)*30,280,25,50);
        }
        // 2.3. temples
        for (let te=state.factions[name].buildings.TE.max_level; te>state.factions[name].buildings.TE.level; te--) {
            ctx.beginPath();
            ctx.arc(269+(te-1)*45,305,21,0,2*Math.PI);
            ctx.fill();
        }
        // 2.4. stronghold
        if (state.factions[name].buildings.SH.max_level > 0 && state.factions[name].buildings.SH.level == 0) {
            ctx.fillRect(62,208,55,55);
        }
        // 2.5. sanctuary
        if (state.factions[name].buildings.SA.max_level > 0 & state.factions[name].buildings.SA.level == 0) {
            ctx.fillRect(245,215,60,40);
        }
        ctx.fillStyle = colors[state.factions[name].color] + 'ff';
        // 2.6. shipping
        if (state.factions[name].ship.max_level > 0) {
            let offset = 487;
            if (name == "mermaids") {
                offset = 445;
            }
            let ship = state.factions[name].ship.level;
            ctx.beginPath();
            ctx.arc(offset+ship*28,237,10,0,2*Math.PI);
            ctx.fill();
        }
        // 2.7. digging
        if (faction.dig && faction.dig.max_level > 0) {
            let dig = state.factions[name].dig.level;
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
                ctx.beginPath();
                ctx.arc(152,237,25,0,2*Math.PI); // getestet fuer ACTW
                ctx.fill();
            }
        }
        ctx.restore();
        // 2.9 power
        ctx.save();
        ctx.fillStyle = '#ffffff';
        ctx.font = '30px Arial';
        ctx.fillText(state.factions[name].P1, 75, 150);
        ctx.fillText(state.factions[name].P2, 75, 65);
        ctx.fillText(state.factions[name].P3, 200, 110);
        ctx.restore();
    }
    // 3. status
    {
        let statusDiv = new Element('div');
        container.insert(statusDiv);
        // 3.1. victory points
        let vp_id = faction.name + "/vp";
        let link = makeToggleLink(faction.VP, function() { toggleVP(vp_id); });
        statusDiv.insert(link);
        statusDiv.insertTextSpan(" vp, ");
        // 3.2. priests available
        statusDiv.insertTextSpan(faction.MAX_P + " p available, ");
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

renderAction = function(canvas, name, key, border_color) {
    if (!canvas.getContext) return;
    let ctx = canvas.getContext("2d");
    let width = 120;
    let height = 60;
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
    };
}

markActionAsPossible = function(canvas, name, key) {
    if (!canvas.getContext) return;
    let ctx = canvas.getContext("2d");
    ctx.save();
    ctx.strokeStyle = colors.activeUI;
    ctx.lineWidth = 4;

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
            let loc = '';
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
        let faction = state.factions[faction];
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
            let loc = '';
            if (left<x && x<right && top<y && y<bottom) {
                menuClickHandler(title, loc, menu_items)(loc, event);
            }
        });
    }
    ctx.restore();
}

var addAdvanceToMovePicker_ = addAdvanceToMovePicker;
addAdvanceToMovePicker = function(picker, faction){
    let row = addAdvanceToMovePicker_(picker, faction);
    let canvas = document.getElementById(faction.name).getElementsByTagName('canvas')[0];
    if (faction.allowed_actions) {
        markActionAsPossible(canvas, "ADV1", "ADV1/"+faction.name);
        markActionAsPossible(canvas, "ADV2", "ADV2/"+faction.name);
    }
    return row;
}
