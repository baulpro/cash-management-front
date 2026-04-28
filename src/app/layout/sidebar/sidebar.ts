import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faUsers,
  faBuildingColumns,
  faMoneyBillTransfer,
  faChartLine
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, FontAwesomeModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {

  readonly menu = [
    { path: '/clients', label: 'Clients', icon: faUsers },
    { path: '/accounts', label: 'Accounts', icon: faBuildingColumns },
    { path: '/transactions', label: 'Transactions', icon: faMoneyBillTransfer },
    { path: '/reports', label: 'Reports', icon: faChartLine }
  ];

}
