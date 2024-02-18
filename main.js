import * as THREE from 'three';
import GUI from 'lil-gui';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const main =() =>{
    const gui = new GUI();

const canvas = document.querySelector("#c");
const renderer = new THREE.WebGLRenderer({antialias: true, canvas});




const fov = 120;
const aspect =  2;
const near = 0.01;
const far = 1000;
const camera = new THREE.PerspectiveCamera(fov,aspect,near,far);
// camera.position.set(0,50,0);
// camera.up.set(0,0,1);
// camera.lookAt(0,0,0);

const controls = new OrbitControls( camera, renderer.domElement );
camera.position.set( 0, 20, 100 );
controls.update();


const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

{
    const color = 0xFFFFFF;
    const intensity = 3;
    const light = new THREE.PointLight(color,intensity);
    scene.add(light);
}

const objects = [];

// making empty scene graph node for sun and earth 
const solarSystem = new THREE.Object3D();
scene.add(solarSystem);
objects.push(solarSystem);

// creating a empty node for moon and earth
const earthOrbit = new THREE.Object3D();
earthOrbit.position.x =10;
solarSystem.add(earthOrbit);
objects.push(earthOrbit);

const moonOrbit = new THREE.Object3D();
moonOrbit.position.x = 2;
earthOrbit.add(moonOrbit);

// creating sphereGeometry to represent a Sun
const radius = 1;
const widthSegments =6;
const heightSegments =6;
const sphereGeometry = new THREE.SphereGeometry(
    radius,widthSegments,heightSegments);

const sunMaterial = new THREE.MeshPhongMaterial({emissive:0xFFFF00});
const sunMesh = new THREE.Mesh(sphereGeometry,sunMaterial);
sunMesh.scale.set(5,5,5);
solarSystem.add(sunMesh);
objects.push(sunMesh);

// creating earth geometry

const earthMaterial = new THREE.MeshPhongMaterial({color:0x2233FF,emissive: 0x112244});
const earthMesh = new THREE.Mesh(sphereGeometry,earthMaterial);

// adding earth to his parent which is in this case  an sun so earth will be able to rotate around sun  
earthOrbit.add(earthMesh);
objects.push(earthMesh);


// creating moon mesh then adding them into moon orbit
const moonMaterial = new THREE.MeshPhongMaterial({color: 0x888888, emissive: 0x222222});
const moonMesh = new THREE.Mesh(sphereGeometry,moonMaterial);
moonMesh.scale.set(.5,.5,.5);
moonOrbit.add(moonMesh);
objects.push(moonMesh);

// adding a Axes Helper which draws 3 lines x,y,z positions with Gui lib which gives panel for control



class AxisGridHelper{
    constructor(node,units =10){
        const axes = new THREE.AxesHelper();
        axes.material.depthTest = false;
        axes.renderOrder =2;
        node.add(axes);

        const grid = new THREE.GridHelper(units,units);
        grid.material.depthTest = false;
        grid.renderOrder = 1;
        node.add(grid);

        this.grid = grid;
        this.axes =axes;
        this.visible = false;
    }

    get visible(){
        return this._visible;
    }
    set visible(v){
        this._visible =v;
        this.grid.visible =v;
        this.axes.visible =v;
    }
    
}

function makeAxisGrid(node,label,units){
    const helper = new AxisGridHelper(node,units);
    gui.add(helper,'visible').name(label);
}


makeAxisGrid(solarSystem,'solarSystem',25);
makeAxisGrid(sunMesh, 'sunMesh');
makeAxisGrid(earthOrbit, 'earthOrbit');
makeAxisGrid(earthMesh, 'earthMesh');
makeAxisGrid(moonOrbit, 'moonOrbit');
makeAxisGrid(moonMesh, 'moonMesh');


function resizeRendererToDisplaySize(renderer){
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize){
        renderer.setSize(width,height, false);
    }
    return needResize;
}

function render(time){
time *= 0.001

    if (resizeRendererToDisplaySize(renderer)){
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }

    objects.forEach((obj,ndx) => {
        const speed = .3 + ndx * .3;
        const rot = time * speed;
        obj.rotation.y = rot;
        obj.rotation.z = rot;
        controls.update();

    });
    
    
    renderer.render(scene,camera);
    requestAnimationFrame(render);
}
requestAnimationFrame(render);

}

main()