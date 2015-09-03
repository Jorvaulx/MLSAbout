using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(MLSAbout.Startup))]
namespace MLSAbout
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
