sap.ui.define([
	"elte/Grafmodellezo/controller/BaseController",
	"sap/ui/core/Fragment",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageToast"
], function (BaseController, Fragment, JSONModel, Filter, FilterOperator, MessageToast) {
	"use strict";

	return BaseController.extend("elte.Grafmodellezo.controller.dataManagement.ManageData", {

		/** LIFECYCLE EVENTS **/
		onInit: function () {
			this.setRouteMatched("ManageData", this.onRouteMatched);

			var oObjectModel = new JSONModel({
				tweets: [],
				users: [],
				places: [],
				hashtags: [],
				usersmentions: []
			});

			var oTechnicalModel = new JSONModel({
				filterBar: {
					tweets: {
						created_at: {
							key1: new Date(2006, 4, 21),
							operator: "BT",
							value1: "",
							key2: new Date(),
							value2: "",
							objectPath: "CREATED_AT"
						},
						id: {
							key1: "",
							operator: "Contains",
							value1: "",
							key2: "",
							value2: "",
							objectPath: "ID"
						},
						place_id: {
							key1: "",
							operator: "EQ",
							value1: "",
							key2: "",
							value2: "",
							objectPath: "PLACE_ID"
						},
						text: {
							key1: "",
							operator: "Contains",
							value1: "",
							key2: "",
							value2: "",
							objectPath: "TEXT"
						},
						truncated: {
							key1: "True",
							operator: "EQ",
							value1: "",
							key2: "",
							value2: "",
							objectPath: "TRUNCATED"
						},
						user_id: {
							key1: "",
							operator: "Contains",
							value1: "",
							key2: "",
							value2: "",
							objectPath: "USER_ID"
						}
					},
					users: {
						created_at: {
							key1: new Date(2006, 4, 21),
							operator: "BT",
							value1: "",
							key2: new Date(),
							value2: "",
							objectPath: "CREATED_AT"
						},
						id: {
							key1: "",
							operator: "Contains",
							value1: "",
							key2: "",
							value2: "",
							objectPath: "ID"
						},
						description:		{ key1: "", operator: "Contains", value1: "", key2: "", value2: "", objectPath: "DESCRIPTION" },
						followers_count:	{ key1: 0, operator: "BT", value1: "", key2: 0, value2: "", objectPath: "FOLLOWERS_COUNT" },
						location:			{ key1: "", operator: "Contains", value1: "", key2: "", value2: "", objectPath: "LOCATION" },
						name:				{ key1: "", operator: "Contains", value1: "", key2: "", value2: "", objectPath: "NAME" },
						screen_name:		{ key1: "", operator: "Contains", value1: "", key2: "", value2: "", objectPath: "SCREEN_NAME" },
						statuses_count: 	{ key1: 0, operator: "BT", value1: "", key2: 0, value2: "", objectPath: "STATUSES_COUNT" }
					},
					places: {
						id:				{ key1: "", operator: "Contains", value1: "", key2: "", value2: "", objectPath: "ID" },
						name:			{ key1: "", operator: "Contains", value1: "", key2: "", value2: "", objectPath: "NAME" },
						full_name:		{ key1: "", operator: "Contains", value1: "", key2: "", value2: "", objectPath: "FULL_NAME" },
						country:		{ key1: "", operator: "EQ", value1: "", key2: "", value2: "", objectPath: "COUNTRY_CODE" },
						place_type: 	{ key1: "", operator: "EQ", value1: "", key2: "", value2: "", objectPath: "PLACE_TYPE" }
					},
					hashtags: {
						created_at: { key1: new Date(2006, 4, 21), operator: "BT", value1: "", key2: new Date(), value2: "", objectPath: "CREATED_AT" },
						user_id:	{ key1: "", operator: "EQ", value1: "", key2: "", value2: "", objectPath: "USER_ID" },
						text:		{ key1: "", operator: "Contains", value1: "", key2: "", value2: "", objectPath: "TEXT" }
					},
					usermentions: {
						created_at: { key1: new Date(2006, 4, 21), operator: "BT", value1: "", key2: new Date(), value2: "", objectPath: "CREATED_AT" },
						user_id:	{ key1: "", operator: "EQ", value1: "", key2: "", value2: "", objectPath: "USER_ID" },
						mentioned_user_id:		{ key1: "", operator: "EQ", value1: "", key2: "", value2: "", objectPath: "MENTIONED_USER_ID" }
					},
				},
				current_type: 'tweets',
				max_followers: 0,
				max_statuses: 0,
				place_types: []
			});

			var oValueHelpModel = new JSONModel({});

			this.getView().setModel(oObjectModel, "Objects");
			this.getView().setModel(oTechnicalModel, "Technical");
			this.getView().setModel(oValueHelpModel, "ValueHelp");
		},

		onRouteMatched: function (oEvent) {
			this.setLayout("OneColumn");

			this._initSegmentedButtonColors();
			this._initFilterBoundaries();
			this._initPlaceTypes();
		},
		
		
		/** PRIVATE METHODS **/

		_initPlaceTypes: function () {
			this.readPlaceTypes();
		},

		_initFilterBoundaries: function () {
			var fSuccessReadingMaxFollowers = function(iMax) {
				this.getView().getModel("Technical").setProperty("/filterBar/users/followers_count/key2", iMax);
			};
			var fSuccessReadingMaxStatuses = function(iMax) {
				this.getView().getModel("Technical").setProperty("/filterBar/users/statuses_count/key2", iMax);
			};
			this.readMaxFollowers(fSuccessReadingMaxFollowers);
			this.readMaxStatuses(fSuccessReadingMaxStatuses);
		},

		_initSegmentedButtonColors: function () {
			var oSegmentedButton = this.getView().byId("tweetTruncatedSegmentedButton");
			var aButtons = oSegmentedButton.getItems();

			var oPositiveButton = aButtons.find(function (oButton) {
				return oButton.getKey() === "True";
			});
			var oNegativeButton = aButtons.find(function (oButton) {
				return oButton.getKey() === "False";
			});

			oPositiveButton.oButton.addStyleClass("myGreen");
			oNegativeButton.oButton.addStyleClass("myRed");
		},

		// collect and re-form the filters on the objects
		_createFilters: function (sObjectType) {
			var oFilterModel = this.getView().getModel("Technical");
			var aFilters = oFilterModel.getProperty("/filterBar/" + sObjectType);

			var aFilterObjects = [];
			for (var sProp in aFilters) {
				var oFilter = aFilters[sProp];
				if (oFilter.key1 !== "") {
					//If there are two parameters we should check their sequence
					if (oFilter.key2 !== "") {
						if (oFilter.key1 > oFilter.key2) {
							var oKey1 = oFilter.key1;
							oFilter.key1 = oFilter.key2;
							oFilter.key2 = oKey1;
						}
					}
					var oFilterObject = new Filter({
						path: oFilter.objectPath,
						operator: oFilter.operator,
						value1: oFilter.key1,
						value2: oFilter.key2
					});
					aFilterObjects.push(oFilterObject);
				}
			}

			return aFilterObjects;
		},

		_initValueHelpBinding: function (sPath, oTemplate) {
			var oList = this._valueHelpDialog;

			oList.bindAggregation("items", {
				path: sPath,
				template: oTemplate,
				templateShareable: false
			});
		},

		/** EVENT HANDLERS **/
		onObjectPress: function (oEvent) {
			var sObjectType = this.getView().getModel("Technical").getProperty("/current_type");
			var sPath = "Detail" + sObjectType[0].toUpperCase() + sObjectType.slice(1, sObjectType.length);
			
			var oPressedItem = oEvent.getParameter("listItem");
			var oBindingContext = oPressedItem.getBindingContext("Objects");
			var sId = oBindingContext.getModel().getProperty(oBindingContext.getPath()).ID;
			
			this.onOperationStarted();
			this.navTo(sPath, {
				ID: sId
			}, true);
		},

		onObjectTypeSelectionChange: function (oEvent) {
			var oSelectedItem = oEvent.getParameter("item");
			var sSelectedKey = oSelectedItem.getProperty("key");

			// Load the selected list into the content of the Dynamic Page
			var oFragment = this[sSelectedKey + "Fragment"];
			if (!oFragment) {
				Fragment.load({
					id: sSelectedKey + "Fragment",
					name: "elte.Grafmodellezo.fragment.objectLists." + sSelectedKey,
					controller: this
				}).then(jQuery.proxy(this.onFragmentLoaded, this));
			} else {
				var oPage = this.getView().byId("masterPage");
				oPage.setContent(oFragment);
			}

			this.getView().getModel("Technical").setProperty("/current_type", sSelectedKey);
		},

		onFragmentLoaded: function (oFragment) {
			var sIdentifier = oFragment.getId().split("--")[0];
			this[sIdentifier] = oFragment;
			sap.m.MessageToast.show("fragment loaded");

			var oPage = this.getView().byId("masterPage");
			oPage.setContent(oFragment);
		},

		onFilter: function (oEvent) {
			var sObjectType = this.getView().getModel("Technical").getProperty("/current_type");
			var aFilters = this._createFilters(sObjectType);

			var oParameters = (sObjectType === "usermentions") ? { "$expand": "LINK_TO_CREATOR_USER,LINK_TO_MENTIONED_USER" } : {};
			this.readData(sObjectType, aFilters, oParameters);
		},

		onValueHelpPlace: function (oEvent) {
			var fSuccess = function () {
				var sPath = "ValueHelp>/places";
				var oTemplate = new sap.m.StandardListItem({
					title: "{ValueHelp>NAME}",
					description: "{ValueHelp>ID}",
					type: "Active"
				});

				this.onValueHelpDialog(sPath, oTemplate, "ID", "NAME", "/tweets/place_id/");
			};

			var sReadPath = "places";
			var sModelPath = "places";
			this.readValueHelp(sReadPath, sModelPath, fSuccess);
		},

		onValueHelpUser: function (oEvent) {
			var fSuccess = function () {
				var sPath = "ValueHelp>/users";
				var oTemplate = new sap.m.StandardListItem({
					title: "{ValueHelp>NAME}",
					description: "{ValueHelp>ID}",
					type: "Active"
				});

				this.onValueHelpDialog(sPath, oTemplate, "ID", "NAME", "/tweets/user_id/");
			};

			var sReadPath = "users";
			var sModelPath = "users";
			this.readValueHelp(sReadPath, sModelPath, fSuccess);
		},
		
		onValueHelpCountry: function (oEvent) {
			var fSuccess = function () {
				var sPath = "ValueHelp>/countries";
				var oTemplate = new sap.m.StandardListItem({
					title: "{ValueHelp>COUNTRY}",
					description: "{ValueHelp>COUNTRY_CODE}",
					type: "Active"
				});

				this.onValueHelpDialog(sPath, oTemplate, "COUNTRY_CODE", "COUNTRY", "/places/country/");
			};

			var sReadPath = "countries";
			var sModelPath = "countries";
			this.readValueHelp(sReadPath, sModelPath, fSuccess);
		},
		
		onValueHelpHashtagUser: function (oEvent) {
			var fSuccess = function () {
				var sPath = "ValueHelp>/users";
				var oTemplate = new sap.m.StandardListItem({
					title: "{ValueHelp>NAME}",
					description: "{ValueHelp>ID}",
					type: "Active"
				});

				this.onValueHelpDialog(sPath, oTemplate, "ID", "NAME", "/hashtags/user_id/");
			};

			var sReadPath = "users";
			var sModelPath = "users";
			this.readValueHelp(sReadPath, sModelPath, fSuccess);
		},
		
		onValueHelpMentionedUser: function (oEvent) {
			var fSuccess = function () {
				var sPath = "ValueHelp>/users";
				var oTemplate = new sap.m.StandardListItem({
					title: "{ValueHelp>NAME}",
					description: "{ValueHelp>ID}",
					type: "Active"
				});

				this.onValueHelpDialog(sPath, oTemplate, "ID", "NAME", "/usermentions/mentioned_user_id/");
			};

			var sReadPath = "users";
			var sModelPath = "users";
			this.readValueHelp(sReadPath, sModelPath, fSuccess);
		},
		
		onValueHelpMentionerUser: function (oEvent) {
			var fSuccess = function () {
				var sPath = "ValueHelp>/users";
				var oTemplate = new sap.m.StandardListItem({
					title: "{ValueHelp>NAME}",
					description: "{ValueHelp>ID}",
					type: "Active"
				});

				this.onValueHelpDialog(sPath, oTemplate, "ID", "NAME", "/usermentions/user_id/");
			};

			var sReadPath = "users";
			var sModelPath = "users";
			this.readValueHelp(sReadPath, sModelPath, fSuccess);
		},
		
		

		onValueHelpDialog: function (sPath, oTemplate, sIdentifier, sDisplayField, sTechnicalPath) {
			if (!this._valueHelpDialog) {
				this._valueHelpDialog = sap.ui.xmlfragment("elte.Grafmodellezo.fragment.ValueHelpDialog", this);
				this.getView().addDependent(this._valueHelpDialog);
			}

			//create the item binding for the ValueHelpDialog
			this._initValueHelpBinding(sPath, oTemplate);

			//we'll save the data about the return value in the dependents 
			this._valueHelpDialog.destroyDependents();
			this._valueHelpDialog.addDependent(new sap.ui.core.CustomData({
				key: "identifier",
				value: sIdentifier
			}));
			this._valueHelpDialog.addDependent(new sap.ui.core.CustomData({
				key: "display",
				value: sDisplayField
			}));
			this._valueHelpDialog.addDependent(new sap.ui.core.CustomData({
				key: "tehcnical",
				value: sTechnicalPath
			}));

			this._valueHelpDialog.open();
		},
		
		onSearchValueHelp: function(oEvent) {
			var sSearchString = oEvent.getParameter("value");
			var oDialog = oEvent.getSource();
			var aItems = oDialog.getItems();
			
			if(aItems.length > 0) {
				var oFilter = new Filter({ filters: [ ], and: false });
				
				//Add the filters for the title
				for(var oPart of aItems[0].getBindingInfo("title").parts){
					var sPath = oPart.path;
					oFilter.aFilters.push( new Filter({ path: sPath, operator: FilterOperator.Contains, value1: sSearchString}) );
				}
				
				//Add filters for the description as well
				for(var oPart of aItems[0].getBindingInfo("description").parts){
					var sPath = oPart.path;
					oFilter.aFilters.push( new Filter({ path: sPath, operator: FilterOperator.Contains, value1: sSearchString}) );
				}
				
				oDialog.getBinding("items").filter(oFilter);
			}
		},

		onCancelValueHelp: function (oEvent) {},

		onConfirmValueHelp: function (oEvent) {
			var aDependents = oEvent.getSource().getDependents();
			var sIdentifierField = aDependents.find(function (oItem) {
				return oItem.getKey() === "identifier";
			}).getValue();
			var sDisplayField = aDependents.find(function (oItem) {
				return oItem.getKey() === "display";
			}).getValue();
			var sTechnicalPath = aDependents.find(function (oItem) {
				return oItem.getKey() === "tehcnical";
			}).getValue();

			var oSelectedItem = oEvent.getParameter("selectedItem");
			var oBindingContext = oSelectedItem.getBindingContext("ValueHelp");
			var sPath = oBindingContext.getPath();

			var oObject = oBindingContext.getModel().getProperty(sPath);
			var oTechnicalModel = this.getView().getModel("Technical");
			oTechnicalModel.setProperty("/filterBar" + sTechnicalPath + "/key1", oObject[sIdentifierField]);
			oTechnicalModel.setProperty("/filterBar" + sTechnicalPath + "/value1", oObject[sDisplayField]);
		},

		/** BACK-END COMMUNICATION OPERATIONS **/
		readData: function (sType, aFilters, oParameters) {
			var oModel = this.getView().getModel("Twitter");

			var fSuccess = function (oData) {
				var oObjectsModel = this.getView().getModel("Objects");
				oObjectsModel.setProperty("/" + sType, oData.results);

				this.onOperationEnded();
			};

			var fError = this.onError;

			this.onOperationStarted();
			oModel.read("/" + sType, {
				filters: aFilters,
				urlParameters: oParameters,
				success: jQuery.proxy(fSuccess, this),
				error: jQuery.proxy(fError, this)
			});

		},

		readMaxFollowers: function (fSuccess) {
			var _fSuccess = function (oData) {
				var oModel = this.getView().getModel("Technical");
				oModel.setProperty("/max_followers", oData.results[0].FOLLOWERS_COUNT);
				
				if(fSuccess) {
					jQuery.proxy(fSuccess, this, oData.results[0].FOLLOWERS_COUNT)();
				}
				
				this.onOperationEnded();
			};

			var fError = this.onError;

			this.onOperationStarted();
			var oModel = this.getView().getModel("Twitter");
			oModel.read("/max_followers", {
				success: jQuery.proxy(_fSuccess, this),
				error: jQuery.proxy(fError, this)
			});
		},

		readMaxStatuses: function (fSuccess) {
			var _fSuccess = function (oData) {
				var oModel = this.getView().getModel("Technical");
				oModel.setProperty("/max_statuses", oData.results[0].STATUSES_COUNT);
				
				if(fSuccess) {
					jQuery.proxy(fSuccess, this, oData.results[0].STATUSES_COUNT)();
				}
				
				this.onOperationEnded();
			};

			var fError = this.onError;

			this.onOperationStarted();
			var oModel = this.getView().getModel("Twitter");
			oModel.read("/max_statuses", {
				success: jQuery.proxy(_fSuccess, this),
				error: jQuery.proxy(fError, this)
			});
		},

		readPlaceTypes: function () {
			var fSuccess = function (oData) {
				var aStrings = oData.results.map(function (oRecord) {
					return {
						"name": oRecord.PLACE_TYPE
					};
				});

				var oModel = this.getView().getModel("Technical");
				oModel.setProperty("/place_types", aStrings);

				this.onOperationEnded();
			};

			var fError = this.onError;

			this.onOperationStarted();
			var oModel = this.getView().getModel("Twitter");
			oModel.read("/place_types", {
				success: jQuery.proxy(fSuccess, this),
				error: jQuery.proxy(fError, this)
			});
		},

		readValueHelp: function (sReadPath, sModelPath, fSuccess) {
			var _fSuccess = function (oData) {
				var oModel = this.getView().getModel("ValueHelp");
				oModel.setProperty("/" + sModelPath, oData.results);

				jQuery.proxy(fSuccess, this)();
				this.onOperationEnded();
			};

			var fError = this.onError;

			// In order to save operation times, first check if the required data fields are already filled
			var aValueHelp = this.getView().getModel("ValueHelp").getProperty("/" + sModelPath);
			if(!aValueHelp || aValueHelp.length === 0) { 
				this.onOperationStarted();
				var oModel = this.getView().getModel("Twitter");
				oModel.read("/" + sReadPath, {
					success: jQuery.proxy(_fSuccess, this),
					error: jQuery.proxy(fError, this)
				});
			} else {
				jQuery.proxy(fSuccess, this)();
			}
		},

		/** FORMATTERS **/
		
		isTruncatedState: function (sTruncated) {
			var sStatus = (sTruncated === "True") ? "Success" : "Warning";
			return sStatus;
		}
	});

});