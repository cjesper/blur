import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

class App extends Component {

    fetch  = () => {
        axios.get('http://localhost:5000')
            .then(function (res) {
                console.log(res)
            })
            .catch(function (err) {
                console.log(err)
            })
    }   
    render() {
        this.fetch()

        var header_style = {
            textAlign: "center"
        }
        return (
            <h1 style={header_style}>hello</h1>
        );
    }
}

export default App;
