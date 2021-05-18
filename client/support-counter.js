!(function () {
  /* Make sure player is on the right page */
  // https://en118.tribalwars.net/game.php?village=1&screen=overview_villages&mode=units&type=away_detail&filter_villages=1
  var expect = {
    screen: 'overview_villages',
    mode: 'units',
    type: 'away_detail',
  }
  const qs = location.href.split(/[&?]/).slice(1).map(qs => qs.split('='))
  const locationValid = qs.every(([k, v]) => (k in expect) ? expect[k] === v : true)
    && Object.keys(expect).every(k => qs.find(([qk, qv]) => (qk === k) && (qv === expect[k])))
  if (!locationValid) {
    return location.href = `/game.php?village=${qs.find(([qk]) => qk === 'village')[1]}&${Object.entries(expect).map(([k, v]) => `${k}=${v}`).join('&')}`
  }

  const unit_types = Array.from($('#units_table thead tr:nth-of-type(2) th img[src*="unit_"]')).map(x => $(x))

  function row_class () {
    row_class.bool = !row_class.bool
    return row_class.bool ? 'row_a' : 'row_b'
  }

  const targets = {}
  const target_player_links = {}

  Array.from($('#units_table tbody tr.row_a, #units_table tbody tr.row_b')).forEach(row => {
    const $row = $(row)

    const $target_span = $row.find('td:first-of-type span span[data-player]')
    const target_href = $target_span.find('a[href]').attr('href')
    const target_village = $target_span.find('a[href]').text().trim()
    const target_player = $target_span.next('a').text().trim() || game_data.player.name
    const target_tribe = $target_span.next('a').next('a').text().trim()
    if (!target_player_links[target_player]) target_player_links[target_player] = $target_span.next('a').attr('href')

    const distance = +$row.find('td:nth-of-type(2)').text().trim()
    const target_coord_match = target_village.match(/\((\d\d\d)\|(\d\d\d)\)/)
    const target_coord = `${target_coord_match[1]}|${target_coord_match[2]}`

    const from = $row.prev('.units_away').find('td:first-of-type').text().trim()
    const units = Array.from($row.find('.unit-item')).map(ui => +ui.innerText.trim())

    if (!targets[target_player]) targets[target_player] = {}
    if (!targets[target_player][target_village]) targets[target_player][target_village] = {
      href: target_href,
      coord: target_coord,
      units: unit_types.map(ut => 0),
    }

    const u = targets[target_player][target_village].units
    units.forEach((unit_count, index) => u[index] += unit_count)
  })

  let bb_output = '[table]\n'
  let html_output = '<table class="vis bbcodetable" style="width: 100%">'
  Object.keys(targets).forEach((target_player, index) => {
    bb_output += `[**] [player]${target_player}[/player] `
    html_output += `<tr><th><a href="${target_player_links[target_player]}">${target_player}</a>`

    if (index === 0) bb_output += `${unit_types.map(ut => `[||][unit]${ut.attr('src').match(/unit_([^.]+)\.png/)[1]}[/unit]`).join('')}[/**]\n`
    else bb_output += `${unit_types.map(ut => `[||]`).join('')}[/**]\n`
    html_output += `${unit_types.map(ut => `<th>${ut[0].outerHTML}`).join('')}`

    Object.keys(targets[target_player]).forEach(target_village => {
      const t = targets[target_player][target_village]
      bb_output += `[*] ${t.coord} ${t.units.map(u => `[|]${u}`).join('')}[/*]\n`
      html_output += `<tr class="${row_class()}"><td><a href="${t.href}">${target_village}</a> ${t.units.map(u => `<td>${u}`).join('')}`
    })
  })
  bb_output += '[/table]'
  html_output += '</table>'

  $('#content_value')
    .prepend($('<textarea>').val(bb_output).css({
      height: '5rem',
      width: '100%',
    }))
    .prepend(html_output)
})()
