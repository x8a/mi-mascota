document.querySelector("#confirmPassword").addEventListener("keyup", () => {
  validatePassword()
})

function validatePassword() {
  if (document.querySelector("#confirmPassword").value === document.querySelector("#newPassword").value) {
    document.querySelector("#saveButton").disabled = false;
    document.querySelector("#checkMessage").innerHTML = '✔️'
  } else {
    document.querySelector("#checkMessage").innerHTML = '❌'
  }
}