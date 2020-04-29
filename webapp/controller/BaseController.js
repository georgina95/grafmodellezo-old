sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("elte.Grafmodellezo.controller.BaseController", {
		setLayout: function (sLayout) {
			var oComponent = this.getOwnerComponent();
			var oModel = oComponent.getModel("Settings");

			oModel.setProperty("/layout", sLayout);
		},

		setRouteMatched: function (sRoute, fHandler) {
			var oComponent = this.getOwnerComponent();
			var oRouter = oComponent.getRouter();
			var oRoute = oRouter.getRoute(sRoute);
			
			oRoute.attachPatternMatched(fHandler, this);
		},
		
		navTo: function(sRoute, oParams, bReplace) {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo(sRoute, oParams, bReplace);
		}
	});
});