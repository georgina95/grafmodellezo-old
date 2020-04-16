sap.ui.define([
	"elte/Grafmodellezo/controller/BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("elte.Grafmodellezo.controller.graphs.Graph1", {
		onInit: function() {
			this.setRouteMatched("Graph1", this.onRouteMatched);
		},
		
		onRouteMatched: function(oEvent) {
			this.setLayout("OneColumn");
		}
	});

});