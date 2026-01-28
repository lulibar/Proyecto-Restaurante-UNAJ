using Application.Models.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces.IDeliveryType.IDeliveryTypeServices
{
    public interface IGetAllDeliveryTypesService
    {
       Task<List<GenericResponse>> GetAllDeliveryTypes();
    }
}
