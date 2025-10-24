using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Entities;

namespace Application.Interfaces.IOrderItem
{
    public interface IOrderItemQuery
    {
        Task<List<OrderItem>> GetAllOrderItems();
        Task<OrderItem?> GetOrderItemById(long orderId, long itemId);

    }
}
