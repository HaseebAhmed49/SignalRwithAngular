using System;
using Microsoft.AspNetCore.SignalR;
using SignalRwithAngular.Data;
using SignalRwithAngular.Models;

namespace SignalRwithAngular.HubConfig
{
	public class MyHub: Hub
	{
		private readonly AppDbContext _context;

		public MyHub(AppDbContext context)
		{
			_context = context;
		}
		
		public async Task authMe(Person person)
		{
			string currentSignalR_Id = Context.ConnectionId;
			Person tempPerson = _context.Persons.Where(p => p.userName == person.userName && p.password == person.password)
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
				_context.SaveChanges();

				await Clients.Caller.SendAsync("authMeResponseSuccess", tempPerson);
			}
			else
			{
				await Clients.Client(currentSignalR_Id).SendAsync("authMeResponseFail");
			}
		}

		public async Task askServer(string someTextFromClient)
		{
			string tempString;

			tempString = (someTextFromClient == "hey") ? "Message was 'hey'" : "Message was something else";

			await Clients.Clients(this.Context.ConnectionId).SendAsync("askServerResponse", tempString);
		}
	}
}