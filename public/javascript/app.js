const formButton = document.querySelector('.formButton');
const addTagButton = document.getElementById('addTagButton');
const tagAnswers = document.querySelector('.tagAnswers');

//CLOUDINARY PHOTO UPLOAD
const myWidget = cloudinary.createUploadWidget({
    cloudName: 'dcokaa0ia', 
    uploadPreset: 'pixelImages'}, (error, result) => { 
      if (!error && result && result.event === "success") { 
        console.log('Done! Here is the image info: ', result.info);
        
      }
    }
  )

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
                    <div class="likes"><p>${photo.likes}</p><i class="far fa-heart"></i></div>
                </div>
                <div class="author">
                    <img src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80"></img>
                    <p>${photo.author}</p>
                </div>
                </a>
            </div>
        `
        container.innerHTML += html;
    })
}

//EVENT LISTENERS
document.addEventListener('DOMContentLoaded', getPhotos);

formButton.addEventListener('click', function() {
    const formModal = document.querySelector(".formModal");
    formModal.classList.add('showModal');
});

addTagButton.addEventListener('click', function(e) {
    e.preventDefault();
    let value = document.querySelector("#tagInput");
    tagAnswers.innerHTML += `<p class="smallTag">${value.value} </p>`;
    value.value = ''; 
});

tagAnswers.addEventListener("click", function(e) {
    console.log(e)
    console.log(e.target)
    if (e.target.tagName === "P") {
        e.target.remove();
    }
});

document.getElementById("upload_widget").addEventListener("click", function(e){
    e.preventDefault();
    myWidget.open();
  }, false);


