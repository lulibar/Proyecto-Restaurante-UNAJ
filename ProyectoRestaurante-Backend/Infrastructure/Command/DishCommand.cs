using Application.Interfaces.IDish;
using Domain.Entities;
using Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Command
{
    public class DishCommand : IDishCommand
    {
        private readonly AppDbContext _context;

        public DishCommand(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Dish> InsertDish(Dish dish)
        {
            _context.Dishes.Add(dish);
            await _context.SaveChangesAsync();
            return dish;
        }

        public async Task UpdateDish(Dish dish)
        {
            _context.Update(dish);
            await _context.SaveChangesAsync();
        }
    }

}
