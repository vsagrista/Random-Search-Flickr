var React = require('react');
var ReactDOM = require('react-dom')

var flickrUrl = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=89d5a9ac35a66a4e8fd31d57704df3ce&format=json&nojsoncallback=1&text=barcelona skyline&extras=url_o'

var data = [
  {id: 1, author: "Pete Hunt", text: "This is one comment"},
  {id: 2, author: "Jordan Walke", text: "This is *another* comment"}
];

var CommentList = React.createClass({
  render: function() {
  	var commentNodes = this.props.data.map(function(comment){
  		return (
        <Comment author={comment.author} key={comment.id}>
          {comment.text}
        </Comment>
      );
  	})
    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});

var CommentForm = React.createClass({
  render: function() {
    return (
      <div className="commentForm">
        Hello, world! I am a CommentForm.
      </div>
    );
  }
});


var Comment = React.createClass({
  rawMarkup: function() {
    var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
    return { __html: rawMarkup };
  },
  render: function() {
    return (
      <div className="comment">
        <h2 className="commentAuthor">
          {this.props.author}
        </h2>
       <span dangerouslySetInnerHTML={this.rawMarkup()} />
      </div>
    );
  }
});


var CommentBox = React.createClass({
	loadCitiesFromServer: function() {
		console.log('triggerd')
    $.ajax({
      url: flickrUrl,
      processData: false,  
      success: function(data) {
        this.setState({data: data});
        //console.log('data: ', data)
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
		return {data: []};
	},
  componentDidMount: function() {
  	this.getInitialState();
  	this.loadCitiesFromServer();
  	console.log('data: ', data)
  },
  render: function() {
    return (
      <div className="container">
        <h1>Comments</h1>
        <CommentList data={this.props.data} />
        <CommentForm />
      </div>
    );
  }
});

ReactDOM.render(
  <CommentBox data={data} />,
  document.getElementById('app')
);