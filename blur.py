import sys
import cv2
import os
import base64
import numpy as np
from flask import Flask, request, make_response
from flask_cors import CORS, cross_origin

app = Flask(__name__);

UPLOAD_FOLDER = './uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
CORS(app)

@app.route("/", methods=['GET'])
def hello():
    response = "Index!"
    return response

@app.route('/new_image', methods=["POST"])
def show_image():
    files = request.files
    intensity = request.form['intensity']
    image = files['image']
    print intensity
    print image

    f = os.path.join(app.config['UPLOAD_FOLDER'], image.filename)
    image.save(f)
    img_path = ('./uploads/' + image.filename)
    img = cv2.imread(img_path)
    os.remove(img_path)
    size = int(intensity)

    # generating the kernel
    kernel_motion_blur = np.zeros((size, size))
    kernel_motion_blur[int((size-1)/2), :] = np.ones(size)
    kernel_motion_blur = kernel_motion_blur / size

    # applying the kernel to the input image
    output = cv2.filter2D(img, -1, kernel_motion_blur)
    retval, buffer = cv2.imencode('.png', output)
    png_as_text = base64.b64encode(buffer)
    response = make_response(png_as_text)
    response.headers['Content-Type'] = 'image/png'
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

