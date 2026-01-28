using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Models.Response.OrdersResponse
{
    public class OrderUpdateResponse
    {
        public long OrderNumber { get; set; }
        public double TotalAmount { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
