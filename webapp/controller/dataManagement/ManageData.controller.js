sap.ui.define([
	"elte/Grafmodellezo/controller/BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("elte.Grafmodellezo.controller.dataManagement.ManageData", {
		onInit: function() {
			this.setRouteMatched("ManageData", this.onRouteMatched);
		},
		
		onRouteMatched: function(oEvent) {
			this.setLayout("OneColumn");
		},
		
		onPressButton: function(oEvent) {
			this.navTo("ManageDataDetail", {
				id: "1234"
			}, true);
		}
	});

});