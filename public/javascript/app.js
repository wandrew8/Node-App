document.addEventListener('DOMContentLoaded', getPhotos);

function getPhotos() {
    fetch('http://localhost:3000/photos')
    .then(res => res.json())
    .then(data => {
        console.log(data)
        postPhotos(data);
    })
    .catch(err => console.log(err))
}

function postPhotos(data) {
    const container = document.querySelector('.photoContainer');
    let html;
    data.forEach(photo => {
        html = `
            <div class="photo">
                <a href="${photo.imageUrl}" alt="${photo.tags[0] ? photo.tags[0] : ''}">
                <img class="image" width="200" height="200" src="${photo.imageUrl}">
                <div class="category">
                    <p>${photo.category}</p>
                    <i class="far fa-heart"></i>
                </div>
                <div class="author">
                    <img src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80"></img>
                    <p>${photo.author}</p>
                </div>
                <div class="tags">
                    ${photo.tags.forEach(tag => {
                        return `<small>${tag}</small>`
                    })}
                </div>
                </a>
            </div>
        `
        container.innerHTML += html;
    })
}