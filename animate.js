const queueItems = [...document.querySelectorAll(".queue-item")];
const itemsWithTitles = queueItems.map((item) => {
  title = item.querySelector(".queue-item-title");
  return { item, title };
});

const filteredItemsWithTitles = itemsWithTitles.filter(({ item, title }) => {
  //dodac tu jakis padding jaki bedzie potem
  return (
    title.getBoundingClientRect().right > item.getBoundingClientRect().right
  );
});

filteredItemsWithTitles.forEach(({ item, title }) => {
  const diff = Math.ceil(
    title.getBoundingClientRect().right - item.getBoundingClientRect().right
  );
  const transitionLength = diff / 20;
  title.style.transition = `transform ${transitionLength}s linear`;
  createTimeout(item, 0, transitionLength * 1000, -diff, true);
});

function createTimeout(item, delay, transitionLength, vector, forward) {
  console.log("helo", item);
  const title = item.querySelector(".queue-item-title");
  item.style["-webkit-mask-position"] = "100%";
  setTimeout(() => {
    title.style.transform = `translateX(${forward ? vector : 0}px)`;
    setTimeout(() => {
      console.log("show");
      item.style["-webkit-mask-position"] = `${forward ? "initial" : "100%"}`;
    }, transitionLength - 250);
    setTimeout(() => {
      console.log("show");
      item.style["-webkit-mask-position"] = `${!forward ? "initial" : "100%"}`;
    }, transitionLength + 3750);
    setTimeout(
      () => createTimeout(item, delay, transitionLength, vector, !forward),
      transitionLength + 4000
    );
  }, delay);
}
