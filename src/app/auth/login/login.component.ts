import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  logInFailed = false;

  constructor(private router: Router, private authService: AuthService) { }

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });

  ngOnInit() {
  }

  onSubmit() {
    this.authService.signinUser(this.loginForm.value.email, this.loginForm.value.password)
      .then(
        response => {
          this.router.navigate(['/', 'admin']);
        }
      )
      .catch(
        error => this.logInFailed = true
      );
  }
}
