using Application.Models.Request.DishRequest;
using Application.Models.Response.DishResponse;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces.IDish.IDishServices
{
    public interface ICreateDishService
    {
        Task<DishResponse?> CreateDish(DishRequest dishRequest);
    }
}
