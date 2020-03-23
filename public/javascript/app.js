//DOM NODE VARIABLES
const formButton = document.querySelector('.formButton');
const addTagButton = document.getElementById('addTagButton');
const tagAnswers = document.querySelector('.tagAnswers');
const sampleImageHolder = document.querySelector('.imageSampleHolder');
const form = document.getElementById('addPhotoForm');
const formModal = document.querySelector(".formModal");

//OTHER VARIABLES
let imageToPost;

//CLOUDINARY PHOTO UPLOAD PRESETS
const myWidget = cloudinary.createUploadWidget({
    cloudName: 'dcokaa0ia', 
    uploadPreset: 'pixelImages'}, (error, result) => { 
      if (!error && result && result.event === "success") { 
        console.log('Done! Here is the image info: ', result.info);
        console.log(result.info.thumbnail_url)
        imageToPost = result.info.url;
        sampleImageHolder.innerHTML = `<img height="30" width="30" src="${result.info.thumbnail_url}">`;
      } 
    }
  )

//FETCH REQUESTS TO SERVER
function getPhotos() {
    fetch('http://localhost:3000/photos')
    .then(res => res.json())
    .then(data => {
        console.log(data)
        showPhotos(data);
    })
    .catch(err => console.log(err))
}

async function postPhoto(url = '', data = {}) {
    const response = await fetch(url, {
      method: 'POST', 
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin', 
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow', 
      referrerPolicy: 'no-referrer', // no-referrer, *client
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return await response.json(); // parses JSON response into native JavaScript objects
  }

//-----   FUNCTIONS   -----//
function showPhotos(data) {
    const container = document.querySelector('.photoContainer');
    let html;
    data.forEach(photo => {
        html = `
            <div class="photo">
                <a href="/photos/${photo._id}" alt="${photo.tags[0] ? photo.tags[0] : ''}">
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
};

function validateForm(e) {
    e.preventDefault();
    const tags = Array.from(document.querySelectorAll('.smallTag')).map(tag => tag.textContent);
    const author = document.querySelector('#author').value;
    const category = document.querySelector('#category').value;
    const photoObject = {
        category: category,
        author: author,
        tags: tags,
        imageUrl: imageToPost,
        likes: 0
    };
    console.log(photoObject)
    postPhoto('http://localhost:3000/photos', photoObject)
    .then(data => console.log(data))
    tagAnswers.innerHTML = '';
    sampleImageHolder.innerHTML = '';
    form.reset();
    formModal.classList.remove('showModal');
}

//-----   EVENT LISTENERS   -----//

//LOADS PHOTOS ON PAGE LOAD
document.addEventListener('DOMContentLoaded', getPhotos);

//SHOWS FORM MODAL
formButton.addEventListener('click', function() {
    formModal.classList.add('showModal');
});

//ADDS PHOTO TAGS
addTagButton.addEventListener('click', function(e) {
    e.preventDefault();
    let value = document.querySelector("#tagInput");
    tagAnswers.innerHTML += `<p class="smallTag">${value.value} </p>`;
    value.value = ''; 
});

//REMOVES PHOTO TAGS
tagAnswers.addEventListener("click", function(e) {
    console.log(e)
    console.log(e.target)
    if (e.target.tagName === "P") {
        e.target.remove();
    }
});

// OPENS CLOUDINARY WIDGET
document.getElementById("upload_widget").addEventListener("click", function(e){
    e.preventDefault();
    myWidget.open();
  }, false);

// FORM SUBMIT
form.addEventListener('submit', validateForm);
