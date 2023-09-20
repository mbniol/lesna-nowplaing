const new_pattern_form = document.querySelector('#pattern_form')
const button = new_pattern_form.querySelector('button')

button.addEventListener('click', e=>{
  const name = new_pattern_form.querySelector('name')
  const offset = new_pattern_form.querySelector('offset')
  const params = URLSearchParams({
    name, offset
  })
  fetch('/api/pattern', {
    method: 'POST',
    body: params.toString()
  })
})