using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web;
using System.Web.UI.WebControls;
using MLSAbout.Models;

namespace MLSAbout.Services
{
    public class DataObject
    {
        public string Name { get; set; }
    }

    public class AuthenticationService
    {
        private const string webAPIURL = "https://localhost:8002";

        public AuthenticationService()
        {
            
        }

        public static string Login(LoginModel model)
        {
            string result = string.Empty;
            using (var client = new HttpClient())
            { 
                client.BaseAddress =new Uri(webAPIURL);

                // Add an Accept header for JSON format.
                client.DefaultRequestHeaders.Accept.Add(
                new MediaTypeWithQualityHeaderValue("application/json"));

                // List data response.
                HttpResponseMessage  response = client.PostAsJsonAsync("/Services/AuthenticationService/Login",model).Result;  // Blocking call!
                if (response.IsSuccessStatusCode)
                {
                    // Parse the response body. Blocking!
                    var dataObjects = response.Content.ReadAsAsync<IEnumerable<DataObject>>().Result;

                    foreach (var d in dataObjects)
                    {
                        result = string.Format("{0}", d.Name);
                    }
                }
                else
                {
                    result = string.Format("{0} ({1})", (int)response.StatusCode, response.ReasonPhrase);
                }  
            }
            return result;
        }
    }
}