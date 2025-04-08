import { LightningElement, api } from "lwc";

export default class MovieTile extends LightningElement {
    // Declaring public properties received from parent component
    @api movie; // The movie object (contains details like title, poster, etc.)
    @api selectedMovieId; // ID of the currently selected movie

    // Event handler for when a movie tile is clicked
    handleClick() {
        // Dispatches a custom event 'movieselected' to notify the parent component
        this.dispatchEvent(new CustomEvent("movieselected", { 
            detail: this.movie.imdbID // Sends the selected movie's ID
        }));
    }

    // Computes the CSS class for the movie tile dynamically
    get tileClass() {
        return `innerTile ${this.selectedMovieId === this.movie.imdbID ? "movieTileSelected" : ""}`;
        // Adds 'movieTileSelected' class only if this tile's movie is selected
    }
}
