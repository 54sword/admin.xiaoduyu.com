import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';
import fetch from "node-fetch";

const client = new ApolloClient({
  // 如果开启ssrMode, fetchPolicy: 'network-only' 则会无效
  ssrMode: false,
  // ssrMode: process && process.env && process.env.__NODE__ ? process.env.__NODE__ : false,
  link: new HttpLink({
    uri: 'http://localhost:3000/graphql',
    fetch: fetch
  }),
  cache: new InMemoryCache({
    addTypename: false
  })
})

export default ({ query, mutation, headers, fetchPolicy }) => {

  let options = { context: {} }

  // network-only 不缓存
  if (fetchPolicy) options.fetchPolicy = fetchPolicy;
  if (query) options.query = gql`${query}`;
  if (mutation) options.mutation = gql`${mutation}`;
  if (headers) options.context.headers = headers

  let fn = query ? client.query : client.mutate

  return fn(options).then(res=>{
    return [null, res]
  }).catch(res=>{
    return [res.graphQLErrors]
  });
}
