using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;

namespace SPLogBeagle.Lib
{
	public class LogTable
	{
		public List<string> Header { get; set; }
		public List<string[]> Body { get; set; }
		public int[] Lengths { get; set; }

		public LogTable()
		{

		}

        public LogTable(string fileName, string pattern)
        {
            //var fStream = new FileStream(fileName, FileMode.Open, FileAccess.Read, FileShare.Read);
            using (FileStream logFileStream = new FileStream(fileName, FileMode.Open, FileAccess.Read, FileShare.ReadWrite))
            {
                using (StreamReader logFileReader = new StreamReader(logFileStream))
                {
                    if (!logFileReader.EndOfStream) {
                        var headerString = logFileReader.ReadLine();
                        Header = headerString.Split(new string[] { "\t" }, StringSplitOptions.None).Select(s => s.Trim()).ToList();
                        Guid correlationUid = new Guid();
                        if (Guid.TryParse(pattern, out correlationUid))
                        {
                            FillBody(logFileReader, correlationUid);
                        }
                        else
                        {
                            FillBody(logFileReader, pattern);
                        }

                        if (Body.Count > 1000) Body = Body.Take(1000).ToList();
                        Lengths = new int[Header.Count];
                        for (int i = 0; i < Header.Count; i++)
                        {
                            Lengths[i] = Math.Max(Lengths[i], Header[i].Length);
                        }
                        for (int i = 0; i < Body.Count; i++)
                        {
                            for (int j = 0; j < Lengths.Count(); j++)
                            {
                                Lengths[j] = Math.Max(Lengths[j], Body[i][j].Length);
                            }
                        }
                    }
                }
            }
        }

        public void FillBody(StreamReader logFileReader, string pattern)
        {
            Body = new List<string[]>();
            var _guids = new List<string>();
            var _body = new List<string[]>();
            while (!logFileReader.EndOfStream)
            {
                string line = logFileReader.ReadLine();
                var row = new string[Header.Count];
                var parts = line.Split(new string[] { "\t" }, StringSplitOptions.None);
                if (parts.Length == Header.Count)
                {
                    for (int j = 0; j < Header.Count - 2; j++)
                    {
                        row[j] = parts[j].Trim();
                    }
                    var sb = new StringBuilder();
                    for (int j = Header.Count - 2; j < parts.Count() - 1; j++)
                    {
                        sb.Append(parts[j]);
                    }
                    row[Header.Count - 2] = sb.ToString();
                    row[Header.Count - 1] = parts[parts.Count() - 1];
                    if (row[Header.Count - 2].IndexOf(pattern) >= 0 && (row[Header.Count - 1] ?? "").Length > 30)
                    {
                        _guids.Add(row[Header.Count - 1]);
                    }
                    _body.Add(row);
                }
            }
            var result = _body.Where(b => _guids.Distinct().Contains(b[Header.Count - 1]) || (b[Header.Count - 2].IndexOf(pattern) >= 0)).ToList();
            Body = result;
        }

        public void FillBody(StreamReader logFileReader, Guid correlationUid)
        {
            Body = new List<string[]>();
            while (!logFileReader.EndOfStream)
            {
                string line = logFileReader.ReadLine();
                var row = new string[Header.Count];
                var parts = line.Split(new string[] { "\t" }, StringSplitOptions.None);
                if (parts.Length == Header.Count)
                {
                    for (int j = 0; j < Header.Count - 2; j++)
                    {
                        row[j] = parts[j].Trim();
                    }
                    var sb = new StringBuilder();
                    for (int j = Header.Count - 2; j < parts.Count() - 1; j++)
                    {
                        sb.Append(parts[j]);
                    }
                    row[Header.Count - 2] = sb.ToString();
                    row[Header.Count - 1] = parts[parts.Count() - 1];
                    var tempGuid = new Guid();
                    if (Guid.TryParse(row[Header.Count - 1], out tempGuid))
                    {
                        if (correlationUid == tempGuid)
                        {
                            Body.Add(row);
                        }
                    }
                }
            }
        }

        //public void SaveToFile(string dstFileName)
        //{
        //	for (int i = 0; i < Header.Count(); i++)
        //	{
        //		File.AppendAllText(dstFileName, (i == 0 ? "" : "\t") + Header[i].PadRight(Lengths[i]));
        //	}
        //	File.AppendAllText(dstFileName, "\r\n");
        //	for (int i = 0; i < Header.Count(); i++)
        //	{
        //		for (int j = 0; j < Header.Count(); j++)
        //		{
        //                  File.AppendAllText(dstFileName, (j == 0 ? "" : "\t") + Body[i][j].PadRight(Lengths[j]));
        //		}
        //		File.AppendAllText(dstFileName, "\r\n");
        //	}
        //}

        public List<SPLogEntry> GetSPLogEntries()
        {
            return Body.Select(r => new SPLogEntry
            {
                Timestamp = r[0],
                Process = r[1],
                TID = r[2],
                Area = r[3],
                Category = r[4],
                EventID = r[5],
                Level = r[6],
                Message = r[7],
                Correlation = r[8]
            }).ToList();
        }
	}
}