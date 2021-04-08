import { gql, useMutation } from '@apollo/client';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';

// redirect afer login
import { useHistory } from 'react-router-dom';
// import { validateSchema } from 'graphql';

// create mutation
// ! signifies required
const LOGIN_MUTATION = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      # get back token and set in localstorage
      token
    }
  }
`;

// interface for initialValues
interface LoginValues {
  email: string;
  password: string;
}

// yup validation
const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Email required'),
  password: Yup.string()
    .max(20, 'Must be 20 characters or less')
    .required('Password required'),
});

const Login = () => {
  // bring in useHistory
  const history = useHistory();
  // first argument in [] is mutation we're calling, 2nd arg is what we want to return
  const [login, { data }] = useMutation(LOGIN_MUTATION);

  const initialValues: LoginValues = {
    email: '',
    password: '',
  };

  return (
    <div>
      <h1>Login</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);
          const response = await login({
            variables: values,
          });
          localStorage.setItem('token', response.data.login.token);
          setSubmitting(false);
          history.push('/users');
        }}
      >
        <Form>
          <Field name='email' type='text' placeholder='Email' />
          <ErrorMessage name='email' component={'div'} />

          <Field name='password' type='password' placeholder='Password' />
          <ErrorMessage name='password' component={'div'} />

          <button type='submit'>Login</button>
        </Form>
      </Formik>
    </div>
  );
};

export default Login;
