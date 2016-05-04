
function Book(bookElem) {
  this.elem = bookElem;

  this.spine = this.elem.querySelectorAll('.spine')[0];
  this.frontCover = this.elem.querySelectorAll('.front-cover')[0];
  this.backCover = this.elem.querySelectorAll('.back-cover')[0];
  this.pages = this.elem.querySelectorAll('.page');

  this.pageIndex = 0;
  this.maxIndex = Math.ceil(this.pages.length / 2) + 1;

  var transitionDuration = window.getComputedStyle(this.pages[0]).getPropertyValue('transition-duration');
  var durationMS;
  if (transitionDuration.indexOf('ms') >= 0) {
    durationMS = transitionDuration.slice(0, transitionDuration.indexOf('ms')) * 1;
  } else if (transitionDuration.indexOf('s') >= 0) {
    durationMS = transitionDuration.slice(0, transitionDuration.indexOf('s')) * 1000;
  }
  this.pageTurnDuration = durationMS || 400;

  this.spine.addEventListener('click', this.handleClick.bind(this));
}

Book.prototype.handleClick = function(e) {
  e.preventDefault();
  var clickEvent = new CustomEvent('bookClicked', { detail: { book: this } });
  document.dispatchEvent(clickEvent);
}

Book.prototype.unshelve = function(e) {
  this.elem.classList.add('remove-from-shelf');
  this.elem.classList.remove('add-to-shelf');
  this.pageIndex = 0;
  setTimeout(this.addNavigation.bind(this), 1000);
}

Book.prototype.shelve = function() {
  if (this.pageIndex > 0) {
    this.turnBackwards();
    if (this.pageIndex == 0) {
      setTimeout(this.shelve.bind(this), this.pageTurnDuration);
    } else {
      setTimeout(this.shelve.bind(this), 100);
    }
  } else {
    this.removeNavigation();
    this.elem.classList.add('add-to-shelf');
    this.elem.classList.remove('remove-from-shelf');
    this.spine.focus();
  }
}

Book.prototype.turnForwards = function() {
  if (this.pageIndex === 0) {
    this.elem.classList.add('open');
    this.frontCover.classList.add('turned');
    this.pages[0].classList.add('turned');
    this.surfacePage(1);
    this.pageIndex++;
  } else {
    if (this.pageIndex < this.maxIndex) {
      this.pages[this.pageIndex * 2 - 1].classList.add('turned');
      this.unsurfacePage(this.pageIndex * 2 - 1);
      if (this.pageIndex === this.maxIndex - 1) {
        this.elem.classList.remove('open');
        this.elem.classList.add('closed');
        this.backCover.classList.add('turned');
        this.navElem.querySelectorAll('.prev')[0].focus();
      } else {
        this.pages[this.pageIndex * 2].classList.add('turned');
        this.surfacePage(this.pageIndex * 2 + 1);
      }
      this.pageIndex++;
    }
  }
}

Book.prototype.turnBackwards = function() {
  if (this.pageIndex === this.maxIndex) {
    this.backCover.classList.remove('turned');
    this.pages[this.pages.length - 1].classList.remove('turned');
    this.surfacePage(this.pages.length - 1);
    this.elem.classList.remove('closed');
    this.elem.classList.add('open');
    this.pageIndex--;
  } else {
    if (this.pageIndex > 0) {
      this.unsurfacePage(this.pageIndex * 2 - 1);
      this.pages[this.pageIndex * 2 - 2].classList.remove('turned');
      if (this.pageIndex === 1) {
        this.elem.classList.remove('open');
        this.frontCover.classList.remove('turned');
        this.navElem.querySelectorAll('.next')[0].focus();
      } else {
        this.pages[this.pageIndex * 2 - 3].classList.remove('turned');
        this.surfacePage(this.pageIndex * 2 - 3);
      }
      this.pageIndex--;
    }
  }
}

/* prevent z-indexes from causing flickering with some JS cheatery */
Book.prototype.surfacePage = function(ind) {
  setTimeout(function() {
    this.pages[ind].classList.add('surface');
  }.bind(this), this.pageTurnDuration * 0.225);
}
Book.prototype.unsurfacePage = function(ind) {
  setTimeout(function() {
    this.pages[ind].classList.remove('surface');
  }.bind(this), this.pageTurnDuration * 0.875);
}

Book.prototype.addNavigation = function() {
  var bookNav = document.createElement('nav');
  bookNav.setAttribute('aria-label', 'Navigate book pages. These controls have a visual effect only.');

  var prevBtn = document.createElement('button');
  prevBtn.innerHTML = 'Previous page';
  prevBtn.classList.add('prev');
  prevBtn.setAttribute('title', 'Previous page');
  bookNav.appendChild(prevBtn);

  var nextBtn = document.createElement('button');
  nextBtn.innerHTML = 'Next page';
  nextBtn.classList.add('next');
  nextBtn.setAttribute('title', 'Next page');
  bookNav.appendChild(nextBtn);

  var closeBtn = document.createElement('button');
  closeBtn.innerHTML = 'Close book';
  closeBtn.classList.add('close');
  closeBtn.setAttribute('title', 'Close book');
  bookNav.appendChild(closeBtn);

  this.navElem = bookNav;
  this.elem.insertBefore(bookNav, this.elem.querySelectorAll('.front-cover')[0]);
  nextBtn.focus();
}

Book.prototype.removeNavigation = function() {
  if (this.navElem) {
    this.elem.removeChild(this.navElem);
  }
}


function handleKeyup(e) {
  if (selectedBook !== null) {
    if (e.keyCode === 27) {
      selectedBook.shelve();
      selectedBook = null;
    } else if (e.keyCode === 37) {
      selectedBook.turnBackwards();
    } else if (e.keyCode === 39) {
      selectedBook.turnForwards();
    }
  }
}

function handleClick(e) {
  e = e || window.event;
  var target = e.target || e.srcElement;
  if (selectedBook !== null && target.tagName.toLowerCase() === 'button') {
    if (target.classList.contains('close')) {
      selectedBook.shelve();
      selectedBook = null;
    } else if (target.classList.contains('prev')) {
      selectedBook.turnBackwards();
    } else if (target.classList.contains('next')) {
      selectedBook.turnForwards();
    }
  }
}

function handleBookClick(e) {
  if (selectedBook === null) {
    e.detail.book.unshelve();
    selectedBook = e.detail.book;
  }
}

function handleBookClosed(e) {
  selectedBook = null;
}


function toggleStyles() {
  /* Just in case we have removed books that would animate */
  for (var i=0; i < books.length; i++) {
    books[i].elem.classList.remove('add-to-shelf');
  }
  document.body.classList.toggle('wall');
  document.body.classList.toggle('reader');
}

function makeInteresting() {
  toggleOffer.classList.add('hide');
  setTimeout(function() {
    toggleStyles();
    toggleOffer.classList.remove('hide');
    toggleOffer.classList.remove('show');
    document.body.focus();
  }, 250);
}

function makePlain() {
  toggleStyles();
}

function dismissToggle() {
  toggleOffer.classList.add('hide');
  setTimeout(function() {
    toggleOffer.classList.remove('show');
    toggleOffer.classList.remove('hide');
    document.body.focus();
  }, 250);
}


function browserHasSupport() {
  return Modernizr.classlist &&
         Modernizr.cssremunit &&
         //Modernizr.customevent &&
         Modernizr.flexbox &&
         Modernizr.flexwrap &&
         Modernizr.preserve3d &&
         Modernizr.queryselector;
}


var minWidthRem = 28.5;
var books = [];
var selectedBook = null;
var toggleOffer = document.getElementById('toggleWallOn');

/* Offer to toggle only if we have a good browser above min width */
var doOfferToggle = false;
if (browserHasSupport()) {
  var bodyFont = window.getComputedStyle(document.body).getPropertyValue('font-size');
  if (bodyFont.indexOf('px') > 0) {
    var remInPx = parseInt(bodyFont.slice(0, bodyFont.indexOf('px')), 10);
    if (!isNaN(remInPx)) {
      doOfferToggle = (document.body.getBoundingClientRect().width / remInPx) >= minWidthRem;
    }
  }
}

if (doOfferToggle) {
  var bookElems = document.querySelectorAll('.book');
  for (var i=0; i < bookElems.length; i++) {
    books.push(new Book(bookElems[i]));
  }

  document.addEventListener('keyup', handleKeyup, false);
  document.addEventListener('click', handleClick, false)
  document.addEventListener('bookClicked', handleBookClick, false);

  document.getElementById('btnInteresting').addEventListener('click', makeInteresting, false);
  document.getElementById('btnNope').addEventListener('click', dismissToggle, false);
  document.getElementById('btnPlain').addEventListener('click', makePlain, false);

  toggleOffer.classList.add('show');
  toggleOffer.focus();
}
