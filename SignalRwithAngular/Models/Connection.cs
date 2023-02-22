using System;
namespace SignalRwithAngular.Models
{
	public class Connection
	{
		public Guid Id { get; set; }

		public Guid personId { get; set; }

		public string signalR_Id { get; set; }

		public DateTime timeStamp { get; set; }
	}
}

