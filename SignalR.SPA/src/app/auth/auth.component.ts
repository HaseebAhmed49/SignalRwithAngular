import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SignalRService } from '../signal-r.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {
  

  constructor(public signalRService:SignalRService
    ) { }

  ngOnInit(): void {
    this.authMeListenerSuccess();
    this.authMeListenerFail();
  }

  ngOnDestroy(): void {
    this.signalRService.hubConnection?.off("authMeResponseSuccess");
    this.signalRService.hubConnection?.off("authMeResponseFail");
  }

  onSubmit(form:NgForm)
  {
    if(!form.valid){
      return;
    }

    this.authMe(form.value.userName, form.value.password);
    form.reset();
  }

  async authMe(user: string, pass: string){
    let personInfo = {userName: user, password: pass};

    await this.signalRService.hubConnection?.invoke("authMe", personInfo)
    .finally(() => {
      this.signalRService.toastr.info("Logging in Attempt...");
    })
    .catch(err => console.log(err));
  }

  private authMeListenerSuccess(){
    this.signalRService.hubConnection?.on("authMeResponseSuccess", (personInfo: any) => {
      console.log(personInfo);
      this.signalRService.personName = personInfo.name;
      this.signalRService.toastr.success("Login Successfull");
      this.signalRService.router.navigateByUrl("/home");
    });    
  }

  private authMeListenerFail(){
    this.signalRService.hubConnection?.on("authMeResponseFail", () => {
      this.signalRService.toastr.error("Wrong credential");
    });
  }
}
