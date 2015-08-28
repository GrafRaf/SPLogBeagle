(function () {
    'use strict';

    //angular.module('Softage.RiskCard', ['ui.bootstrap', 'riskCardControllers', 'riskCardServices']);
    angular.module('Softage.RiskCard.Services', [])
    .service('RiskCardService', RiskCardService);



    function RiskCardService($http, $q, $timeout, $filter) {

        //var isFakeService = true;
        var isFakeService = false;
        //var handlerUrl = '/_layouts/15/Softage.RiskCard/RiskCardHandler.ashx';
        //var handlerUrl = '/sites/devrisk/subdevrisk/_layouts/15/Softage.RiskCard/RiskCardHandler.ashx';
        var newFormString = "NewForm.html";
        var displayFormString = "DisplayForm.html";
        var editFormString = "EditForm.html";
        var solutionPath = '/_layouts/15/Softage.RiskCard/';
        var handlerName = 'RiskCardHandler.ashx';


        function isEmpty(value) {
            return (value === null || value === undefined || value === "");
        }

        function getQueryStringParameter(paramToRetrieve) {
            var s1 = document.URL.split("?");
            if (s1.length < 2) {
                return;
            }
            var params = s1[1].split("&");
            var strParams = "";
            for (var i = 0; i < params.length; i = i + 1) {
                var singleParam = params[i].split("=");
                if (singleParam[0] === paramToRetrieve) {
                    return singleParam[1];
                }
            }
        }
        function getSourceFromUrl() {
            var source = (getQueryStringParameter("Source") || "")
                .replace(/%3[Aa]/g, ":")
                .replace(/%2[Ff]/g, "/")
                .replace(/%2[Ee]/g, ".");
            return source;
        }
        function getIDFromUrl() {
            var id = getQueryStringParameter("ID");
            return id;
        }
        function getIsActualizationFromUrl() {
            var result = getQueryStringParameter("IsActualization");
            return (result === "true");
        }
        function getContentTypeIdFromUrl() {
            var contentTypeId = getQueryStringParameter("ContentTypeId");
            return contentTypeId;
        }
        function getFormTypeFromUrl() {
            //    formType:  0 - Display, 1 - Create, 2 - Update
            var id = getIDFromUrl();
            var isActForm = getIsActualizationFromUrl();
            if (isActForm) {
                if (document.URL.indexOf("/" + newFormString + "?") > 0) {
                    // create form
                    return "NewForm";
                }
                if (document.URL.indexOf("/" + newFormString.replace(".html", ".aspx") + "?") > 0) {
                    // create form
                    return "NewForm";
                }
            } else {
                if (!id) {
                    if (document.URL.indexOf("/" + newFormString + "?") > 0) {
                        // create form
                        return "NewForm";
                    }
                    if (document.URL.indexOf("/" + newFormString.replace(".html", ".aspx") + "?") > 0) {
                        // create form
                        return "NewForm";
                    }
                } else {
                    // display/edit form
                    if (document.URL.indexOf("/" + displayFormString + "?") > 0) {
                        // display form
                        return "DisplayForm";
                    }
                    if (document.URL.indexOf("/" + displayFormString.replace(".html", ".aspx") + "?") > 0) {
                        // display form
                        return "DisplayForm";
                    }
                    if (document.URL.indexOf("/" + editFormString + "?") > 0) {
                        // display form
                        return "EditForm";
                    }
                    if (document.URL.indexOf("/" + editFormString.replace(".html", ".aspx") + "?") > 0) {
                        // display form
                        return "EditForm";
                    }
                }
            }
            return "";
        }
        function getHandlerUrl() {
            var url = document.URL;
            var index = url.indexOf(solutionPath);
            var handlerUrl = url.substring(0, index) + solutionPath + handlerName;
            return handlerUrl;
        }

        function getFormDigestMethodUrl() {
            var url = document.URL;
            var index = url.indexOf(solutionPath);
            var handlerUrl = url.substring(0, index) + "/_api/contextinfo";
            return handlerUrl;
        }

        var handlerUrl = getHandlerUrl();//'/_layouts/15/Softage.RiskCard/RiskCardHandler.ashx';

        function getFormType(model) {
            return model.FormType;
            //return "DisplayForm";
            //return "NewForm";
            //return "EditForm";
        }
        function isOSIPU_User(model) {
            return model.model.IsOSIPU_User;
        }
        function isAdminOwner(model) {
            return model.model.IsAdminOwner || false;
        }
        function isCreatedLessThan7DayAgo(model) {
            return model.model.IsCreatedLessThan7DayAgo || false;
        }
        function getLists() {
            // списки
            var lists = {};
            // Отчётный год
            lists.ReportYears = [2014, 2015, 2016, 2017, 2018, 2019];
            // Общество
            lists.Society = [
                { Id: 1, Title: "ОАО «СИБЭКО»" },
                { Id: 2, Title: "ЗАО «АТП»" },
                { Id: 3, Title: "ЗАО «ИТС»" },
                { Id: 4, Title: "НОУ Энергоцентр" },
                { Id: 5, Title: "ОАО «Бийскэнерго»" },
                { Id: 6, Title: "ОАО «НГТЭ»" },
                { Id: 7, Title: "ОАО «Разрез Сереульский»" },
                { Id: 8, Title: "ОАО БЭТТ" },
                { Id: 9, Title: "ЧОО Электра" },
                { Id: 10, Title: "ОАО «ПРиС»" },
                { Id: 11, Title: "ОАО «ПЭСК-1»" },
                { Id: 12, Title: "ОАО «АСС»" }
            ];
            // Дирекция
            lists.Managements = [
                // "ОАО «СИБЭКО»"
                { SocietyId: 1, Id: 1, Title: "Подразделение ТЭЦ №2" },
                { SocietyId: 1, Id: 2, Title: "Подразделение ТЭЦ №3" },
                { SocietyId: 1, Id: 3, Title: "Подразделение ТЭЦ №4" },
                { SocietyId: 1, Id: 4, Title: "Подразделение ТЭЦ №5" },
                { SocietyId: 1, Id: 5, Title: "Подразделение БАРАБИНСКАЯ ТЭЦ (БТЭЦ)" },
                { SocietyId: 1, Id: 6, Title: "Филиал \"Локальные котельные\"" },
                { SocietyId: 1, Id: 7, Title: "Подразделение \"Топливоподача\"" },
                { SocietyId: 1, Id: 8, Title: "Дирекция по экономике и финансам" },
                { SocietyId: 1, Id: 9, Title: "Дирекция по бухгалтерскому и налоговому учету" },
                { SocietyId: 1, Id: 10, Title: "Дирекция по правовым и корпоративным вопросам" },
                { SocietyId: 1, Id: 11, Title: "Дирекция по оперативному управлению" },
                { SocietyId: 1, Id: 12, Title: "Дирекция по исполнению инвестиционных программ" },
                { SocietyId: 1, Id: 13, Title: "Дирекция по информационным технологиям" },
                { SocietyId: 1, Id: 14, Title: "Дирекция по топливообеспечению" },
                { SocietyId: 1, Id: 15, Title: "Дирекция по безопасности" },
                { SocietyId: 1, Id: 16, Title: "Дирекция по управлению персоналом" },
                { SocietyId: 1, Id: 17, Title: "Дирекция по сбыту тепловой энергии" },
                { SocietyId: 1, Id: 18, Title: "Дирекция по развитию" },
                { SocietyId: 1, Id: 19, Title: "Техническая дирекция" },
                // "ЗАО «АТП»"
                { SocietyId: 2, Id: 20, Title: "Руководство" },
                { SocietyId: 2, Id: 21, Title: "Финансово-экономический отдел" },
                { SocietyId: 2, Id: 22, Title: "Отдел маркетинга и продаж" },
                { SocietyId: 2, Id: 23, Title: "Дирекция по эксплуатации" },
                { SocietyId: 2, Id: 24, Title: "Техническая дирекция" },
                // "ЗАО «ИТС»"
                { SocietyId: 3, Id: 41, Title: "Руководство" },
                { SocietyId: 3, Id: 42, Title: "Отдел обеспечения производственной деятельности" },
                { SocietyId: 3, Id: 43, Title: "Центр технической поддержки" },
                { SocietyId: 3, Id: 44, Title: "Управление сервисного обслуживания центрального узла связи (УСОЦУС)" },
                { SocietyId: 3, Id: 45, Title: "Управление сервисного обслуживания энергопредприятий" },
                { SocietyId: 3, Id: 46, Title: "Управление прикладного программного обеспечения" },
                { SocietyId: 3, Id: 47, Title: "Управление по автоматизированным системам управления технологическими процессами (УАСУТП)" },
                // "НОУ Энергоцентр"
                { SocietyId: 4, Id: 48, Title: "Руководство" },
                { SocietyId: 4, Id: 49, Title: "Отдел планирования и кадровой работы" },
                { SocietyId: 4, Id: 50, Title: "Учебно-методический отдел" },
                { SocietyId: 4, Id: 51, Title: "Хозяйственно-технический отдел" },
                // "ОАО «Бийскэнерго»"
                { SocietyId: 5, Id: 52, Title: "Руководство" },
                { SocietyId: 5, Id: 53, Title: "Техническая дирекция" },
                { SocietyId: 5, Id: 54, Title: "Дирекция по экономике и финансам" },
                { SocietyId: 5, Id: 55, Title: "Дирекция по безопасности" },
                { SocietyId: 5, Id: 56, Title: "Отдел по управлению персоналом" },
                { SocietyId: 5, Id: 57, Title: "Дирекция по сбыту тепловой энергии" },
                { SocietyId: 5, Id: 58, Title: "Административно-хозяйственное управление" },
                { SocietyId: 5, Id: 59, Title: "Бухгалтерия" },
                // "ОАО «НГТЭ»"
                { SocietyId: 6, Id: 32, Title: "Руководство" },
                { SocietyId: 6, Id: 33, Title: "Техническая дирекция" },
                { SocietyId: 6, Id: 34, Title: "Дирекция по развитию и инвестициям" },
                { SocietyId: 6, Id: 35, Title: "Бухгалтерия" },
                { SocietyId: 6, Id: 36, Title: "Дирекция по экономике и финансам" },
                { SocietyId: 6, Id: 37, Title: "Дирекция по общим вопросам" },
                { SocietyId: 6, Id: 38, Title: "Дирекция по безопасности" },
                { SocietyId: 6, Id: 39, Title: "Управление по работе с персоналом" },
                { SocietyId: 6, Id: 40, Title: "Управление по правовому обеспечению деятельности" },
                // "ОАО «Разрез Сереульский»"
                { SocietyId: 7, Id: 60, Title: "Руководство" },
                { SocietyId: 7, Id: 61, Title: "Юридический отдел" },
                { SocietyId: 7, Id: 62, Title: "Дирекция по экономике и финансам" },
                { SocietyId: 7, Id: 63, Title: "Дирекция по производству" },
                { SocietyId: 7, Id: 64, Title: "Техническая дирекция" },
                { SocietyId: 7, Id: 65, Title: "Управление по развитию" },
                // "ОАО БЭТТ"
                { SocietyId: 8, Id: 66, Title: "Руководство" },
                { SocietyId: 8, Id: 67, Title: "Управление энергообеспечения" },
                { SocietyId: 8, Id: 68, Title: "Управление по распределению тепловой энергии и контролю" },
                { SocietyId: 8, Id: 69, Title: "Техническая дирекция" },
                //"ЧОО Электра"
                { SocietyId: 9, Id: 25, Title: "Руководство" },
                { SocietyId: 9, Id: 26, Title: "Бухгалтерия" },
                { SocietyId: 9, Id: 27, Title: "Финансово-экономический отдел" },
                { SocietyId: 9, Id: 28, Title: "Отдел по управлению персоналом" },
                { SocietyId: 9, Id: 29, Title: "Гараж" },
                { SocietyId: 9, Id: 30, Title: "Хозяйственный отдел" },
                { SocietyId: 9, Id: 31, Title: "Центр связи" }
            ];
            // Вид риска по источнику возникновения
            lists.RiskKinds = [
                { Id: 1, Title: "внутренний" },
                { Id: 2, Title: "внешний" }
            ];
            // Группа риска
            lists.RiskGroups = [
                // внутренний
                { RiskKindId: 1, Id: 1, Title: "Процесс управления" },
                { RiskKindId: 1, Id: 2, Title: "Процесс развития" },
                { RiskKindId: 1, Id: 3, Title: "Основный процесс" },
                { RiskKindId: 1, Id: 4, Title: "Вспомогательный процесс" },
                // внешний
                { RiskKindId: 2, Id: 1, Title: "Микросреда" },
                { RiskKindId: 2, Id: 2, Title: "Макросреда" }
            ];
            //
            lists.AreaBusinessProcesses = [
                //Группа риска	Область/Бизнес-процесс
                // Процесс управления 
                { RiskGroupId: 1, Id: 1, Title: "Стратегическое управление" },
                { RiskGroupId: 1, Id: 2, Title: "Управление экономикой и финансами" },
                // Процесс развития
                { RiskGroupId: 2, Id: 3, Title: "Управление инвестициями и организация строительства" },
                { RiskGroupId: 2, Id: 4, Title: "Управление организационным развитием" },
                // Основной процесс
                { RiskGroupId: 3, Id: 5, Title: "Топливообеспечение" },
                { RiskGroupId: 3, Id: 6, Title: "Техническое обслуживание и ремонт оборудования" },
                { RiskGroupId: 3, Id: 7, Title: "Материально-техническое обеспечение" },
                { RiskGroupId: 3, Id: 8, Title: "Производство электрической и тепловой энергии" },
                { RiskGroupId: 3, Id: 9, Title: "Сбыт тепловой энергии" },
                { RiskGroupId: 3, Id: 10, Title: "Сбыт электрической энергии" },
                // Вспомогательный процесс
                { RiskGroupId: 4, Id: 11, Title: "Управление персоналом" },
                { RiskGroupId: 4, Id: 12, Title: "Правовое и корпоративное обеспечение" },
                { RiskGroupId: 4, Id: 13, Title: "ИТ-обеспечение" },
                { RiskGroupId: 4, Id: 14, Title: "Бухгалтерское обеспечение" },
                { RiskGroupId: 4, Id: 15, Title: "Административно-хозяйственное обеспечение" },
                { RiskGroupId: 4, Id: 16, Title: "Обеспечение безопасности" },
                { RiskGroupId: 4, Id: 17, Title: "Управление имущественными отношениями" },
                // Микросреда
                { RiskGroupId: 5, Id: 18, Title: "Потребительский риск" },
                { RiskGroupId: 5, Id: 19, Title: "Риск, связанный с контрагентами" },
                { RiskGroupId: 5, Id: 20, Title: "Риск конкурентной среды" },
                // Макросреда
                { RiskGroupId: 6, Id: 21, Title: "Естественный и экологический риск" },
                { RiskGroupId: 6, Id: 22, Title: "Политический риск" },
                { RiskGroupId: 6, Id: 23, Title: "Нормативно-правовой риск" },
                { RiskGroupId: 6, Id: 24, Title: "Финансово-экономический риск" },
                { RiskGroupId: 6, Id: 25, Title: "Технологический риск" }
            ];
            // Угроза/возможность
            lists.ThreatOpportunities = [
                { Id: 1, Title: "Угроза" },
                { Id: 2, Title: "Возможность" }
            ];
            // Стратегия реагирования на риск
            lists.RiskResponseStrategies = [
                { ThreatOpportunityId: 1, Id: 1, Title: "Уклонение" },
                { ThreatOpportunityId: 1, Id: 2, Title: "Передача" },
                { ThreatOpportunityId: 1, Id: 3, Title: "Снижение" },
                { ThreatOpportunityId: 1, Id: 4, Title: "Принятие" },
                { ThreatOpportunityId: 2, Id: 5, Title: "Использование" },
                { ThreatOpportunityId: 2, Id: 6, Title: "Разделение" },
                { ThreatOpportunityId: 2, Id: 7, Title: "Увеличение" },
                { ThreatOpportunityId: 2, Id: 8, Title: "Принятие" }
            ];
            // -, Неприемлемый
            lists.UnacceptableRisks = [
                "-",
                "Неприемлемый"
            ];
            // Единицы измерений
            lists.Measures = [
                "%",
                "руб.",
                "объект",
                "руб./тонна",
                "руб./чел.",
                "шт.",
                "Гкал",
                "Гкал/ч",
                "Гц",
                "кВ",
                "кВА",
                "КВтч",
                "Мвар",
                "МВт"
            ];
            // Периодичность измерения индикатора
            lists.ChangingPeriods = [
                { "Id": 1, "Title": "ежемесячная" },
                { "Id": 2, "Title": "ежеквартальная" }
            ];
            lists.OptimizationRegulations = [
                "Нужен стандарт/регламент области, процесса",
                "Нужен пересмотр стандарта/регламента области, процесса",
                "Есть стандарт/регламент",
                "Не нужен стандарт/регламент"
            ];
            lists.ScheduledRequiredGrowthProcesses = [
                "Нужен проект",
                "Проект запланирован, в процессе выполнения",
                "Проект запланирован, но не выполнен",
                "Не нужен проект"
            ];
            lists.Users = [
                { "Id": 1, "Title": "Administrator", "Email": "" },
                { "Id": 3, "Title": "Administrator", "Email": "" },
                { "Id": 17, "Title": "NT AUTHORITY\\LOCAL SERVICE", "Email": "" },
                { "Id": 18, "Title": "demoadmin", "Email": "softage_test@mail.ru" },
                { "Id": 19, "Title": "rustam", "Email": "" },
                { "Id": 20, "Title": "raf raf", "Email": "" },
                { "Id": 21, "Title": "demoteam demoteam", "Email": "" },
                { "Id": 22, "Title": "demorp demorp", "Email": "" },
                { "Id": 23, "Title": "rustam", "Email": "" },
                { "Id": 1073741823, "Title": "System Account", "Email": "" }
            ];
            lists.StepActionTypes = [
                "Профилактика",
                "Реагирование"
            ];
            lists.StepStatuses = [
                "Не начат",
                "В процессе выполнения",
                "Выполнен",
                "Не выполнен",
                "Не актуален",
                "Отложен"
            ];
            lists.StrategicGoals = [
                { "Id": 1, "Title": "Покрытие всех новых тепловых нагрузок за счет собственных источников" },
                { "Id": 2, "Title": "Получение в собственность распределительные тепловые сети" },
                { "Id": 3, "Title": "Развитие существующих активов" },
                { "Id": 4, "Title": "Оптимизация топливной политика" },
                { "Id": 5, "Title": "Оптимизация программы ремонтов и обслуживания основного оборудования" },
                { "Id": 6, "Title": "Увеличение использования существующей мощности" },
                { "Id": 7, "Title": "Эффективное взаимодействие с контролирующими органами" },
                { "Id": 8, "Title": "Внедрение современных систем управления" },
                { "Id": 9, "Title": "Формирование положительного имиджа компании" },
                { "Id": 10, "Title": "Оптимизация элементов системы управления" },
                { "Id": 11, "Title": "Развитие ДЗО" }
            ];
            return lists;
        }
        function getModel(id) {

            var model = {
                Error: "",
                ErrorInfo: ""
            };

            if (id) {
                // some fake models
                switch (id) {
                    case 1:
                        model.ReportYear = 2015;
                        model.RiskFactors = [{ Id: 1, Title: "Причина 1", IsDeleted: false }, { Id: 2, Title: "Причина 2", IsDeleted: false }];
                        model.ConsequencesOfRisk = [{ Id: 1, Title: "Последствие 1", IsDeleted: false }, { Id: 2, Title: "Последствие 2", IsDeleted: false }];
                        model.Indicators = [{ Id: 1, Title: "Индикатор 1", IsDeleted: false }, { Id: 2, Title: "Индикатор 2", IsDeleted: false }];
                        model.ImplementedRisksOrOpportunites = [];
                        model.Permissions = {
                            IsCanEditRiskPassport: true
                        };
                        break;
                    default:
                        break;
                }
            } else {
                model.RiskFactors = [{ Id: null, Title: null, IsDeleted: false }, { Id: null, Title: null, IsDeleted: false }];
                model.ConsequencesOfRisk = [{ Id: null, Title: null, IsDeleted: false }, { Id: null, Title: null, IsDeleted: false }];
                model.Indicators = [{ Id: null, Title: null, IsDeleted: false }, { Id: null, Title: null, IsDeleted: false }];
                model.Steps = [{ Id: 1, Title: "", Childs: [], Responsibles: [] }];
                model.ImplementedRisksOrOpportunites = [];
            }

            return model;
        }
        function getNotDeletedItems(list) {
            return $filter('filter')(list, { IsDeleted: !true }, true);
        }
        function isFieldProtected(model, srcModel, field, item) {
            if (field.startsWith("pasporttab_generalinfo_riskfactors_title")) {
                //var index = field.replace("pasporttab_generalinfo_riskfactors_title", "");
                //if (isEmpty(srcModel.RiskFactors[index].title)) {
                //    return false;
                //} else {
                return true;
                //}
            }
            if (field.startsWith("pasporttab_generalinfo_consequencesofrisk_title")) {
                //var index = field.replace("pasporttab_generalinfo_consequencesofrisk_title", "");
                //if (isEmpty(srcModel.ConsequencesOfRisk[index].title)) {
                //    return false;
                //} else {
                return true;
                //}
            }
            if (field.startsWith("pasporttab_indicators_")) {
                //var index = field.replace("pasporttab_generalinfo_consequencesofrisk_title", "");
                //if (isEmpty(srcModel.ConsequencesOfRisk[index].title)) {
                //    return false;
                //} else {
                return true;
                //}
            }
            if (field.startsWith("plangraphtab_")) {
                //var index = field.replace("pasporttab_generalinfo_consequencesofrisk_title", "");
                //if (isEmpty(srcModel.ConsequencesOfRisk[index].title)) {
                //    return false;
                //} else {
                return true;
                //}
            }
            // reporttab_monitoring tab
            if (field.startsWith("reporttab_monitoring_indicator.month1fact")) {
                var index = field.replace("reporttab_monitoring_indicator.month1fact", "");
                if (srcModel.Indicators[index]) {
                    if (isEmpty(srcModel.Indicators[index].Month1Fact)) {
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return false;
                }
            }
            if (field.startsWith("reporttab_monitoring_indicator.month2fact")) {
                var index = field.replace("reporttab_monitoring_indicator.month2fact", "");
                if (srcModel.Indicators[index]) {
                    if (isEmpty(srcModel.Indicators[index].Month2Fact)) {
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return false;
                }
            }
            if (field.startsWith("reporttab_monitoring_indicator.month3fact")) {
                var index = field.replace("reporttab_monitoring_indicator.month3fact", "");
                if (srcModel.Indicators[index]) {
                    if (isEmpty(srcModel.Indicators[index].Month3Fact)) {
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return false;
                }
            }
            if (field.startsWith("reporttab_monitoring_indicator.month4fact")) {
                var index = field.replace("reporttab_monitoring_indicator.month4fact", "");
                if (srcModel.Indicators[index]) {
                    if (isEmpty(srcModel.Indicators[index].Month4Fact)) {
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return false;
                }
            }
            if (field.startsWith("reporttab_monitoring_indicator.month5fact")) {
                var index = field.replace("reporttab_monitoring_indicator.month5fact", "");
                if (srcModel.Indicators[index]) {
                    if (isEmpty(srcModel.Indicators[index].Month5Fact)) {
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return false;
                }
            }
            if (field.startsWith("reporttab_monitoring_indicator.month6fact")) {
                var index = field.replace("reporttab_monitoring_indicator.month6fact", "");
                if (srcModel.Indicators[index]) {
                    if (isEmpty(srcModel.Indicators[index].Month6Fact)) {
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return false;
                }
            }
            if (field.startsWith("reporttab_monitoring_indicator.month7fact")) {
                var index = field.replace("reporttab_monitoring_indicator.month7fact", "");
                if (srcModel.Indicators[index]) {
                    if (isEmpty(srcModel.Indicators[index].Month7Fact)) {
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return false;
                }
            }
            if (field.startsWith("reporttab_monitoring_indicator.month8fact")) {
                var index = field.replace("reporttab_monitoring_indicator.month8fact", "");
                if (srcModel.Indicators[index]) {
                    if (isEmpty(srcModel.Indicators[index].Month8Fact)) {
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return false;
                }
            }
            if (field.startsWith("reporttab_monitoring_indicator.month9fact")) {
                var index = field.replace("reporttab_monitoring_indicator.month9fact", "");
                if (srcModel.Indicators[index]) {
                    if (isEmpty(srcModel.Indicators[index].Month9Fact)) {
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return false;
                }
            }
            if (field.startsWith("reporttab_monitoring_indicator.month10fact")) {
                var index = field.replace("reporttab_monitoring_indicator.month10fact", "");
                if (srcModel.Indicators[index]) {
                    if (isEmpty(srcModel.Indicators[index].Month10Fact)) {
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return false;
                }
            }
            if (field.startsWith("reporttab_monitoring_indicator.month11fact")) {
                var index = field.replace("reporttab_monitoring_indicator.month11fact", "");
                if (srcModel.Indicators[index]) {
                    if (isEmpty(srcModel.Indicators[index].Month11Fact)) {
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return false;
                }
            }
            if (field.startsWith("reporttab_monitoring_indicator.month12fact")) {
                var index = field.replace("reporttab_monitoring_indicator.month12fact", "");
                if (srcModel.Indicators[index]) {
                    if (isEmpty(srcModel.Indicators[index].Month12Fact)) {
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return false;
                }
            }

            if (field.startsWith("reporttab_monitoring_indicator.month1rem")) {
                var index = field.replace("reporttab_monitoring_indicator.month1rem", "");
                if (srcModel.Indicators[index]) {
                    if (isEmpty(srcModel.Indicators[index].Month1Rem)) {
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return false;
                }
            }
            if (field.startsWith("reporttab_monitoring_indicator.month2rem")) {
                var index = field.replace("reporttab_monitoring_indicator.month2rem", "");
                if (srcModel.Indicators[index]) {
                    if (isEmpty(srcModel.Indicators[index].Month2Rem)) {
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return false;
                }
            }
            if (field.startsWith("reporttab_monitoring_indicator.month3rem")) {
                var index = field.replace("reporttab_monitoring_indicator.month3rem", "");
                if (srcModel.Indicators[index]) {
                    if (isEmpty(srcModel.Indicators[index].Month3Rem)) {
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return false;
                }
            }
            if (field.startsWith("reporttab_monitoring_indicator.month4rem")) {
                var index = field.replace("reporttab_monitoring_indicator.month4rem", "");
                if (srcModel.Indicators[index]) {
                    if (isEmpty(srcModel.Indicators[index].Month4Rem)) {
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return false;
                }
            }
            if (field.startsWith("reporttab_monitoring_indicator.month5rem")) {
                var index = field.replace("reporttab_monitoring_indicator.month5rem", "");
                if (srcModel.Indicators[index]) {
                    if (isEmpty(srcModel.Indicators[index].Month5Rem)) {
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return false;
                }
            }
            if (field.startsWith("reporttab_monitoring_indicator.month6rem")) {
                var index = field.replace("reporttab_monitoring_indicator.month6rem", "");
                if (srcModel.Indicators[index]) {
                    if (isEmpty(srcModel.Indicators[index].Month6Rem)) {
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return false;
                }
            }
            if (field.startsWith("reporttab_monitoring_indicator.month7rem")) {
                var index = field.replace("reporttab_monitoring_indicator.month7rem", "");
                if (srcModel.Indicators[index]) {
                    if (isEmpty(srcModel.Indicators[index].Month7Rem)) {
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return false;
                }
            }
            if (field.startsWith("reporttab_monitoring_indicator.month8rem")) {
                var index = field.replace("reporttab_monitoring_indicator.month8rem", "");
                if (srcModel.Indicators[index]) {
                    if (isEmpty(srcModel.Indicators[index].Month8Rem)) {
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return false;
                }
            }
            if (field.startsWith("reporttab_monitoring_indicator.month9rem")) {
                var index = field.replace("reporttab_monitoring_indicator.month9rem", "");
                if (srcModel.Indicators[index]) {
                    if (isEmpty(srcModel.Indicators[index].Month9Rem)) {
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return false;
                }
            }
            if (field.startsWith("reporttab_monitoring_indicator.month10rem")) {
                var index = field.replace("reporttab_monitoring_indicator.month10rem", "");
                if (srcModel.Indicators[index]) {
                    if (isEmpty(srcModel.Indicators[index].Month10Rem)) {
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return false;
                }
            }
            if (field.startsWith("reporttab_monitoring_indicator.month11rem")) {
                var index = field.replace("reporttab_monitoring_indicator.month11rem", "");
                if (srcModel.Indicators[index]) {
                    if (isEmpty(srcModel.Indicators[index].Month11Rem)) {
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return false;
                }
            }
            if (field.startsWith("reporttab_monitoring_indicator.month12rem")) {
                var index = field.replace("reporttab_monitoring_indicator.month12rem", "");
                if (srcModel.Indicators[index]) {
                    if (isEmpty(srcModel.Indicators[index].Month12Rem)) {
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return false;
                }
            }

            if (field.startsWith("reporttab_implementationsinfo_riskimplementationreason")) {
                var index = field.replace("reporttab_implementationsinfo_riskimplementationreason", "");
                if (srcModel.ImplementedRisksOrOpportunites[index]) {
                    if (isEmpty(srcModel.ImplementedRisksOrOpportunites[index].RiskImplementationReason)) {
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return false;
                }
            }

            if (field.startsWith("reporttab_implementationsinfo_month")) {
                var index = field.replace("reporttab_implementationsinfo_month", "");
                if (srcModel.ImplementedRisksOrOpportunites[index]) {
                    if (isEmpty(srcModel.ImplementedRisksOrOpportunites[index].Month)) {
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return false;
                }
            }

            if (field.startsWith("reporttab_implementationsinfo_qariskeffectfact")) {
                var index = field.replace("reporttab_implementationsinfo_qariskeffectfact", "");
                if (srcModel.ImplementedRisksOrOpportunites[index]) {
                    if (isEmpty(srcModel.ImplementedRisksOrOpportunites[index].QARiskEffectFact)) {
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return false;
                }
            }

            if (field.startsWith("reporttab_implementationsinfo_measurestoeliminate")) {
                var index = field.replace("reporttab_implementationsinfo_measurestoeliminate", "");
                if (srcModel.ImplementedRisksOrOpportunites[index]) {
                    if (isEmpty(srcModel.ImplementedRisksOrOpportunites[index].MeasuresToEliminate)) {
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return false;
                }
            }

            if (field.startsWith("reporttab_implementationsinfo_lessonslearned")) {
                var index = field.replace("reporttab_implementationsinfo_lessonslearned", "");
                if (srcModel.ImplementedRisksOrOpportunites[index]) {
                    if (isEmpty(srcModel.ImplementedRisksOrOpportunites[index].LessonsLearned)) {
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return false;
                }
            }

            if (field.startsWith("reporttab_plan_actualcostsimplementingact")) {
                if (isEmpty(srcModel.ActualCostsImplementingAct)) {
                    return false;
                } else {
                    return true;
                }
            }

            if (field.startsWith("reporttab_costeffectiveness_riskmanagementeffectiveness_e_valu")) {
                if (isEmpty(srcModel.RiskManagementEffectiveness_E_valu)) {
                    return false;
                } else {
                    return true;
                }
            }

            if (field.startsWith("reporttab_results_riskmanagementrecommendations")) {
                if (isEmpty(srcModel.RiskManagementRecommendations)) {
                    return false;
                } else {
                    return true;
                }
            }

            switch (field) {
                // pasporttab
                case 'pasporttab_generalinfo_reportyear':
                    if (isEmpty(srcModel.ReportYear)) {
                        return false;
                    } else {
                        return true;
                }
                    break;
                case 'pasporttab_generalinfo_name':
                    if (isEmpty(srcModel.Name)) {
                        return false;
                    } else {
                        return true;
                }
                    break;
                case 'pasporttab_generalinfo_description':
                    if (isEmpty(srcModel.Description)) {
                        return false;
                    } else {
                        return true;
                }
                    break;
                case 'pasporttab_generalinfo_strategicgoalid':
                    if (isEmpty(srcModel.StrategicGoalId)) {
                        return false;
                    } else {
                        return true;
                }
                    break;
                case 'pasporttab_generalinfo_societyid':
                    if (isEmpty(srcModel.SocietyId)) {
                        return false;
                    } else {
                        return true;
                }
                    break;
                case 'pasporttab_generalinfo_managementid':
                    if (isEmpty(srcModel.ManagementId)) {
                        return false;
                    } else {
                        return true;
                }
                    break;
                case 'pasporttab_generalinfo_riskkind':
                    if (isEmpty(srcModel.RiskKindId)) {
                        return false;
                    } else {
                        return true;
                }
                    break;
                case 'pasporttab_generalinfo_riskgroup':
                    if (isEmpty(srcModel.RiskGroupId)) {
                        return false;
                    } else {
                        return true;
                }
                    break;
                case 'pasporttab_generalinfo_areabusinessprocess':
                    if (isEmpty(srcModel.AreaBusinessProcessId)) {
                        return false;
                    } else {
                        return true;
                }
                    break;
                case 'pasporttab_generalinfo_threatopportunity':
                    if (isEmpty(srcModel.ThreatOpportunityId)) {
                        return false;
                    } else {
                        return true;
                }
                    break;
                case 'pasporttab_generalinfo_riskresponsestrategy':
                    if (isEmpty(srcModel.RiskResponseStrategyId)) {
                        return false;
                    } else {
                        return true;
                }
                    break;
                case 'pasporttab_generalinfo_unacceptablerisk':
                    if (isEmpty(srcModel.UnacceptableRisk)) {
                        return false;
                    } else {
                        return true;
                }
                    break;
                    // pasporttab_riskscore
                case 'pasporttab_riskscore_qariskeffect':
                    if (isEmpty(srcModel.QARiskEffect)) {
                        return false;
                    } else {
                        return true;
                }
                    break;
                case 'pasporttab_riskscore_rationaleforriskassessment':
                    if (isEmpty(srcModel.RationaleForRiskAssessment)) {
                        return false;
                    } else {
                        return true;
                }
                    break;
                case 'pasporttab_riskscore_riskappetite':
                    if (isEmpty(srcModel.RiskAppetite)) {
                        return false;
                    } else {
                        return true;
                }
                    break;
                    // pasporttab_formstructriskmngmntproc
                case 'pasporttab_formstructriskmngmntproc_optimizationregulations':
                    if (isEmpty(srcModel.OptimizationRegulations)) {
                        return false;
                    } else {
                        return true;
                }
                    break;
                case 'pasporttab_formstructriskmngmntproc_standartreglamentname':
                    if (isEmpty(srcModel.StandartReglamentName)) {
                        return false;
                    } else {
                        return true;
                }
                    break;
                case 'pasporttab_formstructriskmngmntproc_scheduledrequiredgrowthprocesses':
                    if (isEmpty(srcModel.ScheduledRequiredGrowthProcesses)) {
                        return false;
                    } else {
                        return true;
                }
                    break;
                    // pasporttab_responsibles
                case 'pasporttab_responsibles_managerfio':
                    if (isEmpty(srcModel.ManagerFIO)) {
                        return false;
                    } else {
                        return true;
                }
                    break;
                case 'pasporttab_responsibles_managerpost':
                    if (isEmpty(srcModel.ManagerPost)) {
                        return false;
                    } else {
                        return true;
                }
                    break;
                case 'pasporttab_responsibles_manageruserinfoid':
                    if (isEmpty(srcModel.ManagerUserInfoId)) {
                        return false;
                    } else {
                        return true;
                }
                    break;
                case 'pasporttab_responsibles_administratorfio':
                    if (isEmpty(srcModel.AdministratorFIO)) {
                        return false;
                    } else {
                        return true;
                }
                    break;
                case 'pasporttab_responsibles_administratorpost':
                    if (isEmpty(srcModel.AdministratorPost)) {
                        return false;
                    } else {
                        return true;
                }
                    break;
                case 'pasporttab_responsibles_administratoruserinfoid':
                    if (isEmpty(srcModel.AdministratorUserInfoId)) {
                        return false;
                    } else {
                        return true;
                }
                    break;
                    // 
                case 'pasporttab_responsibles_administratoruserinfoid':
                    if (isEmpty(srcModel.AdministratorUserInfoId)) {
                        return false;
                    } else {
                        return true;
                }
                    break;

                default:
                    return false;
            }
            return false;
        }
        function getIsFieldRequired(prefix, fieldName, model, item, formType) {
            if ((prefix || "").indexOf("pasporttab_") === 0) {
                if (fieldName === "pasporttab_formstructriskmngmntproc_standartreglamentname"){
                    return false;
                } else {
                    if ((fieldName || "").indexOf("pasporttab_indicators_measureid") === 0){
                        if ((fieldName || "").indexOf("_custom") > 0 && item === false ) {
                            return false;
                        }
                        if ((fieldName || "").indexOf("_custom") === 0 && item === true) {
                            return false;
                        }
                    }
                    return true;
                }
            }
            if ((prefix || "").indexOf("plangraphtab") === 0) {
                if (fieldName === "plangraphtab_stepstartfact" ||
                    fieldName === "plangraphtab_stepfinishfact" ||
                    fieldName === "plangraphtab_substepstartfact" ||
                    fieldName === "plangraphtab_substepfinishfact" ||
                    fieldName.indexOf("plangraphtab_stepcomment") === 0) {
                    return false;
                }
                if (fieldName.indexOf("plangraphtab_stepreasonlate") === 0) {
                    //return false;
                    // Причина отклонения/невыполнения
                    // Проверка внесенных данных: 
                    //      - если статус этапа/подэтапа равен «не начат», «в процессе выполнения», «выполнен» и 
                    //      или отклонения от плана графика (от даты начала, окончания) > 0  или текущее отклонение (от даты начала, окончания) > 0, 
                    //      и в данном поле пусто, 
                    //          то отображается служебное сообщение «Необходимо указать причину отклонения от плана-графика».
                    //      - если статус этапа/подэтапа равен «не выполнен», «не актуален», «отложен», 
                    //      и в данном поле пусто, 
                    //          то отображается служебное сообщение «Необходимо указать причину не выполнения/неактуальности/переноса реализации этапа/подэтапа».
                    var status = item.Status;
                    if (isEmpty(item.ReasonLate)) {
                        if (status === "Не начат" || status === "В процессе выполнения" || status === "Выполнен") {
                            if (item.StartDivergenceDay > 0 || item.FinishDivergenceDay > 0 || item.CurrentStartDivergenceDay > 0 || item.CurrentFinishDivergenceDay > 0) {
                                return true;
                            }
                        }
                        if (status === "Не выполнен" || status === "Не актуален" || status === "Отложен") {
                            return true;
                        }
                    }
                    return false;
                }
                if (fieldName.indexOf("plangraphtab_stepresponsiblesundefined") === 0) {
                    if ((item.Responsibles || []).length > 0) {
                        return false;
                    }
                }
                return true;
            }
            // по дефолту поле не обязательное
            return false;
        }
        function getIsFieldReadOnly(prefix, fieldName, model, item, formType) {
            // Администратор/Владелец риска имеет доступ на заполнение информации во вкладке «Паспорт риска», 
            // а также на корректирование заполненной информации в течение 7 дней со дня создания карточки риска. 
            // По истечении установленного срока информация на вкладке «Паспорт риска» защищена от корректировок. 
            // Сотрудники отдела стратегического и проектного управления (OSIPU ( учетная запись - i:0#.w|ne\osipu)) 
            // имеют полный доступ на заполнение/редактирование информации в карточке риска.            
            // /////////////////////////////////////
            // https://tux.softage.ru/bz_sp/show_bug.cgi?id=345
            // Alyona Kozhakina     2015-04-08 16:00:45 NOVT  
            // 1) В поле внесли данные, сохранили. После этого при открытии формы изменения считаем поле с заполненным значением защищённым. Далее позволяем редактировать значения только если в поле пусто либо если взведён флаг "Разрешить редактирование" 
            // + остаются условия 1) всё доступно осипу  2) прочие условия типа пользователь администратор/владелец риска, ответственный за этап/подэтап 
            // Клиенты предлагают сделать это для всех полей всех вкладок
            // Alyona Kozhakina     2015-04-08 21:37:16 NOVT  
            // +
            // для админов, руководителей и ответственных еще поля указанные ниже всегда
            // доступны для редактирования
            //· Дата начала_Факт
            //· Дата окончания_Факт
            //· Причина отклонения/невыполнения
            //· Комментарии и пояснения
            //(потому что очень часто меняются)
            // /////////////////////////////////////
            // резюмирую, делаем так. если это форма создания или сотрудник ОСиПУ или взведён флаг "Разрешить редактирование", тогда поле не ридонли (+если поле не вычисляемое или оно не всегда ридонли)
            // иначе если это ответственный или администратор риска, тогда если поле не пустое, то оно ридонли (защищено), иначе проверяем остальные правила.
            //if ((prefix || "").indexOf("pasporttab_") === 0) {
            //    if (formType === "NewForm" || isOSIPU_User(model) || (isAdminOwner(model) && isCreatedLessThan7DayAgo(model))) {
            //        // Данное поле доступно для внесения данных в случае если в поле «Оптимизация регламент.базы: стандарты, регламенты, указания, инструкции» 
            //        // указаны следующие значения: «Нужен пересмотр стандарта/регламента области, процесса»; «Есть стандарт/регламент»
            //        if (fieldName === "pasporttab_formstructriskmngmntproc_standartreglamentname") {
            //            if (model.model.OptimizationRegulations === "Нужен пересмотр стандарта/регламента области, процесса" || model.model.OptimizationRegulations === "Есть стандарт/регламент") {
            //                return false;
            //            } else {
            //                model.model.StandartReglamentName = null;
            //                return true;
            //            }
            //        } else {
            //            return false;
            //        }
            //    }
            //}
            if ((prefix || "").indexOf("pasporttab_") === 0) {
                if (formType === "NewForm" || isOSIPU_User(model) || (isAdminOwner(model) && model.model.IsEditAllow)) {
                    // Данное поле доступно для внесения данных в случае если в поле «Оптимизация регламент.базы: стандарты, регламенты, указания, инструкции» 
                    // указаны следующие значения: «Нужен пересмотр стандарта/регламента области, процесса»; «Есть стандарт/регламент»
                    if (fieldName === "pasporttab_formstructriskmngmntproc_standartreglamentname") {
                        if (model.model.OptimizationRegulations === "Нужен пересмотр стандарта/регламента области, процесса" || model.model.OptimizationRegulations === "Есть стандарт/регламент") {
                            return false;
                        } else {
                            model.model.StandartReglamentName = null;
                            return true;
                        }
                    } else {
                        return false;
                    }
                }
                if (isAdminOwner(model) && isCreatedLessThan7DayAgo(model)) {
                    if (fieldName === "pasporttab_formstructriskmngmntproc_standartreglamentname") {
                        if (model.model.OptimizationRegulations === "Нужен пересмотр стандарта/регламента области, процесса" || model.model.OptimizationRegulations === "Есть стандарт/регламент") {
                            if (isFieldProtected(model.model, model.srcModel, fieldName, item)) {
                                return true;
                            } else {
                                return false;
                            }
                        } else {
                            model.model.StandartReglamentName = null;
                            return true;
                        }
                    } else {
                        if (isFieldProtected(model.model, model.srcModel, fieldName, item)) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                }
            }
            // Доступ на внесение/корректирование информации в план-график имеет 
            //  администратор риска (поле «Администратор риска», вкладка «Паспорт риска»), 
            //  Владелец риска (поле «Владелец риска», вкладка «Паспорт риска») 
            //  и сотрудники, ответственные за реализацию этапов (поле «Ответственный», вкладка «План-график»).
            // + OSIPU имеют полный доступ
            if ((prefix || "").indexOf("plangraphtab") === 0) {
                if (formType === "NewForm" || isOSIPU_User(model) || (isAdminOwner(model) && model.model.IsEditAllow)) {
                    if (item && item.Childs && getNotDeletedItems(item.Childs).length > 0) {
                        if (fieldName.startsWith("plangraphtab_stepstartplan") || fieldName.startsWith("plangraphtab_stepfinishplan") ||
                            fieldName.startsWith("plangraphtab_stepstartfact") || fieldName.startsWith("plangraphtab_stepfinishfact")) {
                            return true;
                        }
                        if (fieldName.startsWith("plangraphtab_stepstatus")) {
                            return true;
                        }
                    }
                    return false;
                }
                if ((model.model.CurrentUserInfoId &&
                    (model.model.AdministratorUserInfoId === model.model.CurrentUserInfoId ||
                    model.model.ManagerUserInfoId === model.model.CurrentUserInfoId ||
                    (item && ($filter('filter')(item.Responsibles, { Id: model.model.CurrentUserInfoId }, true) || []).length === 1)))) {
                    if (item && item.Childs && getNotDeletedItems(item.Childs).length > 0) {
                        if (fieldName.startsWith("plangraphtab_steptitle") || fieldName.startsWith("plangraphtab_stepactiontype") ||
                            fieldName.startsWith("plangraphtab_stepresponsibles") || fieldName.startsWith("plangraphtab_stepstatus") ||
                            fieldName.startsWith("plangraphtab_stepstartplan") || fieldName.startsWith("plangraphtab_stepfinishplan") ||
                            fieldName.startsWith("plangraphtab_stepstartfact") || fieldName.startsWith("plangraphtab_stepfinishfact")) {
                            return true;
                        }
                    }
                    if (item && (!item.Childs || (item.Childs && getNotDeletedItems(item.Childs).length === 0))) {
                        if (fieldName.startsWith("plangraphtab_stepstartfact") || fieldName.startsWith("plangraphtab_stepfinishfact") ||
                            fieldName.startsWith("plangraphtab_stepreasonlate") || fieldName.startsWith("plangraphtab_stepcomment") ||
                            fieldName.startsWith("plangraphtab_substepstartfact")  || fieldName.startsWith("plangraphtab_substepfinishfact") ||
                            fieldName.startsWith("plangraphtab_substepreasonlate") || fieldName.startsWith("plangraphtab_substepcomment")) {
                            return false;
                        } else {
                            return true;
                        }
                    }
                    return false;
                }
                return true;
            }
            // Если текущая дата >=31 Декабря и текущий год не равен значению в поле «Отчетный год», 
            // тогда администратор/владелец риска имеет возможность на корректировку заполненных данных в течение 25 дней 
            // со дня изменения статуса выполнения плана мероприятий на указанные выше. 
            // Сотрудники отдела стратегического и проектного управления (OSIPU ( учетная запись - i:0#.w|ne\osipu)) 
            // имеют полный доступ на заполнение/редактирование информации в данной вкладке.
            if ((prefix || "").indexOf("reporttab_") === 0) {
                if (formType === "NewForm" || isOSIPU_User(model) || (isAdminOwner(model) && model.model.IsEditAllow)) {
                    if ((prefix || "").indexOf("reporttab_monitoring") === 0) {
                        if (
                            (fieldName || "").indexOf("reporttab_monitoring_measureid") === 0 ||
                            (fieldName || "").indexOf("reporttab_monitoring_riskoutmin") === 0 ||
                            (fieldName || "").indexOf("reporttab_monitoring_riskoutmax") === 0 ||
                            (fieldName || "").indexOf("reporttab_monitoring_riskmedmin") === 0 ||
                            (fieldName || "").indexOf("reporttab_monitoring_riskmedmax") === 0) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                    if ((prefix || "").indexOf("reporttab_implementationsinfo") === 0) {
                        if (
                            (fieldName || "").indexOf("reporttab_monitoring_measureid") === 0 ||
                            (fieldName || "").indexOf("reporttab_monitoring_riskoutmin") === 0 ||
                            (fieldName || "").indexOf("reporttab_monitoring_riskoutmax") === 0 ||
                            (fieldName || "").indexOf("reporttab_monitoring_riskmedmin") === 0 ||
                            (fieldName || "").indexOf("reporttab_monitoring_riskmedmax") === 0) {
                            return true;
                        } else {
                            return false;
                        }
                    }

                    if ((prefix || "").indexOf("reporttab_plan") === 0) {
                        if ((fieldName || "").indexOf("reporttab_plan_actualcostsimplementingact") === 0) {
                            return false;
                        } else {
                            return true;
                        }
                    }
                    if ((prefix || "").indexOf("reporttab_costeffectiveness") === 0) {
                        if ((fieldName || "").indexOf("reporttab_costeffectiveness_riskmanagementeffectiveness_e_valu") === 0) {
                            return false;
                        } else {
                            return true;
                        }
                    }
                    if ((prefix || "").indexOf("reporttab_results") === 0) {
                        if ((fieldName || "").indexOf("reporttab_results_riskmanagementrecommendations") === 0) {
                            return false;
                        } else {
                            return true;
                        }
                    }
                }
                if (isAdminOwner(model)) {
                    if ((prefix || "").indexOf("reporttab_monitoring") === 0) {
                        if (
                            (fieldName || "").indexOf("reporttab_monitoring_measureid") === 0 ||
                            (fieldName || "").indexOf("reporttab_monitoring_riskoutmin") === 0 ||
                            (fieldName || "").indexOf("reporttab_monitoring_riskoutmax") === 0 ||
                            (fieldName || "").indexOf("reporttab_monitoring_riskmedmin") === 0 ||
                            (fieldName || "").indexOf("reporttab_monitoring_riskmedmax") === 0) {
                            return true;
                        } else {
                            if (isFieldProtected(model.model, model.srcModel, fieldName, item)) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                    }
                    if ((prefix || "").indexOf("reporttab_implementationsinfo") === 0) {
                        if (
                            (fieldName || "").indexOf("reporttab_monitoring_measureid") === 0 ||
                            (fieldName || "").indexOf("reporttab_monitoring_riskoutmin") === 0 ||
                            (fieldName || "").indexOf("reporttab_monitoring_riskoutmax") === 0 ||
                            (fieldName || "").indexOf("reporttab_monitoring_riskmedmin") === 0 ||
                            (fieldName || "").indexOf("reporttab_monitoring_riskmedmax") === 0) {
                            return true;
                        } else {
                            if (isFieldProtected(model.model, model.srcModel, fieldName, item)) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                    }

                    if ((prefix || "").indexOf("reporttab_plan") === 0) {
                        if ((fieldName || "").indexOf("reporttab_plan_actualcostsimplementingact") === 0) {
                            if (isFieldProtected(model.model, model.srcModel, fieldName, item)) {
                                return true;
                            } else {
                                return false;
                            }
                        } else {
                            return true;
                        }
                    }
                    if ((prefix || "").indexOf("reporttab_costeffectiveness") === 0) {
                        if ((fieldName || "").indexOf("reporttab_costeffectiveness_riskmanagementeffectiveness_e_valu") === 0) {
                            if (isFieldProtected(model.model, model.srcModel, fieldName, item)) {
                                return true;
                            } else {
                                return false;
                            }
                        } else {
                            return true;
                        }
                    }
                    if ((prefix || "").indexOf("reporttab_results") === 0) {
                        if ((fieldName || "").indexOf("reporttab_results_riskmanagementrecommendations") === 0) {
                            if (isFieldProtected(model.model, model.srcModel, fieldName, item)) {
                                return true;
                            } else {
                                return false;
                            }
                        } else {
                            return true;
                        }
                    }
                }
                else {
                    return true;
                }
            } else {
                return true;
            }
            // для формы просмотра все поля ридонли
            return true;
        }
        function getIsShowAddItemButton(listName, list, model, item, formType) {
            switch (listName) {
                case "RiskFactors":
                    if (formType === "NewForm" || isOSIPU_User(model) || (isAdminOwner(model) && isCreatedLessThan7DayAgo(model))) {
                        if (!list || getNotDeletedItems(list).length < 10) {
                            return true;
                        }
                    }
                    break;
                case "ConsequencesOfRisk":
                    if (formType === "NewForm" || isOSIPU_User(model) || (isAdminOwner(model) && isCreatedLessThan7DayAgo(model))) {
                        if (!list || getNotDeletedItems(list).length < 10) {
                            return true;
                        }
                    }
                    break;
                case "Indicators":
                    if (formType === "NewForm" || isOSIPU_User(model) || (isAdminOwner(model) && isCreatedLessThan7DayAgo(model))) {
                        if (!list || getNotDeletedItems(list).length < 5) {
                            return true;
                        }
                    }
                    break;
                case "Steps":
                    if (formType === "NewForm" || isOSIPU_User(model) || (model.model.CurrentUserInfoId &&
                        (model.model.AdministratorUserInfoId === model.model.CurrentUserInfoId ||
                        model.model.ManagerUserInfoId === model.model.CurrentUserInfoId))) {
                        if (!list || getNotDeletedItems(list).length < 20) {
                            return true;
                        }
                    }
                    break;
                case "SubSteps":
                    if (formType === "NewForm" || isOSIPU_User(model) || (model.model.CurrentUserInfoId &&
                        (model.model.AdministratorUserInfoId === model.model.CurrentUserInfoId ||
                        model.model.ManagerUserInfoId === model.model.CurrentUserInfoId 
                        // ||(item && item.ResponsibleUserInfoId === model.model.CurrentUserInfoId)
                        ))) {
                        if (!list || getNotDeletedItems(list).length < 20) {
                            return true;
                        }
                    }
                    break;
                case "ImplementedRisksOrOpportunites":
                    if (formType === "NewForm" || isOSIPU_User(model) || (isAdminOwner(model) && isCreatedLessThan7DayAgo(model))) {
                        if (!list || getNotDeletedItems(list).length < 12) {
                            return true;
                        }
                    }
                    break;
                default:
                    break;
            }
            // если явно не задано, то кнопку добавления не рисуем
            return false;
        }
        function getIsShowRemoveItemButton(listName, item, model, formType) {
            switch (listName) {
                case "RiskFactors":
                    if (formType === "NewForm" || isOSIPU_User(model) || (isAdminOwner(model) && isCreatedLessThan7DayAgo(model))) {
                        return true;
                    }
                    break;
                case "ConsequencesOfRisk":
                    if (formType === "NewForm" || isOSIPU_User(model) || (isAdminOwner(model) && isCreatedLessThan7DayAgo(model))) {
                        return true;
                    }
                    break;
                case "Indicators":
                    if (formType === "NewForm" || isOSIPU_User(model) || (isAdminOwner(model) && isCreatedLessThan7DayAgo(model))) {
                        return true;
                    }
                    break;
                case "Steps":
                    if (formType === "NewForm" || isOSIPU_User(model) || (model.model.CurrentUserInfoId &&
                        (model.model.AdministratorUserInfoId === model.model.CurrentUserInfoId ||
                        model.model.ManagerUserInfoId === model.model.CurrentUserInfoId))) {
                        return true;
                    }
                    break;
                case "SubSteps":
                    if (formType === "NewForm" || isOSIPU_User(model) || (model.model.CurrentUserInfoId &&
                        (model.model.AdministratorUserInfoId === model.model.CurrentUserInfoId ||
                        model.model.ManagerUserInfoId === model.model.CurrentUserInfoId
                        ))) {
                        return true;
                    }
                    break;
                case "ImplementedRisksOrOpportunites":
                    if (formType === "NewForm" || isOSIPU_User(model) || (isAdminOwner(model) && isCreatedLessThan7DayAgo(model))) {
                        return true;
                    }
                    break;
                default:
                    break;
            }
            // если явно не задано, то кнопку удаления не рисуем
            return false;
        }

        // TODO - выкосить вместе с разметкой при релизе
        this.isShowDevPanel = function () {
            var result = getQueryStringParameter("isShowDevPanel");
            return result === "true";
        };
        // TODO - выкосить вместе с разметкой при релизе
        this.isShowDevInfo = function () {
            var result = getQueryStringParameter("isShowDevInfo");
            return result === "true";
        };
        this.isOSIPU_User = function (model) {
            return isOSIPU_User(model)
        };
        this.getSourceFromUrl = function () {
            return getSourceFromUrl();
        };
        this.getFormTypeFromUrl = function () {
            var result = getFormTypeFromUrl();
            return result;
        };
        this.getActualizationUrl = function () {
            var str = "assets/templates/NewForm.aspx?ID=" + getIDFromUrl() + "&IsActualization=true" + "&Source=" + getSourceFromUrl();;
            var result = getHandlerUrl().replace("RiskCardHandler.ashx",str);
            return result;
        };
        this.getRiskCard = function () {

            var id = getIDFromUrl();
            var isActualization = getIsActualizationFromUrl();
            var deferred = null;
            if (isFakeService) {
                deferred = $q.defer();

                $timeout(function () {
                    var result = {
                        Data: {
                            Lists: getLists(),
                            RiskCardModel: getModel(id)
                        },
                        Error: "",
                        ErrorInfo: ""
                    };

                    deferred.resolve(result);

                }, Math.random() * 2000);

                return deferred.promise;
            }
            else {
                deferred = $q.defer();

                $http({
                    method: 'GET',
                    url: handlerUrl + (isEmpty(id) ? '?method=loadDefault' : (getIsActualizationFromUrl() ? ('?method=actualization&id=' + id) : ('?method=load&id=' + id))) + "&dt=" + (new Date()),
                    //data: customJSONstringify({ HandlerAction: 0 }),
                    headers: { 'Content-Type': 'application/json' }
                }).
                success(function (data, status, headers, config) {
                    var result = data;
                    deferred.resolve(result);
                }).
                error(function (data, status, headers, config) {
                    var msg = 'Request failed. ' + data + '\n' + status + '\n' + headers + '\n' + config;
                    console.log(msg);
                    deferred.reject(msg);
                });
                return deferred.promise;
            }
        };
        this.save = function (ctx) {

            var id = getIDFromUrl();
            var isActualization = getIsActualizationFromUrl();
            var deferred = null;

            function onSuccess(result) {

                var formDigest = result; // document.getElementById("__REQUESTDIGEST").value;
                ctx.model.ClientTimeZoneOffset = (new Date()).getTimezoneOffset();
                $http({
                    method: 'POST',
                    url: handlerUrl + ((isActualization || isEmpty(id)) ? ('?method=create' + (isActualization ? ('&id=' + id) : '')) : ('?method=update&id=' + id)),
                    data: { RiskCardModel: ctx.model }, //customJSONstringify({ HandlerAction: 0 }),
                    headers: { 'Content-Type': 'application/json', "X-RequestDigest": formDigest }
                }).
                success(function (data, status, headers, config) {
                    var result = data;
                    deferred.resolve(result);
                }).
                error(function (data, status, headers, config) {
                    var msg = 'Request failed. ' + data + '\n' + status + '\n' + headers + '\n' + config;
                    console.log(msg);
                    deferred.reject(msg);
                });
                return deferred.promise;
            }

            function onError(reason) {
                deferred.reject(reason);
            }


            if (isFakeService) {
                deferred = $q.defer();

                $timeout(function () {
                    var result = {
                        Error: "",
                        ErrorInfo: ""
                    };

                    deferred.resolve(result);

                }, Math.random() * 2000);

                return deferred.promise;
            }
            else {
                deferred = $q.defer();
                var formDigestPromise = this.getFormDigest();
                formDigestPromise.then(onSuccess, onError);
                return deferred.promise;
            }
        };
        this.getFormDigest = function () {

            var deferred = $q.defer();

            $http({
                method: 'POST',
                url: getFormDigestMethodUrl(),
                headers: {
                    "accept": "application/json; odata=verbose",
                    "content-type": "application/json;odata=verbose"
                },
                contentType: "application/json;charset=utf-8"
            }).
            success(function (data, status, headers, config) {
                var result = data.d.GetContextWebInformation.FormDigestValue;
                deferred.resolve(result);
            }).
            error(function (data, status, headers, config) {
                var msg = 'Get FormDigest request failed. ' + data + '\n' + status + '\n' + headers + '\n' + config;
                console.log(msg);
                deferred.reject(msg);
            });
            return deferred.promise;
        };
        this.isFieldRequired = function (prefix, fieldName, model, item) {
            switch (getFormType(model)) {
                case "DisplayForm":
                    // для формы просмотра все поля не обязательны
                    return false;
                case "NewForm":
                    return getIsFieldRequired(prefix, fieldName, model, item, "NewForm");
                case "EditForm":
                    return getIsFieldRequired(prefix, fieldName, model, item, "EditForm");
                default:
                    break;
            }
            // по дефолту поле не обязательное
            return false;
        };
        this.isFieldReadOnly = function (prefix, fieldName, model, item) {
            switch (getFormType(model)) {
                case "DisplayForm":
                    // для формы просмотра все поля ридонли
                    return true;
                case "NewForm":
                    return getIsFieldReadOnly(prefix, fieldName, model, item, "NewForm");
                case "EditForm":
                    return getIsFieldReadOnly(prefix, fieldName, model, item, "EditForm");
                default:
                    break;
            }
            // если явно не задано, то поле недоступно для редактирования
            return true;
        };
        this.isShowAddItemButton = function (listName, list, model, item) {
            switch (getFormType(model)) {
                case "DisplayForm":
                    // для формы просмотра кнопку добавления не рисуем
                    return false;
                case "NewForm":
                    return getIsShowAddItemButton(listName, list, model, item, "NewForm");
                case "EditForm":
                    return getIsShowAddItemButton(listName, list, model, item, "EditForm");
                default:
                    break;
            }
            // если явно не задано, то кнопку добавления не рисуем
            return true;
        };
        this.isShowRemoveItemButton = function (listName, item, model) {
            switch (getFormType(model)) {
                case "DisplayForm":
                    // для формы просмотра кнопку добавления не рисуем
                    return false;
                case "NewForm":
                    return getIsShowRemoveItemButton(listName, item, model, "NewForm");
                case "EditForm":
                    return getIsShowRemoveItemButton(listName, item, model, "EditForm");
                default:
                    break;
            }
            // если явно не задано, то кнопку удаления не рисуем
            return true;
        };
        this.getListErrorMessage = function (list, listName, model) {
            switch (listName) {
                case "RiskFactors":
                    if (list && getNotDeletedItems(list).length === 0) {
                        return "Первая строка таблицы «Причины риска» являются обязательной для заполнения";
                    }
                    break;
                case "ConsequencesOfRisk":
                    if (list && getNotDeletedItems(list).length === 0) {
                        return "Первая строка таблицы «Последствия риска» являются обязательной для заполнения";
                    }
                    break;
                case "Indicators":
                    if (list && getNotDeletedItems(list).length === 0) {
                        return "Первая строка таблицы «Индикатор для количественной оценки и мониторинга риска» является обязательной для заполнения";
                    }
                    break;
                default:
                    return null;
            }
        };
        this.getStatusNameById = function (statuses, id) {
            var values = $filter('filter')(statuses, { Id: id }, true);
            if (values && values.length === 1) {
                return values[0].Title;
            }
            return null;
        };
        this.getStatusByTitle = function (statuses, title) {
            var values = $filter('filter')(statuses, { Title: title }, true);

            if (values && values.length === 1) {
                return $filter('filter')(statuses, { Title: title }, true)[0];
            }
            return null;
        };
    }

})();

9