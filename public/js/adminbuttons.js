const buttons = [...document.getElementsByClassName('preset-header-button')]
const settingBox = [...document.getElementsByClassName('preset-quick-settings')]



console.log(buttons, document.getElementsByClassName('preset-header-button'))

buttons.forEach((element, i) => {
    element.addEventListener('click',(e) => {
        console.log(i)
        classes = settingBox[i].classList
        classes.toggle("visible")
    })
});

window.addEventListener('click', (e)=>{
    if(!(e.target.classList.contains('preset-quick-settings') ||
        e.target.parentNode.classList.contains('preset-quick-settings') 
    || e.target.classList.contains('preset-header-button'))){
        settingBox.forEach((element) => {
            element.classList.remove("visible")
        })
    }
})