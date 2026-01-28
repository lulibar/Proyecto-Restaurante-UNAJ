using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces.ICategory;
using Application.Interfaces.ICategory.ICategoryServices;
using Application.Models.Response;

namespace Application.Services.CategoryServices
{
    public class GetAllCategoriesService : IGetAllCategoriesService
    {
        private readonly ICategoryQuery _categoryQuery;

        public GetAllCategoriesService (ICategoryQuery categoryQuery)
        {
            _categoryQuery = categoryQuery;
        }
        public async Task<List<CategoryResponse>> GetAllCategories()
        {
            var categories = await _categoryQuery.GetAllCategories();

            return categories.Select(category => new CategoryResponse
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description,
                Order = category.Order
            }).ToList();
        }
    }
}
