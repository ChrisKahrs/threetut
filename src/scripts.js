import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
// import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js";
// import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js";
// import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/GLTFLoader.js";

//  import * as dat from 'dat.gui';

var model = new THREE.Object3D();

const airplaneURL = new URL('./airplane_large.glb', import.meta.url); 

const renderer = new THREE.WebGLRenderer();

// renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setSize( 200, 200 );
renderer.shadowMap.enabled = true;
renderer.setClearColor( 0x333333 );

const tag = document.getElementById('table3d');
tag.appendChild( renderer.domElement );
// document.body.appendChild( renderer.domElement );

const scene = new THREE.Scene();

// const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
const camera = new THREE.PerspectiveCamera(20, 1, 0.1, 1000 );

const orbit = new OrbitControls(camera, renderer.domElement);

const axesHelper = new THREE.AxesHelper( 3 );
scene.add(axesHelper);

camera.position.set(-10, 30, 30);
orbit.update();

const planeGeometry = new THREE.PlaneGeometry( 20,20);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = Math.PI / 2;
plane.receiveShadow = true;
scene.add(plane);

const gridHelper = new THREE.GridHelper( 20,20);
gridHelper.position.set(0, 1, 0);
scene.add( gridHelper );

// const gui = new dat.GUI();

// const options = {
//     rotateX: 0
// }
// gui.add(options, 'rotateX', 0, 1);

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const spotLight = new THREE.SpotLight(0xffffff, 0.8);
spotLight.position.set(-100, 100, 0);
scene.add(spotLight);
spotLight.castShadow = true;

const assetLoader = new GLTFLoader();

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(-30, 50, 0);
directionalLight.castShadow = true;
directionalLight.shadow.camera.bottom = -30;
scene.add(directionalLight);

assetLoader.load(airplaneURL.href, function(gltf) {
    model = gltf.scene;  
    scene.add(model);
    model.scale.set(15, 15, 15);
    // model.rotateX(Math.PI * 0.055); // pitch, negative is up, 0.0055 is 1 degree
    // model.rotateZ(Math.PI * 0.055); // roll, negative is left, 0.0055 is 1 degree
    model.position.set(0, 2,-4);
    }, undefined, function(error) {
        console.error(error);}
);

renderer.render( scene, camera );

function update_3dpitch(data) {
    console.log("data: " + data);
    model.rotateX(data['state']['aircraftPitch'] * 10 * 0.0055);
    console.log("event: " + data);
    renderer.render( scene, camera );
}

function animate(time) {
    // model.rotateX(options.rotateX)
    renderer.render( scene, camera );
}

renderer.setAnimationLoop( animate );

        // Grab any URL parameters that were provided
        const params = new URLSearchParams(window.location.search);
        const darkMode = params.get('_theme') === 'dark';

        function init() {

            // Adjust the visualizer colors based upon the selected theme 
            setTheme();

            // Add an event listener to catch messages from Bonsai
            window.addEventListener('message', updateVisualizer, false);

            const bgImg = document.getElementById('bgImg')
            bgImg.setAttribute("transform", "translate (50,50)");
        }

        // Run the init() function when the window loads
        document.addEventListener('DOMContentLoaded', init);

        function setTheme() {

            // Adjust the visualizer colors based upon the selected theme 
            if (darkMode) {
                document.body.style.backgroundColor = '#333';
                document.body.style.color = '#fff';
            }
            else {
                document.body.style.backgroundColor = '#fff';
                document.body.style.color = '#000';
            }
        }
        // angle = 0;
        // lift = 0;
        // function updateVisualizer(liftx, rot) {
        //     const bgImg = document.getElementById('bgImg');
        //     angle += rot;
        //     lift += liftx
        //     let stringy = 'translate (50,' + (50 + lift) + ') rotate(' + (angle) + ',100,100)';
        //     bgImg.setAttribute("transform", stringy);
        // }

        function updateVisualizer() {
            // const jsonStateBox = document.getElementById('jsonStateBox');
            const jsonActionBox = document.getElementById('jsonActionBox');
            const jsonRewardBox = document.getElementById('jsonRewardBox');
            const airspeed = document.getElementById('airspeed');
            const airspeedDelta = document.getElementById('airspeedDelta');
            const altitudeDelta = document.getElementById('altitudeDelta');
            const altitude = document.getElementById('altitude');
            const altimeter = document.getElementById('altimeter')
            const pitch_roll = document.getElementById('pitch_roll');
            const bgImg = document.getElementById('bgImg');
            const textElement = document.getElementById("text");
            const thousandElement = document.getElementById("thousand_hand");
            const tenThousandElement = document.getElementById("tenThousand_hand");
            const hundredElement = document.getElementById("hundred_hand");
            const speedElement = document.getElementById("speed_hand");
            const airspeedTarget = document.getElementById("airspeedTarget");
            const altitudeTarget = document.getElementById("altitudeTarget");
            const yaw = document.getElementById("yaw");
            const table3d = document.getElementById("table3d");
            
            var jsonData = JSON.parse(event.data);

            height = jsonData['state']['aircraftAltitude']
            speed = jsonData['state']['aircraftSpeed']

            tenThousands = (height % 100000 / 10000);
            thousands = (height % 10000/ 1000);
            hundreds = (height % 1000 / 100);

            thousandElement.setAttribute("transform", `rotate(${(360 / 10) * thousands})`);
            tenThousandElement.setAttribute("transform", `rotate(${(360 / 10) * tenThousands})`);
            hundredElement.setAttribute("transform", `rotate(${(360 / 10) * hundreds})`);

            speedElement.setAttribute("transform", `rotate(${(360 / 100) * (speed / 2.6)}, 109,104)`);

            // Convert message to formatted JSON text for display 
            // var jsonString = JSON.stringify(jsonData, null, 4);
            // Radians * 180 / Math.Pi. The gauges should be able to show -180 to +180 degrees

            pitch_angle = jsonData['state']['aircraftPitch'] * 180 / Math.PI
            roll_angle = jsonData['state']['aircraftRoll'] * 180 / Math.PI
            bgImg.setAttribute("transform", "translate (50," + (50 + pitch_angle) + ") rotate(" + (roll_angle) + ",100,100)");
            const event2 = new CustomEvent('update3d', { detail: jsonData });
            table3d.dispatchEvent(event2);
            pitch.innerText = "Pitch: " + (pitch_angle).toFixed(3);
            roll.innerText = "Roll: " + (roll_angle).toFixed(3);
            yaw.innerText = "Yaw: " + (jsonData['state']['aircraftYaw']).toFixed(3);
            update_3dpitch(jsonData);
            // airspeed calculations
            airspeed.innerText = "Actual: " + jsonData['state']['aircraftSpeed'].toFixed(3);
            airspeedTarget.innerText = "Target: " + jsonData['state']['targetSpeed'].toFixed(3);
            airspeedDeltaNum = (jsonData['state']['aircraftSpeed'] - jsonData['state']['targetSpeed']).toFixed(3);
            airspeedDeltaPercent = ((airspeedDeltaNum / jsonData['state']['targetSpeed']) * 100).toFixed(0);
            airspeedDelta.innerText = "Delta: " + airspeedDeltaNum + " (" + airspeedDeltaPercent + "%)";
            if (Math.abs(airspeedDeltaPercent) > 10) {
                airspeedDelta.style.color = "red";
            }
            else {
                airspeedDelta.style.color = "black";
            };

            // altitude calculations
            altitude.innerText = "Actual: " + jsonData['state']['aircraftAltitude'].toFixed(3);
            altitudeTarget.innerText = "Target: " + jsonData['state']['targetAltitude'].toFixed(3);
            altitudeDeltaNum = (jsonData['state']['aircraftAltitude'] - jsonData['state']['targetAltitude']).toFixed(3);
            altitudeDeltaPercent = ((altitudeDeltaNum / jsonData['state']['targetAltitude']) * 100).toFixed(0);
            altitudeDelta.innerText = "Delta: " + altitudeDeltaNum + " (" + altitudeDeltaPercent + "%)";
            if (Math.abs(altitudeDeltaPercent) > 10) {
                altitudeDelta.style.color = "red";
            }
            else {
                altitudeDelta.style.color = "black";
            };

            jsonStateString = JSON.stringify(jsonData['state'], function (k, v) {
                if (v instanceof Array)
                    return JSON.stringify(v);
                return v;
            }, 2);
            jsonActionString = JSON.stringify(jsonData['action'], function (k, v) {
                if (v instanceof Array)
                    return JSON.stringify(v);
                return v;
            }, 2);
            jsonRewardString = jsonData['meta']['reward'];

            // Update the code block and positions of graphical elements 
            jsonStateBox2.textContent = jsonStateString;
            jsonActionBox2.textContent = jsonActionString;
            jsonRewardBox2.textContent = jsonRewardString;
            jsonActionBox.textContent = jsonActionString;
            jsonRewardBox.textContent = jsonRewardString;
        }
