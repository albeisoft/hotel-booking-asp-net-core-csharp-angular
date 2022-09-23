import { Component, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { ClientsService } from '../clients.service';
import { Client } from '../client';

import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})

export class ClientsComponent implements OnInit {
  dataSaved = false;
  form: any;
  all: Observable<Client[]>;
  dataSource: MatTableDataSource<Client>;  

  selection = new SelectionModel<Client>(true, []);
  idUpdate = null;
  massage = null;  
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  displayedColumns: string[] = ['select', 'Name', 'Telephone', 'Email', 'Address','Identification','Edit', 'Delete'];

  // query results available in ngOnInit
  //@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  // or query results available in ngAfterViewInit
  //@ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
    
  constructor(private formbulider: FormBuilder, private clientsService: ClientsService, private _snackBar: MatSnackBar, public dialog: MatDialog) {
        this.clientsService.getAll().subscribe(data => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;      
      });      
  }

  ngOnInit() {   
    
    this.form = this.formbulider.group({      
      Name: ['', [Validators.required, Validators.minLength(5), Validators.pattern('[a-zA-Z ]*')]],
      Telephone: ['', [Validators.required, Validators.pattern('[0-9]{10,15}')]],
      Email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,14}$")]],      
      Address: ['', [Validators.required, Validators.minLength(10)]],
      Identification: ['', [Validators.required, Validators.pattern('[1-9][0-9]{14}')]]
    });    
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
  checkboxLabel(row: Client): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.Id + 1}`;
  }

  DeleteData() {    
    const numSelected = this.selection.selected;
    if (numSelected.length > 0) {
      if (confirm("Are you sure to delete items?")) {
        this.clientsService.deleteRecords(numSelected).subscribe(result => {
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
    this.clientsService.getAll().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  onFormSubmit() {
    this.dataSaved = false;
    const client = this.form.value;
    this.Create(client);
    this.form.reset();
  }

  loadToEdit(clientId: string) {
    this.clientsService.getById(clientId).subscribe(client => {
      this.massage = null;
      this.dataSaved = false;
      this.idUpdate = client.Id;
      this.form.controls['Name'].setValue(client.Name);
      this.form.controls['Telephone'].setValue(client.Telephone);
      this.form.controls['Address'].setValue(client.Address);
      this.form.controls['Email'].setValue(client.Email);
      this.form.controls['Identification'].setValue(client.Identification);
    });
  }
  Create(client: Client) {
    if (this.idUpdate == null) {
      this.clientsService.create(client).subscribe(
        () => {
          this.dataSaved = true;
          this.SavedOk(1);
          this.loadAll();
          this.idUpdate = null;
          this.form.reset();
        }
      );
    } else {
      client.Id = this.idUpdate;
      this.clientsService.update(client.Id.toString(), client).subscribe(() => {
        this.dataSaved = true;
        this.SavedOk(0);
        this.loadAll();
        this.idUpdate = null;
        this.form.reset();
      });
    }
  }
  delete(clientId: string) {
    if (confirm("Are you sure you want to delete this?")) {
      this.clientsService.deleteById(clientId).subscribe(() => {
        this.dataSaved = true;
        this.SavedOk(2);
        this.loadAll();
        this.idUpdate = null;
        this.form.reset();
      });
    }
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
