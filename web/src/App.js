import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import {Row, Col} from 'react-flexbox-grid';

class App extends Component {
    constructor(props) {
        super(props)

        this.state = {
            input_image : "", 
            output_image : "",
            intensity: 50
        }
    }
    fetch  = () => {
       //axios.get('http://178.62.52.134:5000')
	axios.get('/')
            .then(function (res) {
                console.log(res)
            })
            .catch(function (err) {
                console.log(err)
            })
    }   

    display_original = () => {
        var self = this;
        var selected_image= document.getElementById('input').files[0];

        var reader  = new FileReader();
        reader.onload = function(e)  {
            var image = document.createElement("img");
            image.src = e.target.result;
            self.setState({
                input_image : image.src
            })
         }
         reader.readAsDataURL(selected_image);
    }

    handle_intensity_change = () => {
        var slider = document.getElementById("intensity");
        this.setState({
            intensity : slider.value
        })
        console.log(this.state.intensity);
    }

    post = () => {
        var self = this;
        if (this.state.input_image != "") {
        var selected_image= document.getElementById('input').files[0];
        var form_data = new FormData();
        form_data.append("image", selected_image)
        form_data.append("intensity", this.state.intensity)
        //axios.post('http://178.62.52.134:5000/new_image', form_data, {
        axios.post('/new_image', form_data, {
            headers : {
                'Content-type' : "multipart/form-data"
            }
            })
            .then(function (res) {
                var image = new Image();
                image.src = 'data:image/png;base64,'+res.data;
                self.setState({output_image : image.src})
            })
            .catch(function (err) {
                console.log(err)
            })
        } else {
            console.log("No image")
        }
    }
    render() {
        var header_style = {
            textAlign: "center"
        }
        return (
            <Row>
                <Col md lg />
                <Col md lg>
                        <h1 style={header_style}>Blurrify</h1>
                        <Row>
                            <div style={{margin: "auto"}}>
                            <label style={{margin:"auto"}}>
                                  <input style={{margin:"auto"}} onChange={this.display_original} type="file" id="input" />
                            </label>
                                <div style={{width: "100%", maxWidth: "100%"}}>
                                    <img id="input_img" style={{position : "relative", display: "flex", maxWidth: "100%", maxHeight: "100%", textAlign: "center"}}src={this.state.input_image} alt="No input yet" />
                                </div>
                            </div>
                        </Row>
                        <Row>
                            <div style={{margin: "auto"}}>
                                <div>
                                    <h3>Specify intensity</h3>
                                    <input min="0" max="100" onChange={this.handle_intensity_change} step="1"type="range" id="intensity"></input>
                                </div>
                                <button style={{width: "150px"}}onClick={this.post}>Post</button>
                                <div>
                                    <img id="output_img" style={{maxWidth: "100%", maxHeight: "100%"}} src={this.state.output_image} alt="No output yet" />
                                </div>
                            </div>
                        </Row>
                </Col>
                <Col md lg />
            </Row>
        );
    }
}

export default App;
