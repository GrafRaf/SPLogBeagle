(function () {
    'use strict';

    angular
        .module("SPLogBeagle", ['ui.bootstrap'])
        .controller("LogViewController", LogViewController);


    function LogViewController($http, $scope) {
        $scope.isLoading = true;
        $scope.format = "dd/MM/yyyy";
        $scope.hstep = 1;
        $scope.mstep = 1;
        $scope.ismeridian = false;
        $scope.logFolders = [];
        var dt = new Date();
        $scope.startDate = dt;
        $scope.finishDate = dt;
        $scope.startTime = dt;
        $scope.finishTime = dt;
        $scope.pattern = "Exception";

        $scope.openStartDate = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.openedStartDate = true;
        };

        $scope.isSMILEnabled = function () {
            return Modernizr.smil;
        };

        $scope.openFinishDate = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.openedFinishDate = true;
        };

        $scope.getDateTime = function (date, time) {
            var result = new Date(date.getFullYear(), date.getMonth(), date.getDate(), time.getHours(), time.getMinutes());
            return result;
        };

        $scope.getLogFolders = function () {
            var result = [];
            $scope.logFolders.forEach(function (e) { if (e.isChecked) { result.push(e.name) } });
            return result;
        };

        $scope.submit = function () {
            $scope.isLoading = true;
            $scope.error = "";
            $http({
                method: 'GET',
                url: "/home/find",
                params: {
                    "startDate": $scope.getDateTime($scope.startDate, $scope.startTime),
                    "finishDate": $scope.getDateTime($scope.finishDate, $scope.finishTime),
                    "pattern": $scope.pattern,
                    "isRemoteLogProcessing": $scope.isRemoteLogProcessing ? true : false,
                    "logFolders": $scope.getLogFolders()
                },
                headers: { 'Content-Type': 'application/json' }
            }).
                success(function (data, status, headers, config) {
                    $scope.model = data;
                    $scope.isLoading = false;
                }).
                error(function (data, status, headers, config) {
                    var msg = 'Request failed. ' + data + '\n' + status + '\n' + headers + '\n' + config;
                    console.log(data);
                    $scope.error = msg;
                    $scope.isLoading = false;
                });
        }
        $scope.isLoading = false;
    }

})();