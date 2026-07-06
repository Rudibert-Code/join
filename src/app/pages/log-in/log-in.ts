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

  loginData = {
    email: '',
    password: '',
  };

  async onSubmitLogin() {
    const { data, error } = await this.db.signIn(this.loginData.email, this.loginData.password);
    console.log('Daten von Supabase Auth:', data);
    if (error) {
      console.error('Login fehlgeschlagen:', error.message);
      return;
    }
    if (data.user) {
      this.router.navigate(['/summary']);
    }
  }

  onGuestLogin() {
    this.router.navigate(['/summary'], {
      state: { userName: 'Guest' },
    });
  }

  onRealLogin(userFromDatabase: User) {
    this.router.navigate(['/summary'], {
      state: {
        firstName: userFromDatabase.first_name,
        lastName: userFromDatabase.last_name,
      },
    });
  }

  ngOnInit() {
    this.startAnimation();
  }

  iconSrc = 'assets/UI/icon_visibility-off.png';
  private visibilityOnSrc = 'assets/UI/icon_visibility.png';
  private visibilityOffSrc = 'assets/UI/icon_visibility-off.png';
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
