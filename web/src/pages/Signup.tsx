import { gql, useMutation } from '@apollo/client';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';

// redirect afer login
import { useHistory } from 'react-router-dom';
// import { validateSchema } from 'graphql';

// create mutation
// ! signifies required
const SIGNUP_MUTATION = gql`
  mutation signup($name: String, $email: String!, $password: String!) {
    signup(name: $name, email: $email, password: $password) {
      # get back token and set in localstorage
      token
    }
  }
`;

// interface for initialValues
interface SignupValues {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
}

// yup validation
const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Email required'),
  password: Yup.string()
    .max(20, 'Must be 20 characters or less')
    .required('Password required'),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref('password')],
    'Passwords must match'
  ),
  name: Yup.string()
    .max(15, 'Must be 15 characters or less')
    .required('Name required'),
});

const Signup = () => {
  // bring in useHistory
  const history = useHistory();
  // first argument in [] is mutation we're calling, 2nd arg is what we want to return
  const [signup, { data }] = useMutation(SIGNUP_MUTATION);

  const initialValues: SignupValues = {
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  };

  return (
    <div>
      <h1>Signup</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);
          const response = await signup({
            variables: values,
          });
          localStorage.setItem('token', response.data.signup.token);
          setSubmitting(false);
          history.push('/users');
        }}
      >
        <Form>
          <Field name='email' type='text' placeholder='Email' />
          <ErrorMessage name='email' component={'div'} />

          <Field name='name' type='text' placeholder='Name' />
          <ErrorMessage name='name' component={'div'} />

          <Field name='password' type='password' placeholder='Password' />
          <ErrorMessage name='password' component={'div'} />

          <Field
            name='confirmPassword'
            type='password'
            placeholder='Confirm password'
          />
          <ErrorMessage name='confirmPassword' component={'div'} />

          <button type='submit'>Signup</button>
        </Form>
      </Formik>
    </div>
  );
};

export default Signup;
