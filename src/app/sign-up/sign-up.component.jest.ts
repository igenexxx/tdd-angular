import {render, screen} from "@testing-library/angular";
import {SignUpComponent} from "./sign-up.component";
import {userEvent} from "@testing-library/user-event";

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
  });
});
