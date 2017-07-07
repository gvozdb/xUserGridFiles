xUserGrid.grid.modxUserExt = function (config) {
    Ext.applyIf(config, {
        // Ссылаемся на свой коннектор
        url: xUserGrid.config['connector_url'],
        viewConfig: {
            forceFit: true,
            enableRowBody: true,
            scrollOffset: 0,
            autoFill: true,
            showPreview: true,
            // Внедряем в функцию присвоения класса каждой записи, обработку заблокированных юзеров
            getRowClass: function (rec) {
                var cls = [];
                if (rec.data['active']) {
                    cls.push('grid-row-active');
                } else {
                    cls.push('grid-row-inactive');
                }
                if (rec.data['blocked']) {
                    cls.push('xug-grid-row-blocked');
                }
                return cls.join(' ');
            },
        },
        // В список полей, получаемых из процессора getlist, добавляем: dob, country, city
        fields: [
            'id',
            'username',
            'fullname',
            'email',
            'gender',
            'blocked',
            'role',
            'active',
            'cls',
            'dob',
            'country',
            'city',
        ],
        // Формируем список колонок таблицы под себя, удаляя ненужные (чекбокс, к примеру) и добавляя требуемые (страну, город, дату рождения)
        columns: [{
            header: _('id'),
            dataIndex: 'id',
            width: 60,
            sortable: true,
            fixed: true,
            resizable: false,
        }, {
            header: _('name'),
            dataIndex: 'username',
            width: 120,
            sortable: true,
            fixed: true,
            resizable: false,
            renderer: function (value, p, record) {
                return String.format('<a href="?a=security/user/update&id={0}" title="{1}" class="x-grid-link">{2}</a>', record.id, _('user_update'), Ext.util.Format.htmlEncode(value));
            },
        }, {
            header: _('user_full_name'),
            dataIndex: 'fullname',
            width: 180,
            sortable: true,
            editor: {
                xtype: 'textfield',
            },
            renderer: Ext.util.Format.htmlEncode,
        }, {
            header: _('email'),
            dataIndex: 'email',
            width: 180,
            sortable: true,
            editor: {
                xtype: 'textfield',
            },
        }, {
            header: _('user_dob'),
            dataIndex: 'dob',
            width: 120,
            sortable: true,
            fixed: true,
            resizable: false,
        }, {
            header: _('user_country'),
            dataIndex: 'country',
            width: 150,
            sortable: true,
            fixed: true,
            resizable: false,
        }, {
            header: 'Город',
            dataIndex: 'city',
            width: 100,
            sortable: true,
            editor: {
                xtype: 'textfield',
            },
        }, {
            header: _('active'),
            dataIndex: 'active',
            width: 80,
            sortable: true,
            editor: {
                xtype: 'combo-boolean',
                renderer: 'boolean',
            },
        }, {
            header: _('user_block'),
            dataIndex: 'blocked',
            width: 80,
            sortable: true,
            editor: {
                xtype: 'combo-boolean',
                renderer: 'boolean',
            },
        }],

        // Переписываем массив верхней панели таким образом, чтобы:
        // 1) Сохранить нужные элементы (кнопки: новый пользователь, массовые действия)
        // 2) Добавить новые элементы (поле фильтра по стране, новое поле поиска)
        // 3) Удалить ненужные элементы (старое поле поиска)
        tbar: [{
            text: _('user_new'),
            handler: this.createUser,
            scope: this,
            cls: 'primary-button',
        }, {
            text: _('bulk_actions'),
            menu: [{
                text: _('selected_activate'),
                handler: this.activateSelected,
                scope: this,
            }, {
                text: _('selected_deactivate'),
                handler: this.deactivateSelected,
                scope: this,
            }, {
                text: _('selected_remove'),
                handler: this.removeSelected,
                scope: this,
            }]
        }, '->', {
            // Указываем наш комбобокс из файла combo.js
            xtype: 'xug-combo-user-country',
            name: 'country',
            id: 'modx-user-filter-country',
            emptyText: _('user_country') + '...',
            // value: (MODx.request['country'] ? MODx.request['country'] : ''),
            width: 150,
            listeners: {
                // Внедряем обработку события выбора пункта комбобокса, ссылаясь на метод filterCountry
                select: {fn: this.filterCountry, scope: this}
            },
        }, {
            xtype: 'modx-combo-usergroup',
            name: 'usergroup',
            id: 'modx-user-filter-usergroup',
            emptyText: _('user_group') + '...',
            baseParams: {
                action: 'security/group/getlist',
                addAll: true,
            },
            // value: (MODx.request['usergroup'] ? MODx.request['usergroup'] : ''),
            width: 150,
            listeners: {
                select: {fn: this.filterUsergroup, scope: this}
            },
        }, {
            // Указываем новое поле поиска из файла combo.js
            xtype: 'xug-field-search',
            id: 'modx-user-search',
            width: 170,
            listeners: {
                search: {
                    fn: function (field) {
                        this.getStore().baseParams.query = field.getValue();
                        this.getBottomToolbar().changePage(1);
                    }, scope: this
                },
                clear: {
                    fn: function (field) {
                        field.setValue('');
                        this.getStore().baseParams.query = '';
                        this.getBottomToolbar().changePage(1);
                    }, scope: this
                },
            }
        }]
    });
    xUserGrid.grid.modxUserExt.superclass.constructor.call(this, config);
};
Ext.extend(xUserGrid.grid.modxUserExt, MODx.grid.User, {
    filterCountry: function (cb, nv, ov) {
        this.getStore().baseParams.country = Ext.isEmpty(nv) || Ext.isObject(nv) ? cb.getValue() : nv;
        this.getBottomToolbar().changePage(1);
        return true;
    },
});
Ext.reg('modx-grid-user', xUserGrid.grid.modxUserExt);