using Application.Enums;
using Application.Interfaces.IDish;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Querys
{
    public class DishQuery : IDishQuery
    {
            private readonly AppDbContext _context;
        public DishQuery(AppDbContext context)
        {
            _context = context;
        }

        public async Task<bool> DishExists(string name, Guid? idToExclude = null)
        {
            var query = _context.Dishes.AsQueryable();
            if (idToExclude.HasValue)
            {
                
                query = query.Where(d => d.DishId != idToExclude.Value);
            }
            return await query.AnyAsync(d => d.Name == name);
        }

        public async Task<IEnumerable<Dish>> GetAllAsync(string? name = null, int? category = null, bool? onlyActive = null, SortOrder? priceOrder = SortOrder.ASC)
        {
            var query = _context.Dishes.AsNoTracking().AsQueryable();

            if (!string.IsNullOrWhiteSpace(name))
            {
                query = query.Where(d => d.Name.Contains(name));
            }

            if (category.HasValue)
            {
                query = query.Where(d => d.CategoryId == category.Value);
            }

            if (onlyActive.HasValue && onlyActive.Value)
            {
                query = query.Where(d => d.Available == true);
            }

            switch (priceOrder)
            {
            case SortOrder.ASC:
                query = query.OrderBy(d => d.Price);
                break;
            case SortOrder.DESC:
                query = query.OrderByDescending(d => d.Price);
                break;
            default:
                throw new InvalidOperationException("Valor de ordenamiento inválido");

            }

            return await query.Include(d => d.Category).ToListAsync();

        }

        public async Task<List<Dish>> GetAllDishes()
        {
            return await _context.Dishes.ToListAsync();
        }
        public async Task<Dish?> GetDishById(Guid id)
        {
            return await _context.Dishes.FindAsync(id).AsTask();
        }

        public async Task<List<Dish>> GetDishesByIds(IEnumerable<Guid> ids)
        {
            return await _context.Dishes
            .Where(dish => ids.Contains(dish.DishId) && dish.Available == true)
            .ToListAsync(); 
        }
    }
    
}
