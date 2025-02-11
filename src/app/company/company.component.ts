import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { companymodel } from '../Model/companymodel';
import { PopupComponent } from '../popup/popup.component';
import { ApiService } from '../shared/api.service';
import * as alertify from 'alertifyjs'
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {

  constructor(private dialog: MatDialog, private api: ApiService) { }
  @ViewChild(MatPaginator) _paginator!: MatPaginator;
  @ViewChild(MatSort) _sort!: MatSort;
  companydata!: companymodel[];
  finaldata: any;


  ngOnInit(): void {
    this.LoadCompany();
    this.dataSource.filterPredicate = this.filterPredicate;
  }

  displayColums: string[] = ["id", "name", "email", "Role", "isactive", "action"];

  dataSource = new MatTableDataSource<any>();

  searchQuery: string = '';

  Openpopup(id: any) {
    const _popup = this.dialog.open(PopupComponent, {
      width: '500px',
      exitAnimationDuration: '1000ms',
      enterAnimationDuration: '1000ms',
      data: {
        id: id
      }
    })
    _popup.afterClosed().subscribe(r => {
      this.LoadCompany();
    });
  }

  LoadCompany() {
    this.api.Getallcomapny().subscribe(response => {
      this.companydata = response;
      this.finaldata = new MatTableDataSource<companymodel>(this.companydata);
      this.finaldata.paginator = this._paginator;
      this.finaldata.sort = this._sort;
    });
  }

  EditCompany(id: any) {
    this.Openpopup(id);
  }
  RemoveCompany(id: any) {
    alertify.confirm("Remove Company", "do you want remove this company?", () => {
      this.api.RemoveCompanybycode(id).subscribe(r => {
        this.LoadCompany();
      });
    }, function () {

    })


  }

  onRoleChange(user: any) {
    this.api.UpdateComapny(user.id, user).subscribe(response => {
      console.log('User role updated successfully!', response);
    }, error => {
      console.error('Error updating role', error);
    });
  }


  applyFilter(filterValue: string): void {
    this.searchQuery = (filterValue || '').trim().toLowerCase();

    this.finaldata.filter = this.searchQuery;

    if (!filterValue) {
      this.finaldata.filter = '';
    }
  }



  filterPredicate = (data: any, filter: string) => {
    return data.name.toLowerCase().includes(filter) || data.email.toLowerCase().includes(filter);
  };

}
