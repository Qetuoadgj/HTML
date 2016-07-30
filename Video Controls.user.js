// ==UserScript==
// @name         Video Controls
// @version      1.0.2
// @description  Pure JavaScript version.
// @author       Ægir
// @match        http://*.www.ex.ua/show/*
// @match        https://*.googlevideo.com/videoplayback?id=*
// @match        http://*.spankbang.com/*/*/*-240p.mp4?*
// @match        http://*.spankbang.com/*/*/*-360p.mp4?*
// @match        http://*.spankbang.com/*/*/*-480p.mp4?*
// @match        http://*.spankbang.com/*/*/*-720p.mp4?*
// @match        http://*.spankbang.com/*/*/*-1080p.mp4?*
// @match        http://*.porndoe.com/movie/*/*/*/*/*/*/*.mp4?*
// @match        http://*.porntrex.com/media/videos/*/*.mp4
// @grant        none
// @updateURL    https://github.com/Qetuoadgj/HTML/raw/master/Video%20Controls.user.js
// @icon         https://www.google.com/s2/favicons?domain=ex.ua
// ==/UserScript==

(function() {
  'use strict';

  // Your code here...
  function waitForElement(elementSelector, attributeName, funcToRun, cycleDelay, maxTries) {
    if (funcToRun && (typeof funcToRun).toLowerCase() == "function") {
      cycleDelay = cycleDelay || 10; maxTries = maxTries || 100; var cycleCount = 0, keepRun = true; var element, value;
      setTimeout(function waitForElementCycle() {
        if (maxTries) {keepRun = (cycleCount < maxTries);}
        if (keepRun) {
          element = document.querySelector(elementSelector);
          if (attributeName) {
            if (element) {value = element.getAttribute(attributeName);}
            if (value && value !== '') {return funcToRun();} else {setTimeout(waitForElementCycle, cycleDelay);}
          } else {
            if (element) {return funcToRun();} else {setTimeout(waitForElementCycle, cycleDelay);}
          }
          cycleCount += 1;
        }
      }, cycleDelay);
    }
  }

  function addGlobalStyle(css, cssClass) {
    var head = document.getElementsByTagName('head')[0]; if (!head) {return;}
    var style = document.createElement('style'); style.type = 'text/css'; style.innerHTML = css;
    if (cssClass) style.setAttribute('class', cssClass);
    head.appendChild(style);
  }

  function MouseWheelAudioControl(media, step) {
    step = step || 1;

    var volumeText = document.createElement('div');
    volumeText.style.color = 'yellow'; volumeText.style['font-size'] = '72px';
    volumeText.style.position = 'absolute'; volumeText.style['z-index'] = 2147483647; // Always on TOP
    volumeText.style.top = '0px'; volumeText.style.left = '18px';
    media.parentNode.insertBefore(volumeText, media.nextSibling);

    var MouseWheelAudioHandler = function(e) {
      // cross-browser wheel delta
      e = window.event || e; // old IE support
      var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
      var vol =  Math.max(0, Math.min(100, media.volume*100 + delta*step)); vol = Math.floor(vol/step)*step; vol = vol/100;
      media.volume = vol;
      volumeText.textContent = (function(){if(Math.round(vol*100) > 0){return Math.round(vol*100);}else{return 'Выкл.';}})();

      function volumeTextFade(){
        volumeText.style.opacity = 0;
        volumeText.style.transition = 'opacity 2s';
        volumeText.style['-webkit-transition'] = 'opacity 2s'; // Safari
      }
      volumeText.style.transition = '';
      volumeText.style['-webkit-transition'] = ''; // Safari
      volumeText.style.opacity = 1; setTimeout(volumeTextFade, 2000);

      e.preventDefault();
      return false;
    };

    if (media.addEventListener) {
      media.addEventListener("mousewheel", MouseWheelAudioHandler, false); // IE9, Chrome, Safari, Opera
      media.addEventListener("DOMMouseScroll", MouseWheelAudioHandler, false); // Firefox
    } else {
      media.attachEvent("onmousewheel", MouseWheelAudioHandler); // IE 6/7/8
    }
  }

  function ResizeVideo() {
    var videoFrame = document.querySelector('body > video');
    // var html = document.querySelector('html'); html.innerHTML = '';
    // var body = document.querySelector('body'); body.appendChild(videoFrame);
    // addGlobalStyle('video {position: fixed; width: 100%; height: 100%; max-height: 100%; max-width: 100%;}');
    MouseWheelAudioControl(videoFrame, 5);
    videoFrame.play();
    videoFrame.volume = 0.5;
  }

  var pageHost = location.hostname, pageURL = location.href, pageTitle = document.title;
  // if ( pageURL.match(/.*?www.ex.ua/i) ) {
  waitForElement('body > video', false, ResizeVideo, 250, 30);
  // }
})();
