const puppeteer = require('puppeteer');

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1280, height: 800 });
  
  console.log('Navigating to achievements page...');
  await page.goto('http://127.0.0.1:8081/achievements?tab=report_cards', { waitUntil: 'domcontentloaded' });
  
  // Wait a bit for React to render
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  console.log('Evaluating DOM...');
  const emptyWhiteRectangles = await page.evaluate(() => {
    const results = [];
    // The user said "empty white rounded rectangle appearing below the 'Seed Marks Data' button"
    // Find Seed Marks Data button
    const buttons = Array.from(document.querySelectorAll('button'));
    const seedButton = buttons.find(b => b.textContent && b.textContent.includes('Seed Marks Data'));
    
    if (!seedButton) {
      return { error: 'Could not find Seed Marks Data button' };
    }
    
    // Check all divs
    const divs = document.querySelectorAll('div');
    for (let i = 0; i < divs.length; i++) {
      const div = divs[i];
      const style = window.getComputedStyle(div);
      
      // If it looks like a white rounded rectangle
      if ((style.backgroundColor === 'rgb(255, 255, 255)' || style.backgroundColor === 'rgba(255, 255, 255, 1)' || div.classList.contains('bg-white')) && 
          parseFloat(style.borderRadius) > 0) {
        
        // Check if it's "empty" (no visible text content or very minimal)
        const textContent = div.textContent.trim();
        const childElements = div.children.length;
        
        // Let's record its bounding rect relative to the button
        const rect = div.getBoundingClientRect();
        const buttonRect = seedButton.getBoundingClientRect();
        
        // If it's below the button
        if (rect.top > buttonRect.bottom) {
          results.push({
            className: div.className,
            id: div.id,
            textContent: textContent.substring(0, 50), // first 50 chars
            childrenCount: childElements,
            top: rect.top,
            height: rect.height,
            width: rect.width,
            html: div.outerHTML.substring(0, 200)
          });
        }
      }
    }
    
    // Let's specifically look for conditional rendering artifacts (empty text nodes causing space-y-6 gaps)
    // Find the container that has space-y-6
    const spaceContainers = Array.from(document.querySelectorAll('.space-y-6'));
    const gaps = spaceContainers.map(c => c.innerHTML.substring(0, 100));
    
    return {
      rectangles: results.sort((a, b) => a.top - b.top),
      gaps
    };
  });
  
  console.log(JSON.stringify(emptyWhiteRectangles, null, 2));
  
  await page.screenshot({ path: 'artifacts/media__1781331132494.png', fullPage: true });
  
  await browser.close();
})();
