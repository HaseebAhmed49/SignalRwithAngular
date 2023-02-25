using System;
using Microsoft.AspNetCore.SignalR;
using SignalRwithAngular.Models;

namespace SignalRwithAngular.HubConfig
{
	public partial class MyHub
	{
		public async Task getOnlineUsers()
		{
            Guid currUserId = _context.Connections.Where(c => c.signalR_Id == Context.ConnectionId).Select(c => c.personId).SingleOrDefault();

			List<User> onlineUsers = _context.Connections
				.Where(c => c.personId != currUserId)
				.Select(c =>
					new User(c.personId, _context.Persons.Where(p => p.Id == c.personId).Select(p => p.name).SingleOrDefault(), c.signalR_Id))
				.ToList();

			await Clients.Caller.SendAsync("getOnlineUserResponse", onlineUsers);
        }

		public async Task sendMsg(string connId, string message)
		{
			await Clients.Client(connId).SendAsync("sendMsgResponse", Context.ConnectionId, message);
		}
    }
}

