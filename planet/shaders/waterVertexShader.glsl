precision mediump float;

uniform float WatertoSandLevel;
uniform float heightC;
uniform float waves;

varying vec4 vPosition;
varying vec4 vNormal;

void main()
{
    float radius, bump;
    vPosition = modelMatrix * vec4(position, 1.0);
    vNormal = modelMatrix * vec4(normal, 1.0);

    // Change waterPlanet's radius to make it follow the parent planet
    radius = 0.06 + 0.026*heightC + 0.18*WatertoSandLevel;
    radius = radius*-1.0;

    // Add bumps to the water
    bump = 0.01 * waves * (snoise((20.0 + 0.02*waves) * vec3(vPosition)));
    bump += 0.005 * waves * (snoise((20.0 + 0.04*waves) * vec3(vPosition)));

    vPosition = vPosition + vNormal * (radius + bump);

    gl_Position = projectionMatrix * viewMatrix * vPosition;
}
