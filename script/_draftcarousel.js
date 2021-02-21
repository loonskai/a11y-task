var myCarousel = (function() {
  var carousel, slides, index, slidenav, settings, timer, setFocus, animationSuspended;
  // Helper function: Test if element has a specific class
  function hasClass(el, className) {
    if (el.classList) {
      return el.classList.contains(className);
    } else {
      return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
    }
  }

  function init(settings) {
    carousel = document.getElementById(settings.id);
    slides = carousel.querySelectorAll('.slide');

    carousel.className = 'active carousel';
    var ctrls = document.createElement('ul');

    ctrls.className = 'controls';
    ctrls.innerHTML = '<li>' +
        '<button type="button" class="btn-prev"><img src="chevron-left.png" alt="Previous Item"></button>' +
      '</li>' +
      '<li>' +
        '<button type="button" class="btn-next"><img src="chevron-right.png" alt="Next Item"></button>' +
      '</li>';

    ctrls.querySelector('.btn-prev')
      .addEventListener('click', function () {
        prevSlide(true);
      });
    ctrls.querySelector('.btn-next')
      .addEventListener('click', function () {
        nextSlide(true);
      });

    carousel.appendChild(ctrls);
    if (settings.slidenav || settings.animate) {
      slidenav = document.createElement('ul');

      slidenav.className = 'slidenav';

      if (settings.animate) {
        var li = document.createElement('li');

        if (settings.startAnimated) {
          li.innerHTML = '<button data-action="stop"><span class="visuallyhidden">Stop Animation </span>￭</button>';
        } else {
          li.innerHTML = '<button data-action="start"><span class="visuallyhidden">Start Animation </span>▶</button>';
        }

        slidenav.appendChild(li);
      }

      if (settings.slidenav) {
        slides.forEach((el, i) => {
          var li = document.createElement('li');
          var klass = (i===0) ? 'class="current" ' : '';
          var kurrent = (i===0) ? ' <span class="visuallyhidden">(Current Item)</span>' : '';

          li.innerHTML = '<button '+ klass +'data-slide="' + i + '"><span class="visuallyhidden">News</span> ' + (i+1) + kurrent + '</button>';
          slidenav.appendChild(li);
        });
      }

      slidenav.addEventListener('click', function(event) {
        var button = event.target;
        if (button.localName == 'button') {
          if (button.getAttribute('data-slide')) {
            stopAnimation();
            setSlides(button.getAttribute('data-slide'), true);
          } else if (button.getAttribute('data-action') == "stop") {
            stopAnimation();
          } else if (button.getAttribute('data-action') == "start") {
            startAnimation();
          }
        }
      }, true);

      carousel.className = 'active carousel with-slidenav';
      carousel.appendChild(slidenav);
    }

    // Add a live region to announce the slide number when using the previous/next buttons
    var liveregion = document.createElement('div');
    liveregion.setAttribute('aria-live', 'polite');
    liveregion.setAttribute('aria-atomic', 'true');
    liveregion.setAttribute('class', 'liveregion visuallyhidden');
    carousel.appendChild(liveregion);

    // After the slide transitioned, remove the in-transition class, if focus should be set, set the tabindex attribute to -1 and focus the slide.
    slides[0].parentNode.addEventListener('transitionend', function (event) {
      var slide = event.target;
      slide.classList.remove('in-transition');
      if (hasClass(slide, 'current'))  {
        if(setFocus) {
          slide.setAttribute('tabindex', '-1');
          slide.focus();
          setFocus = false;
        }
      }
    });

      // When the mouse enters the carousel, suspend the animation.
      carousel.addEventListener('mouseenter', suspendAnimation);

      // When the mouse leaves the carousel, and the animation is suspended, start the animation.
      carousel.addEventListener('mouseleave', function(event) {
        if (animationSuspended) {
          startAnimation();
        }
      });

      // When the focus enters the carousel, suspend the animation
      carousel.addEventListener('focusin', function(event) {
        if (!hasClass(event.target, 'slide')) {
          suspendAnimation();
        }
      });

      // When the focus leaves the carousel, and the animation is suspended, start the animation
      carousel.addEventListener('focusout', function(event) {
        if (!hasClass(event.target, 'slide') && animationSuspended) {
          startAnimation();
        }
      });

    // Set the index (=current slide) to 0 – the first slide
    index = 0;
    setSlides(index);

    // If the carousel is animated, advance to the
    // next slide after 5s
    if (settings.startAnimated) {
      timer = setTimeout(nextSlide, 5000);
    }
  }

  function setSlides(
    new_current, 
    setFocus = false, 
    transition = 'none', 
    announceItem = false
  ) {
    new_current = parseFloat(new_current);

    var length = slides.length;
    var new_next = new_current+1;
    var new_prev = new_current-1;

    if(new_next === length) {
      new_next = 0;
    } else if(new_prev < 0) {
      new_prev = length-1;
    }

    // Reset slide classes
    for (var i = slides.length - 1; i >= 0; i--) {
      slides[i].className = "slide";
    }

    // Add classes to the previous, next and current slide
    slides[new_next].className = 'next slide' + ((transition == 'next') ? ' in-transition' : '');
    slides[new_next].setAttribute('aria-hidden', 'true');

    slides[new_prev].className = 'prev slide' + ((transition == 'prev') ? ' in-transition' : '');
    slides[new_prev].setAttribute('aria-hidden', 'true');

    slides[new_current].className = 'current slide';
    slides[new_current].removeAttribute('aria-hidden');

    // Update the text in the live region which is then announced by screen readers.
    if (announceItem) {
      carousel.querySelector('.liveregion').textContent = 'Item ' + (new_current + 1) + ' of ' + slides.length;
    }

    // Update the buttons in the slider navigation to match the currently displayed  item
    if(settings.slidenav) {
      var buttons = carousel.querySelectorAll('.slidenav button[data-slide]');
      for (var j = buttons.length - 1; j >= 0; j--) {
        buttons[j].className = '';
        buttons[j].innerHTML = '<span class="visuallyhidden">News</span> ' + (j+1);
      }
      buttons[new_current].className = "current";
      buttons[new_current].innerHTML = '<span class="visuallyhidden">News</span> ' + (new_current+1) + ' <span class="visuallyhidden">(Current Item)</span>';
    }

    // Set the global index to the new current value
    index = new_current;

  }

  function nextSlide(announceItem = false) {
    var length = slides.length,
    new_current = index + 1;

    if(new_current === length) {
      new_current = 0;
    }

    // If we advance to the next slide, the previous needs to be
    // visible to the user, so the third parameter is 'prev', not
    // next.
    setSlides(new_current, false, 'prev', announceItem);

    // If the carousel is animated, advance to the next
    // slide after 5s
    if (settings.animate) {
      timer = setTimeout(nextSlide, 5000);
    }
  }

  // Function to advance to the previous slide
  function prevSlide(announceItem = false) {
    var length = slides.length,
    new_current = index - 1;

    // If we are already on the first slide, show the last slide instead.
    if(new_current < 0) {
      new_current = length-1;
    }

    // If we advance to the previous slide, the next needs to be
    // visible to the user, so the third parameter is 'next', not
    // prev.
    setSlides(new_current, false, 'next', announceItem);
  }

  // Function to stop the animation
  function stopAnimation() {
    clearTimeout(timer);
    settings.animate = false;
    animationSuspended = false;
    _this = carousel.querySelector('[data-action]');
    _this.innerHTML = '<span class="visuallyhidden">Start Animation </span>▶';
    _this.setAttribute('data-action', 'start');
  }

  // Function to start the animation
  function startAnimation() {
    settings.animate = true;
    animationSuspended = false;
    timer = setTimeout(nextSlide, 5000);
    _this = carousel.querySelector('[data-action]');
    _this.innerHTML = '<span class="visuallyhidden">Stop Animation </span>￭';
    _this.setAttribute('data-action', 'stop');
  }

  // Function to suspend the animation
  function suspendAnimation() {
    if(settings.animate) {
      clearTimeout(timer);
      settings.animate = false;
      animationSuspended = true;
    }
  }

  return {
    init:init,
    next:nextSlide,
    prev:prevSlide,
    goto:setSlides,
    stop:stopAnimation,
    start:startAnimation
  };
});

var carousel = new myCarousel();
carousel.init({
  id: 'carousel',
  slidenav: true,
  animate: true,
  startAnimated: true
});
