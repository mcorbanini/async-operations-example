"use strict";

var React = require('react');
var request = require('superagent');
var Promise = require('bluebird');

function makeRequest() {
  return new Promise(function (resolve, reject) {
    request
      .get('/server')
      .timeout(5000)
      .end(function (err, res) {
        if(err) {
          return (err.timeout) ? reject({status: 'timeout'}) : reject({status: 'error'});
        }
        return resolve(res.body);
      });
  });
}

function startRequests(addResult) {
  var count = 0;
  var intervalId;

  setInterval(function() {
    var index = count;
    addResult(index, makeRequest());
    count += 1;
  }, 1000);
}

window.onload = function() {
  React.render(<App/>, document.getElementById('app'));
}

var Result = React.createClass({
  getInitialState: function() {
    return {
      status: undefined
    }
  },
  componentDidMount: function() {
    var self = this;
    this.props.data
      .then(this.setState.bind(this))
      .catch(this.setState.bind(this))
  },
  render: function() {
    return (
      <li className={(this.state.status) ? this.state.status : 'loading'}>
        { 'Request ' + this.props.index + ': ' + ((this.state.status) ? this.state.status : 'loading...') }
      </li>
    );
  }
});

var App = React.createClass({
  getInitialState: function() {
    return {
      results: [],
      started: false
    }
  },
  addResult: function(index, data) {
    var result = <Result index={index} data={data}/>
    this.setState({results: this.state.results.concat([result])});
  },
  handleClick: function() {
    if(!this.state.started) {
      this.setState({started: true});
      startRequests(this.addResult.bind(this));
    }
  },
  render: function() {
    return (
      <div>
        <button
          type="button"
          className="btn btn-default"
          disabled={ this.state.started }
          onClick={this.handleClick}>Start!
        </button>
        <ul> { this.state.results } </ul>
      </div>
    );
  }
})
