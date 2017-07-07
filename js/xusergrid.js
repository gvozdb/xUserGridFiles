var xUserGrid = function (config) {
    config = config || {};
    xUserGrid.superclass.constructor.call(this, config);
};
Ext.extend(xUserGrid, Ext.Component, {
    page: {}, window: {}, grid: {}, tree: {}, panel: {}, combo: {}, config: {}, view: {}, utils: {}, ux: {}, fields: {}
});
Ext.reg('xusergrid', xUserGrid);
xUserGrid = new xUserGrid();