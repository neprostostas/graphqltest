import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: 'https://keys.slk-team.com:7070/graphql',
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const cache = new InMemoryCache({
  typePolicies: {
    searchRequests: {
      keyFields: ['id', 'business_name', 'business_phone', 'business_mail']
    },
  },
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: cache,
  defaultOptions: {
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
    errorPolicy: "ignore",
  },
  query: {
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
    errorPolicy: "all",
  },
  credentials: "include",
});

client.refetchQueries({
  updateCache(cache) {
    cache.evict({
      fieldName: "someRootField",
    });
  },

  onQueryUpdated(observableQuery, {
    complete,
    result,
    missing
  }) {

    if (complete) {
      // Update the query according to its chosen FetchPolicy, rather than
      // refetching it unconditionally from the network.
      return observableQuery.reobserve();
    }

    // Refetch the query unconditionally from the network.
    return true;
  },
});

export const uploadClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: cache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "network-only",
    },
    query: {
      fetchPolicy: "network-only",
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);