function initModel() {
	var sUrl = "/public/grafmodellezo/twitter/service/twitter.xsodata/";
	var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
	sap.ui.getCore().setModel(oModel);
}