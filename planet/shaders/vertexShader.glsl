precision mediump float;

uniform float time;
uniform float heightC;  // change the height of the mountains
uniform float freqC;  // frequency, change the 'seed' of the mountains

varying vec4 vPosition;
varying vec4 vNormal;
varying float elevation;

void main()
{
    float n, waterElev;
    vPosition = modelMatrix * vec4(position, 1.0);
    vec4 initPos = vec4(position, 1.0);
    vNormal = modelMatrix * vec4(normal, 1.0);

    // Terrain elevation
    elevation = heightC * 0.1 * (snoise(freqC * 0.01 * vec3(vPosition)));
    elevation = heightC * 1.2 * (snoise(freqC * 0.02 * vec3(vPosition)));
    elevation += heightC * 0.25 * (snoise(freqC * 0.04 * vec3(vPosition)));
    elevation += heightC * 0.125 * (snoise(freqC * 0.08 * vec3(vPosition)));
    elevation += heightC * 0.0625 * (snoise(freqC * 0.160 * vec3(vPosition)));
    elevation += heightC * 0.03125 * (snoise(freqC * 0.320 * vec3(vPosition)));
    elevation += heightC * 0.0156 * (snoise(freqC * 0.640 * vec3(vPosition)));

    vPosition = vPosition + vNormal * 0.2 * elevation;

    elevation = elevation*-1.0;

    gl_Position = projectionMatrix * viewMatrix * vPosition;
}
