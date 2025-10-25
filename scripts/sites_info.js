/**
 * sites_info.js
 * 
 *  UI and logic to browse project sites, select one, zoom to its polygon,
 *  and display key indicators (conservation, temperature, precipitation,
 *  erosion, and climate “traffic lights”) in an information panel.
 *  Exposed UI elements:
 *   `sitesButton`  (opens the Sites information panel)
 *   `siteSelect`   (dropdown to choose a site)
 *   `showSiteInfo(siteName)` (renders charts/labels for the selected site)
 * 
 * Developed by S. Otta
 */

var sitesTitle = ui.Label('Comunidades del Proyecto', {
  fontWeight: 'bold',
  fontSize: '18px',
  margin: '0 0 0 0',
  padding: '0 0 0 0',
  width: '220px',
  height: '40px'
});

// Create a button to close the information panel
var closeSiteButton = ui.Button({
  imageUrl: IconName('close'),
  onClick: function() {
    ui.root.remove(informationPanel);
    ui.root.add(legendPanel);
  },
  style: {position: 'bottom-right',
          margin: '0 0 0 0',
          padding: '0 0 0 0',
          height: '40px'
  }
});

// Top panel for site information
var sitesHeading = ui.Panel({
  widgets: [sitesTitle, closeSiteButton],
  layout: ui.Panel.Layout.Flow('horizontal'),
  style: {
    position: 'top-right',
    padding: '0px 15px 0px 15px',
    width: '300px',
  }
});

// Site selector
var siteSelect = ui.Select({
  items: ['Tromen', 'Comunidad Calfucurá', 'Cooperativa Calibui', 'Mamuel Choique', 'Sierras de Telsen',
          'Cushamen', 'Paso de Indios', 'Meseta Central Mediterránea', 'Meseta Central Costera', 'Ecotono Fueguino'],
  onChange: function(selected) {
    var site = sites.filter(ee.Filter.eq('NombRotulo', selected))
    var styled_site = style_FC(site, 'red', 3);
    leftMap.centerObject(site);
    removeLayersByName('styled_site');
    leftMap.addLayer(styled_site, {}, 'styled_site');
    showSiteInfo(selected)
  }
});
siteSelect.setPlaceholder('Selecciona una comunidad');

// Button to open the site information panel
var sitesButton = ui.Button({
          label: 'Consulta de Comunidades del Proyecto',
          onClick: function() {
            informationPanel.clear();
            informationPanel.add(sitesHeading)
                            .add(siteSelect);
            ui.root.remove(legendPanel);
            if (!ui.root.widgets().contains(informationPanel)) {
            ui.root.add(informationPanel);
            }},
          style: {
            color: 'black',
            fontSize: '12px',
            margin: '0px 0px 0px 22px'
          },
        });

// Desertification risk traffic lights for sites
var semaforos = {
  'Ecotono Fueguino': {aridez: 1, temp_extremas: 2, prec_extremas: 3},
  'Meseta Central Costera': {aridez: 3, temp_extremas: 2, prec_extremas: 3},
  'Meseta Central': {aridez: 3, temp_extremas: 2, prec_extremas: 3},
  'Paso de Indios': {aridez: 2, temp_extremas: 1, prec_extremas: 3},
  'Sierras de Telsen': {aridez: 3, temp_extremas: 2, prec_extremas: 1},
  'Colonia Chusamen': {aridez: 1, temp_extremas: 2, prec_extremas: 3},
  'Com. Mamuel Choique': {aridez: 2, temp_extremas: 2, prec_extremas: 2},
  'Coop. Calibui': {aridez: 1, temp_extremas: 2, prec_extremas: 2},
  'Com. Calfucurá': {aridez: 2, temp_extremas: 2, prec_extremas: 3},
  'Tromen': {aridez: 1, temp_extremas: 1, prec_extremas: 3}
};

// Functions to display site information
var siteInfoPanel = ui.Panel({
  layout: ui.Panel.Layout.Flow('vertical', true),
  style: {maxWidth: '100%'}
});

function showSiteInfo(site_name) {
  siteInfoPanel.clear();
  if (!informationPanel.widgets().contains(siteInfoPanel)) {
            informationPanel.add(siteInfoPanel);
  }
  var readiness_site = sites.filter(ee.Filter.eq('NombRotulo', site_name)).first();
  var COS_site_value = readiness_site.get('COS').getInfo().toLocaleString('de-DE');
  var COS_site = ui.Label('Almacenamiento COS: ' + COS_site_value + ' t/ha');

  var water_erosion_site_value = readiness_site.get('water_erosion').getInfo().toLocaleString('de-DE');
  var water_erosion_site = ui.Label('Erosión hídrica: ' + water_erosion_site_value + ' t/ha/año');
  
  var ANP_site = readiness_site.get('Porc_ANP').getInfo();
  var prioritarias_site = readiness_site.get('Porc_Areas_Prioritarias').getInfo();
  var irremplazables_site = readiness_site.get('Porc_Areas_Irremplazables').getInfo();
  var conservationChart_site = ui.Chart.array.values({
      array: ee.Array([[ANP_site], [prioritarias_site], [irremplazables_site]]).transpose(),
      axis: 0,
      xLabels: [' ']
    })
    .setChartType('ColumnChart')
    .setSeriesNames(['Superficie ANP', 'Áreas prioritarias', 'Áreas irremplazables'])
    .setOptions({
      title: 'Áreas relevantes para la conservación',
      vAxis: {title: 'Superficie (%)',
              viewWindow: {min: 0},
              gridlines: {color: 'lightgray'},
              format: '##.#'
      },
      legend: {position: 'none'},
      width: '100%'
    });

  var MAT_site = readiness_site.get('MAT').getInfo();
  var MAT_SSP1_site = readiness_site.get('MAT_calc_SSP1_26').getInfo();
  var MAT_SSP5_site = readiness_site.get('MAT_calc_SSP5_85').getInfo();
  var temperatureChart_site = ui.Chart.array.values({
      array: ee.Array([[MAT_site], [MAT_SSP1_site], [MAT_SSP5_site]]).transpose(),
      axis: 0,
      xLabels: [' ']
    })
    .setChartType('ColumnChart')
    .setSeriesNames(['Temp. actual', 'SSP1-2.6', 'SSP5-8.5'])
    .setOptions({
      title: 'Temperatura actual y proyectada al 2081-2100',
      vAxis: {title: 'Temperatura (°C)',
              viewWindow: {min: 0}, 
              gridlines: {color: 'lightgray'},
              format: '##.#'
      },
      series: {
        0: {color: 'blue', labelInLegend: 'Temp. actual'},
        1: {color: 'green', labelInLegend: 'SSP1-2.6'},
        2: {color: 'orange', labelInLegend: 'SSP5-8.5'}
      },
      legend: {position: 'top'},
      bar: {groupWidth: '50%'},
    });
  
  var MAP_site = readiness_site.get('MAP').getInfo();
  var MAP_SSP1_site = readiness_site.get('MAP_calc_SSP1_26').getInfo();
  var MAP_SSP5_site = readiness_site.get('MAP_calc_SSP5_85').getInfo();
  var precipitationChart_site = ui.Chart.array.values({
      array: ee.Array([[MAP_site], [MAP_SSP1_site], [MAP_SSP5_site]]).transpose(),
      axis: 0,
      xLabels: [' ']
    })
    .setChartType('ColumnChart')
    .setSeriesNames(['Precipitación actual', 'SSP1-2.6', 'SSP5-8.5'])
    .setOptions({
      title: 'Precipitación actual y proyectada al 2081-2100',
      vAxis: {title: 'Precipitación (mm)',
              viewWindow: {min: 0},
              gridlines: {color: 'lightgray'},
              format: '##.#'
      },
      series: {
        0: {color: 'blue', labelInLegend: 'Prec. actual'},
        1: {color: 'green', labelInLegend: 'SSP1-2.6'},
        2: {color: 'orange', labelInLegend: 'SSP5-8.5'}
      },
      legend: {position: 'top'},
      bar: {groupWidth: '50%'},
    });

  var semaforos_title = ui.Label('Semáforos - Cambio Climático proyectado', {
    fontWeight: 'bold',
    fontSize: '14px',
    margin: '0 0 4px 12px'
  });

  function crearSemaforoLabelfondo(riesgo, label) {
    var color;
    var backgroundcolor;
    var nivel_riesgo = readiness_site.get(riesgo).getInfo();
    if (nivel_riesgo === 1) {
      color = 'black',
      backgroundcolor = 'FF6666';
    } else if (nivel_riesgo === 2) {
      color = 'black',
      backgroundcolor = 'yellow';
    } else {
      color = 'black',
      backgroundcolor = '97f071';
    }
    return ui.Label({
      value: label,
      style: {
        backgroundColor: backgroundcolor,
        color: color,
        fontStyle: 'italic',
        fontWeight: 'bold',
        textAlign: 'center',
        width: '100%',
        height: '30px',
        margin: '10px'
      }
    });
  }

  var semaforo_aridity = crearSemaforoLabelfondo('aridez', 'Aridez');
  
  var semaforo_temperature = crearSemaforoLabelfondo('temp_extremas', 'Temperaturas extremas');
  
  var semaforo_precipitation = crearSemaforoLabelfondo('prec_extremas', 'Precipitaciones extremas');
  
  siteInfoPanel.add(COS_site)
                .add(water_erosion_site)
                .add(conservationChart_site)
                .add(temperatureChart_site)
                .add(precipitationChart_site)
                .add(semaforos_title)
                .add(semaforo_aridity)
                .add(semaforo_temperature)
                .add(semaforo_precipitation);
}
/* SAOtta */
