using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SPLogBeagle.Lib
{
    public class RemoteLogsProcessor : ILogsProcessor
    {
        private String User;
        private String UserFolder { get { return (User ?? "").Replace('\\', '-'); } }
        private List<string> LogsFolders { get; set; }
        private List<string> LogsFiles { get; set; }
        private bool IsLogFiles { get; set; }
        public RemoteLogsProcessor(String user, List<string> logsItems, bool isLogFiles)
        {
            User = user;
            IsLogFiles = isLogFiles;
            if (isLogFiles)
            {
                LogsFiles = logsItems;
            }
            else
            {
                LogsFolders = logsItems;
            }
        }
        public Dictionary<string, Lib.LogTable> Process(DateTime? startDate, DateTime? finishDate, string pattern)
        {
            Stopwatch sw = new Stopwatch();
            sw.Start();
            var dt = DateTime.Now;
            Dictionary<string, Lib.LogTable> result = new Dictionary<string, Lib.LogTable>();
            if (IsLogFiles)
            {
                foreach (var file in LogsFiles)
                {
                    result[file] = new Lib.LogTable(file, pattern);
                }
            }
            else
            {
                Dictionary<string, List<string>> LogFiles = new Dictionary<string, List<string>>();
                foreach (var folder in LogsFolders)
                {
                    LogFiles[folder] = Directory.GetFiles(folder, "*-????????-????.log")
                        .Where(l => !startDate.HasValue || !finishDate.HasValue || (startDate.HasValue && finishDate.HasValue && l.IsFileDateOk(startDate.Value, finishDate.Value)))
                        .ToList();
                    foreach (var file in LogFiles[folder])
                    {
                        result[file] = new Lib.LogTable(file, pattern);
                    }
                }
            }
            return result;
        }
    }
}
