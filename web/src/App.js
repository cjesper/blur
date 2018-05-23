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
       axios.get('http://blur-api.carlssonjesper.com/')
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
        console.log(selected_image)
        if (selected_image) {
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
        self.setState({
            output_image : ""
        })
        if (this.state.input_image != "") {
        var processing = document.getElementById('loading_img')
        processing.style.display="block";
        var selected_image= document.getElementById('input').files[0];
        var form_data = new FormData();
        form_data.append("image", selected_image)
        form_data.append("intensity", this.state.intensity)
        //axios.post('http://blur-api.carlssonjesper.com/new_image', form_data, {
        axios.post('http://localhost:5000/new_image', form_data, {
            headers : {
                'Content-type' : "multipart/form-data"
            }
            })
            .then(function (res) {
                var image = new Image();
                image.src = 'data:image/png;base64,'+res.data;
                self.setState({output_image : image.src})
                processing.style.display="none";
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
            textAlign: "center",
        }

        var caption_style = {
            zIndex : 10,
            color : "green",
            fontSize : "50px",
            position: "absolute",
            top: "110%",
            right : "50%"
        }
        return (
                <Col md lg xs>
                        <h1 style={header_style}>Blur</h1>
                        <Row>
                            <label style={{
                                margin : "auto", width : "85px",
                                fontSize : "20px", textAlign : "center",
                                verticalAlign : "middle", color: "white",
                                height : "85px", backgroundColor : "black",
                                borderRadius : "50%", lineHeight : "350%",
                                marginBottom : "10px"
                            }}>
                              <input style = {
                                    {display: "none"
                                }} onChange={this.display_original} type="file" id="input" />
                                <b>Choose!</b> 
                            </label>
                                <div style={{marginTop: "10px", width: "100%", height: "100%", maxWidth: "100%", minWidth: "100%", minHeight: "100%"}}>
                                    <img id="input_img" style={{position : "relative", minHeight: "100%", maxWidth: "100%", maxHeight: "100%", textAlign: "center"}}src={this.state.input_image}  />
                                </div>
                                <div style={{margin: "auto"}}>
                                    <h3 style={{textAlign: "center"}}>Specify intensity</h3>
                                    <input min="0" max="100" onChange={this.handle_intensity_change} step="1"type="range" id="intensity"></input>
                                    <button style={
                                            {margin: "auto", textAlign: "center", 
                                            display: "flex", width: "75px", 
                                            fontSize : "25px", marginTop : "15px",
                                            height: "75px", borderRadius: "50%"
                                            
                                    }}onClick={this.post}>Blur!</button>
                                </div>
                                <div style={{marginTop: "10px", width: "100%", height: "100%", maxWidth: "100%", minWidth: "100%", minHeight: "100%"}}>
                                    <img id="output_img" style={{maxWidth: "100%", maxHeight: "100%"}} src={this.state.output_image} />
                                    <div id="loading_img" style={{display: "none"}} className ="spinner">
                                      <div id="rect" className = "rect1"></div>
                                      <div id="rect1" className = "rect2"></div>
                                      <div id="rect2" className = "rect3"></div>
                                      <div id="rect3" className = "rect4"></div>
                                      <div id="rect4" className = "rect5"></div>
                                    </div>
                                </div>
                        </Row>
                </Col>
        );
    }
}

export default App;
