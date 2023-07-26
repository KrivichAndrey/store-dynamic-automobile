'use strict';

export function showSubMenu(paren, subMenu) {
   paren.classList.add('active');
   subMenu.classList.add('active');
}

export function HideSubMenu(paren, subMenu) {
   paren.classList.remove('active');
   subMenu.classList.remove('active');
}

export function addArrowMarker(listItem) {
   const svgTag = '<svg><use href="img/svg/sprite.svg#ic-drop-down-arrow"></use></svg>';

   const icon = document.createElement('span');
   icon.classList.add('dropdown-icon');
   listItem.querySelector('a').appendChild(icon).insertAdjacentHTML('beforeend', svgTag);
}

export function hoverHandler(item) {
   item.addEventListener('mouseover', () => {
      showSubMenu(item, item.lastElementChild);
   });

   item.addEventListener('mouseout', () => {
      HideSubMenu(item, item.lastElementChild);
   });
}
