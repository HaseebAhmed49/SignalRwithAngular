using System;
using Microsoft.EntityFrameworkCore;
using SignalRwithAngular.Models;

namespace SignalRwithAngular.Data
{
	public class AppDbContext: DbContext
	{
		public AppDbContext(DbContextOptions<AppDbContext> options): base(options)
		{
		}

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
        }

		public DbSet<Connection> Connections { get; set; }

		public DbSet<Person> Persons { get; set; }

	}
}

