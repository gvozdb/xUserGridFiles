/**
 * @param config
 * @constructor
 */
xUserGrid.combo.Search = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        xtype: 'twintrigger',
        ctCls: 'x-field-search',
        allowBlank: true,
        msgTarget: 'under',
        emptyText: _('search'),
        name: 'query',
        triggerAction: 'all',
        clearBtnCls: 'x-field-search-clear',
        searchBtnCls: 'x-field-search-go',
        onTrigger1Click: this._triggerSearch,
        onTrigger2Click: this._triggerClear,
    });
    xUserGrid.combo.Search.superclass.constructor.call(this, config);
    this.on('render', function () {
        this.getEl().addKeyListener(Ext.EventObject.ENTER, function () {
            this._triggerSearch();
        }, this);
        this.positionEl.setStyle('margin-right', '1px');
    });
    this.addEvents('clear', 'search');
};
Ext.extend(xUserGrid.combo.Search, Ext.form.TwinTriggerField, {
    initComponent: function () {
        Ext.form.TwinTriggerField.superclass.initComponent.call(this);
        this.triggerConfig = {
            tag: 'span',
            cls: 'x-field-search-btns',
            cn: [
                {tag: 'div', cls: 'x-form-trigger ' + this.searchBtnCls},
                {tag: 'div', cls: 'x-form-trigger ' + this.clearBtnCls}
            ]
        };
    },
    _triggerSearch: function () {
        this.fireEvent('search', this);
    },
    _triggerClear: function () {
        this.fireEvent('clear', this);
    },
});
Ext.reg('xug-combo-search', xUserGrid.combo.Search);
Ext.reg('xug-field-search', xUserGrid.combo.Search);


/**
 * @param config
 * @constructor
 */
xUserGrid.combo.UserCountry = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        name: 'country',
        fieldLabel: config['name'] || 'country',
        hiddenName: config['name'] || 'country',
        displayField: 'display',
        valueField: 'value',
        fields: ['value', 'display'],
        url: xUserGrid.config['connector_url'],
        baseParams: {
            action: 'combo/getuserfield',
            key: 'country',
        },
        pageSize: 20,
        typeAhead: false,
        editable: true,
        anchor: '100%',
        listEmptyText: '<div style="padding: 7px;">Выпадающий список пуст...</div>',
        tpl: new Ext.XTemplate('\
            <tpl for="."><div class="x-combo-list-item xug-combo__list-item">\
                <span>\
                    {display}\
                </span>\
            </div></tpl>',
            {compiled: true}
        ),
    });
    xUserGrid.combo.UserCountry.superclass.constructor.call(this, config);

    // При раскрытии списка подгружаем данные заново
    this.on('expand', function () {
        var combo = Ext.getCmp(config.id);
        var comboStore = combo.getStore();
        comboStore.load();
    });
};
Ext.extend(xUserGrid.combo.UserCountry, MODx.combo.ComboBox);
Ext.reg('xug-combo-user-country', xUserGrid.combo.UserCountry);