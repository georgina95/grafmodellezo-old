sap.ui.define([
	"elte/Grafmodellezo/controller/BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("elte.Grafmodellezo.controller.dataManagement.ManageDataDetail", {
		onInit: function() {
			this.setRouteMatched("ManageDataDetail", this.onRouteMatched);
		},
		
		onRouteMatched: function(oEvent) {
			this.setLayout("TwoColumnsMidExpanded");
		},
	});

});