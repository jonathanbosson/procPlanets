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
    var planet, planetGeometry, planetMaterial, planetUniforms, planetAttributes;
    var waterPlanet, waterPlanetGeometry, waterPlanetMaterial, waterPlanetUniforms, waterPlanetAttributes;
    var lightMaterial, lightAnimation;

    // Function called by the sliders
    var guiControls = new function(){
      this.heightC = 0.99;
      this.freqC = 0.99;
      this.WatertoSandLevel = -0.09;
      this.SandtoForestLevel = 0.08;
      this.ForesttoRockLevel = 0.31;
      this.RocktoSnowLevel = 1.12;
      this.lightAnimation = false;
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
        //renderer.context.getExtension('OES_standard_derivatives');

        // GUI
        var gui = new dat.GUI();

        // Height and frequency of the mountains
        gui.add(guiControls, 'heightC', 0.0, 2.0);
        gui.add(guiControls, 'freqC', 0.0, 2.5);

        // Biome sliders
        gui.add(guiControls, 'WatertoSandLevel', -2.0, 0.5);
        gui.add(guiControls, 'SandtoForestLevel', -1.0, 0.9);
        gui.add(guiControls, 'ForesttoRockLevel', -1.0, 0.9);
        gui.add(guiControls, 'RocktoSnowLevel', 0.0, 3.0);

        // Checkbox
        gui.add( guiControls, 'lightAnimation', false ).onChange( function() {
          this.lightAnimate = true;
        } );

        // Light - nothing atm
        light = new THREE.PointLight(0xffffff);
        lightMaterial = new THREE.MeshBasicMaterial( {color: 0xffff40, transparent: true, opacity: 0.5 });
        light.add( new THREE.Mesh( new THREE.SphereGeometry( 5, 16, 8 ), lightMaterial ) );
        light.position.set(0, 0, 0);
        scene.add(light);

        // Geometry
        planetGeometry = new THREE.SphereGeometry(70, 200, 200);
        waterPlanetGeometry = new THREE.SphereGeometry(60, 200, 200);

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
          waves:
          {
              type: "f",  //float
              value: 1.0  //initialized to 0
          },
          lightPos:
          {
              type: "v3",  // vec3
              value: new THREE.Vector3()
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
        // Secondary smaller planet to make water levels even
        waterPlanet = new THREE.Mesh(waterPlanetGeometry, waterPlanetMaterial);
        waterPlanet.position.set(0, 0, 0);
        scene.add(waterPlanet);

        controls = new THREE.OrbitControls(camera, renderer.domElement);


        container.innerHTML = "";
        document.body.appendChild(renderer.domElement);
    }

    function animate()
    {
        requestAnimationFrame( animate );
        sendUniforms();
        sendLight();



        renderer.render( scene, camera );
        controls.update();
    }

    function sendLight()
    {
      // Get time as a changing variable
      var theta = Date.now() * 0.0005;
      var phi = Date.now() * 0.0002;
      // Animate waves
      waterPlanetUniforms.waves.value = Math.cos(theta * 2.0);

      // Control light animation
      if (guiControls.lightAnimation) {
        // Set opacity = 1 to see lightsource
        lightMaterial.opacity = 1.0;

        // Set new light position after Spherical coordinates to define a rotation around the planet
        light.position.x = 200 * Math.cos(theta) * Math.sin(phi);
        light.position.y = 200 * Math.sin(theta) * Math.sin(phi);
        light.position.z = 200 * Math.cos(phi);



        // Send in new position to the shaders
        planetUniforms.lightPos.value = light.position;
        waterPlanetUniforms.lightPos.value = light.position;

      } else {
        // Set opacity = 0 to make lightsource invisible
        lightMaterial.opacity = 0.0;

        planetUniforms.lightPos.value = camera.position;
        waterPlanetUniforms.lightPos.value = camera.position;

      }
    }

    function sendUniforms()
    {
      // Send height and frequency variables to the shaders
      planetUniforms.heightC.value = guiControls.heightC;
      planetUniforms.freqC.value = guiControls.freqC;

      // Send environment levels to the fragment shader to decide biomes
      planetUniforms.WatertoSandLevel.value =  guiControls.WatertoSandLevel;
      planetUniforms.SandtoForestLevel.value = guiControls.SandtoForestLevel;
      planetUniforms.ForesttoRockLevel.value = guiControls.ForesttoRockLevel;
      planetUniforms.RocktoSnowLevel.value = guiControls.RocktoSnowLevel;

      // Send uniforms to the waterPlanet, to make the water level even
      waterPlanetUniforms.heightC.value = guiControls.heightC;
      waterPlanetUniforms.WatertoSandLevel.value = guiControls.WatertoSandLevel;
    }
});
