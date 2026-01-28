using Application.Exceptions;
using Application.Interfaces.IOrder;
using Application.Interfaces.IOrder.IOrderService;
using Application.Models.Response;
using Application.Models.Response.DishResponse;
using Application.Models.Response.OrdersResponse;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services.OrderServices
{
    public class GetOrderByDateStatusService : IGetOrderByDateStatus
    {
        private readonly IOrderQuery _orderQuery;
        public GetOrderByDateStatusService(IOrderQuery orderQuery)
        {
            _orderQuery = orderQuery;
        }

        public async Task<IEnumerable<OrderDetailsResponse?>> GetOrderDateStatus(DateTime? from, DateTime? to, int? statusid)
        {
            if (from.HasValue && to.HasValue && from.Value > to.Value)
            {
                throw new BadRequestException("Rango de fechas invalido.");
            }

            var orders = await _orderQuery.GetAllByFilters(from, to, statusid);
            var responseOrders = orders.Select(o => new OrderDetailsResponse
            {

                orderNumber = o.OrderId,
                totalAmount = o.Price,
                deliveryTo = o.DeliveryTo,
                notes = o.Notes,
                status = new GenericResponse { Id = o.OverallStatusId, Name = o.OverallStatus.Name },
                deliveryType = new GenericResponse { Id = o.DeliveryTypeId, Name = o.DeliveryType.Name },
                createdAt = o.CreateDate,
                updatedAt = o.UpdateDate,
                items = o.OrderItems.Select(item => new OrderItemResponse
                {
                    id = item.OrderItemId,
                    quantity = item.Quantity,
                    notes = item.Notes,
                    status = new GenericResponse { Id = item.StatusId, Name = item.Status.Name },
                    dish = new DishShortResponse { id= item.DishId, name = item.Dish.Name, image = item.Dish.ImageUrl }
                }).ToList(),

            });
            return responseOrders;
        }
    }
}
