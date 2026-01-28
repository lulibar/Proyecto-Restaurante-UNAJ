using Application.Enums;
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
    public class SearchAsyncService : ISearchAsyncService
    {
        private readonly IDishCommand _command;
        private readonly IDishQuery _query;
        private readonly ICategoryQuery _categoryQuery;

        public SearchAsyncService(IDishCommand command, IDishQuery query, ICategoryQuery categoryQuery)
        {
            _command = command;
            _query = query;
            _categoryQuery = categoryQuery;
        }

        public async Task<IEnumerable<DishResponse>> SearchAsync(string? name, int? category, bool? onlyActive, SortOrder? priceOrder = SortOrder.ASC)
        {
            var list = await _query.GetAllAsync(name, category, onlyActive, priceOrder);
            return list.Select(dishes => new DishResponse
            {
                id = dishes.DishId,
                name = dishes.Name,
                description = dishes.Description,
                price = dishes.Price,
                category = new GenericResponse { Id = dishes.CategoryId, Name = dishes.Category?.Name },
                isActive = dishes.Available,
                image = dishes.ImageUrl,
                createdAt = dishes.CreateDate,
                updatedAt = dishes.UpdateDate
            }).ToList();
        }
    }
}
