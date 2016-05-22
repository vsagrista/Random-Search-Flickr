var React = require('react');
var ReactDOM = require('react-dom')
var _ = require('underscore-node');
var flickrUrl, openWeatherUrl;
var formHTML = function() {
  return (
    <form role="search">
       <label>Search on Flickr (E.g. New York Skyline)</label>
       <div className="form-group">
          <input name="city" id="city-name" type="text" className="form-control" placeholder="Search"/>
          <button id="city" onClick={this.onClick} type="submit" className="btn btn-success form-control">Submit</button>
       </div>
    </form>
  )
}
var spinnerHTML = function() {
  return (
    <div class="mini-loader-content">
    <h2>Loading...</h2>
      <svg id="mini-loader" xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 500.00001 500.00001">
        <g>
          <path id="b0" d="M66.734 66.734v366.533h366.532V66.734H66.734zm15 15h336.532v336.533H81.734V81.734z">
          </path>
          <path id="b2" d="M354.16 2.5v143.34H497.5V2.5H354.16zm10 10H487.5v123.34H364.16V12.5z">
          </path>
          <path id="b1" d="M0 2.5v143.34h143.34V2.5H0zm10 10h123.34v123.34H10V12.5z">
          </path>
          <path id="b3" d="M354.16 356.66V500H497.5V356.66H354.16zm10 10H487.5V490H364.16V366.66z">
          </path>
          <path id="b4" d="M0 356.66V500h143.34V356.66H0zm10 10h123.34V490H10V366.66z">
          </path>
        </g>
      </svg>
    </div>
  )
}
var imgLoadedHTML = function() {
  return (
    <div>
      <img src={getSampleFromArray(this.props.pictures.photo)} alt="The search was unsuccessful" className="text-center img-responsive"/>
      <button className="refresh-button btn btn-info" onClick={this.onClick} type="submit">New Search</button>
    </div>
  )
}

var weatherLoadedHTML = function() {
  return (
    <div className ='container weather-info-div' id="weather-info">
      <ul id="weather-ul"></ul>
    </div>
  )
}

var Spinner = React.createClass({
  render: function () {
    return spinnerHTML.bind(this)();
  }
})

var WeatherInfo = React.createClass({
  render: function () {
    return weatherLoadedHTML.bind(this)();
  }
})

var SearchForm = React.createClass({
  getInitialState: function() {
    return { showSearchBar: true };
  },
  onClick: function(e) {
    e.preventDefault();
    if (document.getElementById('city-name').value) {
      this.setState({ showSearchBar: false });
      flickrUrl = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=89d5a9ac35a66a4e8fd31d57704df3ce&format=json&nojsoncallback=1&text=' + document.getElementById('city-name').value + '&extras=url_o';
      openWeatherUrl = 'http://api.openweathermap.org/data/2.5/forecast?q=' + document.getElementById('city-name').value + ',us&mode=json&units=metric&appid=9cae732a3155322c8580b10d4f5deb29';
    }
  },
  render: function () {
    if( this.state.showSearchBar) return formHTML.bind(this)();
    return ( 
      <div className="conent-wrapper">
        <WeatherInfo />
        <RunSearch /> 
      </div>
            )
  }
})

var RunSearch = React.createClass({
	getInitialState: function () {
		return {search: 'loading...' };
	},
	componentDidMount: function () {
	  ajaxRequest.bind(this, flickrUrl, 'img')();
    return ajaxRequest.bind(this, openWeatherUrl, 'weather')();
	},
	render: function() {
    if (!this.state.search) return <div>Loading ...</div>;
    else {
    	var pictures = this.state.search.photos;
    	if (pictures !== undefined) {
    		return (
          <div className="conent-wrapper">
            <WeatherInfo />
            <DisplayPicture  pictures={pictures}  /> 
          </div>
          );
    	}
    return <Spinner />;
  	}
  }
})

var DisplayPicture = React.createClass({
  getInitialState: function() {
    return { showSearchBar: false };
  },
  onClick: function(e) {
    e.preventDefault()
    this.setState({ showSearchBar: true });
  },
  render: function () {
    var url = getSampleFromArray(this.props.pictures.photo)
    if( !this.state.showSearchBar) return imgLoadedHTML.bind(this)();// weatherLoadedHTML.bind(this)();
    $('li').empty();
    return (
      <SearchForm />
    )
  }
})

var ajaxRequest = function(url, option) {
  $.ajax({
        url: url,
        processData: false,
        success: function(data) {
          if(option === 'img') this.setState({search: data});
          if(option === 'weather') getWeatherInfo(data);
      }.bind(this),
        error: function(xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
}

function getSampleFromArray(array) {
  var url = _.sample(array).url_o
  if (url !== undefined) return url
  return getSampleFromArray(array);
}

function getWeatherInfo(response) {
  var infoAtNoon = response.list.filter(function(obj){ return obj['dt_txt'].indexOf('12:00') > -1 });
  weatherEachDay(infoAtNoon);
  temperatureEachDay(infoAtNoon);
}

function weatherEachDay(infoAtNoon) {
  var weatherNextFiveDays = infoAtNoon.filter(function(obj){return obj['weather'][0].description});
  weatherNextFiveDays.forEach(function(obj) {
     $('#weather-ul').append('<li>'+obj['weather'][0].description+'</li>');
  })
}

function temperatureEachDay(infoAtNoon) {
  infoAtNoon.forEach(function(obj) {
    // do something in the DOM
  })
}

ReactDOM.render(
	<SearchForm />,
	document.getElementById('app')
)
