// import { ApolloServer } from 'apollo-server-express';
// import expressPlayground from 'graphql-playground-middleware-express'
// import express from 'express';
// import { readFileSync } from 'fs';
// const typeDefs = readFileSync('./typeDefs.graphql', 'UTF-8')
// import resolvers from './resolvers/index.js';
// import { MongoClient, ServerApiVersion } from 'mongodb';
// const db_url = 'mongodb+srv://Said_Mongo:Atlas_Najib_Mongo$40@cluster0.bayb4qw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
// const server = new ApolloServer({
//     typeDefs,
//     resolvers,
// });
// const db_client = new MongoClient(db_url,  {
//     serverApi: {
//         version: ServerApiVersion.v1,
//         strict: true,
//         deprecationErrors: true,
//     }
// });
// const main = async () => {
//     const app = express();
//     await db_client.connect();
//     await db_client.db("admin").command({ ping: 1 });
//     console.log('db connection successfull!')
//     await server.start();
//     server.applyMiddleware({app});
//     app.get('/',(req, res) => res.end('Welcome to GraphQL App!'));
//     app.get('/playground', expressPlayground.default({ endpoint: '/graphql' }))
//     app.listen({port: 4000}, ()=> console.log(`http://localhost:4000${server.graphqlPath}`));
//   };
  
//   main();
import expressPlayground from 'graphql-playground-middleware-express'
import { readFileSync } from 'fs';
import resolvers from './resolvers/index.js';
import { ApolloServer } from '@apollo/server';
import { createServer } from 'http';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { makeExecutableSchema } from '@graphql-tools/schema';
import bodyParser from 'body-parser';
import express from 'express';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import cors from 'cors'
const typeDefs = readFileSync('./typeDefs.graphql', 'UTF-8')
const port = 4000;
const schema = makeExecutableSchema({ typeDefs, resolvers });
const app = express();
const httpServer = createServer(app);

const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql'
});

const wsServerCleanup = useServer({schema}, wsServer);

const apolloServer = new ApolloServer({
    schema,
    plugins: [
       // Proper shutdown for the HTTP server.
       ApolloServerPluginDrainHttpServer({ httpServer }),

       // Proper shutdown for the WebSocket server.
       {
        async serverWillStart() {
            return {
                async drainServer() {
                    await wsServerCleanup.dispose();
                }
            }
        }
       }
    ]
});

await apolloServer.start();
app.use(cors());
app.use('/graphql', bodyParser.json(), expressMiddleware(apolloServer,{
    context: async ({ req }) => ({ req }),
  }),
)
httpServer.listen(port, () => {
    console.log(`🚀 Query endpoint ready at http://localhost:${port}/graphql`);
    console.log(`🚀 Subscription endpoint ready at ws://localhost:${port}/graphql`);
});