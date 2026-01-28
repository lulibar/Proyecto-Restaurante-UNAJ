using Application.Models.Response.DishResponse;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Models.Response
{
    public class OrderItemResponse
    {
        public long id { get; set; }
        public int quantity { get; set; }
        public string? notes { get; set; }
        public GenericResponse status { get; set; }
        public DishShortResponse dish { get; set; }
    }
}
