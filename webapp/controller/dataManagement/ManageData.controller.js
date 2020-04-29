sap.ui.define([
	"elte/Grafmodellezo/controller/BaseController",
	"sap/ui/core/Fragment"
], function (BaseController, Fragment) {
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
		},
		
		onObjectTypeSelectionChange: function(oEvent) {
			var oSelectedItem = oEvent.getParameter("item");
			var sSelectedKey = oSelectedItem.getProperty("key");
			
			// Load the selected list into the content of the Dynamic Page
			var oFragment = this[sSelectedKey + "Fragment"];
			if (!oFragment) {
				Fragment.load({
					id: sSelectedKey + "Fragment",
					name: "elte.Grafmodellezo.fragment.objectLists." + sSelectedKey,
					controller: this,
				}).then(jQuery.proxy(this.onFragmentLoaded, this));
			} else {
				var oPage = this.getView().byId("masterPage");
				oPage.setContent(oFragment);
			}
		},
		
		onFragmentLoaded: function(oFragment) {
			var sId = oFragment.getId().split("--")[0];
			this[sId] = oFragment;
			sap.m.MessageToast.show("fragment loaded");
			
			var oPage = this.getView().byId("masterPage");
			oPage.setContent(oFragment);
		}
	});

});