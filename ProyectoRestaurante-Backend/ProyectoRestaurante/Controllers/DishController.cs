using Application.Enums;
using Application.Exceptions;
using Application.Interfaces.ICategory;
using Application.Interfaces.IDish;
using Application.Interfaces.IDish.IDishServices;
using Application.Models.Request.DishRequest;
using Application.Models.Response;
using Application.Models.Response.DishResponse;
using Application.Services.DishServices;
using Asp.Versioning;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Swashbuckle.AspNetCore.Annotations;
using System.ComponentModel.DataAnnotations;


namespace ProyectoRestaurante.Controllers
{
    [Route("api/v{version:apiVersion}/[controller]")] 
    [ApiController]
    [ApiVersion("1.0")]
    public class DishController : ControllerBase
    {
        
        private readonly ICreateDishService _createDishService;
        private readonly ISearchAsyncService _searchAsyncService;
        private readonly IUpdateDishService _updateDishService;
        private readonly ICategoryExists _categoryExists;
        private readonly IDeleteDishService _deleteDishService;
        private readonly IGetDishByIdService _getDishByIdService; 


        public DishController(ICreateDishService createDishService, ISearchAsyncService searchAsyncService, IUpdateDishService updateDishService, 
            ICategoryExists categoryExists, IDeleteDishService deleteDishService, IGetDishByIdService getDishByIdService)
        {
            _createDishService = createDishService;
            _searchAsyncService = searchAsyncService;
            _updateDishService = updateDishService;
            _categoryExists = categoryExists;
            _deleteDishService = deleteDishService;
            _getDishByIdService = getDishByIdService;
        }

        // POST
        /// <summary>
        /// Crear nuevo plato
        /// </summary>
        /// <remarks>
        /// Crea un nuevo plato en el menú del restaurante.
        ///
        /// **Validaciones:**
        /// - El nombre del plato debe ser único
        /// - El precio debe ser mayor a 0
        /// - La categoría debe existir en el sistema
        ///
        /// **Casos de uso:**
        /// - Agregar nuevos platos al menú
        /// - Platos estacionales o especiales del chef
        /// </remarks>
        [HttpPost]
        [SwaggerOperation(
        Summary = "Crear nuevo plato",
        Description = "Crea un nuevo plato en el menú del restaurante.")]
        [ProducesResponseType(typeof(DishResponse), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ApiError), StatusCodes.Status409Conflict)]
        [ProducesResponseType(typeof(ApiError), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateDish([SwaggerRequestBody(
        Description = "Objeto JSON que representa un nuevo plato a agregar al menú.",
        Required = true)][FromBody][Required]DishRequest dishRequest)
        {

            try
            {
                var createdDish = await _createDishService.CreateDish(dishRequest);
                return CreatedAtAction(nameof(Search), new { id = createdDish.id }, createdDish);
            }
            catch (BadRequestException ex)
            {
                return BadRequest(new ApiError(ex.Message));
            }
            catch (ConflictException ex)
            {
                return Conflict(new ApiError(ex.Message));
            }
            

        }
        // GET
        /// <summary>
        /// Buscar platos
        /// </summary>
        /// <remarks>
        /// Obtiene una lista de platos del menú con **opciones de filtrado y ordenamiento**.
        /// 
        /// **Filtros disponibles:**
        /// - Por nombre (búsqueda parcial).
        /// - Por categoría.
        /// - Mostrar **solo platos activos** o **todos**.
        /// 
        /// **Ordenamiento:**
        /// - Por precio ascendente o descendente
        /// - Sin ordenamiento específico.
        /// 
        /// **Casos de uso:**
        /// - Mostrar el menú completo a los clientes.
        /// - Buscar platos específicos.
        /// - Filtrar por categorías (entrantes, principales, postres).
        /// - Administración del menú (incluyendo platos inactivos)
        /// </remarks>
        [HttpGet]
        [SwaggerOperation(
        Summary = "Buscar platos",
        Description = "Obtiene una lista de platos del menú con opciones de filtrado y ordenamiento.")]

        [ProducesResponseType(typeof(IEnumerable<DishResponse>), StatusCodes.Status200OK)]

        public async Task<IActionResult> Search([FromQuery] string? name, [FromQuery] int? category,[FromQuery] bool? onlyActive = null, [FromQuery] SortOrder? sortByPrice = SortOrder.ASC )
        {

            var list = await _searchAsyncService.SearchAsync(name, category, onlyActive, sortByPrice);
            return Ok(list);
        }

        // GET
        /// <summary>
        /// Obtener plato por ID
        /// </summary>
        /// <remarks>
        /// Obtiene los detalles completos de un plato específico.
        /// 
        /// **Casos de uso:**
        /// - Ver detalles de un plato antes de agregarlo a la orden
        /// - Mostrar información detallada en el menú
        /// - Verificación de disponibilidad
        /// 
        /// </remarks>
        [HttpGet("{id}")]
        [SwaggerOperation(
            Summary = "Obtener plato por ID",
            Description = "Obtiene los detalles completos de un plato específico.")]
        [ProducesResponseType(typeof(DishResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiError), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetById(Guid id)
        {
            try
            {
                var dish = await _getDishByIdService.GetDishById(id);
                return Ok(dish);
            }
            catch (NotFoundException ex)
            {
                return NotFound(new ApiError(ex.Message));
            }
        }

        // PUT
        /// <summary>
        /// Actualizar plato existente
        /// </summary>
        /// <remarks>
        /// Actualiza todos los campos de un plato existente en el menú.
        /// 
        /// **Validaciones:**
        /// - El plato debe existir en el sistema
        /// - Si se cambia el nombre, debe ser único
        /// - El precio debe ser mayor a 0
        /// - La categoría debe existir
        /// 
        /// **Casos de uso:**
        /// - Actualizar precios de platos.
        /// - Modificar descripciones o ingredientes.
        /// - Cambiar categorías de platos.
        /// - Activar/desactivar platos del menú.
        /// - Actualizar imágenes de platos.
        /// </remarks>
        [HttpPut("{id}")]
        [SwaggerOperation(
        Summary = "Actualizar plato existente",
        Description = "Actualiza todos los campos de un plato existente en el menú."
        )]
        [ProducesResponseType(typeof(DishResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiError), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiError), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiError), StatusCodes.Status409Conflict)]
        public async Task<IActionResult> UpdateDish(Guid id, [FromBody] DishUpdateRequest dishRequest)
        {
            try
            {
                var updatedDish = await _updateDishService.UpdateDish(id, dishRequest);
                return Ok(updatedDish);
            }
            catch (BadRequestException ex)
            {
                return BadRequest(new ApiError(ex.Message));
            }
            catch (NotFoundException ex)
            {
                return NotFound(new ApiError(ex.Message));
            }
            catch (ConflictException ex)
            {
                return Conflict(new ApiError(ex.Message));
            }

        }
        // DELETE
        /// <summary>
        /// Eliminar plato
        /// </summary>
        /// <remarks>
        /// Elimina un plato del menú del restaurante.
        /// 
        /// **Importante:**
        /// - Solo se pueden eliminar platos que no esten en ordenes activas
        /// - Típicamente se recomienda desactivar (isActive=false) en lugar de eliminar
        /// 
        /// **Casos de error 409:**
        /// - El plato está incluido en órdenes pendientes o en proceso
        /// - El plato tiene dependencias que impiden su eliminación
        /// 
        /// </remarks>
        [HttpDelete("{id:guid}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ApiError), StatusCodes.Status404NotFound)] 
        [ProducesResponseType(typeof(ApiError), StatusCodes.Status409Conflict)] 
        public async Task<IActionResult> DeleteDish(Guid id)
        {
            try
            {
                await _deleteDishService.DeleteDish(id);
                return NoContent();
            }
            catch (NotFoundException ex)
            {
                return NotFound(new ApiError(ex.Message));
            }
            catch (ConflictException ex)
            {
                return Conflict(new ApiError(ex.Message));
            }
        }






    }   


    
}




