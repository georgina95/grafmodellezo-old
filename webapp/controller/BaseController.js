sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast"
], function (Controller, JSONModel, MessageToast) {
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
		},
		
		/** Back-end operation started
		 * Handle the busy indicator
		 **/
		onOperationStarted: function () {
			var oComponent = this.getOwnerComponent();
			oComponent._onOperationStarted();
		},

		/** Back-end operation ended
		 * Handle the busy indicator
		 **/
		onOperationEnded: function () {
			var oComponent = this.getOwnerComponent();
			oComponent._onOperationEnded();
		},
		
		/** Back-end operation ended in failure
		 * inform the user
		 **/
		onError: function (oError) {
			this.onOperationEnded();
			var sErrorMessage = this.getView().getModel("i18n").getProperty("errorMessage");
			MessageToast.show(sErrorMessage);
		},
		
		/** FORMATTERS **/
		getShortString: function (sString) {
			if(sString) {
				var sShort = sString.slice(0, 80);
				sShort += (sString.length > 80) ? "..." : "";
				return sShort;
			} else {
				return "";
			}
		}

	});
});