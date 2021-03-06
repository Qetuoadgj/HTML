// ==UserScript==
// @name         HTML GALLERY TEST (AJAX) v0.4
// @icon         http://findicons.com/files/icons/1185/flurry_ramp_champ/128/star_struck.png
// @version      2.9.58
// @description  Pure JavaScript version.
// @author       Aegir
// @run-at       document-start
// @noframes
// @downloadURL  https://github.com/Qetuoadgj/HTML/raw/master/HTML%20GALLERY%20TEST%20(AJAX)%20v0.4.user.js
// @homepageURL  https://github.com/Qetuoadgj/HTML/tree/master
//
// @match        file:///*/2.0.4.html*
// @match        file:///*/2.0.2.html*
// @match        file:///*/2.*.*.html*
// @match        file:///*/HTML/tmp/html/*.html*
//
// @exclude      file:///*/HTML_Indent.html
//
// ------------- http://api.jqueryui.com/sortable/ -------------
// @require      https://code.jquery.com/jquery-1.12.4.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.js
// -------------------------------------------------------------
//
// @grant        GM_registerMenuCommand
// ==/UserScript==

// Require chrome extension:
// https://chrome.google.com/webstore/detail/native-hls-playback/emnphkkblegpebimobpbekeedfgemhof

(function() {
    'use strict';

    // Your code here...

    var isScripted = document.documentElement.getAttribute("isScripted");
    if (isScripted == "true") return;
    document.documentElement.setAttribute("isScripted", "true");

    const $ = window.jQuery;
    /* globals disabledHosts */
    var G_disabledHosts = (typeof disabledHosts == 'undefined' || !disabledHosts) ? [] : disabledHosts;
    // console.log('disabledHosts: ', G_disabledHosts);
    /* globals reCastHosts */
    var G_reCastHosts = (typeof reCastHosts == 'undefined' || !reCastHosts) ? [] : reCastHosts;
    // console.log('reCastHosts: ', G_reCastHosts);
    Array.prototype.unique = function() {
        let a = this.concat();
        for(let i=0; i<a.length; ++i) {for(let j=i+1; j<a.length; ++j) {if (a[i] === a[j]) a.splice(j--, 1);}}
        return a;
    };
    G_reCastHosts = G_reCastHosts.concat([]).unique();
    // console.log('G_reCastHosts:', G_reCastHosts);
    // closePopups = 1;

    // ---------------------
    function isOdd(x) {return x & 1;};
    function isEven(x) {return !( x & 1 );};
    // ---------------------
    function shiftKeyIsDown() {return !!window.event.shiftKey;}
    function ctrlKeyIsDown() {return !!(window.event.ctrlKey || window.event.metaKey);}
    function altKeyIsDown() {return !!window.event.altKey;}
    // ---------------------
    function eventFire(el, etype) {
        if (el.fireEvent) {
            el.fireEvent('on' + etype);
        }
        else {
            let evObj = document.createEvent('Events');
            evObj.initEvent(etype, true, false);
            el.dispatchEvent(evObj);
        };
    };
    // ---------------------
    // -- GET VALUSE FROM URL [START]
    function getParamsFromURL(searchString) {
        let parse = function(params, pairs) {
            let pair = pairs[0];
            let parts = pair.split('=');
            let key = decodeURIComponent(parts[0]).replace(/.*?\?/, '');
            let value = decodeURIComponent(parts.slice(1).join('='));
            // Handle multiple parameters of the same name
            if (typeof params[key] === "undefined") params[key] = value;
            else params[key] = [].concat(params[key], value);
            return pairs.length == 1 ? params : parse(params, pairs.slice(1));
        };
        // Get rid of leading ?
        return searchString.length === 0 ? {} : parse({}, searchString.split('&')); // .substr(1)
    }
    function getParams() {
        let params = getParamsFromURL(location.search);
        // Finally, to get the param you want
        // params['c'];
        /*
        if (params.q) {
            searchField.value = params.q;
            // Create a new 'change' event
            let event = new Event('change');
            // Dispatch it.
            searchField.dispatchEvent(event);
        }
        */
        return params;
    }
    var params = getParams();
    // -- GET VALUSE FROM URL [END]
    // ---------------------

    //GLOBAL FUNCTIONS
    var KEY_BACKSPACE = 8,
        KEY_TAB = 9,
        KEY_ENTER = 13,
        KEY_SHIFT = 16,
        KEY_CTRL = 17,
        KEY_ALT = 18,
        KEY_PAUSE_BREAK = 19,
        KEY_CAPS_LOCK = 20,
        KEY_ESCAPE = 27,
        KEY_PAGE_UP = 33,
        KEY_PAGE_DOWN = 34,
        KEY_END = 35,
        KEY_HOME = 36,
        KEY_LEFT_ARROW = 37,
        KEY_UP_ARROW = 38,
        KEY_RIGHT_ARROW = 39,
        KEY_DOWN_ARROW = 40,
        KEY_INSERT = 45,
        KEY_DELETE = 46,
        KEY_0 = 48,
        KEY_1 = 49,
        KEY_2 = 50,
        KEY_3 = 51,
        KEY_4 = 52,
        KEY_5 = 53,
        KEY_6 = 54,
        KEY_7 = 55,
        KEY_8 = 56,
        KEY_9 = 57,
        KEY_A = 65,
        KEY_B = 66,
        KEY_C = 67,
        KEY_D = 68,
        KEY_E = 69,
        KEY_F = 70,
        KEY_G = 71,
        KEY_H = 72,
        KEY_I = 73,
        KEY_J = 74,
        KEY_K = 75,
        KEY_L = 76,
        KEY_M = 77,
        KEY_N = 78,
        KEY_O = 79,
        KEY_P = 80,
        KEY_Q = 81,
        KEY_R = 82,
        KEY_S = 83,
        KEY_T = 84,
        KEY_U = 85,
        KEY_V = 86,
        KEY_W = 87,
        KEY_X = 88,
        KEY_Y = 89,
        KEY_Z = 90,
        KEY_LEFT_WINDOW_KEY = 91,
        KEY_RIGHT_WINDOW_KEY = 92,
        KEY_SELECT_KEY = 93,
        KEY_NUMPAD_0 = 96,
        KEY_NUMPAD_1 = 97,
        KEY_NUMPAD_2 = 98,
        KEY_NUMPAD_3 = 99,
        KEY_NUMPAD_4 = 100,
        KEY_NUMPAD_5 = 101,
        KEY_NUMPAD_6 = 102,
        KEY_NUMPAD_7 = 103,
        KEY_NUMPAD_8 = 104,
        KEY_NUMPAD_9 = 105,
        KEY_MULTIPLY = 106,
        KEY_ADD = 107,
        KEY_SUBTRACT = 109,
        KEY_DECIMAL_POINT = 110,
        KEY_DIVIDE = 111,
        KEY_F1 = 112,
        KEY_F2 = 113,
        KEY_F3 = 114,
        KEY_F4 = 115,
        KEY_F5 = 116,
        KEY_F6 = 117,
        KEY_F7 = 118,
        KEY_F8 = 119,
        KEY_F9 = 120,
        KEY_F10 = 121,
        KEY_F11 = 122,
        KEY_F12 = 123,
        KEY_NUM_LOCK = 144,
        KEY_SCROLL_LOCK = 145,
        KEY_SEMI_COLON = 186,
        KEY_EQUAL_SIGN = 187,
        KEY_COMMA = 188,
        KEY_DASH = 189,
        KEY_PERIOD = 190,
        KEY_FORWARD_SLASH = 191,
        KEY_GRAVE_ACCENT = 192,
        KEY_OPEN_BRACKET = 219,
        KEY_BACK_SLASH = 220,
        KEY_CLOSE_BRACKET = 221,
        KEY_SINGLE_QUOTE = 222
    ;

    var G_activePopUpWin;
    function popItUp(url, windowName, focus) {
        let newWindow = window.open(url, windowName, 'height=200, width=150');
        if (focus && window.focus) {
            newWindow.focus();
        };
        return newWindow;
    }

    function download(text, filename, type) { // http://stackoverflow.com/a/40139881
        let blob = new Blob([text], {type: (type || 'text/plain')}); // http://www.freeformatter.com/mime-types-list.html
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
    }

    Element.prototype.hasClass = function(cssClass) {
        let re = new RegExp('(^|\\s)' + cssClass + '(\\s|$)', 'g');
        if (re.test(this.className)) return true;
        return false;
    };

    Element.prototype.scrolledIntoView = function() {
        let coords = this.getBoundingClientRect();
        return ((coords.top >= 0 && coords.left >= 0 && coords.top) <= (window.innerHeight || document.documentElement.clientHeight));
    };

    function forEach(array, callback, scope) {for (let i = 0; i < array.length; i++) {callback.call(scope, i, array[i]);}}
    function isVisible(element) {
        let style = window.getComputedStyle(element);
        let isHidden = (style.display === 'none') || style.visibility === 'hidden';
        if (isHidden) return false;
        return element.offsetWidth > 0 || element.offsetHeight > 0 || element.getClientRects().length > 0;
    }
    // function commentElement(element, text) {let code = text || element.outerHTML; element.outerHTML = ('<!-- '+code+' -->');}
    function disableElement(element, remove, array = []) {
        array = array ? array : [element];
        for (let el of array) {
            let matched = element.dataset.content == el.dataset.content;
            if (matched) {
                if (remove) {
                    if (el.classList.contains('REMOVED')) el.classList.remove('REMOVED')
                    else el.classList.add('REMOVED')
                    // addClass(el, 'REMOVED');
                }
                else {
                    if (el.classList.contains('COMMENTED')) el.classList.remove('COMMENTED')
                    else el.classList.add('COMMENTED')
                    // addClass(el, 'COMMENTED');
                };
            };
        };
    };
    function favElement(element, toggle) {
        let thumbnailsArray = document.querySelectorAll('#previews > .spoilerbox > .thumbnail');
        for (let el of thumbnailsArray) {
            let matched = element.dataset.content == el.dataset.content;
            if (matched) {
                if (toggle) {
                    if (el.classList.contains('fav')) {
                        el.classList.remove('fav');
                        datasetRemove(el, 'categories', 'fav');
                    }
                    else {
                        addClass(el, 'fav');
                        datasetAdd(el, 'categories', 'fav');
                    };
                } else {
                    addClass(el, 'fav');
                };
            };
        };
    };

    function getDoctype() {return '<!DOCTYPE ' + document.doctype.name.toUpperCase() + (document.doctype.publicId ? (' PUBLIC "' + document.doctype.publicId.toUpperCase() + '"') : '') + (document.doctype.systemId ? (' "' + document.doctype.systemId.toUpperCase() + '"') : '') + '>';}

    function unEscapeSpecialChars(str) {
        return str.
        replace(/-\&nbsp;/g, '- ').
        replace(/\&amp;/g, '&')
        ;
    }

    function smartRemove(element) {
        if (element) {
            // if (element.previousSibling && element.previousSibling.nodeValue && element.previousSibling.nodeValue.trim() == "") {element.previousSibling.remove()};
            if (element.nextSibling && element.nextSibling.nodeValue && element.nextSibling.nodeValue.trim() == "") {element.nextSibling.remove();};
            let parent = element.parentNode;
            element.remove();
            if (parent) {
                let first = parent.firstChild, last = parent.lastChild;
                if (first && first == last && first.nodeValue && first.nodeValue.trim() == "") {
                    first.remove();
                }
                else if (last && last.nodeValue && last.nodeValue.match(/[\r\n]$/)) {
                    last.remove();
                };
            };
        };
    };

    function resetAttributes(node) {
        let clone = node.cloneNode(true);

        let removeItemsArray = clone.querySelectorAll('body .removeoncopy');
        if (!clone.dataset.copy) {
            for (let item of removeItemsArray) {smartRemove(item);};
        }
        else {
            for (let item of removeItemsArray) {item.classList.remove('removeoncopy');};
        };
        clone.classList.remove('removeoncopy');

        let spoilerButtonsArray = clone.querySelectorAll('.spoilertop');
        let spoilersArray = clone.querySelectorAll('.spoilerbox');
        let thumbnailsArray = clone.querySelectorAll('.thumbnail');

        /*
        let replaceStringInAttribute = function(element, attribute, string, replace) {
            let value = element[attribute];
            if (value && value.match(string)) {
                element.setAttribute(attribute, value.replace(string, replace));
            };
        };
        replaceStringInAttribute(clone, 'title', /\ncategories: \[.*\]/i, '')
        */

        if (clone.hasClass('thumbnail')) thumbnailsArray = [clone];

        let outputs = clone.querySelector('div#content');
        let iframeOutput, imgOutput, outputsArray = [];
        if (outputs) {
            iframeOutput = outputs.querySelector('#content_iframe');
            imgOutput = outputs.querySelector('#content_img');
            outputsArray.push(iframeOutput, imgOutput);
        }
        let backgroundsArray = clone.querySelectorAll('.background');
        let temporary = clone.querySelectorAll('.temporary');

        let closeButton = clone.querySelector('#closeButton');
        let nextButton = clone.querySelector('#nextButton');
        let delButton = clone.querySelector('#delButton');
        let prevButton = clone.querySelector('#prevButton');
        let favButton = clone.querySelector('#favButton');

        for (let button of [nextButton, delButton, prevButton, favButton, closeButton]) {
            if (button) {
                button.removeAttribute('width');
                button.removeAttribute('height');
                button.removeAttribute('style');
            };
        };

        for (let button of clone.querySelectorAll('*[data-title]')) {
            if (button) {
                button.dataset.title = button.dataset.title.replace(/[\r\n]+/g, '#~NL~#');
            };
        };

        clone.removeAttribute('style');
        forEach(spoilerButtonsArray, function(index, self) {
            // self.removeAttribute('style');
            // let image = self.querySelector('img'); if (image) image.remove();
            // let text = self.querySelector('p'); if (text) text.remove();
            // self.outerHTML = '<!-- DELETED -->';
            smartRemove(self)
        });
        forEach(spoilersArray, function(index, self) {
            self.removeAttribute('style');
            if (self.id && !self.id.match(/^category-/)) {self.removeAttribute('id');};
        });
        forEach(thumbnailsArray, function(index, self) {
            self.removeAttribute('style');
            let image = self.querySelector('img'); smartRemove(image); // if (image) image.remove();
            let video = self.querySelector('video'); smartRemove(video); // if (video) video.remove();
            self.removeAttribute('onmouseover'); self.removeAttribute('onmouseout');
            let text = self.querySelector('p'); smartRemove(text); // if (text) text.remove();
            removeClass(self, 'duplicate_1'); removeClass(self, 'duplicate_2');
            // replaceStringInAttribute(self, 'title', /\ncategories: \[.*\]/i, '')
            //
            for (let child of self.querySelectorAll('*')){smartRemove(child); /*child.remove()*/};
            // self.setAttribute('title', self.dataset.title.replace(/\n.*/, ''));
            // self.removeAttribute('data-title');
        });
        forEach(outputsArray, function(index, self) {
            self.removeAttribute('style');
            removeClass(self, 'minimized');
        });
        forEach(temporary, function(index, self) {smartRemove(self); /*self.remove();*/});
        forEach(backgroundsArray, function(index, self) {smartRemove(self); /* self.remove(); */});

        if (outputs) {iframeOutput.src = ''; imgOutput.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=';};

        let removed = clone.querySelectorAll('.REMOVED');
        forEach(removed, function(index, self) {
            // self.outerHTML = '<!-- DELETED -->'; /* self.remove(); */
            smartRemove(self);
        });

        let linkText = clone.querySelector('#linkText');
        smartRemove(linkText); // if (linkText) linkText.remove();

        let id = clone.getAttribute('id');
        let title = clone.dataset.title || clone.getAttribute('title');
        // if (id && id == title.toCamelCase()) clone.removeAttribute('id');
        if (id && id == title.toLowerCase().replace(/[\s.]+/ig, '_')) clone.removeAttribute('id');

        forEach(clone.querySelectorAll('.qualityText'), function(index, self) {smartRemove(self); /*self.remove();*/});
        forEach(clone.querySelectorAll('.hostText'), function(index, self) {smartRemove(self); /*self.remove();*/});
        forEach(clone.querySelectorAll('.remove-on-copy'), function(index, self) {smartRemove(self); /*self.remove();*/});

        clone.classList.remove('remove-on-copy');
        forEach(clone.querySelectorAll('.removeoncopy'), function(index, self) {self.classList.remove('removeoncopy');});
        //         for (let item of clone.querySelectorAll('*[data-title]')) {
        //             let title = item.dataset.title;
        //         };
        if (clone.dataset) {
            let title = clone.dataset.title;
            if (title && title.match(/\n/)) {
                let newTitle = title.replace(/\n/g, '&#10;')
                clone.dataset.title = newTitle;
                console.log(title, newTitle, clone.dataset.title);
            };
        };

        forEach(clone.querySelectorAll('.ui-sortable-handle'), function(index, self) {self.classList.remove('ui-sortable-handle');});
        forEach(clone.querySelectorAll('.ui-handle'), function(index, self) {self.classList.remove('ui-handle');});
        forEach(clone.querySelectorAll('.disabled-host'), function(index, self) {self.classList.remove('disabled-host');});
        clone.classList.remove('ui-handle');
        clone.classList.remove('ui-sortable');
        clone.classList.remove('ui-sortable-handle');

        forEach(clone.querySelectorAll('.ui-sortable'), function(index, self) {self.classList.remove('ui-sortable');});

        let commented = clone.querySelectorAll('.COMMENTED');
        forEach(commented, function(index, self) {
            // removeClass(self, 'COMMENTED');
            self.classList.remove('COMMENTED')
            self.outerHTML = '<!-- '+self.outerHTML+' -->';
        });

        // clone.innerHTML = clone.innerHTML.replace(/[ \t]+<!-- DELETED -->[\r\n]|<!-- DELETED -->[\r\n]/g, '');
        // clone.innerHTML = clone.innerHTML.replace(/[ \t]+<!-- DELETED -->|<!-- DELETED -->/g, '\n');

        let whitespace = clone.outerHTML.match(new RegExp('[ \t]+<\/'+clone.tagName+'>', 'gi')) || '';
        let spaces; if (whitespace) {let last = whitespace.length-1; spaces = whitespace[last]; spaces = spaces.replace(new RegExp('<\/'+clone.tagName+'>', 'gi'),'');}

        clone.innerHTML = clone.innerHTML.replace(/(<\/div\>)(<div )/g, '$1\n'+whitespace+'\t$2');
        clone.innerHTML = clone.innerHTML.replace(/([\r\n]+[\t ]+){3,}/g, '$1$1');

        // clone.innerHTML = clone.innerHTML.replace(/^\s*[\r\n]/gm, '');
        clone.innerHTML = clone.innerHTML.replace(/(<\/\w+>)\n(\t+)\n+(<\/\w+>)/gi, '$1\n$2$3');

        forEach(clone.querySelectorAll('.recast-host'), function(index, self) {self.classList.remove('recast-host');});
        clone.classList.remove('recast-host');

        if (whitespace) {clone.innerHTML = '\n' + clone.innerHTML + '\t\n' + spaces;};

        clone.removeAttribute('isScripted');
        clone.removeAttribute('clean-media-page-extension-installed');

        forEach(clone.querySelectorAll('#buttons'), function(index, self) {self.removeAttribute('style');});

        forEach(clone.querySelectorAll('[data=none]'), function(index, self) {self.data = '';});

        clone.innerHTML = unEscapeSpecialChars(clone.innerHTML);

        // clone.innerHTML = clone.innerHTML.replace(/#~NL~#/g, '&#10;');

        return [clone, spaces];
    }

    function copyToClipboard(element) {
        let timeLimit = 250;
        let variables = resetAttributes(element);
        let clone = variables[0], spaces = variables[1] || '';
        let code = spaces + clone.outerHTML;
        code = unEscapeSpecialChars(code);
        let clipboard = document.createElement('textarea');
        clipboard.style.position = 'fixed'; clipboard.style.top = '50%'; clipboard.style.left = '50%'; clipboard.style.transform = 'translate(-50%, -50%)'; clipboard.style['z-index'] = 10;
        clipboard.style.width = '90%'; clipboard.style.height = '90%';
        document.body.appendChild(clipboard);
        function removeTextarea(){setTimeout(function(){clipboard.remove(); clone.remove();}, timeLimit);}
        function onKeyDown(e) {
            e = e || window.event;
            let escKey = 27;
            if (e.keyCode == escKey) { // Escape
                removeTextarea();
                e.preventDefault();
            }
            // e.preventDefault();
        }
        clipboard.addEventListener('keydown', function(e){onKeyDown(e);}, false);
        code = code.replace(/#~NL~#/g, '&#10;');
        clipboard.value = code; clipboard.select(); // document.execCommand('copy');
        let successful, msg;
        try {
            successful = document.execCommand('copy');
            // msg = successful ? 'successful' : 'unsuccessful';
            // console.log('Copy text command was ' + msg);
        } catch(err) {
            console.log('Oops, unable to cut');
        }
        if (successful) removeTextarea();
    }

    function textToClipboard(text) {
        let timeLimit = 250;
        let clipboard = document.createElement('textarea');
        clipboard.style.position = 'fixed'; clipboard.style.top = '50%'; clipboard.style.left = '50%'; clipboard.style.transform = 'translate(-50%, -50%)'; clipboard.style['z-index'] = 10;
        clipboard.style.width = '90%'; clipboard.style.height = '90%';
        document.body.appendChild(clipboard);
        function removeTextarea(){setTimeout(function(){clipboard.remove();}, timeLimit);}
        function onKeyDown(e) {
            e = e || window.event;
            let escKey = 27;
            if (e.keyCode == escKey) { // Escape
                removeTextarea();
                e.preventDefault();
            }
            // e.preventDefault();
        }
        clipboard.addEventListener('keydown', function(e){onKeyDown(e);}, false);
        clipboard.value = text; clipboard.select(); // document.execCommand('copy');
        let successful, msg;
        try {
            successful = document.execCommand('copy');
            // msg = successful ? 'successful' : 'unsuccessful';
            // console.log('Copy text command was ' + msg);
        } catch(err) {
            console.log('Oops, unable to cut');
        }
        if (successful) removeTextarea();
    }

    function downloadCurrentDocument() {
        let pageURL = location.href;
        let pageTitle = pageURL.replace(/.*\/(.*)$/i, '$1');
        pageTitle = pageTitle.replace(/.html[?]?.*/, '') + '.html';
        let documentClone = document.documentElement.cloneNode(true);
        documentClone = resetAttributes(documentClone)[0];
        let documentString = getDoctype()+'\n'+documentClone.outerHTML+'\n';

        //noinspection JSDeprecatedSymbols
        // let base64doc = btoa(unescape(encodeURIComponent(documentString))), a = document.createElement('a'), e = document.createEvent('HTMLEvents');
        // a.download = pageTitle; a.href = 'data:text/html;base64,' + base64doc; e.initEvent('click', false, false); a.dispatchEvent(e);

        documentString = documentString.replace(/<html(.*?)><head>/i, '<html$1>\n  <head>').replace(/[\s]+<\/body><\/html>/i, '\n  </body>\n</html>');
        documentString = documentString.replace(/\r\n/g, '\n').replace(/\n/g, '\r\n');

        documentString = unEscapeSpecialChars(documentString);

        documentString = documentString.replace(/#~NL~#/g, '&#10;');

        download(documentString, pageTitle, 'text/html');
    }

    function asArray(list) {return Array.prototype.slice.call(list);}

    function addGlobalStyle(css, cssClass) {
        let head = document.getElementsByTagName('head')[0]; if (!head) {return;}
        let style = document.createElement('style'); style.type = 'text/css'; style.innerHTML = css;
        if (cssClass) style.setAttribute('class', cssClass);
        head.appendChild(style);
    }

    function addClass(element, cssClass){
        let re = new RegExp('(^|\\s)' + cssClass + '(\\s|$)', 'g');
        if (re.test(element.className)) return;
        element.className = (element.className + ' ' + cssClass).replace(/\s+/g, ' ').replace(/(^ | $)/g, '');
    }

    function removeClass(element, cssClass){
        let re = new RegExp('(^|\\s)' + cssClass + '(\\s|$)', 'g');
        element.className = element.className.replace(re, '$1').replace(/\s+/g, ' ').replace(/(^ | $)/g, '');
    }

    function datasetAdd(element, param, value) {
        let re = new RegExp('(^|\\s)' + value + '(\\s|$)', 'g');
        if (re.test(element.dataset[param])) return;
        element.dataset[param] = element.dataset[param] ? (element.dataset[param] + ', ' + value).
        // replace(/\s+/g, ' ').
        // replace(/(^ | $)/g, '').
        // replace(/,{2}/g, ',')
        trim().
        replace(/\s+,/g, ',').
        replace(/,\s+/g, ',').
        replace(/,+/g, ',').
        replace(/^,/g, '').
        replace(/,$/g, '').
        replace(/,/g, ', ')
        : value;
    }

    function datasetRemove(element, param, value) {
        if (!element.dataset[param]) return;
        if (element.dataset[param] == value) {
            element.removeAttribute('data-'+param);
            return;
        };
        let re = new RegExp('(^|\\s)' + value + '(\\s|$)', 'g');
        element.dataset[param] = element.dataset[param].replace(re, '$1').
        // replace(/\s+/g, ' ').
        // replace(/(^ | $)/g, '').
        // replace(/,{2}/g, ',');
        trim().
        replace(/\s+,/g, ',').
        replace(/,\s+/g, ',').
        replace(/,+/g, ',').
        replace(/^,/g, '').
        replace(/,$/g, '').
        replace(/,/g, ', ')
        ;
    };

    String.prototype.Capitalize = function() {
        function capFirst(str) {return str.length === 0 ? str : str[0].toUpperCase() + str.substr(1);}
        return this.split(' ').map(capFirst).join(' ');
    };

    String.prototype.toCamelCase = function() {
        return this.replace(/\W+(.)/g, function(match, chr) {return chr.toUpperCase();});
    };

    String.prototype.replaceAll = function (find, replace) {
        let str = this; while( str.indexOf(find) > -1) {str = str.replace(find, replace);}
        return str;
    };

    var undoElementsBuffer = []; // let undoChangesBuffer = [];
    function regUndoAction(element) {
        undoElementsBuffer.push(element); // undoChangesBuffer.push(element.outerHTML);
    }
    function undoAction() {
        let num = undoElementsBuffer.length - 1; if (num > -1) {
            // undoElementsBuffer[num].outerHTML = undoChangesBuffer[num];
            undoElementsBuffer[num].classList.remove('REMOVED')
            undoElementsBuffer[num].classList.remove('COMMENTED')
            undoElementsBuffer[num].classList.remove('fav')
            // removeClass(undoElementsBuffer[num], 'REMOVED');
            // removeClass(undoElementsBuffer[num], 'COMMENTED');
            // removeClass(undoElementsBuffer[num], 'fav');
            undoElementsBuffer.splice(num, 1); // undoChangesBuffer.splice(num, 1);
        }
    }

    Array.prototype.contains = function(obj) {let i = this.length; while (i--) {if (this[i] === obj) {return true;}} return false;};

    function drawCloseButton(element, width, height, lineGaps, color) {
        let getRealDimensions = function(element) {
            let realWidth, realHeight;
            let realDimensions = [];
            let clone = element.cloneNode(true);
            clone.style.visibility = 'hidden';
            clone.style.display = 'inline';
            document.body.appendChild(clone);
            realWidth = clone.offsetWidth;
            realHeight = clone.offsetHeight;
            clone.remove();
            realDimensions.width = realWidth;
            realDimensions.height = realHeight;
            return realDimensions;
        };

        let real = getRealDimensions(element);

        width = width || real.width || 64;
        height = height || width || real.height || 64;

        if (width || height) element.setAttribute('width', width || height);
        if (height || width) element.setAttribute('height', height || width);
        let context = element.getContext('2d');
        context.beginPath();
        context.lineWidth = width / 10;

        lineGaps = lineGaps || 0.15;
        let lineLength = 1 - lineGaps;

        context.moveTo(width * lineGaps, height * lineGaps);
        context.lineTo(width * lineLength, height * lineLength);
        context.moveTo(width * lineLength, height * lineGaps);
        context.lineTo(width * lineGaps, height * lineLength);
        if (color) context.strokeStyle = color;
        context.stroke();
        context.closePath();
    }

    function drawArrow(element, width, height, lineGaps, color, angle) {
        let getRealDimensions = function(element) {
            let realWidth, realHeight;
            let realDimensions = [];
            let clone = element.cloneNode(true);
            clone.style.visibility = 'hidden';
            clone.style.display = 'inline';
            document.body.appendChild(clone);
            realWidth = clone.offsetWidth;
            realHeight = clone.offsetHeight;
            clone.remove();
            realDimensions.width = realWidth;
            realDimensions.height = realHeight;
            return realDimensions;
        };

        let real = getRealDimensions(element);

        width = width || real.width || 64;
        height = height || width || real.height || 64;

        if (width || height) element.setAttribute('width', width || height);
        if (height || width) element.setAttribute('height', height || width);
        let context = element.getContext('2d');
        context.beginPath();
        context.lineWidth = width / 10;

        lineGaps = lineGaps || 0.15;
        let lineLength = 1 - lineGaps;

        context.moveTo(width*2 * lineGaps, height * lineGaps);
        context.lineTo(width*1.5 * 0.5, height * 0.5 + 3);
        context.moveTo(width*1.5 * 0.5, height * 0.5 - 3);
        context.lineTo(width*2 * lineGaps, height * lineLength);
        if (color) context.strokeStyle = color;
        context.stroke();
        context.closePath();
    }

    /*
    function drawCross(color = 'Orange', width = 32, height = 32, thickness = 10, gap = 0.15) {
        let len = 1.0 - gap;
        return (
            'data:image/svg+xml;utf8,' +
            '<svg xmlns="http://www.w3.org/2000/svg" width="'+width+'" height="'+height+'" fill="'+color+'">' +
            '<line x1="'+(width*gap)+'" y1="'+(height*gap)+'" x2="'+(width*len)+'" y2="'+(height*len)+'" stroke="'+color+'" stroke-width="'+thickness+'"/>' +
            '<line x1="'+(width*gap)+'" y1="'+(height*len)+'" x2="'+(width*len)+'" y2="'+(height*gap)+'" stroke="'+color+'" stroke-width="'+thickness+'"/>' +
            '</svg>'
        );
    };

    function drawArrow(color = 'Orange', width = 32, height = 32, thickness = 10, gap = 0.15) {
        let len = 1.0 - gap;
        return (
            'data:image/svg+xml;utf8,' +
            '<svg xmlns="http://www.w3.org/2000/svg" width="'+width+'" height="'+height+'" fill="'+color+'">' +
            '<line x1="'+(width*2*gap)+'" y1="'+(height*gap)+'" x2="'+(width*1.5 * 0.5)+'" y2="'+(height * 0.5 + 3)+'" stroke="'+color+'" stroke-width="'+thickness+'"/>' +
            '<line x1="'+(width*1.5 * 0.5)+'" y1="'+(height * 0.5 - 3)+'" x2="'+(width*2*gap)+'" y2="'+(height*len)+'" stroke="'+color+'" stroke-width="'+thickness+'"/>' +
            '</svg>'
        );
    };
    */

    // ================================================================================
    // expected hue range: [0, 360)
    // expected saturation range: [0, 1]
    // expected lightness range: [0, 1]
    function hslToRgb(hue, saturation, lightness) { // SOURCE: https://stackoverflow.com/questions/27653757/how-to-use-hsl-to-rgb-conversion-function/27663212#27663212
        let red, green, blue;
        // based on algorithm from http://en.wikipedia.org/wiki/HSL_and_HSV#Converting_to_RGB
        if (hue == undefined) return [0, 0, 0];
        let chroma = (1 - Math.abs((2 * lightness) - 1)) * saturation,
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
        let lightnessAdjustment = lightness - (chroma / 2);
        red += lightnessAdjustment;
        green += lightnessAdjustment;
        blue += lightnessAdjustment;
        return [Math.round(red * 255), Math.round(green * 255), Math.round(blue * 255)];
    };
    // --------------------------------------------------------------------------------
    function valToColor(percent = 100, clip = 0, saturation = 1.0, start = 0, end = 100, toRGB = 0) {
        percent = Math.min(percent, 160); end = Math.min(end, 100);
        let a = (percent <= clip) ? 0 : (((percent - clip) / (100 - clip))),
            b = Math.abs(end - start) * a,
            c = (end > start) ? (start + b) : (start - b);
        let h = c, s = saturation, l = 0.5;
        if (toRGB) {
            let rgb = hslToRgb(h, s, l);
            return 'rgb(' + rgb[0] + ', ' + rgb[1] + ', ' + rgb[2] + ')';
        }
        else {
            return 'hsl(' + h + ', ' + (s*100) + '%, ' + (l*100) + '%)';
        }
    };
    // ================================================================================
    function addHDtext(parentElement, qualityText, backGroundColor, textColor, backGroundAlpha, opactity) {
        backGroundAlpha = backGroundAlpha === 0 ? 0 : backGroundAlpha ? backGroundAlpha : 0.4;
        let mainDiv = document.createElement('div');
        mainDiv.setAttribute('class', 'qualityText');
        mainDiv.style.background = backGroundColor;
        mainDiv.style.background = mainDiv.style.background.replace(/rgb\((.*)\)/, 'rgba($1, '+backGroundAlpha+')');
        // mainDiv.style.zIndex = 2147483647; // '10000';
        mainDiv.style.position = 'absolute'; // 'inherit'
        mainDiv.style.width = 'auto';
        mainDiv.style.height = '20px';
        mainDiv.style.float = 'left';
        mainDiv.style.left = '0';
        if (textColor) mainDiv.style.color = textColor; // 'rgba(0, 253, 255, 0)';
        mainDiv.style.padding = '0px 2px';
        mainDiv.style.border = '1px solid rgba(255, 255, 255, 0.2)';
        mainDiv.innerText = qualityText;
        mainDiv.style.opacity = opactity === 0 ? 0 : opactity ? opactity : 0.65;
        mainDiv.style.pointerEvents = 'none';
        parentElement.insertBefore(mainDiv, parentElement.firstChild);
    }

    function addHostText(parentElement, hostText, backGroundColor, textColor, backGroundAlpha, opactity) {
        backGroundAlpha = backGroundAlpha === 0 ? 0 : backGroundAlpha ? backGroundAlpha : 0.4;
        let mainDiv = document.createElement('div');
        mainDiv.setAttribute('class', 'hostText');
        mainDiv.style.background = backGroundColor;
        mainDiv.style.background = mainDiv.style.background.replace(/rgb\((.*)\)/, 'rgba($1, '+backGroundAlpha+')');
        mainDiv.style.background = 'black';
        // mainDiv.style.zIndex = 2147483647; // '10000';
        mainDiv.style.position = 'absolute'; // 'inherit'
        mainDiv.style.width = 'auto';
        mainDiv.style.height = '20px';
        // mainDiv.style.float = 'left';
        // mainDiv.style.left = '0';
        mainDiv.style.right = '0';
        if (textColor) mainDiv.style.color = textColor; // 'rgba(0, 253, 255, 0)';
        mainDiv.style.padding = '0px 2px';
        mainDiv.style.border = '1px solid rgba(255, 255, 255, 0.2)';
        mainDiv.innerText = hostText;
        mainDiv.style.bottom = '0px';
        mainDiv.style.textAlign = 'center';
        mainDiv.style.opacity = opactity === 0 ? 0 : opactity ? opactity : 0.65;
        mainDiv.style.color = 'whitesmoke';
        mainDiv.style.pointerEvents = 'none';
        parentElement.insertBefore(mainDiv, parentElement.firstChild);
    }

    function addTimeText(parentElement, timeText, backGroundColor, textColor, backGroundAlpha, opactity) {
        backGroundAlpha = backGroundAlpha === 0 ? 0 : backGroundAlpha ? backGroundAlpha : 0.4;
        let mainDiv = document.createElement('div');
        mainDiv.setAttribute('class', 'hostText');
        mainDiv.style.background = backGroundColor;
        mainDiv.style.background = mainDiv.style.background.replace(/rgb\((.*)\)/, 'rgba($1, '+backGroundAlpha+')');
        mainDiv.style.background = 'black';
        // mainDiv.style.zIndex = 2147483647; // '10000';
        mainDiv.style.position = 'absolute'; // 'inherit'
        mainDiv.style.width = 'auto';
        mainDiv.style.height = '20px';
        // mainDiv.style.float = 'left';
        // mainDiv.style.left = '0';
        mainDiv.style.right = '0';
        if (textColor) mainDiv.style.color = textColor; // 'rgba(0, 253, 255, 0)';
        mainDiv.style.padding = '0px 2px';
        mainDiv.style.border = '1px solid rgba(255, 255, 255, 0.2)';
        mainDiv.innerText = timeText;
        mainDiv.style.top = '0px';
        mainDiv.style.textAlign = 'center';
        mainDiv.style.opacity = opactity === 0 ? 0 : opactity ? opactity : 0.65;
        mainDiv.style.color = 'whitesmoke';
        mainDiv.style.pointerEvents = 'none';
        // mainDiv.style.zoom = 0.70;
        // mainDiv.style.fontSize = '12px';
        // mainDiv.style.borderRadius = '2px';
        // mainDiv.style['-moz-border-radius'] = '3px';
        // mainDiv.style['-webkit-border-radius'] = '3px';
        // mainDiv.style.fontFamily = '"Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif';
        // mainDiv.style.border = 'none';
        // mainDiv.style.height = '15px';
        // mainDiv.style.padding = '3px 5px';
        parentElement.insertBefore(mainDiv, parentElement.firstChild);
    }

    function hmsToSecondsOnly(str) {
        let p = str.split(':'),
            s = 0, m = 1;

        while (p.length > 0) {
            s += m * parseInt(p.pop(), 10);
            m *= 60;
        }

        return s;
    }


    // Convert search param string into an object or array
    // '?startIndex=1&pageSize=10' -> {startIndex: 1, pageSize: 10}
    function processSearchParams(search, preserveDuplicates) {
        //  option to preserve duplicate keys (e.g. 'sort=name&sort=age')
        preserveDuplicates = preserveDuplicates || false; //  disabled by default

        let outputNoDupes = {};
        let outputWithDupes = []; //  optional output array to preserve duplicate keys

        //  sanity check
        if(!search) throw new Error('processSearchParams: expecting "search" input parameter');

        //  remove ? separator (?foo=1&bar=2 -> 'foo=1&bar=2')
        search = search.split('?')[1];

        //  split apart keys into an array ('foo=1&bar=2' -> ['foo=1', 'bar=2'])
        search = search.split('&');

        //  separate keys from values (['foo=1', 'bar=2'] -> [{foo:1}, {bar:2}])
        //  also construct simplified outputObj
        outputWithDupes = search.map(function(keyval){
            let out = {};
            keyval = keyval.split('=');
            out[keyval[0]] = keyval[1];
            outputNoDupes[keyval[0]] = keyval[1]; //  might as well do the no-dupe work too while we're in the loop
            return out;
        });

        return (preserveDuplicates) ? outputWithDupes : outputNoDupes;
    }

    // Break apart any path into parts
    // 'http://example.com:12345/blog/foo/bar?startIndex=1&pageSize=10' ->
    // {
    //   "host": "example.com",
    //   "port": "12345",
    //   "search": {
    //     "startIndex": "1",
    //     "pageSize": "10"
    //   },
    //   "path": "/blog/foo/bar",
    //   "protocol": "http:"
    // }
    function getPathInfo(path) {
        //  create a link in the DOM and set its href
        let link = document.createElement('a');
        link.setAttribute('href', path);

        //  return an easy-to-use object that breaks apart the path
        return {
            host:     link.hostname, // 'example.com'
            port:     link.port, // 12345
            search:   processSearchParams(link.search || '?'), // {startIndex: 1, pageSize: 10}
            path:     link.pathname, // '/blog/foo/bar'
            protocol: link.protocol // 'http:'
        };
    }

    // ==========================================================
    // IMAGES LAZY LOAD
    // https://toddmotto.com/echo-js-simple-javascript-image-lazy-loading/
    // ==========================================================
    // window.echo = (function (window, document) {

    // 'use strict';

    /* Constructor function */
    function Echo(elem) {
        this.elem = elem;
        this.render();
        this.listen();
    };

    /* Images for echoing */
    var echoStore = [];

    /* Element in viewport logic */
    function scrolledIntoView(element) {
        let coords = element.getBoundingClientRect();
        return ((coords.top >= 0 && coords.left >= 0 && coords.top) <= (window.innerHeight || document.documentElement.clientHeight));
    };

    /* Changing src attr logic */
    function echoSrc(img, callback) {
        let imgSrc = img.dataset.echo;
        if (imgSrc) {
            img.src = imgSrc;
            img.removeAttribute('data-echo');
        }
        if (typeof callback == 'function') callback();
    };

    function setThumbnailImage(self) {
        let image = self.querySelector('img');
        if (image) {
            let src = image.dataset.echo;
            if (src) {
                image.setAttribute('src', src);
                image.removeAttribute('data-echo');
            }
        }
    };

    /* Remove loaded item from array */
    function removeEcho(element, index) {
        if (!element.src) return;
        if (echoStore.indexOf(element) !== -1) {
            echoStore.splice(index, 1);
        }
    };

    /* Echo the images and callbacks */
    function echoImages() {
        for (let i = 0; i < echoStore.length; i++) {
            let self = echoStore[i];
            if (scrolledIntoView(self)) {
                echoSrc(self, removeEcho(self, i));
                self.parentNode.classList.add('ui-handle');
            }
        }
    };

    /* Prototypal setup */
    Echo.prototype = {
        init : function () {
            echoStore.push(this.elem);
        },
        render: function () {
            if (document.addEventListener) {
                document.addEventListener('DOMContentLoaded', echoImages, false);
            } else {
                window.onload = echoImages;
            }
        },
        listen: function () {
            window.onscroll = echoImages;
        }
    };

    /* Initiate the plugin */
    function initLazyLoad(lazyImgs) {
        echoStore = [];
        lazyImgs = lazyImgs || document.querySelectorAll('img[data-echo]');
        for (let i = 0; i < lazyImgs.length; i++) {
            new Echo(lazyImgs[i]).init();
        }
        echoImages();
    }

    // })(window, document);
    // ==========================================================

    function addMouseWheelHandler(element, onB, onF, preventDefaultB, preventDefaultF) {
        function mouseScroll(e) {
            // cross-browser wheel delta
            e = window.event || e; // old IE support
            let delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
            // console.log(e);
            if (delta > 0) {
                onF();
                if (preventDefaultF) e.preventDefault();
            }
            else if (delta < 0) {
                onB();
                if (preventDefaultB) e.preventDefault();
            }
        };
        if (element.addEventListener) {
            element.removeEventListener("mousewheel", mouseScroll);
            element.removeEventListener("DOMMouseScroll", mouseScroll);
            //
            element.addEventListener("mousewheel", mouseScroll, false); // IE9, Chrome, Safari, Opera
            element.addEventListener("DOMMouseScroll", mouseScroll, false); // Firefox
        } else {
            element.detachEvent ("onmousewheel", mouseScroll); // IE 6/7/8
            //
            element.attachEvent("onmousewheel", mouseScroll); // IE 6/7/8
        }
    }

    function insertAfter(elem, refElem) {
        return refElem.parentNode.insertBefore(elem, refElem.nextSibling);
    }

    function splitOnParts(element, childrenSelector, splitCount) {
        let children = element.querySelectorAll(childrenSelector);
        let childrenCount = children.length;
        let iterations = Math.ceil(childrenCount / splitCount);
        if (iterations > 1) {
            let clone;
            let iteration = 1, num = 1;
            for (let child of children) {
                if (num == 1) {
                    clone = element.parentNode.insertBefore(element.cloneNode(false), element);
                    clone.dataset.title += ' pt'+(iteration);
                }
                if (num == splitCount) {
                    num = 0;
                    ++iteration;
                }
                clone.appendChild(child);
                ++num;
            }
            element.remove();
        }
    }

    /*
    function joinParts(spoilersArray) {
        let storage = {};
        forEach(spoilersArray, function(index, spoiler) {
            let title = spoiler.title;
            let match = title.match(/(.*) pt\d+/);
            if (match) {
                let name = match[1];
                if (!storage[name]) {
                    spoiler.title = name;
                    storage[name] = spoiler;
                }
                else {
                    let children = spoiler.childNodes;
                    for (let i = 0; i < children.length; ++i) {
                        let child = children[i];
                        storage[name].appendChild(child);
                    }
                    spoiler.remove();
                    let spoilerButton = document.querySelector('.spoilertop[title="'+title+'"');
                    if (spoilerButton) spoilerButton.remove();
                    console.log('.spoilertop[title="'+title+'"');
                }
                console.log(children);
            }
        });
        console.log(storage);
    }
    */

    function documentOnReady() {
        // GLOBAL VARIABLES
        let wallpaperVideo = document.querySelector('video#wallpapers');
        // let spoilerButtonsArray = document.querySelectorAll('#galleries > .spoilertop'); // moved down
        let spoilersArray = document.querySelectorAll('#previews > .spoilerbox');

        forEach(spoilersArray, function(index, spoiler) {
            let splitCount = 250; // default
            /* globals split */
            if (typeof(split) == "number") {
                splitCount = split;
            }
            if (typeof(spoiler.dataset.split) !== "undefined") {
                splitCount = spoiler.dataset.split;
            }
            if (splitCount > 0) {
                splitOnParts(spoiler, 'div.thumbnail', splitCount);
            }
        });

        spoilersArray = document.querySelectorAll('#previews > .spoilerbox');

        let thumbnailsArray = document.querySelectorAll('#previews > .spoilerbox > .thumbnail');
        let outputs = document.getElementById('content');
        let outputsArray = [];
        let iframeOutput = outputs.querySelector('#content_iframe'), imgOutput = outputs.querySelector('#content_img'), objectOutput = outputs.querySelector('#content_object');
        let iframeOutputReset = {};
        iframeOutputReset.width = iframeOutput.width;
        iframeOutputReset.height = iframeOutput.height;
        outputsArray.push(iframeOutput, imgOutput, objectOutput);
        let objectFlashvars = objectOutput.querySelector('param[name="flashvars"]');
        let galleryList = [];
        let activeSpoilerButton, activeSpoiler, activeThumbnail, activeOutput;
        let backgroundsArray = document.querySelectorAll('.background'); backgroundsArray = asArray(backgroundsArray);
        let outputsMinimized;
        // let activeContent;
        let changeContentOffset;

        let galleries = document.querySelector('#galleries');

        let closeButton = document.querySelector('#closeButton');
        drawCloseButton(closeButton, null, null, null, 'rgba(16, 16, 16, 0.75)', null);

        let nextButton = document.querySelector('#nextButton');
        drawArrow(nextButton, null, null, null, 'white', null);
        let delButton = document.querySelector('#delButton');
        drawCloseButton(delButton, null, null, null, 'rgba(255, 0, 0, 0.75)', null);
        let prevButton = document.querySelector('#prevButton');
        drawArrow(prevButton, null, null, null, 'white', null);
        let favButton = document.querySelector('#favButton');
        if (favButton) drawArrow(favButton, null, null, null, 'rgba(64, 255, 64, 0.75)', null);

        let linkText = document.querySelector('#linkText');
        if (!linkText) {
            linkText = document.createElement('p');
            linkText.setAttribute('id', 'linkText');
            outputs.appendChild(linkText);
        }

        // <input id="searchField" type="search" style="font-size: 16px; height: auto; width: 100%; max-width: 99.5%; margin: 5px 0px 0px;" placeholder="Поиск">
        let search = document.createElement('input');
        search.type = 'search';
        search.style = 'font-size: 16px; height: auto; width: 100%; max-width: 96%; margin: 5px 0px 0px;z-index: 10; position: fixed; display: /*block*/ none; top: -5px; left: 9px; background: rgb(255 255 255 / 0%);';
        search.id = 'search';
        document.body.appendChild(search);
        search.onchange = () => {
            if (activeSpoiler) {
                let query = search.value;
                let activeThumbnails = activeSpoiler.querySelectorAll('.thumbnail');
                for (let item of activeThumbnails) {
                    item.removeAttribute('style');
                    let title = ((item.dataset.title || '') + ' ' + (item.dataset.categories || '')).toLowerCase();
                    if (title) {
                        let match = title.match(query);
                        if (match) {
                            item.removeAttribute('style');
                        }
                        else {
                            item.style.display = 'none';
                        };
                    }
                    else {
                        item.style.display = 'none';
                    };
                };
            };
        };
        // DOCUMENT FUNCTIONS
        function updateURL() {
            // let params = getParams();
            delete params.tab;
            // console.log('activeSpoilerButton: '+activeSpoilerButton);
            if (activeSpoilerButton) {
                let title = activeSpoilerButton.querySelector('p');
                if (title) {
                    let titleText = title.innerText.trim();
                    titleText = encodeURIComponent(titleText);
                    params.tab = titleText;
                }
            }
            let options = "";
            let i = 0;
            for (let key in params) {
                i++;
                let val = params[key];
                if (i == 1) options = options + "?";
                else if (i > 1) options = options + "&";
                options = options + (key + "=" + val);
                // console.log('key: '+key);
                // console.log('val: '+val);
                // console.log('options: '+options);
            }
            let path = parent.location.pathname + options;
            // console.log('path: '+path);
            history.pushState(parent.location.pathname, "", path);
        }

        function buttonClicked(button, buttonsArray, unclick) {
            if (unclick) {forEach(buttonsArray, function(index, self) {self.style.removeProperty('opacity');});} else {
                forEach(buttonsArray, function(index, self) {self.style.opacity = '0.125';}); button.style.removeProperty('opacity');
            }
        }

        function resetContentOutputs() {
            iframeOutput.src = ''; imgOutput.src = ''; objectOutput.data = ''; objectFlashvars.value = '';
            forEach(outputsArray, function(index, self) {self.style.removeProperty('display');});
            activeOutput = false; activeThumbnail = false; // activeContent = false;
        }

        function minimizeContentOutputs() {
            if (outputsMinimized) {
                forEach(outputsArray, function(index, self) {removeClass(self, 'minimized');});
                outputsMinimized = false;
            } else {
                forEach(outputsArray, function(index, self) {addClass(self, 'minimized');});
                outputsMinimized = true;
            }
        }

        function appendFlashVars(source, info) {
            let i, flashvars, existingVars;
            if (source.match('https://www.youtube.com/embed/')) {
                flashvars = [
                    // Enable Autoplay
                    'autoplay=1',
                    // Watch in HD
                    'hd=1',
                    // Disable Annotations
                    'iv_load_policy=3'
                ];
                existingVars = '';
                if (source.match(/[?].*/i)) {
                    // source.split('?')[1]
                    existingVars += source.replace(/.*[?](.*)/i, '$1'); source = source.replace(/(.*)[?].*/i, '$1');
                    flashvars.push(existingVars);
                }
                source += '?';
                i = 0;
                flashvars.forEach(function() {
                    if (i < flashvars.length - 1) {flashvars[i] += '&';}
                    source += flashvars[i]; i += 1;
                });
            } else if (info && info.match('uppod.swf')) {
                source = 'm=video&file=' + source + '&auto=play';
            } else if (source.match('.m3u8') && !info) {
                source = 'chrome-extension://emnphkkblegpebimobpbekeedfgemhof/player.html#' + source;
            } else if (source.match('rtmp://') || (info && info.match('StrobeMediaPlayback.swf'))) {
                // source = 'StrobeMediaPlayback.swf?src=' + source +'&autoPlay=true';
                source = 'src=' + source +'&autoPlay=true';
            }
            /*
            else if (source.split("?")[0].split("#")[0].endsWith("mp4")) {
                source = 'chrome-extension://emnphkkblegpebimobpbekeedfgemhof/player.html#' + source; // standard video
            }
            */
            return source;
        }

        function hideContent() {
            if (activeOutput) {
                resetContentOutputs();
                buttonClicked(false, thumbnailsArray, true);
            }
            else if (activeSpoiler) {
                activeSpoiler.style.removeProperty('display');
                buttonClicked(false, spoilerButtonsArray, true);
                history.pushState(parent.location.pathname, "", parent.location.pathname);
                document.querySelector('#buttons').style.removeProperty('display');
                search.style.display = 'none';
            }
            // closeButton.style.removeProperty('display');
            nextButton.style.removeProperty('display');
            delButton.style.removeProperty('display');
            prevButton.style.removeProperty('display');
            if (favButton) favButton.style.removeProperty('display');
            linkText.innerText = null;
            if (wallpaperVideo) wallpaperVideo.play();
            if (G_activePopUpWin) {
                G_activePopUpWin.close();
                G_activePopUpWin = null;
            };
            activeOutput = null;
            //
            iframeOutput.width = iframeOutputReset.width;
            iframeOutput.height = iframeOutputReset.height;
            //
            // search.style.display = 'none';
        }

        function showContent(thisThumbnail, thumbnailsArray) {
            if (wallpaperVideo) wallpaperVideo.pause();
            let output = thisThumbnail.dataset.output;

            let player = thisThumbnail.dataset.player;
            let outputAttr = thisThumbnail.dataset.attribute || 'src';
            let flashvars = thisThumbnail.dataset.flashvars || '';

            let content = thisThumbnail.dataset.content || thisThumbnail.dataset.image;
            let contentHost = getPathInfo(content).host.replace(/^www\./, '');
            if (G_reCastHosts.includes(contentHost)) {
                content = thisThumbnail.dataset.url;
                if (!content.match(/#ReCast\b/)) {
                    content += '#ReCast'
                }
            }
            linkText.innerText = decodeURIComponent(content);
            if (!output && (content.match(/^rtmp:\/\//i) || player)) {
                output = 'object';
            } else if (!output && content.match(/\.(jpg|gif|png|bmp|tga|webp)$/i)) {
                output = 'img';
            } else if (!output) {
                output = 'iframe';
            }

            buttonClicked(thisThumbnail, thumbnailsArray);
            let outputFrame = outputs.querySelector(output);

            content = appendFlashVars(content, player);

            //content = content + '#autoplay=true'; //'#autoplay=true&autoplay=true';

            // alert(content);

            let array = content.split('#');
            if (array) {
                if (array[1]) {
                    // alert(array[1]);
                    if (array[1].match(/[?]/)) {
                        content = content + '&autoplay=true';
                    }
                    else {
                        content = content + '?autoplay=true';
                    };
                }
                // else if (content.match(/[?]/)) {
                content = content + '#autoplay=true';
                // }
                // else {
                // content = content + '?autoplay=true';
                // };
            }
            else {
                content = content + '#autoplay=true';
            };

            // alert(content);

            // console.log('content: '+content);
            let start = thisThumbnail.dataset.start, end = thisThumbnail.dataset.end;
            if (start || end) {
                let duration = end ? hmsToSecondsOnly(start || 0) + ',' + hmsToSecondsOnly(end || 0) : hmsToSecondsOnly(start || 0);
                content = content + '&#t=' + duration;
            }
            let qualityLimit = parseInt(thisThumbnail.dataset.qualityLimit);
            if (qualityLimit) {
                content = content + '&qualityLimit=' + qualityLimit;
                // alert(qualityLimit);
            }
            let reflect = thisThumbnail.dataset.reflect;
            if (reflect) {
                content = content + '&reflect=' + reflect;
                // alert(content);
            }
            ///*
            let contentSize = thisThumbnail.dataset.quality;
            if (contentSize) {
                contentSize = contentSize.match(/.*?\[?(\d+)x(\d+)\]?$/i);
                let quality = contentSize ? contentSize[1]*contentSize[2] : null;
                if (quality) {
                    // const percent = quality/(1900*1080) * 100;
                    // let actualQuality = parseInt(contentSize[2]);
                    // if (qualityLimit && actualQuality > qualityLimit*1.1) {
                    // actualQuality = qualityLimit;
                    // };
                    if (output == 'iframe') {
                        // let scale = Math.min(Math.max(quality/(iframeOutputReset.width*iframeOutputReset.height) * 100, 25), 100);
                        const percent = 100; // quality/(640*480*3) * 100;
                        const scale = Math.min(Math.max(percent, 25), 100);
                        iframeOutput.width = parseInt(iframeOutputReset.width * scale / 100);
                        iframeOutput.height = parseInt(iframeOutputReset.height * scale / 100);
                    };
                };
            };
            //*/
            // content = content.replace(/(^http:\/\/vshare.io\/.*\/)#autoplay=true.*/i, '$1');
            console.log('content: '+content);
            let active = (thisThumbnail == activeThumbnail); // (content == activeContent); // global
            if (active) {buttonClicked(thisThumbnail, thumbnailsArray, true); resetContentOutputs();} else {
                resetContentOutputs();
                setTimeout(function(){
                    if (output == 'object') {
                        objectOutput.data = player || 'StrobeMediaPlayback.swf';
                        objectFlashvars.value = flashvars + content;
                    } else {
                        if (content.match(/\b#ReCast\b.*/)) {
                            /* let popUpWin */ G_activePopUpWin = popItUp(content, 'PopUpWin', 0);
                            // G_activePopUpWin = popUpWin;
                        }
                        else {
                            outputFrame.setAttribute(outputAttr, content);
                        }
                    }
                }, 10);

                setTimeout(function(){outputFrame.style.display = 'block';}, 10);

                activeThumbnail = thisThumbnail; activeOutput = outputFrame; // activeContent = content;
                closeButton.style.display = 'block';
                nextButton.style.display = 'block';
                delButton.style.display = 'block';
                prevButton.style.display = 'block';
                if (favButton) favButton.style.display = 'block';

                document.querySelector('#buttons').style.display = 'block';
            }

            setThumbnailImage(thisThumbnail);
            galleryList = createGalleryList(activeSpoiler);
        }

        function createGalleryList(gallery) {
            let galleryList = [];
            let thumbnails = gallery.querySelectorAll('.thumbnail');
            // forEach(thumbnails, function(index, self) {if (isVisible(self)) {let content = self.dataset.content; content = appendFlashVars(content); galleryList.push(content);}});
            forEach(thumbnails, function(index, self) {if (isVisible(self)) galleryList.push(self);});
            return galleryList;
        }

        function changeContent(galleryList, delta) {
            /*
            if (activeOutput) {
                // global activeContent
                let galleryContent = galleryList[galleryList.indexOf(activeContent) + (delta || 1)] || galleryList[delta ? galleryList.length - 1 : 0];
                let activeThumbnailsArray = activeSpoiler.querySelectorAll('.thumbnail');
                let matched;
                forEach(activeThumbnailsArray, function(index, self) {
                    if (!matched) {
                        let content = self.dataset.content;
                        content = appendFlashVars(content);
                        matched = (content == galleryContent && self !== activeThumbnail);
                        if (matched) self.click();
                    }
                });
            }
            */
            if (activeOutput) {
                let galleryThumbnail = galleryList[galleryList.indexOf(activeThumbnail) + (delta || 1)] || galleryList[delta ? galleryList.length - 1 : 0];
                galleryThumbnail.click();
                activeThumbnail = galleryThumbnail; // double-check
            }
        }

        function findDuplicates(activeThumbnails) {
            let contentsList = [];
            let duplicatesList = [];
            forEach(activeThumbnails, function(index, self) {removeClass(self, 'duplicate_1'); removeClass(self, 'duplicate_2');});
            forEach(activeThumbnails, function(index, self) {
                if (isVisible(self)) {
                    let imageSrc = self.dataset.image; let contentSrc = self.dataset.content; let img = contentSrc || imageSrc;
                    if (contentsList.indexOf(contentSrc) != -1) {addClass(self, 'duplicate_2'); duplicatesList.push(img);}
                    if (contentSrc) contentsList.push(img); // to find duplicates
                }
            });
            forEach(activeThumbnails, function(index, self) {
                if (isVisible(self)) {
                    let imageSrc = self.dataset.image; let contentSrc = self.dataset.content; let img = contentSrc || imageSrc;
                    if (duplicatesList.indexOf(contentSrc) != -1) {addClass(self, 'duplicate_1');}
                }
            });
        }

        function imsSrcChange(thumb, img, direction = 1) {
            // https://www.porntrex.com/contents/videos_screenshots/946000/946049/timelines/timeline_mp4/200x116/218.jpg
            // https://static-eu-cdn.eporner.com/thumbs/static4/2/29/298/2986693/11_240.jpg
            // https://hqporner.com/imgs/17/86/00d04ff0711cf35_6.jpg
            let regExp = (
                img.src.match(/\b\d+_\d+\.jpg/) ? /^(.*?)(\d+)(_\d+\.jpg)$/ :
                /^(.*?_?)(\d+)(\.jpg)$/
            );
            let matched = img.src.match(regExp);
            if (matched) {
                let num = parseInt(matched[2]), base = matched[1], ext = matched[3];
                img.src = base + '' + Math.max(0, num + direction) + '' + ext;
            };
            thumb.dataset.image = img.src;
            console.log(img.src);
        };

        function showSpoiler(thisButton, spoiler) {
            let active = isVisible(spoiler);
            buttonClicked(thisButton, spoilerButtonsArray);
            forEach(spoilersArray, function(index, self) {self.style.removeProperty('display');});
            if (active) {
                buttonClicked(thisButton, spoilerButtonsArray, true);
                activeSpoiler = false;
                history.pushState(parent.location.pathname, "", parent.location.pathname);
                document.querySelector('#buttons').style.removeProperty('display');
                search.style.display = 'none';
            }
            else {
                spoiler.style.display = 'block';
                let lazyImagesArray = [];
                let activeThumbnails = spoiler.querySelectorAll('.thumbnail'); forEach(activeThumbnails, function(index, self) {
                    let image = self.querySelector('img');
                    let imageSrc = self.dataset.image;
                    let video = self.querySelector('video');
                    let videoSrc = self.dataset.video;
                    let contentSrc = self.dataset.content;
                    let contentHost = getPathInfo(self.dataset.content).host.replace(/^www\./, '');
                    let contentSize = self.dataset.quality;
                    let qualityLimit = parseInt(self.dataset.qualityLimit);
                    let duration = self.dataset.duration;
                    let text /*, title = self.dataset.title*/;
                    let title = self.getAttribute('title');
                    if (title) {
                        self.setAttribute('data-title', title);
                    };
                    self.removeAttribute('title');
                    title = self.dataset.title;
                    let categories = self.dataset.categories;
                    let categoriesArray = categories ? categories.split(',') : [];
                    let tooltip = self.querySelector('.tooltip');
                    /*
                    let group;
                    if (self.dataset.hash) {
                        group = spoiler.querySelector('.group[data-hash="'+self.dataset.hash+'"]');
                        if (!group) {
                            group = document.createElement('div');
                            group.setAttribute('class', 'group');
                            group.setAttribute('data-hash', self.dataset.hash);
                            spoiler.appendChild(group);
                        };
                        if (self.parentNode !== group) {
                            group.appendChild(self);
                        };
                    };
                    */
                    if (!image) {
                        if (imageSrc || contentSrc) {
                            image = document.createElement('img');
                            image.setAttribute('data-echo', imageSrc || contentSrc); // src
                            self.appendChild(image);
                        }
                        ///*
                        if (!video && videoSrc) {
                            video = document.createElement('video');
                            video.setAttribute('preload', 'none');
                            video.setAttribute('muted', 'muted');
                            video.setAttribute('loop', '');
                            video.setAttribute('src', videoSrc); // src
                            // video.style.zIndex = -2;
                            // video.style.visibility = 'hidden';
                            // self.setAttribute('onmouseover', "let v = this.querySelector('video'); v.currentTime = 0; v.play(); v.style.zIndex = 1;");
                            // self.setAttribute('onmouseout', "let v = this.querySelector('video'); v.pause(); v.currentTime = 0; v.style.zIndex = -2;");
                            self.appendChild(video);
                            //
                            // let source = document.createElement('source');
                            // source.setAttribute('src', videoSrc); source.type = "video/mp4";
                            // video.appendChild(source);
                            //
                            let videoPlay = function(video) {
                                let promise = video.play();
                                if (promise !== undefined) {
                                    promise.then(_ => {
                                        video.currentTime = 0;
                                        // Autoplay started!
                                    }).catch(error => {
                                        // Autoplay was prevented.
                                    });
                                };
                                // video.style.zIndex = 1;
                                // video.style.visibility = 'visible';
                            };
                            self.addEventListener('mouseover', function(){videoPlay(video);}, false);
                            let videoStop = function(video) {
                                if (!video.paused) {video.pause(); video.currentTime = 0;};
                                // video.style.zIndex = -2;
                                // video.style.visibility = 'hidden';
                            };
                            self.addEventListener('mouseout', function(){videoStop(video);}, false);
                        };
                        //*/
                        if (title) {
                            //if (contentSrc.match(/youtube.com\/embed/i)) {text = document.createElement('p'); type = 'YouTube'; text.innerHTML += type; self.appendChild(text);}
                            text = document.createElement('p');
                            text.innerHTML += title; self.appendChild(text);
                            if (!image) text.setAttribute('class', 'forced');
                            contentSize = contentSize || title;
                            if (!tooltip) {
                                tooltip = document.createElement('span');
                                tooltip.setAttribute('class', 'tooltip');
                                // tooltip.innerText = title;
                                let span_text = title, index = 0;
                                for (let category of categoriesArray) {
                                    category = category.replace(/^\s*M:/, '').trim();
                                    // console.log(category);
                                    index++;
                                    if (index == 1) {
                                        span_text += '\n\nCategories:'
                                    }
                                    span_text += '\n - ' + category;
                                };
                                tooltip.innerText = span_text;
                                self.appendChild(tooltip);
                            };
                        }
                        if (contentSize) {
                            contentSize = contentSize.match(/.*?\[?(\d+)x(\d+)\]?$/i);
                            let quality = contentSize ? contentSize[1]*contentSize[2] : null;
                            if (quality) {
                                let color = valToColor(quality/(1900*1080) * 100, 1, 1.0, 0, 100, 1);
                                if (text) text.style.color = color;
                                let actualQuality = parseInt(contentSize[2]);
                                //                                 if (qualityLimit && actualQuality > qualityLimit*1.1) {
                                //                                     actualQuality = qualityLimit;
                                //                                 }
                                // alert(`qualityLimit = ${qualityLimit} (${actualQuality})`);
                                addHDtext(self, actualQuality+'p', color, 'rgba(255, 255, 255, 1)', 0.4, 0.5);
                            }
                        }
                        if (contentSrc) {
                            if (G_reCastHosts.includes(contentHost)) {
                                self.classList.add('recast-host');
                                contentHost = getPathInfo(self.dataset.url).host.replace(/^www\./, '');
                            }
                            addHostText(self, contentHost, valToColor((800*600)/(1900*1080) * 100, 1, 1.0, 0, 100, 1), 'rgba(255, 255, 255, 1)', 0.4, 0.5);
                        }
                        if (duration) {
                            addTimeText(self, duration, valToColor((800*600)/(1900*1080) * 100, 1, 1.0, 0, 100, 1), 'rgba(255, 255, 255, 1)', 0.4, 0.5);
                        };
                    }
                    if (image) lazyImagesArray.push(image);
                    if (G_disabledHosts.includes(contentHost)) {
                        self.classList.add('disabled-host');
                        // console.log(host, G_disabledHosts);
                    }
                });

                findDuplicates(activeThumbnails);

                galleryList = createGalleryList(spoiler);
                activeSpoiler = spoiler;
                activeSpoilerButton = thisButton;

                updateURL();

                initLazyLoad(lazyImagesArray);

                if ((typeof jQuery !== 'undefined') && !spoiler.dataset.nosortable) {
                    $(spoiler).sortable({
                        items: '> .thumbnail'
                    });
                    $(spoiler).disableSelection();
                }

                /*
                for (let thumb of activeThumbnails) {
                    addMouseWheelHandler(thumb, function(){let img = thumb.querySelector('img'); imsSrcChange(thumb, img, 1)}, function(){let img = thumb.querySelector('img'); imsSrcChange(thumb, img, -1)}, true, true);
                };
                */

                document.querySelector('#buttons').style.display = 'block';

                search.style.display = 'block';
            };
        };

        String.prototype.Num = function(){return this.match(/\d+/);};

        function initPromptFrame(reset) {
            let promptFrame = document.getElementById('promptFrame');
            if (promptFrame) promptFrame.remove();

            promptFrame = document.createElement('div');
            promptFrame.style.position = 'fixed';
            promptFrame.style.display = 'block';
            promptFrame.style.maxWidth = '90%';
            promptFrame.style.maxHeight = '90%';
            promptFrame.style.width = '500px';
            promptFrame.style.height = 'auto';
            promptFrame.style.minHeight = '245px';
            promptFrame.style.padding='10px';
            promptFrame.style.backgroundColor = 'white';
            promptFrame.style.zIndex='10';
            promptFrame.style.bottom ='10px';
            promptFrame.style.right ='10px';
            // promptFrame.className = 'centered';
            promptFrame.setAttribute('id', 'promptFrame');
            document.body.appendChild(promptFrame);

            let labelWidth = '20%';
            let inputWidth = promptFrame.style.width.Num()*0.8 - 5 + 'px';

            let label = document.createElement('label');
            label.innerText = 'Адрес потока:';
            label.style.width = labelWidth;
            label.style.float = 'left';
            label.style.margin='2px 0px';
            label.style.color='black';
            promptFrame.appendChild(label);

            let promptFrameContent = document.createElement('input');
            promptFrameContent.style.width = inputWidth;
            promptFrameContent.style.float = 'right';
            promptFrameContent.style.margin='2px 0px';
            promptFrameContent.style.padding='0px';
            promptFrameContent.type = 'text';
            promptFrame.appendChild(promptFrameContent);

            label = document.createElement('label');
            label.innerText = 'Адрес иконки:';
            label.style.width = labelWidth;
            label.style.float = 'left';
            label.style.margin='2px 0px';
            label.style.color='#BFBFBF';
            promptFrame.appendChild(label);

            let promptFrameImage = document.createElement('input');
            promptFrameImage.style.width = inputWidth;
            promptFrameImage.style.float = 'right';
            promptFrameImage.style.margin='2px 0px';
            promptFrameImage.style.padding='0px';
            promptFrameImage.type = 'text';
            promptFrame.appendChild(promptFrameImage);

            label = document.createElement('label');
            label.innerText = 'Название:';
            label.style.width = labelWidth;
            label.style.float = 'left';
            label.style.margin='2px 0px';
            label.style.color='#BFBFBF';
            promptFrame.appendChild(label);

            let promptFrameTitle = document.createElement('input');
            promptFrameTitle.style.width = inputWidth;
            promptFrameTitle.style.float = 'right';
            promptFrameTitle.style.margin='2px 0px';
            promptFrameTitle.style.padding='0px';
            promptFrameTitle.type = 'text';
            promptFrame.appendChild(promptFrameTitle);

            label = document.createElement('label');
            label.innerText = 'Источник:';
            label.style.width = labelWidth;
            label.style.float = 'left';
            label.style.margin='2px 0px';
            label.style.color='#BFBFBF';
            promptFrame.appendChild(label);

            let promptFrameSourcePage = document.createElement('input');
            promptFrameSourcePage.style.width = inputWidth;
            promptFrameSourcePage.style.float = 'right';
            promptFrameSourcePage.style.margin='2px 0px';
            promptFrameSourcePage.style.padding='0px';
            promptFrameSourcePage.type = 'text';
            promptFrame.appendChild(promptFrameSourcePage);

            label = document.createElement('label');
            label.innerText = 'HTML-код:';
            label.style.width = labelWidth;
            label.style.float = 'left';
            label.style.margin='2px 0px';
            label.style.color='black';
            label.style.display='block';
            promptFrame.appendChild(label);

            let promptFrameCode = document.createElement('textarea');
            promptFrameCode.style.display='block';
            promptFrameCode.style.width = '500px';
            // promptFrameCode.style.maxHeight = '100px';
            promptFrameCode.style.resize = 'none';
            promptFrameCode.style.float = 'right';
            promptFrameCode.style.margin='2px 0px';
            promptFrameCode.style.padding='0px';
            promptFrameCode.rows = '7';
            promptFrame.appendChild(promptFrameCode);

            let okButton = document.createElement('button');
            okButton.style.display='block';
            okButton.style.width = '80px';
            okButton.style.height = '20px';
            okButton.style.float = 'right';
            okButton.style.margin='15px 0px 0px 10px';
            okButton.innerText = 'OK';
            promptFrame.appendChild(okButton);

            let cancelButton = document.createElement('button');
            cancelButton.style.display='block';
            cancelButton.style.width = '80px';
            cancelButton.style.height = '20px';
            cancelButton.style.float = 'right';
            cancelButton.style.margin='15px 0px 0px 10px';
            cancelButton.innerText = 'Отмена';
            promptFrame.appendChild(cancelButton);

            let promptFramePlayers = document.createElement('select');
            promptFramePlayers.style.width = '200px';
            promptFramePlayers.style.height = '30px';
            promptFramePlayers.style.float = 'left';
            promptFramePlayers.style.margin='10px 0px 0px 0px';
            promptFramePlayers.style.padding='5px';
            promptFrame.appendChild(promptFramePlayers);

            let options = ['Проигрыватель', 'StrobeMediaPlayback.swf', 'uppod.swf'];
            let num; for (num = 0; num < options.length; ++num) {
                let selectOption = document.createElement('option');
                selectOption.text = options[num];
                if (num === 0) {selectOption.value = '';} else {selectOption.value = options[num];}
                promptFramePlayers.appendChild(selectOption);
            }

            let content, thumbnail, pageURL, title, code;

            let resetInputs = function() {
                promptFrameContent.value = ''; promptFrameImage.value = ''; promptFrameTitle.value = ''; promptFrameSourcePage.value = '';
                promptFrameCode.value = '<div class="thumbnail" title="" image="" content="" url=""></div>';
            };

            resetInputs();

            let getEmbedCode = function() {
                content = promptFrameContent.value.trim();
                thumbnail = (promptFrameImage.value || '').trim();
                pageURL = (promptFrameSourcePage.value || '').trim();
                title = (promptFrameTitle.value || '').trim();
                code = promptFrameCode.value.trim();

                title = title.Capitalize();

                let player = promptFramePlayers.value;

                let embedCode = '<div class="thumbnail"';
                if (content !== pageURL) embedCode += ' title="'+title+'"';
                if (thumbnail && thumbnail !== content) embedCode += ' image="'+thumbnail+'"';
                embedCode += ' content="'+content+'"';
                if (content !== pageURL) embedCode +=' url="'+pageURL+'"';
                if (player && player !== '') embedCode +=' player="'+player+'"';
                embedCode += '></div>';

                return embedCode;
            };

            let fillFields = function() {
                // <div class="thumbnail" title="" image="" content="" url=""></div>
                promptFrameContent.value = promptFrameCode.value.replace(/.*content="(.*?)".*/i, '$1');
                promptFrameImage.value = promptFrameCode.value.replace(/.*image="(.*?)".*/i, '$1');
                promptFrameSourcePage.value = promptFrameCode.value.replace(/.*url="(.*?)".*/i, '$1');
                promptFrameTitle.value = promptFrameCode.value.replace(/.*title="(.*?)".*/i, '$1');
            };

            let timesClicked = 0;
            let promptFrameSubmit = function() {
                if (!activeSpoiler || timesClicked > 0) return false;

                let refreshSpoiler = function() {
                    thumbnailsArray = document.querySelectorAll('#previews > .spoilerbox > .thumbnail');
                    forEach(thumbnailsArray, function(index, self) {
                        self.addEventListener('click', function(){showContent(self, thumbnailsArray);}, false);
                    });
                    activeSpoilerButton.click(); activeSpoilerButton.click();
                };

                let embedCode = getEmbedCode();
                if (content && content.match(/:\/\//i) && code.match(/^<div.*<\/div>$/i)) {
                    let newElement = document.createElement('div');
                    activeSpoiler.appendChild(document.createTextNode('\n'));
                    activeSpoiler.appendChild(newElement);
                    newElement.outerHTML = embedCode;
                    promptFrame.remove();
                    timesClicked += 1;
                    refreshSpoiler();
                }
            };

            let promptFrameCancel = function() {
                promptFrame.remove();
            };

            let onKeyPress = function(target, e) {
                e = e || window.event;

                let enterKey = 13, escKey = 27;
                // let ctrlDown = e.ctrlKey||e.metaKey; // Mac support

                if (e.keyCode == escKey) { // Escape
                    promptFrameCancel();
                    e.preventDefault();
                }
                else if (e.keyCode == enterKey) {
                    promptFrameSubmit();
                    e.preventDefault();
                }
                else {
                    if (target == promptFrameCode) {
                        fillFields();
                    } else {
                        promptFrameCode.value = getEmbedCode();
                    }
                }
            };

            let eventList = ['keydown', 'keyup'];
            let inputList = [promptFrameContent, promptFrameImage, promptFrameSourcePage, promptFrameTitle, promptFrameCode, promptFramePlayers, okButton];

            inputList.forEach(function(input){
                eventList.forEach(function(event){
                    input.addEventListener(event,function(e){onKeyPress(input, e);},false);
                });
            });

            // inputList.forEach(function(input){
            //   input.onkeydown = function(e){onKeyPress(input, e);};
            //   input.onkeyup = function(e){onKeyPress(input, e);};
            // });

            promptFramePlayers.addEventListener('click', function(){promptFrameCode.value = getEmbedCode();}, false);

            okButton.addEventListener('click', promptFrameSubmit, false);
            cancelButton.addEventListener('click', promptFrameCancel, false);

            promptFrameContent.focus();
        }

        function onKeyDown(e, code) {
            e = e || window.event;

            let ctrlDown = e.ctrlKey || e.metaKey; // Mac support
            let shiftDown = !!window.event.shiftKey;

            let targetType = e.target.tagName.toLowerCase();

            if (code) e.keyCode = code;

            if (!(targetType == 'input' || targetType == 'textarea')) {
                let hovered = (activeSpoiler && activeThumbnail) ? activeThumbnail : (activeSpoiler ? activeSpoiler.querySelector('.thumbnail:hover') : null);

                if (e.keyCode == KEY_ESCAPE) { // Escape
                    hideContent();
                    e.preventDefault();
                }
                else if (e.keyCode == KEY_LEFT_ARROW) {
                    changeContent(galleryList, -1); // Left Arrow
                    e.preventDefault();
                }
                else if (e.keyCode == KEY_RIGHT_ARROW) {
                    changeContent(galleryList, false); // Right Arrow
                    e.preventDefault();
                }
                else if ((hovered || activeThumbnail) && e.keyCode == KEY_DELETE) { // Delete
                    let array = shiftDown ? document.querySelectorAll('#previews > .spoilerbox > .thumbnail') : null;
                    if (activeThumbnail) {regUndoAction(activeThumbnail); disableElement(activeThumbnail, true, array); changeContent(galleryList, changeContentOffset);} else if (hovered) {regUndoAction(hovered); disableElement(hovered, true, array);}
                    galleryList = createGalleryList(activeSpoiler);
                    findDuplicates(activeSpoiler.querySelectorAll('.thumbnail'));
                    e.preventDefault();
                }
                else if ((hovered || activeThumbnail) && e.keyCode == KEY_K) { // Control + K
                    let array = shiftDown ? document.querySelectorAll('#previews > .spoilerbox > .thumbnail') : null;
                    if (activeThumbnail) {regUndoAction(activeThumbnail); disableElement(activeThumbnail, false, array); changeContent(galleryList, changeContentOffset);} else if (hovered) {regUndoAction(hovered); disableElement(hovered, false, array);}
                    galleryList = createGalleryList(activeSpoiler);
                    findDuplicates(activeSpoiler.querySelectorAll('.thumbnail'));
                    e.preventDefault();
                }
                else if (activeSpoiler && ctrlDown && e.keyCode == KEY_C) { // Control + C
                    parent.focus();
                    if (hovered) copyToClipboard(hovered);
                    else copyToClipboard(activeSpoiler);
                    e.preventDefault();
                }
                else if (ctrlDown && e.keyCode == KEY_S) { // Control + S
                    downloadCurrentDocument(document.documentElement);
                    e.preventDefault();
                }
                else if (activeOutput && e.keyCode == KEY_Z && !ctrlDown) {
                    minimizeContentOutputs();
                    e.preventDefault();
                }
                else if (activeSpoiler && e.keyCode == KEY_P) { // P
                    parent.focus();
                    let target = activeThumbnail ? activeThumbnail : hovered;
                    let match = target.innerText.match(/(.*)[\r\n]{2}Categories:.*/);
                    if (match) textToClipboard(match[1].trim());
                    e.preventDefault();
                }
                else if (e.keyCode == KEY_Q) {
                    let buttonTextShow = document.head.querySelector('style.buttonTextShow');
                    if (buttonTextShow) {buttonTextShow.remove();}
                    else {addGlobalStyle('.spoilertop > p, .thumbnail > p, #linkText {display: block;}', 'temporary buttonTextShow');}
                    e.preventDefault();
                }
                else if (activeSpoiler && e.keyCode == KEY_G) {
                    initPromptFrame();
                    e.preventDefault();
                    // } else if (activeSpoiler && hovered && ctrlDown && e.keyCode == eKey) {
                }
                else if (activeSpoiler && hovered && e.keyCode == KEY_O) {
                    let url = hovered.dataset.url;
                    if (url) window.open(url,'_blank');
                    e.preventDefault();
                }
                else if (activeSpoiler && e.keyCode == KEY_Z && ctrlDown) {
                    undoAction();
                    galleryList = createGalleryList(activeSpoiler);
                    findDuplicates(activeSpoiler.querySelectorAll('.thumbnail'));
                    e.preventDefault();
                }
                else if (e.keyCode == KEY_OPEN_BRACKET) {
                    changeContentOffset = -1;
                    e.preventDefault();
                }
                else if (e.keyCode == KEY_CLOSE_BRACKET) {
                    changeContentOffset = false;
                    e.preventDefault();
                }
                else if (hovered && (ctrlDown && e.keyCode == KEY_F)) { // Control + F
                    let title = hovered.getAttribute('title') || hovered.getAttribute('alt');
                    if (title) window.open('https://encrypted.google.com/webhp#q='+title,'_blank');
                    e.preventDefault();
                }
                else if ((hovered || activeThumbnail) && e.keyCode == KEY_F) { // Mark as Favourite
                    if (activeThumbnail) {regUndoAction(activeThumbnail); favElement(activeThumbnail, true); /*changeContent(galleryList, changeContentOffset);*/} else if (hovered) {regUndoAction(hovered); favElement(hovered, true);}
                    /*
                    galleryList = createGalleryList(activeSpoiler);
                    findDuplicates(activeSpoiler.querySelectorAll('.thumbnail'));
                    */
                    e.preventDefault();
                }
                // e.preventDefault();
            }
        }

        // window.onkeydown =  function(e){onKeyDown(e);};
        window.addEventListener('keydown', function(e){onKeyDown(e);}, false);

        // /*
        let previews = document.querySelector('#previews');
        thumbnailsArray = document.querySelectorAll('.thumbnail');
        forEach(thumbnailsArray, function(index, self) {
            let thisThumbnail = self;
            let categories = self.dataset.categories;
            if (categories) {
                categories = categories.trim().
                replace(/\s+,/g, ',').
                replace(/,\s+/g, ',').
                replace(/,+/g, ',').
                replace(/^,/g, '').
                replace(/,$/g, '').
                replace(/,/g, ', ')
                ;
                self.dataset.categories = categories;
                // alert(categories);
                // self.title = self.title + '\nCategories: [' + self.dataset.categories /*.toTitleCase()*/ + ']';
                // let categoriesArray = categories.split(',')
                let categoriesArray = categories ? categories.split(',') : [];
                forEach(categoriesArray, function(index, self) {
                    let category = self.trim();
                    if (category.length > 0) {
                        let matched = false;
                        if (category.match(/^\s*M:/)) {
                            category = category.replace(/^\s*M:/, '').trim();
                            matched = 'model';
                        };
                        let title = category.replace(/\s+/i, ' ').Capitalize();
                        let id = 'category-' + category.toLowerCase().replace(/[\s.()]+/ig, '_');
                        let newSpoiler = document.querySelector('#previews > .spoilerbox#' + id);
                        // console.log(id);
                        if (!newSpoiler) {
                            newSpoiler = document.createElement('div');
                            previews.appendChild(document.createTextNode('\n'));
                            previews.appendChild(newSpoiler);
                            newSpoiler.setAttribute('class', 'spoilerbox');
                            newSpoiler.classList.add('remove-on-copy');
                            newSpoiler.setAttribute('data-title', '*\n' + title);
                            newSpoiler.setAttribute('id', id);
                            if (matched) {
                                newSpoiler.setAttribute('data-special', matched);
                                // console.log(newSpoiler);
                            };
                        };
                        let isDuplicate = false;
                        let thisThumbnailContent = thisThumbnail.dataset.content || thisThumbnail.dataset.image;
                        for (let item of newSpoiler.querySelectorAll('.thumbnail')) {
                            let itemContent = item.dataset.content || item.dataset.image;
                            if (itemContent == thisThumbnailContent) {
                                isDuplicate = true;
                                break;
                            };
                        };
                        if (!isDuplicate) {
                            let thisThumbnailclone = thisThumbnail.cloneNode(false);
                            thisThumbnailclone.classList.add('removeoncopy');
                            newSpoiler.appendChild(document.createTextNode('\n'));
                            newSpoiler.appendChild(thisThumbnailclone);
                            // alert(category);
                        };
                    };
                });
            };
        });
        /*
        forEach(thumbnailsArray, function(index, self) {
            if (self.dataset.categories) {
                self.title = self.title + '\nCategories: [' + self.dataset.categories.toTitleCase() + ']';
            };
        });
        */
        spoilersArray = document.querySelectorAll('#previews > .spoilerbox');
        thumbnailsArray = document.querySelectorAll('#previews > .spoilerbox > .thumbnail');
        // */

        // joinParts(spoilersArray); spoilersArray = document.querySelectorAll('#previews > .spoilerbox');

        forEach(spoilersArray, function(index, self) {
            let imageSrc = self.dataset.image;
            let title = self.getAttribute('title');
            if (title) {
                self.setAttribute('data-title', title);
            };
            self.removeAttribute('title');
            title = self.dataset.title;

            let style = self.getAttribute('style');

            let spoilerId = self.getAttribute('id');
            if (!spoilerId) {
                spoilerId = title ? title.toLowerCase().replace(/[\s.]+/ig, '_')/*.toCamelCase()*/ : null;
                self.setAttribute('id', spoilerId);
            }
            let allowBackground = self.dataset.background; if (allowBackground && allowBackground == 'yes') {let background = document.createElement('div'); background.setAttribute('class', 'background'); self.insertBefore(background, self.firstChild); backgroundsArray.push(background);}
            let thumbnailsStyle = self.dataset.css; if (thumbnailsStyle && thumbnailsStyle !== '') {addGlobalStyle('#'+spoilerId+' > .thumbnail {'+thumbnailsStyle+'}', 'temporary');}
            let lazyImagesArray = [];
            let createButton = function() {
                let spoiler = self;
                let spoilerButton = document.createElement('div');
                spoilerButton.setAttribute('class', 'spoilertop');
                let image = spoilerButton.querySelector('img');
                let text = spoilerButton.querySelector('p');
                let tooltip = spoilerButton.querySelector('.tooltip');
                if (!image) {
                    if (imageSrc) {
                        image = document.createElement('img');
                        image.setAttribute('data-echo', imageSrc); // src
                        spoilerButton.appendChild(image);
                    }
                    if (title) {
                        // spoilerButton.setAttribute('title', title);
                        text = document.createElement('p');
                        text.innerHTML += title;
                        spoilerButton.appendChild(text);
                        if (!imageSrc) text.setAttribute('class', 'forced');
                        if (!tooltip) {
                            tooltip = document.createElement('span');
                            tooltip.setAttribute('class', 'tooltip');
                            tooltip.innerText = title;
                            spoilerButton.appendChild(tooltip);
                        };
                    }
                    let contentSize = spoilerButton.dataset.quality;
                    if (title) contentSize = contentSize || title;
                    if (contentSize) {
                        contentSize = contentSize.match(/.*?\[?(\d+)x(\d+)\]?$/i);
                        let quality = contentSize ? contentSize[1]*contentSize[2] : null;
                        if (quality) {
                            let color = valToColor(quality/(1900*1080) * 100, 1, 1.0, 0, 100, 1);
                            if (text) text.style.color = color;
                            addHDtext(spoilerButton, contentSize[2]+'p', color, 'rgba(255, 255, 255, 1)', 0.4, 0.5);
                        }
                    }
                }
                if (image && text) {
                    image.onerror = function() {
                        // this.remove();
                        text.setAttribute('class', 'forced');
                    };
                }
                if (style) {
                    spoilerButton.setAttribute('style', style);
                }
                galleries.appendChild(spoilerButton);
                galleries.appendChild(document.createTextNode('\n'));
                spoilerButton.addEventListener('click', function(){showSpoiler(this, spoiler);}, false);
                if (image) lazyImagesArray.push(image);
                if (!self.querySelector('.thumbnail')) spoilerButton.classList.add('empty');
                if (self.dataset.special) {
                    if (self.dataset.special) spoilerButton.classList.add(self.dataset.special);
                    self.removeAttribute('data-special');
                };
                spoilerButton.setAttribute('data-id', spoilerId);
            }();
            initLazyLoad(lazyImagesArray);
        });

        let spoilerButtonsArray = document.querySelectorAll('#galleries > .spoilertop');

        forEach(thumbnailsArray, function(index, self) {
            self.addEventListener('click', function(){showContent(self, thumbnailsArray);}, false);
            addMouseWheelHandler(self, function(){
                let img = self.querySelector('img');
                imsSrcChange(self, img, 1)
            }, function(){
                let img = self.querySelector('img');
                imsSrcChange(self, img, -1)
            }, true, true);
        });
        forEach(backgroundsArray, function(index, self) {
            self.addEventListener('click', function(){
                if (activeOutput) {resetContentOutputs(); buttonClicked(false, thumbnailsArray, true);}}, false);
        });
        imgOutput.addEventListener('click', hideContent, false);
        closeButton.addEventListener('click', hideContent, false);
        nextButton.addEventListener('click', function(e){onKeyDown(e, KEY_RIGHT_ARROW);}, false);
        delButton.addEventListener('click', function(e){onKeyDown(e, KEY_DELETE);}, false);
        prevButton.addEventListener('click', function(e){onKeyDown(e, KEY_LEFT_ARROW);}, false);
        if (favButton) favButton.addEventListener('click', function(e){onKeyDown(e, KEY_F);}, false);

        addMouseWheelHandler(nextButton, function(e){onKeyDown(e, KEY_RIGHT_ARROW);}, function(e){onKeyDown(e, KEY_LEFT_ARROW);}, true, true);
        addMouseWheelHandler(prevButton, function(e){onKeyDown(e, KEY_RIGHT_ARROW);}, function(e){onKeyDown(e, KEY_LEFT_ARROW);}, true, true);
        addMouseWheelHandler(delButton, function(e){onKeyDown(e, KEY_RIGHT_ARROW);}, function(e){onKeyDown(e, KEY_LEFT_ARROW);}, true, true);
        if (favButton) addMouseWheelHandler(favButton, function(e){onKeyDown(e, KEY_RIGHT_ARROW);}, function(e){onKeyDown(e, KEY_LEFT_ARROW);}, true, true);
        /*
        let me = 'complete.misc_1'; // some id
        window.addEventListener("message", function(e) {
            if(e.origin === location.origin && typeof e.data === 'object' && e.data.sender !== me) {
                console.log('received in script ' + me +': ', e.data.data);
            }
        });
        */
        //
        console.log(params);
        if (params.tab) {
            let tabs = document.querySelectorAll('.spoilertop');
            forEach(tabs, function(index, self) {
                let title = self.querySelector('p');
                if (title) {
                    let titleText = title.innerText.trim();
                    // titleText = titleText.replace(/\n/g, '');
                    /*
                    console.log(titleText);
                    console.log(params.tab.trim());
                    console.log(titleText == params.tab.trim());
                    */
                    if (titleText == params.tab.trim()) {
                        // Create a new 'change' event
                        let event = new Event('click');
                        // Dispatch it.
                        self.dispatchEvent(event);
                    }
                }
            });
        };
        // var lastSpoilerState;
        const menuCommandSortByDuration = GM_registerMenuCommand('Sort By Duration', function() {
            // alert(1);
            if (activeSpoiler) {
                // lastSpoilerState = lastSpoilerState ? lastSpoilerState : activeSpoiler.querySelectorAll('.thumbnail');
                let lastSpoilerState = activeSpoiler.querySelectorAll('.thumbnail');
                // console.log(lastSpoilerState);
                let newSpoilerState = []; // lastSpoilerState.sort();
                for (let element of lastSpoilerState) {
                    newSpoilerState.push(element);
                };
                function sortFunc (a, b) {
                    // console.log(a, b);
                    let seconds = (time) => {
                        let duration = time.split(':');
                        for (let v of duration) {
                            return (
                                duration.length == 3 ? Number(duration[0]) * 60 * 60 + Number(duration[1]) * 60 + Number(duration[2]) :
                                duration.length == 2 ? Number(duration[0]) * 60 + Number(duration[1]) : Number(duration[0])
                            );
                        };
                    };
                    let ta = 0, tb = 0;
                    if (a.dataset && a.dataset.duration) ta = seconds(a.dataset.duration);
                    if (b.dataset && b.dataset.duration) tb = seconds(b.dataset.duration);
                    console.log(a.dataset.duration, b.dataset.duration, ta, tb, ta-tb);
                    return tb - ta; // ta - tb;
                }
                newSpoilerState.sort(sortFunc);
                for (let element of newSpoilerState) {
                    activeSpoiler.appendChild(element);
                };
            };
        }, "");
    };

    document.addEventListener('DOMContentLoaded', documentOnReady);

    /*
    if (typeof jQuery == 'undefined') {
        let script = document.createElement('script');
        script.type = "text/javascript";
        script.src = "http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js";
        document.getElementsByTagName('head')[0].appendChild(script);
    }
    */
})();
