import './App.css';
import TinderCard from 'react-tinder-card';
import axios from 'axios';
import React, { Component } from 'react';
import { v4 as uuid } from 'uuid';

class App extends Component {
  constructor() {
    super();

    this.state = {
      data: [],
      session_id: uuid(),
      liked: false,
    };
    this.handleClick = this.handleClick.bind(this);
    this.showDetails = this.showDetails.bind(this);
  }

  async onSwipe(direction, listingId, sessionId) {
    this.setState({
      liked: false,
    });

    if (direction === 'left') {
      await axios.delete(`http://localhost:9000/listings/delete/${listingId}`);
    } else {
      await axios.post('http://localhost:9000/listings/recordSwipe', {
        id: listingId,
        session_id: sessionId,
        direction,
      });
    }
  }

  async handleClick(listingId) {
    this.setState({
      liked: !this.state.liked,
    });

    await axios.post('http://localhost:9000/listings/updateLike', {
      id: listingId,
    });
  }

  showDetails(listing) {
    alert(
      `Name: ${listing.name}\n Description : ${listing.description}`
    );
  }

  async componentWillMount() {
    const response = await axios.get(`http://localhost:9000/listings`).catch((e) => console.error(e));
    const json = await response.data;
    this.setState({ data: json });
     console.log(json);
  }

  render() {
    const likeButtonLabel = this.state.liked ? '❤' : 'Like';

    return (
      <div className="app">
        <div>
          <h1>Cool 😒</h1>
          <h2>Ain't it Cool?</h2>

          <div className="card-container">
            {this.state.data.map((listing) => (
              <TinderCard
                className="swipe"
                key={listing.name}
                onSwipe={(dir) => this.onSwipe(dir, listing._id)}
              >
                <div
                  style={{
                    backgroundImage: 'url(' + listing.images.picture_url + ')',
                  }}
                  className="card"
                >
                  <div className="card-details">
                    <h3>{listing.name}</h3>
                    <div className="card-actions">
                      <button
                        className="button"
                        onClick={() => this.handleClick(listing._id)}
                      >
                        {likeButtonLabel}
                      </button>
                      <button
                        className="button"
                        onClick={() => this.showDetails(listing)}
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              </TinderCard>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
