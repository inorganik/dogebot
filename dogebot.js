/*
	DOGEBOT v1.0 
	auto-mine dogecoin at dogeminer.se
	by @inorganik
*/

// paste this code into the console at dogeminer.se

var enableLogging = true, // get messages when cool stuff happens
	itemIncrement = 10, // increase threshold by this many
	itemThreshold = itemIncrement, // buy things until this many
	buyLoopIntervalTime = 1000, // 1x/second
	mineLoopIntervalTime = 100, // 10x/second
	miner = document.getElementById('miner'),
	itemThresholdLimit, thresholdIteration, rigThresholdLimit, rigThreshold, baseThreshold, maxThresholdLevelReached,
	buyInterval, mineInterval, pollInterval, coinsLastHour = [], coinsPerSecLastHour = [0], increasesInCoinsPerSec = [],
	counts = {}, lastBonusCoinClick = 0, lastFlyingCoinClick = 0,
	locations = ['EARTH', 'MOON', 'MARS', '????(4)', '????(5)', '????(6)'],
	locationIndex = 0, waitingForIndex = -1, loggedFinalThreshold = false;

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
	loggedFinalThreshold = false;
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
			rigThresholdLimit = itemIncrement;
			baseThreshold = itemThresholdLimit / 2 * thresholdIteration;
			break;
		case 'MOON':
			rigThresholdLimit = itemIncrement;
			baseThreshold = itemThresholdLimit / 2;
			break;
		case 'MARS':
			rigThresholdLimit = Math.pow(itemIncrement, 3) / 2;
			baseThreshold = itemThresholdLimit;
			break;
		default:
			rigThresholdLimit = Math.pow(itemIncrement, 3);
			baseThreshold = itemThresholdLimit;
			break;
	}
}

function resetLoops() {
	stopLoops();
	resetCounts();
	setThresholdLimit();

	if (enableLogging) console.warn('[Dogebot] started! hold on to your butts 🚬', getTimePlayed());

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
				if (enableLogging) console.warn('[Dogebot] clicked a bonus coin! 🤑', getTimePlayed());
				lastBonusCoinClick = time;
			}
		}
		if (flyingcoin) {
			time = new Date().getTime();
			if (time - lastFlyingCoinClick > 1000) {
				simulateClick(flyingcoin);
				if (enableLogging) console.warn('[Dogebot] clicked a flying coin! 💸', getTimePlayed());
				lastFlyingCoinClick = time;
			}
		}
	}, mineLoopIntervalTime);

	// buy/upgrade loop
	buyInterval = setInterval(function() {

		var thresholdMet = false,
			rigs = getCount('rigs'),
			loc = getLocation();
		thresholdIteration = itemThreshold / itemIncrement;
		maxThresholdLevelReached = (thresholdIteration === itemIncrement);

		autoClick('upgradeextras');
		autoClick('upgradeclicks');
		if (rigs > 0) {
			autoClick('upgraderigs');
		}

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
			if (launchbutton && $(launchbutton).css('display') !== 'none') {
				$(launchbutton).trigger('click');
				if (enableLogging) console.warn('[Dogebot] blastoff!!!!! 🚀', getTimePlayed());
			}
			return;
		}

		if (maxThresholdLevelReached) {
			rigThreshold = rigThresholdLimit;
			if (!loggedFinalThreshold) {
				if (enableLogging) console.warn('[Dogebot] upped the threshold to the highest level! 🆙', thresholdIteration, getTimePlayed());
				loggedFinalThreshold = true;
			}
		} else {
			rigThreshold = thresholdIteration;
			if (rigs >= thresholdIteration) thresholdMet = true;
		}
		if (rigs < rigThreshold) {
			autoClick('buyrig');
		}

		var bases = getCount('bases');
		if (bases < baseThreshold) {
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
		if (thresholdMet && !maxThresholdLevelReached) {
			itemThreshold += itemIncrement;
			if (enableLogging) console.warn('[Dogebot] upped the threshold level! 🆙', thresholdIteration, getTimePlayed());
		}

	}, buyLoopIntervalTime);

	// polling loop for coins and coins/sec counts
	pollInterval = setInterval(function() {
		var coins = getCount('mined');
		coinsLastHour.push(coins);
		if (coinsLastHour.length > 60) coinsLastHour.shift();

		var persec = getCount('persec');
		coinsPerSecLastHour.push(persec);
		if (coinsPerSecLastHour.length > 60) coinsPerSecLastHour.shift();

		var lastMinuteIncrease = persec - coinsPerSecLastHour[coinsPerSecLastHour.length - 1];
		increasesInCoinsPerSec.push(lastMinuteIncrease);
		if (increasesInCoinsPerSec.length > 60) increasesInCoinsPerSec.shift();

		if (pollInterval % 60 === 0 && enableLogging && console.chart !== undefined) {
			console.warn('[Dogebot] increase in dogecoins per second over the last hour: 📈', getTimePlayed());
			console.chart(increasesInCoinsPerSec, {color:'gray'});
		}
	}, 60000);
}
resetLoops();