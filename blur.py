import sys
import cv2
import numpy as np
from flask import Flask
from flask_cors import CORS, cross_origin

app = Flask(__name__);
CORS(app)

@app.route("/", methods=['GET'])
def hello():
    response = "Index!"
    return response

@app.route('/new_image', methods=["POST"])
def show_image():
    files = request.files
    print files

def blur(image, intensity):
    img = cv2.imread(image)
    cv2.imshow('Original', img)

    #Stuff for zoom
    rows, cols, _channels = map(int, img.shape)
    img = cv2.pyrUp(img, dstsize=(2 * cols, 2 * rows))
    size = intensity 


    # generating the kernel
    kernel_motion_blur = np.zeros((size, size))
    kernel_motion_blur[int((size-1)/2), :] = np.ones(size)
    kernel_motion_blur = kernel_motion_blur / size

    # applying the kernel to the input image
    output = cv2.filter2D(img, -1, kernel_motion_blur)

    cv2.imshow('Motion Blur', output)
    cv2.waitKey(0)

if __name__ == '__main__':
    image = sys.argv[1]
    intensity = int(sys.argv[2])
    blur(image, intensity)
