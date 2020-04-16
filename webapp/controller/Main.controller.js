sap.ui.define([
	"elte/Grafmodellezo/controller/BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("elte.Grafmodellezo.controller.Main", {
		onInit: function () {
		},
		
		onNavBack: function(oEvent) {
			var oHistory = window.history;
			var iLength = oHistory.length;
			if(iLength > 1) {
				oHistory.go(-1);
			}
		}
	});
});