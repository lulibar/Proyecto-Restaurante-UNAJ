using Application.Interfaces.ICategory;
using Application.Interfaces.ICategory.ICategoryServices;
using Application.Interfaces.IDeliveryType;
using Application.Interfaces.IDeliveryType.IDeliveryTypeServices;
using Application.Interfaces.IDish;
using Application.Interfaces.IDish.IDishServices;
using Application.Interfaces.IOrder;
using Application.Interfaces.IOrder.IOrderService;
using Application.Interfaces.IOrder.IOrderServices;
using Application.Interfaces.IOrderItem;
using Application.Interfaces.IOrderItem.IOrderItemService;
using Application.Interfaces.IStatus;
using Application.Interfaces.IStatus.IStatusServices;
using Application.Services;
using Application.Services.CategoryServices;
using Application.Services.DeliveryTypeServices;
using Application.Services.DishServices;
using Application.Services.OrderServices;
using Application.Services.StatusServices;
using Asp.Versioning;
using Asp.Versioning.ApiExplorer;
using Infrastructure.Command;
using Infrastructure.Data;
using Infrastructure.Querys;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Models;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Configurar EF Core con SQL Server
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          policy.WithOrigins("*") // Permite cualquier origen
                                .AllowAnyHeader()
                                .AllowAnyMethod();
                      });
});

//INJECTIONS
//builder Dish
builder.Services.AddScoped<IDishCommand, DishCommand>();
builder.Services.AddScoped<IDishQuery, DishQuery>();
builder.Services.AddScoped<ICreateDishService, CreateDishService>();
builder.Services.AddScoped<IGetDishByIdService, GetDishByIdService>();
builder.Services.AddScoped<ISearchAsyncService, SearchAsyncService>();
builder.Services.AddScoped<IUpdateDishService, UpdateDishService>();
builder.Services.AddScoped<IDeleteDishService, DeleteDishService>();

//builder Category
builder.Services.AddScoped<ICategoryCommand, CategoryCommand>();
builder.Services.AddScoped<ICategoryQuery, CategoryQuery>();
builder.Services.AddScoped<ICategoryExists, CategoryExists>();
builder.Services.AddScoped<IGetAllCategoriesService, GetAllCategoriesService>();

//builder Order
builder.Services.AddScoped<IOrderCommand, OrderCommand>();
builder.Services.AddScoped<IOrderQuery, OrderQuery>();
builder.Services.AddScoped<ICreateOrderService, CreateOrderService>();
builder.Services.AddScoped<IDeliveryExists, DeliveryExists>();
builder.Services.AddScoped<IGetOrderByDateStatus, GetOrderByDateStatusService>();
builder.Services.AddScoped<IUpdateOrderService, UpdateOrderService>();
builder.Services.AddScoped<IGetOrderByIdService, GetOrderByIdService>();
builder.Services.AddScoped<IUpdateOrderItemStatusService, UpdateOrderItemStatusService>();


//builder DeliveryType
builder.Services.AddScoped<IDeliveryTypeQuery, DeliveryTypeQuery>();
builder.Services.AddScoped<IGetAllDeliveryTypesService, GetAllDeliveryTypesService>();

//builder OrderItem
builder.Services.AddScoped<IOrderItemCommand, OrderItemCommand>();
builder.Services.AddScoped<IOrderItemQuery, OrderItemQuery>();

//builder Status
builder.Services.AddScoped<IGetAllStatusesService, GetAllStatusesService>();
builder.Services.AddScoped<IStatusQuery, StatusQuery>();

//
builder.Services.AddControllers();


builder.Services.AddApiVersioning(options =>
{
    options.DefaultApiVersion = new ApiVersion(1, 0);
    options.AssumeDefaultVersionWhenUnspecified = true;
    options.ReportApiVersions = true;
    options.ApiVersionReader = new UrlSegmentApiVersionReader();
}).AddApiExplorer(options =>
{
    options.GroupNameFormat = "'v'VVV";
    options.SubstituteApiVersionInUrl = true;
});


// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "ProyectoRestaurante",
        Version = "v1",
        Description = "API para la gestión de platos en un restaurante",
        Contact = new Microsoft.OpenApi.Models.OpenApiContact
        {
            Name = "Restaurant API Support",
            Email = "luliiibar@gmail.com"
        }
    });
    var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFilename);
    c.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));
    c.IncludeXmlComments(xmlPath);
    
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();

    // ? CONFIGURA LA UI DE SWAGGER PARA MOSTRAR LAS VERSIONES
    app.UseSwaggerUI(options =>
    {
        var provider = app.Services.GetRequiredService<IApiVersionDescriptionProvider>();
        // Crea un endpoint en la UI por cada versión de la API
        foreach (var description in provider.ApiVersionDescriptions)
        {
            options.SwaggerEndpoint(
                $"/swagger/{description.GroupName}/swagger.json",
                description.GroupName.ToUpperInvariant());
        }
    });
}

app.UseHttpsRedirection();

app.UseCors(MyAllowSpecificOrigins);

app.UseAuthorization();

app.MapControllers();

app.Run();