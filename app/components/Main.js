var React = require('react');
var ReactDOM = require('react-dom')

var flickrUrl = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=89d5a9ac35a66a4e8fd31d57704df3ce&format=json&nojsoncallback=1&text=barcelona skyline&extras=url_o'

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
    	if (this.state.cities.photos !== undefined) 
    		return (
			    <div>
			    {this.state.cities.photos.photo[0].url_o.toString()}
			    </div>
		  	)	
		  	return <div>Loading ...</div>;	  
    }   
  } 
})


ReactDOM.render(
  <CityPictures />,
  document.getElementById('app')
);