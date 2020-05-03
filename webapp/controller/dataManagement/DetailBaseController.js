sap.ui.define([
	"elte/Grafmodellezo/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast"
], function (BaseController, JSONModel, MessageToast) {
	"use strict";

	return BaseController.extend("elte.Grafmodellezo.controller.DetailBaseController", {
		
		readObject: function(sObjectType, sId, oParameters) {
			var oModel = this.getView().getModel("Twitter");
			var fSuccess = function(oData) {
				var oObjectModel = this.getView().getModel("Object");
					oObjectModel.setProperty("/", oData);
				
				this.onOperationEnded();
			};
			
			this.onOperationStarted();
			oModel.read("/" + sObjectType + "('" + sId + "')", {
				urlParameters: oParameters,
				success: jQuery.proxy(fSuccess, this),
				error: jQuery.proxy(this.onError, this)
			});
		},
		
		onCloseDetailPage: function(oEvent) {
			this.setLayout("OneColumn");
		}
		
	});
});