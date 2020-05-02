sap.ui.define(
    ['sap/m/SegmentedButton'],
    function(SegmentedButton) {
        return SegmentedButton.extend("control.CustomSegmentedButton",{
            metadata: {
                properties: {
                    name: {
                        type: "text",
                        defaultValue: ""
                    }
                }
            },
            renderer: function(oRm,oControl){
                sap.m.SegmentedButtonRenderer.render(oRm,oControl); //use supercass renderer routine
    
            }
        });
    }
);
