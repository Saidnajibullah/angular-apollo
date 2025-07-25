import { ApplicationConfig, inject } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache, split } from '@apollo/client/core';
import { createClient } from 'graphql-ws';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { Kind, OperationTypeNode } from 'graphql';
 
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideHttpClient(), 
    provideApollo(() => {
      const httpLink = inject(HttpLink);
      const http = httpLink.create({
        uri: 'http://localhost:4000/graphql',
      });
 
      const ws = new GraphQLWsLink(
        createClient({
          url: 'ws://localhost:4000/graphql',
        }),
      );                                                    
  
      // Using the ability to split links, you can send data to each link
      // depending on what kind of operation is being sent
      const link = split(
        // Split based on operation type
        ({ query }) => {
          const definition = getMainDefinition(query);
          return (
            definition.kind === Kind.OPERATION_DEFINITION &&
            definition.operation === OperationTypeNode.SUBSCRIPTION
          );
        },
        ws,
        http,
      );
      return {
        link,
        cache: new InMemoryCache(),
        // other options...
      };
    })
  ]
};
