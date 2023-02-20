import { Component, OnInit } from '@angular/core';
import { SignalRService } from '../signal-r.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public signalRService: SignalRService) { }

  ngOnInit(): void {
  }

}
