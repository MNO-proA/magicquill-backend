import { Builder, By, Key, until } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome.js';
import 'chromedriver';
import clipboardy from 'clipboardy';

async function copyToClipboard(text) {
    try {
        await clipboardy.write(text);
    } catch (error) {
        console.error('Error copying to clipboard:', error);
    }
}


async function typeWithRandomDelay(element, text) {
  // Ensure text is iterable
  if (typeof text !== 'string') {
      console.error('Provided text is not a string:', text);
      throw new TypeError('Text must be a string');
  }
  for (const char of text) {
      await element.sendKeys(char);
      await sleep(50 + Math.random() * 100);
  }
}


// const credentials = {
//     'email': 'ofosuemerald@gmail.com',
//     'password': 'emeraldofosu2022',
//     'username': 'OfosuEmerald'
// }

// // const gmail = 'ofosuemerald@gmail.com'
// // const password = 'emeraldofosu2022'
// // const username = 'OfosuEmerald'

// const content = 'What is happening?!'

const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

const getRandomDelay = () => Math.floor(Math.random() * (180000 - 120000 + 1) + 120000);

export async function automateTwitterPost(credentials, content) {
    const options = new Options()
        .windowSize({ width: 1920, height: 1080 })
        .addArguments('--disable-dev-shm-usage')
        .addArguments('--disable-gpu')
        .addArguments('--disable-blink-features=AutomationControlled')
        .addArguments(`--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36`);

    const driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    try {
        // Inject script to remove `navigator.webdriver`
        await driver.executeScript(`
            Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
        `);

        // Navigate to Twitter login
        await driver.get('https://x.com/i/flow/login');
        await sleep(5000); // Adjust delay as needed

                // Login process
        const emailInput = await driver.wait(
            until.elementLocated(By.css('input[autocomplete="username"]')),
            600000
        );
        await typeWithRandomDelay(emailInput, credentials.email);
        await sleep(1000 + Math.random() * 5000);

        const nextButton = await driver.findElement(By.xpath("//button[@role='button' and contains(., 'Next')]"));
        await nextButton.click();
        await sleep(2000 + Math.random() * 1000);

       // Handle username if prompted
        try {
            const usernameInput = await driver.wait(
                until.elementLocated(By.xpath('//input[@data-testid="ocfEnterTextTextInput"]')),
                500000
            );

            if (usernameInput) {
                await typeWithRandomDelay(usernameInput, credentials.username);
                await sleep(1000 + Math.random() * 500);

                // Locate the "Next" button
                const nextUsernameButton = await driver.findElement(
                    By.xpath('//button[@data-testid="ocfEnterTextNextButton"]')
                );

                // Check if the button is enabled before clicking
                const isEnabled = await nextUsernameButton.isEnabled();
                
                if (isEnabled) {
                    await nextUsernameButton.click(); // Click if enabled
                    await sleep(2000 + Math.random() * 1000);
                } else {
                    console.log('Next button is disabled, continuing...');
                }
            } else {
                console.log('No username prompt, continuing...');
            }
        } catch (e) {
            console.log('Error occurred:', e);
        }


        // Enter password
        const passwordInput = await driver.wait(
            until.elementLocated(By.xpath('//input[@type="password" and @autocomplete="current-password"]')),
            1000000
        );
        await typeWithRandomDelay(passwordInput, credentials.password);
        await sleep(1000 + Math.random() * 500);

        // Check for the login button and its state
        const loginButton = await driver.findElement(
            By.xpath('//button[@data-testid="LoginForm_Login_Button"]')
        );

        const isEnabled = await loginButton.isEnabled();

        if (isEnabled) {
            await loginButton.click();  // Prefer clicking if the button is enabled
        } else {
            console.log('Login button is disabled, trying to log in with Enter key instead.');
            const actions = driver.actions({ async: true });
            await actions.sendKeys(Key.ENTER).perform();  // Fallback to Enter key
        }
        

        // // Handle security verification
        // try {
        //     const securityPrompt = await driver.findElement(
        //         By.xpath('//*[contains(text(), "Verify your identity")]')
        //     );
        //     if (await securityPrompt.isDisplayed()) {
        //         throw new Error('Security verification required');
        //     }
        // } catch (e) {
        //     if (e.message === 'Security verification required') {
        //         throw e;
        //     }
        // }

        // Handle posting a tweet
    try {
    // Locate the contenteditable div that acts as the textarea
    const tweetInput = await driver.wait(
        until.elementLocated(By.xpath('//div[@data-testid="tweetTextarea_0"]')),
        600000
    );

    // Ensure the element is interactable
    await driver.wait(until.elementIsVisible(tweetInput), 1000);

    // Clear any existing text (if necessary)
    // This may not work for contenteditable divs, so you can skip this step if it fails.
    // await tweetInput.clear(); // Optional

    // Copy the content to the clipboard
    await copyToClipboard(content);

    // // Type the tweet content
    // await tweetInput.sendKeys(content); // Your tweet message
       // Wait briefly to ensure the clipboard has the content
    await sleep(5000);

       // Paste the content from the clipboard into the tweet textarea
    await tweetInput.sendKeys(Key.CONTROL + 'v');

    // Locate the tweet button
    const tweetButton = await driver.wait(
        until.elementLocated(By.xpath('//button[@data-testid="tweetButtonInline"]')),
        5000
    );

    // Check if the button is enabled before clicking
    const isEnabled = await tweetButton.isEnabled();
    
    if (isEnabled) {
        await tweetButton.click(); // Click if enabled
        console.log('Tweet posted successfully!');
        return true;
    } else {
        console.log('Tweet button is disabled, cannot post.');
    }

    // Wait after posting if necessary
    await sleep(2000 + Math.random() * 1000);
    } catch (e) {
        console.log('Error occurred:', e);
    }
     
    } catch (error) {
        console.error('Error during Twitter automation:', error);
    } finally {
        await sleep(2000 + Math.random() * 1000);
        await driver.quit();
    }
}

// automateTwitterPost(credentials);