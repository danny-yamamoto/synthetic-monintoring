// Copyright 2023 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// [START monitoring_synthetic_monitoring_custom_puppeteer_script]
const { instantiateAutoInstrumentation, runSyntheticHandler } = require('@google-cloud/synthetics-sdk-api');
// Run instantiateAutoInstrumentation before any other code runs, to get automatic logs and traces
instantiateAutoInstrumentation();
const functions = require('@google-cloud/functions-framework');
const axios = require('axios');
const assert = require('node:assert');
const puppeteer = require('puppeteer');


functions.http('CustomPuppeteerSynthetic', runSyntheticHandler(async ({logger, executionId}) => {

    // Launch a headless Chrome browser and open a new page
    let browser = null;
    const url = "https://www.retail-ai.jp/";
    try {
        browser = await puppeteer.launch({ headless: 'new', timeout: 0});
        const page = await browser.newPage();
    
        // Navigate to the target URL
        const start = performance.now();
        const result = await page.goto(url, {waitUntil: 'load'});
        const end = performance.now();
        logger.info(`Page load time for ${url}: ${(end - start).toFixed(2)} milliseconds`);
    
        // Confirm successful navigation
        await assert.equal(result.status(), 200);
    
        // Print the page title to the console
        const title = await page.title();
        logger.info(`Page title: ${title} ` + executionId);
    
        // Close the browser
        await browser.close();
    } catch (error) {
        logger.error(`Error navigating to ${url}:`, error)
    } finally {
        if (browser !== null) {
            await browser.close();
        }
    }
}));

// [START monitoring_synthetic_monitoring_custom_puppeteer_script]
