"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

async function submitAndShowStory(evt){
  console.debug("submitAndShowStory");
  evt.preventDefault();

  const author = $("#author-input").val();
  const title = $("#title-input").val();
  const url = $("#url-input").val();
  const username = currentUser.username;
  const storyData = {title, url, author, username};

  const story = await storyList.addStory(currentUser, storyData);
  
  const $story = generateStoryMarkup(story); 
  $allStoriesList.prepend($story);

  $storyForm.slideUp("slow");
  $storyForm.trigger("reset");

    
}

$storyForm.on("submit", submitAndShowStory);

async function putFavoritesListOnPage(evt){
  //evt.preventDefault();
  hidePageComponents();

  console.debug('putFavoritesListOnPage');
  $favoritedStories.empty();

  if(currentUser.favorites.length === 0){
    $favoritedStories.append("<h5>No Favorites added</h5>");
  } else {
    for (let story of currentUser.favorites){
      const $story = generateStoryMarkup(story);
      $favoritedStories.append($story);
    }
  }
  $favoritedStories.show();
}

function putUserrStoriesOnPage(){
  console.debug("putUserStoriesOnPage");
  
  $ownStories.empty();
  if(currentUser.ownStories.length === 0){
    $ownStories.append("<h5>No stories added by User</h5>");
  } else {
    for(let story of currentUser.stories){
      let $story = generateStoryMarkup(story, true);
      $ownStories.append($story);
    }
  }
  $ownStories.show();
}
