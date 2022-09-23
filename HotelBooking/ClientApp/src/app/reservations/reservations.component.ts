import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { ReservationsService } from '../reservations.service';
import { Reservation } from '../reservation';

import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';

import * as moment from 'moment';

interface Room {
  Id: number;
  Name: string;  
}

interface Client {
  Id: number;
  Name: string;
}

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css']
})
export class ReservationsComponent implements OnInit {

  dataSaved = false;
  form: any;
  all: Observable<Reservation[]>;
  dataSource: MatTableDataSource<Reservation>;

  selection = new SelectionModel<Reservation>(true, []);
  idUpdate = null;
  massage = null;

  allClients: Observable<Client[]>;
  allRooms: Observable<Room[]>;
  
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  displayedColumns: string[] = ['select', 'ClientName', 'RoomName', 'Date', 'NoDays', 'NoPersons', 'Edit', 'Delete'];

  // query results available in ngOnInit
  //@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  // or query results available in ngAfterViewInit
  //@ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  moment: any = moment;

  constructor(private formbulider: FormBuilder, private reservationsService: ReservationsService, private _snackBar: MatSnackBar, public dialog: MatDialog) {
    this.reservationsService.getAll().subscribe(data => {      
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  ngOnInit() {
    // Moment add '2' days to the current datetime
   // console.log(moment().add(2, 'd').format());

    this.form = this.formbulider.group({      
      // Validators.pattern('[1-9][0-9]*') a number that start from 1
      ClientId: ['', [Validators.required, Validators.pattern('[1-9][0-9]*')]],
      RoomId: ['', [Validators.required, Validators.pattern('[1-9][0-9]*')]],
      Date: ['', [Validators.required]],
      NoDays: ['', [Validators.required, Validators.min(1)]],
      NoPersons: ['', [Validators.required, Validators.min(1)]]      
    });

    // Fill Client Drop Down List - Form select menu
    this.FillClientDDL();
    // Fill Room Drop Down List - Form select menu
    this.FillRoomDDL();
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = !!this.dataSource && this.dataSource.data.length;
    return numSelected === numRows;
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(r => this.selection.select(r));
  }
  /** The label for the checkbox on the passed row */
  checkboxLabel(row: Reservation): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.Id + 1}`;
  }

  DeleteData() {
    const numSelected = this.selection.selected;
    if (numSelected.length > 0) {
      if (confirm("Are you sure to delete items?")) {
        this.reservationsService.deleteRecords(numSelected).subscribe(result => {
          this.SavedOk(2);
          this.loadAll();
        })
      }
    } else {
      alert("Select at least one row.");
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  loadAll() {
    this.reservationsService.getAll().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  onFormSubmit() {
    this.dataSaved = false;
    const reservation = this.form.value;
    this.Create(reservation);
    this.form.reset();
  }

  loadToEdit(reservationId: string) {
    this.reservationsService.getById(reservationId).subscribe(reservation => {
      this.massage = null;
      this.dataSaved = false;
      this.idUpdate = reservation.Id;      
      this.form.controls['ClientId'].setValue(reservation.ClientId);
      this.form.controls['RoomId'].setValue(reservation.RoomId);
      this.form.controls['Date'].setValue(reservation.Date);
      this.form.controls['NoDays'].setValue(reservation.NoDays);
      this.form.controls['NoPersons'].setValue(reservation.NoPersons);
    });

  }

  Create(reservation: Reservation) {
    if (this.idUpdate == null) {
      this.reservationsService.create(reservation).subscribe(
        () => {
          this.dataSaved = true;
          this.SavedOk(1);
          this.loadAll();
          this.idUpdate = null;
          this.form.reset();
        }
      );
    } else {
      reservation.Id = this.idUpdate;
      this.reservationsService.update(reservation.Id.toString(), reservation).subscribe(() => {
        this.dataSaved = true;
        this.SavedOk(0);
        this.loadAll();
        this.idUpdate = null;     
        this.form.reset();
      });
    }
  }

  delete(reservationId: string) {
    if (confirm("Are you sure you want to delete this?")) {
      this.reservationsService.deleteById(reservationId).subscribe(() => {
        this.dataSaved = true;
        this.SavedOk(2);
        this.loadAll();
        this.idUpdate = null;
        this.form.reset();
      });
    }
  }

  FillClientDDL() {
    this.allClients = this.reservationsService.getAllClients();
  }

  FillRoomDDL() {
    this.allRooms = this.reservationsService.getAllRooms();
  }

  resetForm() {
    this.form.reset();
    this.massage = null;
    this.dataSaved = false;
    this.loadAll();
  }

  SavedOk(isUpdate) {
    if (isUpdate == 0) {
      this._snackBar.open('Record updated!', 'Close', {
        duration: 2000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
    else if (isUpdate == 1) {
      this._snackBar.open('Record saved!', 'Close', {
        duration: 2000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
    else if (isUpdate == 2) {
      this._snackBar.open('Record deleted!', 'Close', {
        duration: 2000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
  }
}
