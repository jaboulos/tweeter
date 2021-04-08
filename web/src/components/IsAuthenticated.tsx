import { gql, useQuery } from '@apollo/client';
import { Redirect } from 'react-router';

const IS_LOGGED_IN = gql`
  {
    me {
      id
    }
  }
`;

interface IsAuthenticatedProps {
  children?: React.ReactNode;
}

const IsAuthenticated = ({ children }: IsAuthenticatedProps) => {
  const { loading, error, data } = useQuery(IS_LOGGED_IN);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

  // case when there is no data for the user
  if (!data.me) {
    return <Redirect to={{ pathname: '/landing' }} />;
  }

  return <>{children}</>;
};

export default IsAuthenticated;
