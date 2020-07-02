document.querySelector('#petBirth').addEventListener('input', () => {
  document.querySelector('#petAge').value = calculatePetAge()
})

function calculatePetAge() {
  const birthDate = new Date(document.querySelector('#petBirth').value);
  const age = Math.floor((new Date() - birthDate.getTime()) / 3.15576e+10)
  return age < 1 ? 1 : age;
}