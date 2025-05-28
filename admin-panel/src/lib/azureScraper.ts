import { AZURE_OPENAI_EMAIL, AZURE_OPENAI_PASSWORD } from '@/config/apiConfig';
import puppeteer from 'puppeteer';

export const getAzureOPenAIUsage = async () : Promise<any> => {

    let browser;

    try{

        browser = await puppeteer.launch({
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--window-size=1600,900' // Set width to 1600px and height to 900px
            ],
            headless: true, // Keep it visible for debugging
            defaultViewport: {
                width: 1600,  // Wider screen
                height: 900
            }
        })

        const page = await browser.newPage();

        await page.goto('https://www.microsoftazuresponsorships.com/', { waitUntil: 'networkidle2' });

        // Click "Sign In" and wait for navigation to Microsoft login
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle2' }),
            page.click('#sign-out-controler-wrapper a')
        ]);

        // Wait and type email
        await page.waitForSelector('#i0116', { timeout: 60000 });
        await page.type('#i0116', AZURE_OPENAI_EMAIL); // Replace with your email

        // Click Next
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle2' }),
            page.click('#idSIButton9')
        ]);

        // Wait for the password input to appear
        await page.waitForSelector('#passwordEntry', { timeout: 10000 });

        // Type your password into the field
        await page.type('#passwordEntry', AZURE_OPENAI_PASSWORD); // Replace with your password

        // Optional: Click "Sign in" or press Enter to submit
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle2' }),
            page.click('[data-testid="primaryButton"]')
        ]);

        // Optional: wait for "Stay signed in?" screen text to appear
        await page.waitForFunction(() => {
            return document.body.innerText.includes('Stay signed in?');
        }, { timeout: 10000 });

        // Click the "Yes" button
        await page.waitForSelector('[data-testid="primaryButton"]');
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle2' }),
            page.click('[data-testid="primaryButton"]')
        ]);

        // Wait for usage dashboard to load
        await page.waitForSelector('.body-content', { timeout: 15000 });

        const usageData = await page.evaluate(() => {
            // @ts-ignore to suppress modelData TS error
        // This runs inside browser context
            const data = (window as any).modelData;

            return {
                email: data.AccountOwnerId,
                company: data.Company,
                statusText: data.IsActive
                    ? `Active - Offer expiring in ${(() => {
                            const start = new Date();
                            const end = new Date(data.EndDate);
                            const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
                            return diff + ' days';
                        })()}`
                    : 'Inactive',
                totalCredit: data.MonetaryCap?.toString(),
                usedCredit: data.ToDateRegistrationTotalPrice?.toString(),
                remainingCredit: data.RemainingBalance?.toString(),
                activeSubscriptions: data.ActiveSubscriptionCount?.toString(),
                usageStartDate: new Date(data.StartDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
                usageEndDate: new Date(data.EndDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
                usageNote: `Based on usage through ${new Date(data.ProgressSnapshotEffectiveDate).toLocaleDateString('en-US')}`
            };
        });

        return usageData;

    }catch (error) {
        console.error('Error launching browser or navigating to page:', error);
        return new Response(JSON.stringify({ error: 'Failed to retrieve Azure OpenAI usage data' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }finally {
        if (browser) {
            await browser.close();
        }
    }
}