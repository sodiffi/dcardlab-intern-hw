import React from 'react';


export default class Home extends React.Component {

  componentDidMount() {
    setTimeout(function(){
      window.location+="#/user/sodiffi"
  },3000);
  }
  render() {
    return (<div >see me </div>)
  }
}
