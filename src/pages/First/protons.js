import React from 'react';
import ReactDOM from 'react-dom';
import Stats from "stats.js";
import Proton from "proton-engine";
import RAFManager from "raf-manager";
let stats;
let canvas;
let context;
let proton;
let renderer;
let emitter;

export default class Protons extends React.Component {
    componentDidMount() {
        // meta - Three
        proton = ReactDOM.findDOMNode(this.refs.proton)
        make_proton()
        window.addEventListener('resize', this.change_proton);

        // meta - first make
        function make_proton() {
            initCanvas();
            initStats();
            createProton();
            render();
        }

        function initCanvas() {
            canvas = document.getElementById("canvas");
            canvas.width = window.innerWidth;
            canvas.height = 3 * canvas.width;
            context = canvas.getContext("2d");
          
            window.onresize = function(e) {
              canvas.width = window.innerWidth;
              canvas.height = window.innerHeight;
              emitter.p.x = canvas.width / 2;
              emitter.p.y = canvas.height / 2;
            };
          }

          function initStats() {
            stats = new Stats();
            stats.setMode(2);
            stats.domElement.style.position = "absolute";
            stats.domElement.style.left = "0px";
            stats.domElement.style.top = "0px";
            document.body.appendChild(stats.domElement);
          }

          function createProton() {
            proton = new Proton();
            emitter = new Proton.Emitter();
            emitter.rate = new Proton.Rate(
              new Proton.Span(10, 30),
              new Proton.Span(0.1, 0.3)
            );
            emitter.addInitialize(new Proton.Mass(100));
            emitter.addInitialize(new Proton.Radius(3, 12));
            emitter.addInitialize(new Proton.Life(1.5, 3));
            emitter.addInitialize(
              new Proton.Velocity(
                new Proton.Span(canvas.width / 300, canvas.width / 900),
                new Proton.Span(-300, 300),
                "polar"
              )
            );
            emitter.addBehaviour(new Proton.RandomDrift(30, 30, 0.05));
            emitter.addBehaviour(
              new Proton.Color("ff0000", "random", Infinity, Proton.easeOutQuart)
            );
            emitter.addBehaviour(new Proton.Scale(1, 0.7));
            emitter.p.x = canvas.width / 2;
            emitter.p.y = canvas.height / 2;
            emitter.emit();
          
            proton.addEmitter(emitter);
            renderer = new Proton.CanvasRenderer(canvas);
            renderer.onProtonUpdate = () => {
              context.fillStyle = "rgba(53, 53, 53, 0.1)";
              context.fillRect(0, 0, canvas.width, canvas.height);
            };
            proton.addRenderer(renderer);
          }

          function render() {
            RAFManager.add(() => {
              stats.begin();
              emitter.rotation += 10;
              proton.update();
              stats.end();
            });
          }
          
    }

    // meta - when window changed
    change_proton = () => {
        canvas.width = window.innerWidth;
        canvas.height = canvas.width * 3;
        emitter.p.x = canvas.width / 2;
        emitter.p.y = canvas.height / 2;
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.change_proton);
    }

    render() {
        return (
            <canvas id="canvas" ref='proton'></canvas>
        );
    }
}