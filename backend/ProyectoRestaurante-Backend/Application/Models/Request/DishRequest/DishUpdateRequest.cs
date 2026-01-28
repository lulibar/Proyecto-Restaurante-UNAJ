using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Models.Request.DishRequest
{
    public class DishUpdateRequest
    {
        [Required(ErrorMessage = "El nombre del plato es requerido.")]
        [StringLength(255, ErrorMessage = "El nombre no puede tener más de 255 caracteres.")]
        public string Name { get; set; }

        [StringLength(500, ErrorMessage = "La descripción no puede superar los 500 caracteres.")]
        public string? Description { get; set; }

        public decimal Price { get; set; }

        public int Category { get; set; }

        public string? Image { get; set; }

        [Required(ErrorMessage = "Debe especificar si el plato está activo o no.")]
        public bool IsActive { get; set; }
    }
}
