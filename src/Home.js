import React from 'react';
import { Link } from "react-router-dom";
import { json, checkStatus } from './utils';

let storage = {};
console.log('storage:',storage);

const Movie = (props) => {
  const {
    Title,
    Year,
    imdbID,
    Type,
    Poster,
  } = props.movie;

    return (
      <div className="row">
        <div className="col-4 col-md-2 col-lg-1 mb-3">
          <Link to={`/movie/${imdbID}/`}>
            <img src={Poster} className="img-fluid" />
          </Link>
        </div>
        <div className="col-8 col-md-10 col-lg-11 mb-3">
          <Link to={`/movie/${imdbID}/`}>
            <h4>{Title}</h4>
            <p>{Type} | {Year}</p>
          </Link>
        </div>
      </div>
    )
}

class MovieFinder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
      results: [],
      error: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    let { searchTerm } = this.state;
    searchTerm = searchTerm.trim();
    if (!searchTerm) {
      return;
    }

    fetch(`https://www.omdbapi.com/?s=${searchTerm}&apikey=dbe3adf3`)
      .then(checkStatus)
      .then(json)
      .then((data) => {
        if (data.Response === 'False') {
          throw new Error(data.Error);
        }
        if (data.Response === 'True' && data.Search) {
          this.setState({ results: data.Search, error: '' });
          storage = data;
        }
      })
      .catch((error) => {
        this.setState({ error: error.message });
        console.log(error);
      })
  }

  render() {
    const { searchTerm, results, error } = this.state;
    return (
      <div className="container">
        <div className="row">
          <div className="col-12">
            <form onSubmit={this.handleSubmit}>
                <div className="row mb-4">
                  <input
                  type="text"
                  style={{width:300}}
                  className="col-3 m-2 form-control mr-sm-2"
                  placeholder="Movie"
                  value={searchTerm}
                  onChange={this.handleChange}
                  />
                  <button type="submit" className="col-1 m-2 btn btn-primary">Submit</button>
                </div>
            </form>
            {(() => {
              if (error) {
                return error;
              }
              if (Object.keys(storage).length === 0) {
                return results.map((movie) => {
                  return <Movie key={movie.imdbID} movie={movie} />;
                })
              }
              else {
                return storage.Search.map((movie) => {
                  return <Movie key={movie.imdbID} movie={movie} />;
                })
              }
            })()}
          </div>
        </div>
      </div>
    )
  }
}

export default MovieFinder;