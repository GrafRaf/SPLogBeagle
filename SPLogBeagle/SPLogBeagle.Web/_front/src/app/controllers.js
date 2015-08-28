(function () {
    'use strict';

    angular.module('Softage.RiskCard.Controllers', ['Softage.RiskCard.Services'])
    .controller('RiskCardController', RiskCardController)
    .controller('RiskPassportController', RiskPassportController)
    .controller('RiskPlanGraphController', RiskPlanGraphController)
    .controller('ProjectReportEditController', ProjectReportEditController)
    .directive('numberOnlyInput', NumberOnlyInput);


    function RiskCardController($scope, $filter, RiskCardService) {

        this.isShowProgress = true;
        this.FormTypes = ["NewForm", "EditForm", "DisplayForm"];
        //this.FormType = this.FormTypes[0];
        var formType = RiskCardService.getFormTypeFromUrl();
        if (formType !== "") {
            var formTypes= $filter('filter')(this.FormTypes, { $: formType }, true);
            if (formTypes.length===1){
                this.FormType = formTypes[0];
            }
        }
        this.lists = {};
        this.model = {};
        this.model.IsOSIPU_User = false;
        this.Error = "";
        this.ErrorInfo = "";
        this.model.IsOSIPU_User = false;
        this.isShowDevPanel = function () {
            var result = RiskCardService.isShowDevPanel();
            return result;
        };
        this.isShowDevInfo = function () {
            var result = RiskCardService.isShowDevInfo();
            return result;
        };
        this.isOSIPU_User = function () {
            var result = this.model.IsOSIPU_User;
            return result;
        };

        this.init = function (ctx) {
            ctx.isShowProgress = true;
            function onSuccess(result) {
                if (result.Error === "" && result.ErrorInfo === "") {
                    ctx.lists = result.Data.Lists;
                    ctx.model = result.Data.RiskCardModel;
                    var srcModel = angular.toJson(result.Data.RiskCardModel);
                    ctx.srcModel = angular.fromJson(srcModel);
                    ctx.refreshProbability();
                } else {
                    ctx.Error = result.Error;
                    ctx.ErrorInfo = result.ErrorInfo;
                }
                ctx.isShowProgress = false;
            }
            
            function onError(reason) {
                alert('При загрузке возникла ошибка: ' + reason);
                ctx.isShowProgress = false;
            }
            
            var promise = RiskCardService.getRiskCard();
            promise.then(onSuccess, onError);
        };

        this.addUser = function (user, users) {
            if (users == undefined) {
                users = [];
            }
            var temp = $filter('filter')(users, {Id: user.Id});
            if (temp && temp.length == 0) {
                var u = user;
                users.push(u);
            }
        };

        this.removeUser = function (user, users) {
            var temp = $filter('filter')(users, { Id: user.Id });
            if (temp && temp.length == 1) {
                users.splice(users.indexOf(temp[0]), 1);
            }
        };

        this.save = function (ctx) {
            function onSuccess(result) {
                if (result.Error === "" && result.ErrorInfo === "") {
                    //ctx.lists = result.Data.Lists;
                    //ctx.model = result.Data.RiskCardModel;
                    var source = RiskCardService.getSourceFromUrl();
                    location.href = source;
                } else {
                    ctx.Error = result.Error;
                    ctx.ErrorInfo = result.ErrorInfo;
                }
                ctx.isShowProgress = false;
            }

            function onError(reason) {
                alert('При сохранении возникла ошибка: ' + reason);
                ctx.isShowProgress = false;
            }

            ctx.model.IsPreventionPlanComplete = this.isPlanForPreventionComplete();
            ctx.model.HasPreventionPlanDeviation = this.isPlanForPreventionHasDeviations();
            ctx.model.IsReactPlanComplete = this.isReponsePlanComplete();
            ctx.model.HasReactPlanDeviation = this.isReponsePlanHasDeviations();
            if (this.isSaveDisabled()) {
                alert("Исправьте ошибки и попробуйте сохранить снова.");
            } else {
                ctx.isShowProgress = true;
                var promise = RiskCardService.save(this);
                promise.then(onSuccess, onError);
            }
        };

        this.cancel = function () {
            var source = RiskCardService.getSourceFromUrl();
            location.href = source;
        };

        this.ActualizeRiskCard = function () {
            var source = RiskCardService.getActualizationUrl();
            location.href = source;
        };

        this.getNotDeleted = function (list) {
            return $filter('filter')(list, { IsDeleted: !true })||[];
        };

        this.addNewItem = function (list, listName) {
            if (!list) {
                list = [];
            }
            list.push({ Id: null, Title: null, IsDeleted: false });
        };

        this.removeItem = function (item) {
            if (item) {
                item.IsDeleted = true;
            }
            this.refreshProbability();
        };

        this.isFieldRequired = function (prefix, field, item) {
            var result = RiskCardService.isFieldRequired(prefix, field, this, item);
            return result;
        };

        this.isFieldReadOnly = function (prefix, field, item) {
            var result = RiskCardService.isFieldReadOnly(prefix, field, this, item);
            return result;
        };

        this.isShowAddItemButton = function (list, listName) {
            var result = RiskCardService.isShowAddItemButton(listName, list, this);
            return result;
        };

        this.isShowRemoveItemButton = function (listName, item) {
            var result = RiskCardService.isShowRemoveItemButton(listName, item, this);
            return result;
        };

        this.getListErrorMessage = function (list, listName) {
            var result = RiskCardService.getListErrorMessage(list, listName, this);
            return result;
        };

        this.getDateOptions = function () {
            return { startingDay: 1 };
        };

        // ReportTab
        this.getProbabilityImageId = function (_fact, _riskOutMin, _riskOutMax, _riskMedMin, _riskMedMax, indicator, index) {
            var fact = parseFloat(_fact),
                riskOutMin = parseFloat(_riskOutMin),
                riskOutMax = parseFloat(_riskOutMax),
                riskMedMin = parseFloat(_riskMedMin),
                riskMedMax = parseFloat(_riskMedMax);
            function setProb(indicator, index, prob) {
                if (!indicator || !index) return;
                switch (index) {
                    case 1:
                        indicator.Month1Probability = prob;
                        break;
                    case 2:
                        indicator.Month2Probability = prob;
                        break;
                    case 3:
                        indicator.Month3Probability = prob;
                        break;
                    case 4:
                        indicator.Month4Probability = prob;
                        break;
                    case 5:
                        indicator.Month5Probability = prob;
                        break;
                    case 6:
                        indicator.Month6Probability = prob;
                        break;
                    case 7:
                        indicator.Month7Probability = prob;
                        break;
                    case 8:
                        indicator.Month8Probability = prob;
                        break;
                    case 9:
                        indicator.Month9Probability = prob;
                        break;
                    case 10:
                        indicator.Month10Probability = prob;
                        break;
                    case 11:
                        indicator.Month11Probability = prob;
                        break;
                    case 12:
                        indicator.Month12Probability = prob;
                        break;
                    default:
                        break;
                }
            }

            // Значение в данном поле заполняется следующим образом: 
            //  если последнее фактическое значение_Месяц >= минимального значения и <=максимального значения диапазона значений для безрисковой зоны, 
            //  	то отображается графическое изображение -  1. 
            if (fact >= riskOutMin && fact <= riskOutMax) {
                setProb(indicator, index, "Низкая");
                return 1;
            }
            //  Если последнее фактическое значение_Месяц < минимального значения или > максимального значения диапазона значений для безрисковой зоны 
            //  и если фактическое значение_Месяц >= минимального значения и <=максимального значения диапазона значений для умеренной зоны, 
            //  	то отображается графическое изображение -  2. 
            if ((fact < riskOutMin || fact > riskOutMax) && fact >= riskMedMin && fact <= riskMedMax) {
                setProb(indicator, index, "Средняя");
                return 2;
            }
            //  Если фактическое значение_Месяц < минимального значения или > максимального значения диапазона значений для умеренной зоны, 
            //  	то отображается графическое изображение -  3.
            if (fact < riskMedMin || fact > riskMedMax) {
                setProb(indicator, index, "Высокая");
                return 3;
            }
            setProb(indicator, index, null);
            return null;
        };

        this.getProbabilityCommonImageId = function (indicator) {
            var value =
                indicator.Month12Fact || indicator.Month11Fact || indicator.Month10Fact || indicator.Month9Fact || indicator.Month8Fact || indicator.Month7Fact ||
                indicator.Month6Fact || indicator.Month5Fact || indicator.Month4Fact || indicator.Month3Fact || indicator.Month2Fact || indicator.Month1Fact;
            if (value) {
                var result = this.getProbabilityImageId(value, indicator.RiskOutMin, indicator.RiskOutMax, indicator.RiskMedMin, indicator.RiskMedMax);
                indicator.RiskProbability = (result === 1 ? "Низкая" : (result === 2 ? "Средняя" : (result === 3 ? "Высокая" : null)));
                return result;
            }
            indicator.RiskProbability = null;
            return null;
        };

        this.costEffectiveness = function () {
            //	Экономический эффект управления риском имеет тип поля – Вычисляемый (вычисление по другим столбцам). 
            //	Формула расчета следующая: 
            //		если текущая дата >= 31 Декабря и текущий год не равен значению в поле «Отчетный год» или в поле «Риск реализован» проставлена галочка, 
            //			то формула расчета следующая: (СУММ([Количественная оценка влияния риска, руб. (Факт)*)] - [Фактические затраты на реализацию плана мероприятий, руб.] - [Риск-аппетит, руб.*]).
            // EconomicResult
            var a = 0;
            var b = 0;
            var c = 0;
            // [Фактические затраты на реализацию плана мероприятий, руб.] -  RiskCard.model.ActualCostsImplementingAct
            b = this.model.ActualCostsImplementingAct;
            var types = $filter('filter')(this.lists.ThreatOpportunities, { Id: this.model.ThreatOpportunityId }, true);
            if (types && types.length === 1) {
                var type_ = types[0].Title;
                if (type_ && type_.toLowerCase() === "угроза".toLowerCase()) {
                    var IRoOList = this.getNotDeleted(this.model.ImplementedRisksOrOpportunites);
                    // Поля колонки «Количеств. оценка влияния риска, руб. (Факт)*» - имеет тип поля – Вычисляемый (вычисление по другим столбцам). 
                    // Если в поле «Угроза/Возможность» указано значение «Угроза», 
                    //  то в данное поле проставляется значение равное полю «Количеств. оценка влияния риска, руб. (Факт)» со знаком «минус». 
                    //  Поле не отображено в представлении. 
                    //  считаем что если не угроза, то 0   ( IRoO in RiskCard.model.ImplementedRisksOrOpportunites IRoO.QARiskEffectFact )
                    var summ = 0;
                    for (var i = 0; i < IRoOList.length; i++) {
                        if (IRoOList[i].QARiskEffectFact){
                            summ += IRoOList[i].QARiskEffectFact;
                        }
                    }
                    a = -1 * summ;
                    // Риск-аппетит, руб.* - имеет тип поля – Вычисляемый (вычисление по другим столбцам). 
                    // Если в поле «Угроза/Возможность» указано значение «Угроза», то в данное поле проставляется значение равное полю «Риск-аппетит, руб.» со знаком «минус». 
                    // Поле не отображено в представлении. (RiskCard.model.RiskAppetite)                    
                    c = -1.0 * this.model.RiskAppetite;
                }
            }
            var result = a - b - c;
            this.model.EconomicResult = result;
            return "";
        };

        this.probabilityChanges = function () {
            //	Изменение вероятности наступления риска имеет тип поля – Вычисляемый (вычисление по другим столбцам). 
            //	Формула расчета: 
            //		если текущая дата >= 31 Декабря 
            //			и текущий год не равен значению в поле «Отчетный год» или в поле «Риск реализован» проставлена галочка 
            //			и последнее значение в поле «Вероятность наступления риска_Месяц» равно   
            //			и не равно значению в поле «Вероятность наступления риска_Месяц» за предыдущий месяц, 
            //				то в данном поле проставляется значение «Вероятность наступления риска возросла». 
            //		Если текущая дата >= 31 Декабря 
            //			и текущий год не равен значению в поле «Отчетный год» или в поле «Риск реализован» проставлена галочка 
            //			и последнее значение в поле «Вероятность наступления риска_Месяц» равно  , значение в поле «Вероятность наступления риска_Месяц» за предыдущий месяц равно  , 
            //				то проставляется значение «Вероятность наступления риска возросла». 
            //		Если текущая дата >= 31 Декабря 
            //			и текущий год не равен значению в поле «Отчетный год» или в поле «Риск реализован» проставлена галочка 
            //			и последнее значение в поле «Вероятность наступления риска_Месяц» равно  , значение в поле «Вероятность наступления риска_Месяц» за предыдущий месяц равно  , 
            //				то проставляется значение «Вероятность наступления риска снизилась». 
            //		Если текущая дата >= 31 Декабря 
            //			и текущий год не равен значению в поле «Отчетный год» или в поле «Риск реализован» проставлена галочка 
            //			и последнее значение в поле «Вероятность наступления риска_Месяц» равно  , значение в поле «Вероятность наступления риска_Месяц» за предыдущий месяц равно  , 
            //				то проставляется значение «Вероятность наступления риска снизилась». 
            //		Иначе 
            //			«Вероятность наступления риска не изменилась».
            // ProbabilityChanges
            // обновлённый алгоритм (https://tux.softage.ru/bz_sp/show_bug.cgi?id=366)
            // Примечание к формуле: все вероятности будем считать от 1 до 3, 
            // 1 - низкая, 2 - средняя, 3 - высокая. 
            var indicators = this.getNotDeleted(this.model.Indicators);
            var indArr = new Array(indicators.length);
            var lastMonth = 0;
            var result = "Вероятность наступления риска не изменилась"; 
            for (var i = 0; i < indicators.length; i++) {
                indArr[i] = new Array(13);
                indArr[i][1] = indicators[i].Month1Probability;
                indArr[i][2] = indicators[i].Month2Probability;
                indArr[i][3] = indicators[i].Month3Probability;
                indArr[i][4] = indicators[i].Month4Probability;
                indArr[i][5] = indicators[i].Month5Probability;
                indArr[i][6] = indicators[i].Month6Probability;
                indArr[i][7] = indicators[i].Month7Probability;
                indArr[i][8] = indicators[i].Month8Probability;
                indArr[i][9] = indicators[i].Month9Probability;
                indArr[i][10] = indicators[i].Month10Probability;
                indArr[i][11] = indicators[i].Month11Probability;
                indArr[i][12] = indicators[i].Month12Probability;
                indArr[i][0] = "";
                for (var j = 12; j > 0; j--) {
                    if (!isEmpty(indArr[i][j]) && j>lastMonth){
                        lastMonth = j;
                        break;
                    }
                }
            }
            lastMonth = lastMonth - 1;
            if (lastMonth > 0) {
                switch (this.model.Probability) {
                    case 3:
                        // «Вероятность наступления риска (общая)» = 3
                        // «Вероятность наступления риска_Месяц» за предыдущий месяц (сравнение по всем индикаторам) <> 3
                        // то «Вероятность наступления риска возросла». 
                        var cnt = 0;
                        for (var i = 0; i < indicators.length; i++) {
                            if (indArr[i][lastMonth] && indArr[i][lastMonth] != "Высокая") {
                                cnt++;
                            }
                        }
                        if (cnt == indicators.length) {
                            result = "Вероятность наступления риска возросла";
                        }
                        break;
                    case 2:
                        // «Вероятность наступления риска (общая)» = 2
                        //   «Вероятность наступления риска_Месяц» за предыдущий месяц содержит (1) по всем индикаторам
                        //     то «Вероятность наступления риска возросла»
                        //   «Вероятность наступления риска_Месяц» за предыдущий месяц содержит (3) хотя бы по 1 индикатору
                        //     то «Вероятность наступления риска снизилась»
                        var upCnt = 0;
                        var downCnt = 0;
                        for (var i = 0; i < indicators.length; i++) {
                            if (indArr[i][lastMonth] && indArr[i][lastMonth] == "Низкая") {
                                upCnt++;
                            }
                            if (indArr[i][lastMonth] && indArr[i][lastMonth] == "Высокая") {
                                downCnt++;
                            }
                        }
                        if (upCnt == indicators.length) {
                            result = "Вероятность наступления риска возросла";
                        } else if (downCnt > 0) {
                            result = "Вероятность наступления риска снизилась";
                        }
                        break;
                    case 1:
                        // «Вероятность наступления риска (общая)» = 1
                        // «Вероятность наступления риска_Месяц» за предыдущий месяц содержит  (2) или  (3)
                        // то проставляется значение «Вероятность наступления риска снизилась».
                        var cnt = 0;
                        for (var i = 0; i < indicators.length; i++) {
                            if (indArr[i][lastMonth] && (indArr[i][lastMonth] == "Высокая" || indArr[i][lastMonth] == "Средняя")) {
                                cnt++;
                            }
                        }
                        if (cnt > 0) {
                            result = "Вероятность наступления риска снизилась";
                        }
                        break;
                    default:
                        // Иначе «Вероятность наступления риска не изменилась».
                        break;
                }
            }
            this.model.RiskReduction = result;
            return "";
        };

        this.dateCondition = function () {
            // если текущая дата >= 31 Декабря и текущий год не равен значению в поле «Отчетный год»
            // Клиенты согласились поменять условие на 
            // "если текущая дата = 31 Декабря и текущий год равен значению в поле «Отчетный год» "
            //return true;
            
            var dt = new Date();
            if (this.model.ReportYear &&
                (dt.getFullYear() === this.model.ReportYear && dt.getMonth() === 11 && dt.getDate() === 31)) {
                return true;
            }
            return false;
            
            //return dt.getFullYear() > this.model.ReportYear || (dt.getFullYear() === this.model.ReportYear && dt.getMonth() === 11 && dt.getDate() === 31);
            //return this.model.dateCondition;
        };

        this.getIRoODeviationFromPlan = function (IRoO) {
            // Поле «Отклонение от плана, руб.» рассчитывается следующим образом: 
            //     если в поле «Месяц реализации риска» <> 0 и в поле «Угроза/возможность» значение равно «Угроза», 
            //      то формула расчета следующая – ([План*] – [Факт*]). 
            //     если в поле «Месяц реализации риска» <> 0 и в поле «Угроза/возможность» значение равно «Возможность», 
            //      то формула расчета следующая – ([Факт*] – [План*]).
            //
            // Поля колонки «Количеств. оценка влияния риска, руб. (Факт)*»
            //  Если в поле «Угроза/Возможность» указано значение «Угроза», 
            //   то в данное поле проставляется значение равное полю «Количеств. оценка влияния риска, руб. (Факт)» (IRoO.QARiskEffectFact) со знаком «минус». 
            //
            // Поля колонки «Количественная оценка влияния риска, руб. (План)» 
            // соответствует полю «Количеств. оценка влияния риска, руб.» вкладки «Паспорт риска». 
            // Поля колонки «Количественная оценка влияния риска, руб. (План)*» 
            // соответствует полю «Количеств. оценка влияния риска, руб.*» вкладки «Паспорт риска».
            //
            // Количеств. оценка влияния риска, руб.*
            //  Если в поле «Угроза/Возможность» указано значение «Угроза», 
            //   то в данное поле проставляется значение равное полю «Количеств. оценка влияния риска, руб.» ( QARiskEffect ) со знаком «минус»
            var result = null;
            var plan = this.model.QARiskEffect;
            var fact = IRoO.QARiskEffectFact;
            if (isNaN(plan) || isNaN(fact) || isEmpty(IRoO.Month)) {
                IRoO.DeviationFromPlan = result;
            } else {
                var types = $filter('filter')(this.lists.ThreatOpportunities, { Id: this.model.ThreatOpportunityId }, true);
                if (types.length ===1){
                    var type_ = types[0].Title;
                    if (type_ === "Угроза") {
                        var plan_ = -1 * plan;
                        var fact_ = -1 * fact;
                        result = plan_ - fact_;
                    }
                    if (type_ === "Возможность") {
                        var plan_ = plan;
                        var fact_ = fact;
                        result = fact_ - plan_;
                    }
                    result = result.toFixed(0);
                    IRoO.DeviationFromPlan = result;
                } else {
                    IRoO.DeviationFromPlan = result;
                }
            }
            return result;
        }

        this.getQARiskEffectFactInvalidMessage = function (IRoO) {
            // Проверка данных: если в поле «Месяц реализации риска» <> 0 и в данном поле пусто, то отображается служебное сообщение:
            // «Необходимо указать фактическое значение количественной оценки реализованного риска»
            if (!isEmpty(IRoO.Month) && isEmpty(IRoO.QARiskEffectFact)) {
                return "Необходимо указать фактическое значение количественной оценки реализованного риска";
            } else {
                return null;
            }
        };

        this.getRiskImplementationReasonInvalidMessage = function (IRoO) {
            // Проверка данных: если в поле «Месяц реализации риска» <>0 и в данном поле пусто, то отображается служебное сообщение:
            // «Необходимо указать причину реализации риска»
            if (!isEmpty(IRoO.Month) && isEmpty(IRoO.RiskImplementationReason)) {
                return "Необходимо указать причину реализации риска";
            }else{
                return null;
            }
        };

        this.getMeasuresToEliminateInvalidMessage = function (IRoO) {
            // Проверка данных: если в поле «Месяц реализации риска» <>0 и в данном поле пусто, то отображается служебное сообщение: 
            // «Необходимо указать мероприятия, выполненные по устранению последствий реализованного риска»
            if (!isEmpty(IRoO.Month) && isEmpty(IRoO.MeasuresToEliminate)) {
                return "Необходимо указать мероприятия, выполненные по устранению последствий реализованного риска";
            }else{
                return null;
            }
        };

        this.getLessonsLearnedInvalidMessage = function (IRoO) {
            // Проверка данных: если в поле «Месяц реализации риска» <>0 и в данном поле пусто, то отображается служебное сообщение: 
            // «Необходимо указать извлеченные уроки и рекомендации»
            if (!isEmpty(IRoO.Month) && isEmpty(IRoO.LessonsLearned)) {
                return "Необходимо указать извлеченные уроки и рекомендации";
            } else {
                return null;
            }
        };

        this.isPlanForPreventionComplete = function () {
            // В поле «План по профилактике»/ «Выполнен в полном объеме» располагается элемент управления - «Флажок».
            // Флажок проставляется автоматически в случае если текущая дата >= 31 Декабря и текущий год не равен значению в поле «Отчетный год» или в поле «Риск реализован» проставлена галочка,
            // и по всем этапам/подэтапам с характером мероприятий «профилактика» статус этапа/подэтапа равен «выполнен».
            if (this.dateCondition() || this.model.IsRiskRealized) {
                var steps = this.getNotDeleted(this.model.Steps);
                var ActionType = "Профилактика".toLowerCase();
                var expectedCount = 0;
                var actualCount = 0;
                var StepStatus = "Выполнен".toLowerCase();
                for (var i = 0; i < steps.length; i++) {
                    var stepActionType = (steps[i].ActionType ? steps[i].ActionType : "").toLowerCase();
                    var stepStatus = (steps[i].Status ? steps[i].Status : "").toLowerCase();
                    if (ActionType === stepActionType) {
                        if (stepStatus == StepStatus) {
                            expectedCount++;
                            actualCount++;
                        } else {
                            expectedCount++;
                        }
                    }
                    if (steps[i].Childs) {
                        var substeps = this.getNotDeleted(steps[i].Childs);
                        for (var j = 0; j < substeps.length; j++) {
                            var substepActionType = (substeps[j].ActionType ? substeps[j].ActionType : "").toLowerCase();
                            var substepStatus = (substeps[j].Status ? substeps[j].Status : "").toLowerCase();
                            if (ActionType === substepActionType) {
                                if (StepStatus == substepStatus.toLowerCase()) {
                                    expectedCount++;
                                    actualCount++;
                                } else {
                                    expectedCount++;
                                }
                            }
                        }
                    }
                }
                var res = (expectedCount === actualCount) && (actualCount > 0);
                this.model.IsPreventionPlanComplete = res;
                return res;
            }
            this.model.IsPreventionPlanComplete = false;
            return false;
        };

        this.isPlanForPreventionHasDeviations = function () {
            // В поле «План по профилактике»/ «Наличие отклонений от плана» располагается элемент управления - «Флажок». 
            // Флажок проставляется автоматически в случае если текущая дата >= 31 Декабря и текущий год не равен значению в поле «Отчетный год» или в поле «Риск реализован» проставлена галочка, 
            // и по всем этапам/подэтапам с характером мероприятий «профилактика» в полях «Отклонение от даты начала(План), дней», «Отклонение от даты окончания(План), дней» <>0. 
            if (this.dateCondition() || this.model.IsRiskRealized) {
                var steps = this.getNotDeleted(this.model.Steps);
                var ActionType = "Профилактика".toLowerCase();
                var result = false;
                for (var i = 0; i < steps.length; i++) {
                    var stepActionType = (steps[i].ActionType ? steps[i].ActionType : "").toLowerCase();
                    if (ActionType === stepActionType) {
                        if (notEqZero(steps[i].StartDivergenceDay) || notEqZero(steps[i].FinishDivergenceDay)) {
                            result = true;
                        }
                    }
                    if (steps[i].Childs) {
                        var substeps = this.getNotDeleted(steps[i].Childs);
                        for (var j = 0; j < substeps.length; j++) {
                            var substepActionType = (steps[i].ActionType ? steps[i].ActionType : "").toLowerCase();
                            if (ActionType === substepActionType) {
                                if (notEqZero(substeps[j].StartDivergenceDay) || notEqZero(substeps[j].FinishDivergenceDay)) {
                                    result = true;
                                }
                            }
                        }
                    }
                }
                this.model.HasPreventionPlanDeviation = result;
                return result;
            }
            this.model.HasPreventionPlanDeviation = false;
            return false;
        };

        this.isReponsePlanComplete = function () {
            // В поле «План по реагированию»/ «Выполнен в полном объеме» располагается элемент управления - «Флажок». 
            // Флажок проставляется автоматически в случае если текущая дата >= 31 Декабря и текущий год не равен значению в поле «Отчетный год» или в поле «Риск реализован» проставлена галочка, 
            // и по всем этапам/подэтапам с характером мероприятий «реагирование» статус этапа/подэтапа равен «выполнен». 
            if (this.dateCondition() || this.model.IsRiskRealized) {
                var steps = this.getNotDeleted(this.model.Steps);
                var ActionType = "Реагирование".toLowerCase();
                var expectedCount = 0;
                var actualCount = 0;
                var StepStatus = "Выполнен".toLowerCase();
                for (var i = 0; i < steps.length; i++) {
                    var stepActionType = (steps[i].ActionType ? steps[i].ActionType : "").toLowerCase();
                    var stepStatus = (steps[i].Status ? steps[i].Status : "").toLowerCase();
                    if (ActionType === stepActionType) {
                        if (stepStatus == StepStatus) {
                            expectedCount++;
                            actualCount++;
                        } else {
                            expectedCount++;
                        }
                    }
                    if (steps[i].Childs) {
                        var substeps = this.getNotDeleted(steps[i].Childs);
                        for (var j = 0; j < substeps.length; j++) {
                            var substepActionType = (substeps[j].ActionType ? substeps[j].ActionType : "").toLowerCase();
                            var substepStatus = (substeps[j].Status ? substeps[j].Status : "").toLowerCase();
                            if (ActionType === substepActionType) {
                                if (StepStatus == substepStatus.toLowerCase()) {
                                    expectedCount++;
                                    actualCount++;
                                } else {
                                    expectedCount++;
                                }
                            }
                        }
                    }
                }
                var res = (expectedCount === actualCount) && (actualCount > 0);
                this.model.IsReactPlanComplete = res;
                return res;
            }
            this.model.IsReactPlanComplete = false;
            return false;
        };

        this.isReponsePlanHasDeviations = function () {
            // В поле «План по реагированию»/ «Наличие отклонений от плана» располагается элемент управления - «Флажок». 
            // Флажок проставляется автоматически в случае если текущая дата >= 31 Декабря и текущий год не равен значению в поле «Отчетный год» или в поле «Риск реализован» проставлена галочка, 
            // и по всем этапам/подэтапам с характером мероприятий «реагирование» в полях «Отклонение от даты начала(План), дней», «Отклонение от даты окончания(План), дней» <>0.
            if (this.dateCondition() || this.model.IsRiskRealized) {
                var steps = this.getNotDeleted(this.model.Steps);
                var ActionType = "Реагирование".toLowerCase();
                var result = false;
                for (var i = 0; i < steps.length; i++) {
                    var stepActionType = (steps[i].ActionType ? steps[i].ActionType : "").toLowerCase();
                    if (ActionType === stepActionType) {
                        if (notEqZero(steps[i].StartDivergenceDay) || notEqZero(steps[i].FinishDivergenceDay)) {
                            result = true;
                        }
                    }
                    if (steps[i].Childs) {
                        var substeps = this.getNotDeleted(steps[i].Childs);
                        for (var j = 0; j < substeps.length; j++) {
                            var substepActionType = (steps[i].ActionType ? steps[i].ActionType : "").toLowerCase();
                            if (ActionType === substepActionType) {
                                if (notEqZero(substeps[j].StartDivergenceDay) || notEqZero(substeps[j].FinishDivergenceDay)) {
                                    result = true;
                                }
                            }
                        }
                    }
                }
                this.model.HasReactPlanDeviation = result;
                return result;
            }
            this.model.HasReactPlanDeviation = false;
            return false;
        };

        this.refreshProbability = function () {
            var result = null;
            var indicators = this.getNotDeleted(this.model.Indicators);
            for (var i = 0; i < indicators.length; i++) {
                var temp = this.getProbabilityCommonImageId(indicators[i]);
                if (temp !== null && temp > (result || 0)) {
                    result = temp;
                }
            }
            this.model.Probability = result;
        };

        this.riskManagementRecommendationsInvalidMessage = function () {
            // Проверка данных: 
            //		если текущая дата >= 31 Декабря и текущий год не равен значению в поле «Отчетный год» 
            //			или в поле «Риск реализован» проставлена галочка 
            //		и в данном поле пусто, 
            //				то отображается служебное сообщение:
            //					«Необходимо указать основные выводы  и рекомендации по управлению риском, степень и достаточность снижения риска по результатам управления в течение отчетного периода»
            if ((this.dateCondition() || this.model.IsRiskRealized) && isEmpty(this.model.RiskManagementRecommendations)) {
                return "Необходимо указать основные выводы  и рекомендации по управлению риском, степень и достаточность снижения риска по результатам управления в течение отчетного периода";
            } else {
                return null;
            }
        };
        this.riskManagementEffectivenessEvaluInvalidMessage = function () {
            // Проверка данных: 
            //		если текущая дата >= 31 Декабря и текущий год не равен значению в поле «Отчетный год» 
            //			или в поле «Риск реализован» проставлена галочка 
            //		и в данном поле пусто, 
            //				то отображается служебное сообщение:
            //					«Необходимо указать основные выводы  и рекомендации по управлению риском, степень и достаточность снижения риска по результатам управления в течение отчетного периода»
            if ((this.dateCondition() || this.model.IsRiskRealized) && isEmpty(this.model.RiskManagementRecommendations)) {
                return "Необходимо указать основные выводы  и рекомендации по управлению риском, степень и достаточность снижения риска по результатам управления в течение отчетного периода";
            } else {
                return null;
            }
        };
        this.riskManagementEffectiveness_E_valuInvalidMessage = function () {
            //	Проверка данных: 
            //		если текущая дата >= 31 Декабря и текущий год не равен значению в поле «Отчетный год» 
            //              или в поле «Риск реализован» проставлена галочка 
            //          и в данном поле пусто, 
            //				то отображается служебное сообщение:
            //					«Необходимо указать вывод об эффективности управления риском на основе следующих параметров: экономический эффект управления риском, изменение вероятности наступления риска, реализован/не реализован риск»
            if ((this.dateCondition() || this.model.IsRiskRealized) && isEmpty(this.model.RiskManagementEffectiveness_E_valu)) {
                var msg =
                    ("Необходимо указать вывод об эффективности управления риском на основе следующих параметров: " +
                    "экономический эффект управления риском, изменение вероятности наступления риска, реализован/не реализован риск");
                return msg;
            }
            else {
                return null;
            }
        };

        this.isSaveDisabled = function () {
            if (this.RiskCardForm.$invalid) return true;
            // todo disable if form invalid
            //if (isEmpty(this.model.ReportYear)) return true;
            //if (isEmpty(this.model.Name)) return true;
            //if (isEmpty(this.model.Description)) return true;
            //if (isEmpty(this.model.StrategicGoalId) || isNaN(this.model.StrategicGoalId) || this.model.StrategicGoalId < 1) return true;
            //if (isEmpty(this.model.SocietyId) || isNaN(this.model.SocietyId) || this.model.SocietyId < 1) return true;
            //if (isEmpty(this.model.ManagementId) || isNaN(this.model.ManagementId) || this.model.ManagementId < 1) return true;
            //if (isEmpty(this.model.RiskKindId) || isNaN(this.model.RiskKindId) || this.model.RiskKindId < 1) return true;
            //if (isEmpty(this.model.RiskGroupId) || isNaN(this.model.RiskGroupId) || this.model.RiskGroupId < 1) return true;
            //if (isEmpty(this.model.AreaBusinessProcessId) || isNaN(this.model.AreaBusinessProcessId) || this.model.AreaBusinessProcessId < 1) return true;
            //if (isEmpty(this.model.ThreatOpportunityId) || isNaN(this.model.ThreatOpportunityId) || this.model.ThreatOpportunityId < 1) return true;
            //if (isEmpty(this.model.RiskResponseStrategyId) || isNaN(this.model.RiskResponseStrategyId) || this.model.RiskResponseStrategyId < 1) return true;
            //if (isEmpty(this.model.UnacceptableRisk)) return true;
            if ((this.getNotDeleted(this.model.RiskFactors) || []).length < 1) return true;
            if ((this.getNotDeleted(this.model.ConsequencesOfRisk) || []).length < 1) return true;
            if ((this.getNotDeleted(this.model.Indicators) || []).length < 1) return true;
            var steps = this.model.Steps||[];
            for (var i = 0; i < steps.length; i++) {
                if ((steps[i].Responsibles||[]).length == 0) {
                    return true;
                }
                var substeps = steps[i].Childs||[];
                for (var j = 0; j < substeps.length; j++) {
                    if ((substeps[j].Responsibles||[]).length == 0) {
                        return true;
                    }
                }
            }
            //if (isEmpty(this.model.QARiskEffect)) return true;
            //if (isEmpty(this.model.RationaleForRiskAssessment)) return true;
            //if (isEmpty(this.model.RiskAppetite)) return true;
            //if (isEmpty(this.model.OptimizationRegulations)) return true;
            //if (isEmpty(this.model.ManagerFIO)) return true;
            //if (isEmpty(this.model.ManagerPost)) return true;
            //if (isEmpty(this.model.ManagerUserInfoId)) return true;
            //if (isEmpty(this.model.AdministratorFIO)) return true;
            //if (isEmpty(this.model.AdministratorPost)) return true;
            //if (isEmpty(this.model.AdministratorUserInfoId)) return true;
            return false;
        }

        function isEmpty(value) {
            return (value === null || value === undefined || value === "");
        }

        function notEqZero(value) {
            // Рустам Ибрагимов
            // не 0, не null, не ""  короче как и в предыдущем проекте
            return value !== 0 && value !== "0" && value !== null && value !== undefined && value !== "";
        }

        this.init(this);
    }

    function RiskPassportController() {

    }

    function RiskPlanGraphController($scope, $filter, RiskCardService) {

        function getNotDeletedItems(list) {
            return $filter('filter')(list, { IsDeleted: !true });
        }

        function isEmpty(value) {
            return (value === null || value === undefined || value === "");
        }

        this.getIndex = function (list, item, parentItem) {
            var index = $filter('filter')(list, { IsDeleted: false }).indexOf(item) + 1;
            if (parentItem && parentItem.Index) {
                var idx = parentItem.Index;
                index = idx + "." + index;
            }
            item.Index = index;
            return index;
        };

        this.addStep = function (list) {
            if (!list) {
                list = [];
            }
            list.push({ Id: null, Title: null, IsDeleted: false, Childs: [], Responsibles: [] });
        };

        this.addSubStep = function (list, parent) {
            if (!list) {
                list = [];
            }
            list.push({ Id: null, Title: null, IsDeleted: false, Responsibles: [] });
            this.refreshStepFields(parent);
        };

        this.removeStep = function (step) {
            if (step && step.Childs) {
                var substeps = getNotDeletedItems(step.Childs);
                for (var i = 0; i < substeps.length; i++) {
                    substeps[i].IsDeleted = true;
                }
            }
            step.IsDeleted = true;
            this.refreshRiskCardFields();
        };

        this.removeSubStep = function (substep, step) {
            substep.IsDeleted = true;
            this.refreshStepFields(step, true);
        };

        this.refreshStepStartPlan = function (step, isSubStepRemoved) {
            // Дата начала_План
            // Если в ключевом этапе есть подэтапы, то дата начала этапа_план автоматически рассчитывается от дат начала_план всех подэтапов (выбирается минимальное значение)
            if (step) {
                var date = step.StartPlan;
                if (step.Childs) {
                    var items = getNotDeletedItems(step.Childs);
                    if (items.length > 0) {
                        date = null;
                        for (var i = 0; i < items.length; i++) {
                            if (items[i].StartPlan && (date == null || items[i].StartPlan < date)) {
                                date = items[i].StartPlan;
                            }
                        }
                        //step.StartPlan = date;
                    } else {
                        if (isSubStepRemoved) {
                            date = null;
                        }
                    }
                }
                step.StartPlan = date;
            }
        };

        this.refreshStepFinishPlan = function (step, isSubStepRemoved) {
            // Дата окончания_План
            // Если в ключевом этапе есть подэтапы, то дата окончания этапа_план автоматически рассчитывается от дат окончания_план всех подэтапов (выбирается максимальное значение)
            if (step) {
                var date = step.FinishPlan;
                if (step.Childs) {
                    var items = getNotDeletedItems(step.Childs);
                    if (items.length > 0) {
                        date = null;
                        for (var i = 0; i < items.length; i++) {
                            if (items[i].FinishPlan && (date == null || items[i].FinishPlan > date)) {
                                date = items[i].FinishPlan;
                            }
                        }
                        //step.FinishPlan = date;
                    } else {
                        if (isSubStepRemoved) {
                            date = null;
                        }
                    }
                }
                step.FinishPlan = date;
            }
        };

        this.refreshStepStartFact = function (step, isSubStepRemoved) {
            // Дата окончания_План
            // Если в ключевом этапе есть подэтапы, то дата окончания этапа_план автоматически рассчитывается от дат окончания_план всех подэтапов (выбирается максимальное значение)
            if (step) {
                var date = step.StartFact;
                if (step.Childs) {
                    var items = getNotDeletedItems(step.Childs);
                    if (items.length > 0) {
                        date = null;
                        for (var i = 0; i < items.length; i++) {
                            if (items[i].StartFact && (date == null || items[i].StartFact < date)) {
                                date = items[i].StartFact;
                            }
                        }
                        //step.StartFact = date;
                    } else {
                        if (isSubStepRemoved) {
                            date = null;
                        }
                    }
                }
                step.StartFact = date;
            }
        };

        this.refreshStepFinishFact = function (step, isSubStepRemoved) {
            // Дата окончания_План
            // Если в ключевом этапе есть подэтапы, то дата окончания этапа_план автоматически рассчитывается от дат окончания_план всех подэтапов (выбирается максимальное значение)
            if (step) {
                var date = step.FinishFact;
                if (step.Childs) {
                    var items = getNotDeletedItems(step.Childs);
                    if (items.length > 0) {
                        date = null;
                        for (var i = 0; i < items.length; i++) {
                            if (items[i].FinishFact && (date == null || items[i].FinishFact > date)) {
                                date = items[i].FinishFact;
                            }
                        }
                        //step.FinishFact = date;
                    } else {
                        if (isSubStepRemoved) {
                            date = null;
                        }
                    }
                }
                step.FinishFact = date;
            }
        };

        this.refreshStepStatus = function (step) {
            //Статус этапа/подэтапа. Тип поля – Выбор. Варианты выбора - 
            //   не начат, в процессе выполнения, выполнен, не выполнен, не актуален, отложен. 
            // Поле обязательное для заполнения. Способ предоставления вариантов - раскрывающееся меню.
            //var status = null;
            var Count = 0;
            var IsNotStarted = 0;
            var IsInProcess = 0;
            var IsCompleted = 0;
            var IsNotCompleted = 0;
            var IsNotActual = 0;
            var IsPostponed = 0;
            if (step && step.Childs) {
                var items = getNotDeletedItems(step.Childs);
                Count = items.length;
                if (Count > 0) {
                    for (var i = 0; i < items.length; i++) {
                        var status = items[i].Status;
                        if (status === "Не начат") {
                            IsNotStarted++;
                        }
                        if (status === "В процессе выполнения") {
                            IsInProcess++;
                        }
                        if (status === "Выполнен") {
                            IsCompleted++;
                        }
                        if (status === "Не выполнен") {
                            IsNotCompleted++;
                        }
                        if (status === "Не актуален") {
                            IsNotActual++;
                        }
                        if (status === "Отложен") {
                            IsPostponed++;
                        }
                    }
                    if (Count === 1) {
                        // https://tux.softage.ru/bz_sp/show_bug.cgi?id=354
                        // Предлагаю при наличии только одного подэтапа у этапа - копировать его статус
                        step.Status = items[0].Status;
                    }
                        // В случае если в этапе есть подэтапы, то статус этапа автоматически заполняется следующим образом:
                    else if (IsPostponed > 0) {
                        //  Статус «отложен»:
                        //      - если хотя бы по 1 подэтапу проставлено значение «отложен», то статус этапа «отложен»;
                        step.Status = "Отложен";
                    } else if (IsInProcess > 0 || (IsNotStarted > 0 && (IsCompleted > 0 || IsNotCompleted > 0 || IsNotActual > 0))) {
                        //  Статус «в процессе выполнения»:
                        //      - если хотя бы по 1 подэтапу проставлено значение «в процессе выполнения», то статус этапа «в процессе выполнения»;
                        //      - если статус подэтапа содержит и «не начат» и или «выполнен», «не выполнен», «не актуален», то статус этапа – «в процессе выполнения»;
                        step.Status = "В процессе выполнения";
                    } else if (IsCompleted === Count || (IsCompleted > 0 && (IsNotCompleted > 0 || IsNotActual > 0))) {
                        //  Статус «выполнен»:
                        //      - если по всем подэтапам проставлено значение «выполнен», то статус этапа «выполнен»;
                        //      - если статус подэтапа содержит и «выполнен» и или «не выполнен», «не актуален», то статус этапа «выполнен»;
                        step.Status = "Выполнен";
                    } else if (IsNotCompleted === Count) {
                        //  Статус «не выполнен»:
                        //      - если по всем подэтапам проставлено значение «не выполнен», то статус этапа «не выполнен»;
                        step.Status = "Не выполнен";
                    } else if (IsNotActual === Count) {
                        //  Статус «не актуален»:
                        //      - если по всем подэтапам проставлено значение «не актуален», то статус этапа «не актуален»;
                        step.Status = "Не актуален";
                    } else {
                        step.Status = null;
                    }
                }
            }
            //  Проверка внесенных данных:
            //      - если в поле «Дата начала_Факт» и «Дата окончания_Факт» не пусто и статус этапа/подэтапа равен «не начат», «в процессе выполнения», 
            //          то отображается служебное сообщение «Необходимо скорректировать статус этапа/подэтапа на «выполнен»;
            //      - если в поле «Дата начала_Факт» не пусто и в поле «Дата окончания_Факт» пусто и статус этапа/подэтапа равен «не начат», 
            //          то отображается служебное сообщение «Необходимо скорректировать статус этапа/подэтапа на «в процессе выполнения».
        };

        this.setDurationPlan = function (item) {
            // DurationPlan
            // Длительность_План. Тип поля - Вычисляемый (вычисление по другим столбцам).
            // Формула расчета: Дней360(Дата начала_План; Дата окончания_План)+1
            if (item) {
                item.DurationPlan = Days360(item.StartPlan, item.FinishPlan) + 1;
            }
        };

        this.setDurationFact = function (item) {
            // DurationFact
            // Длительность_Факт. Тип поля - Вычисляемый (вычисление по другим столбцам).
            // Формула расчета -
            //  если статус этапа/подэтапа равен «выполнен», 
            //   то Длительность_Факт = Дней360(Дата начала_Факт; Дата окончания_Факт)+1, 
            //   иначе 0.
            if (item) {
                if (item.Status === "Выполнен") {
                    item.DurationFact = Days360(item.StartFact, item.FinishFact) + 1;
                } else {
                    item.DurationFact = 0;
                }
            }
        };

        this.setCurrentStartDivergenceDay = function (item) {
            // Текущее отклонение от даты начала, дней	Тип поля - Вычисляемый (вычисление по другим столбцам).
            // Отклонения от плана-графика этапа/подэтапа рассчитывается следующим образом: 
            //      - если статус этапа/подэтапа равен «не начат» и текущая дата > Дата начала_План, 
            //          то текущее отклонение = (Дней360(Дата начала_План;Текущая дата)+1)
            if (item) {
                var dt = new Date();
                if (item.Status === "Не начат" && dt > item.StartPlan) {
                    item.CurrentStartDivergenceDay = Days360(item.StartPlan, dt) + 1;
                } else {
                    item.CurrentStartDivergenceDay = null;
                }
            }
        };

        this.setCurrentFinishDivergenceDay = function (item) {
            // Текущее отклонение от даты окончания, дней	Тип поля - Вычисляемый (вычисление по другим столбцам).
            // Отклонения от плана-графика этапа/подэтапа рассчитывается следующим образом: 
            //      - если статус этапа/подэтапа равен «в процессе выполнения» и текущая дата > Дата окончания_План, 
            //          то текущее отклонение = (Дней360(Дата окончания_План; Текущая дата)+1)
            if (item) {
                var dt = new Date();
                if (item.Status === "В процессе выполнения" && dt > item.FinishPlan) {
                    item.CurrentFinishDivergenceDay = Days360(item.FinishPlan, dt) + 1;
                } else {
                    item.CurrentFinishDivergenceDay = null;
                }
            }
        };

        this.setStartDivergenceDay = function (item) {
            // Отклонение от даты начала, дней	Тип поля - Вычисляемый (вычисление по другим столбцам).
            // Статус «выполнен»:
            //     - если статус этапа/подэтапа равен «выполнен» и Дата начала_Факт > Дата начала_План, 
            //          то отклонение = (Дней360(Дата начала_План; Дата начала_Факт)+1);
            // Статус «не выполнен»/«не актуален»/«отложен» 
            //      - если Дата начала_Факт > Дата начала_План, 
            //          то отклонение = (Дней360(Дата начала_План;Дата начала_Факт)+1), 
            //          иначе 0.
            if (item) {
                var status = item.Status;
                if (status === "Выполнен" && item.StartFact > item.StartPlan) {
                    item.StartDivergenceDay = Days360(item.StartPlan, item.StartFact) + 1;
                } else if ((status === "Не выполнен" || status === "Не актуален" || status === "Отложен")) {
                    if (item.StartFact > item.StartPlan) {
                        item.StartDivergenceDay = Days360(item.StartPlan, item.StartFact) + 1;
                    } else {
                        item.StartDivergenceDay = 0;
                    }
                } else {
                    item.StartDivergenceDay = null;
                }
            }
        };

        this.setFinishDivergenceDay = function (item) {
            // Отклонение от даты окончания, дней	Тип поля - Вычисляемый (вычисление по другим столбцам)
            //  - если статус этапа/подэтапа равен «выполнен» и Дата окончания_Факт > Дата окончания_План, 
            //      то отклонение = (Дней360(Дата окончания_План; Дата окончания_Факт)+1), 
            //      иначе 0.
            if (item) {
                //var status = this.getStepStatusTitle(statuses, item);
                if (item.Status === "Выполнен" && item.FinishFact > item.FinishPlan) {
                    item.FinishDivergenceDay = Days360(item.FinishPlan, item.FinishFact) + 1;
                } else {
                    item.FinishDivergenceDay = 0;
                }
            }
        };

        this.refreshSubStepFields = function (substep, step) {
            this.setDurationPlan(substep);
            this.setDurationFact(substep);
            this.setCurrentStartDivergenceDay(substep);
            this.setCurrentFinishDivergenceDay(substep);
            this.setStartDivergenceDay(substep);
            this.setFinishDivergenceDay(substep);
            this.checkFields(substep);
            this.refreshStepFields(step);
        };

        this.checkFields = function (item) {
            if (item) {
                var status = item.Status;
                // Дата начала_Факт
                // Проверка данных: 
                //      если статус этапа/подэтапа равен «в процессе выполнения», 
                //          то отображается служебное сообщение «Необходимо указать фактическую дату начала этапа/подэтапа».
                item.startFactInvalidMessage = "";
                if (status === "В процессе выполнения" && isEmpty(item.StartFact)) {
                    if (!(item && item.Childs && getNotDeletedItems(item.Childs).length > 0)) {
                        item.startFactInvalidMessage = "Необходимо указать фактическую дату начала этапа/подэтапа";
                    }
                }
                // Дата окончания_Факт
                // Проверка данных: 
                //      если статус этапа/подэтапа равен «выполнен», 
                //          то отображается служебное сообщение «Необходимо указать фактическую дату окончания этапа/подэтапа»
                item.finishFactInvalidMessage = "";
                if (status === "Выполнен" && isEmpty(item.FinishFact)) {
                    if (!(item && item.Childs && getNotDeletedItems(item.Childs).length > 0)) {
                        item.finishFactInvalidMessage = "Необходимо указать фактическую дату окончания этапа/подэтапа";
                    }
                }
                // Статус этапа/подэтапа
                // Проверка внесенных данных:
                //      - если в поле «Дата начала_Факт» и «Дата окончания_Факт» не пусто и статус этапа/подэтапа равен «не начат», «в процессе выполнения», 
                //          то отображается служебное сообщение «Необходимо скорректировать статус этапа/подэтапа на «выполнен»;
                //      - если в поле «Дата начала_Факт» не пусто и в поле «Дата окончания_Факт» пусто и статус этапа/подэтапа равен «не начат», 
                //          то отображается служебное сообщение «Необходимо скорректировать статус этапа/подэтапа на «в процессе выполнения».
                item.statusInvalidMessage = "";
                if (!isEmpty(item.StartFact) && !isEmpty(item.FinishFact)) {
                    if (status === "Не начат" || status === "В процессе выполнения") {
                        item.statusInvalidMessage = "Необходимо скорректировать статус этапа/подэтапа на «выполнен»";
                    }
                }
                if (!isEmpty(item.StartFact) && isEmpty(item.FinishFact)) {
                    if (status === "Не начат") {
                        item.statusInvalidMessage = "Необходимо скорректировать статус этапа/подэтапа на «В процессе выполнения»";
                    }
                }
                // Причина отклонения/невыполнения
                // Проверка внесенных данных: 
                //      - если статус этапа/подэтапа равен «не начат», «в процессе выполнения», «выполнен» и 
                //      или отклонения от плана графика (от даты начала, окончания) > 0  или текущее отклонение (от даты начала, окончания) > 0, 
                //      и в данном поле пусто, 
                //          то отображается служебное сообщение «Необходимо указать причину отклонения от плана-графика».
                //      - если статус этапа/подэтапа равен «не выполнен», «не актуален», «отложен», 
                //      и в данном поле пусто, 
                //          то отображается служебное сообщение «Необходимо указать причину не выполнения/неактуальности/переноса реализации этапа/подэтапа».
                item.reasonLateInvalidMessage = "";
                if (isEmpty(item.ReasonLate)) {
                    if (status === "Не начат" || status === "В процессе выполнения" || status === "Выполнен") {
                        if (item.StartDivergenceDay > 0 || item.FinishDivergenceDay > 0 || item.CurrentStartDivergenceDay > 0 || item.CurrentFinishDivergenceDay > 0) {
                            item.reasonLateInvalidMessage = "Необходимо указать причину отклонения от плана-графика";
                        }
                    }
                    if (status === "Не выполнен" || status === "Не актуален" || status === "Отложен") {
                        item.reasonLateInvalidMessage = "Необходимо указать причину не выполнения/неактуальности/переноса реализации этапа/подэтапа";
                    }
                }
            }
        };

        this.refreshStepFields = function (step, isSubStepRemoved) {
            this.refreshStepStatus(step);
            this.refreshStepStartPlan(step, isSubStepRemoved);
            this.refreshStepFinishPlan(step, isSubStepRemoved);
            this.refreshStepStartFact(step, isSubStepRemoved);
            this.refreshStepFinishFact(step, isSubStepRemoved);
            this.setDurationPlan(step);
            this.setDurationFact(step);
            this.setCurrentStartDivergenceDay(step);
            this.setCurrentFinishDivergenceDay(step);
            this.setStartDivergenceDay(step);
            this.setFinishDivergenceDay(step);
            this.checkFields(step);
            this.refreshRiskCardFields();
        };

        this.refreshRiskCardFields = function () {

        };

        //this.getStepStatusTitle = function (statuses, step) {
        //    if (step) {
        //        var values = $filter('filter')(statuses, { Id: step.StatusId });
        //        if (values && values.length === 1) {
        //            return values[0].Title;
        //        }
        //    }
        //    return null;
        //};
        //this.isReadOnly = function (fieldName) {
        //    // is displayForm
        //    //if (modelFormType == 0) return true;
        //    //if ((ProjectStatus == PS.Closed() || ProjectStatus == PS.Paused() || ProjectVersion > 0) && $scope.item.Version == 0) return true;
        //    return false;
        //};

        //this.dateOptions = {
        //    startingDay: 1
        //};

        this.open = function ($event, item, openedField) {
            //$event.preventDefault();
            //$event.stopPropagation();
            //item.opened = true;
            item[openedField] = true;
        };

        //this.refreshParentFields = function () {
        //    //refreshFields($scope.item, $scope);
        //};

        this.getDate = function (item) {
            return $filter('date')(item, "dd.MM.yyyy");
        };

    }

    function ProjectReportEditController() {

    }

    function NumberOnlyInput() {
        return {
            restrict: 'A',
            scope:{
                val:"=ngModel"
            },
            link: function (scope, element, attrs) {
                scope.$watch('val', function (newValue, oldValue) {
                    if (newValue === undefined) { return; }
                    var arr = String(newValue).split("");
                    if (arr.length === 0) { return; }
                    if (arr.length === 1 && (arr[0] === '-' || arr[0] === '.')) { return; }
                    if (arr.length === 2 && newValue === '-.') { return; }
                    if (isNaN(newValue)) {
                        scope.val = oldValue;
                    }
                    if (attrs && attrs.decimalNumbers) {
                        var decimalNumbers = attrs.decimalNumbers;
                        var delimiter = (1.1).toString()[1];
                        if (newValue !== null && typeof (newValue.split) === "function") {
                            var parts = newValue.split(delimiter);
                            if (parts[1] && parts[1].length > decimalNumbers) {
                                scope.val = oldValue;
                            }
                        }
                    }
                });
            }
        };
    }

    function Days360(sd, fd, m) {
        var d1 = new Date(sd);
        var d2 = new Date(fd);
        //var d1_1 = d1;
        //var d2_1 = d2;
        var method = m || false;
        var d1Year = d1.getFullYear();
        var d2Year = d2.getFullYear();
        var dy = 0;
        var d1Month = d1.getMonth();
        var d2Month = d2.getMonth();
        var dm = 0;
        var d1Day = d1.getDate();
        var d2Day = d2.getDate();
        var dd = 0;
        //var sign = 1.0;
        if (method) {
            // euro
            if (d1Day === 31) { d1Day = 30; }
            if (d2Day === 31) { d2Day = 30; }
        } else {
            // american NASD
            if (d1Day === 31) { d1Day = 30; }
            if (d2Day === 31) {
                if (d1Day < 30) {
                    if (d2Month === 11) {
                        d2Year = d2Year + 1;
                        d2Month = 0;
                        d2Day = 1;
                    } else {
                        d2Month = d2Month + 1;
                        d2Day = 1;
                    }
                } else {
                    d2Day = 30;
                }
            }
        }
        dy = d2Year - d1Year;
        dm = d2Month - d1Month;
        dd = d2Day - d1Day;
        //d1Day = d1_1 - d1_1.getTimezoneOffset() * 1000;
        //d2Day = d2_1 - d2_1.getTimezoneOffset() * 1000;
        return parseFloat(dy * 360 + dm * 30 + dd);
    }

})();