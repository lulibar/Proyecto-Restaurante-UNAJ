using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Models.Response.OrdersResponse
{
    public class OrderDetailsResponse
    {
        public long orderNumber { get; set; }
        public decimal totalAmount { get; set; }
        public string? deliveryTo { get; set; }
        public string? notes { get; set; }

        public GenericResponse status { get; set; }
        public GenericResponse deliveryType { get; set; }

        public List<OrderItemResponse>? items { get; set; }

        public DateTime createdAt { get; set; }
        public DateTime? updatedAt { get; set; }

    }
}
