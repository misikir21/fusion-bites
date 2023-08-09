import getFoodItems from './getItems.js';
import { FOOD_BASE_URL } from './api.js';
import { getLikes, saveLikes } from './likesFunctions.js';

// Fetch data from the API and display the item list
getFoodItems()
  .then((data) => {
    renderItemList(data.meals);
  })
  .catch((error) => {
    console.error('Error fetching data:', error);
  });

async function updateLikes(likeCountElement, itemId) {
  const likesData = await getLikes();
  const likeCount = likesData.filter((like) => like.item_id === itemId).length;
  likeCountElement.textContent = likeCount;
}

async function renderItemList(items) {
  const itemListElement = document.getElementById('item-list');

  items.forEach(async (item) => {
    const itemElement = document.createElement('div');
    itemElement.className = 'item';

    const itemId = document.createElement('div');
    itemId.className = 'item-id';
    itemId.dataset.itemId = item.idMeal;
    itemId.textContent = item.strMeal;

    const likeButton = document.createElement('i');
    likeButton.className = 'like-icon fa-solid fa-thin fa-thumbs-up';

    const likeCountElement = document.createElement('div');
    likeCountElement.className = 'like-count';

    const innerImage = document.createElement('img');
    innerImage.className = 'item-image';
    innerImage.src = item.strMealThumb;

    itemElement.appendChild(innerImage);
    itemElement.appendChild(itemId);
    itemElement.appendChild(likeButton);
    itemElement.appendChild(likeCountElement);
    itemListElement.appendChild(itemElement);

    likeButton.addEventListener('click', async () => {
      if (!likeButton.classList.contains('liked')) {
        await saveLikes(item.idMeal);
        likeButton.classList.add('liked');
        updateLikes(likeCountElement, item.idMeal);
      }
    });

    updateLikes(likeCountElement, item.idMeal);
  });
}

async function initializeItemList() {
  try {
    const response = await fetch(FOOD_BASE_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch items with status: ${response.status}`);
    }
    const data = await response.json();
    renderItemList(data.meals);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

initializeItemList();
