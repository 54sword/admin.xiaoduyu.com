import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';
import fetch from "node-fetch";

const client = new ApolloClient({
  ssrMode: true,
  link: new HttpLink({
    uri: 'http://localhost:3000/graphql',
    fetch: fetch
  }),
  cache: new InMemoryCache()
});

export default ({ query, mutation, headers }) => {

  let options = {
    context: {}
  }

  if (query) {
    options.query = gql`${query}`
  }

  if (mutation) {
    options.mutation = gql`${mutation}`
  }

  if (headers) options.context.headers = headers

  let fn = query ? client.query : client.mutate

  return fn(options).then(res=>{
    return [null, res]
  }).catch(res=>{
    return [res.graphQLErrors]
    // console.log(Reflect.ownKeys(e));
  });
}
