'use strict';

import { addArrowMarker, hoverHandler } from './catalog';

document.addEventListener('DOMContentLoaded', () => {
   if (document.querySelector('.header__main-menu')) {
      const nav = document.querySelector('.header__main-menu');
      const list = nav.querySelector('ul');

      list.querySelectorAll('li').forEach((element) => {
         for (let i = 0; i < element.children.length; i++) {
            if (element.children[i].classList.contains('catalog-menu')) {
               element.style.position = 'static';
            }
         }

         if (element.children.length > 1) {
            addArrowMarker(element);
            hoverHandler(element);
         }
      });
   }
});
