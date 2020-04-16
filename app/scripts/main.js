/*
 *
 *  Web Starter Kit
 *  Copyright 2015 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */
/* eslint-env browser */
(function () {
  'use strict';

  // Check to make sure service workers are supported in the current browser,
  // and that the current page is accessed from a secure origin. Using a
  // service worker from an insecure origin will trigger JS console errors. See
  // http://www.chromium.org/Home/chromium-security/prefer-secure-origins-for-powerful-new-features

  const isLocalhost = Boolean(window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
  );

  if (
    'serviceWorker' in navigator
    && (window.location.protocol === 'https:' || isLocalhost)
  ) {
    navigator.serviceWorker.register('service-worker.js')
      .then(function (registration) {
        // updatefound is fired if service-worker.js changes.
        registration.onupdatefound = function () {
          // updatefound is also fired the very first time the SW is installed,
          // and there's no need to prompt for a reload at that point.
          // So check here to see if the page is already controlled,
          // i.e. whether there's an existing service worker.
          if (navigator.serviceWorker.controller) {
            // The updatefound event implies that registration.installing is set
            // https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-container-updatefound-event
            const installingWorker = registration.installing;

            installingWorker.onstatechange = function () {
              switch (installingWorker.state) {
                case 'installed':
                  // At this point, the old content will have been purged and the
                  // fresh content will have been added to the cache.
                  // It's the perfect time to display a "New content is
                  // available; please refresh." message in the page's interface.
                  break;

                case 'redundant':
                  throw new Error('The installing ' +
                    'service worker became redundant.');

                default:
                // Ignore
              }
            };
          }
        };
      }).catch(function (e) {
        console.error('Error during service worker registration:', e);
      });
  }

  // Your custom JavaScript goes here

  // function cloneBacon() {
  //   const baconImg = document.querySelector('#overview img');
  //   const baconContainer = baconImg.parentElement;
  //   baconContainer.appendChild(baconImg.cloneNode(true));
  // }

  // const baconBtn = document.querySelector('#overview button');
  // baconBtn.addEventListener('click', () => {
  //   cloneBacon();
  // })

  // Task 2
  if (typeof Vue !== 'undefined') {
    new Vue({
      el: '#checkout',
      data() {
        return {
          form: {
            firstName: '',
            lastName: '',
            email: '',
            country: 'United States',
            postalCode: '',
            phone: '',
            cardNumber: '',
            security: '',
            expirationDate: ''
          },
          countries: [
            'United States',
            'Poland',
            'Italy'
          ],
          errors: []
        }
      },
      filters: {
        currency(value) {
          return '$ ' + value;
        },
        price(value) {
          return '$ ' + value.toFixed(2);
        },
      },
      mounted() {
        let inputs = document.querySelectorAll('.section-checkout__input');

        inputs.forEach(el => {
          el.addEventListener('input', function () {
            if (el.parentElement.classList.contains('error')) {
              el.parentElement.classList.remove('error')
            }
          })
        });
      },
      methods: {
        validateForm() {
          this.errors = [];

          if (!this.form.firstName) {
            this.errors.push('First name can not be empty');
            this.highlightField('firstName');
          }

          if (!this.form.lastName) {
            this.errors.push('Last name can not be empty');
            this.highlightField('lastName');
          }

          if (!this.form.email) {
            this.errors.push('Email can not be empty');
            this.highlightField('email');
          } else if (!this.validateEmail(this.form.email)) {
            this.errors.push('Valid email required');
            this.highlightField('email');
          }

          if (!this.form.postalCode) {
            this.errors.push('Postal code can not be empty');
            this.highlightField('postalCode');
          } else if (!this.validatePostal(this.form.postalCode)) {
            this.errors.push('Valid postal code required');
            this.highlightField('postalCode');
          }

          if (!this.form.phone) {
            this.errors.push('Phone number can not be empty');
            this.highlightField('phone');
          } else if (!this.validatePhone(this.form.phone)) {
            this.errors.push('Valid phone number required');
            this.highlightField('phone');
          }

          if (!this.form.card) {
            this.errors.push('Credit Card Number can not be empty');
            this.highlightField('card');
          } else if (!this.validateCard(this.form.card)) {
            this.errors.push('Valid Credit Card Number required');
            this.highlightField('card');
          }

          if (!this.form.security) {
            this.errors.push('Security code can not be empty');
            this.highlightField('security');
          } else if (!this.validateSecurity(this.form.security)) {
            this.errors.push('Valid security code required');
            this.highlightField('security');
          }

          if (!this.form.expirationDate) {
            this.errors.push('Expiration date can not be empty');
            this.highlightField('expirationDate');
          } else if (!this.validateExpirationDate(this.form.expirationDate)) {
            this.errors.push('Valid expiration date required (Year range is 18-29)');
            this.highlightField('expirationDate');
          }

          if (this.errors.length == 0) {
            alert('Form has been sent')
          }

        },
        highlightField(fieldId) {
          let field = document.querySelector('#' + fieldId).parentElement;
          field.classList.add('error')
        },
        validateEmail(email) {
          var regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return regex.test(email);
        },
        validatePostal(postal) {
          var regex = /^[0-9]{5}(-[0-9]{4})?$/;
          return regex.test(postal);
        },
        validatePhone(phone) {
          let regex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
          return regex.test(phone);
        },
        validateCard(card) {
          let regex = /^4[0-9]{12}(?:[0-9]{3})?$/;
          return regex.test(card);
        },
        validateSecurity(security) {
          let regex = /^[0-9]{3,4}$/;
          return regex.test(security);
        },
        validateExpirationDate(expirationDate) {
          let regex = /^((0[1-9])|(1[0-2]))[\/\.\-]*((1[8-9])|(2[0-9]))$/;
          return regex.test(expirationDate);
        }
      }
    });
  }

})();
