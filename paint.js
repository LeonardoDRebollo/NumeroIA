//import {model} from './script.js';
import {predecir} from './script.js';
(function () {
    var model;
    async function loadModel() {
        model = await tf.loadLayersModel('./modelo.json');
        predecir.style.display = "block";
        console.log("Modelo cargado exitosamente.")
    }
 
    function createCanvas(parent, width, height) {
        var canvas = {};
        canvas.node = document.createElement('canvas');
        canvas.node.setAttribute('id', 'canvas');
        canvas.context = canvas.node.getContext('2d');
        canvas.node.width = width || 100;
        canvas.node.height = height || 100;
        parent.appendChild(canvas.node);
        return canvas;
    }
 
    async function init(container, width, height, fillColor) {
    var canvas = createCanvas(container, width, height);
    var ctx = canvas.context;
    ctx.fillCircle = function (x, y, radius, fillColor) {
        this.fillStyle = fillColor;
        this.beginPath();
        this.moveTo(x, y);
        this.arc(x, y, radius, 0, Math.PI * 2, false);
        this.fill();
    };
    ctx.clearTo = function (fillColor) {
        ctx.fillStyle = fillColor;
        ctx.fillRect(0, 0, width, height);
    };
    ctx.clearTo(fillColor || "#ffffff");
    canvas.node.onmousemove = function (e) {
        if (!canvas.isDrawing) {
        return;
        }
        var x = e.pageX - this.offsetLeft;
        var y = e.pageY - this.offsetTop;
        var radius = 7; 
        var fillColor = '#000000';
        ctx.fillCircle(x, y, radius, fillColor);
    };
    canvas.node.onmousedown = function (e) {
        canvas.isDrawing = true;
    };
    canvas.node.onmouseup = function (e) {
        canvas.isDrawing = false;
    };
    loadModel();
    }
 
    function predict(tfImage) {
        var output = model.predict(tfImage);
        var result = Array.from(output.dataSync());
        console.log('Este número es un: ', Array.from(output.dataSync()));
        var maxPossibility = result.reduce(function(a,b){return Math.max(a,b)});
        console.log(maxPossibility);
        document.getElementById('prediction').innerHTML =  '<h2>'
           +"Este número es un: \t"+ result.indexOf(maxPossibility) + '</h2>';
    }
    function clear() {
        console.log('clear canvas');
        var canvas = document.getElementById('canvas');
        var ctx = canvas.getContext('2d');
        ctx.clearTo('#ffffff');
        document.getElementById('prediction').innerHTML = '';
    }
    function recognizeNumber() {
        var canvas = document.getElementById('canvas');
        var ctx = canvas.getContext('2d');
        var imageData = ctx.getImageData(0, 0, 100, 100);
        var tfImage = tf.browser.fromPixels(imageData, 1);
        var tfResizedImage = tf.image.resizeBilinear(tfImage, [28,28]);
        tfResizedImage = tf.cast(tfResizedImage, 'float32');
        tfResizedImage = tf.abs(tfResizedImage.sub(tf.scalar(255)))
            .div(tf.scalar(255)).flatten();
        tfResizedImage = tfResizedImage.reshape([-1, 28, 28, 1]);
        console.log(tfResizedImage.dataSync());
        console.log(tfResizedImage);
        predict(tfResizedImage);
        imageData = null;
    }      
 
    var container = document.getElementById('canvas-container');
    init(container, 100 ,100, '#ffffff');
    document.getElementById('clear').addEventListener('click', clear);
    document.getElementById('predict').addEventListener('click', recognizeNumber);
 
})();