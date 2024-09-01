import {render, screen} from "@testing-library/angular";
import {SignUpComponent} from "./sign-up.component";
import {userEvent} from "@testing-library/user-event";
import 'whatwg-fetch';

describe('SignUpComponent', () => {
  describe('Layout', () => {
    it('should has sign up header', async () => {
      await render(SignUpComponent);
      const header = screen.getByRole('heading', { name: 'Sign Up' });

      expect(header).toBeInTheDocument();
    });

    it.each(['Username', 'Email', 'Password', 'Repeat password'])('should has %s label', async (label) => {
      await render(SignUpComponent);

      expect(screen.getByLabelText(label)).toBeInTheDocument();
    });

    it.each(['Password', 'Repeat password'])('should has %s input with password type', async (label) => {
      await render(SignUpComponent);
      const input = screen.getByLabelText(label);

      expect(input).toHaveAttribute('type', 'password');
    });

    it('should has button Sing Up', async () => {
      await render(SignUpComponent);
      const button = screen.getByRole('button', { name: 'Sign Up' });

      expect(button).toBeInTheDocument();
    });
  })

  describe('Interactions', () => {
    it('should enable submit button when password and repeat password have same value', async () => {
      await render(SignUpComponent);
      const password = screen.getByLabelText('Password');
      const passwordRepeat = screen.getByLabelText('Repeat password');

      await userEvent.type(password, "P4ssw0rd");
      await userEvent.type(passwordRepeat, "P4ssw0rd");

      const button = screen.getByRole('button', { name: 'Sign Up' });
      expect(button).toBeEnabled();
    });

    it('should send username, email and password to backend after form submit', async () => {
      const spiedFetch = jest.spyOn(window, 'fetch');

      await render(SignUpComponent);
      const username = screen.getByLabelText('Username');
      const email = screen.getByLabelText('Email');
      const password = screen.getByLabelText('Password');
      const passwordRepeat = screen.getByLabelText('Repeat password');

      await userEvent.type(username, 'John');
      await userEvent.type(email, 'john@doe.com');
      await userEvent.type(password, "P4ssw0rd");
      await userEvent.type(passwordRepeat, "P4ssw0rd");

      const button = screen.getByRole('button', { name: 'Sign Up' });
      await userEvent.click(button);

      const [args] = spiedFetch.mock.calls;
      const [, secondParam] = args as [string, RequestInit];

      expect(secondParam.body).toEqual(JSON.stringify({
        username: 'John',
        password: 'P4ssw0rd',
        email: 'john@doe.com',
      }));
    });
  });
});
