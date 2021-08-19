let addToy = false;
const toysUrl = 'http://localhost:3000/toys';

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  const toyContainer = document.querySelector('div#toy-collection');
  // fetch toys
  function renderToy(id, name, image, likes) {
    const card = document.createElement('div');
    card.className = 'card';
    const h2 = document.createElement('h2');
    h2.textContent = name;
    card.appendChild(h2);
    const img = document.createElement('img');
    img.src = image;
    img.className = 'toy-avatar';
    card.appendChild(img);
    const p = document.createElement('p');
    p.textContent = parseInt(likes) + ' likes';
    card.appendChild(p);
    const button = document.createElement('button');
    button.setAttribute('id', id);
    button.className = 'like-btn';
    button.textContent = 'like';
    button.addEventListener('click', likeToy);
    card.appendChild(button);
    toyContainer.append(card);
  }
  fetch(toysUrl)
    .then(res => res.json())
    .then(toys => {
      toys.forEach(toy => renderToy(toy.id, toy.name, toy.image, toy.likes))
    })
    .catch(err => console.log(err));

  // like a toy
  function likeToy() {
    const toyId = this.id;
    fetch(toysUrl + `/${toyId}`)
      .then(res => res.json())
      .then(data => {
        let currentLikes = data.likes;
        updateToy(toyId, currentLikes);
      })
      .catch(err => console.log(err));
  }

  function updateToy(toyId, currentLikes) {
    const likeToyConfig = {
      method: 'PATCH',
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        likes: currentLikes + 1
      })
    }
    fetch(toysUrl + `/${toyId}`, likeToyConfig)
      .then(res => res.json())
      .then(updatedToy => {
        // UPDATE TOY ON DOM
        const parentCard = document.getElementById(toyId).parentElement;
        const p = parentCard.querySelector('p');
        p.textContent = `${updatedToy.likes} likes`;
      })
      .catch(err => console.log(err));
  }

  // add toy
  const form = document.querySelector('form.add-toy-form');

  form.addEventListener('submit', e => {
    const inputName = document.querySelector('input[name="name"]').value;
    const inputImg = document.querySelector('input[name="image"]').value;
    e.preventDefault();

    const newToyConfig = {
      method: 'POST',
      headers: {
        "Content-Type": 'application/json',
        Accept : 'application/json'
      },
      body: JSON.stringify({
        "name": inputName,
        "image": inputImg,
        "likes": 0
      })
    };
    fetch(toysUrl, newToyConfig)
      .then(res => res.json())
      .then(newToy => renderToy(newToy.id, newToy.name, newToy.image, newToy.likes))
      .catch(err => console.log(err));


    form.reset();
  })

});
