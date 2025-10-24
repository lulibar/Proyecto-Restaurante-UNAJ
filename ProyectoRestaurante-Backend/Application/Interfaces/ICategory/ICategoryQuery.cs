using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Entities;

namespace Application.Interfaces.ICategory
{
    public interface ICategoryQuery
    {
        Task <Category?> GetCategoryById(int id);

        Task<List<Category>> GetAllCategories();

        Task<bool> CategoryExistAsync(int id);

    }
}
