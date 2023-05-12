import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent {

 
  constructor(private router: Router, private cookieService: CookieService) {
    if (!this.cookieService.check('id_token')) {
      console.log(this.cookieService.get('id_token')||"no cookie")
      const url =
        'https://umkcattendify.auth.us-east-1.amazoncognito.com/login?client_id=4i477quhrkoppn7098gjnin8o6&response_type=token&scope=email+openid+profile&redirect_uri=https%3A%2F%2Fdev.d2e13q21xv7uwe.amplifyapp.com%2Flogin%2F';
      window.open(url, '_self');
    } else {
      this.router.navigate(['/AccessCode']);
    }
  }
}
