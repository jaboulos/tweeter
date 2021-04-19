import { gql, useMutation } from '@apollo/client';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import TwitterLogo from '../styles/assets/twitter-logo.png';

// redirect after login
import { Link, useHistory } from 'react-router-dom';
import React from 'react';
// import { validateSchema } from 'graphql';

// create mutation
// ! signifies required
const LOGIN_MUTATION = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      # get back token and set in local-storage
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
      <img
        src={TwitterLogo}
        alt='logo'
        style={{ width: '50px' }}
        className='logo'
      />
      <h3>Log in to Tweeter</h3>
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

          <button type='submit' className='login-button'>
            <span>Login</span>
          </button>
        </Form>
      </Formik>
      <div className='register'>
        <h4>Don't have an account?</h4>
        <Link to='/signup'>Sign up</Link>
      </div>
    </div>
  );
};

export default Login;
