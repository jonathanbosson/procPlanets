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

    // Terrain elevation
    elevation = 0.1 * (snoise(0.01 * vec3(vPosition)));
    elevation = 1.2 * (snoise(0.02 * vec3(vPosition)));
    elevation += 0.25 * (snoise(0.04 * vec3(vPosition)));
    elevation += 0.125 * (snoise(0.08 * vec3(vPosition)));
    elevation += 0.0625 * (snoise(0.160 * vec3(vPosition)));
    elevation += 0.03125 * (snoise(0.320 * vec3(vPosition)));
    elevation += 0.0156 * (snoise(0.640 * vec3(vPosition)));

    vPosition = vPosition + vNormal * 0.2 * elevation;

    elevation = elevation*-1.0;

    gl_Position = projectionMatrix * viewMatrix * vPosition;
}
