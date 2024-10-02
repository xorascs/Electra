// ==UserScript==
// @name        Electra bot
// @namespace   Violentmonkey Scripts
// @match       https://tg-app-embed.electra.trade/*
// @grant       none
// @version     1.0
// @author      -
// @description 29.09.2024, 13:09:16
// @downloadURL  https://github.com/xorascs/Electra/blob/main/electra.js
// @updateURL    https://github.com/xorascs/Electra/blob/main/electra.js
// @homepage     https://github.com/xorascs/Electra
// ==/UserScript==

function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

function waitForElement(selector, callback) {
    const element = document.querySelector(selector);
    if (element) {
      callback(element);
    } else {
      setTimeout(() => waitForElement(selector, callback), 500);
    }
}

function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function simulateEvent(element, eventType, eventData) {
    const event = new PointerEvent(eventType, {
        isTrusted: true,
        bubbles: true,
        cancelable: true,
        pointerId: eventData.pointerId || 1,
        width: eventData.width || 1,
        height: eventData.height || 1,
        pressure: eventData.pressure || 0.5,
        clientX: eventData.clientX || 0,
        clientY: eventData.clientY || 0,
        screenX: eventData.screenX || 0,
        screenY: eventData.screenY || 0,
    });
    element.dispatchEvent(event);
}

function collectDaily() {
    waitForElement('div[class="_contentContainer_vzp6z_7"] > div > div', async (message) => {
        message.children[3].click();
    });
}

function collectFarming() {
    waitForElement('div[class="_modalOkButton_4o2x0_72"] > div', (okButton) => {
        okButton.click();
    })
}

function farming() {
    waitForElement('div[class="_pointCounterContainer_4o2x0_18 _slideInBottom_u90n2_1"] > div', async (collectButton) => {
        collectButton.click();
        await sleep(3000);
        collectButton.click();
        await sleep(3000);

        waitForElement('div[class="_buttonContainer_1kyar_112"]', (buttonsTab) => {
            let rnd = getRandomInt(0, 1)
            buttonsTab.children[rnd].click();
        })
    });
}

async function playGame() {
    if (!document.querySelector('div[class="_button_1ybqa_1 _primary_1ybqa_17 _disabled_1ybqa_21 "]')) {
        const canvas = document.querySelector('#react-unity-webgl-canvas-1');
        const eventData = {
            screenX: canvas.width,
            screenY: canvas.height,
            clientX: canvas.width / 2,
            clientY: canvas.height,
            pressure: 0.5,
            pointerId: 1
        };
        while (true) {  // Use while(true) for an infinite loop
            simulateEvent(canvas, 'pointerdown', eventData);
            simulateEvent(canvas, 'mousedown', eventData);

            simulateEvent(canvas, 'pointermove', eventData);
            simulateEvent(canvas, 'mousemove', eventData);

            simulateEvent(canvas, 'pointerup', { ...eventData, pressure: 0 });
            simulateEvent(canvas, 'mouseup', { ...eventData, pressure: 0 });

            simulateEvent(canvas, 'click', { ...eventData, pressure: 0 });

            let rnd = getRandomInt(50, 120)
            await sleep(rnd);  // Await the sleep function to pause execution
        }
    }
    else {
        console.log('Game is already completed!')
    }
}

async function start() {
    await sleep(5000);

    if (document.querySelector('div[class="_contentContainer_vzp6z_7"] > div > div')) {
        collectDaily();
    }

    await sleep(2000);

    waitForElement('div[class="_container_zkqhk_1 "]', (navBar) => {
        navBar.children[0].click();
    })

    if (document.querySelector('div[class="_modalOkButton_4o2x0_72"]')) {
        collectFarming();
    }

    await sleep(2000);

    farming();

    await sleep(10000);

    waitForElement('div[class="_container_zkqhk_1 "]', (navBar) => {
        navBar.children[1].click();
    })

    await sleep(5000);

    await playGame();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
} else {
    start();
}
