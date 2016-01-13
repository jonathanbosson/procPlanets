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

    var guiControls = new function(){
      this.heightC = 1.0;
      this.freqC = 1.0;
    }

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

        // GUI
        var gui = new dat.GUI();
        gui.add(guiControls, 'heightC', 0.0, 2.0);
        gui.add(guiControls, 'freqC', -3.0, 3.0);

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
            },
            heightC:
            {
                type: "f",  //float
                value: 1.0  //initialized to 0
            },
            freqC:
            {
                type: "f",  //float
                value: 1.0  //initialized to 0
            },
            lightPos:
            {
                type: "v3",  //float
                value: new THREE.Vector3()  //initialized to 0
            }
        }
        planetAttributes =
        {
        }

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
        planetUniforms.time.value +=  0.1;
        planetUniforms.heightC.value =  guiControls.heightC;
        planetUniforms.freqC.value =  guiControls.freqC;
        planetUniforms.lightPos.value = camera.position;

        renderer.render( scene, camera );
        controls.update();

    }
});
