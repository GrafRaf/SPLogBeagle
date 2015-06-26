using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace SPLogBeagle.Lib
{
    public class SPLogEntry
    {
        public string Timestamp { get; set; }
        public string Process { get; set; }
        public string TID { get; set; }
        public string Area { get; set; }
        public string Category { get; set; }
        public string EventID { get; set; }
        public string Level { get; set; }
        public string Message { get; set; }
        public string Correlation { get; set; }
    }
}
