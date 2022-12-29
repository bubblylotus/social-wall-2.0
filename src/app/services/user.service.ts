import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { promises } from 'dns';

@Injectable({
  providedIn: 'root'
})
export class UserService {

user:any;

  constructor(private httpClient: HttpClient) { }


  // create user
  // public to access outside of this clas
  public createNewUser(dataObj: any){
    return new Promise((resolve, reject) => {
        this.httpClient.post('http://localhost:3000/users', dataObj).subscribe((res) => {
          resolve(res);
        }, 
        (err) => {
          reject(err);
        }
        );
    });
  }

  public getUser(email: string){
    return new Promise((resolve, reject) => {
      this.httpClient.get('http://localhost:3000/users?email=' + email).subscribe((res) => {
        resolve(res);
      }, 
      (err) => {
        reject(err);
      });
    });
  }

}


