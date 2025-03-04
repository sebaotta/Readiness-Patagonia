/**
* selectors.js
*
* This script manages the selection and visualization of thematic layers in the application.
* It includes functionality to update the displayed map layers based on user selections,
* ensuring that only one layer from the predefined list is shown at a time.
*
* Features:
* - Defines a list of mutually exclusive layers (removeLayerNames).
* - Implements the updateSoilLayer() function to remove previously selected layers and add the new one.
* - Removes associated legends when switching layers.
* - Creates a UI dropdown selector (soilLayerSelect) for users to choose soil-related layers.
*
* Developed by S. Otta
*/

// List of FeatureCollections and raster layers (names) that can only be loaded and displayed one at a time.
var removeLayerNames = ['Stock COS', 'Water erosion', 'Saline soils', 'Wind erosion', 'Soil orders','Vegetation units',
                        'Ecological areas','Annual NDVI Trend 2003-2012', 'Annual NDVI Trend 2013-2022','Anomalía de NDVI Ene-Feb 2024',
                        'Anomalía de NDVI Mar-Abr 2024', 'Anomalía de NDVI May-Jun 2024','Mean Annual Precipitation',
                        'Precipitation Trend 2003-2012','Precipitation Trend 2013-2022','Mean Annual Temperature',
                        'Temperature Trend 2003-2012','Temperature Trend 2013-2022','Precipitation Change CMIP6 SSP1-2.6',
                        'Precipitation Change CMIP6 SSP5-8.5','Temperature Change CMIP6 SSP1-2.6', 'Temperature Change CMIP6 SSP5-8.5',
                        'socioLayer', 'livestockLayer'
];

// Function to update the map according to the selected layer
function updateSoilLayer(selection) {
  var layers = leftMap.layers();
  // Remove selector layers
  for (var i = layers.length() - 1; i >= 0; i--) {
    var layer = layers.get(i);
    if (removeLayerNames.indexOf(layer.getName()) !== -1) {
      leftMap.remove(layer);
    }
  }
  // Remove associated legends
  legendPanel.remove(COSLegend);
  legendPanel.remove(salinityLegend);
  legendPanel.remove(waterErosionLegend);
  legendPanel.remove(windErosionLegend);
  legendPanel.remove(soilLegend);
  legendPanel.remove(vegetationLegend);
  legendPanel.remove(ecologicalLegend);
  legendPanel.remove(NDVIAnomalyLegend);
  legendPanel.remove(NDVITrendLegend);
  legendPanel.remove(MAPLegend);
  legendPanel.remove(MAP2003_2012Legend);
  legendPanel.remove(MAP2013_2022Legend);
  legendPanel.remove(MATLegend);
  legendPanel.remove(MAT2003_2012Legend);
  legendPanel.remove(MAT2013_2022Legend);
  legendPanel.remove(PopDensLegend);
  legendPanel.remove(RuralityLegend);
  legendPanel.remove(FemininityLegend);
  legendPanel.remove(DependencyLegend);
  legendPanel.remove(EducationPrimLegend);
  legendPanel.remove(EducationSecLegend);
  legendPanel.remove(EducationUnivLegend);
  legendPanel.remove(NBILegend);
  legendPanel.remove(indigenousLegend);
  legendPanel.remove(EAPLegend);
  legendPanel.remove(LivestockLegend)

  if (!selection) return;
 // Add selected layer and its references
  var selectedLayer;
  var selectedLayerLegend;
  switch (selection) {
    case 'Stock COS':
      selectedLayer = ui.Map.Layer(stock_COS, soilVisParams['Stock COS'], selection);
      selectedLayerLegend = COSLegend;
      break;
    case 'Saline soils':
      selectedLayer = ui.Map.Layer(suelos_salinos, soilVisParams['Suelos Salinos'], selection);
      selectedLayerLegend = salinityLegend;
      break;
    case 'Water erosion':
      selectedLayer = ui.Map.Layer(erosion_hidrica, soilVisParams['Erosión Hídrica'], selection);
      selectedLayerLegend = waterErosionLegend;
      break;
    case 'Wind erosion':
      selectedLayer = ui.Map.Layer(erosion_eolica_image, soilVisParams['Erosión Eólica'], selection);
      selectedLayerLegend = windErosionLegend;
      break;
    case 'Soil orders':
      selectedLayer = ui.Map.Layer(suelos_500_image, soilVisParams['Ordenes de Suelos'], selection);
      selectedLayerLegend = soilLegend;
      break;
  }

  if (selectedLayer) {
    leftMap.layers().insert(0, selectedLayer);
    legendPanel.add(selectedLayerLegend)
  }
}

// Create the Soil layer selector
var layerSelectorStyle = { // Define the selector style dictionary
    backgroundColor: 'white',
    fontSize: '22px',
    fontFamily: 'Arial',
    fontWeight: '100',
    textAlign: 'left',
    width: '180px',
};

var soilLayerSelect = ui.Select({
  items: ['Suelos - Degradación','Stock COS', 'Erosión Hídrica', 'Suelos Salinos', 'Erosión Eólica', 'Ordenes de Suelos'],
  placeholder: 'Suelos - Degradación',
  onChange: updateSoilLayer,
  style: layerSelectorStyle
});
