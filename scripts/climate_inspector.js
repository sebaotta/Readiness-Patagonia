/**
 * climate_inspector.js
 *
 * This script manages the Climate Inspector functionalities in the application.
 * It allows users to visualize historical climate data, projected climate changes,
 * and interact with different climate variables through UI components.
 *
 * Features:
 * - Defines visualization parameters for temperature and precipitation layers.
 * - Implements updateClimateLayer() to dynamically update the displayed climate data.
 * - Provides UI elements: climate layer selector, precipitation and temperature buttons.
 * - Manages a split panel for visualizing climate change scenarios side by side.
 * - Includes a close button for exiting the climate projections split panel.
 *
 * Developed by S. Otta
 */

// Define visualization parameters
var Temp_visParams = {
  'Mean Annual Temperature': {min: 2, max: 16, palette: ['blue', 'yellow', 'red']},
  'Temperature Trend': {min: -0.2, max: 0.2, palette: ['blue', 'white', 'red']},
  'Temperature Change': {min: 0, max: 5, palette: ['white', 'yellow', 'red']}
};

var Prec_visParams = {
  'Mean Annual Precipitation': {min: 100, max: 1100, palette: ['white','blue'], opacity: setOpacity},
  'Precipitation Trend': {min: -20, max: 20, palette: ['ffea46', 'f2f27e', 'd3d398','white','8793c9','5b74de','002d8f'], opacity: setOpacity},
  'Precipitation Change': {min: -40, max: 40, palette: ['ffea46', 'f2f27e', 'd3d398','white','8793c9','5b74de','002d8f'], opacity: setOpacity}
};

// Function to update the map based on the selected climate layer
function updateClimateLayer(selection) {
  var layers = leftMap.layers();
  
  // Remove previous climate layers
  for (var i = layers.length() - 1; i >= 0; i--) {
    var layer = layers.get(i);
    if (removeLayerNames.indexOf(layer.getName()) !== -1) {
      leftMap.remove(layer);
    }
  }
  
  // Remove associated legends
  legendPanel.clear();

  if (!selection) return;

  var selectedLayer;
  var selectedLayerLegend;
  
  // Match selection to corresponding layer and legend (case names remain in Spanish)
  switch (selection) {
    case 'Precipitación Media Anual':
      selectedLayer = ui.Map.Layer(MAP, Prec_visParams['Mean Annual Precipitation'], selection);
      selectedLayerLegend = MAPLegend;
      break;
    case 'Tendencia Precipitación 2003-2012':
      selectedLayer = ui.Map.Layer(MAP_trend_2003_2012, Prec_visParams['Precipitation Trend'], selection);
      selectedLayerLegend = MAP2003_2012Legend;
      break;
    case 'Tendencia Precipitación 2013-2022':
      selectedLayer = ui.Map.Layer(MAP_trend_2013_2022, Prec_visParams['Precipitation Trend'], selection);
      selectedLayerLegend = MAP2013_2022Legend;
      break;
    case 'Temperatura Media Anual':
      selectedLayer = ui.Map.Layer(MAT, Temp_visParams['Mean Annual Temperature'], selection);
      selectedLayerLegend = MATLegend;
      break;
    case 'Tendencia Temperatura 2003-2012':
      selectedLayer = ui.Map.Layer(MAT_trend_2003_2012, Temp_visParams['Temperature Trend'], selection);
      selectedLayerLegend = MAT2003_2012Legend;
      break;
    case 'Tendencia Temperatura 2013-2022':
      selectedLayer = ui.Map.Layer(MAT_trend_2013_2022, Temp_visParams['Temperature Trend'], selection);
      selectedLayerLegend = MAT2013_2022Legend;
      break;
  }

  if (selectedLayer) {
    leftMap.layers().insert(0, selectedLayer);
    legendPanel.add(selectedLayerLegend);
  }
}

// Create climate layer selector (Items remain in Spanish)
var climateLayerSelect = ui.Select({
  items: ['Clima histórico', 'Precipitación Media Anual', 'Tendencia Precipitación 2003-2012', 'Tendencia Precipitación 2013-2022', 
          'Temperatura Media Anual', 'Tendencia Temperatura 2003-2012', 'Tendencia Temperatura 2013-2022'],
  placeholder: 'Clima histórico',
  onChange: updateClimateLayer,
  style: layerSelectorStyle3
});

// Function to update climate projections
function updateClimateProjection(variable) {
  ui.root.remove(leftMap);
  
  // Remove previous layers
  leftMap.layers().reset([]);
  rightMap.layers().reset([]);

  // Remove previous legends
  legendPanel.clear();

  if (variable === 'precipitation') {
    legendPanel.add(CMIP6_MAP_Legend);
    leftMap.layers().insert(0, ui.Map.Layer(CMIP6_MAP_SSP1_26, Prec_visParams['Precipitation Change'], 'Cambio en Precipitación CMIP6 SSP1-2.6'));
    rightMap.addLayer(CMIP6_MAP_SSP5_85, Prec_visParams['Precipitation Change'], 'Cambio en Precipitación CMIP6 SSP5-8.5');
  } else {
    legendPanel.add(CMIP6_MAT_Legend);
    leftMap.layers().insert(0, ui.Map.Layer(CMIP6_MAT_SSP1_26, Temp_visParams['Temperature Change'], 'Cambio en Temperatura CMIP6 SSP1-2.6'));
    rightMap.addLayer(CMIP6_MAT_SSP5_85, Temp_visParams['Temperature Change'], 'Cambio en Temperatura CMIP6 SSP5-8.5');
  }

  if (!ui.root.widgets().contains(splitPanel)) {
    splitPanel = ui.SplitPanel({
      firstPanel: leftMap,
      secondPanel: rightMap,
      orientation: 'horizontal',
      wipe: true
    });

    ui.root.insert(1, splitPanel);
    leftMap.add(CMIPLabelLeft);
    leftMap.add(closeClimateButton);
    rightMap.add(CMIPLabelRight);
  }
}

// Climate projection buttons
var precipitationButton = ui.Button({
  imageUrl: IconName('cloud'),
  label: 'Precipitación',
  style: {backgroundColor: 'e6eef7', color: 'blue', fontSize: '16px', padding: '0px', margin: '10px'},
  onClick: function() {
    updateClimateProjection('precipitation');
  }
});

var temperatureButton = ui.Button({
  imageUrl: IconName('thermostat'),
  label: 'Temperatura',
  style: {backgroundColor: 'e6eef7', color: 'blue', fontSize: '16px', padding: '0px', margin: '10px'},
  onClick: function() {
    updateClimateProjection('temperature');
  }
});

// Climate control panel
var climateControlPanel = ui.Panel({
  widgets: [climateLayerSelect, precipitationButton, temperatureButton],
  layout: ui.Panel.Layout.Flow('horizontal'),
  style: {backgroundColor: 'e6eef7', width: '95%'}
});

// Climate Inspector Panel
var climateInspectorTitle = ui.Label('Climate Inspector', {
  fontWeight: 'bold',
  fontSize: '16px',
  backgroundColor: 'e6eef7',
  color: '699bda'
});

var climateInspectorPanel = ui.Panel({
  widgets: [climateInspectorTitle, climateControlPanel],
  layout: ui.Panel.Layout.Flow('vertical'),
  style: {backgroundColor: 'e6eef7', padding: '13px', margin: '20px 0px'}
});
