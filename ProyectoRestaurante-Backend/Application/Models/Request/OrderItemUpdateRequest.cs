using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Models.Request
{
    public class OrderItemUpdateRequest
    {
        [Required(ErrorMessage = "El nuevo estado es requerido.")]
        [Range(1, int.MaxValue, ErrorMessage = "El ID del estado no es válido.")]
        public int status { get; set; }
    }
}
