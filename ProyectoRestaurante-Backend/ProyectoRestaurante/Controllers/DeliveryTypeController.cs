using Application.Interfaces.IDeliveryType.IDeliveryTypeServices;
using Asp.Versioning;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ProyectoRestaurante.Controllers
{
    [ApiController]
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiVersion("1.0")]
    public class DeliveryTypeController : ControllerBase
    {
        private readonly IGetAllDeliveryTypesService _getAllDeliveryTypesService;

        public DeliveryTypeController(IGetAllDeliveryTypesService getAllDeliveryTypesService)
        {
            _getAllDeliveryTypesService = getAllDeliveryTypesService;
        }

        // GET
        /// <summary>
        /// Obtener tipos de entrega
        /// </summary>
        /// <remarks>
        /// Obtiene todos los tipos de entrega disponibles para las órdenes.
        /// 
        /// **Casos de uso:**
        /// - Mostrar opciones de entrega al cliente durante el pedido
        /// - Configurar diferentes métodos de entrega
        /// - Calcular costos de envío según el tipo
        /// 
        ///</remarks>

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _getAllDeliveryTypesService.GetAllDeliveryTypes();
            return Ok(result);
        }
    }
}
