using Application.Models.Response.OrdersResponse;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces.IOrder.IOrderService
{
    public interface IGetOrderByDateStatus
    {
        Task<IEnumerable<OrderDetailsResponse?>> GetOrderDateStatus(DateTime? from, DateTime? to, int? statusid);
    }
}
