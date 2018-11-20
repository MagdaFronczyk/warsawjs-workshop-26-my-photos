function fetchPhotos(url) {
    return fetch(url)
        .then((response) => {
            return response.json();
        });
}

function setup() {
    fetchPhotos("/photos")
        .then((photos) => {
            render(photos);
            handleSearchForm(photos);
            zoomPhoto(photos[0]);
        });
}

function removeFullPhoto() {
    const $full = document.querySelector(".full");
    if ($full) {
        $full.remove();
    }
}

function removeDetails() {
    const $details = document.querySelector(".details");
    if ($details) {
        $details.remove();
    }
}

function zoomPhoto(src) {
    removeFullPhoto();
    const $area = document.querySelector(".app");
    const $bigImage = document.createElement("img");
    $bigImage.classList.add("full");
    $bigImage.setAttribute("src", src.image);
    $area.appendChild($bigImage);
    printInfo(src);
}

function handleSearchForm(src) {
    const $input = document.createElement("input");
    const $button = document.createElement("button");
    const $area = document.querySelector(".app");
    $area.appendChild($input);
    $button.setAttribute("type", "submit");
    $button.innerText = "Search";
    $area.appendChild($button);
    $button.addEventListener("click", () => {
        const value = $input.value;
        const filteredPhotos = src.filter((el) => {
            return el.title.toLowerCase().match(value.toLowerCase());
        });
        console.log(filteredPhotos);
        render(filteredPhotos);
    });
}

function printInfo(src) {
    removeDetails();
    const template = `
<div>
<h2>${src.author}</h2> 
<p>${src.title}</p> 
<p>${src.tags.map(e => `#${e}`).join(", ")}<p> 
</div>`;
    const $area = document.querySelector(".app");
    const $container = document.createElement("div");
    $container.classList.add("details");
    $container.innerHTML = template;
    $area.appendChild($container);
}

function render(photos) {
    const $area = document.querySelector(".app");
    photos.forEach((photo) => {
        const $image = document.createElement("img");
        $image.setAttribute("src", photo.thumb);
        $image.addEventListener("click", () => {
            zoomPhoto(photo);
        });
        $area.appendChild($image);

    });
}

document.addEventListener("DOMContentLoaded", setup);
