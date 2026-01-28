using Application.Interfaces.IStatus;
using Application.Interfaces.IStatus.IStatusServices;
using Application.Models.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services.StatusServices
{
    public class GetAllStatusesService : IGetAllStatusesService
    {
        private readonly IStatusQuery _statusQuery;

        public GetAllStatusesService(IStatusQuery statusQuery)
        {
            _statusQuery = statusQuery;
        }

        public async Task<List<GenericResponse>> GetAllStatus()
        {
            var statuses = await _statusQuery.GetAllStatuses();

            // Mapeamos la entidad al GenericResponse
            return statuses.Select(s => new GenericResponse
            {
                Id = s.Id,
                Name = s.Name
            }).ToList();
        }

    }
}
