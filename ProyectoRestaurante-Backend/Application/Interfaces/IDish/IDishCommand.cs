using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces.IDish
{
    public interface IDishCommand
    {
        Task<Dish> InsertDish(Dish Dish);
        Task UpdateDish(Dish Dish);

    }
}
