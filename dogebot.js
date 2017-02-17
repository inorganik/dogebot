/*
	DOGEBOT v1.0 
	auto-mine dogecoin at dogeminer.se
	by @inorganik
*/

// paste this code into the console at dogeminer.se

var enableLogging = true, // get messages when cool stuff happens
	itemIncrement = 10, // increase threshhold by this many
	itemThreshhold = itemIncrement, // buy things until this many
	buyLoopIntervalTime = 1000, // 1x/second
	mineLoopIntervalTime = 100, // 10x/second
	buyInterval, mineInterval,
	miner = document.getElementById('miner'),
	counts = {
		bonusCoins:0,
		flyingCoins:0
	},
	upgrades = {},
	lastBonusCoinClick = 0,
	lastFlyingCoinClick = 0,
	locations = ['EARTH', 'MOON', 'MARS'],
	locationIndex = 0,
	waitingForIndex = -1;

function getLocation() {
	var loc = document.getElementById('location');
	return loc.children[0].textContent;
}
function getNextLocation() {
	if (locations[locationIndex + 1]) {
		return locations[locationIndex + 1];
	} else {
		return '';
	}
}
locationIndex = locations.indexOf(getLocation());

function mapActionToCount(action) {
	if ((/shibe/).test(action)) return 'shibes';
	if ((/kennel/).test(action)) return 'kennels';
	if ((/kitten/).test(action)) return 'kittens';
	if ((/rocket/).test(action)) return 'rockets';
	if ((/base/).test(action)) return 'bases';
	if ((/rig/).test(action)) return 'rigs';
}
function parseCount(what) {
	var whats = document.getElementById(what);
	if (whats) {
		if (whats.textContent.replace(/\D+/g, '').length) {
			return parseInt(whats.textContent.replace(/\D+/g, ''));
		} else {
			return 0;
		}
	} else {
		return 0;
	}
}
function getCount(what) {
	if (!counts[what]) {
		counts[what] = parseCount(what);
		return counts[what];
	} else {
		return counts[what];
	}
}
function resetCounts() {
	for (var key in counts) {
		counts[key] = 0;
	}
}
function incCount(what) {
	if (!counts[what]) counts[what] = parseCount(what);
	counts[what]++;
}
function incUpgrade(what) {
	if (!upgrades[what]) {
		upgrades[what] = 0;
	} else {
		upgrades[what]++;
	}
}
function simulateClick(el) {
	if (el) {
		el.click();
		el.dispatchEvent(new Event('mousedown'));
		setTimeout(function() {
			el.dispatchEvent(new Event('mouseup'));
		}, 10);
	}
}
function autoClick(what) {

	var btn = document.getElementById(what);
	if (btn && !btn.getAttribute('disabled')) {
		simulateClick(btn);
		if ((/upgrade/).test(what)) {
			incUpgrade(mapActionToCount(what));
		} else {
			incCount(mapActionToCount(what));
		}
	}
}
function stopLoops() {
	clearInterval(buyInterval);
	clearInterval(mineInterval);
}


function resetLoops() {
	stopLoops();
	resetCounts();

	if (enableLogging) console.warn('[Dogebot] loops started! hold on to your butts 🚬');

	// mining loop
	mineInterval = setInterval(function() {

		simulateClick(miner);

		var bonuscoin = document.getElementById('bonuscoin'),
			flyingcoin = document.getElementById('flyingcoin'),
			time;
		if (bonuscoin) {
			time = new Date().getTime();
			if (time - lastBonusCoinClick > 6000) {
				setTimeout(function() {
					bonuscoin.dispatchEvent(new Event('mousedown'));
				}, 500);
				counts.bonusCoins++;
				if (enableLogging) console.warn('[Dogebot] clicked a bonus coin! 🤑');
				lastBonusCoinClick = time;
			}
		}
		if (flyingcoin) {
			time = new Date().getTime();
			if (time - lastFlyingCoinClick > 6000) {
				setTimeout(function() {
					flyingcoin.dispatchEvent(new Event('mousedown'));
				}, 500);
				counts.flyingCoins++;
				if (enableLogging) console.warn('[Dogebot] clicked a flying coin! 💸');
				lastFlyingCoinClick = time;
			}
		}
	}, mineLoopIntervalTime);

	// buy/upgrade loop
	buyInterval = setInterval(function() {

		var threshholdMet = false;

		autoClick('upgradeextras');
		autoClick('upgradeclicks');

		if (getLocation() === getNextLocation()) {
			locationIndex++;
			itemThreshhold = itemIncrement;
			resetCounts();
			if (enableLogging) console.warn('[Dogebot] YOU REACHED '+locations[locationIndex]+'!!!');
		}
		else if (getCount('rigs') >= itemIncrement) {
			if (locationIndex !== waitingForIndex) {
				var d = new Date();
				if (enableLogging) console.warn('[Dogebot] stopped buying to get ready for '+getNextLocation()+' launch 🚀', d);
				waitingForIndex = locationIndex;
			}
			var launchbutton = document.getElementById('launchbutton');
			simulateClick(launchbutton);
			return;
		}
		

		if (getCount('rigs') < itemThreshhold/itemIncrement) {
			autoClick('buyrig');
		} else {
			autoClick('upgraderigs');
			threshholdMet = true;
		}

		if (getCount('bases') < itemThreshhold * 2) {
			autoClick('buybase');
		} else {
			autoClick('upgradebases');
		}

		if (getCount('rockets') < itemThreshhold) {
			autoClick('buyrocket');
		} else {
			autoClick('upgraderockets');
		}

		if (getCount('kittens') < itemThreshhold) {
			autoClick('buykitten');
		} else {
			autoClick('upgradekittens');
		}

		if (getCount('kennels') < itemThreshhold * 1.5) {
			autoClick('buykennel');
		} else {
			autoClick('upgradekennels');
		}

		if (getCount('shibes') < itemThreshhold * 2) {
			autoClick('buyshibe');
		} else {
			autoClick('upgradeshibes');
		}

		// up item threshhold if all items have reached threshhold
		if (threshholdMet) {
			itemThreshhold += itemIncrement;
			if (enableLogging) console.warn('[Dogebot] upped the threshhold! 🆙', itemThreshhold);
		}

	}, buyLoopIntervalTime);
}
resetLoops();