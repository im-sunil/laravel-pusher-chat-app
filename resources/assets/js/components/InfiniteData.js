import React, { Component } from 'react';
import "./InfiniteData.css";
class InfiniteData extends Component {
    constructor(props){
      super(props);
      this.state = {
        data: [], 
        requestSent: false
      };
    }

  componentDidMount() {
    window.addEventListener('scroll', ()=>this.handleOnScroll());
    this.initFakeData();
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', ()=>this.handleOnScroll());
  }

  initFakeData() {
    var data = this.createFakeData(this.state.data.length, 10);

    this.setState({data: data});
  }

  createFakeData (startKey, counter) {
    var i = 0;
    var data = [];
    for (i = 0; i < counter; i++) {
      var fakeData = (<div key={startKey+i} className="data-info">Fake Data {startKey+i}</div>);
      data.unshift(fakeData);
    }

    return data;
  }

  querySearchResult() {
    if (this.state.requestSent) {
      return;
    }

    // enumerate a slow query
    setTimeout(()=>{
      this.doQuery();
    }, 2000);

    this.setState({requestSent: true});
  }

  doQuery() {
    
    axios.get("#", { params: {  }
      })
      .then( (response) => {
          var fakeData = this.createFakeData(this.state.data.length, 10);
          var newData = this.state.data.concat(fakeData);
          this.setState({data: newData, requestSent: false});
        })
        .catch( (error) => {
           that.setState({requestSent: false});
        });
   /* $.ajax({
      url: "#",
      data: null,
      method: "GET",
      success(data, textStatus, jqXHR)  {
        var fakeData = that.createFakeData(that.data.length, 20);
        var newData = that.data.concat(fakeData);
        that.setState({data: newData, requestSent: false});
      } ,
      error(jqXHR, textStatus, errorThrown)  {
        that.setState({requestSent: false});
      } 
    });*/
  }  

  handleOnScroll() {
    // http://stackoverflow.com/questions/9439725/javascript-how-to-detect-if-browser-window-is-scrolled-to-bottom
    var scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
    var scrollHeight = (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight;
    var clientHeight = document.documentElement.clientHeight || window.innerHeight;
    var scrolledToBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight;

    if (scrolledToBottom) {
      this.querySearchResult();
    }
  }

  render() {
    return (
      <div>
        <div className="data-container">
          {this.state.data}
        </div>
        {(() => {
          if (this.state.requestSent) {
            return(
              <div className="data-loading">
                <i className="fa fa-refresh fa-spin"></i>
              </div>
            );
          } else {
            return(
              <div className="data-loading"></div>
            );
          }
        })()}
      </div>
    );
  }
}
export default InfiniteData