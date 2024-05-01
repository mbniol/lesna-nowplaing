const targetEl = document.querySelector("#img404");

const elementCount = 9;

const randomnumber = Math.floor(Math.random() * elementCount) + 1;

targetEl.src = "/img/404/" + randomnumber + ".webp";
