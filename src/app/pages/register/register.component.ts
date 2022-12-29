import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private fb: FormBuilder, public userService: UserService, private router: Router, private snackbar: MatSnackBar) { }

  ngOnInit(): void {
    if(this.userService.user == null){
      let user_str = localStorage.getItem("user");
      if(user_str != null){
        this.userService = JSON.parse(user_str);
        this.router.navigate(['/posts']);
      }
    }
  }

  registerForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]], 
    username: ['', [Validators.required, Validators.maxLength(10)]], 
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  create(){
    this.userService.getUser(this.registerForm.controls['email'].value).then((res:any) => {
        console.log(res)
        if(res.length == 0){
          this.userService.createNewUser(this.registerForm.value).then((res) => {
              console.log(res)
              this.userService.user = res;
              this.snackbar.open("Account created successfully", "ok");
              localStorage.setItem("user", JSON.stringify(res));
              this.router.navigate(['/posts']);
            }).catch((err) => {
              console.log(err);
            });
        }
        else{
          this.snackbar.open("Account already exists.", "ok")
        }
    }).catch((err) => {
      console.log(err);
    });
    // this.userService.createNewUser(this.registerForm.value).then((res) => {
    //   console.log(res)
    // }).catch((err) => {
    //   console.log(err);
    // });
  }

}
