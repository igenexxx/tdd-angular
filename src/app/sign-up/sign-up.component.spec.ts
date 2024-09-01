import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpComponent } from './sign-up.component';
import {By} from "@angular/platform-browser";

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignUpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Layout', () => {
    it('should have sign up header', () => {
      const signUp = fixture.debugElement.query(By.css('h1'));
      const h1 = (signUp.nativeElement as HTMLElement)?.textContent;

      expect(h1).toBe('Sign Up');
    });

    it('should has username input', () => {
      const el = fixture.debugElement;
      const input = el.query(By.css('input#username'));
      const label = el.query(By.css('label[for="username"]'));


      expect(label).toBeTruthy();
      expect(label.nativeElement.textContent).toBe('Username');
      expect(input).toBeTruthy();
    });

    it('should has email input', () => {
      const el = fixture.debugElement;
      const input = fixture.debugElement.query(By.css('input#email'));
      const label = fixture.debugElement.query(By.css('label[for="email"]'));

      expect(label).toBeTruthy();
      expect(label.nativeElement.textContent).toBe('Email');
      expect(input).toBeTruthy();
    });

    it('should has password input', () => {
      const el = fixture.debugElement;
      const input = el.query(By.css('input#password'));
      const label = el.query(By.css('label[for="password"]'));

      expect(label).toBeTruthy();
      expect(label.nativeElement.textContent).toBe('Password');
      expect(input).toBeTruthy();
      expect(input.nativeElement.type).toBe('password');
    });

    it('should has password repeat input', () => {
      const el = fixture.debugElement;
      const input = el.query(By.css('input#password-repeat'));
      const label = el.query(By.css('label[for="password-repeat"]'));

      expect(label).toBeTruthy();
      expect(label.nativeElement.textContent).toBe('Repeat password');
      expect(input).toBeTruthy();
      expect(input.nativeElement.type).toBe('password');
    });

    it('should has sign up button', () => {
      const el = fixture.debugElement;
      const button = el.query(By.css('button'));

      expect(button?.nativeElement.textContent).toBe('Sign Up');
    });

    it('should be disabled initially', () => {
      const el = fixture.debugElement;
      const button = el.query(By.css('button'));

      expect(button?.nativeElement.disabled).toBeTruthy();
    });
  })

  describe('Interactions', () => {
    it('should enable submit button when password and repeat password have same value', () => {
      const signUp = fixture.debugElement;
      const passwordInput = signUp.query(By.css('input#password'));
      const passwordRepeatInput = signUp.query(By.css('input#password-repeat'));
      const passwordInputEl = passwordInput.nativeElement;
      const passwordRepeatEl = passwordRepeatInput.nativeElement;

      passwordInputEl.value = 'P4ssw0rd';
      passwordInputEl.dispatchEvent(new Event('input'));

      passwordRepeatEl.value = 'P4ssw0rd';
      passwordRepeatEl.dispatchEvent(new Event('input'));

      fixture.detectChanges();

      const button = fixture.debugElement.query(By.css('button'))?.nativeElement as HTMLButtonElement;

      expect(button?.disabled).toBeFalsy();
    });
  })
});
