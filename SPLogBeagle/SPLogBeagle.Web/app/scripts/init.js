(function () {
    'use strict';

    angular
        .module("SPLogBeagle", ['ui.bootstrap', 'ui.bootstrap.datetimepicker', 'angularFileUpload'])
        .controller("LogViewController", LogViewController);


    function LogViewController($http, $scope, FileUploader) {
        
        var dt = new Date();
        var vm = this;
        vm.isLoading = true;
        vm.logFolders = [];
        vm.startDate = dt;
        vm.finishDate = dt;
        vm.searchType = 'folders';
        vm.pattern = "Exception";
        vm.vTimestamp = true;
        vm.vMessage = true;
        vm.vCorrelationUid = true;

        vm.open = {
            startDate: false,
            finishDate: false
        };

        vm.dateOptions = {
            showWeeks: false,
            startingDay: 1
        };

        vm.timeOptions = {
            showMeridian: false
        };

        vm.openCalendar = function (e, date) {
            e.preventDefault();
            e.stopPropagation();

            vm.open[date] = true;
        };

        vm.isSMILEnabled = function () {
            return Modernizr.smil;
        };

         vm.getLogFolders = function () {
            var result = [];
            vm.logFolders.forEach(function (e) { if (e.isChecked) { result.push(e.name) } });
            return result;
        };

        vm.loadLogFolders = function () {
            vm.isLoading = true;
            vm.error = "";
            $http({
                method: 'GET',
                url: "/scripts/locations.json",
                headers: { 'Content-Type': 'application/json' }
            })
            .success(function (data, status, headers, config) {
                vm.logFolders = data;
                vm.isLoading = false;
            })
            .error(function (data, status, headers, config) {
                var msg = 'Request failed. ' + data + '\n' + status + '\n' + headers + '\n' + config;
                console.log(data);
                vm.error = msg;
                vm.isLoading = false;
            });
        }

        vm.searchAcrosFolders = function () {
            vm.isLoading = true;
            vm.error = "";
            $http({
                method: 'GET',
                url: "/home/find",
                params: {
                    "startDate": vm.startDate, //$scope.getDateTime($scope.startDate, $scope.startTime),
                    "finishDate": vm.finishDate, //$scope.getDateTime($scope.finishDate, $scope.finishTime),
                    "pattern": vm.pattern,
                    "isRemoteLogProcessing": vm.isRemoteLogProcessing ? true : false,
                    "logFolders": vm.getLogFolders()
                },
                headers: { 'Content-Type': 'application/json' }
            }).
                success(function (data, status, headers, config) {
                    vm.model = data;
                    vm.isLoading = false;
                }).
                error(function (data, status, headers, config) {
                    var msg = 'Request failed. ' + data + '\n' + status + '\n' + headers + '\n' + config;
                    console.log(data);
                    vm.error = msg;
                    vm.isLoading = false;
                });
        }

        vm.uploader = new FileUploader(
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
                    vm.model.LogFiles.push(response.LogFiles[0]);
                    vm.model.ElapsedMilliseconds += response.ElapsedMilliseconds;
                    vm.isLoading = false;
                }
            });

        vm.uploader.onBeforeUploadItem = function (item) {
            vm.isLoading = true;
            var formData = [
                { pattern: $scope.pattern },
                { fileName: item.file.name }
            ];
            Array.prototype.push.apply(item.formData, formData);
        };

        vm.searchAcrosFiles = function () {
            vm.model = { LogFiles: [], ElapsedMilliseconds: 0 };
            vm.uploader.uploadAll();
        };

        vm.loadLogFolders();

        vm.search = function () {
            vm.model = null;
            if (vm.searchType === 'folders') {
                vm.searchAcrosFolders();
            }
            if (vm.searchType === 'files') {
                vm.searchAcrosFiles();
            }
        };

        vm.isLoading = false;
    }

})();