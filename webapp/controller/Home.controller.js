sap.ui.define([
	"elte/Grafmodellezo/controller/BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("elte.Grafmodellezo.controller.Home", {
		
		/**	LIFECYCLE EVENTS	**/
		onInit: function() {
			this.setRouteMatched("Home", this.onRouteMatched);
		},
		
		onRouteMatched: function(oEvent) {
			this.setLayout("OneColumn");
		},
		
		
		/** CUSTOM EVENTS	**/
		press: function(oEvent) {
			var oSource = oEvent.getSource();
			var oBindingContext = oSource.getBindingContext("Settings");
			var oModel = oBindingContext.getModel();
			var sPath = oBindingContext.getPath();
			
			var oObject = oModel.getProperty(sPath);
			this.navTo(oObject.route, {}, false);
		},
		
		/**	FORMATTERS	**/
		getTranslation: function(sText) {
			var oModel = this.getView().getModel("i18n");
			var sTranslation = oModel.getProperty(sText);
			
			return (sTranslation) ? sTranslation : sText;
		}
	});

});