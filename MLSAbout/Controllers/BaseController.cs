using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using MLSAbout.Models;
using MLSAbout.Services;

namespace App.MLSAbout.Controllers
{
    public class BaseController : ApiController
    {
        // GET api/<controller>
        public string Get(LoginModel model)
        {
            return AuthenticationService.Login(model);
        }

        // GET api/<controller>/5
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<controller>
        public void Post([FromBody]string value)
        {
        }

        // PUT api/<controller>/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/<controller>/5
        public void Delete(int id)
        {
        }
    }
}