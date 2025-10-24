using Application.Models.Response.OrdersResponse;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces.IOrder.IOrderServices
{
    
    public interface IGetOrderByIdService
    {
        Task<OrderDetailsResponse?> GetOrderById(long orderId);
    }
}
