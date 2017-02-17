/*
	DOGEBOT v1.0 
	auto-mine dogecoin at dogeminer.se
	by @inorganik
*/

// paste this code into the console at dogeminer.se

var enableLogging = true, // get messages when cool stuff happens
	itemIncrement = 10, // increase threshold by this many
	itemThreshold = itemIncrement, // buy things until this many
	itemThresholdLimit, rigThresholdLimit, // threshold limit is different for each planet
	buyLoopIntervalTime = 1000, // 1x/second
	mineLoopIntervalTime = 100, // 10x/second
	buyInterval, mineInterval,
	miner = document.getElementById('miner'),
	counts = {
		bonusCoins:0,
		flyingCoins:0
	},
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
function getTimePlayed() {
	return document.getElementById('timeplayed').textContent;
}
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
	var amount = parseCount(what);
	counts[what] = amount;
	return amount;
}
function resetCounts() {
	for (var key in counts) {
		counts[key] = 0;
	}
}
function simulateClick(el) {
	if (el) {
		$(el).trigger('mousedown');
		setTimeout(function() {
			$(el).trigger('mouseup');
		}, 10);
	}
}
function autoClick(what) {
	var btn = document.getElementById(what);
	if (btn && !btn.getAttribute('disabled')) {
		$(btn).trigger('click');
	}
}
function stopLoops() {
	clearInterval(buyInterval);
	clearInterval(mineInterval);
}
function setThresholdLimit() {
	var loc = getLocation();
	itemThresholdLimit = itemIncrement * itemIncrement;
	switch (loc) {
		case 'EARTH':
		case 'MOON':
			rigThresholdLimit = itemIncrement;
			break;
		case 'MARS':
			rigThresholdLimit = itemIncrement * itemIncrement;
			break;
		default:
			rigThresholdLimit = itemIncrement * itemIncrement * itemIncrement;
			break;
	}
}

function resetLoops() {
	stopLoops();
	resetCounts();

	setThresholdLimit();

	if (enableLogging) console.warn('[Dogebot] Dogebot started! hold on to your butts 🚬', getTimePlayed());

	// mining loop
	mineInterval = setInterval(function() {

		simulateClick(miner);

		var bonuscoin = document.getElementById('bonuscoin'),
			flyingcoin = document.getElementById('flyingcoin'),
			time;
		if (bonuscoin) {
			time = new Date().getTime();
			if (time - lastBonusCoinClick > 6000) {
				simulateClick(bonuscoin);
				counts.bonusCoins++;
				if (enableLogging) console.warn('[Dogebot] clicked a bonus coin! 🤑', getTimePlayed());
				lastBonusCoinClick = time;
			}
		}
		if (flyingcoin) {
			time = new Date().getTime();
			if (time - lastFlyingCoinClick > 6000) {
				simulateClick(flyingcoin);
				counts.flyingCoins++;
				if (enableLogging) console.warn('[Dogebot] clicked a flying coin! 💸', getTimePlayed());
				lastFlyingCoinClick = time;
			}
		}
	}, mineLoopIntervalTime);

	// buy/upgrade loop
	buyInterval = setInterval(function() {

		var thresholdMet = false;
		var rigs = getCount('rigs');
		var loc = getLocation();

		autoClick('upgradeextras');
		autoClick('upgradeclicks');

		if (loc === getNextLocation()) {
			locationIndex++;
			itemThreshold = itemIncrement;
			resetCounts();
			setThresholdLimit();
			if (enableLogging) console.warn('[Dogebot] YOU REACHED '+locations[locationIndex]+'!!!', getTimePlayed());
		}
		else if (rigs >= rigThresholdLimit) {
			if (locationIndex !== waitingForIndex) {
				var d = new Date();
				if (enableLogging) console.warn('[Dogebot] stopped buying to get ready for '+getNextLocation()+' launch 🚀', getTimePlayed());
				waitingForIndex = locationIndex;
			}
			var launchbutton = document.getElementById('launchbutton');
			simulateClick(launchbutton);
			return;
		}

		if (rigs < itemThreshold / itemIncrement) {
			autoClick('buyrig');
		} else {
			autoClick('upgraderigs');
			thresholdMet = true;
		}

		var bases = getCount('bases');
		var baseThreshold = (loc === 'EARTH') ? itemThresholdLimit / 2 : itemThreshold;
		if (bases < baseThreshold && bases < itemThresholdLimit) {
			autoClick('buybase');
		} else {
			autoClick('upgradebases');
		}

		var rockets = getCount('rockets');
		if (rockets < itemThreshold && rockets < itemThresholdLimit) {
			autoClick('buyrocket');
		} else {
			autoClick('upgraderockets');
		}

		var kittens = getCount('kittens');
		if (kittens < itemThreshold && kittens < itemThresholdLimit) {
			autoClick('buykitten');
		} else {
			autoClick('upgradekittens');
		}

		var kennels = getCount('kennels');
		if (kennels < itemThreshold + itemIncrement && kennels < itemThresholdLimit) {
			autoClick('buykennel');
		} else {
			autoClick('upgradekennels');
		}

		var shibes = getCount('shibes');
		if (shibes < itemThreshold + itemIncrement && shibes < itemThresholdLimit) {
			autoClick('buyshibe');
		} else {
			autoClick('upgradeshibes');
		}

		// up item threshhold if all items have reached threshhold
		if (thresholdMet) {
			itemThreshold += itemIncrement;
			if (enableLogging) console.warn('[Dogebot] upped the threshhold! 🆙', itemThreshold, getTimePlayed());
		}

	}, buyLoopIntervalTime);
}
resetLoops();