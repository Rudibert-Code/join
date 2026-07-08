import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Supabase } from '../../supabase';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  imports: [RouterLink, FormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class Signup {
  db = inject(Supabase);
  router = inject(Router);
  iconSrc = 'assets/UI/icon_locked.png';
  private visibilityOnSrc = 'assets/UI/icon_visibility.png';
  private visibilityOffSrc = 'assets/UI/icon_locked.png';
  passwordsDoNotMatch = false;
  signUpData = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptPolicy: false,
  };

  showPassword() {
    const password = document.getElementById('pwd') as HTMLInputElement | null;
    if (!password) return;
    if (password.type === 'password') {
      password.type = 'text';
      this.iconSrc = this.visibilityOnSrc;
    } else {
      password.type = 'password';
      this.iconSrc = this.visibilityOffSrc;
    }
  }

  async onSubmitSignUp() {
    if (this.signUpData.password !== this.signUpData.confirmPassword) {
      this.passwordsDoNotMatch = true;
      return;
    }
    this.passwordsDoNotMatch = false;
    if (!this.signUpData.acceptPolicy) {
      return;
    }
    if (this.signUpData.password !== this.signUpData.confirmPassword) {
      this.passwordsDoNotMatch = true;
      return;
    }
    this.passwordsDoNotMatch = false;
    const { data, error } = await this.db.signUpWithEmail(
      this.signUpData.email,
      this.signUpData.password,
      this.signUpData.firstName,
      this.signUpData.lastName,
    );
    if (error) {
      return;
    }
    this.router.navigate(['/login']);
  }
}
