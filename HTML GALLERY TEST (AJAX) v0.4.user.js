// ==UserScript==
// @name         HTML GALLERY TEST (AJAX) v0.4
// @namespace    none
// @version      2.2.4
// @author       Æegir
// @description  try to take over the world!
// @match        file:///*/2.0.4.html
// @match        file:///*/2.0.2.html
// @grant        unsafeWindow
// updateURL     https://github.com/Qetuoadgj/HTML/raw/master/HTML%20GALLERY%20TEST%20(AJAX)%20v0.4.user.js
// @icon         http://rddnickel.com/images/HTML%20icon.png
// @run-at       document-start
// ==/UserScript==

(function() {
  'use strict';

  // Your code here...

  //GLOBAL FUNCTIONS
  function forEach(array, callback, scope) {for (var i = 0; i < array.length; i++) {callback.call(scope, i, array[i]);}}
  function isVisible(element) {return element.offsetWidth > 0 || element.offsetHeight > 0 || element.getClientRects().length > 0;}
  function commentElement(element) {var code = element.outerHTML; element.outerHTML = ('<!-- '+code+' -->');}

  function getDoctype() {return '<!DOCTYPE ' + document.doctype.name.toUpperCase() + (document.doctype.publicId?' PUBLIC "' +  document.doctype.publicId.toUpperCase() + '"':'') + (document.doctype.systemId?' "' + document.doctype.systemId.toUpperCase() + '"':'') + '>';}

  function resetAttributes(node) {
    var clone = node.cloneNode(true);
    var spoilerButtonsArray = clone.querySelectorAll('.spoilertop');
    var spoilersArray = clone.querySelectorAll('.spoilerbox');
    var thumbnailsArray = clone.querySelectorAll('.thumbnail');
    var outputs = clone.querySelector('div#content');
    var iframeOutput, imgOutput, outputsArray = [];
    if (outputs) {
      iframeOutput = outputs.querySelector('#content_iframe');
      imgOutput = outputs.querySelector('#content_img');
      outputsArray.push(iframeOutput, imgOutput);
    }
    var backgroundsArray = clone.querySelectorAll('.background');
    var temporary = clone.querySelectorAll('.temporary');

    clone.removeAttribute('style');
    forEach(spoilerButtonsArray, function(index, self) {
      self.removeAttribute('style');
      var image = self.querySelector('img'); if (image) image.remove();
      var text = self.querySelector('p'); if (text) text.remove();
    });
    forEach(spoilersArray, function(index, self) {self.removeAttribute('style');});
    forEach(thumbnailsArray, function(index, self) {
      self.removeAttribute('style');
      var image = self.querySelector('img'); if (image) image.remove();
      var text = self.querySelector('p'); if (text) text.remove();
    });
    forEach(outputsArray, function(index, self) {
      self.removeAttribute('style');
      removeClass(self, 'minimized');
    });
    forEach(temporary, function(index, self) {self.remove();});
    forEach(backgroundsArray, function(index, self) {self.remove();});

    if (outputs) {iframeOutput.src = ''; imgOutput.src = '';}

    return clone;
  }

  function copyToClipboard(element) {
    var clone = resetAttributes(element);
    var code = clone.outerHTML;
    var clipboard = document.createElement('textarea');
    clipboard.style.position = 'fixed'; clipboard.style.top = '50%'; clipboard.style.left = '50%'; clipboard.style.transform = 'translate(-50%, -50%)'; clipboard.style['z-index'] = 10;
    clipboard.style.width = '90%'; clipboard.style.height = '90%';
    document.body.appendChild(clipboard);
    clipboard.value = code; clipboard.select(); document.execCommand('copy');
    setTimeout(function(){clipboard.remove(); clone.remove();}, 200);
  }

  function downloadCurrentDocument() {
    var pageURL = location.href; var pageTitle = pageURL.replace(/.*\/(.*)$/i, '$1'); pageTitle = pageTitle.replace('.html', '') + '.html';
    var doc = getDoctype() + '\n\n' + resetAttributes(document.documentElement).outerHTML;
    //noinspection JSDeprecatedSymbols
    var base64doc = btoa(unescape(encodeURIComponent(doc))), a = document.createElement('a'), e = document.createEvent("HTMLEvents");
    a.download = pageTitle; a.href = 'data:text/html;base64,' + base64doc; e.initEvent('click', false, false); a.dispatchEvent(e);
  }

  function asArray(list) {return Array.prototype.slice.call(list);}

  function addGlobalStyle(css, cssClass) {
    var head = document.getElementsByTagName('head')[0]; if (!head) {return;}
    var style = document.createElement('style'); style.type = 'text/css'; style.innerHTML = css;
    if (cssClass) style.setAttribute('class', cssClass);
    head.appendChild(style);
  }

  function addClass(element, cssClass){
    var re = new RegExp("(^|\\s)" + cssClass + "(\\s|$)", "g");
    if (re.test(element.className)) return;
    element.className = (element.className + " " + cssClass).replace(/\s+/g, " ").replace(/(^ | $)/g, "");
  }

  function removeClass(element, cssClass){
    var re = new RegExp("(^|\\s)" + cssClass + "(\\s|$)", "g");
    element.className = element.className.replace(re, "$1").replace(/\s+/g, " ").replace(/(^ | $)/g, "");
  }

  String.prototype.Capitalize = function() {
    function capFirst(str) {return str.length === 0 ? str : str[0].toUpperCase() + str.substr(1);}
    return this.split(' ').map(capFirst).join(' ');
  };

  document.addEventListener("DOMContentLoaded", function() {
    // GLOBAL VARIABLES
    var spoilerButtonsArray = document.querySelectorAll('#galleries > .spoilertop');
    var spoilersArray = document.querySelectorAll('#previews > .spoilerbox');
    var thumbnailsArray = document.querySelectorAll('#previews > .spoilerbox > .thumbnail');
    var outputs = document.getElementById('content');
    var outputsArray = [];
    var iframeOutput = outputs.querySelector('#content_iframe'), imgOutput = outputs.querySelector('#content_img');
    outputsArray.push(iframeOutput, imgOutput);
    var galleryList = [];
    var activeSpoilerButton, activeSpoiler, activeThumbnail, activeOutput;
    var backgroundsArray = document.querySelectorAll('.background'); backgroundsArray = asArray(backgroundsArray);
    var outputsMinimized;
    var activeContent;
    var refreshDocument;

    // DOCUMENT FUNCTIONS
    function buttonClicked(button, buttonsArray, unclick) {
      if (unclick) {forEach(buttonsArray, function(index, self) {self.style.removeProperty('opacity');});} else {
        forEach(buttonsArray, function(index, self) {self.style.opacity = '0.125';}); button.style.removeProperty('opacity');
      }
    }

    function resetContentOutputs() {
      iframeOutput.src = ''; imgOutput.src = '';
      forEach(outputsArray, function(index, self) {self.style.removeProperty('display');});
      activeOutput = false; activeThumbnail = false; activeContent = false;
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
          'autoplay=1',       // Enable Autoplay
          'hd=1',             // Watch in HD
          'iv_load_policy=3'  // Disable Annotations
        ];
        existingVars = '';
        if (source.match(/[?].*/i)) {
          // source.split("?")[1]
          existingVars += source.replace(/.*[?](.*)/i, '$1'); source = source.replace(/(.*)[?].*/i, '$1');
          flashvars.push(existingVars);
        }
        source += '?';
        i = 0;
        flashvars.forEach(function() {
          if (i < flashvars.length - 1) {flashvars[i] += '&';}
          source += flashvars[i]; i += 1;
        });
      } else if (source.match('.m3u8')) {
        source = 'chrome-extension://emnphkkblegpebimobpbekeedfgemhof/player.html#' + source;
      } else if (source.match('rtmp://')) {
        source = 'StrobeMediaPlayback.swf?src=' + source +'&autoPlay=true';
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
    }

    function showContent(thisThumbnail, thumbnailsArray) {
      var output = thisThumbnail.getAttribute('output');
      var content = thisThumbnail.getAttribute('content') || thisThumbnail.getAttribute('image');
      if (!output && content.match(/\.(jpg|gif|png|bmp|tga|webp)$/i)) {output = 'img';} else if (!output) {output = 'iframe';}
      buttonClicked(thisThumbnail, thumbnailsArray);
      var outputFrame = outputs.querySelector(output);
      var outputAttr = 'src';
      var active = (content == activeContent); // global
      if (active) {buttonClicked(thisThumbnail, thumbnailsArray, true); resetContentOutputs();} else {
        resetContentOutputs();
        outputFrame.style.display = 'block';
        content = appendFlashVars(content);
        setTimeout(function(){
          outputFrame.setAttribute(outputAttr, content);
        }, 10);
        activeThumbnail = thisThumbnail; activeOutput = outputFrame; activeContent = content;
      }
    }

    function createGalleryList(gallery) {
      var galleryList = [];
      var thumbnails = gallery.querySelectorAll('.thumbnail');
      forEach(thumbnails, function(index, self) {var content = self.getAttribute('content'); content = appendFlashVars(content); galleryList.push(content);});
      return galleryList;
    }

    function changeContent(galleryList, delta) {
      if (activeOutput) {
        // global activeContent
        var galleryContent = galleryList[galleryList.indexOf(activeContent) + (delta || 1)] || galleryList[delta ? galleryList.length - 1 : 0];
        var activeThumbnailsArray = activeSpoiler.querySelectorAll('.thumbnail'); forEach(activeThumbnailsArray, function(index, self) {
          var content = self.getAttribute('content'); content = appendFlashVars(content);
          if (content == galleryContent && self !== activeThumbnail) {self.click();}
        });
      }
    }

    function showSpoiler(thisButton, spoiler) {
      var active = isVisible(spoiler);
      buttonClicked(thisButton, spoilerButtonsArray);
      forEach(spoilersArray, function(index, self) {self.style.removeProperty('display');});
      if (active) {buttonClicked(thisButton, spoilerButtonsArray, true); activeSpoiler = false;} else {
        spoiler.style.display = 'block';
        var activeThumbnails = spoiler.querySelectorAll('.thumbnail'); forEach(activeThumbnails, function(index, self) {
          var image = self.querySelector('img'); if (!image) {
            image = document.createElement('img'); var imageSrc = self.getAttribute('image'); var contentSrc = self.getAttribute('content');
            image.setAttribute('src', imageSrc || contentSrc);
            self.appendChild(image);

            var text, type;
            //if (contentSrc.match(/youtube.com\/embed/i)) {text = document.createElement('p'); type = 'YouTube'; text.innerHTML += type; self.appendChild(text);}
            var title = self.getAttribute('title'); if (title) {text = document.createElement('p'); text.innerHTML += title; self.appendChild(text);}
          }
        });
        galleryList = createGalleryList(spoiler);
        activeSpoiler = spoiler;
        activeSpoilerButton = thisButton;
      }
    }

    function onKeyDown(e) {
      e = e || window.event;
      var cKey = 67, delKey = 46, lArrowKey = 37, rArrowKey = 39, escKey = 27, sKey = 83, zKey = 90, fKey = 70, qKey = 81, gKey = 71;
      var ctrlDown = e.ctrlKey||e.metaKey; // Mac support

      var targetType = e.target.tagName.toLowerCase();

      if (!(targetType == 'input' || targetType == 'textarea')) {
        var hovered; if (activeSpoiler) hovered = activeSpoiler.querySelector('.thumbnail:hover');

        if (e.keyCode == escKey) { // Escape
          hideContent();
        } else if (e.keyCode == lArrowKey) {
          changeContent(galleryList,-1); // Left Arrow
        } else if (e.keyCode == rArrowKey) {
          changeContent(galleryList); // Right Arrow
        } else if ((hovered || activeThumbnail) && e.keyCode == delKey) { // Delete
          if (activeThumbnail) {commentElement(activeThumbnail); changeContent(galleryList);} else if (hovered) {commentElement(hovered);}
          galleryList = createGalleryList(activeSpoiler);
        } else if (activeSpoiler && ctrlDown && e.keyCode == cKey) { // Control + C
          copyToClipboard(activeSpoiler);
        } else if (ctrlDown && e.keyCode == sKey) { // Control + S
          downloadCurrentDocument(document.documentElement);
        } else if (activeOutput && e.keyCode == zKey) {
          minimizeContentOutputs();
        } else if (e.keyCode == qKey) {
          var buttonTextShow = document.head.querySelector('style.buttonTextShow');
          if (buttonTextShow) {buttonTextShow.remove();}
          else {addGlobalStyle('.spoilertop > p, .thumbnail > p {display: block;}', 'temporary buttonTextShow');}
        }
        e.preventDefault();
      }
    }

    document.onkeydown =  function(e) {onKeyDown(e);};

    forEach(spoilerButtonsArray, function(index, self) {
      var spoiler_id = self.getAttribute('spoiler'); var spoiler = document.getElementById(spoiler_id);
      if (spoiler) {self.addEventListener("click", function(){showSpoiler(self, spoiler);}, false);}
      var image = self.querySelector('img'); if (!image) {
        image = document.createElement('img'); var imageSrc = self.getAttribute('image');
        image.setAttribute('src', imageSrc);
        self.appendChild(image);

        var title = self.getAttribute('title'); if (title) {var text = document.createElement('p'); text.innerHTML += title; self.appendChild(text);}
      }
    });
    forEach(spoilersArray, function(index, self) {
      var spoiler_id = self.getAttribute('id');
      var allowBackground = self.getAttribute('background'); if (allowBackground && allowBackground == 'yes') {var background = document.createElement('div'); background.setAttribute('class', 'background'); self.insertBefore(background, self.firstChild);backgroundsArray.push(background);}
      var thumbnailsStyle = self.getAttribute('css'); if (thumbnailsStyle && thumbnailsStyle !== '') {addGlobalStyle('#'+spoiler_id+' > .thumbnail '+'{'+thumbnailsStyle+'}', 'temporary');}
    });
    forEach(thumbnailsArray, function(index, self) {
      self.addEventListener("click", function(){showContent(self, thumbnailsArray);}, false);
    });
    forEach(backgroundsArray, function(index, self) {
      self.addEventListener("click", function(){
        if (activeOutput) {resetContentOutputs(); buttonClicked(false, thumbnailsArray, true);}}, false);
    });
    imgOutput.addEventListener("click", hideContent, false);
  });
})();
