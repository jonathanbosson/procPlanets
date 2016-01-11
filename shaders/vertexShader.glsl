precision mediump float;

varying vec4 vPosition;
varying vec4 vNormal;
varying float elevation;

uniform float time;

void main()
{
    float n, waterElev;
    vPosition = modelMatrix * vec4(position, 1.0);
    vec4 initPos = vec4(position, 1.0);
    vNormal = modelMatrix * vec4(normal, 1.0);

    vec4 waterPos = vPosition;
    vec4 earthPos = vPosition;

    //TERRAIN
    elevation = 1.0 * (snoise(0.01 * vec3(vPosition)) - 0.5);
    elevation = 0.5 * (snoise(0.02 * vec3(vPosition)) - 0.5);
    elevation += 0.25 * (snoise(0.04 * vec3(vPosition)) - 0.5);
    elevation += 0.125 * (snoise(0.08 * vec3(vPosition)) - 0.5);
    elevation += 0.0625 * (snoise(0.160 * vec3(vPosition)) - 0.5);
    elevation += 0.03125 * (snoise(0.320 * vec3(vPosition)) - 0.5);
    elevation += 0.0156 * (snoise(0.640 * vec3(vPosition)) - 0.5);

    earthPos = vPosition + vNormal * 0.2 * elevation;

    //WATER
    waterElev = 0.0001 * snoise(128.0 * vec3(vPosition));
    waterPos = vPosition + vNormal * 0.2 * waterElev;

    //Set pixel to either terrain or water
    vec4 pos;
    elevation < -0.3 ?
    	pos = earthPos :
    	pos = waterPos;

    gl_Position = projectionMatrix * viewMatrix * pos;
}
