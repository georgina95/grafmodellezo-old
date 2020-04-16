sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"elte/Grafmodellezo/model/models"
], function (UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("elte.Grafmodellezo.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// enable routing
			this.getRouter().initialize();

			// set the device model
			this.setModel(models.createDeviceModel(), "device");

			//create a model to handle the layout settings
			var oModel = new sap.ui.model.json.JSONModel();
				oModel.loadData("projectSettings.json");
			this.setModel(oModel, "Settings");
		},
		
		getContentDensityClass : function () {
			if (!this._sContentDensityClass) {
				if (!Device.support.touch) {
					this._sContentDensityClass = "sapUiSizeCompact";
				} else {
					this._sContentDensityClass = "sapUiSizeCozy";
				}
			}
			return this._sContentDensityClass;
		}

	});
});