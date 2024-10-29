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




// const credentials = {
//     'email': 'ofosuemerald@gmail.com',
//     'password': 'emeraldofosu2022',
//     'username': 'OfosuEmerald'
// }

// const gmail = 'ofosuemerald@gmail.com'
// const password = 'emeraldofosu2022'
// const username = 'OfosuEmerald'

// const content = 'What is happening?!'

const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

const getRandomDelay = () => Math.floor(Math.random() * (180000 - 120000 + 1) + 120000);

export async function automateTwitterPost(credentials, content) {
    // // headfull config
    // const options = new Options()
    //     .windowSize({ width: 1920, height: 1080 })
    //     .addArguments('--disable-dev-shm-usage')
    //     .addArguments('--disable-gpu')
    //     .addArguments('--disable-blink-features=AutomationControlled')
    //     .addArguments(`--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36`);

    // const driver = await new Builder()
    //     .forBrowser('chrome')
    //     .setChromeOptions(options)
    //     .build();

    // Headless configs
    const options = new Options()
            .windowSize({ width: 1920, height: 1080 })
            .addArguments('--headless=new') // Use new headless mode
            .addArguments('--disable-dev-shm-usage')
            .addArguments('--disable-gpu')
            .addArguments('--no-sandbox')
            .addArguments('--disable-setuid-sandbox')
            .addArguments('--disable-blink-features=AutomationControlled')
            .addArguments('--disable-web-security')
            .addArguments('--allow-running-insecure-content')
            .addArguments('--lang=en-US')
            .addArguments(`--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36`);
    // Create a new instance of the Chrome driver
    const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

    async function typeWithRandomDelay(element, text) {
        // Ensure text is iterable
        await driver.wait(until.elementIsVisible(element), 1000000);
        await driver.wait(until.elementIsEnabled(element), 1000000);
    
        for (const char of text) {
            await element.sendKeys(char);
            await sleep(50 + Math.random() * 100);
        }
      }
    
    try {
        // Inject script to remove `navigator.webdriver`
        await driver.executeScript(`
            Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
        `);

        // Navigate to Twitter login
        await driver.get('https://x.com/i/flow/login');
        console.log('opened url...')
        await sleep(5000); // Adjust delay as needed

                // Login process
        const emailInput = await driver.wait(
            until.elementLocated(By.css('input[autocomplete="username"]')),
            10000000
        );
        await typeWithRandomDelay(emailInput, credentials.email);
        console.log('typed email...')
        await sleep(1000 + Math.random() * 5000);

        const nextButton = await driver.findElement(By.xpath("//button[@role='button' and contains(., 'Next')]"));
        await nextButton.click();
        console.log('next clicked...')
        await sleep(2000 + Math.random() * 1000);

    //    Handle username if prompted
        try {
            const usernameInput = await driver.wait(
                until.elementLocated(By.xpath('//input[@data-testid="ocfEnterTextTextInput"]')),
                1000
            );

            if (usernameInput) {
                await typeWithRandomDelay(usernameInput, credentials.username);
                console.log('username typed...')
                await sleep(1000 + Math.random() * 500);

                // Locate the "Next" button
                const nextUsernameButton = await driver.findElement(
                    By.xpath('//button[@data-testid="ocfEnterTextNextButton"]')
                );
                

                // Check if the button is enabled before clicking
                const isEnabled = await nextUsernameButton.isEnabled();
                
                if (isEnabled) {
                    await nextUsernameButton.click(); // Click if enabled
                    console.log('next clicked...')
                    await sleep(2000 + Math.random() * 1000);
                } else {
                    console.log('Next button is disabled, continuing...');
                }
            } else {
                console.log('No username prompt, continuing...');
            }

        } catch (error) {
            console.log()
        }
            

        // Enter password
        try {
            // Enter password
            console.log('Waiting for password input...');
            const passwordInput = await driver.wait(
                until.elementLocated(By.xpath('//input[@type="password" and @autocomplete="current-password"]')),
                1000000
            );
        
            // Ensure the password input is focused
            await passwordInput.click(); // Click to focus on it
            await typeWithRandomDelay(passwordInput, credentials.password);
            console.log('password typed...');
            await sleep(1000 + Math.random() * 500);
        
        } catch (error) {
            console.log('Error entering password:', error);
        }
       

        // Check for the login button and its state
        const loginButton = await driver.findElement(
            By.xpath('//button[@data-testid="LoginForm_Login_Button"]')
        );

        const isEnabled = await loginButton.isEnabled();

        if (isEnabled) {
            await loginButton.click();  
            console.log('Login clicked...')
        } else {
            console.log('Login button is disabled, trying to log in with Enter key instead.');
            const actions = driver.actions({ async: true });
            await actions.sendKeys(Key.ENTER).perform();  // Fallback to Enter key
            console.log('Login entered...')
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

        
    // Replace your tweet posting section with this:
        try {
            console.log('Logged in successful, waiting for tweet input....')
            const tweetInput = await driver.wait(
                until.elementLocated(By.css('div[data-testid="tweetTextarea_0_label"]')),
                2000000
            );
            console.log('waiting for tweet input....')
        
            await driver.wait(until.elementIsVisible(tweetInput), 10000);
            console.log('visible tweet input....')
            await driver.wait(until.elementIsEnabled(tweetInput), 10000);
            console.log('enabled tweet input....')
            
            // Sanitize and encode content for JavaScript execution
            const sanitizedContent = content
                .replace(/\\/g, '\\\\')
                .replace(/'/g, "\\'")
                .replace(/"/g, '\\"')
                .replace(/\n/g, '\\n');
            
            // Try multiple methods to input text with emoji support
            try {
                console.log('attempting to input tweet....')
                // Method 1: Using executeScript with sanitized content
                await driver.executeScript("arguments[0].click();", tweetInput);
                await driver.executeScript(`
                    arguments[0].textContent = '${sanitizedContent}';
                    arguments[0].dispatchEvent(new InputEvent('input', {
                        bubbles: true,
                        cancelable: true,
                        inputType: 'insertText',
                        data: '${sanitizedContent}'
                    }));
                `, tweetInput);
            } catch (error) {
                console.log('Direct input failed, trying character by character...');
                try {
                    // Method 2: Character by character input
                    await driver.executeScript("arguments[0].click();", tweetInput);
                    await sleep(1000);
                    
                    // Split content into array of characters (including emoji)
                    const chars = [...content];
                    for (const char of chars) {
                        await tweetInput.sendKeys(char);
                        await sleep(50);
                    }
                } catch (error) {
                    // Method 3: Final fallback using sendKeys
                    await driver.executeScript("arguments[0].click();", tweetInput);
                    await sleep(1000);
                    await tweetInput.sendKeys(content);
                }
            }
            
            await sleep(5000);
            // Copy content to clipboard
            // await copyToClipboard(content);
            // console.log('content copied to clipboard...')
            // await sleep(2000);

            // // Click and paste content
            // await tweetInput.click();
            // await tweetInput.sendKeys(Key.CONTROL + 'v');
            // console.log('tweet pasted...')
            // await sleep(2000);

            // Try multiple methods to locate and click the tweet button
            try {
                // Method 1: Direct click
                console.log('tweet inputted, waiting for button to post')
                const tweetButton = await driver.wait(
                    until.elementLocated(By.css('[data-testid="tweetButtonInline"]')),
                    10000
                );
                await driver.executeScript("arguments[0].click();", tweetButton);
                console.log('Tweet posted via JavaScript click');
            } catch (error) {
                console.log('First method failed, trying alternative...');
                try {
                    // Method 2: Force click via JavaScript
                    const button = await driver.findElement(By.css('[data-testid="tweetButtonInline"]'));
                    await driver.executeScript(`
                        var event = new MouseEvent('click', {
                            'view': window,
                            'bubbles': true,
                            'cancelable': true
                        });
                        arguments[0].dispatchEvent(event);
                    `, button);
                    console.log('Tweet posted via custom event');
                } catch (error) {
                    console.log('Second method failed, trying final alternative...');
                    try {
                        // Method 3: Using keyboard shortcuts
                        await driver.actions()
                            .keyDown(Key.CONTROL)
                            .sendKeys(Key.RETURN)
                            .keyUp(Key.CONTROL)
                            .perform();
                        console.log('Tweet posted via keyboard shortcut');
                    } catch (error) {
                        console.error('All posting methods failed:', error);
                    }
                }
            }

            // Wait to confirm post
            await sleep(5000);
            console.log('Tweet posted successfully!');
            
            return true;
        } catch (e) {
            console.log('Error occurred:', e);
            return false;
        }
     
    } catch (error) {
        console.error('Error during Twitter automation:', error);
    } finally {
        await sleep(2000 + Math.random() * 1000);
        await driver.quit();
    }
}

// automateTwitterPost(credentials);