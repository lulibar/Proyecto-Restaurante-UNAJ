using Application.Enums;
using Application.Exceptions;
using Application.Interfaces.ICategory;
using Application.Interfaces.ICategory.ICategoryServices;
using Application.Interfaces.IDeliveryType;
using Application.Interfaces.IDish;
using Application.Interfaces.IDish.IDishServices;
using Application.Interfaces.IOrder;
using Application.Interfaces.IOrder.IOrderServices;
using Application.Interfaces.IOrderItem;
using Application.Models.Request;
using Application.Models.Request.OrdersRequest;
using Application.Models.Response.OrdersResponse;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services.OrderServices
{
    public class CreateOrderService : ICreateOrderService
    {

        private readonly IOrderCommand _orderCommand;
        private readonly IDeliveryTypeQuery _deliveryTypeQuery;
        private readonly IDishQuery _dishQuery;
        private readonly IOrderItemCommand _orderItemCommand;

        public CreateOrderService (IOrderCommand orderCommand, IDeliveryTypeQuery deliveryTypeQuery, IDishQuery dishQuery, IOrderItemCommand orderItemCommand)
        {
            _orderCommand = orderCommand;
            _deliveryTypeQuery = deliveryTypeQuery;
            _dishQuery = dishQuery;
            _orderItemCommand = orderItemCommand;

        }

        public async Task<OrderCreateResponse?> CreateOrder(OrderRequest orderRequest)
        {
            if (orderRequest?.items == null || !orderRequest.items.Any())
            {
                throw new BadRequestException("La orden debe contener al menos un ítem.");
            }

            if (orderRequest.items.Any(item => item.quantity <= 0)) 
            {
                throw new BadRequestException("La cantidad de cada plato debe ser mayor a 0."); 
            }
                

            var deliveryType = await _deliveryTypeQuery.GetDeliveryTypeById(orderRequest.delivery.id);
            
            if (deliveryType == null) 
            {                
                throw new BadRequestException($"El tipo de entrega con ID {orderRequest.delivery.id} no existe.");

            }

            var deliveryTypeEnum = (DeliveryTypes)orderRequest.delivery.id;

            switch (deliveryTypeEnum)
            {
                case DeliveryTypes.Delivery:
                    if (string.IsNullOrWhiteSpace(orderRequest.delivery.to))
                        throw new BadRequestException("Para 'Delivery', se requiere una dirección de entrega.");
                    break;

                case DeliveryTypes.TakeAway:
                    if (string.IsNullOrWhiteSpace(orderRequest.delivery.to))
                        throw new BadRequestException("Para 'Take Away', se requiere el nombre de la persona que retira.");
                    break;

                case DeliveryTypes.DineIn:
                    if (string.IsNullOrWhiteSpace(orderRequest.delivery.to))
                        throw new BadRequestException("Para 'Dine In', se requiere el número de mesa.");
                    break;
            }

            var requestedDishIds = orderRequest.items.Select(item => item.id).Distinct();

            var existingDishes = await _dishQuery.GetDishesByIds(requestedDishIds);

            if (existingDishes.Count != requestedDishIds.Count())
            {
                throw new BadRequestException("Uno o más platos especificados no existen o no están disponibles.");
            }
            
            decimal totalPrice = CalculateTotalPrice(orderRequest.items, existingDishes);

            var order = new Order
            {
                DeliveryTypeId = orderRequest.delivery.id,
                DeliveryTo = orderRequest.delivery.to,
                Price = totalPrice, 
                OverallStatusId = 1, 
                Notes = orderRequest.notes,
                UpdateDate = DateTime.Now,
                CreateDate = DateTime.Now
            };


            await _orderCommand.InsertOrder(order);

            var listItems = orderRequest.items;
            var listorderItems = listItems.Select(item => new OrderItem
            {
                DishId = item.id,
                Quantity = item.quantity,
                Notes = item.notes,
                StatusId = 1,
                OrderId = order.OrderId,
            }).ToList();

            await _orderItemCommand.InsertOrderItemRange(listorderItems);


            return new OrderCreateResponse
            {
                orderNumber = (int)order.OrderId,
                totalAmount = order.Price,
                createdAt = DateTime.Now
            };
        }

        decimal CalculateTotalPrice(List<Items> orderItems, List<Dish> dishes)
        {
            decimal total = 0;
            var dishPriceMap = dishes.ToDictionary(d => d.DishId, d => d.Price);

            foreach (var item in orderItems)
            {
                if (dishPriceMap.TryGetValue(item.id, out var price))
                {
                    total += price * item.quantity;
                }
            }
            return total;
        }
    }
}

