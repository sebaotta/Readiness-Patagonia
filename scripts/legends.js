/**
 * legends.js
 
 *  This script defines all legend-building utilities and visualisation legends 
 *  used across the Google Earth Engine App. It includes:
 *   - Functions to create legend elements for colour bars, polygons, lines, and points.
 *   - Helper functions for building legends from palettes and value references.
 *   - Specific legend panels referenced by:
 *      - checkboxs.js
 *      - selectors.js
 *      - climate_inspector.js
 *
 * Developed by SAOtta
 */

// ----------------------- Legend builders -----------------------
var makeRow = function(color, name, fontsize) {
  var colorBox = ui.Label({
    style: {
      backgroundColor: color,
      padding: '8px',
      margin: '0px 8px 0px 9px',
    }
  });
  var description = ui.Label({
    value: name,
    style: {margin: '0 0 4px 7px',
            fontSize: fontsize,
            whiteSpace: 'pre',
    }
  });
  return ui.Panel({
    widgets: [colorBox, description],
    layout: ui.Panel.Layout.Flow('horizontal')
  });
};

var makePolygon = function(color, name, fontsize) {
  var colorPolygon = ui.Label({
    style: {
      padding: '7px',
      margin: '0px 10px 2px 8px',
      border: '2px solid ' + color
    }
  });
  var description = ui.Label({
    value: name,
    style: {margin: '0 0 4px 5px',
            fontSize: fontsize,
    }
  });
  return ui.Panel({
    widgets: [colorPolygon, description],
    layout: ui.Panel.Layout.Flow('horizontal')
  });
};

var makeLine = function(color, name, fontsize, fontweight) {
  var colorBox = ui.Label({
    style: {
      backgroundColor: color,
      padding: '1px 3px',
      margin: '6px 4px 4px 4px',
      width: '25px',
      height: '1px',
    }
  });
  var description = ui.Label({
    value: name,
    style: {margin: '0 0 4px 6px',
            fontWeight: fontweight,
            fontSize: fontsize, 
            whiteSpace: 'pre',
    }
  });
  return ui.Panel({
    widgets: [colorBox, description],
    layout: ui.Panel.Layout.Flow('horizontal')
  });
};

var makePoint = function(color, name, fontsize, fontweight) {
  var colorBox = ui.Label({
    style: {
      backgroundColor: color,
      padding: '3px',
      margin: '4px 14px 4px 14px',
    }
  });
  var description = ui.Label({
    value: name,
    style: {margin: '0 0 4px 6px',
            fontWeight: fontweight,
            fontSize: fontsize,
            whiteSpace: 'pre',
    }
  });
  return ui.Panel({
    widgets: [colorBox, description],
    layout: ui.Panel.Layout.Flow('horizontal')
  });
};

// Function to create legend panels for FeatureCollections (classification polygons) or images with discrete values.
function createLegend(subtitle, palette, references, fontsize) {
    var legendSubtitle = ui.Label(subtitle, {fontWeight: 'bold', fontSize: '14px', margin: '8px 0 4px 0', whiteSpace: 'pre'});
    var legendPanel = ui.Panel();  
    legendPanel.add(legendSubtitle);
    for (var i = 0; i < palette.length; i++) {
        var row = makeRow(palette[i], references[i], fontsize);
        legendPanel.add(row);
    }
    return legendPanel;
}

// Function to create legend panels for images with continuous values
function createColorBarLegend(subtitle, units, visParams) {
  function makeColorBarParams(palette) {
    return {
      bbox: [0, 0, 1, 0.1],
      dimensions: '100x10',
      format: 'png',
      min: 0,
      max: 1,
      palette: palette,
    };
  }

// Function to create legend panels title
function legendTitle(text) {
  return ui.Label(text, {
    fontWeight: 'bold',
    fontSize: '14px',
    margin: '8px 0 6px 0'
  });
}

// ----------------------- Conservation legend -----------------------
var conservationSubtitle = legendTitle('Áreas relevantes para la conservación');
var ref1 = makeLine('red', 'Corredores Ecológicos\n(Heidel et al. 2021)');
var ref2 = makeRow('orange', 'Áreas Irremplazables\n(Chehébar et al. 2013)');
var ref3 = makeRow('yellow', 'Áreas Prioritarias\n(Chehébar et al. 2013)')
var ref4 = makeRow('grey', 'Áreas Naturales Protegidas\n(IGN 2023)');
var conservationlegend = ui.Panel({widgets:[conservationSubtitle, ref1, ref2, ref3, ref4]});

// ----------------------- Soil / Land legends -----------------------
// Set display parameters
var windErosionPalette = ['#ffeeb0', '#f6e0a2', '#e9d69f', '#d3b27f', '#b99a5d', '#695613'];
var soilsPalette= ['#e41a1c', '#377eb8', '#4daf4a', '#ff7f00', '#f781bf', '#a65628', '#ffff33',
                    '#dede00', '#be8b4c', '#e6ab02', '#b8c2d4', '#ff6f61', '#984ea3'];
var salinityPalette = ['fff3c8','dca849','8c5c03', 'f0b673'];

var soilVisParams = {
  'Stock COS': {min: 0, max: 100, palette: ['blue', 'yellow', 'red'], opacity: setOpacity},
  'Erosión Hídrica': {min: 0, max: 30, palette: ['faf8cf', 'd9b845', '695613'], opacity: setOpacity},
  'Suelos Salinos': {min: 0, max: 3, palette: salinityPalette, opacity: setOpacity},
  'Erosión Eólica': {property: 'GRIDCODE', min: 0, max: 6, palette: windErosionPalette, opacity: setOpacity},
  'Ordenes de Suelos': {property: 'orden_code', min: 1, max: 13, palette: soilsPalette, opacity: setOpacity}
};

// Create Soil / Land legends
var COSLegend = createColorBarLegend("Stock COS (Gaitán et al. 2023)", "t/ha", soilVisParams['Stock COS']);

var salinitysoilReferences = ['No salino, no sódico', 'Salino', 'Salino-sódico', 'Sódico'];
var salinityLegend = createLegend('Suelos salinos 0-30 cm\n(Rodríguez et al. 2020)', salinityPalette, salinitysoilReferences);

var waterErosionLegend = createColorBarLegend('Erosión hídrica actual (Gaitán et al. 2017)',  '(t/ha/año)', soilVisParams['Erosión Hídrica']);

var windErosionReferences = erosion_eolica.sort('GRIDCODE').aggregate_array('CLASE_EP_T').distinct().getInfo();
var windErosionLegend = createLegend('Erosión eólica potencial\n(Colazo et al. 2008)', windErosionPalette, windErosionReferences);

var soilReferences = suelos_500.sort('orden_code').aggregate_array('orden_sue1').distinct().getInfo();
var soilLegend = createLegend('Órdenes de Suelos (Cruzate et al. 2013)', soilsPalette, soilReferences);

// ---------- Climate (historical and projections) legends -----------
// Set display parameters
var Temp_visParams = {
  'Temperatura Media Anual': {min: 2, max: 16, palette: ['blue', 'yellow', 'red']},
  'Tendencia Temperatura 2003-2012': {min: -0.2, max: 0.2, palette: ['blue', 'white', 'red']},
  'Tendencia Temperatura 2013-2022': {min: -0.2, max: 0.2, palette: ['blue', 'white', 'red']},
  'Cambio en Temperatura': {min: 0, max: 5, palette: ['white', 'yellow', 'red']}
};

var Prec_visParams = {
  'Precipitación Media Anual': {min: 100, max: 1100, palette: ['white','blue'], opacity: setOpacity},
  'Tendencia Precipitación 2003-2012': {min: -20, max: 20, palette: ['ffea46', 'f2f27e', 'd3d398','white','8793c9','5b74de','002d8f'], opacity: setOpacity},
  'Tendencia Precipitación 2013-2022': {min: -20, max: 20, palette: ['ffea46', 'f2f27e', 'd3d398','white','8793c9','5b74de','002d8f'], opacity: setOpacity},
  'Cambio en Precipitación': {min: -40, max: 40, palette: ['ffea46', 'f2f27e', 'd3d398','white','8793c9','5b74de','002d8f'], opacity: setOpacity}
};

// Create climate legends 
var MAPLegend = createColorBarLegend("Precipitación Media Anual\n(Terraclimate 2023)", "mm", Prec_visParams['Precipitación Media Anual']);
var MAP2003_2012Legend = createColorBarLegend("Tendencia Precipitación 2003-2012\n(Terraclimate 2023)", "mm/año", Prec_visParams['Tendencia Precipitación 2003-2012']);
var MAP2013_2022Legend = createColorBarLegend("Tendencia Precipitación 2013-2022\n(Terraclimate 2023)", "mm/año", Prec_visParams['Tendencia Precipitación 2013-2022']);
var CMIP6_MAP_Legend = createColorBarLegend("Cambio Proyectado en Precipitación\nal 2081-2100 (IPCC-WGI 2023)", "%", Prec_visParams['Cambio en Precipitación']);
var MATLegend = createColorBarLegend("Temperatura Media Anual\n(Terraclimate 2023)", "°C", Temp_visParams['Temperatura Media Anual']);
var MAT2003_2012Legend = createColorBarLegend("Tendencia Temperatura 2003-2012\n(Terraclimate 2023)", "°C/año", Temp_visParams['Tendencia Temperatura 2003-2012']);
var MAT2013_2022Legend = createColorBarLegend("Tendencia Temperatura 2013-2022\n(Terraclimate 2023)", "°C/año", Temp_visParams['Tendencia Temperatura 2003-2012']);
var CMIP6_MAT_Legend = createColorBarLegend("Cambio Proyectado en Temperatura\nal 2081-2100 (IPCC-WGI 2023)", "°C", Temp_visParams['Cambio en Temperatura']);

/* SAOtta */
