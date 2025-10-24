using Application.Interfaces.ICategory;
using Application.Interfaces.IDish;
using Application.Interfaces.IDish.IDishServices;
using Application.Models.Response;
using Application.Models.Response.DishResponse;
using Domain.Entities;
using Application.Exceptions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Models.Request.DishRequest;

namespace Application.Services.DishServices
{
    public class CreateDishService : ICreateDishService
    {
        private readonly IDishCommand _command;
        private readonly IDishQuery _query;
        private readonly ICategoryQuery _categoryQuery;

        public CreateDishService (IDishCommand command, IDishQuery query, ICategoryQuery categoryQuery)
        {
            _command = command;
            _query = query;
            _categoryQuery = categoryQuery;
        }

        public async Task<DishResponse?> CreateDish(DishRequest dishRequest)
        {
            if (dishRequest == null)
                throw new BadRequestException("Los datos del plato son obligatorios.");
            if (string.IsNullOrWhiteSpace(dishRequest.Name))
                throw new BadRequestException("El nombre del plato es obligatorio.");
            if (dishRequest.Category == 0)
                throw new BadRequestException("La categoria es obligatoria.");
            if (dishRequest.Price <= 0)
                throw new BadRequestException("El precio debe ser mayor a cero.");

            var category = await _categoryQuery.GetCategoryById(dishRequest.Category);
            if (category == null)
            {
                throw new BadRequestException($"Categoria con ID {dishRequest.Category} no encontrada.");
            }

            var existingDish = await _query.DishExists(dishRequest.Name);
            if (existingDish)
            {
                throw new ConflictException("Ya existe un plato con ese nombre");
            }

			var dish = new Dish
			{
				Name = dishRequest.Name,
				Description = dishRequest.Description,
				Price = dishRequest.Price,
                CategoryId = dishRequest.Category,
                Available = true,
				ImageUrl = dishRequest.Image,
				CreateDate = DateTime.Now,
				UpdateDate = DateTime.Now,
			};
			var creadorDish = await _command.InsertDish(dish);
			return new DishResponse
			{
				id = creadorDish.DishId,
				name = creadorDish.Name,
				description = creadorDish.Description,
				price = creadorDish.Price,
				isActive = creadorDish.Available,
				image = creadorDish.ImageUrl,
				category = new GenericResponse { Id = creadorDish.CategoryId, Name = category.Name },
				createdAt = creadorDish.CreateDate,
				updatedAt = creadorDish.UpdateDate
			};
        }
    }
}
