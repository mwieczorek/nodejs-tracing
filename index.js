const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

var initTracer = require('jaeger-client').initTracer;
var jaegerUrl;
if(process.env.URL_JAEGER) { 
  jaegerUrl = process.env.URL_JAEGER
}
else { 
  jaegerUrl = 'http://localhost:14268/api/traces';
}
var config = {
    serviceName: 'graphql-gateway-service',
    sampler:{
      type: 'const',
      param: 1
    },
    reporter: {
      collectorEndpoint: jaegerUrl,
    },
  };
var options = {
    tags: {
      'graphql-gateway-service.version': '0.0.1',
    },
  };
const OpentracingExtension = require("apollo-opentracing").default;
var tracer = initTracer(config, options);
var zipkinCodec = require('jaeger-client').ZipkinB3TextMapCodec;
var opentracing = require('opentracing');
let codec = new zipkinCodec({ urlEncoding: true });
tracer.registerInjector(opentracing.FORMAT_HTTP_HEADERS, codec);
tracer.registerExtractor(opentracing.FORMAT_HTTP_HEADERS, codec);

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    hello: String
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => 'Hello world!',
  },
};

const server = new ApolloServer({ 
    typeDefs, resolvers, 
    extensions: [() => new OpentracingExtension({
        server: tracer,
        local: tracer,
      })]
});

const app = express();
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);