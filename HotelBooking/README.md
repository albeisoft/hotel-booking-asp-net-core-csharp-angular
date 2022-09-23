Hotel Booking - ASP .NET Core with C# and SPA [Single Page Application] with Angular (hotel-booking-asp-net-core-csharp-angular) is a version of example of web application for Hotel Reservation (Hotel Booking) created on:
- back end (server side) with ASP .NET Core with C# and Web API (a framework that help to create and develop HTTP based RESTFUL services, Web Services), used ASP.NET Core Identity for authentication.
- front end (client side, browser side) with JavaScript and Angular that is an JavaScript Framework, Angular framework is embedded with original MVC [Model View Controller] but it's more of an MVVM [Model View ViewModel] software architectural setup; also used Angular Material UI: Material Data Table (better data table with filter, pagination, etc.), Material Date Picker (Date picker need in some forms), moment.js (for date formating and date processing with Angular).
- database: SQL Server. 

Installation

Clone the repository:

git clone https://github.com/albeisoft/hotel-booking-asp-net-core-csharp-angular.git

Then cd into the folder with this command:

cd hotel-booking-asp-net-core-csharp-angular/HotelBooking

Open solution HotelBooking.sln with Visual Studio

Then create a database named "Hotel" and then do a database migration using this two commands in Package Manager Console in Visual Studio:

add-migration Initial
update-database

Run server

Run server with <F5> to start IIS Express from Visual Studio or using this command in Visual Studio in a terminal (Developer PowerShell):

dotnet run

Run (compile) front end scripts

Run this command in a Visual Studio terminal (any change you make to the HTML, CSS, JavaScript, Angular code will be reflected immediately in the page you see in your browser):

ng serve

Then go to https://localhost:5001/ from your browser and see the web application (if you start with IIS Express will open automatically a web broser with link to the web application).