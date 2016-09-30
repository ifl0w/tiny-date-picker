(function() {
  // TODO: use event delegation for better performance
  function tdp(elementReplaceSelector, dateChangedHook) {
    this.elementReplaceSelector = elementReplaceSelector;
    this.dateChangedHook = dateChangedHook;

    this.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    this.currentDate = new Date();
    this.targetElement = null;
    this.dPickerElem = null;

    this.container = document.createElement('div');
    this.container.className = 'tiny-date-picker';

    this.yearContainer = document.createElement('div');
    this.monthContainer = document.createElement('div');

    this.weekdayContainer = document.createElement('div')
    this.weekdayContainer.className = 'tdp-weekday-container';

    this.dayContainer = document.createElement('div');
    this.dayContainer.className = 'tdp-day-container';

    this.init();
  }

  tdp.prototype.shifter = function(text, classname, leftShiftHandler, rightShiftHandler, scope) {
    let cont = document.createElement('div');
    cont.className = classname;
    let ls = document.createElement('span');
    ls.className += ' tdp-clickable';
    let label = document.createElement('span');
    let rs = document.createElement('span');
    rs.className += ' tdp-clickable';

    ls.innerHTML = '<';
    label.innerHTML = text;
    rs.innerHTML = '>';

    ls.addEventListener('click', () => { leftShiftHandler(scope); });
    rs.addEventListener('click', () => { rightShiftHandler(scope); });

    cont.setLabelText = function (text) {
      label.innerHTML = text;
    };

    cont.appendChild(ls);
    cont.appendChild(label);
    cont.appendChild(rs);

    return cont;
  };

  tdp.prototype.dayLabel = function(day, clickHandler, scope) {
    let dl = document.createElement('span');
    dl.innerHTML = day;
    dl.className = 'day-label';
    dl.addEventListener('click', () => {
      clickHandler(day, scope);
    });

    return dl;
  }

  tdp.prototype.getTargetElem = function() {
    return document.querySelector(this.elementReplaceSelector);
  }

  tdp.prototype.setLabelText = function(elem, text) {
    elem.innerHTML = ''+text;
  }

  tdp.prototype.addWeekdayLabels = function() {
    for (var i = 0; i < 7; i++) {
      let label = document.createElement('span');
      label.innerHTML = this.weekdays[i];
      label.className = 'day-label';
      this.weekdayContainer.appendChild(label);
    }
  }

  tdp.prototype.addDays = function(currentDate){
    while (this.dayContainer.firstChild) { // clear container
         this.dayContainer.removeChild(this.dayContainer.firstChild);
    }


    let tmp = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1); // fist day in month
    for (var i = 0; i < tmp.getDay(); i++) {
      let empty = document.createElement('span');
      empty.className = 'day-label';
      this.dayContainer.appendChild(empty);
    }

    tmp = new Date(currentDate.getFullYear(), currentDate.getMonth()+1, 0);
    for (var i = 1; i <= tmp.getDate(); i++) {
      let dl = new this.dayLabel(i, this.setDate, this);
      dl.className += ' tdp-clickable';

      if (this.currentDate.getDate() == i) {
        dl.className += ' selected';
      }

      this.dayContainer.appendChild(dl);
    }
  }

  tdp.prototype.setDate = function(day, scope) {
    scope.currentDate.setDate(day);
    scope.renderDPicker();
  }

  tdp.prototype.changeMonth = function(month, scope) {
    scope.currentDate.setMonth(month);
    scope.renderDPicker();
  }

  tdp.prototype.lsMonth = function(scope) { scope.changeMonth(scope.currentDate.getMonth()-1, scope); }
  tdp.prototype.rsMonth = function(scope) { scope.changeMonth(scope.currentDate.getMonth()+1, scope); }

  tdp.prototype.changeYear = function(year, scope) {
    scope.currentDate.setFullYear(year);
    scope.renderDPicker();
  }

  tdp.prototype.lsYear = function(scope) { scope.changeYear(scope.currentDate.getFullYear()-1, scope); }
  tdp.prototype.rsYear = function(scope) { scope.changeYear(scope.currentDate.getFullYear()+1, scope); }

  tdp.prototype.renderDPicker = function() {
    this.yearContainer.setLabelText(this.currentDate.getFullYear());
    this.monthContainer.setLabelText(this.months[this.currentDate.getMonth()]);
    this.addDays(this.currentDate);
    this.dateChangedHook(new Date(this.currentDate));
  }

  tdp.prototype.init = function() {
    console.log("init tdp");
    this.targetElement = this.getTargetElem();

    this.yearContainer = new this.shifter(this.currentDate.getFullYear(), 'tdp-year-container', this.lsYear, this.rsYear, this);
    this.monthContainer = new this.shifter(this.currentDate.getMonth(), 'tdp-month-container', this.lsMonth, this.rsMonth, this);

    this.container.appendChild(this.yearContainer);
    this.container.appendChild(this.monthContainer);
    this.container.appendChild(this.weekdayContainer);
    this.container.appendChild(this.dayContainer);

    this.addWeekdayLabels();
    this.renderDPicker();

    this.targetElement.parentNode.replaceChild(this.container, this.targetElement);
  }

  window.tinyDatePicker = tdp;
})();
