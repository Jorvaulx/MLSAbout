using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MLSAbout.Models
{
    public class LoginModel
    {
        private string _username = string.Empty;
        private string _password = string.Empty;

        public string username { get; set; }
        public string password { get; set; }
    }
}