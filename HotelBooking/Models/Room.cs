using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelBooking.Models
{
    //-- In DB with table name: Rooms
    [Table("Rooms")]
    public class Room
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Name is required.")]
        [StringLength(100)]
        public string Name { get; set; }

        [Required(ErrorMessage = "Is View is required.")]
        // [Range(0, 1, ErrorMessage = "Value for Is View must be between {1} and {2}.")]
        public Boolean IsView { get; set; }

        [Required(ErrorMessage = "Floor is required.")]
        [Range(1, int.MaxValue, ErrorMessage = "Enter Floor grater than 0.")]
        public int Floor { get; set; }

        [Required(ErrorMessage = "No Places is required.")]
        // [Range(1,5, ErrorMessage="Enter value between 1 and 5")]
        // [Range(1, 5, ErrorMessage = "Value for {0} must be between {1} and {2}.")]
        [Range(1, int.MaxValue, ErrorMessage = "Enter No Places grater than 0.")]        
        public int NoPlaces { get; set; }

        [Required(ErrorMessage = "Category is required.")]
        public int CategoryId { get; set; }

        public string Note { get; set; }

        //-- Create reference to Categories table for the FK CategoryId from Categories that is Id
        public virtual Category Categories { get; set; }
    }
}