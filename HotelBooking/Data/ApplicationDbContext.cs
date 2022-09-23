using HotelBooking.Models;
using IdentityServer4.EntityFramework.Options;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HotelBooking.Data
{
    public class ApplicationDbContext : ApiAuthorizationDbContext<ApplicationUser>
    {
        public ApplicationDbContext(
            DbContextOptions options,
            IOptions<OperationalStoreOptions> operationalStoreOptions) : base(options, operationalStoreOptions)
        {
        }
        public DbSet<HotelBooking.Models.Category> Category { get; set; }
        public DbSet<HotelBooking.Models.Client> Client { get; set; }
        public DbSet<HotelBooking.Models.Room> Room { get; set; }
        public DbSet<HotelBooking.Models.Reservation> Reservation { get; set; }
    }
}
