using System;
using System.Collections.Generic;

namespace SPLogBeagle.Lib
{
    public interface ILogsProcessor
    {
        Dictionary<string, Lib.LogTable> Process(DateTime? startDate, DateTime? finishDate, string pattern);
    }
}