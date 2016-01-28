precision mediump float;

uniform float WatertoSandLevel;
uniform float heightC;  // change the height of the mountains

varying vec4 vPosition;
varying vec4 vNormal;

void main()
{
    float radius;
    vPosition = modelMatrix * vec4(position, 1.0);
    vNormal = modelMatrix * vec4(normal, 1.0);

    radius = 0.3 + 0.13*heightC + 0.9*WatertoSandLevel;
    radius = radius*-1.0;
    vPosition = vPosition + vNormal * 0.2 * radius;

    gl_Position = projectionMatrix * viewMatrix * vPosition;
}
