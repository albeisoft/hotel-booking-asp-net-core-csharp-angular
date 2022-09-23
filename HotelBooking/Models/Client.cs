using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelBooking.Models
{
    //-- In DB with table name: Clients
    [Table("Clients")]
    public class Client
    {
        [Key]
        public int Id { get; set; }
        // [JsonProperty("clientName")]
        // [Required(ErrorMessage="Name is required"), MaxLength(100)]
        [Required(ErrorMessage = "Name is required.")]
        //[StringLength(100)]
        [StringLength(100, MinimumLength = 5, ErrorMessage = "{0} length must be between {2} and {1}.")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Identification is required.")] 
        [StringLength(15, ErrorMessage = "{0} length must be between {2} and {1} caracters.", MinimumLength = 10)]
        // Identification is a number that begin from 1
        [RegularExpression("([1-9][0-9]*)")]        
        public string Identification { get; set; }

        [Required(ErrorMessage = "Address is required.")]
        // [MaxLength(250)] - This will check only for max length if is grater than 250
        // On StringLength you can set minimum and maximum length
        // [StringLength(250, ErrorMessage = "{0} length must be between {2} and {1}.", MinimumLength = 5)]
        // The error message created StringLength would be: "Address length must be between 5 and 250."
        // [StringLength(250, MinimumLength = 5)] - Simplier without custom validation error message        
        [StringLength(250, ErrorMessage = "{0} length must be between {2} and {1} caracters.", MinimumLength = 10)]
        public string Address { get; set; }

        [Required(ErrorMessage = "Telephone is required.")]
        /* for numbers that need to start with a zero
        [RegularExpression("([0-9]+)")]
        // for numbers that begin from 1
        [RegularExpression("([1-9][0-9]*)")] */
        [StringLength(20)]
        [Phone]
        public string Telephone { get; set; }

        [Required(ErrorMessage = "Email is required.")]
        [StringLength(50)]
        [RegularExpression(@"^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$", ErrorMessage = "Your Email is not valid.")]
        // [EmailAddress]        
        public string Email { get; set; }     
    }
}
