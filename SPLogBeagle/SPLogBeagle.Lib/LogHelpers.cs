using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SPLogBeagle.Lib
{
    public static class LogHelpers
    {
        public static Boolean IsFileDateOk(this String fileName, DateTime startDate, DateTime finishDate)
        {
            if (!String.IsNullOrEmpty(fileName) && fileName.Length > 16 && fileName.EndsWith(".log"))
            {
                var dateStr = fileName.Substring(fileName.Length - 17, 13);
                var yearStr = dateStr.Substring(0, 4);
                var monthStr = dateStr.Substring(4, 2);
                var dayStr = dateStr.Substring(6, 2);
                var hoursStr = dateStr.Substring(9, 2);
                var minutesStr = dateStr.Substring(11, 2);
                int year = 0;
                int month = 0;
                int day = 0;
                int hours = 0;
                int minutes = 0;
                if (int.TryParse(yearStr, out year) && int.TryParse(monthStr, out month) && int.TryParse(dayStr, out day) && int.TryParse(hoursStr, out hours) && int.TryParse(minutesStr, out minutes))
                {
                    var fDate = new DateTime(year, month, day, hours, minutes, 0);
                    if (fDate > startDate && fDate < finishDate)
                    {
                        return true;
                    }
                }
            }
            return false;
        }
    }
}
