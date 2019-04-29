curl 'http://localhost:4000/graphql' -H 'content-type: application/json' \
  --data-binary '{"operationName":null,"variables":{},"query":"{\n  hello\n}\n"}'

curl 'http://localhost:4000/graphql' -H 'content-type: application/json' -H 'x-b3-traceid: a260424256735e75' -H 'X-B3-ParentSpanId: b260424256735e75' -H 'X-B3-SpanId: c260424256735e75' \
  --data-binary '{"operationName":null,"variables":{},"query":"{\n  hello\n}\n"}'