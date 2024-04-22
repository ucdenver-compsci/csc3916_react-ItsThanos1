import React, { Component } from 'react';
import { fetchMovie, createReview } from "../actions/movieActions";
import { connect } from 'react-redux';
import { Card, ListGroup, ListGroupItem, Form, Button } from 'react-bootstrap';
import { BsStarFill } from 'react-icons/bs';
import { Image } from 'react-bootstrap';

class MovieDetail extends Component {
  constructor(props) {
    super(props);
    this.handleInputChange=this.handleInputChange.bind(this)
    this.state = {
      review: {
        username: localStorage.getItem('username'),
        review: '',
        rating: 0
      }
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    if (this.props.selectedMovie == null) {
      dispatch(fetchMovie(this.props.movieId));
    }
  }

  

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState(prevState => ({
      review: {
        ...prevState.review,
        [name]: value
      }
    }));
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const { dispatch } = this.props;
    dispatch(createReview(this.props.movieId, this.state.review))
      .then(() => {
        // Reset the form fields
        this.setState({
          review: {
            username: localStorage.getItem('username'),
            review: '',
            rating: 0
          }
        }, () => {
          // Refresh the page after the form fields are reset
          window.location.reload();
        });
      });
  };

  render() {
    
      return (
        <Card>
          <Card.Header>Movie Detail</Card.Header>
          <Card.Body>
            <Image className="image" src={this.props.selectedMovie.imageUrl} thumbnail />
          </Card.Body>
          <ListGroup>
            <ListGroupItem>{this.props.selectedMovie.title}</ListGroupItem>
            <ListGroupItem>
              {this.props.selectedMovie.actors.map((actor, i) => (
                <p key={i}>
                  <b>{actor.actorName}</b> {actor.characterName}
                </p>
              ))}
            </ListGroupItem>
            <ListGroupItem>
              <h4>
                <BsStarFill /> {this.props.selectedMovie.avgRating}
              </h4>
            </ListGroupItem>
          </ListGroup>
          <Card.Body>
            {this.props.selectedMovie.movieReviews &&
              this.props.selectedMovie.movieReviews.map((review, i) => (
                <p key={i}>
                  <b>{review.username}</b>&nbsp; {review.review} &nbsp; <BsStarFill /> {review.rating}
                </p>
              ))}
          </Card.Body>
          <Card.Body>
            <Form onSubmit={this.handleSubmit}>
              <Form.Group controlId="reviewRating">
                <Form.Label>Rating</Form.Label>
                <Form.Control
                  as="select"
                  name="rating"
                  value={this.state.review.rating}
                  onChange={this.handleInputChange}
                >
                  <option value="0">Select Rating</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="reviewText">
                <Form.Label>Review</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="review"
                  value={this.state.review.review}
                  onChange={this.handleInputChange}
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit Review
              </Button>
            </Form>
          </Card.Body>
        </Card>
      )
    

   
  }
}

const mapStateToProps = (state) => {
  return {
    selectedMovie: state.movie.selectedMovie,
  };
};

export default connect(mapStateToProps)(MovieDetail);