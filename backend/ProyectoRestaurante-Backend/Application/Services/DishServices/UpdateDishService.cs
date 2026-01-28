using Application.Exceptions;
using Application.Interfaces.ICategory;
using Application.Interfaces.IDish;
using Application.Interfaces.IDish.IDishServices;
using Application.Models.Request.DishRequest;
using Application.Models.Response;
using Application.Models.Response.DishResponse;
using Domain.Entities;
using Microsoft.AspNetCore.Http.HttpResults;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
using static System.Net.Mime.MediaTypeNames;

namespace Application.Services.DishServices
{
    public class UpdateDishService : IUpdateDishService
    {
        private readonly IDishCommand _dishCommand;
        private readonly IDishQuery _dishQuery;
        private readonly ICategoryQuery _categoryQuery;

        public UpdateDishService(IDishCommand command, IDishQuery query, ICategoryQuery categoryQuery)
        {
            _dishCommand = command;
            _dishQuery = query;
            _categoryQuery = categoryQuery;
        }

        public async Task<DishResponse> UpdateDish(Guid id, DishUpdateRequest dishRequest)
        {

            if (dishRequest == null)
                throw new BadRequestException("Los datos del plato son obligatorios.");
            if (string.IsNullOrWhiteSpace(dishRequest.Name))
                throw new BadRequestException("El nombre del plato es obligatorio.");
            if (dishRequest.Category == 0)
                throw new BadRequestException("La categoria es obligatoria.");
            if (dishRequest.Price <= 0)
                throw new BadRequestException("El precio debe ser mayor a cero.");


            var existingDish = await _dishQuery.GetDishById(id);

            if (existingDish == null)
            {
                throw new NotFoundException($"Plato con ID {dishRequest.Category} no encontrada.");
            }

            var category = await _categoryQuery.GetCategoryById(dishRequest.Category);
            if (category == null)
            {
                throw new BadRequestException($"Categoria con ID {dishRequest.Category} no encontrada.");
            }

            var alreadyExist = await _dishQuery.DishExists(dishRequest.Name, id);
            if (alreadyExist)
            {
                throw new ConflictException($"Plato con nombre '{dishRequest.Name}' ya existe.");
            }


            existingDish.Name = dishRequest.Name;
            existingDish.Description = dishRequest.Description;
            existingDish.Price = dishRequest.Price;
            existingDish.Available = dishRequest.IsActive;
            existingDish.ImageUrl = dishRequest.Image;
            existingDish.CategoryId = dishRequest.Category;
            existingDish.UpdateDate = DateTime.Now;

            await _dishCommand.UpdateDish(existingDish);


            return new DishResponse
            {
                id = existingDish.DishId,
                name = existingDish.Name,
                description = existingDish.Description,
                price = existingDish.Price,
                isActive = existingDish.Available,
                image = existingDish.ImageUrl,
                category = new GenericResponse { Id = existingDish.CategoryId, Name = category.Name },
                createdAt = existingDish.CreateDate,
                updatedAt = existingDish.UpdateDate
            };
        }
    }
}
