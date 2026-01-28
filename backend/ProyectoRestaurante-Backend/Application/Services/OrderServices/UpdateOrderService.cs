using Application.Enums;
using Application.Exceptions;
using Application.Interfaces.IDish;
using Application.Interfaces.IOrder;
using Application.Interfaces.IOrder.IOrderServices;
using Application.Interfaces.IOrderItem;
using Application.Models.Request.OrdersRequest;
using Application.Models.Response;
using Application.Models.Response.DishResponse;
using Application.Models.Response.OrdersResponse;
using Domain.Entities;
using Microsoft.IdentityModel.Tokens;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services.OrderServices
{
    public class UpdateOrderService : IUpdateOrderService
    {
        private readonly IOrderQuery _orderQuery;
        private readonly IOrderCommand _orderCommand;
        private readonly IDishQuery _dishQuery;
        private readonly IOrderItemCommand _orderItemCommand;

        public UpdateOrderService (IOrderQuery orderQuery, IOrderCommand orderCommand, IDishQuery dishQuery, IOrderItemCommand orderItemCommand)
        {
            _orderQuery = orderQuery;
            _orderCommand = orderCommand;
            _dishQuery = dishQuery;
            _orderItemCommand = orderItemCommand;
        }

        public async Task<OrderDetailsResponse> UpdateOrder(long orderId, OrderUpdateRequest updateRequest)
        {
            if (updateRequest?.items == null ) 
                throw new BadRequestException("La solicitud para agregar ítems no puede estar vacía.");

            if (updateRequest.items.Any(item => item.quantity < 0))
                throw new BadRequestException("La cantidad de cada plato no puede ser negativa");

            var order = await _orderQuery.GetOrderByIdDetails(orderId);
            if (order == null)
                throw new NotFoundException($"Orden con ID {orderId} no encontrada.");

            if (order.OverallStatusId >= (int)OrderStatus.InProgress)
                throw new ConflictException("No se puede modificar una orden que ya está en preparación o finalizada.");

            var requestedDishIds = updateRequest.items.Select(item => item.id).Distinct();
            var existingDishes = await _dishQuery.GetDishesByIds(requestedDishIds);
            var   dishDictionary = existingDishes.ToDictionary(d => d.DishId);

            if (existingDishes.Count != requestedDishIds.Count())
                throw new BadRequestException("El plato especificado no está disponible.");

            var itemsToRemove = new List<OrderItem>();
            var itemsToAdd = new List<OrderItem>();

            foreach (var itemRequest in updateRequest.items)
            {
                var existingItem = order.OrderItems.FirstOrDefault(oi => oi.DishId == itemRequest.id);
                var dish = dishDictionary[itemRequest.id];

                if (existingItem != null) 
                {
                    if (itemRequest.quantity > 0)
                    {
                        existingItem.Quantity = itemRequest.quantity;
                        existingItem.Notes = itemRequest.notes;
                        if (existingItem.StatusId == (int)OrderStatus.Closed)
                        {
                            existingItem.StatusId = (int)OrderStatus.Pending;
                        }
                    }
                    else 
                    {
                        
                        existingItem.Quantity = 0;
                        existingItem.StatusId = (int)OrderStatus.Closed;
                    }
                }
                else 
                {
                    if (itemRequest.quantity > 0)
                    {
                        var newItem = new OrderItem
                        {
                            OrderId = order.OrderId, 
                            DishId = itemRequest.id,
                            Quantity = itemRequest.quantity,
                            Notes = itemRequest.notes,
                            StatusId = (int)OrderStatus.Pending,
                        };
                        itemsToAdd.Add(newItem); 
                    }
                }
            }

            if (itemsToAdd.Any())
            {
                await _orderItemCommand.InsertOrderItemRange(itemsToAdd);
                foreach (var item in itemsToAdd) { if (!order.OrderItems.Contains(item)) order.OrderItems.Add(item); }
            }

            var allCurrentItems = order.OrderItems.ToList();

            if (allCurrentItems.All(item => item.StatusId == (int)OrderStatus.Closed))
            {
                order.OverallStatusId = (int)OrderStatus.Closed;
            }
            else
            {
                var activeItems = allCurrentItems.Where(item => item.StatusId != (int)OrderStatus.Closed).ToList();
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

            var allRequiredDishes = await _dishQuery.GetDishesByIds(allCurrentItems.Select(i => i.DishId).Distinct());
            order.Price = CalculateTotalPrice(allCurrentItems.Where(oi => oi.StatusId != (int)OrderStatus.Closed).ToList()); // Pasamos allRequiredDishes
            order.UpdateDate = DateTime.UtcNow;

            await _orderCommand.UpdateOrder(order);

            var updatedOrder = await _orderQuery.GetOrderByIdDetails(order.OrderId);
            return new OrderDetailsResponse
            {
                orderNumber = updatedOrder.OrderId,
                totalAmount = updatedOrder.Price,
                deliveryTo = updatedOrder.DeliveryTo,
                notes = updatedOrder.Notes,
                status = new GenericResponse { Id = updatedOrder.OverallStatusId, Name = updatedOrder.OverallStatus.Name },
                deliveryType = new GenericResponse { Id = updatedOrder.DeliveryType.Id, Name = updatedOrder.DeliveryType.Name },
                items = updatedOrder.OrderItems.Select(item => new OrderItemResponse
                {
                    id = item.OrderItemId,
                    quantity = item.Quantity,
                    notes = item.Notes,
                    status = new GenericResponse { Id = item.Status.Id, Name = item.Status.Name },
                    dish = new DishShortResponse
                    {
                        id = item.Dish.DishId,
                        name = item.Dish.Name,
                        image = item.Dish.ImageUrl
                    }
                }).ToList(),

               createdAt = updatedOrder.CreateDate,
               updatedAt = updatedOrder.UpdateDate
            };

        }

        private decimal CalculateTotalPrice(List<OrderItem> currentItems)
        {
            decimal total = 0;
            foreach (var item in currentItems)
            {
                if (item.StatusId != (int)OrderStatus.Closed) 
                {
                    total += item.Dish.Price * item.Quantity;
                }
            }
            return total;
        }

    }
}