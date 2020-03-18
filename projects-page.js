let iframe = document.getElementById('iframe-our-projects');

let link = document.querySelector('.projects-header-menu__link');
let container = document.getElementsByClassName('container-row');

let sources = ['rest-api/balloons.html','crud/build/index.html', 'landing-page/index.html'];

function changeIframe(index) {
    iframe.src = sources[index];
}
for(let i = 0; i < link.length; i++) {
    link[i].addEventListener('click', changeIframe(i))
}

