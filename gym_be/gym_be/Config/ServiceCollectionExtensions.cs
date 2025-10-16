using Microsoft.Extensions.DependencyInjection;
using System.Reflection;

namespace gym_be.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static void AddRepositoriesAndServices(this IServiceCollection services)
        {
            var assemblies = new[] { Assembly.GetExecutingAssembly() };

            // Đăng ký tất cả Interface có tên bắt đầu bằng "I" và class tương ứng
            foreach (var type in assemblies.SelectMany(a => a.GetTypes()))
            {
                if (!type.IsInterface || !type.Name.StartsWith("I")) continue;

                var impl = assemblies.SelectMany(a => a.GetTypes())
                    .FirstOrDefault(t => t.IsClass && !t.IsAbstract && type.IsAssignableFrom(t));

                if (impl != null)
                {
                    services.AddScoped(type, impl);
                }
            }
        }
    }
}
