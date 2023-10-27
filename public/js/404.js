const targetEl = document.getElementById("img404");

elementCount = 9;

var randomnumber = Math.floor(Math.random() * (elementCount - 1 + 1)) + 1;

targetEl.src = "/img/404/" + randomnumber + ".webp";
