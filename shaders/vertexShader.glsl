precision mediump float;

varying vec4 vPosition;
varying vec4 vNormal;
varying vec3 worldCoord;


uniform float time;

void main()
{
    float n, elevation;
    vPosition = modelMatrix * vec4(position, 1.0);
    vNormal = modelMatrix * vec4(normal, 1.0);
    worldCoord = vPosition.xyz;

    //TERRAIN
    //elevation = 0.1 * (snoise(vec3(vPosition)) - 0.5);
    elevation = 0.5 * (snoise(4.0 * vec3(vPosition)) - 0.5);
    elevation += 0.25 * (snoise(8.0 * vec3(vPosition)) - 0.5);
    elevation += 0.125 * (snoise(16.0 * vec3(vPosition)) - 0.5);
    elevation += 0.0625 * (snoise(32.0 * vec3(vPosition)) - 0.5);
    elevation += 0.03125 * (snoise(64.0 * vec3(vPosition)) - 0.5);
    elevation += 0.0156 * (snoise(128.0 * vec3(vPosition)) - 0.5);

    //vPosition = vec4(vPosition.x + vNormal.x * 0.2 * elevation, vPosition.y + vNormal.y * 0.2 * elevation, vPosition.z + vNormal.z * 0.2 * elevation, 1.0);
    vPosition = vPosition + vNormal * 0.2 * elevation;

    //WATER
    float n1 = snoise(vec3(0.01, position.y*time*0.05, 0.03));

    //Set pixel to either terrain or water
    vec4 pos;
    length(vNormal) < 0.0 ?
    	pos = vec4(vPosition.x, vPosition.y, vPosition.z, 1.0) :
    	pos = vPosition;

    gl_Position = projectionMatrix * viewMatrix * pos;
}
