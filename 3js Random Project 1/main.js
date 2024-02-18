import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

function main(){

    const scene = new THREE.Scene();


    const fov = 10;
    const near = 0.01;
    const far = 10000;
    const camera = new THREE.PerspectiveCamera( fov, window.innerWidth / window.innerHeight, near, far );
    scene.background = new THREE.Color(0xbf21ba);
    const renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    
    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
   
    function cubesRender(geometry,color,x,y,z){
        const material = new THREE.MeshPhongMaterial( { color} );
        const cube = new THREE.Mesh( geometry, material );
        scene.add( cube );
        cube.position.set(x,y,z);
      
        return cube;
        
    }

    const cubes= [
        cubesRender(geometry, 0x001eff,0,2,0),
        cubesRender(geometry, 0x001eff,2,2,0),
        cubesRender(geometry, 0x001eff,-2,2,0),
        cubesRender(geometry, 0x001eff,0,2,-2),
        cubesRender(geometry, 0x001eff,2,2,-2),
        cubesRender(geometry, 0x001eff,-2,2,-2),
        cubesRender(geometry, 0x001eff,0,2,2),
        cubesRender(geometry, 0x001eff,2,2,2),
        cubesRender(geometry, 0x001eff,-2,2,2),
       
    ];

    {
        const color = 0xFFFFFF;
        const intensity = 15;
        const light = new THREE.PointLight(color, intensity);
        light.position.set(-1, 2, 4);
        scene.add(light);
      }

      {
        const color = 0xFFFFFF;
        const intensity = 15;
        const light = new THREE.PointLight(color, intensity);
        light.position.set(-1, 5, 5);
        scene.add(light);
      }


    
    
    camera.position.set(0,50,0
        )
    camera.up.set(0, 0, 1);
    camera.lookAt(0, 0, 0);
   


    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    

    function onPointerMove( event ) {

        // calculate pointer position in normalized device coordinates
        // (-1 to +1) for both components
    
        pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

        raycaster.setFromCamera( pointer, camera );

        // calculate objects intersecting the picking ray
        const intersects = raycaster.intersectObjects( scene.children );
    
       if(intersects.length > 0){
        animateCubes(intersects);
        
    }
      
       }

       function animateCubes(intersects) {
        const time = performance.now() * 0.001; 
        intersects[0].object.rotation.x = time * 0.5; 
        intersects[0].object.rotation.y = time * 0.5;
    }

       


    
    function resizeRendererToDisplaySize(renderer) {
        const window = renderer.domElement;
        const width = window.clientWidth;
        const height = window.clientHeight;
        const needResize = window.width !== width || window.height !== height;
        if (needResize) {
          renderer.setSize(width, height, false);
        }
        return needResize;
      }


    function animate() {
      
         
  if (resizeRendererToDisplaySize(renderer)) {
    const window = renderer.domElement;
    camera.aspect = window.clientWidth /window.clientHeight;
    camera.updateProjectionMatrix();
  }
 
    
     
        
        renderer.render( scene, camera );
        requestAnimationFrame( animate );
    }
    
    animate();
    window.addEventListener( 'pointermove', onPointerMove );

}
main();