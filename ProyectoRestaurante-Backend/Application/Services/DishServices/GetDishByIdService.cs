using Application.Exceptions;
using Application.Interfaces.ICategory;
using Application.Interfaces.IDish;
using Application.Interfaces.IDish.IDishServices;
using Application.Models.Response;
using Application.Models.Response.DishResponse;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services.DishServices
{
    public class GetDishByIdService : IGetDishByIdService
    {
        private readonly IDishQuery _dishQuery;
        private readonly ICategoryQuery _categoryQuery;

        public GetDishByIdService(IDishQuery query, ICategoryQuery categoryQuery)
        {
            _dishQuery = query;
            _categoryQuery = categoryQuery;
        }

        public async Task<DishResponse?> GetDishById(Guid id)
        {
            var dish = await _dishQuery.GetDishById(id);
            if (dish == null)
            {
                throw new NotFoundException($"Parámetros de búsqueda inválidos");
            }

            var category = await _categoryQuery.GetCategoryById(dish.CategoryId);
            return new DishResponse
			{
				id = dish.DishId,
				name = dish.Name,
				description = dish.Description,
				price = dish.Price,
				category = new GenericResponse { Id = dish.CategoryId, Name = category?.Name },
				isActive = dish.Available,
				image = dish.ImageUrl,  
				createdAt = dish.CreateDate,
				updatedAt = dish.UpdateDate
			};
        }
    }
}
