using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SPLogBeagle.Lib
{
    public class LocalLogsProcessor : ILogsProcessor
    {
        private String User;
        private String UserFolder { get { return (User ?? "").Replace('\\', '-'); } }
        private List<string> LogsFolders { get; set; }
        private string TempFilesDirNamePattern { get; }
        public LocalLogsProcessor(String user, List<string> logsFolders, string tempFilesDirNamePattern)
        {
            User = user;
            LogsFolders = logsFolders;
            TempFilesDirNamePattern = tempFilesDirNamePattern;
        }
        public Dictionary<string, Lib.LogTable> Process(DateTime startDate, DateTime finishDate, string pattern)
        {
            var dt = DateTime.Now;
            Dictionary<string, List<string>> LogFiles = new Dictionary<string, List<string>>();
            Dictionary<string, Lib.LogTable> result = new Dictionary<string, Lib.LogTable>();
            var tempDir = String.Format(TempFilesDirNamePattern, UserFolder, dt.Year, dt.Month, dt.Day, dt.Hour, dt.Minute, dt.Second, dt.Millisecond);
            Directory.CreateDirectory(tempDir);
            foreach (var folder in LogsFolders)
            {
                LogFiles[folder] = Directory.GetFiles(folder, "*-????????-????.log").Where(l => l.IsFileDateOk(startDate, finishDate)).ToList();
                foreach (var file in LogFiles[folder])
                {
                    var dstFileName = tempDir + "\\" + new System.IO.FileInfo(file).Name;
                    System.IO.File.Copy(file, dstFileName);
                    try
                    {
                        result[file] = new Lib.LogTable(dstFileName, pattern);
                    }
                    finally
                    {
                        System.IO.File.Delete(dstFileName);
                    }
                }
            }
            System.IO.Directory.Delete(tempDir);
            return result;
        }
    }
}
