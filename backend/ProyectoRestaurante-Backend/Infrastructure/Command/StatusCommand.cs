using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces.IStatus;
using Infrastructure.Data;
using Domain.Entities;

namespace Infrastructure.Command
{
    public class StatusCommand : IStatusCommand
    {
        private readonly AppDbContext _context;
        public StatusCommand(AppDbContext context)
        {
            _context = context;
        }
        public async Task InsertStatus(Status status)
        {
            _context.Statuses.Add(status);
            await _context.SaveChangesAsync();
        }
        public async Task RemoveStatus(Status status)
        {
            _context.Statuses.Remove(status);
            await _context.SaveChangesAsync();
        }
        public async Task UpdateStatus(Status status)
        {
            _context.Statuses.Update(status);
            await _context.SaveChangesAsync();
        }
    }
}
