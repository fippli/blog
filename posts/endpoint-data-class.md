---
title: Endpoint Data Class
description: |
  this is the description (replace this)
---

# Endpoint Data Class

I want a class that works like this:

```javascript
const someEndpoint = new Endpoint("/foo/:id");

// Construct the endpoint with parameters and query
// NOTE: should only be callable once. We want to avoid
// mutating the endpoint by mistake...
someEndpoint
  .parameters({
    id: "c4cf8dd7-0374-45e7-bdf2-31f09ff38675",
  })
  .query({
    q: 123,
  });

someEndpoint.toString(); // => '/foo/c4cf8dd7-0374-45e7-bdf2-31f09ff38675?q=123'

someEndpoint.get(); // api GET request to backend

someEndpoint.post(body); // api POST request to backend
```

etc. etc. Let's build it :)
<em>To be continued...</em>
