import axios from "axios"
import * as $ from 'jquery';

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
const $searchFormTerm = $("#searchForm-term");
const $episodesBtn = $(".Show-getEpisodes");
const BASE_URL = "http://api.tvmaze.com"


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term:string) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  let resp = await axios.get(`${BASE_URL}/search/shows?q=${term}`)

  let arrayOfShows = resp.data

  return arrayOfShows;
}

/** Given list of shows, create markup for each and to DOM */

function populateShows(shows: Array<any>) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
        `<div data-show-id="${show.show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src=${show.show.image.medium || "https://tinyurl.com/tv-missing"}
              alt="${show.show.name}"
              class="w-25 mr-3">
           <div class="media-body">
             <h5 class="text-primary">${show.show.name}</h5>
             <div><small>${show.show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($show);  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $searchFormTerm.val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});




/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id:number) {
  let resp = await axios.get(`${BASE_URL}/shows/${id}/episodes`)

  let arrayOfEps = resp.data
  console.log(arrayOfEps)
  return arrayOfEps;
 }

/** Write a clear docstring for this function... */

function populateEpisodes(episodes: Array<any>) { 


  for (let episode of episodes) {

    const $ep = $(
      `<ul>
      <li>${episode.name}</li>
      <li>${episode.summary}</li>
      </ul>
      `);

    $episodesArea.append($ep);  }
}


$showsList.on("click", async function (evt) {

  $episodesArea.css("display", "block")
  let show = evt.target.parentElement.parentElement.parentElement
  let showId = show.getAttribute("data-show-id")
  let eps = await getEpisodesOfShow(parseInt(showId));
  populateEpisodes(eps)
})
