using Application.Models.Request;
using Application.Models.Response.OrdersResponse;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces.IOrder.IOrderService
{
    public interface IUpdateOrderItemStatusService
    {
        Task<OrderUpdateResponse?> UpdateOrderItemStatus(long orderId, long itemId, OrderItemUpdateRequest request);

    }
}
