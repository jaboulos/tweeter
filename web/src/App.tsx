import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { setContext } from 'apollo-link-context';

import './App.css';
import Users from './components/Users';
import Landing from './components/Landing';
import Signup from './pages/Signup';

// Gives access from FE to BE (see updated setup below that includes headers and tokens)
// const client = new ApolloClient({
//   uri: 'http://localhost:4000', // url for the BE
//   cache: new InMemoryCache(),
// });

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
//set headers and token section
// url for BE
const httpLink = new HttpLink({ uri: 'http://localhost:4000' });

// pass along that token into headers with every single request to determine if authenticated
const authLink = setContext(async (req, { headers }) => {
  // get from local storage
  const token = localStorage.getItem('token');
  return {
    ...headers,
    headers: {
      Authorization: token ? `Bearer ${token}` : null,
    },
  };
});

// create client
const link = authLink.concat(httpLink as any);
const client = new ApolloClient({
  link: link as any,
  cache: new InMemoryCache(),
});
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Switch>
          <Route path='/landing'>
            <Landing />
          </Route>
          <Route path='/signup'>
            <Signup />
          </Route>
          <Route path='/'>
            <Users />
          </Route>
        </Switch>
      </Router>
    </ApolloProvider>
  );
}

export default App;
