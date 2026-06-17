import puppeteer from "puppeteer";

const email = "qa_admin_1781532222398@gmail.com";
const password = "Pass_1781532222398!";

async function run() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  try {
    console.log("Logging in...");
    await page.goto("http://localhost:8080/login", { waitUntil: "networkidle2" });
    await page.type('input[type="email"]', email);
    await page.type('input[type="password"]', password);
    await page.click('button[type="submit"]');
    await new Promise((resolve) => setTimeout(resolve, 5000));

    console.log("Current URL:", page.url());

    const localStorageData = await page.evaluate(() => {
      const data = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        data[key] = localStorage.getItem(key);
      }
      return data;
    });

    console.log("LocalStorage after login:", JSON.stringify(localStorageData, null, 2));
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await browser.close();
  }
}

run();
