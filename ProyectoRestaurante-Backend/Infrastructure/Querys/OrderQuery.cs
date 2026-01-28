using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces.IOrder;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Querys
{
    public class OrderQuery : IOrderQuery
    {
        private readonly AppDbContext _context;
        public OrderQuery(AppDbContext context)
        {
            _context = context;
        }
        public async Task<Order?> GetOrderById(long id)
        {
            return await _context.Orders
                    .Include(o => o.OrderItems)
                    .FirstOrDefaultAsync(o => o.OrderId == id);
        }
        public async Task<List<Order>> GetAllOrders()
        {
            return await _context.Orders.ToListAsync();
        }

        public async Task<IEnumerable<Order>> GetAllByFilters(DateTime? from, DateTime? to, int? statusId)
        {
            var query = _context.Orders
                        .Include(o => o.OverallStatus)
                        .Include(o => o.DeliveryType)
                        .Include(o => o.OrderItems)
                            .ThenInclude(oi => oi.Dish)
                        .Include(o => o.OrderItems)
                            .ThenInclude(oi => oi.Status)
                        .AsQueryable();
            if (from.HasValue)
            {
                var fromUtc = from.Value.Kind == DateTimeKind.Unspecified
                                ? DateTime.SpecifyKind(from.Value, DateTimeKind.Utc) 
                                : from.Value.ToUniversalTime();                     
                query = query.Where(o => o.CreateDate >= fromUtc);
            }

            if (to.HasValue)
            {
                var toUtc = to.Value.Kind == DateTimeKind.Unspecified
                                ? DateTime.SpecifyKind(to.Value, DateTimeKind.Utc)
                                : to.Value.ToUniversalTime();
                query = query.Where(o => o.CreateDate <= toUtc);
            }

            if (statusId.HasValue)
            {
                query = query.Where(o => o.OverallStatusId == statusId.Value);
            }

            return await query.OrderByDescending(o => o.CreateDate).ToListAsync();

        }

        public async Task<Order?> GetOrderByIdDetails(long id)
        {
            return await _context.Orders
            .Include(o => o.OverallStatus)
            .Include(o => o.DeliveryType)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Dish) 
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Status) 
            .FirstOrDefaultAsync(o => o.OrderId == id);
        }

        public async Task<bool> IsDishInActiveOrder(Guid dishId)
        {
            var activeStatusIds = new[] { 1, 2 };

            return await _context.OrderItems
                .AnyAsync(orderItem =>
                    orderItem.DishId == dishId &&
                    activeStatusIds.Contains(orderItem.Order.OverallStatusId)
                );

        }
    }
}
