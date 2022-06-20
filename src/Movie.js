import React from 'react';
import { checkStatus, json } from './utils';
import { useHistory } from "react-router-dom";


const BackButton = () => {
  let history = useHistory();
  return (
    <div className="pt-2 pb-2">
      <button className="btn btn-primary" onClick={() => history.goBack()}>Back 2 results</button>
    </div>
  );
};

class Movie extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      movie: null
    }
  }

  componentDidMount() {
    fetch(`https://www.omdbapi.com/?i=${this.props.match.params.id}&apikey=dbe3adf3`)
      .then(checkStatus)
      .then(json)
      .then((data) => {
        if (data.Response === 'False') {
          throw new Error(data.Error);
        }
        if (data.Response === 'True') {
          console.log(data);
          this.setState({ movie: data, error: '' });
        }
      })
      .catch((error) => {
        this.setState({ error: error.message })
        console.log(error);
      })
  }

  render() {
    if (!this.state.movie) {
      return null;
    }

    const {
      Title,
      Year,
      Plot,
      Director,
      imdbRating,
      Poster
    } = this.state.movie;

    return (
      <div className="container">
        <BackButton/>
        <div className="row">
          <div className="col-6">
            <h1>{Title}</h1>
            <ul className="list-unstyled">
              <li>
                <p>Year: {Year}</p>
              </li>
              <li>
                <p>Director: {Director}</p>
              </li>
              <li>
                <p>Plot: {Plot}</p>
              </li>
              <li>
                <p>imdbRating: {imdbRating} / 10</p>
              </li>
            </ul>
          </div>
          <div className="col-6">
            <img src={Poster} className="img-fluid" />
          </div>
        </div>
      </div>
    )
  }
}

export default Movie;