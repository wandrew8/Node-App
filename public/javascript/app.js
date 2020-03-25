//DOM NODE VARIABLES
const formButton = document.querySelector('.formButton');
const addTagButton = document.getElementById('addTagButton');
const tagAnswers = document.querySelector('.tagAnswers');
const sampleImageHolder = document.querySelector('.imageSampleHolder');
const form = document.getElementById('addPhotoForm');
const formModal = document.querySelector(".formModal");
const closeModalButton = document.querySelector('.closeModal');
const photoContainer = document.querySelector('.photoContainer');
const searchBarButton = document.querySelector('.searchButton');
const searchQuery = document.querySelector('#searchTags');
const searchSubmit = document.querySelector('#submitSearch');
const errorContainer = document.querySelector('.errorContainer');
const searchForm = document.getElementById('searchForm');

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
function getPhotos(url, query, showModal) {
    fetch(url)
    .then(res => res.json())
    .then(data => {
        console.log(data)
        errorContainer.innerHTML = ``;
        if (data.length === 0) {
            errorContainer.classList.remove('hide');
            errorContainer.innerHTML = `<h2>Sorry, we couldn't find any photos for "${query}"</h2>`
            setTimeout(() => {
                errorContainer.classList.add('hide')
            }, 2000)
        } else {
            showPhotos(data, showModal);
        }
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
function showPhotos(data, showModal) {
    const container = document.querySelector('.photoContainer');
    let html;
    if (!showModal) {
    container.innerHTML = '';
        data.forEach(photo => {
            html = `
                <div class="photo" >
                    <img data-id="${photo._id}" class="image" width="200" height="200" src="${photo.imageUrl}">
                    <div class="category">
                        <p>${photo.category}</p>
                        <div class="likes"><p>${photo.likes}</p><i class="far fa-heart"></i></div>
                    </div>
                    <div class="author">
                        <img src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80"></img>
                        <p>${photo.author}</p>
                    </div>
                </div>
            `
            container.innerHTML += html;
        })
    } else {
        html = `
                <div class="singlePhoto" >
                <div class="closeSinglePhoto"><i class="far fa-times-circle"></i></div>
                    <div class="photo">
                        <img data-id="${data._id}" class="image" width="200" height="200" src="${data.imageUrl}">
                        <div class="category">
                            <p>${data.category}</p>
                            <div class="likes"><p>${data.likes}</p><i class="far fa-heart"></i></div>
                        </div>
                        <div class="author">
                            <img src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80"></img>
                            <p>${data.author}</p>
                        </div>
                    </div>
                </div>
            `
            container.innerHTML += html;
        //CLOSES SINGLE PHOTO MODAL
        const singlePhotoModal = document.querySelector('.closeSinglePhoto');
        singlePhotoModal.addEventListener('click', function(e) {
            const modal = singlePhotoModal.parentElement;
            modal.remove();
})
    }
    
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
    getPhotos('http://localhost:3000/photos', null, false);
}

//-----   EVENT LISTENERS   -----//

//LOADS PHOTOS ON PAGE LOAD
document.addEventListener('DOMContentLoaded', function () {
    getPhotos('http://localhost:3000/photos', null, false)});

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

//CLOSES ADD PHOTO MODAL
closeModalButton.addEventListener('click', function(e) {
    formModal.classList.remove('showModal')
});

//OPENS SINGLE PHOTO MODAL
photoContainer.addEventListener('click', function(e) {
    console.log(e.target)
    const id = e.target.dataset.id
    console.log(id)
    console.log(e.target.classList)
    if (e.target.classList.value === 'image') {
        getPhotos('http://localhost:3000/photos/' + id, null, true);
        console.log('success')
    }
});

//OPENS CLOSES SEARCHBAR 
const searchBar = document.querySelector('.searchbar');
searchBarButton.addEventListener('click', function() {
    const closeBar = document.querySelector('.closeBar');
    searchBar.classList.remove('hidden');
    closeBar.addEventListener('click', function() {
        searchBar.classList.add('hidden');
    })
    window.addEventListener('scroll', function(e) {
        if(window.scrollY > 200) {
            searchBar.classList.add('hidden');
        }
    })
});

//FORM SUBMIT TO SEARCH PHOTOS
searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const query = searchQuery.value.split(' ').join('&')
    if (searchQuery.value) {
        console.log(query)
        getPhotos('http://localhost:3000/photos/search/' + query, query, false);
        searchQuery.value = '';
        searchBar.classList.add('hidden');
    } else {
        console.log('Error')
        searchBar.classList.add('hidden');
    }
})


