import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  id_token: string = '';
  expires_in: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cookieService: CookieService
  ) {}
  ngOnInit() {
    if (this.route.snapshot.fragment) {
      const fragmentParams = new URLSearchParams(this.route.snapshot.fragment);
      this.id_token = fragmentParams.get('id_token') || '';
      this.expires_in = fragmentParams.get('expires_in') || '';
      if (this.id_token.length !== 0) {
        this.cookieService.set(
          'id_token',
          this.id_token,
          { expires: new Date(new Date().getTime() +  1000 * 60 * 60)}
        );
        this.router.navigate(['/home']);
      }
    }
    else{
      this.router.navigate([''])
    }
  }
}
