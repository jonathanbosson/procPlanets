precision mediump float;

varying vec4 vPosition;
varying vec4 vNormal;
varying float elevation;

uniform vec3 lightPos;

uniform float WatertoSandLevel;
uniform float SandtoForestLevel;
uniform float ForesttoRockLevel;
uniform float RocktoSnowLevel;

const vec3 ambientColor = vec3(0.1, 0.1, 0.1);
const vec3 specColor = vec3(1.0, 1.0, 1.0);

void main()
{
	vec3 finalColor, rockColor, waterColor, forestColor, sandColor, snowColor;
	float n = 0.6 * snoise(0.3*vec3(vPosition));
  n += 0.3 * snoise(0.6*vec3(vPosition));

	// colors for the rock
	rockColor  = 0.4*vec3(0.2, 0.2, 0.2);
  vec3 lightRock  = 0.4*vec3(0.5, 0.5, 0.5);
  vec3 darkRock  = rockColor - 0.05*snoise(16.0 * vec3(vPosition));

  rockColor = mix(rockColor, lightRock, clamp(n, 0.0, 1.0));
  rockColor = mix(rockColor, darkRock, clamp(n, 0.0, 1.0));

	// forest color
	float colorNoise = 0.5 - 0.2 * snoise(vec3(vPosition) * 128.0);
	forestColor = vec3(0.0, 0.5, 0.0);
	vec3 forestNoise = 0.5*forestColor;
	forestNoise -= 0.05 * snoise(16.0 * vec3(vPosition));
	forestColor = mix(forestColor, forestNoise, clamp(n, 0.0, 1.0));

	// other colors
	snowColor = vec3(0.9, 0.9, 0.9);
	snowColor -= 0.05 * snoise(16.0 * vec3(vPosition));
	sandColor = vec3(0.75, 0.68, 0.39);
	waterColor = vec3(0.1, 0.2, 0.4);

	// interpolation distance
	float id = 0.3;
	// the biome's ranges (in elevation)
	float deepMin = -3.0;
	float deepMax = WatertoSandLevel;
	float sandMin = WatertoSandLevel;
	float sandMax = SandtoForestLevel;
	float forestMin = SandtoForestLevel;
	float forestMax = ForesttoRockLevel;
	float rockMin = ForesttoRockLevel;
	float rockMax = RocktoSnowLevel;
	float snowMin = RocktoSnowLevel;
	float snowMax = 3.0;

	// detect where to apply which biome
	float deep = smoothstep(deepMin - id, deepMin, elevation) - smoothstep(deepMax - id, deepMax, elevation);
	float sand = smoothstep(sandMin - id, sandMin, elevation) - smoothstep(sandMax - id, sandMax, elevation);
	float forest = smoothstep(forestMin - 0.15, forestMin, elevation) - smoothstep(forestMax - 0.15, forestMax, elevation);
	float snow = smoothstep(snowMin - id, snowMin, elevation) - smoothstep(snowMax - id, snowMax, elevation);

	// apply ALL the colors
	finalColor = mix(rockColor, sandColor, sand);
	finalColor = mix(finalColor, forestColor, forest);
	finalColor = mix(finalColor, snowColor, snow);
	finalColor = mix(finalColor, waterColor, deep);

	// Blinn Phong Shading
	vec3 newNormal = normalize(vec3(vNormal));
	// normalize(cross(dFdx(vec3(vNormal)), dFdy(vec3(vNormal))));
  vec3 lightDir = normalize(lightPos - vec3(vPosition));

  float lambertian = max(dot(lightDir, newNormal), 0.0);
  float specular = 0.0;

  if(lambertian > 0.0) {
    vec3 viewDir = normalize(-vec3(newNormal));
    vec3 halfDir = normalize(lightDir + viewDir);
    float specAngle = max(dot(halfDir, newNormal), 0.0);
    specular = pow(specAngle, 16.0);
  }

  gl_FragColor = vec4(ambientColor +
                      lambertian * finalColor +
                      specular * specColor, 1.0);





}
