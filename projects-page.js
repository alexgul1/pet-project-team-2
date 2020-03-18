let iframe = document.getElementById('iframe-our-projects');

let link = document.querySelector('.projects-header-menu__link');
let container = document.getElementsByClassName('container-row');

console.log(container.offsetHeight)

let sources = ['rest-api/balloons.html','', 'landing-page/index.html'];

function changeIframe(index) {
    iframe.src = sources[index]
    console.log(iframe.src)
}
for(let i = 0; i < link.length; i++) {
    debugger
    link[i].addEventListener('click', changeIframe(i))
}

