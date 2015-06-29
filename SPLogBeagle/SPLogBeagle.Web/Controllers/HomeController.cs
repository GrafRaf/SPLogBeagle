using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Configuration;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using SPLogBeagle.Lib;

namespace SPLogBeagle.Web.Controllers
{
    public class HomeController : Controller
    {
        NameValueCollection AppSettings = ConfigurationManager.AppSettings;
        string TempFilesDirNamePattern { get { return AppSettings["TempFilesDirNamePattern"]; } }
        bool IsRemoteProcessor { get { bool result = false; bool.TryParse(AppSettings["IsRemoteProcessor"], out result); return result; } }

        public ActionResult Index()
        {
            return View();
        }

        public JsonResult Find(DateTime startDate, DateTime finishDate, string pattern, bool isRemoteLogProcessing, string[] logFolders)
        {
            Stopwatch sw = new Stopwatch();
            sw.Start();
            List<string> Locations = logFolders.ToList();
            var dt = DateTime.Now;
            var user = (User.Identity.Name ?? "").Replace('\\', '-');
            Dictionary<string, List<string>> LogFiles = new Dictionary<string, List<string>>();
            Dictionary<string, Lib.LogTable> result = new Dictionary<string, Lib.LogTable>();
            ILogsProcessor logsProcessor = null;
            bool IsRemote = isRemoteLogProcessing;
            if (IsRemote)
            {
                logsProcessor = new RemoteLogsProcessor(User.Identity.Name, Locations);
            }
            else
            {
                logsProcessor = new LocalLogsProcessor(User.Identity.Name, Locations, TempFilesDirNamePattern);
            }
            result = logsProcessor.Process(startDate, finishDate, pattern);
            var jsonResult = Json(new
            {
                LogFiles = result.Select(l => new { Name = l.Key, Count = l.Value.Body.Count, Data = l }),
                ElapsedMilliseconds = sw.ElapsedMilliseconds
            }, JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }
    }
}