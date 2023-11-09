const queueItems = [...document.querySelectorAll(".queue-item")];
const itemsWithTitles = queueItems.map((item) => {
  title = item.querySelector(".queue-item-title");
  return { item, title };
});

const additionalMargin = 10;

const filteredItemsWithTitles = itemsWithTitles.filter(({ item, title }) => {
  //dodac tu jakis padding jaki bedzie potem
  return (
    title.getBoundingClientRect().right -
      item.getBoundingClientRect().right -
      10 >
    0
  );
});

filteredItemsWithTitles.forEach(({ item, title }) => {
  const diff = Math.ceil(
    title.getBoundingClientRect().right -
      item.getBoundingClientRect().right +
      additionalMargin
  );
  const transitionLength = diff / 20;
  title.style.transition = `transform ${transitionLength}s linear`;
  createTimeout(item, 0, transitionLength * 1000, -diff, true);
});

function createTimeout(item, delay, transitionLength, vector, forward) {
  console.log("helo", item);
  const title = item.querySelector(".queue-item-title");
  setTimeout(() => {
    title.style.transform = `translateX(${forward ? vector : 0}px)`;
    setTimeout(
      () => createTimeout(item, delay, transitionLength, vector, !forward),
      transitionLength + 4000
    );
  }, delay);
}
