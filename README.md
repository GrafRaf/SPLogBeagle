# SPLogBeagle
Searching in SP logs

## Details
It's simple asp.net mvc application allowed search accross multiple SharePoint ULS log files locations.

## Install/Configure
* Clone repository
* Open solution
* Add log files location to $scope.logFolders array in init.js file (SPLogBeagle/SPLogBeagle/Scripts/init.js). For example $scope.logFolders = ["\\server1\logsfolder", "server2\logsfolder"];
* Set "TempFilesDirNamePattern" parameter in web.config file (by  default "C:\temp\splogs\{0}-{1}{2}{3}-{4}-{5}-{6}.{7}"). This parameter used for compose temp folders names (String.Format(@"C:\temp\splogs\{0}-{1}{2}{3}-{4}-{5}-{6}.{7}", user, dt.Year, dt.Month, dt.Day, dt.Hour, dt.Minute, dt.Second, dt.Millisecond)).
* Publish to IIS
* Add application pool identity permissions to read files from log files shares

## Usage
* Open start page
* Select start/finish date/time
* Input searching substring or correlationUid
* Check IsRemoteLogProcessing option if need
* Check locations for search
* Press "Go"button
* Check columns to view

