import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';

export interface User {
  id: number;
  created_at: string;
  contact_id: number | null;
  first_name: string;
  last_name: string;
  email: string;
}

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './log-in.html',
  styleUrls: ['./log-in.scss'],
})
export class LogIn {
  constructor(private router: Router) {}

  onGuestLogin() {
    this.router.navigate(['/summary'], {
      state: { userName: 'Guest' },
    });
  }

  onRealLogin(userFromDatabase: User) {
    this.router.navigate(['/summary'], {
      state: { userName: userFromDatabase.first_name },
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
