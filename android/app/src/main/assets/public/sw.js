/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-afac4cd2'], (function (workbox) { 'use strict';

  self.skipWaiting();
  workbox.clientsClaim();
  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "registerSW.js",
    "revision": "1872c500de691dce40960bb85481de07"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "ac171a1763f3707a2aac20aaec702847"
  }, {
    "url": "pwa-512x512.png",
    "revision": "a6c5ca613b87b3190ded715e619142eb"
  }, {
    "url": "pwa-192x192.png",
    "revision": "a81cbe9a164e176f2c865e4452adf1b3"
  }, {
    "url": "manifest.json",
    "revision": "fcdaa2c30a15903a491661e2e8d5c6c2"
  }, {
    "url": "index.html",
    "revision": "e8b2155b106e2d04245f1d7735a78b66"
  }, {
    "url": "icon.svg",
    "revision": "4b9d80df5fb24e735a2867ee36229c09"
  }, {
    "url": "apple-touch-icon.png",
    "revision": "de54267372f5bb138d08b933caca7755"
  }, {
    "url": "assets/index-BvrwT-83.css",
    "revision": null
  }, {
    "url": "assets/index-BkNrgNtn.js",
    "revision": null
  }, {
    "url": "_redirects",
    "revision": "24451388c2fc69419fac47ca08311257"
  }, {
    "url": "apple-touch-icon.png",
    "revision": "de54267372f5bb138d08b933caca7755"
  }, {
    "url": "icon.svg",
    "revision": "4b9d80df5fb24e735a2867ee36229c09"
  }, {
    "url": "pwa-192x192.png",
    "revision": "a81cbe9a164e176f2c865e4452adf1b3"
  }, {
    "url": "pwa-512x512.png",
    "revision": "a6c5ca613b87b3190ded715e619142eb"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "ac171a1763f3707a2aac20aaec702847"
  }, {
    "url": "manifest.webmanifest",
    "revision": "32f5ec58e43af081f43ffb176e2f9e4f"
  }], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("index.html")));
  workbox.registerRoute(/^https:\/\/fonts\.googleapis\.com\/.*/i, new workbox.CacheFirst({
    "cacheName": "google-fonts-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 10,
      maxAgeSeconds: 31536000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');
  workbox.registerRoute(/^https:\/\/fonts\.gstatic\.com\/.*/i, new workbox.CacheFirst({
    "cacheName": "gstatic-fonts-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 20,
      maxAgeSeconds: 31536000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');

}));
