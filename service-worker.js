"use strict";var precacheConfig=[["/index.html","b59d335d7c6cd32df27b270525e7360f"],["/static/css/main.c801a4b0.css","283849619bb84ccd7ad65a04f46ccbe2"],["/static/js/main.2634698a.js","419c1810aef20933fc59ea384d4810e4"],["/static/media/112.3dac44ae.png","3dac44ae6ca68ff2c3efd5179112c0a7"],["/static/media/AEPi-brother.fba9ab33.png","fba9ab336ca35f7e428177cefd35a02b"],["/static/media/brain.e30e8cae.png","e30e8cae5ca59b7df8bb31e0c0608724"],["/static/media/ca.a5f5159e.png","a5f5159e896c462f40015492ee00e444"],["/static/media/campus.5f620837.svg","5f620837ac4051caf76e432c93b3d26f"],["/static/media/campuses.d29867a8.png","d29867a8351a3efc3183e17830b38ce3"],["/static/media/cursor.469e59be.png","469e59be017cb164b46c9514a4e24be1"],["/static/media/diamond-pickaxe-enchanted.7f1bc2f2.png","7f1bc2f2e0a6b28052c62fc86939ba6e"],["/static/media/first-year.eda7ebd0.png","eda7ebd0f2f9957bf2722750b0c3a472"],["/static/media/free-mason.e69d72a0.png","e69d72a055ea21b950790fd0bd2d190c"],["/static/media/free-stone.22900649.png","22900649a7cd9aa9bc75d3cfbc80d1d5"],["/static/media/geology-major.20b14d2b.png","20b14d2bcee9cfdbd722b8ebfa874437"],["/static/media/hand.813a29ea.svg","813a29ea17fb96a06e0daf8a224b8f95"],["/static/media/indiana-jones.8d1861d1.png","8d1861d1212aea42db2bf70d01d4df59"],["/static/media/jahanianite-cursor.40c613e6.png","40c613e6dbf8326e8c75eadfbfc9d57d"],["/static/media/jahanianite.43741a91.png","43741a911fef911c9c454694a1b4383d"],["/static/media/magnet.94e678fb.png","94e678fb8aa5de94b13ee568fe50ff18"],["/static/media/megaphone.496182ee.svg","496182ee658c07af052bda2efbc97b61"],["/static/media/nail-file.3fc40894.png","3fc40894097a8e0c5596cbd52b408a41"],["/static/media/prince.c1719978.png","c17199786fdd0992afa5eaf391e9ec0c"],["/static/media/protesters.e4b8eda6.png","e4b8eda6a8fc3847ae675a90d4ba2bad"],["/static/media/public-figures.8a342bda.png","8a342bdad5bf620cffb36cb9fd947966"],["/static/media/scissors.a23b6ecc.png","a23b6ecc2b5a57991a1c7eb7a58b0062"],["/static/media/spicy-teen.dcca1758.png","dcca1758ec908d6cc3ddc5aaa84de9d7"],["/static/media/steve-austin.67595d6c.png","67595d6c813f0ecab2d9e4808a0db251"],["/static/media/stone.b3407619.png","b3407619d7b946c33e8b2f6877900896"],["/static/media/subronium.199531e7.png","199531e76663e3285b02d3e6f8e4eb03"],["/static/media/super-senior.8f2f5576.png","8f2f5576b02436d9348c62ae35f01d0c"],["/static/media/the-rock.8fb344d2.png","8fb344d2f49a7629e1e56457ed57182e"],["/static/media/uc-rolling-stones.91e9fff7.png","91e9fff7b0860adb6e64163627379b05"],["/static/media/uc-stoner.f65c90ce.png","f65c90ce2113899a2b5758bd7307977b"],["/static/media/wire-cutters.863ee029.png","863ee029a0e1f22127e307310ce8bea0"]],cacheName="sw-precache-v3-sw-precache-webpack-plugin-"+(self.registration?self.registration.scope:""),ignoreUrlParametersMatching=[/^utm_/],addDirectoryIndex=function(e,a){var t=new URL(e);return"/"===t.pathname.slice(-1)&&(t.pathname+=a),t.toString()},cleanResponse=function(a){return a.redirected?("body"in a?Promise.resolve(a.body):a.blob()).then(function(e){return new Response(e,{headers:a.headers,status:a.status,statusText:a.statusText})}):Promise.resolve(a)},createCacheKey=function(e,a,t,n){var c=new URL(e);return n&&c.pathname.match(n)||(c.search+=(c.search?"&":"")+encodeURIComponent(a)+"="+encodeURIComponent(t)),c.toString()},isPathWhitelisted=function(e,a){if(0===e.length)return!0;var t=new URL(a).pathname;return e.some(function(e){return t.match(e)})},stripIgnoredUrlParameters=function(e,t){var a=new URL(e);return a.hash="",a.search=a.search.slice(1).split("&").map(function(e){return e.split("=")}).filter(function(a){return t.every(function(e){return!e.test(a[0])})}).map(function(e){return e.join("=")}).join("&"),a.toString()},hashParamName="_sw-precache",urlsToCacheKeys=new Map(precacheConfig.map(function(e){var a=e[0],t=e[1],n=new URL(a,self.location),c=createCacheKey(n,hashParamName,t,/\.\w{8}\./);return[n.toString(),c]}));function setOfCachedUrls(e){return e.keys().then(function(e){return e.map(function(e){return e.url})}).then(function(e){return new Set(e)})}self.addEventListener("install",function(e){e.waitUntil(caches.open(cacheName).then(function(n){return setOfCachedUrls(n).then(function(t){return Promise.all(Array.from(urlsToCacheKeys.values()).map(function(a){if(!t.has(a)){var e=new Request(a,{credentials:"same-origin"});return fetch(e).then(function(e){if(!e.ok)throw new Error("Request for "+a+" returned a response with status "+e.status);return cleanResponse(e).then(function(e){return n.put(a,e)})})}}))})}).then(function(){return self.skipWaiting()}))}),self.addEventListener("activate",function(e){var t=new Set(urlsToCacheKeys.values());e.waitUntil(caches.open(cacheName).then(function(a){return a.keys().then(function(e){return Promise.all(e.map(function(e){if(!t.has(e.url))return a.delete(e)}))})}).then(function(){return self.clients.claim()}))}),self.addEventListener("fetch",function(a){if("GET"===a.request.method){var e,t=stripIgnoredUrlParameters(a.request.url,ignoreUrlParametersMatching),n="index.html";(e=urlsToCacheKeys.has(t))||(t=addDirectoryIndex(t,n),e=urlsToCacheKeys.has(t));var c="/index.html";!e&&"navigate"===a.request.mode&&isPathWhitelisted(["^(?!\\/__).*"],a.request.url)&&(t=new URL(c,self.location).toString(),e=urlsToCacheKeys.has(t)),e&&a.respondWith(caches.open(cacheName).then(function(e){return e.match(urlsToCacheKeys.get(t)).then(function(e){if(e)return e;throw Error("The cached response that was expected is missing.")})}).catch(function(e){return console.warn('Couldn\'t serve response for "%s" from cache: %O',a.request.url,e),fetch(a.request)}))}});