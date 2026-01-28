using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Entities;

namespace Application.Interfaces.IOrder
{
    public interface IOrderQuery
    {
        Task<List<Order>> GetAllOrders();
        Task<Order?> GetOrderById(long id);
        Task<IEnumerable<Order>> GetAllByFilters(DateTime? from, DateTime? to, int? statusId);
        Task<Order?> GetOrderByIdDetails(long id);
        Task<bool> IsDishInActiveOrder(Guid dishId);


    }
}
