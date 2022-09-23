import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { CategoriesService } from '../categories.service';
import { Category } from '../category';

import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';

/*
interface Category {
  Id: number;
  Name: string;
  Price: number;
}
*/

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  dataSaved = false;
  categoryForm: any;
  allCategories: Observable<Category[]>;
  dataSource: MatTableDataSource<Category>;
  //dataSource!: MatTableDataSource<any>;

  selection = new SelectionModel<Category>(true, []);
  categoryIdUpdate = null;
  massage = null;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  displayedColumns: string[] = ['select', 'Name', 'Price', 'Edit', 'Delete'];

  // query results available in ngOnInit
  //@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  // or query results available in ngAfterViewInit
  //@ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;  

  constructor(private formbulider: FormBuilder, private categoriesService: CategoriesService, private _snackBar: MatSnackBar, public dialog: MatDialog) {
      this.categoriesService.getAllCategories().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;      
    });
    
  }

  ngOnInit() {  
    /*
    this.categoryService.getCategories().subscribe((response) => {
      console.log('response is #1 ' + JSON.stringify(response));
    });
    */

    this.categoryForm = this.formbulider.group({
      Name: ['', [Validators.required, Validators.minLength(2)]],
      Price: ['', [Validators.required, Validators.min(10)]]
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
  checkboxLabel(row: Category): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.Id + 1}`;
  }

  DeleteData() {
    //debugger;
    const numSelected = this.selection.selected;
    if (numSelected.length > 0) {
      if (confirm("Are you sure to delete items?")) {
        this.categoriesService.deleteRecords(numSelected).subscribe(result => {
          this.SavedOk(2);
          this.loadAllCategories();
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

  loadAllCategories() {
    this.categoriesService.getAllCategories().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  onFormSubmit() {
    this.dataSaved = false;
    const category = this.categoryForm.value;
    this.CreateCategory(category);
    this.categoryForm.reset();
  }

  loadCategoryToEdit(categoryId: string) {
    this.categoriesService.getCategoryById(categoryId).subscribe(category => {      
      this.massage = null;
      this.dataSaved = false;
      this.categoryIdUpdate = category.Id;
      this.categoryForm.controls['Name'].setValue(category.Name);
      this.categoryForm.controls['Price'].setValue(category.Price);
    });

  }
  CreateCategory(category: Category) {    
    if (this.categoryIdUpdate == null) {
      this.categoriesService.createCategory(category).subscribe(
        () => {
          this.dataSaved = true;
          this.SavedOk(1);
          this.loadAllCategories();
          this.categoryIdUpdate = null;
          this.categoryForm.reset();
        }
      );
    } else {
      category.Id = this.categoryIdUpdate;
      this.categoriesService.updateCategory(category.Id.toString(), category).subscribe(() => {
        this.dataSaved = true;
        this.SavedOk(0);
        this.loadAllCategories();
        this.categoryIdUpdate = null;
        this.categoryForm.reset();
      });
    }
  }
  deleteCategory(categoryId: string) {
    if (confirm("Are you sure you want to delete this?")) {
      this.categoriesService.deleteCategoryById(categoryId).subscribe(() => {
        this.dataSaved = true;
        this.SavedOk(2);
        this.loadAllCategories();
        this.categoryIdUpdate = null;
        this.categoryForm.reset();

      });
    }
  }
    
  resetForm() {
    this.categoryForm.reset();
    this.massage = null;
    this.dataSaved = false;    
    this.loadAllCategories();
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
