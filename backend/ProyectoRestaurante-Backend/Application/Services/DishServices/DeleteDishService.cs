using Application.Exceptions;
using Application.Interfaces.ICategory;
using Application.Interfaces.IDish;
using Application.Interfaces.IDish.IDishServices;
using Application.Interfaces.IOrder;
using Application.Interfaces.IOrderItem;
using Application.Models.Response;
using Application.Models.Response.DishResponse;
using Microsoft.AspNetCore.Http.HttpResults;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services.DishServices
{
    public class DeleteDishService : IDeleteDishService
    {
        private readonly IDishQuery _dishQuery;
        private readonly IDishCommand _dishCommand;
        private readonly IOrderQuery _orderQuery;
        private readonly ICategoryQuery _categoryQuery;
        private readonly IOrderItemQuery _orderItemQuery;


        public DeleteDishService(IDishQuery dishQuery, IDishCommand dishCommand, IOrderQuery orderQuery, ICategoryQuery categoryQuery, IOrderItemQuery orderItemQuery) 
        {
            _dishQuery = dishQuery;
            _dishCommand = dishCommand;
            _orderQuery = orderQuery;
            _categoryQuery = categoryQuery;
            _orderItemQuery = orderItemQuery;
        }

        public async Task DeleteDish(Guid id)
        {
            var dish = await _dishQuery.GetDishById(id);
            if (dish == null)
            {
                throw new NotFoundException($"No se encontró el plato con el ID: {id}");
            }


            var isInActiveOrder = await _orderQuery.IsDishInActiveOrder (id);

            if (isInActiveOrder)
            {
                throw new ConflictException("No se puede eliminar el plato porque está incluido en órdenes activas.");
            }

            dish.Available = false;
            dish.UpdateDate = DateTime.Now;
            await _dishCommand.UpdateDish(dish);



        }
    }
}
