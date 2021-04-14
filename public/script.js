window.addEventListener("load", initSite());

//Initial start-up
function initSite() {
  getAllCharacter();
  getSearchTools();
}

// Gets all characters and renders them to the DOM
async function getAllCharacter() {
  const allChars = await fetchRequest("/api/characters/", "GET");
  //render all chars
  for (let i = 0; i < allChars.length; i++) {
    renderCharacters(allChars[i]);
  }
  renderAddNewCard();
}

// Function for render and layout
function renderCharacters(characters) {
  const wrapper = document.getElementById("gridWrapper");
  const cardWrapper = document.createElement("li");
  cardWrapper.classList.add("cardsItem");
  const card = document.createElement("div");
  card.classList.add("card");
  const cardContent = document.createElement("div");
  cardContent.classList.add("cardContent");

  //image
  const imgTag = document.createElement("img");
  imgTag.src = characters.img;
  imgTag.classList.add("cardImage");

  //title / name
  const nameTag = document.createElement("h2");
  nameTag.innerHTML = characters.name;
  nameTag.classList.add("cardTitle");

  //rank
  const rankTag = document.createElement("p");
  rankTag.innerHTML = characters.rank;
  rankTag.classList.add("cardText");

  //btn
  const btn = document.createElement("button");
  btn.innerHTML = "Edit Character";
  btn.classList.add("editBtn");
  btn.addEventListener("click", () => {
    setEditModalContent(characters);
    handleModal();
  });

  card.append(imgTag);
  cardContent.append(nameTag);
  cardContent.append(rankTag);
  cardContent.append(btn);
  card.append(cardContent);

  cardWrapper.append(card);
  wrapper.append(cardWrapper);
}

//modal handler
function handleModal() {
  const modal = document.getElementById("myModal");
  const modalWrapper = document.getElementById("modalWrapper");

  modal.style.display = "block";

  const span = document.getElementsByClassName("close")[0];
  span.addEventListener("click", () => {
    modal.style.display = "none";
    modalWrapper.innerHTML = "";
  });
  window.addEventListener("click", (event) => {
    if (event.target == modal) {
      modal.style.display = "none";
      modalWrapper.innerHTML = "";
    }
  });
}

/**
 * Sets the modal to edit existing character in the DB
 * @param {string} character which character to update
 */
function setEditModalContent(character) {
  const modalWrapper = document.getElementById("modalWrapper");
  const modalForm = document.createElement("form");
  modalForm.classList.add("modalWrapperForm");

  //name input and lable
  const nameLable = document.createElement("h4");
  nameLable.innerHTML = "Name of character:";
  const name = document.createElement("input");
  name.value = character.name;

  //rank input and lable
  const rankLable = document.createElement("h4");
  rankLable.innerHTML = "Rank of character:";
  const rank = document.createElement("input");
  rank.value = character.rank;

  //image input and lable
  const imgLable = document.createElement("h4");
  imgLable.innerHTML = "Image of character (Link):";
  const img = document.createElement("input");
  img.value = character.img;

  const btnDiv = document.createElement("div");
  // save button
  const saveBtn = document.createElement("button");
  saveBtn.classList.add("btn", "saveBtn");
  saveBtn.innerHTML = "Save";
  saveBtn.addEventListener("click", () => {
    updateCharacter(character.id, name.value, rank.value, img.value);
    window.location.reload();
  });

  // delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("btn", "deleteBtn");
  deleteBtn.innerHTML = "Delete";
  deleteBtn.addEventListener("click", () => {
    deleteCharacter(character.id);
    window.location.reload();
  });

  modalForm.append(nameLable);
  modalForm.append(name);
  modalForm.append(rankLable);
  modalForm.append(rank);
  modalForm.append(imgLable);
  modalForm.append(img);
  modalWrapper.append(modalForm);
  modalWrapper.append(btnDiv);
  btnDiv.append(saveBtn);
  btnDiv.append(deleteBtn);
}

//search function
function getSearchTools() {
  const searchField = document.getElementById("searchField");
  let value = null;
  searchField.addEventListener("change", () => {
    value = searchField.value;
    value.replace(/ /, "&")
  });
  const searchBtn = document.getElementById("searchBtn");
  searchBtn.addEventListener("click", () => {
    console.log(value);
    searchCharacter(value);
  });
}
async function searchCharacter(value) {
  const filteredCharacter = await fetchRequest(
    `/api/filtered-characters/${value}`,
    "GET"
  );
  if (filteredCharacter) {
    setEditModalContent(filteredCharacter);
    handleModal();
  }
}

/**
 * Sends update request to server, with information from EditModal
 * @param {string} id id of the character to update
 * @param {string} name updated name
 * @param {string} rank updated rank
 * @param {string} img updated image
 */
function updateCharacter(id, name, rank, img) {
  const body = {
    name: name,
    rank: rank,
    img: img,
  };
  fetchRequest(`/api/characters/${id}`, "PUT", body);
}

/**
 *
 * @param {string} id id of character to delete
 */
function deleteCharacter(id) {
  fetchRequest(`/api/characters/${id}`, "DELETE");
}

// renders the add new character icon to DOM
function renderAddNewCard() {
  const wrapper = document.getElementById("gridWrapper");
  const cardWrapper = document.createElement("li");
  cardWrapper.classList.add("newCharacter");

  const imgTag = document.createElement("img");
  imgTag.src = "./assets/addNew.png";
  imgTag.classList.add("addNewImg");
  imgTag.addEventListener("click", () => {
    handleModal();
    setNewCharModalContent();
  });

  cardWrapper.append(imgTag);
  wrapper.append(cardWrapper);
}

//sets the modal to create a new character and push to db on Save
function setNewCharModalContent() {
  const modalWrapper = document.getElementById("modalWrapper");
  const modalForm = document.createElement("form");
  modalForm.classList.add("modalWrapperForm");

  const nameLable = document.createElement("h4");
  nameLable.innerHTML = "Name of character";
  const name = document.createElement("input");
  const rankLable = document.createElement("h4");
  rankLable.innerHTML = "Rank of character";
  const rank = document.createElement("input");
  const imgLable = document.createElement("h4");
  imgLable.innerHTML = "Image of character (Link):";
  const img = document.createElement("input");

  const saveBtn = document.createElement("button");
  saveBtn.classList.add("btn", "saveBtn");
  saveBtn.innerHTML = "Save";
  saveBtn.addEventListener("click", () => {
    saveNewCharacter(name.value, rank.value, img.value);
    window.location.reload();
  });

  modalForm.append(nameLable);
  modalForm.append(name);
  modalForm.append(rankLable);
  modalForm.append(rank);
  modalForm.append(imgLable);
  modalForm.append(img);
  modalWrapper.append(modalForm);
  modalWrapper.append(saveBtn);
}

/**
 *
 * @param {string} name name of new char
 * @param {string} rank rank of new char
 * @param {string} img image of new char
 */
async function saveNewCharacter(name, rank, img) {
  const body = {
    id: null,
    name: name,
    rank: rank,
    img: img,
  };

  await fetchRequest("/api/characters", "POST", body);
}

/**
 * Main fetch function, can be used for full crum
 * @param {string} url endpoint url
 * @param {string} method method for server call (GET POST PUT DELETE)
 * @param {} body body to send as req
 * @returns returns respons from server
 */
async function fetchRequest(url, method, body) {
  const response = await fetch(url, {
    method: method,
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });

  const content = await response.json();
  return content;
}
