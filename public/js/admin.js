const new_pattern_form = document.querySelector("#pattern_form");
const button = new_pattern_form.querySelector("button");

button.addEventListener("click", (e) => {
  e.preventDefault();
  const params = new FormData(new_pattern_form);
  console.log(params);
  fetch("/api/pattern", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      // "Content-Type": "multipart/form-data",
    },
    body: new URLSearchParams(params),
  });
});


(async ()=> {
  const adminWrapper = document.querySelector('.admin-presets')
  const result = await fetch("/api/pattern")
  const json = await result.json()
  json.forEach(row=>{
    adminWrapper.innerHTML += generateElement(row)
  })
  const removeButtons = document.querySelectorAll('.preset-remove-button')
  const makeActiveButtons = document.querySelectorAll('.preset-make-active-button')

  removeButtons.forEach(el=>{
    el.addEventListener('click', (e)=>{
      const id = e.target.dataset.id
      fetch(`/api/pattern/${id}`, {
        method: "DELETE"
      });
    })
  })

  makeActiveButtons.forEach(el=>{
    el.addEventListener('click', (e)=>{
      const id = e.target.dataset.id
      fetch(`/api/pattern/${id}/active`, {
        method: "PUT"
      });
    })
  })

})()

function generateElement({id, name, alarm_offset, active, breaks_count}){
  return `
  <div class="preset-box">
    <div class="preset-quick-settings">
      <button class="preset-remove-button" data-id="${id}">Usuń</button>
      <button class="preset-make-active-button" data-id="${id}">Ustaw jako aktywny</button>
    </div>
    <div class="preset-header">
      <a href="/admin/patern/${id}"
        ><div class="preset-name">${name}</div></a
      >
      <div class="preset-header-button">&#9998;</div>
    </div>
    <div class="preset-info">Liczba przerw: ${breaks_count}</div>
    <div class="preset-info">Przesunięcie przerw: ${alarm_offset}s</div>
    <div class="preset-isselected preset-selected">${ active ? 'Aktywne' : 'Nieaktywne' }</div>
  </div>`
}

