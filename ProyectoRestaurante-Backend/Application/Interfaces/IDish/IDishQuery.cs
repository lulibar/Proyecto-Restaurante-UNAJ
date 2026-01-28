using Application.Enums;
using Application.Models.Response;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces.IDish
{
    public interface IDishQuery
    {     
        Task<List<Dish>> GetAllDishes();
        Task<Dish?> GetDishById(Guid id);
        Task<IEnumerable<Dish>> GetAllAsync(string? name = null, int? category = null, bool? onlyActive = null, SortOrder? priceOrder = SortOrder.ASC);
        Task<bool> DishExists(string name, Guid? idToExclude = null);
        Task<List<Dish>> GetDishesByIds(IEnumerable<Guid> ids);

    }
}

