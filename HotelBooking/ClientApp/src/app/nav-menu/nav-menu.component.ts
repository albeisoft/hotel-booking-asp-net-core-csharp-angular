//import { Component} from '@angular/core';

import { Component, OnInit } from '@angular/core';
import { AuthorizeService } from '../../api-authorization/authorize.service';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
//export class NavMenuComponent {
export class NavMenuComponent implements OnInit {
  isExpanded = false;
  //-- --//
  public isAuthenticated: Observable<boolean>;
  public userName: Observable<string>;

  constructor(private authorizeService: AuthorizeService) { }    

  ngOnInit() {
    this.isAuthenticated = this.authorizeService.isAuthenticated();
    this.userName = this.authorizeService.getUser().pipe(map(u => u && u.name));    
  }  
  //-- --//

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  } 
}
