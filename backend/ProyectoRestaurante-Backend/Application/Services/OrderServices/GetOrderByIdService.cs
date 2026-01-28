using Application.Exceptions;
using Application.Interfaces.IOrder;
using Application.Interfaces.IOrder.IOrderServices;
using Application.Models.Response;
using Application.Models.Response.DishResponse;
using Application.Models.Response.OrdersResponse;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services.OrderServices
{
    public class GetOrderByIdService : IGetOrderByIdService
    {
        private readonly IOrderQuery _orderQuery;

        public GetOrderByIdService (IOrderQuery orderQuery)
        {
            _orderQuery = orderQuery;
        }
        public async Task<OrderDetailsResponse?> GetOrderById(long orderId)
        {
            var order = await _orderQuery.GetOrderByIdDetails(orderId);
            if (order == null)
            {
                throw new NotFoundException($"No se encontró la orden con el número {orderId}.");
            }


            var response = new OrderDetailsResponse
            {
                orderNumber = order.OrderId,
                totalAmount = order.Price,
                deliveryTo = order.DeliveryTo,
                notes = order.Notes,
                status = new GenericResponse { Id = order.OverallStatus.Id, Name = order.OverallStatus.Name },
                deliveryType = new GenericResponse { Id = order.DeliveryType.Id, Name = order.DeliveryType.Name },
                createdAt = order.CreateDate,
                updatedAt = order.UpdateDate,
                items = order.OrderItems.Select(item => new OrderItemResponse
                {
                    id = item.OrderItemId,
                    quantity = item.Quantity,
                    notes = item.Notes,
                    status = new GenericResponse { Id = item.Status.Id, Name = item.Status.Name },
                    dish = new DishShortResponse { id = item.Dish.DishId, name = item.Dish.Name, image = item.Dish.ImageUrl }
                }).ToList()
            };

            return response;

        }
    }
}
