function fakes (req, res, target) {
  const [x, y] = target.split('|')
  res.send(`
if ($('#units_entry_all_spy').text().replace(/[^\\d]/g,'')>0) $('#unit_input_spy').val(1);
if ($('#units_entry_all_catapult').text().replace(/[^\\d]/g,'')>0) $('#unit_input_catapult').val(1); else
if ($('#units_entry_all_ram').text().replace(/[^\\d]/g,'')>0) $('#unit_input_ram').val(1);
$('#inputx').val('${x}'); $('#inputy').val('${y}'); $('#place_target').val('${target}'); $('#target_attack').focus();
setTimeout(() => $('#content_value').css({backgroundImage: 'url(${req.protocol}://${req.headers.host}/static/stars.gif)'}), 30000);
`)
}

module.exports = fakes
