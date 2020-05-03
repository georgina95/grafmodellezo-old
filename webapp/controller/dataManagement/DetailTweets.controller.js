sap.ui.define([
	"elte/Grafmodellezo/controller/dataManagement/DetailBaseController",
	"sap/ui/model/json/JSONModel"
], function (DetailBaseController, JSONModel) {
	"use strict";

	return DetailBaseController.extend("elte.Grafmodellezo.controller.dataManagement.DetailTweets", {
		
		onInit: function () {
			var oModel = new JSONModel({ });
			this.getView().setModel(oModel, "Object");
			
			this.setRouteMatched("DetailTweets", this.onRouteMatched);
		},
		
		onRouteMatched: function(oEvent) {
			this.onOperationEnded();
			this.setLayout("TwoColumnsMidExpanded");
			
			var oId = oEvent.getParameter("arguments").ID;
			var oParameters = {
				"$expand": "LINK_TO_USER,LINK_TO_PLACE",
			};
			
			this.readObject("tweets", oId, oParameters);
		}
	

		
	});

});