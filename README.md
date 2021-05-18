# tribalstuff

TribalWars scripts, hosted publicly at `tw.ardelian.ro`.

## Random fakes

Supports `&tribes=`, `&players=` and `&coords=` as parameters. Values separated by a space (or `%20`). For example, to send fakes to the players `majestee`, `ippe` and `Frozen99` along with everyone in the tribe `AFK` on W118, put this in your quickbar:

Add the `&no-spy` parameter to skip the scouts and just send rams/cats.

```javascript
javascript:$.getScript('https://tw.ardelian.ro/fakes/random?server=en118.tribalwars.net&players=majestee ippe Frozen99&tribes=AFK');
```

The resulting script that will run on the client will be something like this:

```javascript
if ($('#units_entry_all_spy').text().replace(/[^\d]/g,'')>0) $('#unit_input_spy').val(1);
if ($('#units_entry_all_catapult').text().replace(/[^\d]/g,'')>0) $('#unit_input_catapult').val(1);
else if ($('#units_entry_all_ram').text().replace(/[^\d]/g,'')>0) $('#unit_input_ram').val(1);
$('#inputx').val('415'); $('#inputy').val('450'); $('#place_target').val('415|450');
$('#target_attack').focus(); setTimeout(() => $('#content_value').css({backgroundImage: 'url(https://tw.ardelian.ro/static/stars.gif)'}), 30000);
```

## Development

```shell
npm install
npm start
```

Starts a local express HTTP server on port 8000.
