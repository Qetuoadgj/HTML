// ==UserScript==
// @name		 HTML GALLERY TEST (AJAX) v0.4
// @icon		 http://rddnickel.com/images/HTML%20icon.png
// @version		 2.7.4
// @description	 Pure JavaScript version.
// @author		 Ægir
// @grant		 unsafeWindow
// @run-at		 document-start
// @noframes
// @downloadURL	 https://github.com/Qetuoadgj/HTML/raw/master/HTML%20GALLERY%20TEST%20(AJAX)%20v0.4.user.js
// @homepageURL	 https://github.com/Qetuoadgj/HTML
// @match		 file:///*/2.0.4.html
// @match		 file:///*/2.0.2.html
// @match		 file:///*/HTML/tmp/html/*.html
// ==/UserScript==

// Require chrome extension:
// https://chrome.google.com/webstore/detail/native-hls-playback/emnphkkblegpebimobpbekeedfgemhof

(function() {
	'use strict';

	// Your code here...

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

	function download(text, filename, type) { // http://stackoverflow.com/a/40139881
		var blob = new Blob([text], {type: (type || 'text/plain')}); // http://www.freeformatter.com/mime-types-list.html
		var url = window.URL.createObjectURL(blob);
		var a = document.createElement('a');
		a.href = url;
		a.download = filename;
		a.click();
	}

	Element.prototype.hasClass = function(cssClass) {
		var re = new RegExp('(^|\\s)' + cssClass + '(\\s|$)', 'g');
		if (re.test(this.className)) return true;
		return false;
	};

	Element.prototype.scrolledIntoView = function() {
		var coords = this.getBoundingClientRect();
		return ((coords.top >= 0 && coords.left >= 0 && coords.top) <= (window.innerHeight || document.documentElement.clientHeight));
	};

	function forEach(array, callback, scope) {for (var i = 0; i < array.length; i++) {callback.call(scope, i, array[i]);}}
	function isVisible(element) {return element.offsetWidth > 0 || element.offsetHeight > 0 || element.getClientRects().length > 0;}
	// function commentElement(element, text) {var code = text || element.outerHTML; element.outerHTML = ('<!-- '+code+' -->');}
	function disableElement(element, remove) {if (remove) {addClass(element, 'REMOVED');} else {addClass(element, 'COMMENTED');}}

	function getDoctype() {return '<!DOCTYPE ' + document.doctype.name.toUpperCase() + (document.doctype.publicId ? (' PUBLIC "' +	document.doctype.publicId.toUpperCase() + '"') : '') + (document.doctype.systemId ? (' "' + document.doctype.systemId.toUpperCase() + '"') : '') + '>';}

	function resetAttributes(node) {
		var clone = node.cloneNode(true);
		var spoilerButtonsArray = clone.querySelectorAll('.spoilertop');
		var spoilersArray = clone.querySelectorAll('.spoilerbox');
		var thumbnailsArray = clone.querySelectorAll('.thumbnail');

		if (clone.hasClass('thumbnail')) thumbnailsArray = [clone];

		var outputs = clone.querySelector('div#content');
		var iframeOutput, imgOutput, outputsArray = [];
		if (outputs) {
			iframeOutput = outputs.querySelector('#content_iframe');
			imgOutput = outputs.querySelector('#content_img');
			outputsArray.push(iframeOutput, imgOutput);
		}
		var backgroundsArray = clone.querySelectorAll('.background');
		var temporary = clone.querySelectorAll('.temporary');

		var closeButton = clone.querySelector('#closeButton');
		if (closeButton) {closeButton.removeAttribute('width'); closeButton.removeAttribute('height');}

		var nextButton = clone.querySelector('#nextButton');
		if (nextButton) {nextButton.removeAttribute('width'); nextButton.removeAttribute('height');}
		var delButton = clone.querySelector('#delButton');
		if (delButton) {delButton.removeAttribute('width'); delButton.removeAttribute('height');}
		var prevButton = clone.querySelector('#prevButton');
		if (prevButton) {prevButton.removeAttribute('width'); prevButton.removeAttribute('height');}

		clone.removeAttribute('style');
		forEach(spoilerButtonsArray, function(index, self) {
			// self.removeAttribute('style');
			// var image = self.querySelector('img'); if (image) image.remove();
			// var text = self.querySelector('p'); if (text) text.remove();
			self.outerHTML = '<!-- DELETED -->';
		});
		forEach(spoilersArray, function(index, self) {
			self.removeAttribute('style');
			self.removeAttribute('id');
		});
		forEach(thumbnailsArray, function(index, self) {
			self.removeAttribute('style');
			var image = self.querySelector('img'); if (image) image.remove();
			var text = self.querySelector('p'); if (text) text.remove();
			removeClass(self, 'duplicate_1'); removeClass(self, 'duplicate_2');
		});
		forEach(outputsArray, function(index, self) {
			self.removeAttribute('style');
			removeClass(self, 'minimized');
		});
		forEach(temporary, function(index, self) {self.remove();});
		forEach(backgroundsArray, function(index, self) {self.remove();});

		if (outputs) {iframeOutput.src = ''; imgOutput.src = '';}

		var removed = clone.querySelectorAll('.REMOVED');
		var commented = clone.querySelectorAll('.COMMENTED');
		forEach(removed, function(index, self) {self.outerHTML = '<!-- DELETED -->'; /* self.remove(); */});
		forEach(commented, function(index, self) {removeClass(self, 'COMMENTED'); self.outerHTML = '<!-- '+self.outerHTML+' -->';});

		clone.innerHTML = clone.innerHTML.replace(/[ \t]+<!-- DELETED -->[\r\n]|<!-- DELETED -->[\r\n]/g, '');
		clone.innerHTML = clone.innerHTML.replace(/[ \t]+<!-- DELETED -->|<!-- DELETED -->/g, '\n');

		var whitespace = clone.outerHTML.match(new RegExp('[ \t]+<\/'+clone.tagName+'>', 'gi'));
		var spaces; if (whitespace) {var last = whitespace.length-1; spaces = whitespace[last]; spaces = spaces.replace(new RegExp('<\/'+clone.tagName+'>', 'gi'),'');}

		var linkText = clone.querySelector('#linkText');
		if (linkText) linkText.remove();

		var id = clone.getAttribute('id');
		var title = clone.getAttribute('title');
		if (id && id == title.toCamelCase()) clone.removeAttribute('id');

		forEach(clone.querySelectorAll('.qualityText'), function(index, self) {self.remove();});
		forEach(clone.querySelectorAll('.ui-sortable-handle'), function(index, self) {self.classList.remove('ui-sortable-handle');});
		clone.classList.remove('ui-sortable');

		clone.innerHTML = clone.innerHTML.replace(/(<\/div\>)(<div )/g, '$1\n'+whitespace+'\t$2');
		clone.innerHTML = clone.innerHTML.replace(/([\r\n]+[\t ]+){3,}/g, '$1$1');

		return [clone, spaces];
	}

	function copyToClipboard(element) {
		var timeLimit = 250;
		var variables = resetAttributes(element);
		var clone = variables[0], spaces = variables[1] || '';
		var code = spaces + clone.outerHTML;
		var clipboard = document.createElement('textarea');
		clipboard.style.position = 'fixed'; clipboard.style.top = '50%'; clipboard.style.left = '50%'; clipboard.style.transform = 'translate(-50%, -50%)'; clipboard.style['z-index'] = 10;
		clipboard.style.width = '90%'; clipboard.style.height = '90%';
		document.body.appendChild(clipboard);
		function removeTextarea(){setTimeout(function(){clipboard.remove(); clone.remove();}, timeLimit);}
		function onKeyDown(e) {
			e = e || window.event;
			var escKey = 27;
			if (e.keyCode == escKey) { // Escape
				removeTextarea();
			}
			e.preventDefault();
		}
		clipboard.addEventListener('keydown', function(e){onKeyDown(e);}, false);
		clipboard.value = code; clipboard.select(); // document.execCommand('copy');
		var successful, msg;
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
		var pageURL = location.href; var pageTitle = pageURL.replace(/.*\/(.*)$/i, '$1'); pageTitle = pageTitle.replace('.html', '') + '.html';
		var documentClone = document.documentElement.cloneNode(true);
		documentClone = resetAttributes(documentClone)[0];
		var documentString = getDoctype()+'\n'+documentClone.outerHTML+'\n';

		//noinspection JSDeprecatedSymbols
		// var base64doc = btoa(unescape(encodeURIComponent(documentString))), a = document.createElement('a'), e = document.createEvent('HTMLEvents');
		// a.download = pageTitle; a.href = 'data:text/html;base64,' + base64doc; e.initEvent('click', false, false); a.dispatchEvent(e);

		documentString = documentString.replace(/<html(.*?)><head>/i, '<html$1>\n  <head>').replace(/[\s]+<\/body><\/html>/i, '\n  </body>\n</html>');
		documentString = documentString.replace(/\r\n/g, '\n').replace(/\n/g, '\r\n');

		download(documentString, pageTitle, 'text/html');
	}

	function asArray(list) {return Array.prototype.slice.call(list);}

	function addGlobalStyle(css, cssClass) {
		var head = document.getElementsByTagName('head')[0]; if (!head) {return;}
		var style = document.createElement('style'); style.type = 'text/css'; style.innerHTML = css;
		if (cssClass) style.setAttribute('class', cssClass);
		head.appendChild(style);
	}

	function addClass(element, cssClass){
		var re = new RegExp('(^|\\s)' + cssClass + '(\\s|$)', 'g');
		if (re.test(element.className)) return;
		element.className = (element.className + ' ' + cssClass).replace(/\s+/g, ' ').replace(/(^ | $)/g, '');
	}

	function removeClass(element, cssClass){
		var re = new RegExp('(^|\\s)' + cssClass + '(\\s|$)', 'g');
		element.className = element.className.replace(re, '$1').replace(/\s+/g, ' ').replace(/(^ | $)/g, '');
	}

	String.prototype.Capitalize = function() {
		function capFirst(str) {return str.length === 0 ? str : str[0].toUpperCase() + str.substr(1);}
		return this.split(' ').map(capFirst).join(' ');
	};

	String.prototype.toCamelCase = function() {
		return this.replace(/\W+(.)/g, function(match, chr) {return chr.toUpperCase();});
	};

	String.prototype.replaceAll = function (find, replace) {
		var str = this; while( str.indexOf(find) > -1) {str = str.replace(find, replace);}
		return str;
	};

	var undoElementsBuffer = []; // var undoChangesBuffer = [];
	function regUndoAction(element) {
		undoElementsBuffer.push(element); // undoChangesBuffer.push(element.outerHTML);
	}
	function undoAction() {
		var num = undoElementsBuffer.length - 1; if (num > -1) {
			// undoElementsBuffer[num].outerHTML = undoChangesBuffer[num];
			removeClass(undoElementsBuffer[num], 'REMOVED');
			removeClass(undoElementsBuffer[num], 'COMMENTED');
			undoElementsBuffer.splice(num, 1); // undoChangesBuffer.splice(num, 1);
		}
	}

	Array.prototype.contains = function(obj) {var i = this.length; while (i--) {if (this[i] === obj) {return true;}} return false;};

	function drawCloseButton(element, width, height, lineGaps, color) {
		var getRealDimensions = function(element) {
			var realWidth, realHeight;
			var realDimensions = [];
			var clone = element.cloneNode(true);
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

		var real = getRealDimensions(element);

		width = width || real.width || 64;
		height = height || width || real.height || 64;

		if (width || height) element.setAttribute('width', width || height);
		if (height || width) element.setAttribute('height', height || width);
		var context = element.getContext('2d');
		context.beginPath();
		context.lineWidth = width / 10;

		lineGaps = lineGaps || 0.15;
		var lineLength = 1 - lineGaps;

		context.moveTo(width * lineGaps, height * lineGaps);
		context.lineTo(width * lineLength, height * lineLength);
		context.moveTo(width * lineLength, height * lineGaps);
		context.lineTo(width * lineGaps, height * lineLength);
		if (color) context.strokeStyle = color;
		context.stroke();
		context.closePath();
	}

	function drawArrow(element, width, height, lineGaps, color, angle) {
		var getRealDimensions = function(element) {
			var realWidth, realHeight;
			var realDimensions = [];
			var clone = element.cloneNode(true);
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

		var real = getRealDimensions(element);

		width = width || real.width || 64;
		height = height || width || real.height || 64;

		if (width || height) element.setAttribute('width', width || height);
		if (height || width) element.setAttribute('height', height || width);
		var context = element.getContext('2d');
		context.beginPath();
		context.lineWidth = width / 10;

		lineGaps = lineGaps || 0.15;
		var lineLength = 1 - lineGaps;

		context.moveTo(width*2 * lineGaps, height * lineGaps);
		context.lineTo(width*1.5 * 0.5, height * 0.5 + 3);
		context.moveTo(width*1.5 * 0.5, height * 0.5 - 3);
		context.lineTo(width*2 * lineGaps, height * lineLength);
		if (color) context.strokeStyle = color;
		context.stroke();
		context.closePath();
	}

	// * Converts an HSL color value to RGB. Conversion formula
	// * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
	// * Assumes h, s, and l are contained in the set [0, 1] and
	// * returns r, g, and b in the set [0, 255].
	// *
	// * @param	  {number}	h		The hue
	// * @param	  {number}	s		The saturation
	// * @param	  {number}	l		The lightness
	// * @return  {Array}			The RGB representation
	function hslToRgb(h, s, l){
		var r, g, b;
		if(s === 0){
			r = g = b = l; // achromatic
		}else{
			var hue2rgb = function hue2rgb(p, q, t){
				if(t < 0) t += 1;
				if(t > 1) t -= 1;
				if(t < 1/6) return p + (q - p) * 6 * t;
				if(t < 1/2) return q;
				if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
				return p;
			};
			var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
			var p = 2 * l - q;
			r = hue2rgb(p, q, h + 1/3);
			g = hue2rgb(p, q, h);
			b = hue2rgb(p, q, h - 1/3);
		}
		return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
	}

	// * Converts an RGB color value to HSL. Conversion formula
	// * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
	// * Assumes r, g, and b are contained in the set [0, 255] and
	// * returns h, s, and l in the set [0, 1].
	// *
	// * @param	  {number}	r		The red color value
	// * @param	  {number}	g		The green color value
	// * @param	  {number}	b		The blue color value
	// * @return  {Array}			The HSL representation
	function rgbToHsl(r, g, b){
		r /= 255; g /= 255; b /= 255;
		var max = Math.max(r, g, b), min = Math.min(r, g, b);
		var h, s, l = (max + min) / 2;
		if(max == min){
			h = s = 0; // achromatic
		}else{
			var d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
			switch(max){
				case r: h = (g - b) / d + (g < b ? 6 : 0); break;
				case g: h = (b - r) / d + 2; break;
				case b: h = (r - g) / d + 4; break;
			}
			h /= 6;
		}
		return [h, s, l];
	}

	function pickColourByScale(percent, clip, saturation, start, end, format) {
		format = format || 'hsl';
		var a = (percent <= clip) ? 0 : (((percent - clip) / (100 - clip))),
			b = Math.abs(end - start) * a,
			c = (end > start) ? (start + b) : (start - b);
		var h = c, s = saturation, l = '50%';
		if (format=='hsl') {
			return 'hsl(' + c + ','+ saturation +'%,50%)';
		} else {
			var rgb = hslToRgb(h, s, l);
			return 'rgb('+rgb[1]+', '+rgb[2]+', '+rgb[3]+')';
		}
	}

	function addHDtext(parentElement, qualityText, backGroundColor, textColor, backGroundAlpha, opactity) {
		backGroundAlpha = backGroundAlpha === 0 ? 0 : backGroundAlpha ? backGroundAlpha : 0.4;
		var mainDiv = document.createElement('div');
		mainDiv.setAttribute('class', 'qualityText');
		mainDiv.style.background = backGroundColor;
		mainDiv.style.background = mainDiv.style.background.replace(/rgb\((.*)\)/, 'rgba($1, '+backGroundAlpha+')');
		mainDiv.style.zIndex = 2147483647; // '10000';
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
		parentElement.insertBefore(mainDiv, parentElement.firstChild);
	}

	function hmsToSecondsOnly(str) {
		var p = str.split(':'),
			s = 0, m = 1;

		while (p.length > 0) {
			s += m * parseInt(p.pop(), 10);
			m *= 60;
		}

		return s;
	}

	// ==========================================================
	// IMAGES LAZY LOAD
	// https://toddmotto.com/echo-js-simple-javascript-image-lazy-loading/
	// ==========================================================
	// window.echo = (function (window, document) {

	// 'use strict';

	/* Constructor function */
	var Echo = function (elem) {
		this.elem = elem;
		this.render();
		this.listen();
	};

	/* Images for echoing */
	var echoStore = [];

	/* Element in viewport logic */
	var scrolledIntoView = function (element) {
		var coords = element.getBoundingClientRect();
		return ((coords.top >= 0 && coords.left >= 0 && coords.top) <= (window.innerHeight || document.documentElement.clientHeight));
	};

	/* Changing src attr logic */
	var echoSrc = function (img, callback) {
		var imgSrc = img.getAttribute('data-echo');
		if (imgSrc) {
			img.src = imgSrc;
			img.removeAttribute('data-echo');
		}
		if (typeof callback == 'function') callback();
	};

	var setThumbnailImage = function (self) {
		var image = self.querySelector('img');
		if (image) {
			var src = image.getAttribute('data-echo');
			if (src) {
				image.setAttribute('src', src);
				image.removeAttribute('data-echo');
			}
		}
	};

	/* Remove loaded item from array */
	var removeEcho = function (element, index) {
		if (!element.src) return;
		if (echoStore.indexOf(element) !== -1) {
			echoStore.splice(index, 1);
		}
	};

	/* Echo the images and callbacks */
	var echoImages = function () {
		for (var i = 0; i < echoStore.length; i++) {
			var self = echoStore[i];
			if (scrolledIntoView(self)) {
				echoSrc(self, removeEcho(self, i));
			}
		}
	};

	/* Prototypal setup */
	Echo.prototype = {
		init : function () {
			echoStore.push(this.elem);
		},
		render : function () {
			if (document.addEventListener) {
				document.addEventListener('DOMContentLoaded', echoImages, false);
			} else {
				window.onload = echoImages;
			}
		},
		listen : function () {
			window.onscroll = echoImages;
		}
	};

	/* Initiate the plugin */
	function initLazyLoad(lazyImgs) {
		echoStore = [];
		lazyImgs = lazyImgs || document.querySelectorAll('img[data-echo]');
		for (var i = 0; i < lazyImgs.length; i++) {
			new Echo(lazyImgs[i]).init();
		}
		echoImages();
	}

	// })(window, document);
	// ==========================================================

	function addMouseWheelHandler(element, onB, onF, preventDefaultB, preventDefaultF) {
		var mouseScroll = (e) => {
			// cross-browser wheel delta
			e = window.event || e; // old IE support
			var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
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
			element.addEventListener("mousewheel", mouseScroll, false); // IE9, Chrome, Safari, Opera
			element.addEventListener("DOMMouseScroll", mouseScroll, false); // Firefox
		} else {
			element.attachEvent("onmousewheel", mouseScroll); // IE 6/7/8
		}
	}

	function documentOnReady() {
		// GLOBAL VARIABLES
		var wallpaperVideo = document.querySelector('video#wallpapers');
		// var spoilerButtonsArray = document.querySelectorAll('#galleries > .spoilertop'); // moved down
		var spoilersArray = document.querySelectorAll('#previews > .spoilerbox');
		var thumbnailsArray = document.querySelectorAll('#previews > .spoilerbox > .thumbnail');
		var outputs = document.getElementById('content');
		var outputsArray = [];
		var iframeOutput = outputs.querySelector('#content_iframe'), imgOutput = outputs.querySelector('#content_img'), objectOutput = outputs.querySelector('#content_object');
		outputsArray.push(iframeOutput, imgOutput, objectOutput);
		var objectFlashvars = objectOutput.querySelector('param[name="flashvars"]');
		var galleryList = [];
		var activeSpoilerButton, activeSpoiler, activeThumbnail, activeOutput;
		var backgroundsArray = document.querySelectorAll('.background'); backgroundsArray = asArray(backgroundsArray);
		var outputsMinimized;
		// var activeContent;
		var changeContentOffset;

		var galleries = document.querySelector('#galleries');

		var closeButton = document.querySelector('#closeButton');
		drawCloseButton(closeButton, null, null, null);

		var nextButton = document.querySelector('#nextButton');
		drawArrow(nextButton, null, null, null, 'white', null);
		var delButton = document.querySelector('#delButton');
		drawCloseButton(delButton, null, null, null, 'white', null);
		var prevButton = document.querySelector('#prevButton');
		drawArrow(prevButton, null, null, null, 'white', null);

		var linkText = document.querySelector('#linkText');
		if (!linkText) {
			linkText = document.createElement('p');
			linkText.setAttribute('id', 'linkText');
			outputs.appendChild(linkText);
		}

		// DOCUMENT FUNCTIONS
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
			var i, flashvars, existingVars;
			if (source.match('https://www.youtube.com/embed/')) {
				flashvars = [
					'autoplay=1',		// Enable Autoplay
					'hd=1',				// Watch in HD
					'iv_load_policy=3'	// Disable Annotations
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
			return source;
		}

		function hideContent() {
			if (activeOutput) {
				resetContentOutputs();
				buttonClicked(false, thumbnailsArray, true);
			} else if (activeSpoiler) {
				activeSpoiler.style.removeProperty('display');
				buttonClicked(false, spoilerButtonsArray, true);
			}
			closeButton.style.removeProperty('display');
			nextButton.style.removeProperty('display');
			delButton.style.removeProperty('display');
			prevButton.style.removeProperty('display');
			linkText.innerText = null;
			if (wallpaperVideo) wallpaperVideo.play();
		}

		function showContent(thisThumbnail, thumbnailsArray) {
			if (wallpaperVideo) wallpaperVideo.pause();
			var output = thisThumbnail.getAttribute('output');

			var player = thisThumbnail.getAttribute('player');
			var outputAttr = thisThumbnail.getAttribute('attribute') || 'src';
			var flashvars = thisThumbnail.getAttribute('flashvars') || '';

			var content = thisThumbnail.getAttribute('content') || thisThumbnail.getAttribute('image');
			linkText.innerText = decodeURIComponent(content);
			if (!output && (content.match(/^rtmp:\/\//i) || player)) {
				output = 'object';
			} else if (!output && content.match(/\.(jpg|gif|png|bmp|tga|webp)$/i)) {
				output = 'img';
			} else if (!output) {
				output = 'iframe';
				content = content + '#autoplay=true';
				var start = thisThumbnail.getAttribute('start');
				var end = thisThumbnail.getAttribute('end');
				if (start || end) {
					var duration = end ? hmsToSecondsOnly(start || 0) + ',' + hmsToSecondsOnly(end || 0) : hmsToSecondsOnly(start || 0);
					content = content + '&' + '#t=' + duration;
				}
			}

			buttonClicked(thisThumbnail, thumbnailsArray);
			var outputFrame = outputs.querySelector(output);

			content = appendFlashVars(content, player);

			var active = (thisThumbnail == activeThumbnail); // (content == activeContent); // global
			if (active) {buttonClicked(thisThumbnail, thumbnailsArray, true); resetContentOutputs();} else {
				resetContentOutputs();
				setTimeout(function(){
					if (output == 'object') {
						objectOutput.data = player || 'StrobeMediaPlayback.swf';
						objectFlashvars.value = flashvars + content;
					} else {
						outputFrame.setAttribute(outputAttr, content);
					}
				}, 10);

				setTimeout(function(){outputFrame.style.display = 'block';}, 10);

				activeThumbnail = thisThumbnail; activeOutput = outputFrame; // activeContent = content;
				closeButton.style.display = 'block';
				nextButton.style.display = 'block';
				delButton.style.display = 'block';
				prevButton.style.display = 'block';
			}

			setThumbnailImage(thisThumbnail);
			galleryList = createGalleryList(activeSpoiler);
		}

		function createGalleryList(gallery) {
			var galleryList = [];
			var thumbnails = gallery.querySelectorAll('.thumbnail');
			// forEach(thumbnails, function(index, self) {if (isVisible(self)) {var content = self.getAttribute('content'); content = appendFlashVars(content); galleryList.push(content);}});
			forEach(thumbnails, function(index, self) {if (isVisible(self)) galleryList.push(self);});
			return galleryList;
		}

		function changeContent(galleryList, delta) {
			/*
			if (activeOutput) {
				// global activeContent
				var galleryContent = galleryList[galleryList.indexOf(activeContent) + (delta || 1)] || galleryList[delta ? galleryList.length - 1 : 0];
				var activeThumbnailsArray = activeSpoiler.querySelectorAll('.thumbnail');
				var matched;
				forEach(activeThumbnailsArray, function(index, self) {
					if (!matched) {
						var content = self.getAttribute('content');
						content = appendFlashVars(content);
						matched = (content == galleryContent && self !== activeThumbnail);
						if (matched) self.click();
					}
				});
			}
			*/
			if (activeOutput) {
				var galleryThumbnail = galleryList[galleryList.indexOf(activeThumbnail) + (delta || 1)] || galleryList[delta ? galleryList.length - 1 : 0];
				galleryThumbnail.click();
				activeThumbnail = galleryThumbnail; // double-check
			}
		}

		function findDuplicates(activeThumbnails) {
			var contentsList = [];
			var duplicatesList = [];
			forEach(activeThumbnails, function(index, self) {removeClass(self, 'duplicate_1'); removeClass(self, 'duplicate_2');});
			forEach(activeThumbnails, function(index, self) {
				if (isVisible(self)) {
					var imageSrc = self.getAttribute('image'); var contentSrc = self.getAttribute('content'); var img = contentSrc || imageSrc;
					if (contentsList.indexOf(contentSrc) != -1) {addClass(self, 'duplicate_2'); duplicatesList.push(img);}
					if (contentSrc) contentsList.push(img); // to find duplicates
				}
			});
			forEach(activeThumbnails, function(index, self) {
				if (isVisible(self)) {
					var imageSrc = self.getAttribute('image'); var contentSrc = self.getAttribute('content'); var img = contentSrc || imageSrc;
					if (duplicatesList.indexOf(contentSrc) != -1) {addClass(self, 'duplicate_1');}
				}
			});
		}

		function showSpoiler(thisButton, spoiler) {
			var active = isVisible(spoiler);
			buttonClicked(thisButton, spoilerButtonsArray);
			forEach(spoilersArray, function(index, self) {self.style.removeProperty('display');});
			if (active) {buttonClicked(thisButton, spoilerButtonsArray, true); activeSpoiler = false;} else {
				spoiler.style.display = 'block';
				var lazyImagesArray = [];
				var activeThumbnails = spoiler.querySelectorAll('.thumbnail'); forEach(activeThumbnails, function(index, self) {
					var image = self.querySelector('img');
					if (!image) {
						var imageSrc = self.getAttribute('image');
						var contentSrc = self.getAttribute('content');
						var contentSize = self.getAttribute('quality');
						var text, title = self.getAttribute('title');
						if (imageSrc || contentSrc) {
							image = document.createElement('img');
							image.setAttribute('data-echo', imageSrc || contentSrc); // src
							self.appendChild(image);
						}
						if (title) {
							//if (contentSrc.match(/youtube.com\/embed/i)) {text = document.createElement('p'); type = 'YouTube'; text.innerHTML += type; self.appendChild(text);}
							text = document.createElement('p');
							text.innerHTML += title; self.appendChild(text);
							if (!image) text.setAttribute('class', 'forced');
							contentSize = contentSize || title;
						}
						if (contentSize) {
							contentSize = contentSize.match(/.*?\[?(\d+)x(\d+)\]?$/i);
							var quality = contentSize ? contentSize[1]*contentSize[2] : null;
							if (quality) {
								var color = pickColourByScale(quality/(1900*1080)*100, 1, 100, 0, 100);
								if (text) text.style.color = color;
								addHDtext(self, contentSize[2]+'p', color, 'rgba(255, 255, 255, 1)', 0.4, 0.5);
							}
						}
					}
					if (image) lazyImagesArray.push(image);
				});

				findDuplicates(activeThumbnails);

				galleryList = createGalleryList(spoiler);
				activeSpoiler = spoiler;
				activeSpoilerButton = thisButton;

				initLazyLoad(lazyImagesArray);
			}
		}

		String.prototype.Num = function(){return this.match(/\d+/);};

		function initPromptFrame(reset) {
			var promptFrame = document.getElementById('promptFrame');
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

			var labelWidth = '20%';
			var inputWidth = promptFrame.style.width.Num()*0.8 - 5 + 'px';

			var label = document.createElement('label');
			label.innerText = 'Адрес потока:';
			label.style.width = labelWidth;
			label.style.float = 'left';
			label.style.margin='2px 0px';
			label.style.color='black';
			promptFrame.appendChild(label);

			var promptFrameContent = document.createElement('input');
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

			var promptFrameImage = document.createElement('input');
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

			var promptFrameTitle = document.createElement('input');
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

			var promptFrameSourcePage = document.createElement('input');
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

			var promptFrameCode = document.createElement('textarea');
			promptFrameCode.style.display='block';
			promptFrameCode.style.width = '500px';
			// promptFrameCode.style.maxHeight = '100px';
			promptFrameCode.style.resize = 'none';
			promptFrameCode.style.float = 'right';
			promptFrameCode.style.margin='2px 0px';
			promptFrameCode.style.padding='0px';
			promptFrameCode.rows = '7';
			promptFrame.appendChild(promptFrameCode);

			var okButton = document.createElement('button');
			okButton.style.display='block';
			okButton.style.width = '80px';
			okButton.style.height = '20px';
			okButton.style.float = 'right';
			okButton.style.margin='15px 0px 0px 10px';
			okButton.innerText = 'OK';
			promptFrame.appendChild(okButton);

			var cancelButton = document.createElement('button');
			cancelButton.style.display='block';
			cancelButton.style.width = '80px';
			cancelButton.style.height = '20px';
			cancelButton.style.float = 'right';
			cancelButton.style.margin='15px 0px 0px 10px';
			cancelButton.innerText = 'Отмена';
			promptFrame.appendChild(cancelButton);

			var promptFramePlayers = document.createElement('select');
			promptFramePlayers.style.width = '200px';
			promptFramePlayers.style.height = '30px';
			promptFramePlayers.style.float = 'left';
			promptFramePlayers.style.margin='10px 0px 0px 0px';
			promptFramePlayers.style.padding='5px';
			promptFrame.appendChild(promptFramePlayers);

			var options = ['Проигрыватель', 'StrobeMediaPlayback.swf', 'uppod.swf'];
			var num; for (num = 0; num < options.length; ++num) {
				var selectOption = document.createElement('option');
				selectOption.text = options[num];
				if (num === 0) {selectOption.value = '';} else {selectOption.value = options[num];}
				promptFramePlayers.appendChild(selectOption);
			}

			var content, thumbnail, pageURL, title, code;

			var resetInputs = function() {
				promptFrameContent.value = ''; promptFrameImage.value = ''; promptFrameTitle.value = ''; promptFrameSourcePage.value = '';
				promptFrameCode.value = '<div class="thumbnail" title="" image="" content="" url=""></div>';
			};

			resetInputs();

			var getEmbedCode = function() {
				content = promptFrameContent.value.trim();
				thumbnail = (promptFrameImage.value || '').trim();
				pageURL = (promptFrameSourcePage.value || '').trim();
				title = (promptFrameTitle.value || '').trim();
				code = promptFrameCode.value.trim();

				title = title.Capitalize();

				var player = promptFramePlayers.value;

				var embedCode = '<div class="thumbnail"';
				if (content !== pageURL) embedCode += ' title="'+title+'"';
				if (thumbnail && thumbnail !== content) embedCode += ' image="'+thumbnail+'"';
				embedCode += ' content="'+content+'"';
				if (content !== pageURL) embedCode +=' url="'+pageURL+'"';
				if (player && player !== '') embedCode +=' player="'+player+'"';
				embedCode += '></div>';

				return embedCode;
			};

			var fillFields = function() {
				// <div class="thumbnail" title="" image="" content="" url=""></div>
				promptFrameContent.value = promptFrameCode.value.replace(/.*content="(.*?)".*/i, '$1');
				promptFrameImage.value = promptFrameCode.value.replace(/.*image="(.*?)".*/i, '$1');
				promptFrameSourcePage.value = promptFrameCode.value.replace(/.*url="(.*?)".*/i, '$1');
				promptFrameTitle.value = promptFrameCode.value.replace(/.*title="(.*?)".*/i, '$1');
			};

			var timesClicked = 0;
			var promptFrameSubmit = function() {
				if (!activeSpoiler || timesClicked > 0) return false;

				var refreshSpoiler = function() {
					thumbnailsArray = document.querySelectorAll('#previews > .spoilerbox > .thumbnail');
					forEach(thumbnailsArray, function(index, self) {
						self.addEventListener('click', function(){showContent(self, thumbnailsArray);}, false);
					});
					activeSpoilerButton.click(); activeSpoilerButton.click();
				};

				var embedCode = getEmbedCode();
				if (content && content.match(/:\/\//i) && code.match(/^<div.*<\/div>$/i)) {
					var newElement = document.createElement('div');
					activeSpoiler.appendChild(document.createTextNode('\n'));
					activeSpoiler.appendChild(newElement);
					newElement.outerHTML = embedCode;
					promptFrame.remove();
					timesClicked += 1;
					refreshSpoiler();
				}
			};

			var promptFrameCancel = function() {
				promptFrame.remove();
			};

			var onKeyPress = function(target, e) {
				e = e || window.event;

				var enterKey = 13, escKey = 27;
				// var ctrlDown = e.ctrlKey||e.metaKey; // Mac support

				if (e.keyCode == escKey) { // Escape
					promptFrameCancel();
					e.preventDefault();
				} else if (e.keyCode == enterKey) {
					promptFrameSubmit();
					e.preventDefault();
				} else {
					if (target == promptFrameCode) {
						fillFields();
					} else {
						promptFrameCode.value = getEmbedCode();
					}
				}
			};

			var eventList = ['keydown', 'keyup'];
			var inputList = [promptFrameContent, promptFrameImage, promptFrameSourcePage, promptFrameTitle, promptFrameCode, promptFramePlayers, okButton];

			inputList.forEach(function(input){
				eventList.forEach(function(event){
					input.addEventListener(event,function(e){onKeyPress(input, e);},false);
				});
			});

			// inputList.forEach(function(input){
			//	 input.onkeydown = function(e){onKeyPress(input, e);};
			//	 input.onkeyup = function(e){onKeyPress(input, e);};
			// });

			promptFramePlayers.addEventListener('click', function(){promptFrameCode.value = getEmbedCode();}, false);

			okButton.addEventListener('click', promptFrameSubmit, false);
			cancelButton.addEventListener('click', promptFrameCancel, false);

			promptFrameContent.focus();
		}

		function onKeyDown(e, code) {
			e = e || window.event;

			var ctrlDown = e.ctrlKey || e.metaKey; // Mac support

			var targetType = e.target.tagName.toLowerCase();

			if (code) e.keyCode = code;

			if (!(targetType == 'input' || targetType == 'textarea')) {
				var hovered = (activeSpoiler && activeThumbnail) ? activeThumbnail : (activeSpoiler ?  activeSpoiler.querySelector('.thumbnail:hover') : null);

				if (e.keyCode == KEY_ESCAPE) { // Escape
					hideContent();
				} else if (e.keyCode == KEY_LEFT_ARROW) {
					changeContent(galleryList, -1); // Left Arrow
				} else if (e.keyCode == KEY_RIGHT_ARROW) {
					changeContent(galleryList, false); // Right Arrow
				} else if ((hovered || activeThumbnail) && e.keyCode == KEY_DELETE) { // Delete
					if (activeThumbnail) {regUndoAction(activeThumbnail); disableElement(activeThumbnail, true); changeContent(galleryList, changeContentOffset);} else if (hovered) {regUndoAction(hovered); disableElement(hovered, true);}
					galleryList = createGalleryList(activeSpoiler);
					findDuplicates(activeSpoiler.querySelectorAll('.thumbnail'));
				} else if ((hovered || activeThumbnail) && e.keyCode == KEY_K) { // Control + K
					if (activeThumbnail) {regUndoAction(activeThumbnail); disableElement(activeThumbnail, false); changeContent(galleryList, changeContentOffset);} else if (hovered) {regUndoAction(hovered); disableElement(hovered, false);}
					galleryList = createGalleryList(activeSpoiler);
					findDuplicates(activeSpoiler.querySelectorAll('.thumbnail'));
				} else if (activeSpoiler && ctrlDown && e.keyCode == KEY_C) { // Control + C
					parent.focus();
					if (hovered) copyToClipboard(hovered);
					else copyToClipboard(activeSpoiler);
				} else if (ctrlDown && e.keyCode == KEY_S) { // Control + S
					downloadCurrentDocument(document.documentElement);
				} else if (activeOutput && e.keyCode == KEY_Z && !ctrlDown) {
					minimizeContentOutputs();
				} else if (e.keyCode == KEY_Q) {
					var buttonTextShow = document.head.querySelector('style.buttonTextShow');
					if (buttonTextShow) {buttonTextShow.remove();}
					else {addGlobalStyle('.spoilertop > p, .thumbnail > p, #linkText {display: block;}', 'temporary buttonTextShow');}
				} else if (activeSpoiler && e.keyCode == KEY_G) {
					initPromptFrame();
					// } else if (activeSpoiler && hovered && ctrlDown && e.keyCode == eKey) {
				} else if (activeSpoiler && hovered && e.keyCode == KEY_O) {
					var url = hovered.getAttribute('url');
					if (url) window.open(url,'_blank');
				} else if (activeSpoiler && e.keyCode == KEY_Z && ctrlDown) {
					undoAction();
					galleryList = createGalleryList(activeSpoiler);
					findDuplicates(activeSpoiler.querySelectorAll('.thumbnail'));
				} else if (e.keyCode == KEY_OPEN_BRACKET) {
					changeContentOffset = -1;
				} else if (e.keyCode == KEY_CLOSE_BRACKET) {
					changeContentOffset = false;
				} else if (hovered && (ctrlDown && e.keyCode == KEY_F)) { // Control + F
					var title = hovered.getAttribute('title') || hovered.getAttribute('alt');
					if (title) window.open('https://encrypted.google.com/webhp#q='+title,'_blank');
				}
				e.preventDefault();
			}
		}

		// window.onkeydown =  function(e){onKeyDown(e);};
		window.addEventListener('keydown', function(e){onKeyDown(e);}, false);

		/*
		forEach(spoilerButtonsArray, function(index, self) {
			var spoiler_id = self.getAttribute('spoiler'); var spoiler = document.getElementById(spoiler_id);
			if (spoiler) {self.addEventListener('click', function(){showSpoiler(self, spoiler);}, false);}
			var image = self.querySelector('img');
			if (!image) {
				var imageSrc = self.getAttribute('image');
				var title = self.getAttribute('title');
				if (imageSrc) {
					image = document.createElement('img');
					image.setAttribute('src', imageSrc);
					self.appendChild(image);
				}
				if (title) {
					var text = document.createElement('p');
					text.innerHTML += title; self.appendChild(text);
					if (!image) text.setAttribute('class', 'forced');
				}
			}
		});
		*/
		forEach(spoilersArray, function(index, self) {
			var imageSrc = self.getAttribute('image');
			var title = self.getAttribute('title');
			var style = self.getAttribute('style');

			var spoiler_id = self.getAttribute('id');
			if (!spoiler_id) {
				spoiler_id = title ? title.toCamelCase() : null;
				self.setAttribute('id', spoiler_id);
			}
			var allowBackground = self.getAttribute('background'); if (allowBackground && allowBackground == 'yes') {var background = document.createElement('div'); background.setAttribute('class', 'background'); self.insertBefore(background, self.firstChild);backgroundsArray.push(background);}
			var thumbnailsStyle = self.getAttribute('css'); if (thumbnailsStyle && thumbnailsStyle !== '') {addGlobalStyle('#'+spoiler_id+' > .thumbnail '+'{'+thumbnailsStyle+'}', 'temporary');}
			var lazyImagesArray = [];
			var createButton = function() {
				var spoiler = self;
				var spoilerButton = document.createElement('div');
				spoilerButton.setAttribute('class', 'spoilertop');
				var image = spoilerButton.querySelector('img');
				var text = spoilerButton.querySelector('p');
				if (!image) {
					if (imageSrc) {
						image = document.createElement('img');
						image.setAttribute('data-echo', imageSrc); // src
						spoilerButton.appendChild(image);
					}
					if (title) {
						spoilerButton.setAttribute('title', title);
						text = document.createElement('p');
						text.innerHTML += title;
						spoilerButton.appendChild(text);
						if (!imageSrc) text.setAttribute('class', 'forced');
					}
					var contentSize = spoilerButton.getAttribute('quality');
					if (title) contentSize = contentSize || title;
					if (contentSize) {
						contentSize = contentSize.match(/.*?\[?(\d+)x(\d+)\]?$/i);
						var quality = contentSize ? contentSize[1]*contentSize[2] : null;
						if (quality) {
							var color = pickColourByScale(quality/(1900*1080)*100, 1, 100, 0, 100);
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
			}();
			initLazyLoad(lazyImagesArray);
		});

		var spoilerButtonsArray = document.querySelectorAll('#galleries > .spoilertop');

		forEach(thumbnailsArray, function(index, self) {
			self.addEventListener('click', function(){showContent(self, thumbnailsArray);}, false);
		});
		forEach(backgroundsArray, function(index, self) {
			self.addEventListener('click', function(){
				if (activeOutput) {resetContentOutputs(); buttonClicked(false, thumbnailsArray, true);}}, false);
		});
		imgOutput.addEventListener('click', hideContent, false);
		closeButton.addEventListener('click', hideContent, false);
		nextButton.addEventListener('click', function(e){onKeyDown(e, rArrowKey);}, false);
		delButton.addEventListener('click', function(e){onKeyDown(e, delKey);}, false);
		prevButton.addEventListener('click', function(e){onKeyDown(e, lArrowKey);}, false);

		addMouseWheelHandler(nextButton, function(e){onKeyDown(e, rArrowKey);}, function(e){onKeyDown(e, lArrowKey);}, true, true);
		addMouseWheelHandler(prevButton, function(e){onKeyDown(e, rArrowKey);}, function(e){onKeyDown(e, lArrowKey);}, true, true);
		addMouseWheelHandler(delButton, function(e){onKeyDown(e, rArrowKey);}, function(e){onKeyDown(e, lArrowKey);}, true, true);

		/*
			$( '.spoilerbox' ).sortable({
			beforeStop: function addGap( event, ui ) {
				var item = event.target;
				// console.log(event.target);
				item.outerHTML = item.outerHTML; //.replace(/(<\/div>)(<div>)/g, '\1\n\2');
			}
		});
		*/
	}

	document.addEventListener('DOMContentLoaded', documentOnReady);
})();
