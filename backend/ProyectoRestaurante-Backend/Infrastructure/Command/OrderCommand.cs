using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces.IOrder;
using Infrastructure.Data;

namespace Infrastructure.Command
{
    public class OrderCommand : IOrderCommand
    {
        private readonly AppDbContext _context;
        public OrderCommand(AppDbContext context)
        {
            _context = context;
        }
        public async Task InsertOrder(Domain.Entities.Order order)
        {
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();
        }
        public async Task RemoveOrder(Domain.Entities.Order order)
        {
            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();
        }
        public async Task UpdateOrder(Domain.Entities.Order order)
        {
            _context.Orders.Update(order);
            await _context.SaveChangesAsync();
        }
    }
}
