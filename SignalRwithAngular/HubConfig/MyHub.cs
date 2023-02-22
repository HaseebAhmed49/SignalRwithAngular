using System;
using Microsoft.AspNetCore.SignalR;
using SignalRwithAngular.Data;
using SignalRwithAngular.Models;

namespace SignalRwithAngular.HubConfig
{
	public partial class MyHub: Hub
	{
		private readonly AppDbContext _context;

		public MyHub(AppDbContext context)
		{
			_context = context;
		}

        public override Task OnDisconnectedAsync(Exception? exception)
        {
			Guid currUserId = _context.Connections.Where(c => c.signalR_Id == Context.ConnectionId).Select(c => c.personId).SingleOrDefault();

			_context.Connections.RemoveRange(_context.Connections.Where(p => p.personId == currUserId).ToList());
			_context.SaveChanges();
			Clients.Others.SendAsync("userOff", currUserId);
            return base.OnDisconnectedAsync(exception);
        }

        public async Task authMe(PersonInfo personInfo)
		{
			string currentSignalR_Id = Context.ConnectionId;
			Person tempPerson = _context.Persons.Where(p => p.userName == personInfo.userName && p.password == personInfo.password)
				.SingleOrDefault();

			if(tempPerson != null) // if credentials are correct
			{
				Console.WriteLine("\n" +  tempPerson.name + "logged in" + "\n SignalR ID: " + currentSignalR_Id);

				Connection currentUser = new Connection
				{
					personId = tempPerson.Id,
					signalR_Id = currentSignalR_Id,
					timeStamp = DateTime.Now
				};
				await _context.Connections.AddAsync(currentUser);
				await _context.SaveChangesAsync();

                User newUser = new User(tempPerson.Id, tempPerson.name, currentSignalR_Id);

                await Clients.Caller.SendAsync("authMeResponseSuccess", newUser);
                await Clients.Others.SendAsync("userOn", newUser);
            }
            else
			{
				//await Clients.Client(currentSignalR_Id).SendAsync("authMeResponseFail");
                await Clients.Caller.SendAsync("authMeResponseFail");
            }
        }

		public async Task askServer(string someTextFromClient)
		{
			string tempString;

			tempString = (someTextFromClient == "hey") ? "Message was 'hey'" : "Message was something else";

			await Clients.Clients(this.Context.ConnectionId).SendAsync("askServerResponse", tempString);
		}

		public async Task reauthMe(Guid personId)
		{
			string currentSignalRID = Context.ConnectionId;
			Person tempPerson = _context.Persons.Where(p => p.Id == personId)
                .SingleOrDefault();

            if (tempPerson != null) // if credentials are correct
            {
                Console.WriteLine("\n" + tempPerson.name + "logged in" + "\n SignalR ID: " + currentSignalRID);

                Connection currentUser = new Connection
                {
                    personId = tempPerson.Id,
                    signalR_Id = currentSignalRID,
                    timeStamp = DateTime.Now
                };
                await _context.Connections.AddAsync(currentUser);
                await _context.SaveChangesAsync();

				User newUser = new User(tempPerson.Id, tempPerson.name, currentSignalRID);

                await Clients.Caller.SendAsync("authMeResponseSuccess", newUser);
				await Clients.Others.SendAsync("userOn", newUser);
            }
            else
            {
                //await Clients.Client(currentSignalR_Id).SendAsync("authMeResponseFail");
                await Clients.Caller.SendAsync("authMeResponseFail");
            }
        }

		public void logOut(Guid personId)
		{
			_context.Connections.RemoveRange(_context.Connections.Where(p => p.personId == personId).ToList());

			_context.SaveChanges();

			Clients.Caller.SendAsync("logOutResponse");

			Clients.Others.SendAsync("userOff", personId);
		}
	}
}