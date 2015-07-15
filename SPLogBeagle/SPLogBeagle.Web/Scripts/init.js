(function () {
    'use strict';

    angular
        .module("SPLogBeagle", ['ui.bootstrap', 'ui.bootstrap.datetimepicker', 'angularFileUpload'])
        .controller("LogViewController", LogViewController);


    function LogViewController($http, $scope, FileUploader) {
        $scope.isLoading = true;
        $scope.logFolders = [];
        var dt = new Date();
        $scope.startDate = dt;
        $scope.finishDate = dt;
        $scope.searchType = 'folders';
        $scope.pattern = "Exception";
        $scope.vTimestamp = true;
        $scope.vMessage = true;
        $scope.vCorrelationUid = true;

        $scope.open = {
            startDate: false,
            finishDate: false
        };

        $scope.dateOptions = {
            showWeeks: false,
            startingDay: 1
        };

        $scope.timeOptions = {
            showMeridian: false
        };

        $scope.openCalendar = function (e, date) {
            e.preventDefault();
            e.stopPropagation();

            $scope.open[date] = true;
        };

        $scope.isSMILEnabled = function () {
            return Modernizr.smil;
        };

         $scope.getLogFolders = function () {
            var result = [];
            $scope.logFolders.forEach(function (e) { if (e.isChecked) { result.push(e.name) } });
            return result;
        };

        $scope.loadLogFolders = function () {
            $scope.isLoading = true;
            $scope.error = "";
            $http({
                method: 'GET',
                url: "/scripts/locations.json",
                headers: { 'Content-Type': 'application/json' }
            })
            .success(function (data, status, headers, config) {
                $scope.logFolders = data;
                $scope.isLoading = false;
            })
            .error(function (data, status, headers, config) {
                var msg = 'Request failed. ' + data + '\n' + status + '\n' + headers + '\n' + config;
                console.log(data);
                $scope.error = msg;
                $scope.isLoading = false;
            });
        }

        $scope.searchAcrosFolders = function () {
            $scope.isLoading = true;
            $scope.error = "";
            $http({
                method: 'GET',
                url: "/home/find",
                params: {
                    "startDate": $scope.startDate, //$scope.getDateTime($scope.startDate, $scope.startTime),
                    "finishDate": $scope.finishDate, //$scope.getDateTime($scope.finishDate, $scope.finishTime),
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

        $scope.uploader = new FileUploader(
            {
                url: "/home/searchinfile",
                removeAfterUpload :true,
                filters: [{
                    name: 'Is .log file',
                    fn: function (item) {
                        if (item && item.name && item.name.endsWith(".log")) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                }],
                onSuccessItem: function (item, response, status, headers) {
                    $scope.model.LogFiles.push(response.LogFiles[0]);
                    $scope.model.ElapsedMilliseconds += response.ElapsedMilliseconds;
                    $scope.isLoading = false;
                }
            });

        $scope.uploader.onBeforeUploadItem = function (item) {
            $scope.isLoading = true;
            var formData = [
                { pattern: $scope.pattern },
                { fileName: item.file.name }
            ];
            Array.prototype.push.apply(item.formData, formData);
        };

        $scope.searchAcrosFiles = function () {
            $scope.model = { LogFiles: [], ElapsedMilliseconds: 0 };
            $scope.uploader.uploadAll();
        };

        $scope.loadLogFolders();

        $scope.search = function () {
            $scope.model = null;
            if ($scope.searchType === 'folders') {
                $scope.searchAcrosFolders();
            }
            if ($scope.searchType === 'files') {
                $scope.searchAcrosFiles();
            }
        };

        $scope.isLoading = false;
    }

})();