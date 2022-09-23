using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelBooking.Models
{
    //-- In DB with table name: Reservations
    [Table("Reservations")]
    public class Reservation
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Client is required")]
        public int ClientId { get; set; }

        [Required(ErrorMessage = "Room is required")]
        public int RoomId { get; set; }

        [Required(ErrorMessage = "Reservation Date is required")]
        /* Format date in model
        [JsonIgnore]
        public DateTime MyDate { get; set; }

        [JsonProperty("Date")]
        public string CustomDate {
            get { return MyDate.ToString("dd-MM-yyyy"); }
            // set { MyDate = DateTime.Parse(value); }
            set { MyDate = DateTime.ParseExact(value, "dd-MM-yyyy", null); }
        } */
        public DateTime Date { get; set; }

        [Required(ErrorMessage = "No Days is required")]
        // [Range(1, 5, ErrorMessage="Enter value between 1 and 5")]
        // [Range(1, 5, ErrorMessage = "Value for {0} must be between {1} and {2}.")]
        [Range(1, int.MaxValue, ErrorMessage = "Enter No Days grater than 0.")]
        public int NoDays { get; set; }

        [Required(ErrorMessage = "No Persons is required")]
        [Range(1, int.MaxValue, ErrorMessage = "Enter No Persons grater than 0.")]
        public int NoPersons { get; set; }

        //-- Create reference to Clients table for the FK ClientId from Clients that is Id
        public virtual Client Clients { get; set; }
        //-- Create reference to Rooms table for the FK RoomId from Rooms that is Id
        public virtual Room Rooms { get; set; }       

    }
}
