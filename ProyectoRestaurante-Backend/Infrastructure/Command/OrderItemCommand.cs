using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces.IOrderItem;
using Domain.Entities;
using Infrastructure.Data;

namespace Infrastructure.Command
{
    public class OrderItemCommand : IOrderItemCommand
    {
        private readonly AppDbContext _context;
        public OrderItemCommand(AppDbContext context)
        {
            _context = context;
        }
        public async Task InsertOrderItem(OrderItem orderItem)
        {
            _context.OrderItems.Add(orderItem);
            await _context.SaveChangesAsync();
        }

        public async Task InsertOrderItemRange(List<OrderItem> orderItemsRange)
        {
            _context.OrderItems.AddRange(orderItemsRange);
            await _context.SaveChangesAsync();
        }

        public async Task RemoveOrderItem(OrderItem orderItem)
        {
            _context.OrderItems.Remove(orderItem);
            await _context.SaveChangesAsync();
        }

        public async Task RemoveOrderItems(IEnumerable<OrderItem> items)
        {
            if (items == null || !items.Any())
            {
                return;
            }
            _context.OrderItems.RemoveRange(items);
            await _context.SaveChangesAsync();

        }

        public async Task UpdateOrderItem(OrderItem orderItem)
        {
            _context.OrderItems.Update(orderItem);
            await _context.SaveChangesAsync();
        }
    }
}
