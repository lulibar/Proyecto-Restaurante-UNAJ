using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces.IDeliveryType;
using Domain.Entities;
using Infrastructure.Data;

namespace Infrastructure.Command
{
    public class DeliveryTypeCommand : IDeliveryTypeCommand
    {
        private readonly AppDbContext _context;
        public DeliveryTypeCommand(AppDbContext context)
        {
            _context = context;
        }
        public async Task InsertDeliveryType(DeliveryType deliveryType)
        {
            _context.DeliveryTypes.Add(deliveryType);
            await _context.SaveChangesAsync();
        }
        public async Task UpdateDeliveryType(DeliveryType deliveryType)
        {
            _context.DeliveryTypes.Update(deliveryType);
            await _context.SaveChangesAsync();
        }
        public async Task RemoveDeliveryType(DeliveryType deliveryType)
        {
            _context.DeliveryTypes.Remove(deliveryType);
            await _context.SaveChangesAsync();
        }
    }
}
