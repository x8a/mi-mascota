document.querySelector("input[type='file']").addEventListener('input', () => {
  const pic = document.querySelector("input[type='file']").files
  document.querySelector('label#profilePicName').innerHTML = pic[0].name;
})
