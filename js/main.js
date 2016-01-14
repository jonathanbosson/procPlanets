//Jonathan Bosson

require([
    "../libs/text!../shaders/vertexShader.glsl",
    "../libs/text!../shaders/fragmentShader.glsl",
    "../libs/text!../shaders/waterVertexShader.glsl",
    "../libs/text!../shaders/waterFragmentShader.glsl",
    "../libs/text!../shaders/simplex-noise-3d.glsl",
    "../libs/orbit-controls"
],

function (
    vertexShader,
    fragmentShader,
    waterVertexShader,
    waterFragmentShader,
    noise)
{
    "use strict";


    var scene, renderer, camera, controls, light;
    var planet, planetGeometry, planetMaterial, planetUniforms, planetAttributes, start = Date.now();
    var waterPlanet, waterPlanetGeometry, waterPlanetMaterial, waterPlanetUniforms, waterPlanetAttributes;

    // Function called by the sliders
    var guiControls = new function(){
      this.heightC = 0.01;
      this.freqC = 0.01;
      this.WatertoSandLevel = -0.1;
      this.SandtoForestLevel = 0.08;
      this.ForesttoRockLevel = 0.31;
      this.RocktoSnowLevel = 1.1;
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
        // Height and frequency of the mountains
        gui.add(guiControls, 'heightC', 0.0, 2.0);
        gui.add(guiControls, 'freqC', 0.0, 2.5);

        // Biomes sliders
        gui.add(guiControls, 'WatertoSandLevel', -2.0, 0.5);
        gui.add(guiControls, 'SandtoForestLevel', -1.0, 0.9);
        gui.add(guiControls, 'ForesttoRockLevel', -1.0, 0.9);
        gui.add(guiControls, 'RocktoSnowLevel', 0.0, 3.0);

        // Light - nothing atm
        light = new THREE.PointLight(0xffffff);
        light.position.set(0,250,0);
        scene.add(light);

        // Geometry
        planetGeometry = new THREE.SphereGeometry(70, 200, 200);
        waterPlanetGeometry = new THREE.SphereGeometry(60, 32, 32);

        // Shader variables
        planetUniforms =
        {
            time:
            {
                type: "f",  //float
                value: 0.0  //initialized to 0
            },
            heightC: {
                type: "f",  //float
                value: 1.0  //initialized to 0
            },
            freqC:
            {
                type: "f",  //float
                value: 1.0  //initialized to 0
            },
            WatertoSandLevel:
            {
                type: "f",  //float
                value: 0.0  //initialized to 0
            },
            SandtoForestLevel:
            {
                type: "f",  //float
                value: 0.0  //initialized to 0
            },
            ForesttoRockLevel:
            {
                type: "f",  //float
                value: 0.0  //initialized to 0
            },
            RocktoSnowLevel:
            {
              type: "f",
              value: 0.0
            },
            lightPos:
            {
                type: "v3",  //float
                value: new THREE.Vector3()  //initialized to 0
            }
        }
        planetAttributes = {}
        waterPlanetUniforms =
        {
          heightC: {
              type: "f",  //float
              value: 1.0  //initialized to 0
          },
          WatertoSandLevel:
          {
              type: "f",  //float
              value: 0.0  //initialized to 0
          },
          lightPos:
          {
              type: "v3",  //float
              value: new THREE.Vector3()  //initialized to 0
          }
        }
        waterPlanetAttributes = {}

        // Main planet linked to shaders
        planetMaterial = new THREE.ShaderMaterial(
        {
            uniforms: planetUniforms,
            attributes: planetAttributes,
            vertexShader: noise + vertexShader,
            fragmentShader: noise + fragmentShader
        } );
        // the waterPlanet linked to its own shaders
        waterPlanetMaterial = new THREE.ShaderMaterial(
        {
            uniforms: waterPlanetUniforms,
            attributes: waterPlanetAttributes,
            vertexShader: noise + waterVertexShader,
            fragmentShader: noise + waterFragmentShader
        } );

        // Add planet to the scene
        planet = new THREE.Mesh(planetGeometry, planetMaterial);
        planet.position.set(0, 0, 0);
        scene.add(planet);
        planet.rotation.x = - Math.PI/2;
        // Secondary smaller planet to make water levels even
        waterPlanet = new THREE.Mesh(waterPlanetGeometry, waterPlanetMaterial);
        waterPlanet.position.set(0, 0, 0);
        scene.add(waterPlanet);
        waterPlanet.rotation.x = - Math.PI/2;

        controls = new THREE.OrbitControls(camera, renderer.domElement);


        container.innerHTML = "";
        document.body.appendChild(renderer.domElement);
    }

    function animate()
    {
        requestAnimationFrame( animate );
        planetUniforms.heightC.value = guiControls.heightC;
        planetUniforms.freqC.value = guiControls.freqC;
        planetUniforms.lightPos.value = camera.position;

        // Send environment levels to the fragment shader to decide biomes
        planetUniforms.WatertoSandLevel.value =  guiControls.WatertoSandLevel;
        planetUniforms.SandtoForestLevel.value = guiControls.SandtoForestLevel;
        planetUniforms.ForesttoRockLevel.value = guiControls.ForesttoRockLevel;
        planetUniforms.RocktoSnowLevel.value = guiControls.RocktoSnowLevel;

        // Send uniforms to the waterPlanet, to make the water level even
        waterPlanetUniforms.lightPos.value = camera.position;
        waterPlanetUniforms.heightC.value = guiControls.heightC;
        waterPlanetUniforms.WatertoSandLevel.value = guiControls.WatertoSandLevel;

        renderer.render( scene, camera );
        controls.update();

    }
});
