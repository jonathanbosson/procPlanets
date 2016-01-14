precision mediump float;

varying vec4 vPosition;
varying vec4 vNormal;

uniform vec3 lightPos;

const vec3 ambientColor = vec3(0.1, 0.1, 0.1);
const vec3 specColor = vec3(1.0, 1.0, 1.0);

void main()
{
  // water color
	vec3 finalColor = vec3(0.1, 0.2, 0.4);

	// Blinn Phong Shading
	vec3 newNormal = normalize(vec3(vNormal));
  vec3 lightDir = normalize(lightPos - vec3(vPosition));

  float lambertian = max(dot(lightDir,vec3(vNormal)), 0.0);
  float specular = 0.0;

  if(lambertian > 0.0) {
    vec3 viewDir = normalize(-vec3(vPosition));
    vec3 halfDir = normalize(lightDir + viewDir);
    float specAngle = max(dot(halfDir, vec3(vNormal)), 0.0);
    specular = pow(specAngle, 16.0);
  }

  gl_FragColor = vec4(ambientColor +
                      lambertian * finalColor +
                      specular * specColor, 1.0);





}