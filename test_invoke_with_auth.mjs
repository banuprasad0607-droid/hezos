import { createClient } from "@supabase/supabase-js";
import http from "http";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function run() {
  console.log("Signing in...");
  const { data: auth, error } = await supabase.auth.signInWithPassword({
    email: "superadmin@hezoscl.com",
    password: "password123!",
  });

  if (error || !auth.session) return console.log("Login err", error);

  const token = auth.session.access_token;
  console.log("Got token.");

  const postData = JSON.stringify({
    data: {
      student: {
        full_name: "Test Server Fn",
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
        Authorization: `Bearer ${token}`,
      },
    },
    (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        console.log("Response status:", res.statusCode);
        console.log("Response body:", data);
      });
    },
  );

  req.on("error", (e) => {
    console.error(`request problem: ${e.message}`);
  });

  req.write(postData);
  req.end();
}

run();
