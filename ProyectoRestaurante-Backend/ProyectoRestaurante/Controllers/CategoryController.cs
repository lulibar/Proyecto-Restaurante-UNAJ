using Application.Interfaces.ICategory.ICategoryServices;
using Asp.Versioning;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ProyectoRestaurante.Controllers
{
    [ApiController]
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiVersion("1.0")]
    public class CategoryController : ControllerBase
    {
        private readonly IGetAllCategoriesService _getAllCategoriesService;

        public CategoryController (IGetAllCategoriesService getAllCategoriesService)
        {
            _getAllCategoriesService = getAllCategoriesService; 
        }

        // GET
        /// <summary>
        /// Obtener categorías de platos
        /// </summary>
        /// <remarks>
        /// Obtiene todas las categorías disponibles para clasificar platos.
        /// 
        /// **Casos de uso:**
        /// - Mostrar categorías en formularios de creación/edición de platos
        /// - Filtros de búsqueda en el menú
        /// - Organización del menú por secciones
        /// 
        ///</remarks>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var categories = await _getAllCategoriesService.GetAllCategories();
            return Ok(categories);
        }

    }
}
