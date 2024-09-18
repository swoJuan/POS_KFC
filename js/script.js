import TinyGesture from "../js/tinyGesture.js";

function initSlider(target) {
  let swiped = false;
  let startOffset = 0;
  const decelerationOnOverflow = 4;
  const revealWidth = 50;
  const snapWidth = revealWidth / 1.5;

  const preventDefault = (event) => {
    event.preventDefault();
  };

  const gesture = new TinyGesture(target);

  // swipe gestures
  gesture.on("panmove", (event) => {
    if (gesture.animationFrame) {
      return;
    }

    gesture.animationFrame = window.requestAnimationFrame(() => {
      let getX = (x) => {
        if (x < revealWidth && x > -revealWidth) {
          return x;
        }
        /* condicional para el swip derecho (mostrar contenido derecho) */
        if (x < -revealWidth) {
          return (x + revealWidth) / decelerationOnOverflow - revealWidth;
        }
        if (x > revealWidth) {
          return (x - revealWidth) / decelerationOnOverflow + revealWidth;
        }
      };
      const newX = getX(startOffset + gesture.touchMoveX);
      target.style.transform = "translateX(" + newX + "px)";
      if (newX >= snapWidth || newX <= -snapWidth) {
        swiped = newX < 0 ? -revealWidth : revealWidth;
      } else {
        swiped = false;
      }
      window.requestAnimationFrame(() => {
        target.style.transition = null;
      });
      gesture.animationFrame = null;
    });
  });

  gesture.on("panend", () => {
    window.cancelAnimationFrame(gesture.animationFrame);
    gesture.animationFrame = null;
    window.requestAnimationFrame(() => {
      target.style.transition = "transform .2s ease-in";
      if (!swiped) {
        startOffset = 0;
        target.style.transform = null;
      } else {
        startOffset = swiped;
        target.style.transform = "translateX(" + swiped + "px)";
      }
    });
  });

  // reset on tap
  gesture.on("doubletap", (event) => {
    // we could also use 'doubletap' here
    window.requestAnimationFrame(() => {
      target.style.transition = "transform .2s ease-in";
      swiped = false;
      startOffset = 0;
      target.style.transform = null;
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".swipe-item").forEach(initSlider);
});

// "use strict";

// var SwipeableList = function SwipeableList(state) {
//   this.state = state;
//   this.threshold = state.threshold;
//   this.size = state.size;
//   this.speed = state.speed;
//   this.DOMElement = document.querySelector(state.element);

//   this.animate = this.animate.bind(this);
//   this.closeMenu = this.closeMenu.bind(this);
//   this.openMenu = this.openMenu.bind(this);
//   this.handleTouch = this.handleTouch.bind(this);

//   this.handler(
//     this.DOMElement,
//     "addEventListener",
//     ["touchstart", "touchmove", "touchend"],
//     this.handleTouch
//   );
// };

// SwipeableList.prototype = {
//   handler: function (element, method, events, fn) {
//     events.forEach(function (event) {
//       element[method](event, fn, { passive: true });
//     });
//   },

//   animate: function (amount, speed, type) {
//     this.state.item.style["transform"] =
//       "translate3d(" + -amount + type + ", 0, 0)";
//     this.state.item.style["transition"] = "transform " + speed + "s";
//   },

//   handleTouch: function (e) {
//     this.state.touchPositionX = e.originalEvent
//       ? e.originalEvent.changedTouches[0].clientX
//       : e.changedTouches[0].clientX;

//     switch (e.type) {
//       case "touchstart":
//         this.state.startTouchPosition = this.state.touchPositionX;
//         break;

//       case "touchend":
//         this.drop();
//         break;

//       default:
//         if (
//           this.state.startTouchPosition - this.state.touchPositionX >=
//           this.threshold
//         ) {
//           if (!this.menuIsOpen) {
//             this.drag(e);
//           }
//         }
//         break;
//     }
//     this.dragDropHandler(e);
//   },

//   dragDropHandler: function (e) {
//     e.stopImmediatePropagation();
//     var el = e.currentTarget;
//     this.state.containerSize = el.clientWidth;
//     this.state.item = e.srcElement;
//   },

//   openMenu: function () {
//     this.state.menuIsOpen = 1;
//     this.animate(this.state.size, this.state.speed, "%");
//     this.handler(
//       this.DOMElement,
//       "removeEventListener",
//       ["touchstart", "touchmove", "touchend"],
//       this.handleTouch
//     );
//     this.DOMElement.addEventListener("touchend", this.closeMenu);
//   },

//   drag: function () {
//     this.state.isDragging = 1;
//     this.state.draggedEl =
//       this.state.startTouchPosition - this.state.touchPositionX;
//     this.animate(this.state.draggedEl, 0, "px");
//   },

//   drop: function () {
//     this.state.isDragging = 0;
//     if (!this.state.menuIsOpen) {
//       if (this.state.draggedEl >= this.threshold * 2) {
//         this.openMenu();
//         this.state.draggedEl = 0;
//       } else {
//         this.closeMenu();
//       }
//     }
//     return true;
//   },

//   closeMenu: function () {
//     this.state.menuIsOpen = 0;
//     this.animate(0, this.state.speed, "%");
//     this.handler(
//       this.DOMElement,
//       "addEventListener",
//       ["touchstart", "touchmove", "touchend"],
//       this.handleTouch
//     );
//   },
// };
// document.querySelectorAll(".item").forEach((item) => {
//   let startX;

//   item.addEventListener("touchstart", (e) => {
//     startX = e.touches[0].clientX;
//   });

//   item.addEventListener("touchmove", (e) => {
//     const touch = e.touches[0];
//     const change = startX - touch.clientX;

//     if (change > 0) {
//       item.classList.add("swipe-left");
//     } else {
//       item.classList.add("swipe-right");
//     }
//   });

//   item.addEventListener("touchend", () => {
//     if (item.classList.contains("swipe-left")) {
//       item.style.display = "none"; // Delete action
//     } else if (item.classList.contains("swipe-right")) {
//       alert("Saved!"); // Save action
//     }

//     item.classList.remove("swipe-left", "swipe-right");
//   });
// });

// /* Created by Tivotal */

// const items = document.querySelectorAll(".list-item");

// //looping through items
// items.forEach((item) => {
//   //event listeners to each item

//   item.addEventListener("touchstart", (e) => {
//     e.target.dataset.x =
//       Number(e.touches[0].pageX) + Number(e.target.dataset.move) || 0;
//   });

//   item.addEventListener("touchmove", (e) => {
//     let moveX = Number(e.target.dataset.x) - e.touches[0].pageX;

//     moveX > 130 ? (moveX = 130) : null;
//     moveX < -130 ? (moveX = -130) : null;

//     e.target.dataset.move = moveX;

//     //animeJS functions
//     const timeline = anime.timeline({
//       duration: 300,
//     });

//     timeline.add({
//       targets: e.target,
//       translateX: -Number(e.target.dataset.move),
//     });
//   });

//   item.addEventListener("touchend", (e) => {
//     let elementMove = e.target.dataset.move;

//     if (elementMove > 100) {
//       elementMove = 100;
//     } else if (elementMove < -100) {
//       elementMove = -100;
//     } else {
//       elementMove = 0;
//     }

//     //looping through the items again
//     items.forEach((item) => {
//       let content = item.querySelector(".item-content");

//       if (content === e.target) {
//         return null;
//       }

//       content.dataset.x = 0;
//       content.dataset.move = 0;
//       //animeJS functions
//       const timeline = anime.timeline({
//         duration: 300,
//       });

//       timeline.add({
//         targets: content,
//         translateX: 0,
//       });
//     });

//     setTimeout(() => {
//       //animeJS functions
//       const timeline = anime.timeline({
//         duration: 300,
//       });

//       timeline.add({
//         targets: e.target,
//         translateX: -Number(elementMove),
//       });
//     }, 1);
//   });
// });
