using Application.Interfaces.IDeliveryType;
using Application.Interfaces.IDeliveryType.IDeliveryTypeServices;
using Application.Models.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services.DeliveryTypeServices
{
    public class GetAllDeliveryTypesService : IGetAllDeliveryTypesService
    {
        private IDeliveryTypeQuery _deliveryTypeQuery;
        public GetAllDeliveryTypesService(IDeliveryTypeQuery deliveryTypeQuery)
        {
            _deliveryTypeQuery = deliveryTypeQuery;
        }

        public async Task<List<GenericResponse>> GetAllDeliveryTypes()
        {
            var deliveryTypes = await _deliveryTypeQuery.GetAllDeliveryTypes();

            return deliveryTypes.Select(dt => new GenericResponse
            {
                Id = dt.Id,
                Name = dt.Name
            }).ToList();
        }
    }
}
