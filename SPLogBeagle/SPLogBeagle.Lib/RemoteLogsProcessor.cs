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
        public RemoteLogsProcessor(String user, List<string> logsFolders)
        {
            User = user;
            LogsFolders = logsFolders;
        }
        public Dictionary<string, Lib.LogTable> Process(DateTime startDate, DateTime finishDate, string pattern)
        {
            Stopwatch sw = new Stopwatch();
            sw.Start();
            var dt = DateTime.Now;
            Dictionary<string, List<string>> LogFiles = new Dictionary<string, List<string>>();
            Dictionary<string, Lib.LogTable> result = new Dictionary<string, Lib.LogTable>();
            foreach (var folder in LogsFolders)
            {
                LogFiles[folder] = Directory.GetFiles(folder, "*-????????-????.log").Where(l => l.IsFileDateOk(startDate, finishDate)).ToList();
                foreach (var file in LogFiles[folder])
                {
                    result[file] = new Lib.LogTable(file, pattern);
                }
            }
            return result;
        }
    }
}
