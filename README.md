# dogebot
auto-mine dogecoin at dogeminer.se

### Instructions for use:
1. Copy the script below:
``` js
function inject(s) {
var t = document.createElement('script');
t.setAttribute('charset', 'utf-8');
t.setAttribute('src', s); ;
document.body.appendChild(t);}
inject('https://rawgit.com/inorganik/console.chart/master/console.chart.js');
inject('https://rawgit.com/inorganik/dogebot/master/dogebot.min.js');

```
2. Paste into your console on dogeminer.se (to open: cmd + opt + i in Safari and Chrome, cmd + opt + k in Firefox)
3. Dogebot starts working immediately. Such mine! So bot!

Note: You may want to turn off sound effects, as the super mining speed is quite deafening.

### Then what?
Leave the browser tab open, and check the console periodically. Dogebot will leave you messages when cool things happen, along with the time played at the time the message was posted. Dogebot also keeps track of things and offers analytics. Check out how to **[view charts](#functions)** of your progress below! 

If you accidentally close or reload the tab, don't worry, dogeminer saves your progress. Just repeat the instructions above to restart Dogebot. 

### Secure
Dogebot **does not** make any ajax requests, or inject any additional scripts on the page. Take a look at dogebot.js and see for yourself. It simply does the clicking for you, and gives you analytics.

### What it does
Dogebot uses several loops to mine and purchase upgrades and helpers. One loop is used simulate a click on your shibe 10 times per second, non-stop, indefinitely. It uses a second loop to buy helpers and upgrades, which runs once per second. 

The buy-loop is where the real magic of Dogebot comes in. Dogebot employs a strategy to increase your dogecoin the quickest way possible, buying certain items and upgrades at certain threshholds. Thresholds increase after certain requirements are met, and finally, after the last threshold is met, Dogebot stops buying and prepares for launch.

In addition, Dogebot clicks bonus and flying coins! When flying coins come, Dogebot clicks all of them so you get a :100:% increase in profit.

### How fast is it?
Dogebot gets to Mars in just under 8 hrs. To get to the next planet after Mars it costs 1,000,000,000,000,000,000,000 Trillion dogecoins. Which means that even after you are making 1,000,000,000,000 Trillion dogecoins per second, it would take 11,574,074 days to reach the launch cost. That means you have to let Dogebot keep working for ? days until the next planet.

### Things you can do <a name="functions"></a>
Here are some commands you can run from the console:
- `stopLoops()` - stops Dogebot.
- `resetLoops()` - starts Dogebot.
- `console.chart()` - pass any of the following arrays to this function to see a chart of your progress!
	- `coinsLastHour` - an array of your available coin balance recorded each minute over the last hour
	- `coinsPerSecLastHour` - an array of your coins per second recorded each minute over the last hour
	- `increasesInCoinsPerSec` an array of how much your coins per second are increasing each minute over the last hour



