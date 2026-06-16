import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-log-in',
  imports: [RouterLink],
  templateUrl: './log-in.html',
  styleUrls: ['./log-in.scss'],
})
export class LogIn {
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
