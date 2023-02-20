using System;
namespace SignalRwithAngular.Models
{
	public class Connection
	{
		public int Id { get; set; }

		public int personId { get; set; }

		public string signalR_Id { get; set; }

		public DateTime timeStamp { get; set; }
	}
}

