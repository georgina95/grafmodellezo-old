/**
 * CustomSegmentedButton
 * extends SegmentedButton
 * 
 * The extension was needed because the SegmentedButtonItems might not store in the key property the relevant information that we require.
 * An additional field was introduced to those items, using the data extendion with the object property name "key".
 * 
 * In order to access the selected SegmentedButtonItem's data:key from the SegmentedButton itself, a new property was introduced: "selectedArbitraryKey".
 * The property is maintained when the selection is changed, therefore the "_buttonPressed" event handler was overridden, 
 * extended with an additional operation detailed in the "_setSelectedArbitraryKey" function.
 * 
 * NOTE:
 * Setting the "selectedArbitraryKey" property of the CustomSegmentedButton itself will not have affect the selectedKey property, it might cause inconsistencies.
 * 
 **/

sap.ui.define(
    ['sap/m/SegmentedButton'],
    function(SegmentedButton) {
        var CustomSegmentedButton = SegmentedButton.extend("control.CustomSegmentedButton",{
            metadata: {
                properties: {
                    selectedArbitraryKey: { type: "string", group: "Data", defaultValue: "", bindable: "bindable" }
                }
            },
            
            renderer: function(oRm,oControl){
                sap.m.SegmentedButtonRenderer.render(oRm,oControl); //use supercass renderer routine
    
            }
        });
        
        CustomSegmentedButton.prototype._buttonPressed = function (oEvent) {
        	/** 
			 * Use the same operation as is in the default SegmentedButton 
			 **/
			
        	var oButtonPressed = oEvent.getSource(),
			oItemPressed;
			
			if (this.getSelectedButton() !== oButtonPressed.getId()) {
				// CSN# 0001429454/2014: remove class for all other items
				this.getButtons().forEach(function (oButton) {
					oButton.$().removeClass("sapMSegBBtnSel");
					oButton.$().attr("aria-checked", false);
				});
	
				//get the corresponding item regarding the pressed button
				oItemPressed = this.getItems().filter(function (oItem) {
					return oItem.oButton === oButtonPressed;
				})[0];
	
				oButtonPressed.$().addClass("sapMSegBBtnSel");
				oButtonPressed.$().attr("aria-checked", true);
	
				this.setAssociation('selectedButton', oButtonPressed, true);
				this.setProperty("selectedKey", this.getSelectedKey(), true);
	
				this.setAssociation('selectedItem', oItemPressed, true);
				this.fireSelectionChange({
					item: oItemPressed
				});
	
				// support old API
				this.fireSelect({
					button: oButtonPressed,
					id: oButtonPressed.getId(),
					key: this.getSelectedKey()
				});
				
				/** 
				 * Here, add some custom functionality
				 **/
				
				this._setSelectedArbitraryKey(oItemPressed);
			}
		};
		
		CustomSegmentedButton.prototype._setSelectedArbitraryKey = function (oItem) {
			var sArbitraryKey = oItem.data("key") || "";
			
			this.setSelectedArbitraryKey(sArbitraryKey);
		};
	
	return CustomSegmentedButton;
});
