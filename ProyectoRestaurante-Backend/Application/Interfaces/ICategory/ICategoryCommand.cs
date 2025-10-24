using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces.ICategory
{
    public interface ICategoryCommand
    {
        Task InsertCategory(Category Category);
        Task UpdateCategory(Category Category);
        Task DeleteCategory(Category Category);
    }
}
