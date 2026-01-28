using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Models.Response.OrdersResponse
{
    public class OrderCreateResponse
    {
        public int orderNumber { get; set; }
        public decimal totalAmount { get; set; }
        public DateTime createdAt { get; set; }
    }
}
