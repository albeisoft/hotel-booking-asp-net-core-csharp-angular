using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelBooking.Models
{
    //-- In DB with table name: Categories
    [Table("Categories")]
    public class Category
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Name is required.")]
        //[StringLength(100)]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "{0} length must be between {2} and {1}.")]
        public string Name { get; set; }

        // [JsonProperty("categoryPrice")]
        [Required(ErrorMessage = "Price is required.")]
        // [Range(1, 5, ErrorMessage="Enter value between 1 and 5")]
        // [Range(1, 5, ErrorMessage = "Value for {0} must be between {1} and {2}.")]
        [Range(10, int.MaxValue, ErrorMessage = "Enter Price grater than 9.")]
        public int Price { get; set; }
    }
}
