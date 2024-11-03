// ==UserScript==
// @name        Electra bot
// @namespace   Violentmonkey Scripts
// @match       https://tg-app-embed.electra.trade/*
// @grant       none
// @version     1.1
// @author      -
// @description 29.09.2024, 13:09:16
// @downloadURL  https://raw.githubusercontent.com/xorascs/Electra/refs/heads/main/electra.js
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

function returnButton(el, text, way) {
    for (let i = 0; i < document.querySelectorAll(el).length; i++) {
      if (way == 0) {
        if (document.querySelectorAll(el)[i].innerText == text) {
            return document.querySelectorAll(el)[i];
        }
      }
      else {
        if (document.querySelectorAll(el)[i].innerText.includes(text)) {
            return document.querySelectorAll(el)[i];
        }
      }
    }
}

function collectDaily() {
    waitForElement('div[class="_contentContainer_vzp6z_7"] > div > div', async (message) => {
        message.children[3].click();
    });
}

function collectFarming() {
    let collectButton = returnButton('div', 'Ok', 0);
    if (collectButton) {
      collectButton.children[0].click();
    }
}

async function farming() {
    let collectButton = returnButton('span', 'Получить');
    if (collectButton) {
        collectButton.click();
        await sleep(3000);
    }

    let startFarmText = returnButton('p', 'Начать');
    if (startFarmText) {
      startFarmText.parentNode.parentNode.click();
      await sleep(3000);
    }

    let buttonsTab = returnButton('div', 'Цена идет ВВЕРХ', 0)
    if (buttonsTab) {
      let rnd = getRandomInt(0, 1)
        buttonsTab.parentNode.children[rnd].click();
    }

}

async function playGame() {
    let sign = returnButton('span', '0h 0m', 0);
    if (sign) {
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
    console.log("Script started!");
    await sleep(5000);

    if (document.querySelector('div[class="_contentContainer_vzp6z_7"] > div > div')) {
        collectDaily();
    }

    await sleep(2000);

    waitForElement('div[class="_container_zkqhk_1 "]', (navBar) => {
        navBar.children[0].click();
    })

    let sign = returnButton('p', 'Цена BTC пошла');
    if (sign) {
      collectFarming();
    }

    await sleep(2000);

    await farming();

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