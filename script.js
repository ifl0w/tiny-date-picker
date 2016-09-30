document.addEventListener("DOMContentLoaded", function() {
  let dateChanged = function(date) {
    document.querySelector('#selectedDate').innerHTML = '\"' + date.toDateString() + '\" is selected!';
  }

  let tdp = new tinyDatePicker('#tiny-date-picker', dateChanged);
});
