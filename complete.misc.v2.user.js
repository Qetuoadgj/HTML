// ==UserScript==
// @name         complete.misc.v2
// @icon         https://www.google.com/s2/favicons?domain=jquery.com
// @namespace    complete.misc
// @version      2.0.64
// @description  try to take over the world!
// @author       You
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/Misc/complete.misc.v2.user.js
// @homepageURL  https://github.com/Qetuoadgj/JavaScript/tree/master/Misc
// @run-at       document-start
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @match        file:///*/2.*.*.html*
// @match        *://www.eporner.com/hd-porn/*/*/
// @match        *://www.eporner.eu/hd-porn/*/*/
// @match        *://www.eporner.com/embed/*
// @match        *://yespornplease.com/v/*
// @match        *://yespornplease.com/view/*
// @match        *://e.yespornplease.com/v/*
// @match        *://vshare.io/v/*
// @exclude      *://vshare.io/v/404/*
// @match        *://www.porntrex.com/video/*/*
// @match        *://www.porntrex.com/*
// @match        *://sxyprn.com/post/*.html*
// @match        *://*.pornhub.com/*
// @match        *://*.pornhub.com/view_video.php?viewkey=*
// @match        *://www.pornhub.com/embed/*
// @match        *://www.playvids.com/*/*
// @match        *://www.pornoeggs.com/*
// @match        *://www.youjizz.com/videos/*.html
// @match        *://www.veporns.com/video/*
// @match        *://openload.co/embed/*
// @match        *://oload.download/embed/*
// @match        *://oload.stream/embed/*
// @match        *://oload.info/embed/*
// @match        *://oload.life/embed/*
// @match        *://oload.xyz/embed/*
// @match        *://oload.biz/embed/*
// @match        *://oload.tv/embed/*
// @match        *://www.jjgirls.com/pornpics/*
// @match        *://jjgirls.com/pornpics/*
// @match        *://www.babesandstars.com/*/*/*/
// @match        *://www.definebabe.com/gallery/*
// @match        *://hqporner.com/hdporn/*.html
// @match        *://mydaddy.cc/video/*
// @match        *://www.sex.com/picture/*/
// @match        *://www.sex.com/pin/*/
// @match        *://www.sex.com/*
// @match        *://www.pornpics.com/*

// @match        *://biqle.ru/watch/*
// @match        *://daftsex.com/watch/*
// @match        *://daxab.com/player/*

// @match        *://www.pornesq.com/video/*/*
// @match        *://www.pornesq.com/embed/*

// @match        *://www.porngo.com/videos/*/*
// @match        *://txxx.com/videos/*/*
// @match        *://txxx.com/embed/*
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var G_debugMode = 0;
    // ================================================================================
    var G_pageHost = location.hostname,
        G_pageURL = location.href,
        G_pageTitle = document.title,
        G_shortURL = (location.protocol + '//' + location.host + location.pathname).trim(),
        G_pageDomain = /*window.*/ location.host.replace(/.*\.(.*\..*)/, '$1')
    ;
    // ================================================================================
    function log(showAlert, ...args) {
        // console.log(args);
        var string = args.join(' ').replace(/\n[\t ]/g, '\n');
        console.log(string);
        if (showAlert) alert(string);
    }
    // ================================================================================
    var G_userLang = navigator.language || navigator.userLanguage;
    var G_userLangShort = G_userLang.substr(0, 2);
    document.documentElement.lang = G_userLangShort; // disable "Google Translate Page" prompt
    // ================================================================================
    var G_funcToTest, G_funcToRun, G_funcResult, G_delay = 100, G_tries = 50, G_timerGroup = [];
    function waitForCondition(funcToTest = false, funcToRun = false, delay = 50, tries = 5, timerGroup = []) {
        let funcText = funcToTest.toString().replace(/\n+[ ]{4}/g, '').replace(/[{][ ]{4,}/g, '{').replace(/[ ]{4,}[}]/g, '}');
        // --------------------------------------------------------------------------------
        if ((funcToTest && (typeof funcToTest).toLowerCase() == 'function' && funcToRun && (typeof funcToRun).toLowerCase() == 'function')) {
            var timerGroupIndex = timerGroup.length;
            // --------------------------------------------------------------------------------
            function startIteration(iteration, delay, count, timerGroup, timerGroupIndex) {
                var timer = setTimeout(iteration, delay, ++count); // setTimeout() iteration repeater variable
                if (timerGroup) timerGroup[timerGroupIndex] = timer; // add timer to timerGroup
            };
            // --------------------------------------------------------------------------------
            function clearTimers(timerGroup) {for (let timer of timerGroup) {clearTimeout(timer);}};
            // --------------------------------------------------------------------------------
            function iteration(count) {
                if (tries && (count < tries)) {
                    /*var*/ G_funcResult = funcToTest();
                    if (G_funcResult) {
                        let state = 'SUCCESS'; log(G_debugMode, location.href, '\niteration', count, ':', state, '(', G_funcResult, ')', '\n' + funcText);
                        clearTimers(timerGroup);
                        funcToRun();
                        return;
                    }
                    else {
                        let state = 'keepRun'; log(0, location.href, '\niteration', count, ':', state, '(', G_funcResult, ')', '\n' + funcText);
                        startIteration(iteration, delay, count, timerGroup, timerGroupIndex);
                    };
                }
                else {
                    let state = 'FAIL'; log(G_debugMode, location.href, '\niteration', count, ':', state, '(', G_funcResult, ')', '\n' + funcText);
                    // console.trace();
                }
            };
            // --------------------------------------------------------------------------------
            iteration(1); // launch 1st iteration
        }
        // --------------------------------------------------------------------------------
    };
    function waitForElement(elementSelector, attribute, funcToRun, delay, tries, timerGroup) {
        // --------------------------------------------------------------------------------
        var funcToTest = function () {
            console.log('elementSelector:', elementSelector, '\nattribute:', attribute);
            var result, elementsArray = document.querySelectorAll(elementSelector);
            for (let element of elementsArray) {
                var value = element ? element.getAttribute(attribute) : null;
                result = attribute ? value : element;
                if (result && result !== '') {
                    G_funcResult = element;
                    break;
                }
            }
            if (!result) {
                // console.trace();
            }
            return result;
        };
        // --------------------------------------------------------------------------------
        waitForCondition(funcToTest, funcToRun, delay, tries, timerGroup);
    };
    // ================================================================================
    G_funcToTest = function(){return 1;};
    G_funcToRun = function(){alert(G_funcResult);};
    // waitForCondition(G_funcToTest, G_funcToRun, G_delay, G_tries, G_timerGroup);
    // waitForElement('video > source[src^="http"], video[src^="http"], video', 'src', G_funcToRun, G_delay, G_tries, G_timerGroup);
    // ================================================================================
    var G_matchedLink;
    // ================================================================================
    String.prototype.matchLink = function(link, flags) {
        var result = this.match(new RegExp(link.replace(/[.\/]/g, "\\$&").replace(/\*/g, ".*"), flags));
        if (result) G_matchedLink = 'matchLink: ' + link + (flags ? ' ; flags: ' + flags : '');
        return result;
    };
    // ================================================================================
    Element.prototype.appendElement = function (stickTo, stickPosition = 0) {
        if (stickPosition > 0) stickTo.parentNode.insertBefore(this, stickTo.nextSibling);
        else if (stickPosition < 0) stickTo.parentNode.insertBefore(this, stickTo);
        else stickTo.appendChild(this);
    };
    String.prototype.capitalize = function() {
        function capFirst(str) { return str.length === 0 ? str : str[0].toUpperCase() + str.substr(1); }
        return this.split(' ').map(capFirst).join(' ');
    };
    String.prototype.toTitleCase = function(lower) {
        var string = lower ? this.toLowerCase() : this;
        var smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|vs?\.?|via)$/i;
        return string.replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g, function (match, index, title) {
            if (index > 0 && index + match.length !== title.length &&
                match.search(smallWords) > -1 && title.charAt(index - 2) !== ":" &&
                (title.charAt(index + match.length) !== '-' || title.charAt(index - 1) === '-') &&
                title.charAt(index - 1).search(/[^\s-]/) < 0) {
                return match.toLowerCase();
            }
            if (match.substr(1).search(/[A-Z]|\../) > -1) {
                return match;
            }
            return match.charAt(0).toUpperCase() + match.substr(1);
        });
    };
    // ================================================================================
    var getAbsoluteUrl = (function () { var a; return function (url) { if (!a) a = document.createElement('a'); a.href = url; return a.href; }; })();
    // ================================================================================
    // expected hue range: [0, 360)
    // expected saturation range: [0, 1]
    // expected lightness range: [0, 1]
    function hslToRgb(hue, saturation, lightness) { // SOURCE: https://stackoverflow.com/questions/27653757/how-to-use-hsl-to-rgb-conversion-function/27663212#27663212
        var red, green, blue;
        // based on algorithm from http://en.wikipedia.org/wiki/HSL_and_HSV#Converting_to_RGB
        if (hue == undefined) return [0, 0, 0];
        var chroma = (1 - Math.abs((2 * lightness) - 1)) * saturation,
            huePrime = hue / 60,
            secondComponent = chroma * (1 - Math.abs((huePrime % 2) - 1))
        ;
        huePrime = Math.floor(huePrime);
        if (huePrime === 0) {red = chroma; green = secondComponent; blue = 0;}
        else if (huePrime === 1) {red = secondComponent; green = chroma; blue = 0;}
        else if (huePrime === 2) {red = 0; green = chroma; blue = secondComponent;}
        else if (huePrime === 3) {red = 0; green = secondComponent; blue = chroma;}
        else if (huePrime === 4) {red = secondComponent; green = 0; blue = chroma;}
        else if (huePrime === 5) {red = chroma; green = 0; blue = secondComponent;}
        var lightnessAdjustment = lightness - (chroma / 2);
        red += lightnessAdjustment;
        green += lightnessAdjustment;
        blue += lightnessAdjustment;
        return [Math.round(red * 255), Math.round(green * 255), Math.round(blue * 255)];
    };
    // --------------------------------------------------------------------------------
    function valToColor(percent = 100, clip = 0, saturation = 1.0, start = 0, end = 100, toRGB = 0) {
        percent = Math.min(percent, 160); end = Math.min(end, 100);
        var a = (percent <= clip) ? 0 : (((percent - clip) / (100 - clip))),
            b = Math.abs(end - start) * a,
            c = (end > start) ? (start + b) : (start - b);
        var h = c, s = saturation, l = 0.5;
        if (toRGB) {
            var rgb = hslToRgb(h, s, l);
            return 'rgb(' + rgb[0] + ', ' + rgb[1] + ', ' + rgb[2] + ')';
        }
        else {
            return 'hsl(' + h + ', ' + (s*100) + '%, ' + (l*100) + '%)';
        }
    };
    // ================================================================================
    function addGlobalStyle(css, cssClass) {
        var head = document.getElementsByTagName('head')[0];
        if (!head) return;
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        if (cssClass) style.setAttribute('class', cssClass);
        head.appendChild(style);
        return style;
    };
    // ================================================================================
    function addKeyComboCtrlC(targetElement, preventDefault, ignoreSelections) {
        var keyCodes = {'c' : 67};
        var onKeyDown = function (e) {
            e = e || window.event;
            var ctrlDown = e.ctrlKey || e.metaKey; // Mac support
            if (targetElement && ctrlDown && e.keyCode == keyCodes.c) {
                var selectedText = window.getSelection().toString();
                selectedText = ignoreSelections ? false : (selectedText && selectedText !== '');
                if (!selectedText) {
                    targetElement.select();
                    document.execCommand('copy');
                    if (preventDefault) e.preventDefault();
                }
            }
        };
        window.addEventListener('keydown', function (e) {onKeyDown(e);}, false);
    };
    // ================================================================================
    function toHHMMSS(secs) {
        var sec_num = parseInt(secs, 10);
        var hours = Math.floor(sec_num / 3600) % 24;
        var minutes = Math.floor(sec_num / 60) % 60;
        var seconds = sec_num % 60;
        return [hours,minutes,seconds].map(v => v < 10 ? "0" + v : v).filter((v,i) => v !== "00" || i > 0).join(":");
    };
    // ================================================================================
    function addMediaTextIndicator(media, fontSize) {
        fontSize = fontSize || 72;
        var mediaTextIndicator = document.createElement('div');
        mediaTextIndicator.style.setProperty('color', 'yellow', 'important');
        mediaTextIndicator.style['font-size'] = fontSize + 'px';
        mediaTextIndicator.style.position = 'absolute';
        mediaTextIndicator.style['z-index'] = 2147483647; // Always on TOP
        mediaTextIndicator.style.top = '0px';
        mediaTextIndicator.style.left = (fontSize/4) + 'px';
        media.parentNode.insertBefore(mediaTextIndicator, media.nextSibling);
        var volumeTextFade = function(fadeDelay) {
            fadeDelay = fadeDelay || 2000;
            var fadeDelaySeconds = Math.floor(fadeDelay/1000);
            function textFadeStart(show) {
                var transition = show ? '' : ('opacity '+fadeDelaySeconds+'s');
                mediaTextIndicator.style.opacity = show ? 1 : 0;
                mediaTextIndicator.style.transition = transition;
                mediaTextIndicator.style['-webkit-transition'] = transition; // Safari
            }
            textFadeStart(true);
            setTimeout(textFadeStart, fadeDelaySeconds*1000);
        };
        var setVolumeText = function() {
            volumeTextFade(2000);
            mediaTextIndicator.textContent = Math.round(media.volume * 100) > 0 ? Math.round(media.volume * 100) : 'Off';
        };
        var setTimeText = function() {
            volumeTextFade(2000);
            var duration = media.duration;
            var currentTime = media.currentTime;
            mediaTextIndicator.textContent = (toHHMMSS(currentTime) + "/" + toHHMMSS(duration));
        };
        var addEventHandlers = function() {
            if (media.addEventListener) {
                media.addEventListener("volumechange", setVolumeText, false); // IE9, Chrome, Safari, Opera
                media.addEventListener("seeking", setTimeText, false); // IE9, Chrome, Safari, Opera
            }
            else {
                media.attachEvent("onvolumechange", setVolumeText); // IE 6/7/8
                media.attachEvent("onseeking", setTimeText); // IE 6/7/8
            }
        };
        setTimeout(addEventHandlers, 10);
        return mediaTextIndicator;
    };
    // ================================================================================
    function msgbox(title, message, time = 2000, width = 250, height = 120) {
        var padding = 10;
        var w = width - padding*2,
            h = height - padding*2
        ;
        var centerX = function(e, fix) {
            var transform = e.style.transform;
            transform = transform + (fix ? 'translateY(0.5px) translateX(-50%)' : 'translateX(-50%)');
            e.style.left = 50 + '%';
            e.style['-ms-transform'] = transform;
            e.style['-moz-transform'] = transform;
            e.style['-webkit-transform'] = transform;
            e.style.transform = transform;
        };
        var centerY = function(e, fix) {
            var transform = e.style.transform;
            transform = transform + (fix ? 'translateX(0.5px) translateY(-50%)' : 'translateY(-50%)');
            e.style.top = 50 + '%';
            e.style['-ms-transform'] = transform;
            e.style['-moz-transform'] = transform;
            e.style['-webkit-transform'] = transform;
            e.style.transform = transform;
        };
        var fade = function(element, fadeDelay) {
            fadeDelay = fadeDelay || 2000;
            var fadeDelaySeconds = Math.floor(fadeDelay/1000);
            function fadeStart(show) {
                var transition = show ? '' : ('opacity '+fadeDelaySeconds+'s');
                element.style.opacity = show ? 1 : 0;
                element.style.transition = transition;
                element.style['-webkit-transition'] = transition; // Safari
                if (!show) setTimeout(function(){element.remove();}, fadeDelay);
            }
            fadeStart(true);
            setTimeout(fadeStart, fadeDelaySeconds*1000);
        };
        var d = document.createElement('div');
        d.style.display = 'table';
        d.style.position = 'fixed';
        d.style.right = 10 + 'px';
        d.style.bottom = 10 + 'px';
        d.style.maxWidth = 90 + '%';
        d.style.maxHeight = 90 + '%';
        // d.style.padding = padding + 'px';
        d.style.width = w + 'px';
        d.style.height = 'auto';
        d.style.minHeight = h + 'px';
        d.style.setProperty('background-color', 'white', 'important');
        d.style.border = '2px solid black';
        d.style.zIndex = 2147483647;
        document.body.appendChild(d);
        //
        // d.style.top = 50 + 'px';
        // centerX(d);
        //
        if (title) {
            var titleElement = document.createElement('p');
            titleElement.style.borderBottom = '1px solid black';
            titleElement.style.margin = 0;
            titleElement.style.padding = (padding/2) + 'px';
            titleElement.style.setProperty('background-color', '#4CAF50', 'important');
            titleElement.style.setProperty('color', 'white', 'important');
            titleElement.innerText = title;
            d.appendChild(titleElement);
        }
        if (message) {
            var messageElement = document.createElement('p');
            messageElement.style.margin = 0;
            messageElement.style.padding = (padding/2) + 'px';
            messageElement.style.display = 'table-row';
            messageElement.style.textAlign = 'center';
            messageElement.style.verticalAlign = 'middle';
            messageElement.style.setProperty('color', 'black', 'important');
            messageElement.style.setProperty('background-color', 'white', 'important');
            messageElement.innerText = message;
            d.appendChild(messageElement);
        }
        if (time) fade(d, time);
        return d;
    }
    // ================================================================================
    function mediaMouseControls(eventCatcher, media, step) {
        step = (step === 0) ? 0 : (step || 1);
        var mouseWheelAudioHandler = function(e) {
            if (step !== 0) {
                // cross-browser wheel delta
                e = window.event || e; // old IE support
                var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
                var amount = parseInt(delta*step), volume = parseInt(media.volume*100);
                var value = amount > 0 ? Math.floor((volume+amount)/step)*step : Math.ceil((volume+amount)/step)*step;
                media.volume = Math.max(0, Math.min(100, value)) / 100;
            }
            e.preventDefault();
        };
        var mouseWheelTimeHandler = function(e) {
            if (step !== 0) {
                // cross-browser wheel delta
                e = window.event || e; // old IE support
                var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
                var amount = parseInt(delta*step);
                var mediaState = media.paused ? 0 : 1;
                setTimeout(function() {
                    if (delta < 0) {
                        media.pause(); media.currentTime = parseInt(media.currentTime) - 5; if (mediaState == 1) media.play();
                    }
                    else if (delta > 0) {
                        media.pause(); media.currentTime = parseInt(media.currentTime) + 5; if (mediaState == 1) media.play();
                    }
                }, 10);
            }
            e.preventDefault();
        };
        if (media.addEventListener) {
            eventCatcher.addEventListener("mousewheel", mouseWheelTimeHandler, false); // IE9, Chrome, Safari, Opera
            eventCatcher.addEventListener("DOMMouseScroll", mouseWheelTimeHandler, false); // Firefox
        }
        else {
            eventCatcher.attachEvent("onmousewheel", mouseWheelTimeHandler); // IE 6/7/8
        }
        var mediaTextIndicator = addMediaTextIndicator(media, 56/2);
        mediaTextIndicator.style.top = '5px';
    };
    // ================================================================================
    function fixURLProtocol(URL) {
        if (!URL.match(/^http/)) {
            URL = location.protocol + '//' + URL.replace(/^\/\//, '');
        };
        return URL;
    }
    // ================================================================================
    function CreateLinksList(Haystack, NeedleRegEx, Replacement, StartNum, EndNum) {
        var Ret = [];
        if (Haystack.match(NeedleRegEx)) {
            var Result = Haystack.replace(NeedleRegEx, Replacement);
            StartNum = StartNum || 0; // StartNum > 1 ? StartNum : 1;
            EndNum = EndNum > StartNum ? EndNum : StartNum; // EndNum > 1 ? EndNum : 1;
            for (let i = StartNum; i <= EndNum; i++) {
                Ret[i] = fixURLProtocol(Result.replace('$NUM', i));
            }
            // console.log('G_posters:\n', G_posters);
            return Ret;
        }
    };
    // ================================================================================
    function injectNode(tagName, parentNode, innerHTML) {
        var e = document.createElement(tagName);
        if (typeof parentNode == "string") parentNode = document.querySelector(parentNode);
        parentNode.appendChild(e);
        if (innerHTML) e.innerHTML = innerHTML;
        return e;
    }
    // ================================================================================
    function getWindowVar(varName) {
        /* globals getVar */
        var script = injectNode('script', document.head, 'function getVar(varName){return window[varName];}');
        var result = getVar(varName);
        script.remove();
        return result;
    }
    // ================================================================================
    if (location.href.match('autoplay=true')) {
        GM_setValue('autoplay', true);
    };
    var duration = location.href.match(/\bt\b=((\d+)(,\d+)?)/);
    if (duration) {
        GM_setValue('t', duration[1]);
    };
    var qualityLimitMatch = location.href.match(/qualityLimit=(\d+)/);
    if (qualityLimitMatch) {
        GM_setValue('qualityLimit', parseInt(qualityLimitMatch[1])*1.1); // +10%
    };
    const G_qualityLimit = GM_getValue('qualityLimit', 9999);
    // ================================================================================
    function refineVideo(url, noPlayerExtension = false) {
        var autoplay = GM_getValue('autoplay', null), t = GM_getValue('t', null);
        console.log('autoplay: ' + autoplay || 'false');
        var url_base = url.split('?')[1] ? url.split('?')[0] : url,
            url_keys = url.split('?')[1] ? url.split('?')[1] : null
        ;
        if (autoplay) {
            if (url_keys) {if (!url_keys.match('&autoplay=true')) {url = url + '&autoplay=true';}}
            else {url = url + '?autoplay=true'; url_keys = url.replace(url_base, '');}
            GM_deleteValue('autoplay');
        }
        if (t) {
            console.log('t: ' + t);
            if (url_keys) {if (!url_keys.match('&t=' + t)) {url = url + '&t=' + t;}}
            else {url = url + '?t=' + t; url_keys = url.replace(url_base, '');}
            GM_deleteValue('t');
        }
        var isInstalled = document.documentElement.getAttribute('clean-media-page-extension-installed');
        var playerPath = 'chrome-extension://bbaidcdbgbiachhpighhjgbeahoikjbp/player.html';
        if (noPlayerExtension) {
            playerPath = location.protocol + '//' + G_pageDomain + '/v/404/';
            return playerPath + url;
        }
        return playerPath + '#' + url;
    };
    var openURL = function (url) {
        log(G_debugMode, 'openURL.url: ' + url);
        GM_deleteValue('contentURL');
        GM_deleteValue('qualityLimit');
        // if (TEST_MODE) return;
        /*window.*/ location.replace(url); // location.href = url;
    };
    // ================================================================================
    function eventFire(el, etype) {
        if (el.fireEvent) {
            el.fireEvent('on' + etype);
        }
        else {
            var evObj = document.createEvent('Events');
            evObj.initEvent(etype, true, false);
            el.dispatchEvent(evObj);
        };
    };
    // ================================================================================
    var G_embedCodeFrame, G_stickTo, G_stickPosition; function addEmbedCodeFrame() {
        var parentDocument = document;
        // --------------------------------------------------------------------------------
        var elementID = 'uniqueEmbedCodeFrame';
        for (let element of document.querySelectorAll('#' + elementID)) {element.remove();};
        // --------------------------------------------------------------------------------
        var element = parentDocument.createElement('div');
        element.setAttribute('id', elementID);
        element.style.setProperty('display', 'block', 'important');
        element.style['word-wrap'] = 'break-word';
        // --------------------------------------------------------------------------------
        element.appendElement(G_stickTo, G_stickPosition);
        // --------------------------------------------------------------------------------
        return element;
    };
    // --------------------------------------------------------------------------------
    const G_RenameTable = [
        'TeensLoveHugeCocks.com',
        'RealityKings.com',
        'Tiny4K.com',
        'Exotic4K.com',
        'Cum4K.com',
        'Vixen.com',
        'BangBros.com',
        'BigTitsRoundAsses.com',
        'EvilAngel.com',
        'BurningAngel.com',
        'TeenFidelity.com',
        'PornFidelity.com',
        'JulesJordan.com',
        'NaughtyAmerica.com',
        'MySistersHotFriend.com',
        'Passion-HD.com',
        'EroticaX.com',
        'DarkX.com',
        'HardX.com',
        'NubilesPorn.com',
        'NubileFilms.com',
        'PornPros.com',
        'TeamSkeet.com',
        'POVD.com',
        'CherryPimps.com',
        'Bang.com',
        'FamilyHookups.com',
        'MetroHD.com',
        'X-Art.com',
        'WowGirls.com',
        'RoccoSiffredi.com',
        '21Sextury.com',
        '21Naturals.com',
        'SexArt.com',
        'FetishNetwork.com',
        'BrutalPickups.com',
        'BrutalCastings.com',
        'HelplessTeens.com',
        'Spizoo.com',
        'KinkySpa.com',
        'YoungThroats.com',
        'CreampieAngels.com',
    ];
    function autoReplace(str) {
        str = str.trim().
        replace(/[,.\s]+(com)\b/g, '.$1').
        replace(/\s+,/g, ',').
        replace(/,\s+/g, ',').
        replace(/,+/g, ',').
        replace(/^,/g, '').
        replace(/,$/g, '').
        replace(/,/g, ', ').
        replace(/(\.com\b){2,}/g, '.com')
        ;
        //         const table = [
        //             'TeensLoveHugeCocks.com',
        //             'RealityKings.com',
        //             'Tiny4K.com',
        //             'Exotic4K.com',
        //             'Cum4K.com',
        //             'Vixen.com',
        //             'BangBros.com',
        //             'BigTitsRoundAsses.com',
        //             'EvilAngel.com',
        //             'BurningAngel.com',
        //             'TeenFidelity.com',
        //             'PornFidelity.com',
        //             'JulesJordan.com',
        //             'NaughtyAmerica.com',
        //             'MySistersHotFriend.com',
        //             'Passion-HD.com',
        //             'EroticaX.com',
        //             'DarkX.com',
        //             'HardX.com',
        //             'NubilesPorn.com',
        //             'NubileFilms.com',
        //             'PornPros.com',
        //             'TeamSkeet.com',
        //             'POVD.com',
        //             'CherryPimps.com',
        //             'Bang.com',
        //             'FamilyHookups.com',
        //             'MetroHD.com',
        //             'X-Art.com',
        //             'WowGirls.com',
        //             'RoccoSiffredi.com',
        //             '21Sextury.com',
        //             '21Naturals.com',
        //             'SexArt.com',
        //         ];
        for (let word of G_RenameTable) {
            let re = new RegExp(word.replace(/\./g, '\.'), 'gi');
            str = str.replace(re, word);
        };
        let a = [];
        for (let word of str.split(', ')) {
            if (typeof word !== 'undefined') {
                word = word.trim()
                if (word !== '') {
                    word = word[0].toUpperCase() + word.slice(1);
                    a.push(word);
                };
            };
        };
        str = a.join(', ');
        console.log(str);
        return str;
    };
    var G_embedCodeTextCategorie = GM_getValue('category', '') || '';
    var G_categories = {
        '.com' : '',
        'Anal' : '',
        '3some' : '',
        '4some' : '',
        'Orgy' : '',
        'Only blowjob' : '',
        'Creampie' : '',
        'Creampie, Cum in Pussy' : '',
        'Creampie, Cum in Ass' : '',
        'Fuck after Cumshot' : '',
        '★' : '',
        '-----------------------------' : '',
    };
    var G_embedCodeCatInput; function addEmbedCodeCatInput(embedCodeFrame) {
        var element0ID = 'uniqueEmbedCodeCatInputHolder';
        for (let element of document.querySelectorAll('#' + element0ID)) {element.remove();};
        var element0 = document.createElement('div');
        element0.setAttribute('id', element0ID);
        //         element0.style.background = 'red';
        element0.style.display = 'flex';
        element0.style.alignItems = 'center';
        // element0.style.border = '1px grey solid';
        element0.style.height = '26px';
        embedCodeFrame.appendChild(element0);
        // --------------------------------------------------------------------------------
        var elementID = 'uniqueEmbedCodeCatInput';
        for (let element of document.querySelectorAll('#' + elementID)) {element.remove();};
        // --------------------------------------------------------------------------------
        var element = document.createElement('input');
        element.setAttribute('id', elementID);
        element.style.setProperty('display', 'inline-block', 'important');
        element.style.border = 'none';
        element.style['background-color'] = 'transparent';
        element.style.width = '100%';
        element.style['max-width'] = '100%';
        // element.style.rows = '2';
        element.style.overflow = 'hidden';
        element.style['font-size'] = '12px';
        element.style.padding = '0px'; // '4px';
        element.style.color = G_embedCodeTextAreaColor;
        // element.setAttribute('readonly', 'readonly');
        // element.setAttribute('onclick', 'this.focus(); this.select();');
        element.placeholder = 'categories';
        element.autocomplete = 'on';
        G_embedCodeTextCategorie = G_embedCodeTextCategorie.trim();
        if (G_embedCodeTextCategorie !== '') element.value = G_embedCodeTextCategorie;
        element.addEventListener('change', function(e){
            G_embedCodeTextCategorie = e.target.value;
            /*.trim().
            replace(/[,.\s]+(com)\b/g, '.$1').
            replace(/\s+,/g, ',').
            replace(/,\s+/g, ',').
            replace(/,+/g, ',').
            replace(/^,/g, '').
            replace(/,$/g, '').
            replace(/,/g, ', ')
            ;
            */
            G_embedCodeTextCategorie = autoReplace(G_embedCodeTextCategorie);
            e.target.value = G_embedCodeTextCategorie;
            updateEmbedCodeText(G_embedCodeTextArea, 1, G_delimiter);
        }, false);
        // element.value = '';
        // --------------------------------------------------------------------------------
        element0.appendChild(element);
        // --------------------------------------------------------------------------------
        initSaveCategories(element);
        // --------------------------------------------------------------------------------
        /*
        <input type="text" list="browsers" />
<datalist id="browsers">
    <option value="Internet Explorer">
    <option value="Firefox">
    <option value="Chrome">
    <option value="Opera">
    <option value="Safari">
</datalist>
*/
        var element3ID = 'uniqueEmbedCodeCatData';
        for (let element of document.querySelectorAll('#' + element3ID)) {element.remove();};
        // --------------------------------------------------------------------------------
        var element3 = document.createElement('datalist');
        element3.setAttribute('id', element3ID);
        /*
        var l = {
        '.com' : '',
        'Anal' : '',
        '3some' : '',
        '4some' : '',
        'Orgy' : '',
        'Only blowjob' : '',
        'Creampie' : '',
        'Creampie, Cum in Pussy' : '',
        'Creampie, Cum in Ass' : '',
        'Fuck after Cumshot' : '',
        '★' : '',
        '-----------------------------' : '',
        };
        */
        for (let k of Object.keys(/*l*/ G_categories )) {
            let option = document.createElement('option');
            option.value = k;
            element3.appendChild(option);
            console.log(option);
        };
        let option = document.createElement('option');
        option.value = '-----------------------------';
        element3.appendChild(option);
        console.log(option);
        for (let word of G_RenameTable) {
            let option = document.createElement('option');
            option.value = word;
            element3.appendChild(option);
            console.log(option);
        };
        // --------------------------------------------------------------------------------
        var element2ID = 'uniqueEmbedCodeCatList';
        for (let element of document.querySelectorAll('#' + element2ID)) {element.remove();};
        // --------------------------------------------------------------------------------
        var element2 = document.createElement('input');
        element2.setAttribute('id', element2ID);
        element2.type = 'search';
        element2.style.display = 'inline';
        element2.style.width = '200px';
        element2.style.margin = '0 1px';
        element0.appendChild(element2);
        // --------------------------------------------------------------------------------
        element0.appendChild(element3);
        element2.setAttribute('list', element3ID);
        // --------------------------------------------------------------------------------
        var element4ID = 'uniqueEmbedCodeCatButtonAdd';
        for (let element of document.querySelectorAll('#' + element4ID)) {element.remove();};
        // --------------------------------------------------------------------------------
        var element4 = document.createElement('button');
        element4.setAttribute('id', element4ID);
        element4.style.display = 'inline-flex';
        element4.style.width = '40px';
        element4.style.margin = '0px'; //'0px 0px 0px 1px'
        element4.style.height = '26px';
        element4.style.position = 'relative';
        // element4.style.top = '-2px';
        //         element4.style['align-content'] = 'center';
        element4.style.justifyContent = 'center';
        element4.style.fontSize = '10px';
        /*
element.style {
    display: inline-flex;
    width: 20px;
    margin: 0px 0px 0px 1px;
    height: 20px;
    position: relative;
    top: -2px;
    place-content: center;
    align-content: center;
    justify-content: center;
    justify-items: center;
    font-size: 10px;
    padding: 0;
}
        */

        element4.innerHTML = '+';
        element0.appendChild(element4);
        // --------------------------------------------------------------------------------
        element4.onclick = function(e) {
            let value1 = element.value.trim();
            let value2 = element2.value.trim();
            let notInArray = true;
            if (value2 == '') {
                notInArray = false;
            }
            else {
                for (let word of value1.split(', ')) {
                    if (typeof word !== 'undefined') {
                        word = word.trim()
                        if (word !== '' && word.toLowerCase() == value2.toLowerCase()) {
                            notInArray = false;
                        };
                    };
                };
            };
            if (notInArray) {
                let a = [];
                for (let word of value1.split(', ')) {
                    if (typeof word !== 'undefined') {
                        word = word.trim()
                        if (word !== '') {
                            a.push(word);
                        };
                    };
                };
                a.push(value2);
                value1 = a.join(', ');
                element.value = value1;
                // Create a new 'change' event
                var event = new Event('change');
                // Dispatch it.
                element.dispatchEvent(event);
            };
            console.log(value1, notInArray);
            element2.value = '';
        };
        // --------------------------------------------------------------------------------
        var element5ID = 'uniqueEmbedCodeCatButtonRemove';
        for (let element of document.querySelectorAll('#' + element5ID)) {element.remove();};
        var element5 = element4.cloneNode(true);
        element5.innerHTML = '-';
        element.parentNode.insertBefore(element5, element2);
        element5.onclick = function(e) {
            let value1 = element.value.trim();
            let firstValue = value1.split(', ')[0];
            firstValue = firstValue ? firstValue.trim() : ''
            if (firstValue !== '') {
                element.value = firstValue;
                var event = new Event('change');
                element.dispatchEvent(event);
                element.value += ', ';
            };
        };
        // --------------------------------------------------------------------------------
        element.style.height = '100%'; element2.style.height = '100%'; // element4.style.height = '100%';
        element.style.width = 'calc(100% - ' + element2.style.width + ' - ' + element4.style.width + ' - 1px - ' + element5.style.width + ' - 1px)';
        element.style['max-width'] = element.style.width;
        // --------------------------------------------------------------------------------
        return element;
    };
    var G_embedCodeTextStart = '00:00:00';
    var G_embedCodeStartInput; function addEmbedCodeStartInput(embedCodeFrame) {
        var elementID = 'uniqueEmbedCodeStartInput';
        for (let element of document.querySelectorAll('#' + elementID)) {element.remove();};
        // --------------------------------------------------------------------------------
        var element = document.createElement('input');
        element.setAttribute('id', elementID);
        element.style.setProperty('display', 'block', 'important');
        element.style.border = 'none';
        element.style['background-color'] = 'transparent';
        element.style.width = '100%';
        element.style['max-width'] = '100%';
        // element.style.rows = '2';
        element.style.overflow = 'hidden';
        element.style['font-size'] = '12px';
        element.style.color = G_embedCodeTextAreaColor;
        // element.setAttribute('readonly', 'readonly');
        // element.setAttribute('onclick', 'this.focus(); this.select();');
        element.placeholder = '00:00:00';
        G_embedCodeTextStart = G_embedCodeTextStart.trim();
        if (G_embedCodeTextStart !== '') element.value = G_embedCodeTextStart;
        element.addEventListener('change', function(e){
            G_embedCodeTextStart = e.target.value;
            updateEmbedCodeText(G_embedCodeTextArea, 1, G_delimiter);
        }, false);
        // element.value = '';
        // --------------------------------------------------------------------------------
        embedCodeFrame.appendChild(element);
        // --------------------------------------------------------------------------------
        return element;
    };
    // --------------------------------------------------------------------------------
    var G_embedCodeTextImage = '';
    var G_embedCodeImageInput; function addEmbedCodeImageInput(embedCodeFrame) {
        var elementID = 'uniqueEmbedCodeImageInput';
        for (let element of document.querySelectorAll('#' + elementID)) {element.remove();};
        // --------------------------------------------------------------------------------
        var element = document.createElement('input');
        element.setAttribute('id', elementID);
        element.style.setProperty('display', 'block', 'important');
        element.style.border = 'none';
        element.style['background-color'] = 'transparent';
        element.style.width = '100%';
        element.style['max-width'] = '100%';
        // element.style.rows = '2';
        element.style.overflow = 'hidden';
        element.style['font-size'] = '12px';
        element.style.color = G_embedCodeTextAreaColor;
        // element.setAttribute('readonly', 'readonly');
        // element.setAttribute('onclick', 'this.focus(); this.select();');
        if (typeof G_posterURL !== 'undefined') {
            G_embedCodeTextImage = G_posterURL.trim();
        };
        if (G_embedCodeTextImage !== '') {
            element.value = G_embedCodeTextImage;
            element.placeholder = G_embedCodeTextImage;
        };
        element.addEventListener('change', function(e){
            G_embedCodeTextImage = e.target.value.trim();
            if (!G_embedCodeTextImage.match(/^http/)) {
                G_embedCodeTextImage = location.protocol + '//' + G_embedCodeTextImage.replace(/^\/\//, '');
                element.value = G_embedCodeTextImage;
            };
            //
            G_posterURL = G_embedCodeTextImage;
            G_embedCodePoster.setAttribute('src', G_posterURL);
            resizeEmbedCodePoster(1.0, 0.5, 5000);
            //
            updateEmbedCodeText(G_embedCodeTextArea, 1, G_delimiter);
            console.log('G_embedCodeTextImage:', G_embedCodeTextImage);
        }, false);
        // element.value = '';
        // --------------------------------------------------------------------------------
        embedCodeFrame.appendChild(element);
        // --------------------------------------------------------------------------------
        return element;
    };
    // --------------------------------------------------------------------------------
    var G_embedCodeTextArea, G_embedCodeTextAreaColor = 'grey'; function addEmbedCodeTextArea(embedCodeFrame) {
        var elementID = 'uniqueEmbedCodeTextArea';
        for (let element of document.querySelectorAll('#' + elementID)) {element.remove();};
        // --------------------------------------------------------------------------------
        var element = document.createElement('textarea');
        element.setAttribute('id', elementID);
        element.style.setProperty('display', 'block', 'important');
        element.style.border = 'none';
        element.style['background-color'] = 'transparent';
        element.style.width = '100%';
        element.style['max-width'] = '100%';
        element.style.rows = '2';
        element.style.overflow = 'hidden';
        element.style['font-size'] = '12px';
        element.style.color = G_embedCodeTextAreaColor;
        element.setAttribute('readonly', 'readonly');
        element.setAttribute('onclick', 'this.focus(); this.select();');
        // element.value = '';
        // --------------------------------------------------------------------------------
        embedCodeFrame.appendChild(element);
        // --------------------------------------------------------------------------------
        return element;
    };
    // --------------------------------------------------------------------------------
    var G_embedCodePoster, G_posterURL, G_posterStyle = {'width' : 'auto', 'min-height' : '162px', 'min-width' : 'auto', 'max-height' :  'auto', 'height' : 'auto', 'zoom' : '0.5'};
    function addEmbedCodePoster(embedCodeFrame, onClickFunc) {
        var elementID = 'uniqueEmbedCodePoster';
        for (let element of document.querySelectorAll('#' + elementID)) {element.remove();};
        // --------------------------------------------------------------------------------
        var element = document.createElement('img');
        element.setAttribute('id', elementID);
        element.style.setProperty('display', 'inline-block', 'important');
        element.style['vertical-align'] = 'inherit';
        element.style['max-height'] = '120px';
        // element.style['min-width'] = '90px';
        element.style.width = 'auto';
        element.style.height = 'auto';
        element.style['min-width'] = '215px';
        element.style.height = '120px';
        element.setAttribute('src', fixURLProtocol(G_posterURL));
        for (var key in G_posterStyle) {
            element.style[key] = G_posterStyle[key];
            console.log(key, G_posterStyle[key])
        };
        // --------------------------------------------------------------------------------
        embedCodeFrame.appendChild(element);
        // --------------------------------------------------------------------------------
        element.addEventListener('click', onClickFunc, false);
        element.addEventListener('mouseover', function(){resizeEmbedCodePoster(1.0, 0.5, 5000);}, false);
        element.addEventListener('load', function(e){
            G_embedCodeTextImage = e.target.src;
            G_embedCodeImageInput.value = G_embedCodeTextImage;
        }, false);
        // --------------------------------------------------------------------------------
        return element;
    };
    // --------------------------------------------------------------------------------
    var G_embedCodePosterResizeTimer = null;
    function resizeEmbedCodePoster(before = 1.0, after = 0.5, delay = 5000) {
        G_embedCodePoster.style.zoom = before;
        clearTimeout(G_embedCodePosterResizeTimer);
        G_embedCodePosterResizeTimer = setTimeout(function() {
            G_embedCodePoster.style.zoom = after;
        }, delay);
    };
    // --------------------------------------------------------------------------------
    var G_embedCodeLink, G_contentURL; function addEmbedCodeLink(embedCodeFrame) {
        var elementID = 'uniqueEmbedCodeLink';
        for (let element of document.querySelectorAll('#' + elementID)) {element.remove();};
        // --------------------------------------------------------------------------------
        var element = document.createElement('a');
        element.style.setProperty('display', 'block', 'important');
        element.style['font-size'] = '12px';
        element.style.color = '#086081';
        element.style.width = 'auto';
        element.setAttribute('target', '_blank'); // Open in new tab
        element.setAttribute('href', G_contentURL);
        element.text = element.href;
        // --------------------------------------------------------------------------------
        embedCodeFrame.appendChild(element);
        // --------------------------------------------------------------------------------
        return element;
    };
    // --------------------------------------------------------------------------------
    var G_embedCodeVideo, G_sampleURL, G_videoWidth, G_videoHeight, G_videoDuration, G_videoQuality, G_forceLoad = true; function addEmbedCodeVideo(embedCodeFrame, onClickFunc, onLoadFunc, onErrorFunc, forceLoad = false) {
        var elementID = 'uniqueEmbedCodeVideo';
        for (let element of document.querySelectorAll('#' + elementID)) {element.remove();};
        // --------------------------------------------------------------------------------
        var element = document.createElement('video');
        element.setAttribute('id', elementID);
        element.style = G_embedCodePoster.getAttribute('style');
        // element.style.display = 'none';
        element.style['border-style'] = 'solid';
        element.style['border-width'] = (1+1) + 'px';
        element.setAttribute('preload', 'metadata');
        element.style.height = G_embedCodePoster.offsetHeight + 'px';
        element.style.width = G_embedCodePoster.offsetWidth + 'px';
        // --------------------------------------------------------------------------------
        embedCodeFrame.appendChild(element);
        // --------------------------------------------------------------------------------
        element.addEventListener('loadedmetadata', function(e) {
            G_sampleURL = e.target.src;
            G_videoWidth = e.target.videoWidth;
            G_videoHeight = e.target.videoHeight;
            G_videoDuration = e.target.duration;
            G_videoQuality = G_videoQuality || G_videoHeight;
            if (onLoadFunc && (typeof onLoadFunc).toLowerCase() == 'function') onLoadFunc();
            if (forceLoad) e.target.remove();
        });
        element.addEventListener('error', function(e) {
            if (onErrorFunc && (typeof onErrorFunc).toLowerCase() == 'function') onErrorFunc();
        });
        // --------------------------------------------------------------------------------
        element.setAttribute('muted', 'muted');
        element.setAttribute('autoplay', '');
        // --------------------------------------------------------------------------------
        element.setAttribute('src', G_sampleURL);
        // --------------------------------------------------------------------------------
        if (forceLoad) {
            element.setAttribute('controls', '');
            let funcToTest = function() {return element.src && element.src !== ''};
            let funcToRun = function() {
                if (typeof element !== 'undefined' && typeof element.play == 'function' && element.paused) {
                    element.play();
                };
            };
            waitForCondition(funcToTest, funcToRun, 50, 5*10, []);
        };
        // --------------------------------------------------------------------------------
        return element;
    }
    // --------------------------------------------------------------------------------
    var G_previewURL;
    var G_embedCodeText, G_contentTitle, G_altText, G_delimiter; function updateEmbedCodeText(embedCodeTextArea, startNew = 0, delimiter = '') {
        G_posterURL = fixURLProtocol(G_posterURL)
        // G_contentTitle = G_contentTitle ? G_contentTitle : document.title.replace(/^.{1} /i, '').capitalize();
        // --------------------------------------------------------------------------------
        if (G_embedCodeText && !startNew) G_embedCodeText += '\n<div class="thumbnail"'; else G_embedCodeText = '<div class="thumbnail"';
        /*if (G_contentURL !== G_pageURL)*/ G_embedCodeText += ' data-title="' + G_contentTitle + '"';
        // if (G_embedCodeTextImage !== '') G_posterURL = G_embedCodeTextImage;
        if (G_posterURL && G_posterURL !== G_contentURL) G_embedCodeText += ' data-image="' + G_posterURL + '"';
        if (G_previewURL) G_embedCodeText += ' data-video="' + G_previewURL + '"';
        G_embedCodeText += ' data-content="' + G_contentURL + '"';
        /*if (G_contentURL !== G_pageURL)*/ G_embedCodeText += ' data-url="' + G_pageURL + '"';
        if (G_altText) G_embedCodeText += ' alt="' + G_altText + '"';
        // if (G_videoQuality) G_embedCodeText += ' data-quality="' + G_videoQuality + 'p"';
        if (G_videoWidth && G_videoHeight) G_embedCodeText += ' data-quality="' + G_videoWidth + 'x' + G_videoHeight + '"';
        if (G_videoWidth && G_videoHeight) G_embedCodeText += ' data-quality-limit="' + 1080 + '"';
        if (G_videoDuration) {
            console.log('G_videoDuration:', G_videoDuration);
            if (!(G_videoDuration+'').match(':')) G_videoDuration = toHHMMSS(G_videoDuration);
            G_embedCodeText += ' data-duration="' + G_videoDuration + '"';
        };
        if (G_embedCodeTextStart && G_embedCodeTextStart !== '00:00:00') {
            G_embedCodeText += ' data-start="' + G_embedCodeTextStart + '"';
        };
        G_embedCodeTextCategorie = G_embedCodeTextCategorie.trim().
        replace(/\s+,/g, ',').
        replace(/,\s+/g, ',').
        replace(/,+/g, ',').
        replace(/^,/g, '').
        replace(/,$/g, '').
        replace(/,/g, ', ')
        ;
        G_embedCodeText += ' data-categories="all,' + (G_embedCodeTextCategorie.length > 0 ? ' ' + G_embedCodeTextCategorie : '') + '"';
        G_embedCodeText += '></div>';
        // --------------------------------------------------------------------------------
        embedCodeTextArea.value = delimiter ? delimiter + G_embedCodeText : G_embedCodeText;
        // --------------------------------------------------------------------------------
        return G_embedCodeText;
    };
    // --------------------------------------------------------------------------------
    var G_embedCodePosterSelector, G_postersArray = [];
    function addEmbedCodePosterSelector(URLArray) {
        console.log('G_embedCodePosterSelector --> URLArray:', URLArray);
        if (URLArray.length > 0) {
            var elementID = 'uniqueEmbedCodePosterSelector';
            for (let element of document.querySelectorAll('#' + elementID)) {element.remove();};
            // --------------------------------------------------------------------------------
            var element = document.createElement('div');
            element.setAttribute('id', elementID);
            G_embedCodeFrame.appendChild(element);
            function updateMainPoster(e) {
                let img = e.target;
                G_posterURL = img.getAttribute('src');
                updateEmbedCodeText(G_embedCodeTextArea, 1, G_delimiter);
                // G_embedCodeTextArea.value = G_embedCodeText;
                G_embedCodePoster.setAttribute('src', G_posterURL);
                resizeEmbedCodePoster(1.0, 0.5, 5000);
            }
            /*
            for (let posterURL of URLArray) {
                var img = document.createElement('img');
                img.setAttribute('style', G_embedCodePoster.getAttribute('style'));
                img.style.zoom = 0.5;
                img.setAttribute('src', posterURL);
                img.setAttribute('onerror', 'this.remove();');
                G_embedCodeFrame.appendChild(img);
                img.addEventListener('click', updateMainPoster.bind(this), false);
            }
            */
            let imageStyle = G_embedCodePoster.getAttribute('style');
            let imageIndex = URLArray[0] ? 0 : 1;
            let loadImage = function() {
                let img = document.createElement('img');
                img.setAttribute('style', imageStyle);
                img.style.zoom = 0.5;
                img.setAttribute('src', URLArray[imageIndex]);
                img.setAttribute('onerror', 'this.remove();');
                G_embedCodeFrame.appendChild(img);
                img.addEventListener('click', updateMainPoster.bind(this), false);
                if (imageIndex < URLArray.length) {
                    img.addEventListener('load', function(){
                        imageIndex++;
                        loadImage();
                    }, false);
                };
                // console.log(URLArray[imageIndex], img);
                return img;
            };
            loadImage();
            //
            G_embedCodePoster.style.position = 'fixed';
            G_embedCodePoster.style.bottom = '10px';
            G_embedCodePoster.style.right = '10px';
            G_embedCodePoster.style.zIndex = '2147483647';
            //
            G_embedCodePosterSelector = element;
            return element;
        }
    }
    // ================================================================================
    var G_noPlayerExtension = false, G_triesReCastMult = 2, /*G_progressThumbnailSrc,*/ G_standartReCastFunc = function() {
        console.log('G_standartReCastFunc:', G_pageURL);
        var media = G_funcResult, contentURL = G_contentURL ? G_contentURL : media.src;
        if (!contentURL.match(/^http/) && !contentURL.match(/^[/]/)) contentURL = (location.protocol + '//' + G_pageDomain) + G_contentURL;
        else if (contentURL.match(/^\/\//)) contentURL = location.protocol + G_contentURL;
        else if (contentURL.match(/^\//)) contentURL = (location.protocol + '//' + G_pageDomain) + G_contentURL;
        console.log('contentURL: ', contentURL);
        // G_funcToTest = function() {if (window.top === window.self) {return 1;} return 1;};
        G_funcToRun = function() {
            var mediaData = {};
            mediaData.url = G_pageURL;
            mediaData.src = contentURL;
            mediaData.refined = refineVideo(contentURL, G_noPlayerExtension);
            // if (G_progressThumbnailSrc) {mediaData.refined += '&thumb_src=' + G_progressThumbnailSrc;};
            mediaData.width = media.videoWidth;
            mediaData.height = media.videoHeight;
            mediaData.duration = media.duration;
            if (window.top === window.self) {
                window.parent.postMessage(Object.assign({sender: 'ANSWER'}, mediaData), '*');
            }
            else {
                window.parent.postMessage(Object.assign({sender: 'ANSWER'}, mediaData), '*');
                openURL(mediaData.refined);
            };
        };
        G_funcToRun();
        // waitForCondition(G_funcToTest, G_funcToRun, G_delay, G_tries*2, G_timerGroup);
    };
    // ================================================================================
    function updateEmbedCodeTextColor() {
        var quality = (G_videoWidth && G_videoHeight) ? ((G_videoWidth * G_videoHeight) / (1920 * 1080)) : (G_videoQuality / 1080);
        G_embedCodeText = updateEmbedCodeText(G_embedCodeTextArea, 1, G_delimiter);
        G_embedCodeTextAreaColor = valToColor(quality * 100, 1, 1.0, 0, 100, 1);
        G_embedCodeTextArea.style.color = G_embedCodeTextAreaColor;
        log(G_debugMode, G_embedCodeTextAreaColor);
        // new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU'+Array(1e3).join(123)).play();
        // var A, o = (A = new AudioContext()).createOscillator(); o.connect(A.destination); o.start(0); setTimeout(function(){o.stop(0)}, 200);
        msgbox('Video', (G_videoWidth + ' x ' + G_videoHeight) + '\n' + (G_sampleURL || G_pageURL).replace(/.*?:\/\/(.*?)\/.*/, '$1'), 3000);
        // --------------------------------------------------------------------------------
        G_embedCodePoster.style.borderColor = G_embedCodeTextAreaColor;
        G_embedCodePoster.style.borderWidth = '2px';
        G_embedCodePoster.style.borderStyle = 'dashed';
        G_embedCodePoster.style.zoom = 1.0;
        resizeEmbedCodePoster(1.0, 0.5, 5000);
    };
    // ================================================================================
    var G_noQualitySample = false, G_qualitySampleSource = null, G_standartAddEmbedCodeFunc = function() {
        // --------------------------------------------------------------------------------
        G_contentTitle = G_contentTitle ? G_contentTitle : document.title.replace(/^.{1} /i, '').capitalize();
        G_delimiter = ''; // '<!-- ' + G_contentTitle + ' -->\n';
        G_embedCodeFrame = addEmbedCodeFrame(G_funcToRun);
        G_embedCodeCatInput = addEmbedCodeCatInput(G_embedCodeFrame);
        G_embedCodeStartInput = addEmbedCodeStartInput(G_embedCodeFrame);
        G_embedCodeImageInput = addEmbedCodeImageInput(G_embedCodeFrame);
        G_embedCodeTextArea = addEmbedCodeTextArea(G_embedCodeFrame);
        G_embedCodeText = updateEmbedCodeText(G_embedCodeTextArea, 1, G_delimiter);
        G_embedCodeLink = addEmbedCodeLink(G_embedCodeFrame);
        G_embedCodePoster = addEmbedCodePoster(G_embedCodeFrame, G_funcToRun);
        if (G_qualitySampleSource) {
            // document.querySelector('#EPvideo_html5_api').addEventListener('play', function(e) {
            function updateValues(e) {
                G_sampleURL = e.target.src;
                G_videoWidth = e.target.videoWidth;
                G_videoHeight = e.target.videoHeight;
                G_videoDuration = e.target.duration;
                G_videoQuality = G_videoHeight;
                updateEmbedCodeTextColor();
            };
            G_qualitySampleSource.addEventListener('playing', function(e){updateValues(e)});
            G_qualitySampleSource.addEventListener('loadedmetadata', function(e){updateValues(e)});
        }
        else {
            if (G_sampleURL && !G_noQualitySample) {
                G_embedCodeVideo = addEmbedCodeVideo(G_embedCodeFrame, G_funcToRun, function onLoadFunc() {
                    updateEmbedCodeTextColor();
                }, function onErrorFunc() {
                    log(G_debugMode, 'G_embedCodeVideo: onErrorFunc');
                    updateEmbedCodeTextColor();
                }, G_forceLoad);
            }
        }
        addKeyComboCtrlC(G_embedCodeTextArea, 1, 0);
        if (G_postersArray && G_postersArray.length > 0) G_embedCodePosterSelector = addEmbedCodePosterSelector(G_postersArray);
        // --------------------------------------------------------------------------------
        log(G_debugMode, G_contentURL, '\n', G_sampleURL, '\n', G_posterURL);
    };
    // ================================================================================
    // getCookie(), setCookie(), deleteCookie() -- https://gist.github.com/akaramires/7577298
    function getCookie(name) { // РІРѕР·РІСЂР°С‰Р°РµС‚ cookie РµСЃР»Рё РµСЃС‚СЊ РёР»Рё undefined
        var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }
    // --------------------------------------------------------------------------------
    // РђСЂРіСѓРјРµРЅС‚С‹:
    // name - РЅР°Р·РІР°РЅРёРµ cookie
    // value - Р·РЅР°С‡РµРЅРёРµ cookie (СЃС‚СЂРѕРєР°)
    // props - РћР±СЉРµРєС‚ СЃ РґРѕРїРѕР»РЅРёС‚РµР»СЊРЅС‹РјРё СЃРІРѕР№СЃС‚РІР°РјРё РґР»СЏ СѓСЃС‚Р°РЅРѕРІРєРё cookie:
    // expires - Р’СЂРµРјСЏ РёСЃС‚РµС‡РµРЅРёСЏ cookie. РРЅС‚РµСЂРїСЂРµС‚РёСЂСѓРµС‚СЃСЏ РїРѕ-СЂР°Р·РЅРѕРјСѓ, РІ Р·Р°РІРёСЃРёРјРѕСЃС‚Рё РѕС‚ С‚РёРїР°:
    // - Р•СЃР»Рё С‡РёСЃР»Рѕ - РєРѕР»РёС‡РµСЃС‚РІРѕ СЃРµРєСѓРЅРґ РґРѕ РёСЃС‚РµС‡РµРЅРёСЏ.
    // - Р•СЃР»Рё РѕР±СЉРµРєС‚ С‚РёРїР° Date - С‚РѕС‡РЅР°СЏ РґР°С‚Р° РёСЃС‚РµС‡РµРЅРёСЏ.
    // - Р•СЃР»Рё expires РІ РїСЂРѕС€Р»РѕРј, С‚Рѕ cookie Р±СѓРґРµС‚ СѓРґР°Р»РµРЅРѕ.
    // - Р•СЃР»Рё expires РѕС‚СЃСѓС‚СЃС‚РІСѓРµС‚ РёР»Рё СЂР°РІРЅРѕ 0, С‚Рѕ cookie Р±СѓРґРµС‚ СѓСЃС‚Р°РЅРѕРІР»РµРЅРѕ РєР°Рє СЃРµСЃСЃРёРѕРЅРЅРѕРµ Рё РёСЃС‡РµР·РЅРµС‚ РїСЂРё Р·Р°РєСЂС‹С‚РёРё Р±СЂР°СѓР·РµСЂР°.
    // path - РџСѓС‚СЊ РґР»СЏ cookie.
    // domain - Р”РѕРјРµРЅ РґР»СЏ cookie.
    // secure - РџРµСЂРµСЃС‹Р»Р°С‚СЊ cookie С‚РѕР»СЊРєРѕ РїРѕ Р·Р°С‰РёС‰РµРЅРЅРѕРјСѓ СЃРѕРµРґРёРЅРµРЅРёСЋ.
    // --------------------------------------------------------------------------------
    function setCookie(name, value, props) { // СѓcС‚Р°РЅР°РІР»РёРІР°РµС‚ cookie
        props = props || {};
        var exp = props.expires;
        if (typeof exp == "number" && exp) {
            var d = new Date();
            d.setTime(d.getTime() + exp*1000);
            exp = props.expires = d;
        }
        if (exp && exp.toUTCString) props.expires = exp.toUTCString();
        value = encodeURIComponent(value)
        for (let propName in props) {if (propName == name) props[propName] = value;};
        var updatedProps = {}; for (let propName in props) {
            if (!updatedProps[propName]) updatedProps[propName] = props[propName];
        };
        var updatedCookie = ''; for (let propName in updatedProps) {
            updatedCookie += (propName + '=' + updatedProps[propName] + "; ");
        };
        document.cookie = updatedCookie.trim();
    }
    // --------------------------------------------------------------------------------
    function deleteCookie(name) { // СѓРґР°Р»СЏРµС‚ cookie
        setCookie(name, null, { expires: -1 });
    }
    // ================================================================================
    function setCategory(category) {
        let result;
        if (typeof category == 'undefined') {
            category = GM_getValue('category', '');
            result = prompt('Category', category || '');
            if (result === null) {
                return;
            };
            GM_setValue('category', result);
            G_embedCodeTextCategorie = result;
            G_embedCodeCatInput.value = G_embedCodeTextCategorie;
            eventFire(G_embedCodeCatInput, 'change');
        }
        else {
            result = category;
            GM_setValue('category', result);
        };
    };
    GM_registerMenuCommand('Set Category', function(){setCategory();}, "");
    let updateVal = function(e) {setCategory(G_embedCodeCatInput.value);};
    function toggleSaveCategories() {
        let save_categories = !GM_getValue('save_categories', false) || false;
        G_embedCodeCatInput.removeEventListener('change', updateVal);
        if (save_categories) {
            G_embedCodeCatInput.style.color = 'cornflowerblue';
            G_embedCodeCatInput.addEventListener('change', updateVal);
            updateVal();
        }
        else {
            G_embedCodeCatInput.style.color = 'grey';
            setCategory('');
        };
        GM_setValue('save_categories', save_categories);
    };
    GM_registerMenuCommand('Toggle Save Category', function() {
        toggleSaveCategories();
    }, "");
    function initSaveCategories(input) {
        let save_categories = GM_getValue('save_categories', false) || false;
        input.removeEventListener('change', updateVal);
        if (save_categories) {
            input.style.color = 'cornflowerblue';
            input.addEventListener('change', updateVal);
        }
        else {
            input.style.color = 'grey';
            setCategory('');
        };
    };
    var G_messageTarget; GM_registerMenuCommand('Set Start Time', function(){
        if (!G_messageTarget) {
            return;
        }
        // /*
        else if (G_messageTarget instanceof Element) {
            G_embedCodeTextStart = toHHMMSS(G_messageTarget.currentTime); // || '00:00:00';
            G_embedCodeStartInput.value = G_embedCodeTextStart;
            alert('G_messageTarget.currentTime: ' + G_embedCodeTextStart);
        }
        // */
        else {
            G_messageTarget = G_messageTarget || window.parent;
            G_messageTarget.postMessage({sender: 'QUESTION', data: null}, '*');
        };
    }, "");
    window.addEventListener('message', function(e) {
        if(typeof e.data === 'object' && e.data.sender === 'ANSWER' && e.data.currentTime) {
            G_embedCodeTextStart = toHHMMSS(e.data.currentTime); // || '00:00:00';
            alert('ANSWER.data.currentTime: ' + G_embedCodeTextStart);
            G_embedCodeStartInput.value = G_embedCodeTextStart;
            // console.log('received in script ' + me +': ', e.data.data);
        }
        else if(typeof e.data === 'object' && e.data.sender === 'ANSWER' && e.data.src) {
            if (G_pageURL.matchLink('#ReCast')) {
                console.log('e.data:',e.data);
                if (window.opener) {
                    window.opener.postMessage(e.data, '*');
                    window.close();
                };
            }
            else if (G_pageURL.matchLink('file:///*/2.*.*.html')) {
                let outputs = document.getElementById('content');
                if (outputs) {
                    let iframeOutput = outputs.querySelector('#content_iframe');
                    if (iframeOutput.style.display == 'block') {iframeOutput.src = e.data.refined;};
                };
            }
            else {
                G_sampleURL = e.data.src;
                G_videoWidth = e.data.width;
                G_videoHeight = e.data.height;
                G_videoDuration = e.data.duration;
                if (!G_embedCodeFrame) return;
                G_embedCodeVideo = addEmbedCodeVideo(G_embedCodeFrame, G_funcToRun, function onLoadFunc() {
                    updateEmbedCodeTextColor();
                }, function onErrorFunc() {
                    log(G_debugMode, 'G_embedCodeVideo: onErrorFunc');
                    updateEmbedCodeTextColor();
                }, G_forceLoad);
            };
        };
    });
    // ================================================================================
    /*
    if (
        G_pageURL.matchLink('#ReCast')
    ) {
        return
    }
    else*/ if (
        G_pageURL.matchLink('file:///*/2.*.*.html')
    ) {
        return
    }
    // ================================================================================
    if (
        G_pageURL.matchLink('https?://www.eporner.com') ||
        G_pageURL.matchLink('https?://www.eporner.eu')
    ) {
        if (
            G_pageURL.matchLink('https?://www.eporner.com/hd-porn/*/*/') || // https://www.eporner.com/hd-porn/uCS7LAWJ70b/TUSHY-Keisha-Grey-Anal-Stretching-And-Gapes/
            G_pageURL.matchLink('https?://www.eporner.eu/hd-porn/*/*/')
        ) {
            G_funcToRun = function() {
                G_contentURL = document.querySelector('#embright > .textare1 > textarea').value.match(/.*src="(.*?)".*/i)[1]; // https://www.eporner.com/embed/uCS7LAWJ70b
                G_posterURL = G_posterURL ? G_posterURL : document.querySelector('meta[property="og:image"]').content;
                G_postersArray = CreateLinksList(G_posterURL, /^(https?:\/\/.*eporner.com\/thumbs\/.*)\/\d+_(\d+).jpg/i, '$1/$NUM_$2.jpg', 1, 100); console.log('G_posters:\n', G_postersArray);
                G_stickTo = document.querySelector('#relateddiv'); G_stickPosition = -1;
                // --------------------------------------------------------------------------------
                G_qualitySampleSource = document.querySelector('#EPvideo_html5_api');
                // https://static-eu-cdn.eporner.com/thumbs/static4/1/11/110/1101004/10_240.jpg
                // https://static-eu-cdn.eporner.com/thumbs/static4/1/11/110/1101004/1101004-preview.mp4
                G_previewURL = G_posterURL.replace(/^(.*\/(\d+))\/\d+_\d+\.jpg/, '$1/$2-preview.mp4'); // https://static-eu-cdn.eporner.com/thumbs/static4/1/11/110/1101004/1101004-preview.mp4
                for (let a of document.querySelectorAll('.vit-pornstar > a, .vit-category > a, .vit-tag > a')) {
                    let s = a.innerText.trim();
                    G_categories[s] = '';
                };
                G_standartAddEmbedCodeFunc();
                // --------------------------------------------------------------------------------
                var eventCatcher, media;
                waitForCondition(function(){
                    eventCatcher = eventCatcher ? eventCatcher : document.querySelector('div[aria-label="Video Player"]');
                    media = media ? media : document.querySelector('video#EPvideo_html5_api');
                    // if (media) {media = media.parentNode};
                    return eventCatcher && media;
                }, function() {
                    mediaMouseControls(eventCatcher, media, 1);
                }, G_delay, G_tries, G_timerGroup);
                /*
                setTimeout(function() {
                    var eventCatcher = document.querySelector('div#moviexxx'), media = document.querySelector('body video[src]');
                    if (eventCatcher && media) {mediaMouseControls(eventCatcher, media, 1);}
                }, 500);
                */
            };
            // waitForElement('#embright > .textare1 > textarea', null, G_funcToRun, G_delay, G_tries, G_timerGroup);
            waitForElement('#EPvideo_html5_api', null, G_funcToRun, G_delay, G_tries, G_timerGroup);
        }
        else if (
            G_pageURL.matchLink('https?://www.eporner.com/embed/*') || // https://www.eporner.com/embed/uCS7LAWJ70b
            G_pageURL.matchLink('https?://www.eporner.eu/embed/*')
        ) {
            G_funcToTest = function () {
                return document.querySelector('body video[src]') && document.querySelector('head > meta[itemprop="contentUrl"][content]');
            };
            G_funcToRun = function() {
                // --------------------------------------------------------------------------------
                var maxQuality = 0, menuItem;
                for (let item of document.querySelectorAll('.vjs-menu-content > .vjs-menu-item')) {
                    let button = item.querySelector('.vjs-menu-item-text');
                    let text = button ? button.innerText : '';
                    let fps = false; //text.match('1080p@60fps HD');
                    console.log(text,fps);
                    if (fps) {
                        continue;
                    }
                    else {
                        let buttonQuality = Number(text.match(/\d+/));
                        if (buttonQuality > maxQuality && buttonQuality < G_qualityLimit) { maxQuality = buttonQuality; menuItem = item; };
                    };
                };
                // --------------------------------------------------------------------------------
                if (menuItem) menuItem.click();
                // --------------------------------------------------------------------------------
                var video = document.querySelector('body video'), src = video.src;
                if (src.match('blob:')) {
                    var content = document.querySelector('head > meta[itemprop="contentUrl"]').content;
                    video.src = content;
                    waitForCondition(
                        function() {return video.src != content;},
                        function() {
                            G_contentURL = video.src;
                            log(G_debugMode, 'G_contentURL:', G_contentURL);
                            openURL(refineVideo(G_contentURL));
                        }, G_delay, G_tries, G_timerGroup
                    );
                }
                else {
                    G_contentURL = video.src;
                    log(G_debugMode, 'G_contentURL:', G_contentURL);
                    openURL(refineVideo(G_contentURL));
                }
                // --------------------------------------------------------------------------------
            };
            waitForCondition(G_funcToTest, G_funcToRun, G_delay, G_tries, G_timerGroup);
        }
    }
    // ================================================================================
    else if (
        G_pageURL.matchLink('https?://(e\.)?yespornplease.com')
    ) {
        if (G_pageHost == 'e.yespornplease.com') {location.host = 'yespornplease.com';} // https://e.yespornplease.com/v/235160374
        else if (
            G_pageURL.matchLink('https?://yespornplease.com/view/*') // https://yespornplease.com/view/306756151
        ) {
            window.stop();
            location.replace(G_pageURL.replace('/view/', 'v').replace('[?].*', '')); // window.location.href = G_pageURL.replace('/view/', 'v').replace('[?].*', '');
        }
        // /*
        else if (G_pageURL.match('#ReCast')) {
            return;
        }
        // */
        else if (
            G_pageURL.matchLink('https?://yespornplease.com/v/*') // https://yespornplease.com/v/306756151
        ) {
            G_funcToRun = function() {
                let header = document.querySelector('.nav.nav-tabs');
                let iframe_id = 'thumbs';
                let iframe = document.querySelector('iframe#' + iframe_id);
                function checkIframeContent(iframe) {
                    let win = iframe.contentWindow;
                    let selector = '.video-link[href="'+ location.pathname + '"]'; // /v/232270580
                    let matched = win.document.querySelector(selector);
                    if (matched) {
                        let main_poster = matched.querySelector('.img-responsive');
                        if (main_poster) {
                            G_posterURL = main_poster.src;
                            G_embedCodeImageInput.value = G_posterURL;
                            G_embedCodePoster.src = G_posterURL;
                            iframe.remove();
                        };
                    };
                };
                if (!iframe) {
                    iframe = document.createElement('iframe');
                    iframe.id = iframe_id;
                    iframe.onload = function(){checkIframeContent(iframe);};
                    header.appendChild(iframe);
                };
                //                 let stars = document.querySelector('.icon.fa-star-o');
                //                 stars = stars ? (' ' + stars.innerText) : '';
                //                 iframe.src = 'https://hqporner.com/?q=' + header.querySelector('h1.main-h1').innerText + stars;
                iframe.src = 'https://yespornplease.com/search?q=' + document.querySelector('.container .pull-left .hidden-xs').innerText;
                // --------------------------------------------------------------------------------
                G_contentURL = document.querySelector('iframe').src.replace(/\/width-\d+\/height-\d+\//i, '/width-882/height-496/');
                G_posterURL = (
                    document.querySelector('meta[name="thumbnail"]') ?
                    document.querySelector('meta[name="thumbnail"]').content :
                    document.querySelector('meta[property="og:image"]').content
                );
                // G_posterURL = G_posterURL.replace('/yespornplease.com/images/', '/itmx.yespornplease.com/'); // '/i3.yespornplease.com/'
                G_posterURL = G_posterURL.replace('/yespornplease.com/images/', '/i3.yespornplease.com/'); // '/i3.yespornplease.com/'
                // console.log(G_posterURL);
                G_postersArray = CreateLinksList(G_posterURL, /^(https:\/\/)?(.*yespornplease.com)\/(\d+\/.*?\/\d+x\d+)_\d+.jpg/i, location.protocol + '//$2/$3_$NUM.jpg', 1, 100); console.log('G_posters:\n', G_postersArray);
                G_previewURL = G_posterURL.replace(/^(.*)\/\d+x\d+_\d+\.jpg/, '$1/video.mp4'); // https://i3.yespornplease.com/201906/bcrdnlu/video.mp4
                G_stickTo = document.querySelector('.container > .row'); G_stickPosition = 1;
                // --------------------------------------------------------------------------------
                for (let a of document.querySelectorAll('.video-tags > a')) {
                    let s = a.innerText.trim();
                    G_categories[s] = '';
                };
                G_standartAddEmbedCodeFunc();
                G_messageTarget = document.querySelector('iframe').contentWindow;
            };
            // document.addEventListener("DOMContentLoaded", function(event) {
            waitForElement('#video_embed_code', null, G_funcToRun, G_delay, G_tries, G_timerGroup);
            // });
        }
    }

    else if (
        G_pageURL.matchLink('https?://vshare.io/v/*/width-*/height-*/*')
    ) {
        G_noPlayerExtension = true;
        G_funcToRun = function() {
            G_contentURL = G_funcResult;
            // G_progressThumbnailSrc = G_contentURL.replace(/(.*)_\d+\.mp4.*/i, '$1_360.mp4');
            G_standartReCastFunc();
        };
        waitForElement('body video > source[src], body video[src]', 'src', G_funcToRun, G_delay, G_tries * G_triesReCastMult, G_timerGroup);
    }

    else if (
        G_pageURL.matchLink('https?://www.porntrex.com/*')
    ) {
        // https://www.porntrex.com/models/Brooklyn%20Gray/hd/longest/
        if (location.pathname.match('%20')) {
            let newPath = location.pathname.replace(/%20/g, '-');
            location.pathname = newPath;
        };
        let show = function() {let css = document.querySelectorAll('head > style.hide-private');for (let s of css) {s.remove();};}
        let hide = function() {show(); addGlobalStyle(`.video-preview-screen.video-item.thumb-item.private {display: none;}`, 'hide-private');};
        function toggleShowPrivate() {
            let hidePrivate = GM_getValue('hidePrivate', false);
            if (hidePrivate) {
                show();
                GM_setValue('hidePrivate', false)
            }
            else {
                hide();
                GM_setValue('hidePrivate', true)
            }
        }
        let hidePrivate = GM_getValue('hidePrivate', false);
        if (hidePrivate) {hide();};
        GM_registerMenuCommand('Toggle Show Private', function(){toggleShowPrivate();}, '');
        addGlobalStyle(`.inf a {color: red; font-size: 9px;}`, 'style-1');
        addGlobalStyle(`.block-video .video-holder {width: 100%;}`, 'style-2');
        if (
            G_pageURL.matchLink('https?://www.porntrex.com/video/*/*')
            /* globals flashvars */
        ) {
            if (G_pageURL.match('#OnlyVideo')) { // https://www.porntrex.com/video/162636/kiera-winters-sex-queen-and-her-prince#OnlyVideo
                // window.stop();
                G_funcToTest = function () {
                    return typeof flashvars !== "undefined" && flashvars.video_url;
                };
                G_funcToRun = function () {
                    var contentURL = (
                        flashvars.video_alt_url3 ? flashvars.video_alt_url3 :
                        flashvars.video_alt_url2 ? flashvars.video_alt_url2 :
                        flashvars.video_alt_url ? flashvars.video_alt_url :
                        flashvars.video_url
                    );
                    var posterURL = flashvars.preview_url;
                    console.log('contentURL: ', contentURL);
                    openURL(refineVideo(contentURL));
                };
                waitForCondition(G_funcToTest, G_funcToRun, G_delay, G_tries, G_timerGroup);
            }
            else {
                localStorage.kvsplayer_selected_format = localStorage.kvsplayer_selected_format || '1080p HD';
                localStorage.kvsplayer_selected_format = localStorage.kvsplayer_selected_format || '720p HD';
                G_funcToTest = function () {
                    return typeof flashvars !== "undefined" && flashvars.video_url;
                };
                G_funcToRun = function () {
                    G_contentURL = G_shortURL + '#OnlyVideo';
                    G_sampleURL = (
                        flashvars.video_alt_url5 ? flashvars.video_alt_url5 :
                        flashvars.video_alt_url4 ? flashvars.video_alt_url4 :
                        flashvars.video_alt_url3 ? flashvars.video_alt_url3 : // 1080
                        flashvars.video_alt_url2 ? flashvars.video_alt_url2 :
                        flashvars.video_alt_url ? flashvars.video_alt_url :
                        flashvars.video_url
                    );
                    localStorage.kvsplayer_selected_format = flashvars.video_alt_url3 ? '1080p HD' : '720p HD';
                    G_forceLoad = true;
                    G_posterURL = G_posterURL ? G_posterURL : document.querySelector('.block-screenshots > a > img.thumb[src]').src;
                    G_posterURL = G_posterURL.replace('/statics.cdntrex.com/', '/www.porntrex.com/');
                    G_postersArray = CreateLinksList(G_posterURL, /^.*\/\/.*.com\/(contents\/videos_screenshots\/\d+\/\d+\/\d+x\d+)\/\d+.jpg/i, location.protocol+'//www.porntrex.com/$1/$NUM.jpg', 1, document.querySelectorAll(".thumb.lazy-load").length); // console.log('G_posters:\n', G_postersArray);
                    let timeLineThumbsMaxIndex = 500; // (60 * 60) / (flashvars.timeline_screens_interval * 1); // flashvars.timeline_screens_interval * 1;
                    for (let i = 1; i <= timeLineThumbsMaxIndex; i++) {
                        //statics.cdntrex.com/contents/videos_screenshots/62000/62730/timelines/timeline_mp4/200x116/{time}.jpg
                        G_postersArray[G_postersArray.length] = flashvars.timeline_screens_url.
                        replace('{time}', i).
                        replace('//statics.cdntrex.com/', location.protocol+'//www.porntrex.com/')
                        ;
                    };
                    // https://www.porntrex.com/contents/videos_screenshots/62000/62730/300x168/1.jpg
                    //statics.cdntrex.com/contents/videos_screenshots/62000/62730/timelines/timeline_mp4/200x116/69.jpg
                    G_stickTo = document.querySelector('div.video-info'); G_stickPosition = -1;
                    // G_stickTo = document.querySelector('div#tab_video_info'); G_stickPosition = 1;
                    // --------------------------------------------------------------------------------
                    G_standartAddEmbedCodeFunc();
                    // --------------------------------------------------------------------------------
                    var eventCatcher, media;
                    /*
                waitForCondition(function(){
                    eventCatcher = eventCatcher ? eventCatcher : document.querySelector('.fp-player');
                    media = media ? media : document.querySelector('.fp-player > video'); // || eventCatcher;
                    return eventCatcher && media;
                }, function() {
                    mediaMouseControls(eventCatcher, media, 1);
                    G_messageTarget = media;
                }, G_delay*2, 300, G_timerGroup);
                */
                    let handleNewElements = function (e) {
                        let element = e.target;
                        // console.log('element.tagName:', element.tagName);
                        if (element.tagName == 'VIDEO') {
                            document.removeEventListener('DOMNodeInserted', handleNewElements, false);
                            // alert(element);
                            if (element == document.querySelector('.fp-player > video')) {
                                eventCatcher = eventCatcher ? eventCatcher : document.querySelector('.fp-player');
                                media = media ? media : element; // || eventCatcher;
                                mediaMouseControls(eventCatcher, media, 1);
                                G_messageTarget = media;
                            };
                        };
                    };
                    document.addEventListener('DOMNodeInserted', handleNewElements, false);
                };
                /*
            // document.addEventListener("DOMContentLoaded", function(event) {
                waitForElement('meta[property="og:image"]', 'content', G_funcToRun, G_delay, G_tries, G_timerGroup);
            // });
            */
                waitForCondition(G_funcToTest, G_funcToRun, G_delay, G_tries, G_timerGroup);
            }
        }
    }

    else if (
        G_pageURL.matchLink('https?://yourporn.sexy/*') ||
        G_pageURL.matchLink('https?://sxyprn.com/*')
    ) {
        if (G_pageURL.match('#ReCast')) { // https://yourporn.sexy/post/59772cebee27b.html#ReCast
            // window.stop();
            G_funcToRun = function() {G_contentURL = G_funcResult; G_standartReCastFunc();};
            waitForElement('#vid_container_id video[src] > source[src], #vid_container_id video[src]', 'src', G_funcToRun, G_delay, G_tries * G_triesReCastMult, G_timerGroup);
        }
        else if (
            G_pageURL.matchLink('https?://yourporn.sexy/post/*') || // https://yourporn.sexy/post/56be2e8359051.html?sk=Carolina%20Abril&so=30
            G_pageURL.matchLink('https?://sxyprn.com/post/*')
        ) {
            G_funcToRun = function () {
                // --------------------------------------------------------------------------------
                G_contentURL = G_shortURL; // + '#ReCast';
                G_posterURL = G_posterURL ? G_posterURL : getAbsoluteUrl(document.querySelector('meta[property="og:image"]').getAttribute('content', 2));
                // G_postersArray = CreateLinksList(G_posterURL, /^(https?:\/\/.*eporner.com\/thumbs\/.*)\/\d+_(\d+).jpg/i, '$1/$NUM_$2.jpg', 1, 100); console.log('G_posters:\n', G_postersArray);
                G_stickTo = document.querySelector('div.comments_area'); G_stickPosition = -1;
                // --------------------------------------------------------------------------------
                G_qualitySampleSource = document.querySelector('#vid_container_id video[src]');
                G_previewURL = G_posterURL.replace('/full.jpg', '/vidthumb.mp4'); // https://s14.trafficdeposit.com//blog/vid/5ba53b584947a/5c3fa60edb1ed/vidthumb.mp4
                G_standartAddEmbedCodeFunc();
                // --------------------------------------------------------------------------------
                /*
                setTimeout(function() {
                    var eventCatcher = document.querySelector('body video[src]'), media = eventCatcher;
                    if (eventCatcher && media) {mediaMouseControls(eventCatcher, media, 1);}
                }, 500);
                */
                var eventCatcher, media;
                waitForCondition(function(){
                    eventCatcher = eventCatcher ? eventCatcher : document.querySelector('#vid_container_id video[src]');
                    media = media ? media : eventCatcher;
                    return eventCatcher && media;
                }, function() {
                    mediaMouseControls(eventCatcher, media, 1);
                }, G_delay, G_tries, G_timerGroup);
            };
            waitForElement('#vid_container_id video[src] > source[src], #vid_container_id video[src]', 'src', G_funcToRun, G_delay, G_tries, G_timerGroup);
        }
    }

    else if (
        G_pageURL.matchLink('https?://www.porngo.com/*')
    ) {
        if (G_pageURL.match('#ReCast')) { // https://www.porngo.com/videos/28489/passing-me-around/#ReCast
            // window.stop();
            G_funcToRun = function() {G_contentURL = G_funcResult; G_standartReCastFunc();};
            waitForElement('.player video > source[src], .player video[src]', 'src', G_funcToRun, G_delay, G_tries * G_triesReCastMult, G_timerGroup);
        }
        else if (
            G_pageURL.matchLink('https?://www.porngo.com/videos/*/*') // https://www.porngo.com/videos/28489/passing-me-around/
        ) {
            G_funcToRun = function () {
                // --------------------------------------------------------------------------------
                G_contentURL = G_shortURL + '#ReCast';
                G_posterURL = document.querySelector('.player video').poster;
                G_posterURL = G_posterURL ? G_posterURL : getAbsoluteUrl(document.querySelector('meta[property="og:image"]').getAttribute('content', 2));
                G_postersArray = CreateLinksList(G_posterURL, /^(.*)\/(.*)\.jpg/i, '$1/$NUM.jpg', 1, 15); console.log('G_posters:\n', G_postersArray);
                G_stickTo = document.querySelector('div.player-holder'); G_stickPosition = 1;
                // --------------------------------------------------------------------------------
                G_sampleURL = document.querySelector('.player video > source[src]').src;
                // G_previewURL = G_posterURL.replace('(.*)/(.*)\.jpg', '$1/$2.mp4'); // https://s14.trafficdeposit.com//blog/vid/5ba53b584947a/5c3fa60edb1ed/vidthumb.mp4
                G_standartAddEmbedCodeFunc();
                // --------------------------------------------------------------------------------
                /*
                setTimeout(function() {
                    var eventCatcher = document.querySelector('body video[src]'), media = eventCatcher;
                    if (eventCatcher && media) {mediaMouseControls(eventCatcher, media, 1);}
                }, 500);
                */
                var eventCatcher, media;
                waitForCondition(function(){
                    eventCatcher = eventCatcher ? eventCatcher : document.querySelector('.player video');
                    media = media ? media : eventCatcher;
                    G_messageTarget = media;
                    return eventCatcher && media;
                }, function() {
                    mediaMouseControls(eventCatcher, media, 1);
                }, G_delay, G_tries, G_timerGroup);
            };
            waitForElement('.player video > source[src], .player video[src]', 'src', G_funcToRun, G_delay, G_tries, G_timerGroup);
        }
    }

    else if (
        G_pageURL.matchLink('https?://*.pornhub.com/*')
    ) {
        // if (getCookie('lang') !== 'en') {deleteCookie('lang'); setCookie('lang', 'en', {expires: 0});};
        addGlobalStyle('span.title a {font-size: 1vw;}', 'ph_Style_1');
        addGlobalStyle('.menu.realsex, .menu.community {display: none !important;}', 'ph_Style_2');
        // --------------------------------------------------------------------------------
        var actualSource = () => {
            var contentURL;
            var flashvars = getWindowVar('flashvars');
            if (!flashvars) {
                for (let script of document.scripts) {
                    var text = script.text;
                    var match = text.match(/var flashvars_(.*?) = */i);
                    if (match) {
                        var id = match[1];
                        if (id) flashvars = getWindowVar('flashvars_' + id);
                        if (flashvars) break;
                    }
                }
            }
            if (flashvars) {
                var qualityTable = flashvars.defaultQuality, maxQuality = 0;
                for (let quality of qualityTable) {
                    maxQuality = quality > maxQuality && flashvars['quality_' + quality + 'p'] ? quality : maxQuality;
                }
                if (maxQuality > 0) {
                    console.log('quality: ' + maxQuality);
                    contentURL = flashvars['quality_' + maxQuality + 'p'];
                    return (contentURL); // openURL(refineVideo(contentURL));
                }
            }
        };
        // --------------------------------------------------------------------------------
        if (G_pageURL.match('#ReCast')) { // https://www.pornhub.com/view_video.php?viewkey=ph5852ef85649df#ReCast
            // window.stop();
            G_funcToTest = function() {return actualSource();};
            G_funcToRun = function() {G_contentURL = G_funcResult; G_standartReCastFunc();};
            waitForCondition(G_funcToTest, G_funcToRun, G_delay, G_tries * G_triesReCastMult, G_timerGroup);
        }
        // --------------------------------------------------------------------------------
        else if (
            G_pageURL.matchLink('https?://www.pornhub.com/embed/*') // https://www.pornhub.com/embed/ph5852ef85649df
        ) {
            G_funcToRun = function () {
                G_contentURL = actualSource();
                G_contentURL = G_contentURL ? G_contentURL : G_funcResult.src;
                if (G_contentURL) openURL(refineVideo(G_contentURL));
            };
            waitForElement('video > source[src], video[src]', 'src', G_funcToRun, G_delay, G_tries, G_timerGroup);
        }
        // --------------------------------------------------------------------------------
        else if (
            G_pageURL.matchLink('https?://*.pornhub.com/view_video.php[?]viewkey=*') // https://www.pornhub.com/view_video.php?viewkey=ph5852ef85649df
        ) {
            G_funcToRun = function () {
                G_sampleURL = actualSource();
                G_pageURL = G_pageURL.replace(/(https?:\/\/).*?\.(pornhub\.com\/)/i, '$1$2');
                G_contentURL = document.querySelector('meta[name="twitter:player"]').content.replace(/(https?:\/\/).*?\.(pornhub\.com\/)/i, '$1$2'); //pageURL + '#ReCast';
                G_posterURL = document.querySelector('meta[name="twitter:image"]').content;
                // G_posterStyle = {'width' : 'auto', 'min-height' : '162px', 'min-width' : 'auto', 'max-height' :  'auto', 'height' : 'auto', 'zoom' : '0.5'};
                G_postersArray = CreateLinksList(G_posterURL, /^(.*?)\d+.jpg$/i, '$1$NUM.jpg', 0, 15+2); console.log('G_posters:\n', G_postersArray);
                G_stickTo = document.querySelector('.video-actions-container'); G_stickPosition = -1;
                // --------------------------------------------------------------------------------
                G_standartAddEmbedCodeFunc();
                var eventCatcher, media;
                waitForCondition(function(){
                    eventCatcher = eventCatcher ? eventCatcher : document.querySelector('.mhp1138_eventCatcher');
                    media = media ? media : document.querySelector('.mhp1138_videoWrapper > video');
                    // if (media) {media = media.parentNode};
                    return eventCatcher && media;
                }, function() {
                    mediaMouseControls(eventCatcher, media, 1);
                }, G_delay, G_tries, G_timerGroup);
            };
            // document.addEventListener("DOMContentLoaded", function(event) {
            waitForElement('.video-actions-container', null, G_funcToRun, G_delay, G_tries, G_timerGroup);
            // });
        }
    }

    else if (
        G_pageURL.matchLink('https?://*.playvids.com/*')
    ) {
        // if (getCookie('lang') !== 'en') {deleteCookie('lang'); setCookie('lang', 'en', {expires: 0});};
        // --------------------------------------------------------------------------------
        let actualSource = () => {
            var video = document.querySelector('video[data-qualities]');
            if (!video) return;
            var qualities = video.dataset.qualities.split('|');
            var maxQuality = qualities[qualities.length-1];
            var contentURL = video.dataset['src' + maxQuality];
            return contentURL;
        };
        // --------------------------------------------------------------------------------
        if (G_pageURL.match('#ReCast')) { // https://www.playvids.com/z_GWEZil5lC/massagereep-s-art-of-creepy-massages-lexi-belle-fucking-sexy-wife#ReCast
            // window.stop();
            G_funcToTest = function() {return actualSource();};
            G_funcToRun = function() {G_contentURL = G_funcResult; G_standartReCastFunc();};
            waitForCondition(G_funcToTest, G_funcToRun, G_delay, G_tries * G_triesReCastMult, G_timerGroup);
        }
        // --------------------------------------------------------------------------------
        else if (
            G_pageURL.matchLink('https?://www.playvids.com/embed/*') // https://www.playvids.com/embed/z_GWEZil5lC
        ) {
            G_funcToRun = function () {
                G_contentURL = actualSource();
                G_contentURL = G_contentURL ? G_contentURL : G_funcResult.src;
                if (G_contentURL) openURL(refineVideo(G_contentURL));
            };
            waitForElement('video[data-qualities]', null, G_funcToRun, G_delay, G_tries, G_timerGroup);
        }
        // --------------------------------------------------------------------------------
        else if (
            G_pageURL.matchLink('https?://www.playvids.com/*/*') // https://www.playvids.com/z_GWEZil5lC/massagereep-s-art-of-creepy-massages-lexi-belle-fucking-sexy-wife
        ) {
            G_funcToRun = function () {
                G_sampleURL = actualSource();
                // G_contentURL = document.querySelector('link[rel="canonical"]').href; //pageURL + '#ReCast';
                G_contentURL = document.querySelector('video[data-qualities]').dataset.embed;
                G_posterURL = document.querySelector('meta[property="og:image"]').content;
                // G_posterStyle = {'width' : 'auto', 'min-height' : '162px', 'min-width' : 'auto', 'max-height' :  'auto', 'height' : 'auto', 'zoom' : '0.5'};
                // G_postersArray = CreateLinksList(G_posterURL, /^(.*?)\d+.jpg$/i, '$1$NUM.jpg', 1, 15); console.log('G_posters:\n', G_postersArray);
                G_stickTo = document.querySelector('.channel-info'); G_stickPosition = 1;
                // --------------------------------------------------------------------------------
                G_standartAddEmbedCodeFunc();
                var eventCatcher, media;
                waitForCondition(function(){
                    eventCatcher = eventCatcher ? eventCatcher : document.querySelector('div.mediaPlayerContainer');
                    media = media ? media : document.querySelector('video[data-qualities]'); // document.querySelector('div#player video > source');
                    // if (media) {media = media.parentNode};
                    return eventCatcher && media;
                }, function() {
                    mediaMouseControls(eventCatcher, media, 1);
                }, G_delay, G_tries, G_timerGroup);
            };
            // document.addEventListener("DOMContentLoaded", function(event) {
            waitForElement('video[data-qualities]', null, G_funcToRun, G_delay, G_tries, G_timerGroup);
            // });
        }
    }

    else if (
        G_pageURL.matchLink('https?://*.pornoeggs.com/*')
    ) {
        // if (getCookie('lang') !== 'en') {deleteCookie('lang'); setCookie('lang', 'en', {expires: 0});};
        // --------------------------------------------------------------------------------
        let actualSource = () => {
            var video = document.querySelector('video[data-qualities]');
            var qualities = video.dataset.qualities.split('|');
            var maxQuality = qualities[qualities.length-1];
            var contentURL = video.dataset['src' + maxQuality];
            log(G_debugMode, 'maxQuality', 'src' + maxQuality + ' =', contentURL);
            return contentURL;
        };
        // --------------------------------------------------------------------------------
        if (G_pageURL.match('#ReCast')) { // https://www.pornoeggs.com/watch?v=00RejSBM3Cl#ReCast
            // window.stop();
            G_funcToTest = function() {return actualSource();};
            G_funcToRun = function() {G_contentURL = G_funcResult; G_standartReCastFunc();};
            waitForCondition(G_funcToTest, G_funcToRun, G_delay, G_tries, G_timerGroup);
        }
        // --------------------------------------------------------------------------------
        else if (
            G_pageURL.matchLink('https?://www.pornoeggs.com/embed[?]v=*') // https://www.pornoeggs.com/embed?v=00RejSBM3Cl
        ) {
            return;
            // --------------------------------------------------------------------------------
            G_funcToRun = function () {
                G_contentURL = actualSource();
                G_contentURL = G_contentURL ? G_contentURL : G_funcResult.src;
                if (G_contentURL) openURL(refineVideo(G_contentURL));
            };
            waitForElement('video[data-qualities]', null, G_funcToRun, G_delay, G_tries, G_timerGroup);
        }
        // --------------------------------------------------------------------------------
        else if (
            G_pageURL.matchLink('https?://www.pornoeggs.com/watch[?]v=*') // https://www.pornoeggs.com/watch?v=00RejSBM3Cl
        ) {
            G_funcToRun = function () {
                // G_sampleURL = actualSource();
                G_qualitySampleSource = document.querySelector('video[data-qualities]');
                // G_contentURL = document.querySelector('link[rel="canonical"]').href; //pageURL + '#ReCast';
                G_contentURL = document.querySelector('video[data-qualities]').dataset.embed;
                G_posterURL = document.querySelector('meta[property="og:image"]').content;
                // G_posterStyle = {'width' : 'auto', 'min-height' : '162px', 'min-width' : 'auto', 'max-height' :  'auto', 'height' : 'auto', 'zoom' : '0.5'};
                // G_postersArray = CreateLinksList(G_posterURL, /^(.*?)\d+.jpg$/i, '$1$NUM.jpg', 1, 15); console.log('G_posters:\n', G_postersArray);
                G_stickTo = document.querySelector('.pcomments-left'); G_stickPosition = -1;
                // --------------------------------------------------------------------------------
                G_previewURL = G_posterURL.replace(/^(.*)\/.*.jpg/, '$1/preview.mp4'); // https://cdn-img1.pornoeggs.com/thumbs/697/697331/preview.mp4
                G_standartAddEmbedCodeFunc();
                // --------------------------------------------------------------------------------
                var eventCatcher, media;
                waitForCondition(function(){
                    eventCatcher = eventCatcher ? eventCatcher : document.querySelector('div.mediaPlayerContainer');
                    media = media ? media : document.querySelector('video[data-qualities]'); // document.querySelector('div#player video > source');
                    // if (media) {media = media.parentNode};
                    return eventCatcher && media;
                }, function() {
                    mediaMouseControls(eventCatcher, media, 1);
                }, G_delay, G_tries, G_timerGroup);
            };
            // document.addEventListener("DOMContentLoaded", function(event) {
            waitForElement('video[data-qualities]', null, G_funcToRun, G_delay, G_tries, G_timerGroup);
            // });
        }
    }

    else if (
        G_pageURL.matchLink('https?://txxx.com/*')
    ) {
        // --------------------------------------------------------------------------------
        if (
            G_pageURL.matchLink('https?://txxx.com/embed/*') // https://txxx.com/embed/3049145
        ) {
            G_funcToRun = function () {
                G_contentURL = G_funcResult.currentSrc;
                if (G_contentURL) openURL(refineVideo(G_contentURL));
            };
            waitForElement('.jwplayer video[src]', null, G_funcToRun, G_delay, G_tries, G_timerGroup);
        }
        // --------------------------------------------------------------------------------
        else if (
            G_pageURL.matchLink('https://txxx.com/videos/*') // https://txxx.com/videos/3049145/horny-pornstar-gigi-rivera-in-fabulous-big-dick-cumshots-porn-video/
        ) {
            /* globals EoCR4 */
            G_funcToRun = function () {
                // G_sampleURL = actualSource();
                G_qualitySampleSource = document.querySelector('#videoplayer video[src]');
                // G_contentURL = document.querySelector('link[rel="canonical"]').href; //pageURL + '#ReCast';
                G_contentURL = G_pageURL.replace(/^(.*)\/videos\/(.*?)\/.*$/, '$1/embed/$2');
                // https://cdn37804682.ahacdn.me/contents/videos_sources/3049000/3049145/screenshots/2.jpg
                // https://cdn37804682.ahacdn.me/contents/videos_screenshots/3049000/3049145/timelines/hq_mp4/150x113/sprite_1.jpg
                G_posterURL = document.querySelector('.jw-preview').style.backgroundImage.replace().replace(/^.*\("(.*)"\)$/, '$1');
                // G_posterStyle = {'width' : 'auto', 'min-height' : '162px', 'min-width' : 'auto', 'max-height' :  'auto', 'height' : 'auto', 'zoom' : '0.5'};
                G_postersArray = CreateLinksList(G_posterURL, /^(.*?)\d+.jpg$/i, '$1$NUM.jpg', 1, 15); console.log('G_posters:\n', G_postersArray);
                G_stickTo = document.querySelector('.content'); G_stickPosition = -1;
                // --------------------------------------------------------------------------------
                // https://cdn56191079.ahacdn.me/c8/videos/3049000/3049145/3049145_tr.mp4
                // https://cdn37804682.ahacdn.me/c8/videos/13632000/13632958/13632958_tr.mp4
                // https://cdn62004373.ahacdn.me/c12/videos/13632000/13632958/13632958_tr.mp4
                G_previewURL = G_posterURL.replace(/^(.*)\/contents\/videos_\w+?\/(.*?\/(.*?))\/.*/, '$1/c8/videos/$2/$3_tr.mp4');
                G_previewURL = 'https://' + EoCR4[22] + G_posterURL.replace(/^(.*)\/contents\/videos_\w+?\/(.*?\/(.*?))\/.*/, '/$2/$3_tr.mp4');
                G_standartAddEmbedCodeFunc();
                // --------------------------------------------------------------------------------
                var eventCatcher, media;
                waitForCondition(function(){
                    eventCatcher = eventCatcher ? eventCatcher : document.querySelector('div#videoplayer');
                    media = media ? media : document.querySelector('.jwplayer video[src]');
                    // if (media) {media = media.parentNode};
                    return eventCatcher && media;
                }, function() {
                    mediaMouseControls(eventCatcher, media, 1);
                }, G_delay, G_tries, G_timerGroup);
            };
            // document.addEventListener("DOMContentLoaded", function(event) {
            waitForElement('.jwplayer video[src]', null, G_funcToRun, G_delay, G_tries, G_timerGroup);
            // });
        }
    }

    else if (
        G_pageURL.matchLink('https?://www.youjizz.com/videos/*.html')
    ) {
        /* globals mp4Encodings */
        if (G_pageURL.match('#OnlyVideo')) { // https://www.youjizz.com/videos/hot-white-girl-smooth-massage-32782801.html#OnlyVideo
            // window.stop();
            G_funcToTest = function () {
                return typeof mp4Encodings !== "undefined" && mp4Encodings[0];
            };
            G_funcToRun = function () {
                var contentURL = location.protocol + mp4Encodings[mp4Encodings.length-1].filename;
                console.log('contentURL: ', contentURL);
                // alert(refineVideo(contentURL));
                openURL(refineVideo(contentURL));
            };
            waitForCondition(G_funcToTest, G_funcToRun, G_delay, G_tries, G_timerGroup);
        }
        else {
            G_funcToTest = function () {
                return typeof mp4Encodings !== "undefined" && mp4Encodings[0];
            };
            G_funcToRun = function () {
                G_contentURL = G_shortURL + '#OnlyVideo';
                G_sampleURL = location.protocol + mp4Encodings[0].filename;
                // G_forceLoad = true;
                G_posterURL = G_posterURL ? G_posterURL : location.protocol + document.querySelector('div[poster]').getAttribute('poster');
                G_postersArray = CreateLinksList(G_posterURL, /^.*\/\/(.*.com\/(.*?))-\d+.jpg/i, location.protocol+'//$1-$NUM.jpg', 1, 15); console.log('G_posters:\n', G_postersArray);
                G_stickTo = document.querySelector('div.video-info'); G_stickPosition = 1;
                // --------------------------------------------------------------------------------
                G_standartAddEmbedCodeFunc();
            };
            waitForElement('div[poster]', 'poster', G_funcToRun, G_delay, G_tries, G_timerGroup);
        }
    }

    else if (
        G_pageURL.matchLink('https?://www.veporns.com/')
    ) {
        if (
            G_pageURL.matchLink('https?://www.veporns.com/video/*') // http://www.veporns.com/video/eroticax-gina-valentina-happy-endings-h245979cc07d1676
        ) {
            G_funcToRun = function () {
                G_contentURL = document.querySelector('#playerbox > iframe[src^="http"]').src;
                G_posterURL = document.querySelector('meta[itemprop="thumbnailUrl"]').content;
                G_sampleURL = null;
                G_stickTo = document.querySelector('.box.info'); G_stickPosition = 1;
                // --------------------------------------------------------------------------------
                G_standartAddEmbedCodeFunc();
            };
            function initFunc(e) {
                waitForElement('#playerbox > iframe[src^="http"]', 'src', G_funcToRun, G_delay, G_tries, G_timerGroup);
            }
            // document.addEventListener("DOMContentLoaded", function(event) {
            for (let button of document.querySelectorAll('.controls > .r > a[href^="#server"]')) {
                button.addEventListener('click', initFunc);
            }
            // });
        }
    }

    else if (
        G_pageURL.matchLink('https?://hqporner.com')
    ) {
        if (
            G_pageURL.matchLink('https?://hqporner.com/hdporn/*') // https://hqporner.com/hdporn/83708-cute_teen_tied_to_tree_and_fucked.html
        ) {
            G_funcToRun = function() {
                // https://hqporner.com/?q=GINA LOOKS GOOD IN RED
                let header = document.querySelector('.box.page-content header');
                let iframe_id = 'thumbs';
                let iframe = document.querySelector('iframe#' + iframe_id);
                function checkIframeContent(iframe) {
                    /*
                    // let w = document.querySelectorAll('iframe[src*="/hqporner.com/?q="]')[0].contentWindow;
                    let win = iframe.contentWindow
                    let globals = Object.keys(win);
                    for (let variable of globals) {
                        if (variable.match(/^preload_\d+$/)) console.log(variable, '=', win[variable]);
                    };
                    */
                    let matched = location.pathname.match(/.*\/(\d+).*$/);
                    if (matched) {
                        let id = matched[1];
                        if (id.match(/^\d+$/)) {
                            let win = iframe.contentWindow
                            let globals = Object.keys(win);
                            let variable = 'preload_' + id;
                            if (variable) {
                                G_postersArray = win[variable];
                                if (G_postersArray && G_postersArray.length > 0) {
                                    let tmp = []; for (let item of G_postersArray) {
                                        if (typeof item !== 'undefined') tmp.push(item);
                                    };
                                    G_postersArray = tmp;
                                    let main_poster = G_postersArray[G_postersArray.length-1].replace(/^(.*)_\d+\.jpg$/, '$1_main.jpg');
                                    G_postersArray.push(main_poster);
                                    G_posterURL = G_postersArray[G_postersArray.length-1];
                                    console.log('G_postersArray:', G_postersArray);
                                    G_embedCodePosterSelector = addEmbedCodePosterSelector(G_postersArray);
                                    G_embedCodeImageInput.value = G_posterURL;
                                    G_embedCodePoster.src = G_posterURL;
                                    iframe.remove();
                                };
                            };
                        };
                    };
                };
                if (!iframe) {
                    iframe = document.createElement('iframe');
                    iframe.id = iframe_id;
                    iframe.onload = function(){checkIframeContent(iframe);};
                    header.appendChild(iframe);
                };
                let stars = document.querySelector('.icon.fa-star-o');
                stars = stars ? (' ' + stars.innerText) : '';
                iframe.src = 'https://hqporner.com/?q=' + header.querySelector('h1.main-h1').innerText + stars;
                // --------------------------------------------------------------------------------
                G_contentURL = document.querySelector('iframe').src;
                G_posterURL = (
                    document.querySelector('meta[name="thumbnail"]') ?
                    document.querySelector('meta[name="thumbnail"]').content :
                    document.querySelector('meta[property="og:image"]') ?
                    document.querySelector('meta[property="og:image"]').content
                    : ''
                );
                // G_posterURL = G_posterURL.replace('/yespornplease.com/images/', '/itmx.yespornplease.com/'); // '/i3.yespornplease.com/'
                // G_posterURL = G_posterURL.replace('/yespornplease.com/images/', '/i3.yespornplease.com/'); // '/i3.yespornplease.com/'
                // console.log(G_posterURL);
                // G_postersArray = CreateLinksList(G_posterURL, /^(https:\/\/)?(.*yespornplease.com)\/(\d+\/.*?\/\d+x\d+)_\d+.jpg/i, location.protocol + '//$2/$3_$NUM.jpg', 1, 100); console.log('G_posters:\n', G_postersArray);
                G_stickTo = document.querySelector('div.content.content-left > div.box.page-content'); G_stickPosition = 1;
                // --------------------------------------------------------------------------------
                for (let a of document.querySelectorAll('.fa-star-o > a')) {
                    let s = a.innerText.trim();
                    G_categories[s] = '';
                };
                for (let a of document.querySelectorAll('.page-content section a.tag-link')) {
                    let s = a.innerText.trim();
                    G_categories[s] = '';
                };
                G_standartAddEmbedCodeFunc();
            };
            // document.addEventListener("DOMContentLoaded", function(event) {
            waitForElement('iframe', 'src', G_funcToRun, G_delay, G_tries, G_timerGroup);
            // });
        }
    }

    else if (
        G_pageURL.matchLink('https://mydaddy.cc/video/*/')
    ) {
        // G_noPlayerExtension = true;
        let re;
        let regExp1 = /file:."(.*?\/(\d+)\.mp4)"/gi, matchedScriptText;
        let regExp2 = /src=\\"(.*?\/(\d+)\.mp4)\\"/gi; // src=\"//s13.bigcdn.cc/pubs/5e601c64b7100/360.mp4\"
        let getMatchedScriptText = function(regExp) {
            for (let script of document.scripts) {
                let text = script.text;
                if (text.match(regExp)) {
                    re = regExp;
                    return(text);
                };
            };
        };
        G_funcToTest = function() {
            matchedScriptText = getMatchedScriptText(regExp1) || getMatchedScriptText(regExp2);
            return matchedScriptText;
        };
        G_funcToRun = function() {
            // --------------------------------------------------------------------------------
            let data = {}, result; while((result = re.exec(matchedScriptText)) !== null) {
                let url = result[1].trim();
                let quality = Math.floor(result[2].trim());
                data[quality] = url;
                // console.log('url:', url);
                // console.log('quality:', quality);
            };
            console.log('data:', data);
            let compare = 0; for (let quality of Object.keys(data)) {
                if (quality > compare && quality < G_qualityLimit) {
                    G_contentURL = location.protocol + data[quality];
                    console.log('url:', G_contentURL);
                    console.log('quality:', quality);
                };
            };
            console.log('G_contentURL:', G_contentURL);
            // return;
            // --------------------------------------------------------------------------------
            G_standartReCastFunc();
        };
        // waitForElement('body video > source[src], body video[src]', 'src', G_funcToRun, G_delay, G_tries, G_timerGroup);
        waitForCondition(G_funcToTest, G_funcToRun, G_delay, G_tries * G_triesReCastMult, G_timerGroup);
    }

    // ================================================================================

    else if (
        G_pageURL.matchLink('https?://openload.co/embed/*') || // https://openload.co/embed/GwWaJKr7q-g/
        G_pageURL.matchLink('https?://oload.tv/embed/*') || // https://oload.tv/embed/9RPKFjnnBCw/33628.mp4
        G_pageURL.matchLink('https?://oload.info/embed/*') || // https://oload.info/embed/GkrmWmRxsGM/
        G_pageURL.matchLink('https?://oload.stream/embed/*') || // https://oload.stream/embed/_5lSwGYiAMc/
        G_pageURL.matchLink('https?://oload.xyz/embed/*') || // https://oload.xyz/embed/kuar1R4lKQw/
        G_pageURL.matchLink('https?://oload.download/embed/*') || // https://oload.download/embed/MXmOoScjRCs/45275.mp4
        G_pageURL.matchLink('https?://oload.biz/embed/*') || // https://oload.download/embed/KPgg6tUV_n0/16396.mp4
        G_pageURL.matchLink('https?://oload.*/embed/*') // https://oload.life/embed/7zh5fZ9bofM
    ) {
        var src_span = document.querySelector('#streamurl') || document.querySelector('span[id^="stream"]');
        G_funcToTest = function () {
            var ready, url = src_span;
            if (url && url.innerText.trim() !== '' && !url.innerText.toLowerCase().match("HERE IS THE LINK".toLowerCase())) ready = true;
            else {
                if (!src_span) {
                    document.querySelectorAll('div > p, span').forEach(function (item) {
                        var text = item.innerText;
                        // var match = text.match(/^[\w\d]+-w~\d+~\d+\.\d+\.\d+\.\d+\~[\w\d]+$/); // https://openload.co/embed/en5tCxDT7-w/
                        // http://pron.tv/l/Jenna-Reid-MP4-mp4/ezcexss2 // yybXOZwKGAg~1523412842~37.25.0.0~_27EYtA9
                        var match = text.match(/^.+~\d+~\d+\.\d+\.\d+\.\d+~.+$/);
                        if (match && match[0]) {
                            src_span = document.createElement('span');
                            src_span.id = '#streamurl';
                            src_span.innerText = text;
                            document.body.appendChild(src_span);
                            src_span = item;
                            ready = true;
                        }
                    });
                }
            }
            return ready;
        };
        G_funcToRun = function () {
            var url = src_span;
            var contentURL = location.protocol + '//' + location.host + '/stream/' + url.innerText + '?mime=true';
            // var posterURL = document.querySelector('#olvideo_html5_api').poster;
            console.log('contentURL: ', contentURL);
            var mediaData = {};
            mediaData.url = G_pageURL; // queryURL;
            mediaData.src = contentURL;
            window.parent.postMessage(Object.assign({sender: 'ANSWER'}, mediaData), '*');
            openURL(refineVideo(contentURL));
        };
        waitForCondition(G_funcToTest, G_funcToRun, G_delay, G_tries, G_timerGroup);
        // document.addEventListener('DOMContentLoaded', funcToRun, false);
        // ================================================================================
    }

    else if (
        G_pageURL.matchLink('https?://(www.)?jjgirls.com/*')
    ) {
        // addPageControlKeys('a[rel="prev"]', 'a[rel="next"]');
        if (
            G_pageURL.matchLink('https?://(www.)?jjgirls.com/pornpics/*') // https://www.jjgirls.com/pornpics/prettydirty-gina-valentina-brunette-latina-pee-wet
        ) {
            let show = function() {let css = document.querySelectorAll('head > style.hide-private');for (let s of css) {s.remove();};}
            let hide = function() {show(); addGlobalStyle(`.xcam, .related a[href^="/direct/"] {display: none;}`, 'hide-private');};
            function toggleShowPrivate() {
                let hidePrivate = GM_getValue('hidePrivate', false);
                if (hidePrivate) {
                    show();
                    GM_setValue('hidePrivate', false)
                }
                else {
                    hide();
                    GM_setValue('hidePrivate', true)
                }
            }
            let hidePrivate = GM_getValue('hidePrivate', false);
            if (hidePrivate) {hide();};
            GM_registerMenuCommand('Toggle Show Private', function(){toggleShowPrivate();}, '');
            //
            var imagesArray = [], thumbsArray = [];
            G_funcToRun = function () {
                if (imagesArray.length == 0) {
                    for (let link of document.querySelectorAll('div.related > a[href*="://pics.jjgirls.com/pictures/"]')) {
                        var imageURL = link.href, img = link.querySelector('img');
                        if (img) {
                            var thumbURL = ''; //img.src;
                            thumbsArray.push(thumbURL);
                            imagesArray.push(imageURL);
                        }
                    };
                    for (let img of document.querySelectorAll('a[href] > img[src]')) {
                        img.src = img.src.replace(/(.*)\/hd-(.*)/i, '$1/$2');
                    };
                };
                G_contentTitle = document.querySelector('h1.info.fss').innerText.trim(); // Free PornPics SexPhotos XXxImages HD Gallery!
                G_contentURL = imagesArray[imagesArray.length-1];
                G_posterURL = imagesArray[imagesArray.length-1]; // thumbsArray[0];
                G_postersArray = imagesArray; //thumbsArray; console.log('G_posters:\n', G_postersArray);
                G_stickTo = document.querySelector('div.related'); G_stickPosition = 1;
                G_standartAddEmbedCodeFunc();
                for (let i in thumbsArray) {
                    G_contentURL = imagesArray[i];
                    G_posterURL = thumbsArray[i];
                    updateEmbedCodeText(G_embedCodeTextArea, i == 0, G_delimiter);
                }
                // G_embedCodeTextArea.value = '<!-- ' + G_contentTitle + ' -->\n' + G_embedCodeText;
            };
            // --------------------------------------------------------------------------------
            waitForElement('div.related > a[href^="http"]', 'href', G_funcToRun, G_delay, G_tries, G_timerGroup);
        };
    }

    else if (
        G_pageURL.matchLink('https?://www.babesandstars.com/*')
    ) {
        // addPageControlKeys('a[rel="prev"]', 'a[rel="next"]');
        if (
            G_pageURL.matchLink('https?://www.babesandstars.com/*/*/*/') // http://www.babesandstars.com/b/bethanie-badertscher/hlgk/
        ) {
            G_funcToRun = function () {
                var imagesArray = [], thumbsArray = [];
                for (let link of document.querySelectorAll('div.my_gallery figure > a[href]')) {
                    var imageURL = link.href, img = link.querySelector('img');
                    if (img) {
                        var thumbURL = img.src;
                        // var imageURL = thumbURL.replace(/(.*)\/t(\d+.jpg)/i, '$1/$2'); // http://static.babesandstars.com/galleries/62000/62874/t07.jpg --> http://static.babesandstars.com/galleries/62000/62874/07.jpg
                        thumbsArray.push(thumbURL);
                        imagesArray.push(imageURL);
                    }
                };
                G_contentTitle = document.querySelector('title').innerText.trim(); // Frisky teenagers Natalie Monroe and Ava Taylor are giving their mouths and nubs for fuck
                G_contentURL = imagesArray[imagesArray.length-1];
                G_posterURL = thumbsArray[thumbsArray.length-1]; // thumbsArray[0];
                // G_posterStyle = {'width' : '117px', 'min-height' : '162px', 'min-width' : 'auto', 'max-height' :  'auto', 'height' : 'auto', 'zoom' : '0.5'};
                G_postersArray = thumbsArray; console.log('G_posters:\n', G_postersArray);
                G_stickTo = document.querySelector('div.my_gallery'); G_stickPosition = 1;
                G_standartAddEmbedCodeFunc();
                for (let i in thumbsArray) {
                    G_contentURL = imagesArray[i];
                    G_posterURL = thumbsArray[i];
                    updateEmbedCodeText(G_embedCodeTextArea, i == 0, G_delimiter);
                }
                // G_embedCodeTextArea.value = '<!-- ' + G_contentTitle + ' -->\n' + G_embedCodeText;
            };
            // --------------------------------------------------------------------------------
            // document.addEventListener("DOMContentLoaded", function(event) {
            waitForElement('div.my_gallery figure > a[href] img', 'src', G_funcToRun, G_delay, G_tries, G_timerGroup);
            // });
        };
    }

    else if (
        G_pageURL.matchLink('https?://www.definebabe.com/*')
    ) {
        // addPageControlKeys('a[rel="prev"]', 'a[rel="next"]');
        if (
            G_pageURL.matchLink('https?://www.definebabe.com/gallery/*') // http://www.definebabe.com/gallery/2hha/ava-taylor/
        ) {
            G_funcToRun = function () {
                var imagesArray = [], thumbsArray = [];
                for (let link of document.querySelectorAll('div.gallery div.thumbnails a[href]')) {
                    var imageURL = link.href, img = link.querySelector('img');
                    if (img) {
                        var thumbURL = img.src;
                        thumbsArray.push(thumbURL);
                        imagesArray.push(imageURL);
                    }
                };
                G_contentTitle = document.querySelector('title').innerText.trim(); // Frisky teenagers Natalie Monroe and Ava Taylor are giving their mouths and nubs for fuck
                G_contentURL = imagesArray[imagesArray.length-1];
                G_posterURL = imagesArray[imagesArray.length-1]; // thumbsArray[0];
                G_postersArray = imagesArray; //thumbsArray; console.log('G_posters:\n', G_postersArray);
                G_stickTo = document.querySelector('div.thumbnails'); G_stickPosition = 1;
                G_standartAddEmbedCodeFunc();
                for (let i in thumbsArray) {
                    G_contentURL = imagesArray[i];
                    G_posterURL = thumbsArray[i];
                    updateEmbedCodeText(G_embedCodeTextArea, i == 0, G_delimiter);
                }
                // G_embedCodeTextArea.value = '<!-- ' + G_contentTitle + ' -->\n' + G_embedCodeText;
            };
            // --------------------------------------------------------------------------------
            // document.addEventListener("DOMContentLoaded", function(event) {
            waitForElement('div.gallery div.thumbnails a[href] img', 'src', G_funcToRun, G_delay, G_tries, G_timerGroup);
            // });
        };
    }

    else if (
        G_pageURL.matchLink('https?://www.pornpics.com')
    ) {
        var class_name = 'thumbwook';
        var valid = (item) => {return item.querySelector('a.rel-link > img');};
        var i = 1, append_text = (item) => {
            if (valid(item)) {
                var text = item.querySelector('p.image_number_text');
                if (!text) {
                    text = document.createElement('p');
                    item.appendChild(text);
                    text.innerText = '#' + i;
                    text.class = 'image_number_text';
                    text.style['font-size'] = 'x-large';
                    text.style.margin = '0';
                };
                i++;
            };
        };
        var array = document.querySelectorAll('.' + class_name);
        for (let item of array) {append_text(item);}
        document.addEventListener('DOMNodeInserted', function handleNewElements(event) {
            var item = event.target;
            var item_class = item.className ? item.className.trim() : '';
            if (item_class == class_name) { append_text(item); }
        }, false);
        if (
            G_pageURL.matchLink('https?://www.pornpics.com/galleries/*')
        ) {
            G_funcToRun = function () {
                var linksArray = document.querySelectorAll('#main li.thumbwook > a'), imagesArray = [], thumbsArray = [];
                for (let link of linksArray) {
                    var imageURL = link.href, img = link.querySelector('img');
                    if (img) {
                        var thumbURL = img.src;
                        thumbsArray.push(thumbURL);
                        imagesArray.push(imageURL);
                    };
                };
                G_contentTitle = document.querySelector('title').innerText.trim(); // Frisky teenagers Natalie Monroe and Ava Taylor are giving their mouths and nubs for fuck
                G_contentURL = imagesArray[imagesArray.length-1];
                G_posterURL = imagesArray[imagesArray.length-1]; // thumbsArray[0];
                G_postersArray = imagesArray; //thumbsArray; console.log('G_posters:\n', G_postersArray);
                G_stickTo = document.querySelector('#main'); G_stickPosition = 1;
                G_standartAddEmbedCodeFunc();
                for (let i in thumbsArray) {
                    G_contentURL = imagesArray[i];
                    G_posterURL = thumbsArray[i];
                    let link = linksArray[i];
                    G_videoWidth = link.dataset && link.dataset.size ? link.dataset.size.split('x')[0] : null;
                    G_videoHeight = link.dataset && link.dataset.size ? link.dataset.size.split('x')[1] : null;
                    updateEmbedCodeText(G_embedCodeTextArea, i == 0, G_delimiter);
                }
                // G_embedCodeTextArea.value = '<!-- ' + G_contentTitle + ' -->\n' + G_embedCodeText;
            };
            // --------------------------------------------------------------------------------
            document.addEventListener("DOMContentLoaded", function(event) {
                waitForElement('#main', null, G_funcToRun, G_delay, G_tries, G_timerGroup);
            });
            //
            // return; // SKIP REST OF THE CODE
        };
    }

    else if (
        G_pageURL.matchLink('https?://www.sex.com/*')
    ) {
        // /*
        // document.addEventListener('DOMContentLoaded', function() {
        addGlobalStyle([
            'body * { background-color: rgb(24, 24, 24) !important; color: wheat;}',
            '::-webkit-scrollbar { width: 18px; height: 18px;}',
            '::-webkit-scrollbar-button { background: no-repeat #222; background-size: 18px; background-position: center bottom;}',
            "::-webkit-scrollbar-button:horizontal:decrement { background-image: url('" +
            'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" fill="Wheat"><polygon points="24,64 48,32 72,64" transform="rotate(-90 48 48)"/>'+
            "</svg>');}" +
            "::-webkit-scrollbar-button:horizontal:increment { background-image: url('" +
            'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" fill="Wheat"><polygon points="24,64 48,32 72,64" transform="rotate(90 48 48)"/>'+
            "</svg>');}" +
            "::-webkit-scrollbar-button:vertical:increment { background-image: url('" +
            'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" fill="Wheat"><polygon points="24,64 48,32 72,64" transform="rotate(180 48 48)"/>'+
            "</svg>');}" +
            "::-webkit-scrollbar-button:vertical:decrement { background-image: url('" +
            'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" fill="Wheat"><polygon points="24,64 48,32 72,64" transform="rotate(0 48 48)"/>'+
            "</svg>');}" +
            '::-webkit-scrollbar-track-piece { background-color: #111;}',
            '::-webkit-scrollbar-thumb { background-color: #444; border-radius: 3px;}',
            '::-webkit-scrollbar-thumb:hover { background-color: #999;}',
            '::-webkit-scrollbar-corner { background-color: #111;}',
            'input * { borders: 1px wheat solid !important; color: wheat;}',
        ].join('\n'), 'misc_style');
        //});
        // */
        if (
            G_pageURL.matchLink('https?://www.sex.com/pin/*/') ||
            G_pageURL.matchLink('https?://www.sex.com/picture/*/')
        ) {
            G_funcToRun = function () {
                let source = document.querySelector('.image_frame img');
                G_contentURL = source.src.replace(/(.*?)\?.*/, '$1');
                G_posterURL = document.querySelector('meta[itemprop="thumbnail"]').content;
                G_stickTo = document.querySelector('.image_frame'); G_stickPosition = 1;
                G_videoWidth = source.naturalWidth; G_videoHeight = source.naturalHeight;
                G_standartAddEmbedCodeFunc();
                setTimeout(function() {
                    G_videoWidth = source.naturalWidth;
                    G_videoHeight = source.naturalHeight;
                    updateEmbedCodeTextColor();
                }, 1000);
            };
            // setTimeout(function() {
            waitForElement('.image_frame img', 'src', G_funcToRun, G_delay, G_tries, G_timerGroup);
            //}, 2000);
        }
        //
        return; // SKIP REST OF THE CODE
    }

    else if (
        G_pageURL.matchLink('*.jpg')
    ) {
        G_funcToRun = function () {
            var val = 0;
            G_contentURL = G_shortURL;
            G_posterURL = G_shortURL;
            G_stickTo = document.querySelector('body'); G_stickPosition = 0;
            G_standartAddEmbedCodeFunc();
        };
        waitForElement('img', 'src', G_funcToRun, G_delay, G_tries, G_timerGroup);
        return; // SKIP REST OF THE CODE
    }

    else if (
        G_pageURL.matchLink('https?://biqle.ru/*') ||
        G_pageURL.matchLink('https?://daftsex.com/*')
    ) {
        /*
        if (G_pageURL.match('#ReCast')) { // https://biqle.ru/watch/-159565098_456242372#ReCast
            // window.stop();
            G_funcToTest = function () {return document.querySelector('body iframe[src*="/player/"]');};
            G_funcToRun = function () {G_contentURL = G_funcResult.src; G_standartReCastFunc();};
            waitForCondition(G_funcToTest, G_funcToRun, G_delay, G_tries, G_timerGroup);
        }
        else if (
            G_pageURL.matchLink('https?://biqle.ru/watch/*') // https://biqle.ru/watch/-159565098_456242372
        ) {
            G_funcToRun = function () {
                // --------------------------------------------------------------------------------
                G_contentURL = G_shortURL + '#ReCast';
                G_posterURL = G_posterURL ? G_posterURL : getAbsoluteUrl(document.querySelector('link[itemprop="thumbnailUrl"]').getAttribute('href', 2));
                // G_postersArray = CreateLinksList(G_posterURL, /^(https?:\/\/.*eporner.com\/thumbs\/.*)\/\d+_(\d+).jpg/i, '$1/$NUM_$2.jpg', 1, 100); console.log('G_posters:\n', G_postersArray);
                G_stickTo = document.querySelector('.video > .heading'); G_stickPosition = 1;
                // --------------------------------------------------------------------------------
                // G_qualitySampleSource = document.querySelector('#vid_container_id video[src]');
                // G_previewURL = G_posterURL.replace('/full.jpg', '/vidthumb.mp4'); // https://s14.trafficdeposit.com//blog/vid/5ba53b584947a/5c3fa60edb1ed/vidthumb.mp4
                G_standartAddEmbedCodeFunc();
                // --------------------------------------------------------------------------------
            };
            waitForElement('iframe[src]', 'src', G_funcToRun, G_delay, G_tries, G_timerGroup);
        }
        */
        // /*
        if (G_pageURL.match('#ReCast')) { // https://biqle.ru/watch/-159565098_456242372#ReCast
            return;
        }
        // */
        else if (
            G_pageURL.matchLink('https?://biqle.ru/watch/*') || // https://biqle.ru/watch/-159565098_456242372
            G_pageURL.matchLink('https?://daftsex.com/watch/*') // https://daftsex.com/watch/-111379583_171930025
        ) {
            G_funcToRun = function() {
                // --------------------------------------------------------------------------------
                G_contentURL = G_shortURL; // + '#ReCast';
                G_posterURL = (
                    document.querySelector('meta[name="thumbnail"]') ?
                    document.querySelector('meta[name="thumbnail"]').content :
                    document.querySelector('meta[property="og:image"]') ?
                    document.querySelector('meta[property="og:image"]').content :
                    null
                );
                // G_posterURL = G_posterURL.replace('/yespornplease.com/images/', '/itmx.yespornplease.com/'); // '/i3.yespornplease.com/'
                G_posterURL = G_posterURL ? G_posterURL : getAbsoluteUrl(document.querySelector('link[itemprop="thumbnailUrl"]').getAttribute('href', 2));
                // console.log(G_posterURL);
                // G_postersArray = CreateLinksList(G_posterURL, /^(https:\/\/)?(.*yespornplease.com)\/(\d+\/.*?\/\d+x\d+)_\d+.jpg/i, location.protocol + '//$2/$3_$NUM.jpg', 1, 100); console.log('G_posters:\n', G_postersArray);
                // G_previewURL = G_posterURL.replace(/^(.*)\/\d+x\d+_\d+\.jpg/, '$1/video.mp4'); // https://i3.yespornplease.com/201906/bcrdnlu/video.mp4
                G_stickTo = document.querySelectorAll('.video > .heading, .video_info_wrapper > .heading')[0]; G_stickPosition = 1;
                // --------------------------------------------------------------------------------
                G_standartAddEmbedCodeFunc();
                G_messageTarget = document.querySelector('iframe').contentWindow;
            };
            // document.addEventListener("DOMContentLoaded", function(event) {
            waitForElement('iframe[src]', 'src', G_funcToRun, G_delay, G_tries, G_timerGroup);
            // });
        }
    }

    else if (
        G_pageURL.matchLink('https?://daxab.com/player/*')
    ) {
        G_funcToRun = function() {
            G_contentURL = document.querySelector('.videoplayer_dl_select ._item').href; // 1080p, 720p ...
            if (!G_contentURL || G_contentURL == '') {
                document.querySelector('.videoplayer_quality_select ._item').click();
                let G_funcToRun_2 = function() {G_contentURL = G_funcResult; G_standartReCastFunc();};
                // waitForElement('.videoplayer_dl_select ._item', 'href', G_funcToRun_2, G_delay, G_tries * G_triesReCastMult, G_timerGroup);
                waitForElement('.videoplayer_media_el', 'src', G_funcToRun_2, G_delay, G_tries * G_triesReCastMult, G_timerGroup);
            }
            else {
                G_standartReCastFunc();
            };
        };
        waitForElement('.videoplayer_dl_select ._item', null, G_funcToRun, G_delay, G_tries * G_triesReCastMult, G_timerGroup);
    }

    else if (
        G_pageURL.matchLink('https?://*.pornesq.com/*')
    ) {
        // if (getCookie('lang') !== 'en') {deleteCookie('lang'); setCookie('lang', 'en', {expires: 0});};
        // --------------------------------------------------------------------------------
        let actualSource = () => {
            var source = document.querySelector('video#video_html5_api > source[src]');
            if (!source) return;
            var contentURL = source.src;
            return contentURL;
        };
        // --------------------------------------------------------------------------------
        if (G_pageURL.match('#ReCast')) { // https://www.pornesq.com/video/21809/lana-rhoades-19-year-old-natural-busty-teen-gets-covered-in-cream#ReCast
            // window.stop();
            G_funcToTest = function() {return actualSource();};
            G_funcToRun = function() {G_contentURL = G_funcResult; G_standartReCastFunc();};
            waitForCondition(G_funcToTest, G_funcToRun, G_delay, G_tries * G_triesReCastMult, G_timerGroup);
        }
        // --------------------------------------------------------------------------------
        else if (
            G_pageURL.matchLink('https?://www.pornesq.com/embed/*') // https://www.pornesq.com/embed/a531f21d4128a5efcf31
        ) {
            G_funcToRun = function () {
                G_contentURL = actualSource();
                G_contentURL = G_contentURL ? G_contentURL : G_funcResult.src;
                if (G_contentURL) openURL(refineVideo(G_contentURL));
            };
            waitForElement('video#video_html5_api > source[src]', null, G_funcToRun, G_delay, G_tries, G_timerGroup);
        }
        // --------------------------------------------------------------------------------
        else if (
            G_pageURL.matchLink('https?://www.pornesq.com/video/*/*') // https://www.pornesq.com/video/21809/lana-rhoades-19-year-old-natural-busty-teen-gets-covered-in-cream
        ) {
            G_funcToRun = function () {
                G_sampleURL = actualSource();
                // G_contentURL = document.querySelector('link[rel="canonical"]').href; //pageURL + '#ReCast';
                G_contentURL = document.querySelector('textarea#video_embed_code').value.match(/.*src="(.*?)".*/i)[1]; // https://www.pornesq.com/embed/a531f21d4128a5efcf31
                G_posterURL = document.querySelector('video#video_html5_api').poster; // https://www.pornesq.com/media/videos/tmb/21809/1.jpg
                // G_posterStyle = {'width' : 'auto', 'min-height' : '162px', 'min-width' : 'auto', 'max-height' :  'auto', 'height' : 'auto', 'zoom' : '0.5'};
                G_postersArray = CreateLinksList(G_posterURL, /^(.*)\/.*?.jpg$/i, '$1/$NUM.jpg', 1, 20); console.log('G_posters:\n', G_postersArray);
                G_postersArray = [G_posterURL].concat(G_postersArray);
                G_stickTo = document.querySelector('.video-container'); G_stickPosition = 1;
                // --------------------------------------------------------------------------------
                G_standartAddEmbedCodeFunc();
                var eventCatcher, media;
                waitForCondition(function(){
                    eventCatcher = eventCatcher ? eventCatcher : document.querySelector('div.video-container');
                    media = media ? media : document.querySelector('video#video_html5_api'); // document.querySelector('div#player video > source');
                    // if (media) {media = media.parentNode};
                    return eventCatcher && media;
                }, function() {
                    mediaMouseControls(eventCatcher, media, 1);
                }, G_delay, G_tries, G_timerGroup);
            };
            // document.addEventListener("DOMContentLoaded", function(event) {
            waitForElement('video#video_html5_api > source[src]', null, G_funcToRun, G_delay, G_tries, G_timerGroup);
            // });
        }
    }

    else {
        // alert(G_pageURL);
        console.log('No Match:', G_pageURL);
    }

    console.log('G_matchedLink:', G_matchedLink);
})();
