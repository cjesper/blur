import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import {Row, Col} from 'react-flexbox-grid';
import cloudinary from "cloudinary-jquery-file-upload";

class App extends Component {
    constructor(props) {
        super(props)

        this.state = {
            show_blur : "none",
            show_fade : "none",
            fadeout_image : "",
            fadein_image : "",
            input_image : "", 
            output_image : "",
            show_fade_modal : "none",
            show_fade_images : "none",
            image_one_opacity : 1,
            image_two_opacity : 0,
            intensity: 50,
            selected_fade_speed : 0,
            first_border : "5px solid red",
            second_border : "",
            fade_border : "",
            fadein_cloudinary_url : "",
            fadeout_cloudinary_url : "",
            link_query_url : "",
            link_status : "Generating..",
            show_caption_input : "none",
            link_fadein_src : "",
            link_fadeout_src : "",
            link_caption : "",
            caption : "",
            show_link_div : "none",
            hush : "5f02dcdc085a1abc805938b6ef6406f49a45017f",
            shortened_url : ""
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

    //FADEOUT
    upload_fadeout_image = (file) => {
      var self = this;
      var cloudName = "gobblog";
      var unsignedUploadPreset = "ua2wzunv";
      var url = `https://api.cloudinary.com/v1_1/gobblog/auto/upload`;
      var fd = new FormData();
    
      fd.append('upload_preset', unsignedUploadPreset);
      fd.append('tags', 'browser_upload'); // Optional - add tag for image admin in Cloudinary
      fd.append('file', file);

      axios.post(url, fd)
        .then((res) => {
            console.log(res.data.secure_url)
            self.setState({
                fadeout_cloudinary_url : res.data.secure_url
            })
        })
        .catch ((err) => {
            console.log(err)
        })
    }

    //FADEIN
    upload_fadein_image = (file) => {
      var self = this;
      var cloudName = "gobblog";
      var unsignedUploadPreset = "ua2wzunv";
      var url = `https://api.cloudinary.com/v1_1/gobblog/auto/upload`;
      var fd = new FormData();
    
      fd.append('upload_preset', unsignedUploadPreset);
      fd.append('tags', 'browser_upload'); // Optional - add tag for image admin in Cloudinary
      fd.append('file', file);

      axios.post(url, fd)
        .then((res) => {
            console.log(res.data.secure_url)
            self.setState({
                fadein_cloudinary_url : res.data.secure_url
            })

        })
        .catch ((err) => {
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

    //Stuff for fadein/out
    choose_blur = () => {
      var self = this;
      self.setState({
        show_blur : "flex",
        show_fade : "none"
      })
    }
    
    choose_fade = () => {
      var self = this;
      self.setState({
        show_fade : "flex",
        show_blur : "none",
        show_fade_modal : "block"
      })
    }

    fade_images = () => {
        window.scrollTo(0, 0);
        var self = this;
        self.setState({
            show_fade_images : "block"
        })
    }

    trigger_fade_modal = () => {
      var self = this;
      self.setState({
        show_fade_modal: "none"
      })
    }

    close_fade_images = () => {
        var self = this;
        self.setState({
            show_fade_images : "none"
        })
    }

    choose_fadein_image = () => {
        var self = this;
        var selected_image= document.getElementById('choose_fadein_image').files[0];
        if (selected_image) {
            var reader  = new FileReader();
            reader.onload = function(e)  {
                var image = document.createElement("img");
                image.src = e.target.result;
                self.setState({
                    fadein_image: image.src,
                    second_border : "",
                    fade_border : "5px solid red"
                })
             }
             reader.readAsDataURL(selected_image);
        }
    }

    upload_to_cloudinary = () => {
        console.log("IN HERE!");
        var fadein_image = document.getElementById('choose_fadein_image').files[0];
        var fadeout_image = document.getElementById('choose_fadeout_image').files[0];
        var self = this;
        var cloudName = "gobblog";
        var unsignedUploadPreset = "ua2wzunv";
        var url = `https://api.cloudinary.com/v1_1/gobblog/auto/upload`;
        var fadein_fd = new FormData();
        var fadeout_fd = new FormData();
        
        fadein_fd.append('upload_preset', unsignedUploadPreset);
        fadein_fd.append('tags', 'browser_upload'); // Optional - add tag for image admin in Cloudinary
        fadein_fd.append('file', fadein_image);
        
        //Upload fade in image...
        axios.post(url, fadein_fd)
        .then((res) => {
            console.log(res.data.secure_url)
            self.setState({
                fadein_cloudinary_url : res.data.secure_url
            })
            //If successful, upload fade out image
            fadeout_fd.append('upload_preset', unsignedUploadPreset);
            fadeout_fd.append('tags', 'browser_upload'); // Optional - add tag for image admin in Cloudinary
            fadeout_fd.append('file', fadeout_image);
            axios.post(url, fadeout_fd)
            .then((res) => {
                console.log(res.data.secure_url)
                self.setState({
                    fadeout_cloudinary_url : res.data.secure_url
                })
                //If that worked, create the link with query params and open!
                this.create_link();
            })
            .catch((err) => {
                console.log(err);
            })
        })
        .catch ((err) => {
            console.log(err)
        })
    }
    
    choose_fadeout_image = () => {
        var self = this;
        var selected_image= document.getElementById('choose_fadeout_image').files[0];
        if (selected_image) {
            var reader  = new FileReader();
            reader.onload = function(e)  {
                var image = document.createElement("img");
                image.src = e.target.result;
                self.setState({
                    first_border : "",
                    second_border : "5px solid red",
                    fadeout_image: image.src
                })
             }
             reader.readAsDataURL(selected_image);
        }
    }

    trigger_fade = () => {
        var self = this;
        var old_one_opacity = 1;
        var old_two_opacity = 0;
        var interval_timer = 100;
        var timer = setInterval(() => {
            if (old_one_opacity <= 0) {
                clearInterval(timer)
            }
            old_one_opacity = old_one_opacity-0.01;
            old_two_opacity = old_two_opacity+0.01;
            document.getElementById("image_one").style.opacity=old_one_opacity;
            document.getElementById("image_two").style.opacity=old_two_opacity;
        }, interval_timer);
    }

    create_link = () => {
        var self = this;
        if (self.state.fadein_cloudinary_url != "" && self.state.fadeout_cloudinary_url != "") {
            var url_with_params = '/link?'+"fadein_url="+self.state.fadein_cloudinary_url+"?fadeout_url="+self.state.fadeout_cloudinary_url+"?caption="+encodeURIComponent(self.state.link_caption)
            self.setState({
                link_query_url : url_with_params,
                link_status : "Done!"
            })
            var base_api_url = "https://api-ssl.bitly.com"
            var method = "/v3/shorten?";
            var base_blur = "http://blur.carlssonjesper.com";
            var params = "access_token="+this.state.hush+"&longURL="+base_blur+""+url_with_params;
            //var params = "access_token="+this.state.hush+"&longURL=http://www.google.se"
            var call = base_api_url + method + params;
            console.log(call)
            axios.get(call)
              .then((res) =>  {
                var short_url = res.data.data.url
                self.setState({
                  shortened_url : short_url 
                })
              })
              .catch((err) => {
                console.log(err)
              });
        } else {
            console.log("Can't create link yet")
        }
    }

    handle_caption_change = (e) => {
        this.setState({
            link_caption : e.target.value
        })
    }

    get_query_params = () => {
        var self = this;
        var url = window.location.href;
        var fadein_url = url.split('?')[1]
        var fadeout_url = url.split('?')[2]
        var caption = url.split('?')[3]
        var parsed_caption = caption.split('=')[1]
        //Hack the encoding
        parsed_caption = parsed_caption.replace(/%20/gi, " ");
        parsed_caption = parsed_caption.replace(/%C3%A5/gi, "å");
        parsed_caption = parsed_caption.replace(/%C3%A4/gi, "ä");
        parsed_caption = parsed_caption.replace(/%C3%B6/gi, "ö");
        var fadein_src = fadein_url.split('=')[1]
        var fadeout_src = fadeout_url.split('=')[1]
        console.log(caption)
        self.setState({
            link_fadein_src : fadein_src,
            link_fadeout_src : fadeout_src,
            caption : parsed_caption 
        })
    }

    provide_caption = () => {
        var self = this;
        self.setState({
            show_caption_input : "block"
        });
    }

    open_link = () => {
        var self = this;
        window.open(self.state.shortened_url)
    }

    copy_link = () => {
        var copy_text = window.location.href;
        console.log(copy_text)
        document.execCommand("copy");
    }

    initiate_linking = () => {
        var self = this;
        console.log("LINKING!")
        self.upload_to_cloudinary();
        this.setState({
            show_caption_input : "none",
            show_link_div :"block"
        })
    }
    close_linking = () => {
        var self = this;
        this.setState({
            show_caption_input : "none",
            show_link_div :"none"
        })
        
    }
    trigger_link_fade = () => {
        var self = this;
        var old_one_opacity = 1;
        var old_two_opacity = 0;
        var interval_timer = 100;
        var timer = setInterval(() => {
            if (old_one_opacity <= 0) {
                clearInterval(timer)
            }
            old_one_opacity = old_one_opacity-0.01;
            old_two_opacity = old_two_opacity+0.01;
            document.getElementById("link_image_one").style.opacity=old_one_opacity;
            document.getElementById("link_image_two").style.opacity=old_two_opacity;
        }, interval_timer);
    }

    componentWillMount = () => {
        var url = window.location.href;
        var is_link = false;
        if (url.indexOf('/link') >= 0) {
            console.log("Link here!");
            this.get_query_params(); 
        }
        
    }

    render() {
        console.log(this.state)

        var url = window.location.href;
        var is_link = false;
        if (url.indexOf('/link') >= 0) {
            console.log("Link here!");
            is_link = true;
        }
        
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

        var radio_button_style = {
          width : "25px",
          height : "25px",
          textAlign : "center"
        }

        var modal_style = {
          left : "15%",
          display : this.state.show_fade_modal,
          justifyContent : "center",
          alignItems: "center",
          position : "absolute",
          backgroundColor : "white",
          borderRadius : "2%",
          border : "2px solid black",
          zIndex: 2
        }

        var modal_header_style = {
            textAlign : "center",
            position: "relative",
            display : "block",
            margin : "1px"
        }

        var modal_button_style = {
            margin : "auto",
            marginBottom : "2px",
            display : "block",
            width : "50%",
            height: "35%",
            textAlign: "center"
        }

        var button_style = {
            margin : "auto",
            textAlign : "center",
            display : "inlineBlock",
            width : "25%",
            height : "10%",
            fontSize : "24px"
        }
        //If this is a user created link, return that instead
        if (is_link == true) {
            this.trigger_link_fade();
            return (
                <Col xs lg md>
                <div style={{
                                width : "99%",
                                height : "80%",
                                maxHeight : "100%",
                                maxWidth: "100%",
                                border : "1px solid black",
                                position : "absolute",
                            }}>
                <h1 style={{textAlign : "center"}}>{this.state.caption}</h1>
                                <div style={{maxWidth:"100%", maxHeight: "100%", backgroundColor : "white" ,height: "100%", width: "100%"}}>
                                    <img id="link_image_one" style={{opacity:this.state.image_one_opacity, position : "absolute", width : "100%", minHeight: "100%", maxWidth: "100%", maxHeight: "100%", textAlign: "center"}}src={this.state.link_fadeout_src}  />
                                    <img id="link_image_two" style={{opacity:this.state.image_two_opacity, position : "absolute", width : "100%", minHeight: "100%", maxWidth: "100%", maxHeight: "100%", textAlign: "center"}}src={this.state.link_fadein_src}  />
                                </div>
                                    <div style={{
                                          display:"flex",
                                          border : "2px solid black"}}>
                                        <button onClick={this.trigger_link_fade} style={button_style}> Fade!</button>
                                    </div>
                            </div>
                </Col>
            )
        } else {
        return (
              <div>
                <Col md lg xs />
                <Col md lg xs style={{width: "100%"}}>
                  <div style={header_style}>
                        <h1 style={header_style}>Welcome!</h1>
                        <h2>Would you like to...</h2>
                        <form action="">
                          <input style={radio_button_style} type="radio" onClick={this.choose_blur} label="Blur!" name="choice" value="blur"/> Blur! 
                          <input style={radio_button_style} type="radio" onClick={this.choose_fade} name="choice" value="fade" /> Fade!
                        </form>
                  </div>
                        <Row id="blur_row" style={{display: this.state.show_blur}}>
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
                      <Row id="fade_row" style={{display : this.state.show_fade}}>
                            <Col xs lg md style={{display : this.state.show_fade_modal,
                                                  left : "15%",
                                                  display : this.state.show_fade_modal,
                                                  justifyContent : "center",
                                                  alignItems: "center",
                                                  position : "absolute",
                                                  backgroundColor : "white",
                                                  borderRadius : "2%",
                                                  border : "2px solid black",
                                                  zIndex: 2
                                                }}>
                                <h3 style={modal_header_style}>Select the image to fade out</h3>
                                <h3 style={modal_header_style}>Select the image to fade in</h3>
                                <h3 style={modal_header_style}>Press the button at the bottom</h3>
                                <button onClick={this.trigger_fade_modal} style={modal_button_style}> Ok, got it!</button>
                            </Col>
                            <label style={{
                                margin : "auto", width : "85px",
                                fontSize : "20px", textAlign : "center",
                                verticalAlign : "middle", color: "white",
                                height : "85px", backgroundColor : "grey",
                                borderRadius : "50%", lineHeight : "350%",
                                marginBottom : "10px", border : this.state.first_border
                            }}>
                              <input style = {
                                    {display: "none"
                                }} onChange={this.choose_fadeout_image} type="file" id="choose_fadeout_image" />
                                <b>Choose first!</b> 
                            </label>
                                <div style={{display:"flex",marginTop: "10px", width: "100%", maxWidth: "100%", minWidth: "100%", minHeight: "100%"}}>
                                    <img id="fadeout_image" style={{margin : "auto", position : "relative", minHeight: "100%", maxWidth: "100%", maxHeight: "300px", textAlign: "center"}}src={this.state.fadeout_image}  />
                                </div>

                            <label style={{
                                margin : "auto", width : "85px",
                                fontSize : "20px", textAlign : "center",
                                verticalAlign : "middle", color: "white",
                                height : "85px", backgroundColor : "black",
                                borderRadius : "50%", lineHeight : "350%",
                                marginBottom : "10px", border : this.state.second_border
                            }}>
                              <input style = {
                                    {display: "none"
                                }} onChange={this.choose_fadein_image} type="file" id="choose_fadein_image" />
                                <b>Choose second!</b> 
                            </label>
                                <div style={{display:"flex", marginTop: "10px", width: "100%", maxWidth: "100%", minWidth: "100%", minHeight: "100%"}}>
                                    <img id="fadein_image" style={{margin : "auto", position : "relative", minHeight: "100%", maxWidth: "100%", maxHeight: "300px", textAlign: "center"}}src={this.state.fadein_image}  />
                                </div>
                            <label style={{
                                margin : "auto", width : "85px",
                                fontSize : "20px", textAlign : "center",
                                verticalAlign : "middle", color: "white",
                                height : "85px", backgroundColor : "black",
                                borderRadius : "50%", lineHeight : "350%",
                                marginBottom : "10px", border : this.state.fade_border
                            }}>
                                <button style={{display : "none"}} onClick={this.fade_images}> </button>
                                <b>Fade!</b> 
                            </label>
                            <div id="images_modal" style={{
                                width : "99%",
                                height : "80%",
                                maxHeight : "100%",
                                maxWidth: "100%",
                                top : "10%",
                                border : "1px solid black",
                                display : this.state.show_fade_images,
                                position : "absolute",
                                zIndex: "3"
                            }}>
                                <div style={{maxWidth:"100%", maxHeight: "100%", backgroundColor : "white" ,height: "100%", width: "100%"}}>
                                    <img id="image_one" style={{opacity:this.state.image_one_opacity, position : "absolute", width : "100%", minHeight: "100%", maxWidth: "100%", maxHeight: "100%", textAlign: "center"}}src={this.state.fadeout_image}  />
                                    <img id="image_two" style={{opacity:this.state.image_two_opacity, position : "absolute", width : "100%", minHeight: "100%", maxWidth: "100%", maxHeight: "100%", textAlign: "center"}}src={this.state.fadein_image}  />
                                </div>
                                <div style={
                                        {zindex : 5, border : "2px solid black", 
                                                display: this.state.show_caption_input, position : "absolute",
                                                top : "50%", left : "30%",
                                                width : "40%", height : "15%",
                                                borderradius : "2%", backgroundColor : "white"
                                        }} >
                                    <form>
                                        <label style={{textAlign : "center"}}>
                                        <b style={{display:"block"}}> Caption (optional) </b>
                                        <input onChange={this.handle_caption_change} value={this.state.link_caption} style={{margin:"auto", display:"block", width: "95%", borderRadius : "2px"}}type="text"></input> 
                                        </label>
                                    </form>
                                        <button style={{display:"block", margin : "auto"}} onClick={this.initiate_linking}> Create! </button>
                                </div>
                                    <div style={{display:"flex"}}>
                                        <button onClick={this.close_fade_images} style={button_style}> Close </button>
                                        <button onClick={this.trigger_fade} style={button_style}> Fade!</button>
                                        <button onClick={this.provide_caption} style={button_style}> Create link!</button>
                                    </div>
                            </div>
                            <div style={
                                    {zIndex : 10, border : "2px solid black", 
                                            display: this.state.show_link_div, position : "absolute",
                                            top : "50%", left : "20%",
                                            width : "60%", height : "15%",
                                            maxWidth : "500px",
                                            borderradius : "2%", backgroundColor : "white"
                                    }} >
                                    <h3 style={{textAlign:"center"}}>{this.state.link_status}</h3>
                                      <a style={{textAlign:"center", display:"block"}} href={this.state.shortened_url}>{this.state.shortened_url}</a>
                                    <div style={{textAlign:"center", display: "block"}}>
                                        <button style={{height:"20%", width:"20%"}} onClick={this.open_link}> Open link</button>
                                        <button onClick={this.close_linking}> Close</button>
                                    </div>
                            </div>
                      </Row>
                </Col>
                <Col md lg xs />
              </div>
        );
    }
    }
}

export default App;
