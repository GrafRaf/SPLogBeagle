(function () {
    'use strict';

    //require('../../lib/angular/angular.js');
    require('angular');
    require('angular-bootstrap-npm');
    require('./angular-locale_ru-ru.js');
    require('./services-fake.js');
    require('./controllers.js');
    //require('../../lib/vendor/ui-bootstrap-tpls.min.js');
    //require('../app/services/ptcServices.js');
    //require('../app/header/header.js');
    //require('../app/subheader/subheader.js');
    //require('../app/controllers/ModulesCatalogController.js');

    angular.module('Softage.RiskCard', ['ui.bootstrap', 'Softage.RiskCard.Controllers'])
    .config(function ($sceProvider, datepickerConfig, datepickerPopupConfig) {
        // Completely disable SCE.  For demonstration purposes only!
        // Do not use in new projects.
        $sceProvider.enabled(false);
        datepickerConfig.showWeeks = false;
        datepickerConfig.startingDay = 1;
        datepickerConfig.formatDay = "dd";
        datepickerConfig.formatMonth = "MM";
        datepickerConfig.formatYear = "yyyy";

        datepickerPopupConfig.datepickerPopup = "dd.MM.yyyy";
        datepickerPopupConfig.currentText = "Сегодня";
        datepickerPopupConfig.clearText = "Очистить";
        datepickerPopupConfig.closeText = "Закрыть";

    });
})();

if (!String.prototype.startsWith) {
    Object.defineProperty(String.prototype, 'startsWith', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function (searchString, position) {
            position = position || 0;
            return this.lastIndexOf(searchString, position) === position;
        }
    });
}
