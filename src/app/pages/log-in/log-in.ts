import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Supabase, User } from '../../supabase';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './log-in.html',
  styleUrls: ['./log-in.scss'],
})

export class LogIn {
  db = inject(Supabase);
  router = inject(Router);
  loginError: string = '';
  loginData = {
    email: '',
    password: '',
  };
  iconSrc = 'assets/UI/icon_visibility-off.png';
  private visibilityOnSrc = 'assets/UI/icon_visibility.png';
  private visibilityOffSrc = 'assets/UI/icon_visibility-off.png';

  async onSubmitLogin() {
    const { data, error } = await this.db.signIn(this.loginData.email, this.loginData.password);
    if (error) {
      this.loginError = 'Email or Password does not exist.';
      return;
    }
    if (data.user) {
      const firstName = data.user.user_metadata?.['first_name'];
      const lastName = data.user.user_metadata?.['last_name'];
      this.router.navigate(['/summary'], {
        state: { playGreetingIntro: true, firstName, lastName },
      });
    }
  }

  onGuestLogin() {
    this.db.signInAsGuest();

    this.router.navigate(['/summary'], {
      state: { playGreetingIntro: true, userName: 'Guest' },
    });
  }

  ngOnInit() {
    this.startAnimation();
  }

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

  startAnimation() {
    let splash = document.getElementById('splash-container') as HTMLInputElement | null;
    setTimeout(() => {
      splash?.classList.add('init-done');
    }, 150);
  }
}
