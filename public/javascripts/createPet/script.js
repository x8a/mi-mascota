function newDate() {
  let myDate = document.querySelectorAll("#date-view");
  myDate.forEach(el => {
    myDate = new Date(el.innerHTML);
    myDate = `${myDate.getDate().toString().padStart(2,'0')}/${myDate.getMonth() + 1}/${myDate.getFullYear()}`
    el.innerHTML = myDate;
  })
}

newDate();

