const new_pattern_form = document.querySelector("#pattern_form");
const button = new_pattern_form.querySelector("button");
console.log(new_pattern_form);

button.addEventListener("click", (e) => {
  e.preventDefault();
  const name = new_pattern_form.querySelector("#name").value;
  const offset = new_pattern_form.querySelector("#offset").value;
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
