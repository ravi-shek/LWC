import { LightningElement, wire } from "lwc";
// Import message service features required for subscribing and the message channel
import {
    subscribe,
    unsubscribe,
    APPLICATION_SCOPE,
    MessageContext,
} from "lightning/messageService";
import MOVIE_CHANNEL from "@salesforce/messageChannel/movieChannel__c";

export default class MovieDetail extends LightningElement {
    subscription = null; // Holds the subscription reference
    loadComponent = false; // Indicates if the component is loaded
    moviedetail = {}; // Holds the movie detail data
    // Injects the message context for subscribing to messages
    // This is necessary for the Lightning Message Service to work
    // It allows the component to receive messages from other components
    // that are published to the same message channel
    @wire(MessageContext)
    messageContext;

    // Lifecycle hook to subscribe when component loads
    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    // Lifecycle hook to unsubscribe when component is removed from DOM
    disconnectedCallback() {
        this.unsubscribeToMessageChannel();
    }

    // Subscribe to the message channel
    subscribeToMessageChannel() {
        if (!this.subscription) {
            this.subscription = subscribe(
                this.messageContext,
                MOVIE_CHANNEL, // ✅ Corrected variable name
                (message) => this.handleMessage(message),
                { scope: APPLICATION_SCOPE }
            );
        }
    }

    // Handler for received message
    handleMessage(message) {
        let movieId = message.movieId;
        console.log("Movie ID received:", movieId);
        this.fetchMovieDetail(movieId); // Call the function to fetch movie details
        // Logic to handle the received movie ID
    }

    // Unsubscribe safely
    unsubscribeToMessageChannel() {
        if (this.subscription) { // ✅ Prevents errors
            unsubscribe(this.subscription);
            this.subscription = null;
        }
    }

    async fetchMovieDetail(movieId) {
        const url = `https://www.omdbapi.com/?i=${movieId}&plot=full&apikey=4864dde2`;
        const res = await fetch(url);
        const data = await res.json();
        console.log("Movie Detail Data:", data);
        this.loadComponent = true; 
        this.moviedetail = data ;// Set to true after fetching data    
        // Logic to handle the fetched movie detail data
   }


}
