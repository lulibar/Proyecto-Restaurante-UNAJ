using Application.Enums;
using Application.Exceptions;
using Application.Interfaces.IOrder;
using Application.Interfaces.IOrder.IOrderService;
using Application.Interfaces.IOrderItem;
using Application.Models.Request;
using Application.Models.Response.OrdersResponse;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services.OrderServices
{
    public class UpdateOrderItemStatusService : IUpdateOrderItemStatusService
    {

        private readonly IOrderQuery _orderQuery;
        private readonly IOrderCommand _orderCommand;

        public UpdateOrderItemStatusService (IOrderQuery orderQuery, IOrderCommand orderCommand)
        {
            _orderQuery = orderQuery;
            _orderCommand = orderCommand;
        }

        public async Task<OrderUpdateResponse?> UpdateOrderItemStatus(long orderId, long itemId, OrderItemUpdateRequest request)
        {
            if (!Enum.IsDefined(typeof(OrderStatus), request.status))
            {
                throw new BadRequestException($"El estado '{request.status}' no es un estado válido.");
            }

            var order = await _orderQuery.GetOrderByIdDetails(orderId);
            if (order == null)
            {
                throw new NotFoundException($"Orden con ID {orderId} no encontrada.");
            }

            var orderItem = order.OrderItems.FirstOrDefault(item => item.OrderItemId == itemId);
            if (orderItem == null)
            {
                throw new NotFoundException($"Ítem con ID {itemId} no encontrado en la orden {orderId}.");
            }

            if (orderItem.StatusId >= (int)OrderStatus.Ready && request.status < orderItem.StatusId)
            {
                throw new ConflictException("No se puede revertir el estado de un ítem que ya está 'Listo' o en un estado posterior.");
            }


            orderItem.StatusId = request.status;
            var allItems = order.OrderItems.ToList();

            if (allItems.All(item => item.StatusId == (int)OrderStatus.Closed))
            {
                order.OverallStatusId = (int)OrderStatus.Closed;
            }
            else
            {
                var activeItems = allItems.Where(item => item.StatusId != (int)OrderStatus.Closed).ToList();

                if (activeItems.Any()) 
                {
                    var firstActiveItemStatus = activeItems.First().StatusId;
                    if (activeItems.All(item => item.StatusId == firstActiveItemStatus))
                    {
                        order.OverallStatusId = firstActiveItemStatus;
                    }
                    else
                    {
                        if (activeItems.Any(item => item.StatusId == (int)OrderStatus.InProgress))
                        {
                            order.OverallStatusId = (int)OrderStatus.InProgress;
                        }
                        else
                        {
                            order.OverallStatusId = (int)OrderStatus.Pending;
                        }
                    }
                }
                else
                {
                    order.OverallStatusId = (int)OrderStatus.Closed;
                }
            }

            order.UpdateDate = DateTime.UtcNow;
            await _orderCommand.UpdateOrder(order);

            return new OrderUpdateResponse
            {
                OrderNumber = order.OrderId,
                TotalAmount = (double)order.Price,
                UpdatedAt = order.UpdateDate
            };

        }
    }
}
