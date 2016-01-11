//Jonathan Bosson

require([
    "../libs/text!../shaders/vertexShader.glsl",
    "../libs/text!../shaders/fragmentShader.glsl",
    "../libs/text!../shaders/simplex-noise-3d.glsl",
    "../libs/orbit-controls"
],

function (
    vertexShader,
    fragmentShader,
    noise)
{
    "use strict";


    var scene, renderer, camera, controls, light;
    var planet, planetGeometry, planetMaterial, planetUniforms, planetAttributes, start = Date.now();



    init();
    animate();


    //initialize scene
    function init()
    {
        // Scene
        container = document.getElementById( 'container' );
        scene = new THREE.Scene();

        // Camera
        camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.set(0, 100, 200);
        camera.lookAt(scene.position);
        scene.add(camera);

        // Renderer
        renderer = new THREE.WebGLRenderer();
        renderer.setClearColor( 0xffffff );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize(window.innerWidth, window.innerHeight);

        // Light
        light = new THREE.PointLight(0xffffff);
        light.position.set(0,250,0);
        scene.add(light);

        // Geometry
        planetGeometry = new THREE.SphereGeometry(70, 100, 100);

        // Shader variables
        planetUniforms =
        {
            time:
            {
                type: "f",  //float
                value: 0.0  //initialized to 0
            }
        }
        planetAttributes =
        {
            /*
            displacement:
            {
                type: 'f',  //float
                value: []   //empty array
            }
            */
        }

        // Material new THREE.MeshBasicMaterial( {color: 0x33FFFF} );
        planetMaterial = new THREE.ShaderMaterial(
        {
            uniforms: planetUniforms,
            attributes: planetAttributes,
            vertexShader: noise + vertexShader,
            fragmentShader: noise + fragmentShader
        } );

        // Add planet to the scene
        planet = new THREE.Mesh(planetGeometry, planetMaterial);
        planet.position.set(0, 0, 0);
        scene.add(planet);
        planet.rotation.x = - Math.PI/2;


        controls = new THREE.OrbitControls(camera, renderer.domElement);


        container.innerHTML = "";
        document.body.appendChild(renderer.domElement);
    }

    function animate()
    {
        requestAnimationFrame( animate );
        planetUniforms.time.value +=  0.00;

        renderer.render( scene, camera );
        controls.update();

    }
});
