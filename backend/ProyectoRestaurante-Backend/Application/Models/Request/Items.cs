using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Models.Request
{
    public class Items
    {
        [Required(ErrorMessage = "El ID del plato es requerido.")]
        public Guid id { get; set; } //id del dish

        [Required(ErrorMessage = "La cantidad es requerida.")]
        [Range(0, 100, ErrorMessage = "La cantidad por ítem debe ser entre 0 y 100.")]
        public int quantity { get; set; }

        [StringLength(250, ErrorMessage = "Las notas del ítem no pueden superar los 250 caracteres.")]
        public string? notes { get; set; }
    }
}
