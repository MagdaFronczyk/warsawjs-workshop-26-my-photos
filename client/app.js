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
            showLikedPhotos(photos);
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
    const $gallery = document.querySelector(".gallery");
    const $bigImage = document.createElement("img");
    $bigImage.classList.add("full");
    $bigImage.setAttribute("src", src.image);
    $gallery.appendChild($bigImage);
    printInfo(src);
    handleLike(src);
}

function removeGallery() {
    const $gallery = document.querySelector(".gallery");
    if ($gallery) {
        $gallery.remove();
    }
}

function removeAlert() {
    const $alert = document.querySelector(".alert");
    if ($alert) {
        $alert.remove();
    }
}

function handleSearchForm(src) {

    const $input = document.createElement("input");
    const $button = document.createElement("button");
    const $area = document.querySelector(".app");
    const $search = document.createElement("div");
    $search.classList.add("search");
    const $alert = document.createElement("p");
    $alert.classList.add("alert");

    $alert.innerText = "Matches not found";
    $area.appendChild($search);
    $search.appendChild($input);
    $button.setAttribute("type", "submit");
    $button.innerText = "Search";
    $search.appendChild($button);

    $button.addEventListener("click", () => {

        const value = $input.value.toLowerCase();
        const filteredPhotos = src.filter((el) => {
            const titleSearch = el.title.toLowerCase().match(value);
            const authorSearch = el.author.toLowerCase().match(value);
            const tagSearch = el.tags.includes(value);
            return titleSearch || authorSearch || tagSearch;
        });

        if (filteredPhotos.length) {
            render(filteredPhotos);
        } else {
            $search.appendChild($alert);
            removeGallery();
        }
    });
}

function printInfo(src) {
    removeDetails();
    const template = `
<div>
<h2>${src.author}</h2> 
<p>${src.title}</p> 
<p>${src.tags.map(e => `#${e}`).join(", ")}<p>
<p class="like">&hearts; <p>
</div>`;
    const $gallery = document.querySelector(".gallery");
    const $container = document.createElement("div");
    $container.classList.add("details");
    $container.innerHTML = template;
    $gallery.appendChild($container);
}

function render(photos) {
    removeGallery();
    removeFullPhoto(photos[0]);
    removeAlert();

    const $area = document.querySelector(".app");
    const $gallery = document.createElement("div");
    const $list = document.createElement("ul");
    $area.appendChild($gallery);
    $gallery.classList.add("gallery");
    $gallery.appendChild($list);
    photos.forEach((photo) => {
        console.log(photos);
        const $image = document.createElement("img");
        const $listElement = document.createElement("li");
        $image.setAttribute("src", photo.thumb);
        $image.addEventListener("click", () => {
            zoomPhoto(photo);
        });
        $list.appendChild($listElement);
        $listElement.appendChild($image);
    });
}

function handleLike(photos) {
    $like = document.querySelector(".like");

    $like.addEventListener("click", function () {
        this.classList.toggle("yes");

        const isFavorite = $like.classList.contains("yes"); //tworzymy zmienną isFavourite, która w zależności od tego czy element posiada klasę "yes" ma wartość true bądź false
        photos.isFavorite = isFavorite; // updatujemy obiekt i jeko klucz isFavorite o wartość true/false

        fetch(`/photos/${photos.id}`, { // pobieram zdjęcie o konkretnym id
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({isFavorite}) // co się dzieje tu?
        });

    });
}

function showLikedPhotos(photos) {
    const $likeButton = document.createElement("button");
    $likeButton.innerText = "Show favourite";
    const $search = document.querySelector(".search");
    $search.appendChild($likeButton);

    const likedPhotos = photos.filter(e => e.isFavorite);

    $likeButton.addEventListener("click", function () {
        render(likedPhotos);
    })

}

document.addEventListener("DOMContentLoaded", setup);
