import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SignUpComponent} from './sign-up.component';
import {By} from "@angular/platform-browser";
import {HttpTestingController, provideHttpClientTesting} from "@angular/common/http/testing";
import {provideHttpClient} from "@angular/common/http";
import {DebugElement, importProvidersFrom} from "@angular/core";
import {FormsModule} from "@angular/forms";

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignUpComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        // importProvidersFrom(FormsModule),
      ]
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

      expect(button?.nativeElement.textContent).toContain('Sign Up');
    });

    it('should be disabled initially', () => {
      const el = fixture.debugElement;
      const button = el.query(By.css('button'));

      expect(button?.nativeElement.disabled).toBeTruthy();
    });
  })

  describe('Interactions', () => {
    let button: HTMLButtonElement;
    let httpController: HttpTestingController;
    let signUp: DebugElement;

    const setupForm = async () => {
      httpController = TestBed.inject(HttpTestingController);

      signUp = fixture.debugElement;

      await fixture.whenStable();
      const usernameInput = signUp.query(By.css('input#username'));
      const emailInput = signUp.query(By.css('input#email'));
      const passwordInput = signUp.query(By.css('input#password'));
      const passwordRepeatInput = signUp.query(By.css('input#password-repeat'));
      const usernameInputEl = usernameInput.nativeElement;
      const emailInputEl = emailInput.nativeElement;
      const passwordInputEl = passwordInput.nativeElement;
      const passwordRepeatEl = passwordRepeatInput.nativeElement;

      usernameInputEl.value = 'John';
      emailInputEl.value = 'john@email.com';
      passwordInputEl.value = 'P4ssw0rd';
      passwordRepeatEl.value = 'P4ssw0rd';
      [usernameInputEl, emailInputEl, passwordInputEl, passwordRepeatEl].forEach(el => el.dispatchEvent(new Event('input')));

      fixture.detectChanges();

      button = signUp.query(By.css('button'))?.nativeElement as HTMLButtonElement;
    }

    it('should enable submit button when password and repeat password have same value', async () => {
      await setupForm();

      expect(button?.disabled).toBeFalsy();
    });


    it('should send username, email and password to backend after form submit', async () => {
      await setupForm();

      button?.click();

      const req = httpController.expectOne('/api/1.0/users');

      expect(req.request.body).toEqual({
        username: 'John',
        email: 'john@email.com',
        password: 'P4ssw0rd',
      })
    });

    it('should have disabled sign up button during ongoing api call', async () => {
      await setupForm();
      button.click();
      fixture.detectChanges();
      button.click();

      httpController.expectOne('/api/1.0/users');

      expect(button.disabled).toBeTruthy();
    });

    it('should display spinner after clicking submit button', async () => {
      await setupForm();
      expect(signUp.query(By.css('span[role="status"]'))).toBeFalsy();

      button.click();
      fixture.detectChanges();

      expect(signUp.query(By.css('span[role="status"]'))).toBeTruthy();
    });

    it('should display account activation notification after successful sign up request', async () => {
      await setupForm();
      button.click();

      expect(signUp.query(By.css('.alert-success'))).toBeFalsy();

      const req = httpController.expectOne('/api/1.0/users');
      req.flush({});

      fixture.detectChanges();

      const message = signUp.query(By.css('.alert-success'))?.nativeElement;

      expect(message.textContent).toContain('Please check your email to activate your account');
    });

    it('should hide sign up form after successful sign up request', async () => {
      await setupForm();
      expect(signUp.query(By.css('div[data-testid="form-sign-up"]'))).toBeTruthy();

      button.click();
      const req = httpController.expectOne('/api/1.0/users');
      req.flush({});

      fixture.detectChanges();

      expect(signUp.query(By.css('div[data-testid="form-sign-up"]'))).toBeFalsy();
    });
  })
});
