using Application.Models.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces.IStatus.IStatusServices
{
    public interface IGetAllStatusesService
    {
        Task<List<GenericResponse>> GetAllStatus();

    }
}
