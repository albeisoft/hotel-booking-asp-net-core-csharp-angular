import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { RoomsService } from '../rooms.service';
import { Room } from '../room';

import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';

interface Category {
  Id: number;
  Name: string;
}

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})

export class RoomsComponent implements OnInit {
  dataSaved = false;
  form: any;
  all: Observable<Room[]>;
  dataSource: MatTableDataSource<Room>;

  selection = new SelectionModel<Room>(true, []);
  idUpdate = null;
  massage = null;

  allCategories: Observable<Category[]>;
  categoryId = null;
  // access checkbox dynamic by variable boolIsView set form material ui mat-checkbox control [checked]="boolIsView"
  // or input checkbox [(ngModel)] = "boolIsView"
  //boolIsView = false;

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  displayedColumns: string[] = ['select', 'Name', 'IsView', 'Floor', 'NoPlaces', 'CategoryName', 'Edit', 'Delete'];

  // query results available in ngOnInit
  //@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  // or query results available in ngAfterViewInit
  //@ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private formbulider: FormBuilder, private roomsService: RoomsService, private _snackBar: MatSnackBar, public dialog: MatDialog) {
        this.roomsService.getAll().subscribe(data => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;          
      });      
  }

  ngOnInit() {   

    this.form = this.formbulider.group({
      Name: ['', [Validators.required, Validators.minLength(2)]],
      // Validators.pattern('[1-9][0-9]*') a number that start from 1
      CategoryId: ['', [Validators.required, Validators.pattern('[1-9][0-9]*')]],
      //IsView: ['', [Validators.required]],
      IsView: [''],
      Floor: ['', [Validators.required, Validators.min(1)]],
      NoPlaces: ['', [Validators.required, Validators.min(1)]],      
      Note: ['']
    });
        
    // this.form.markAllAsTouched();
   
    // Fill Category Drop Down List - Form select menu
    this.FillCategoryDDL();
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
  checkboxLabel(row: Room): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.Id + 1}`;
  }

  DeleteData() {    
    const numSelected = this.selection.selected;
    if (numSelected.length > 0) {
      if (confirm("Are you sure to delete items?")) {
        this.roomsService.deleteRecords(numSelected).subscribe(result => {
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
    this.roomsService.getAll().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  onFormSubmit() {
    this.dataSaved = false;
    const room = this.form.value;
    this.Create(room);    
    //this.form.markAllAsTouched();
    this.form.reset();    
  }
  
  loadToEdit(roomId: string) {
    this.roomsService.getById(roomId).subscribe(room => {
      this.massage = null;
      this.dataSaved = false;
      this.idUpdate = room.Id;
      this.form.controls['Name'].setValue(room.Name);
      this.form.controls['CategoryId'].setValue(room.CategoryId);
      this.form.controls['IsView'].setValue(room.IsView);
      this.form.controls['Floor'].setValue(room.Floor);
      this.form.controls['NoPlaces'].setValue(room.NoPlaces);
      this.form.controls['Note'].setValue(room.Note);      
    });
    
  }

  Create(room: Room) {
    if (this.idUpdate == null) {
      this.roomsService.create(room).subscribe(
        () => {
          this.dataSaved = true;
          this.SavedOk(1);
          this.loadAll();
          this.idUpdate = null;              
          this.form.reset();
        }
      );
    } else {
      room.Id = this.idUpdate;      
      this.roomsService.update(room.Id.toString(), room).subscribe(() => {
        this.dataSaved = true;
        this.SavedOk(0);
        this.loadAll();
        this.idUpdate = null;        
        this.form.reset();       
      });
    }
  }

  delete(roomId: string) {
    if (confirm("Are you sure you want to delete this?")) {
      this.roomsService.deleteById(roomId).subscribe(() => {
        this.dataSaved = true;
        this.SavedOk(2);
        this.loadAll();
        this.idUpdate = null;        
        this.form.reset();
      });
    }
  }
  
  FillCategoryDDL() {
    this.allCategories = this.roomsService.getAllCategories();    
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
