import * as THREE from './three';
import {OrbitControls} from './three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from './three/examples/jsm/loaders/GLTFLoader.js';
 import * as dat from 'dat.gui';

var model = new THREE.Object3D();

const airplaneURL = new URL('./airplane2.glb', import.meta.url); 

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

const ambientLight = new THREE.AmbientLight(0x333333);
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
function init() {
    window.addEventListener('message', update_3dpitch, false);
}

window.onload = init;

function update_3dpitch() {
    data = JSON.parse(event.data);
    model.rotateX(data['state']['aircraftPitch'] * 10 * 0.0055);
    console.log("event: " + event);
    renderer.render( scene, camera );
}

function animate(time) {
    model.rotateX(options.rotateX)
    renderer.render( scene, camera );
}

renderer.setAnimationLoop( animate );

