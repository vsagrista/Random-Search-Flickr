var React = require('react');
var ReactDOM = require('react-dom')
var _ = require('underscore-node');

var flickrUrl = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=89d5a9ac35a66a4e8fd31d57704df3ce&format=json&nojsoncallback=1&text=New York skyline&extras=url_o'

function getSample(array) {
	var url = _.sample(array).url_o
	if (url !== undefined) return url
	return getSample(array);
}

var RunSlideShow = React.createClass({
  getInitialState: function() {
    return { showSearchBar: false };
  },
  onClick: function(e) {
    e.preventDefault()
    this.setState({ showSearchBar: true });
  },
	render: function () {
		var url = getSample(this.props.pictures.photo)
		 if( !this.state.showSearchBar) return (
        <div>
  		    <img src={url} alt="Somewhere in Barcelona" className="text-center img-responsive"/>
          <button className="refresh-button" onClick={this.onClick} type="submit">x</button>
        </div>
	  )
    return (
      <SearchForm />
    )
	}
})

var Spinner = React.createClass({
	render: function () {
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
})

var SearchForm = React.createClass({
  getInitialState: function() {
    return { showSearchBar: true };
  },
  onClick: function(e) {
    e.preventDefault()
    this.setState({ showSearchBar: false });
  },
  render: function () {
    if( this.state.showSearchBar) return (
      <form role="search">
        <label>Pick a city</label>
        <div className="form-group">
          <input name="city" id="city-name" type="text" className="form-control" placeholder="Search"/>
          <button id="city" onClick={this.onClick} type="submit" className="btn btn-success form-control">Submit</button>
        </div>
      </form>
    )
      return (<CityPictures /> )
  }
})


var CityPictures = React.createClass({
	getInitialState: function () {
		return {cities: 'loading...' };
	},
	componentDidMount: function () {
	    $.ajax({
	      url: flickrUrl,
	      processData: false,
	      success: function(data) {
          this.setState({cities: data});
      }.bind(this),
	      error: function(xhr, status, err) {
	        console.error(this.props.url, status, err.toString());
	      }.bind(this)
	 		});
	},
	render: function() {
    if (!this.state.cities) return <div>Loading ...</div>;
    else {
    	var pictures = this.state.cities.photos;
    	if (pictures !== undefined) {
    		return (
    			<RunSlideShow  pictures={pictures}  />
    			)
    	}
    return <Spinner />;
  	}
  }
})

ReactDOM.render(
	<SearchForm />,
	document.getElementById('app')
)
