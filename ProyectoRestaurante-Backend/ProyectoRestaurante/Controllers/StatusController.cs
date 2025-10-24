using Application.Interfaces.IStatus;
using Application.Interfaces.IStatus.IStatusServices;
using Asp.Versioning;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace ProyectoRestaurante.Controllers
{
    [ApiController]
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiVersion("1.0")]
    public class StatusController : ControllerBase
    {
        private readonly IGetAllStatusesService _getAllStatusService;

        public StatusController(IGetAllStatusesService getAllStatusService)
        {
            _getAllStatusService = getAllStatusService;
        }

        // GET
        /// <summary>
        /// Obtener estados de órdenes
        /// </summary>
        /// <remarks>
        /// Obtiene todos los estados posibles para las órdenes y sus items.
        /// 
        /// **Estados típicos:**
        /// - Pendiente: orden recién creada
        /// - En preparación: cocina comenzó a preparar
        /// - Listo: orden lista para entregar
        /// - Entregado: orden completada
        /// - Cancelado: orden cancelada
        /// 
        ///</remarks>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _getAllStatusService.GetAllStatus();
            return Ok(result);
        }
    }
}