using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.NetworkInformation;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces.IStatus
{
    public interface IStatusCommand
    {
        Task InsertStatus(Status status);
        Task UpdateStatus(Status status);
        Task RemoveStatus(Status status);
    }
}
