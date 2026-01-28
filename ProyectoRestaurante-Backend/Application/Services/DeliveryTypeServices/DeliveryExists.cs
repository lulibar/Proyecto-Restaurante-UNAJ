using Application.Interfaces.ICategory;
using Application.Interfaces.IDeliveryType;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services.DeliveryTypeServices
{
    public class DeliveryExists : IDeliveryExists
    {
        private readonly IDeliveryTypeQuery _deliveryTypeQuery;

        public DeliveryExists (IDeliveryTypeQuery deliveryType)
        {
            _deliveryTypeQuery = deliveryType;  
        }

        public async Task <bool> DeliveryExist(int id)
        {
            var delivery = await _deliveryTypeQuery.DeliveryExistAsync(id);
            return delivery;
        }
    }
}
