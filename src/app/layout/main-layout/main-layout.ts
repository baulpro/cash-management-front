import { Component } from '@angular/core';
import { Sidebar } from "../sidebar/sidebar";
import { Modal } from '../../shared/components/modal/modal';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  imports: [Sidebar, RouterOutlet, Modal],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout { }
