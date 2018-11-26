function fetchPhotos(url) {
    return fetch(url)
        .then((response) => {
            return response.json();
        });
}

function setup() {
    fetchPhotos("/photos")
        .then((photos) => {
            handleSearchForm(photos);
            render(photos);
            showLikedPhotos(photos);
            zoomPhoto(photos[0]);
        });
}

function removeFullPhoto() {
    const $full = document.querySelector(".zoomed");
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
    const $zoomed = document.createElement("div");
    $zoomed.classList.add("zoomed");
    $bigImage.classList.add("full");
    $bigImage.setAttribute("src", src.image);
    $gallery.appendChild($zoomed);
    $zoomed.appendChild($bigImage);
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

    const $form = document.createElement("form");
    const $input = document.createElement("input");
    const $button = document.createElement("button");
    const $area = document.querySelector(".app");
    const $search = document.createElement("div");
    $search.classList.add("search");
    const $alert = document.createElement("p");
    $alert.classList.add("alert");
    $alert.innerText = "Matches not found";
    $area.appendChild($search);
    $search.appendChild($form);
    $form.appendChild($input);
    $button.innerText = "Search";
    $button.classList.add("search_button");
    $form.appendChild($button);

    $button.addEventListener("click", (e) => {
        e.preventDefault();
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
<h2 class="details_author">${src.author}</h2> 
<p class="details_title">"${src.title}"</p> 
<p class="details_tags">${src.tags.map(e => `#${e}`).join(", ")}<p>
<p class="like">&hearts; <p>
`;
    const $zoomed = document.querySelector(".zoomed");
    const $container = document.createElement("div");
    $container.classList.add("details");
    $container.innerHTML = template;
    $zoomed.appendChild($container);
}

function render(photos) {
    removeGallery();
    removeFullPhoto(photos[0]);
    removeAlert();

    const $area = document.querySelector(".app");
    const $gallery = document.createElement("div");
    const $list = document.createElement("ul");
    $list.classList.add("list");
    $area.appendChild($gallery);
    $gallery.classList.add("gallery");
    $gallery.appendChild($list);
    photos.forEach((photo) => {
        const $image = document.createElement("img");
        const $listElement = document.createElement("li");
        $listElement.classList.add("list_element");
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

        console.log(isFavorite);

        fetch(`/photos/${photos.id}`, { // pobieram zdjęcie o konkretnym id
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({isFavorite})
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
        console.log(likedPhotos);
        render(likedPhotos);
    })

}

document.addEventListener("DOMContentLoaded", setup);
