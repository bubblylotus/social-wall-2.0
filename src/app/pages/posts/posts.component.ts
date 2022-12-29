import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  text ='';
  posts:Array<any> = [];
  commentText: Array<string> = [];

  constructor(public userService: UserService, private router: Router, public postService: PostService) { }

  ngOnInit(): void {
    if(this.userService.user == null || this.userService.user == undefined){
      let user_str = localStorage.getItem('user');
      if(user_str != null){
        this.userService.user = JSON.parse(user_str);
      }
      else{
        this.router.navigate(['/login']);
    }
      }
    this.postService.getPosts().then((res: any) => {
      this.posts = res;
      for(let post of this.posts){
        this.commentText.push("");
      }
    })
    .catch(
      (err) => {
        console.log(err);
      }
    );
      
  }

  post(){
    let postObj = {
      username: this.userService.user.username,
      imageUrl: "assets/shiba2.jpg",
      caption: this.text,
      likes : [],
      comments: []
    }
    this.posts.push(postObj);
    this.postService.saveNewPost(postObj).then((res) => {
      console.log(res);
      this.text = '';
    })
    .catch((err) => {
      console.log(err);
    });
  }

  like(postid: any){
    for(let i = 0; i < this.posts.length; i++){
      if(postid == this.posts[i].id){
        if(this.posts[i].likes.indexOf(this.userService.user.id) >= 0){
          this.posts[i].likes.splice(this.userService.user.id, 1);
        }
        else{
          this.posts[i].likes.push(this.userService.user.id)
        }
        this.postService.updateLikes(this.posts[i]).then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
      }
    }
  }
  comment(postid: any, commentIndex: any){
    let commentObj = {
      username: this.userService.user.username, 
      comment: this.commentText[commentIndex]
    }
    for(let i = 0; i < this.posts.length; i++){
      if(this.posts[i].id == postid && this.commentText[commentIndex] != ''){
        this.posts[i].comments.push(commentObj);
        this.commentText[commentIndex] = '';
        this.postService.updateComments(this.posts[i]);
      }
    }
    
  }


  postSchema = {
    username: '', 
    imageUrl: '', 
    caption: '', 
    likes: [], 
    comments: [{username: '', comment: ''}]
  }

}
