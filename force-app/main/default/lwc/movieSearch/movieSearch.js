// Importing the base LightningElement class from LWC framework
import { LightningElement , wire } from 'lwc';
// Import message service features required for publishing and the message channel
import { publish, MessageContext } from 'lightning/messageService';
// Delay time in milliseconds for debouncing (prevents unnecessary API calls)
import MOVIE_CHANNEL from '@salesforce/messageChannel/movieChannel__c';
const DELAY = 300;

// Exporting the MovieSearch component as a child of LightningElement
export default class MovieSearch extends LightningElement {
    
    // Variables to store selected values and API results
    SelectedValue = '';  // Stores selected movie type (movie, series, episode)
    loading = false;  // Indicates if data is loading (used for UI feedback)
    SelectedPageNo = 1;  // Stores the selected page number (default is 1)
    delayTimeout;  // Stores timeout reference for debouncing API calls
    search = '';  // Stores the user-inputted movie name
    searchResult = [];  // Stores the list of movies returned by API
    selectedMovie = '';  // Stores the ID of the selected movie
    @wire(MessageContext)
    messageContext;  // Injects the message context for publishing messages
    // Getter function returning available options for movie type dropdown
    get options() {
        return [
            { label: 'None', value: '' },  // Default empty selection
            { label: 'Movie', value: 'movie' },  // Movie type
            { label: 'Series', value: 'series' },  // TV Series type
            { label: 'Episode', value: 'episode' },  // TV Episode type
        ];
    }

    // Handles input changes (for search, type selection, and page number)
    handleChange(event) {
        let { name, value } = event.target;  // Extracts input field name and value
        this.loading = true;  // Sets loading state to true

        // Updates corresponding variable based on the input field name
        if (name === 'type') {
            this.SelectedValue = value;
        } else if (name === 'search') {
            this.search = value;
        } else if (name === 'pageno') {
            this.SelectedPageNo = value;
        }

        // Debouncing: Clears previous timeout and sets a new one
        clearTimeout(this.delayTimeout);
        setTimeout(() => {
            this.searchMovie();  // Calls the search function after delay
        }, DELAY);
    }

    // Fetches movie data from OMDB API
    async searchMovie() {
        const URL = `https://www.omdbapi.com/?s=${this.search}&page=${this.SelectedPageNo}&type=${this.SelectedValue}&apikey=4864dde2`;

        // Makes an API request to fetch movie data
        const res = await fetch(URL);
        const data = await res.json();
        this.loading = false;  // Sets loading state to false after fetching data

        // If API response is successful, store search results
        if (data.Response === 'True') {
            this.searchResult = data.Search;
        }
    }

    // Getter function to determine if search results should be displayed
    get displaySearchResult() {
        return this.searchResult.length > 0;  // Returns true if there are results
    }

    // Handles movie selection event from the child component
    handleMovieSelection(event) {
        this.selectedMovie = event.detail;  // Stores the selected movie ID
        console.log('Selected Movie:', this.selectedMovie);  // Logs for debugging
        const payload = { movieId: this.selectedMovie };  // Creates payload for the event }; 

        publish(this.messageContext, MOVIE_CHANNEL, payload); 
    }
}
