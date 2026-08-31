import http from "http";

const postData = JSON.stringify({
  data: {
    student: {
      full_name: "Test",
      class_id: "b9b56f91-8ea2-4a0b-9c29-37f2a1b920e5",
    },
    parent: {},
  },
});

const req = http.request(
  {
    hostname: "localhost",
    port: 8080,
    path: "/_server/?_serverFnId=provisionStudent",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(postData),
    },
  },
  (res) => {
    let data = "";
    res.on("data", (chunk) => {
      data += chunk;
    });
    res.on("end", () => {
      console.log("Response:", data);
    });
  },
);

req.on("error", (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.write(postData);
req.end();
