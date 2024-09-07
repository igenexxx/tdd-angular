import {render, screen, waitFor} from "@testing-library/angular";
import {SignUpComponent} from "./sign-up.component";
import {userEvent} from "@testing-library/user-event";
import 'whatwg-fetch';
import {provideHttpClient} from "@angular/common/http";
import {DefaultBodyType, http, HttpResponse} from 'msw';
import {setupServer} from "msw/node";

const setup = async () => {
  await render(SignUpComponent, {
    providers: [
      provideHttpClient(),
    ]
  });
}

let requestBody: DefaultBodyType;
let counter = 0;
const server = setupServer(
  http.post('/api/1.0/users', async ({ request }) => {
    await new Promise(res => setTimeout(res, 100));
    requestBody = await request.json();
    counter += 1;

    return HttpResponse.json({}, { status: 200 });
  })
);

beforeAll(() => server.listen());

afterAll(() => server.close());

beforeEach(() => {
  counter = 0;
})


describe('SignUpComponent', () => {
  beforeEach(async () => {
    await setup();
  });

  describe('Layout', () => {
    it('should has sign up header', async () => {
      const header = screen.getByRole('heading', { name: 'Sign Up' });

      expect(header).toBeInTheDocument();
    });

    it.each(['Username', 'Email', 'Password', 'Repeat password'])('should has %s label', async (label) => {

      expect(screen.getByLabelText(label)).toBeInTheDocument();
    });

    it.each(['Password', 'Repeat password'])('should has %s input with password type', async (label) => {
      const input = screen.getByLabelText(label);

      expect(input).toHaveAttribute('type', 'password');
    });

    it('should has button Sing Up', async () => {
      const button = screen.getByRole('button', { name: 'Sign Up' });

      expect(button).toBeInTheDocument();
    });
  })

  describe('Interactions', () => {
    let button: HTMLButtonElement;

    const setupForm = async () => {
      const username = screen.getByLabelText('Username');
      const email = screen.getByLabelText('Email');
      const password = screen.getByLabelText('Password');
      const passwordRepeat = screen.getByLabelText('Repeat password');

      await userEvent.type(username, 'John');
      await userEvent.type(email, 'john@doe.com');
      await userEvent.type(password, "P4ssw0rd");
      await userEvent.type(passwordRepeat, "P4ssw0rd");

      button = screen.getByRole('button', { name: 'Sign Up' });
    }

    it('should enable submit button when password and repeat password have same value', async () => {
      await setupForm();
      const password = screen.getByLabelText('Password');
      const passwordRepeat = screen.getByLabelText('Repeat password');

      await userEvent.type(password, "P4ssw0rd");
      await userEvent.type(passwordRepeat, "P4ssw0rd");

      const button = screen.getByRole('button', { name: 'Sign Up' });
      expect(button).toBeEnabled();
    });

    it('should send username, email and password to backend after form submit', async () => {
      await setupForm();
      await userEvent.click(button);

      await waitFor(() => {
        expect(requestBody).toEqual({
          username: 'John',
          password: 'P4ssw0rd',
          email: 'john@doe.com',
        });
      })
    });

    it('should have disabled sign up button during ongoing api call', async () => {
      await setupForm();

      await userEvent.click(button);
      await userEvent.click(button);

      await waitFor(() => {
        expect(counter).toBe(1);
      })
    });

    it('should display spinner after clicking submit button', async () => {
      await setupForm();

      expect(screen.queryByRole('status', { hidden: true })).not.toBeInTheDocument();

      await userEvent.click(button);

      expect(screen.queryByRole('status', { hidden: true })).toBeInTheDocument();
    });

    it('should display account activation notification after successful sign up request', async () => {
      await setupForm();

      expect(screen.queryByText('Please check your email to activate your account')).not.toBeInTheDocument();

      await userEvent.click(button);
      const text = await screen.findByText('Please check your email to activate your account');

      expect(text).toBeInTheDocument();
    });

    it('should hide sign up form after successful sign up request', async () => {
      await setupForm();
      const form = screen.getByTestId('form-sign-up');

      await userEvent.click(button);
      await screen.findByText('Please check your email to activate your account');

      expect(form).not.toBeInTheDocument();
    });
  });
});
