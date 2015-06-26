using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using SPLogBeagle.Lib;

namespace SPLogBeagle.Web.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult Find(DateTime startDate, DateTime finishDate, string pattern, string[] logFolders)
        {
            List<string> Locations = logFolders.ToList(); ;
            var dt = DateTime.Now;
            var user = (User.Identity.Name ?? "").Replace('\\', '-');
            var tempDir = String.Format(@"C:\temp\splogs\{0}-{1}{2}{3}-{4}-{5}-{6}.{7}", user, dt.Year, dt.Month, dt.Day, dt.Hour, dt.Minute, dt.Second, dt.Millisecond);

            Directory.CreateDirectory(tempDir);
            Dictionary<string, List<string>> LogFiles = new Dictionary<string, List<string>>();
            Dictionary<string, Lib.LogTable> result = new Dictionary<string, Lib.LogTable>();
            foreach (var folder in Locations)
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
            var jsonResult = Json(result.Select(l => new { Name = l.Key, Count = l.Value.Body.Count, Data = l }), JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }
    }
}