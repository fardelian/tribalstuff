# tribalstuff

TribalWars scripts collection, developed and maintained by a complete noob, and hosted publicly at `tw.ardelian.ro`

## List of scripts

### <u>APPROVED</u>: Random fakes

Supports `&tribes=`, `&players=` and `&coords=` as parameters. Values separated by a space (or `%20`). For example, to send fakes to the players `majestee`, `ippe` and `Frozen99` along with everyone in the tribe `AFK` on W118, put this in your quickbar.

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

Add a `&no-spy` parameter to skip the scouts and just send rams/cats, like so:

```javascript
javascript:$.getScript('https://tw.ardelian.ro/fakes/random?server=en118.tribalwars.net&no-spy&coords=123|456 111|222');
```

This script must be run on the Rally Point Commands page, it will not redirect you. The automatic redirection feature is still in development.

### <u>WAITING FOR APPROVAL</u>: Support troop counter

Aggregates your support troops in each supported village and groups the villages by player.
The output is both an in-game table and a text area with BB-codes that can be copy-pasted in the forum or in the Notebook.
The BB-codes will not work in a mail, because TW mail does not support tables.

```javascript
javascript:$.getScript('https://tw.ardelian.ro/support-counter');
```

If you are not on the Troops Support page, you will be redirected there and you will need to click the script again.

The result will be something like this:

![Support Counter example](assets/support-counter-demo.png)

## Development

```shell
npm install
npm start
```

Starts an express HTTP server on port 8000.

## Production

On Linux:

```shell
npm install
npm start:bg
```

Starts an express server on port 8000 running in background (uses `nohup` for this).

## Support

- This server does not log anything

- If you want logs, HTTPS or a different port, you should set up a forwarding proxy such as `nginx`

- Contact: [florin@ardelian.ro](mailto:florin@ardelian.ro)
