import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { stringify } from 'querystring';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  constructor(private fb: FormBuilder, public userService: UserService, private snackBar: MatSnackBar, private router: Router) { }

  ngOnInit(): void {
    if(this.userService.user == null){
      let user_str = localStorage.getItem("user");
      if(user_str != null){
        this.userService = JSON.parse(user_str);
        this.router.navigate(['/posts']);
      }
    }
  }

  loginForm:FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]], 
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  login(){
    this.userService.getUser(this.loginForm.controls['email'].value).then((res:any) => {
      console.log(res);
      if(res.length == 0){
        this.snackBar.open("Account does not exist.", "ok");
      }
      else{
        if(res[0].password === this.loginForm.value.password){
          this.snackBar.open("Login successful.", "ok");
          this.userService.user = res[0];
          localStorage.setItem('user', JSON.stringify(res[0]))
          this.router.navigate(['/posts']);
        }
        else{
          this.snackBar.open("Incorrect password.", "ok");
        }
      }
    })
    .catch((err) => {
      console.log(err);
    });
  }

}
