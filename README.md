# Zipkin headers not propagated?

Run jaeger locally:

```
docker run -p 16686:16686 -p 14268:14268  -it jaegertracing/all-in-one:1.11
```

Run this app:

```
npm install
npm start
```

Make call:

```
curl 'http://localhost:4000/graphql' -H 'content-type: application/json' \
  -H 'x-b3-traceid: a260424256735e75' -H 'X-B3-ParentSpanId: b260424256735e75' -H 'X-B3-SpanId: c260424256735e75' \
  --data-binary '{"operationName":null,"variables":{},"query":"{\n  hello\n}\n"}'
```

Go to `http://localhost:16686` look at trace json - no parent