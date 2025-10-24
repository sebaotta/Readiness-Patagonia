/**
 * checkboxs.js
 *
 * This script manages the checkboxes used to enable or disable specific thematic layers in the application.
 * It includes functions to add layers to the map and toggle visibility.
 *
 * Features:
 * - Implements a checkbox (conservationCheckbox) to toggle conservation-related layers.
 * - Adds or removes the corresponding layers and legend entries when the checkbox state changes.
 *
 * Developed by S. Otta
 */

// Variable to track the visibility of conservation layers
var conservationlayersVisible = false;

// Function to add conservation layers to the left map
function addConservationLayers() {
  leftMap.addLayer(ANP, {color: 'grey'}, 'Protected Natural Areas');
  leftMap.addLayer(areas_prioritarias, {color: 'yellow'}, 'Priority Areas');
  leftMap.addLayer(areas_irremplazables, {color: 'orange'}, 'Irreplaceable Areas');
  leftMap.addLayer(corredores_propuestos, {color: 'red'}, 'Proposed Corridors');
}

// Create a checkbox to toggle conservation layers and legend
var conservationCheckbox = ui.Checkbox({
  label: 'Áreas relevantes para la conservación',
  style:{whiteSpace: 'pre'},  // Line break indicated by \n
  onChange: function(checked) {
    if (checked) {
      addConservationLayers();
      legendPanel.insert(1, conservationlegend);
      conservationlayersVisible = true;
    } else {
      removeLayersByName(ConservationLayers); // Function to remove conservation layers from the left map
      legendPanel.remove(conservationlegend);
      conservationlayersVisible = false;
    }
  }
});
