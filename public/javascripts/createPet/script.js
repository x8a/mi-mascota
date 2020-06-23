function newDate() {
  let myDate = document.querySelectorAll("#date-view");
  myDate.forEach(el => {
    myDate = new Date(el.innerHTML);
    myDate = `${myDate.getDate().toLocaleString(undefined, {minimumIntegerDigits: 2})}-${myDate.getMonth().toLocaleString(undefined, {minimumIntegerDigits: 2})}-${myDate.getFullYear()}`;
    el.innerHTML = myDate;
  })
}

newDate();
