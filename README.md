# dogebot
auto-mine dogecoin at dogeminer.se

### Instructions for use:
1. Open your browser console (cmd + opt + i in Safari and Chrome, cmd + opt + k in Firefox)
2. Copy dogebot.min.js **_or_** dogebot.js and paste in the console prompt, hit enter.
3. Dogebot starts working immediately. Such mine! So bot!

Note: You may want to turn off sound effects, as the super mining speed is quite deafening.

### Then what?
Leave the browser tab open, and check the console periodically. Dogebot will leave you messages when cool things happen, along with the time played at the time the message was posted. If you accidentally close the tab, don't worry, dogeminer saves your progress. Just repeat the instructions above to restart Dogebot.

### Secure
Dogebot **does not** make any ajax requests, or inject any scripts on the page. Take a look at dogebot.js and see for yourself. It simply does the clicking for you.

### What it does
Dogebot uses several loops to mine and purchase upgrades and helpers. One loop is used simulate a click on your shibe 10 times per second, non-stop, indefinitely. It uses a second loop to buy helpers and upgrades, which runs once per second. 

The buy-loop is where the real magic of Dogebot comes in. Dogebot employs a strategy to increase your dogecoin the quickest way possible, buying certain items and upgrades at certain threshholds. Thresholds increase after certain requirements are met, and finally, after the last threshold is met, Dogebot stops buying and prepares for launch.

In addition, Dogebot clicks bonus and flying coins!

### How fast is it?
Currently still in testing, but Dogebot gets to Mars in about 8 hrs.

### Things you can do
There are a couple commands you can run from the console:
- `stopLoops()` - stops Dogebot.
- `resetLoops()` - starts Dogebot.
- `counts` - gives you a count of things

