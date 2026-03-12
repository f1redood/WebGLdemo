import MeshPool from "https://f1redood.github.io/WebGLdemo/Render/Mesh/MeshPool.js";

export default {
  gl: null,
  vbo: null,
  ebo: null,
  pool: new MeshPool(),
  init: function(canvas) {
    this.gl = canvas.getContext("webgl2");

    this.vbo = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo);

    this.ebo = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.ebo);

    var vertShaderCode = `
      #version 300 es
      precision mediump float;
      
      layout(location = 0) in vec3 aPos;
      layout(location = 1) in vec2 aCoords;
      
      out vec2 coords;
      
      void main() {
      	coords = aCoords;
        gl_Position = proj * view * vec4(aPos, 1);
      }
    `;
    
    var vertShader = this.gl.createShader(this.gl.VERTEX_SHADER);
    this.gl.shaderSource(vertShader, vertShaderCode);
    this.gl.compileShader(vertShader);
    
    var fragShaderCode = `
      #version 300 es
      precision mediump float;

      uniform sampler2D atlas;
      
      out vec4 fragColor;
      in vec2 coords;
      
      void main() {
      	fragColor = texture(atlas, coords);
      }
    `;
    
    var fragShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
    this.gl.shaderSource(fragShader, fragShaderCode);
    this.gl.compileShader(fragShader);
    
    var program = this.gl.createProgram();
    this.gl.attachShader(program, vertShader);
    this.gl.attachShader(program, fragShader);
    this.gl.linkProgram(program);
    
    this.gl.useProgram(program);
    
    this.gl.viewport(0, 0, canvas.width, canvas.height);
    
    this.gl.enableVertexAttribArray(0);
    this.gl.vertexAttribPointer(
    	0,
      3,
      this.gl.FLOAT,
      false,
      20,
      0
    );
    
    this.gl.enableVertexAttribArray(1);
    this.gl.vertexAttribPointer(
    	1,
      2,
      this.gl.FLOAT,
      false,
      20,
      12
    );

    var img = new Image();
    img.src = "https://f1redood.github.io/WebGLdemo/Render/atlas.png";
    img.onload = () => {
      this.gl.activateTexture(this.gl.TEXTURE0);
      this.gl.bindTexture(this.gl.TEXTURE_2D, img);
      this.gl.uniform1i(this.gl.getUniformLocation("atlas"), this.gl.TEXTURE0);
    };
  },
  createPerspectiveMatrix: function(fov, aspect, near, far) {
    const f = 1.0 / Math.tan(fov * Math.PI / 360);
    const rangeInv = 1.0 / (near - far);
  
    return new Float32Array([
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (near + far) * rangeInv, -1,
      0, 0, near * far * rangeInv * 2, 0
    ]);
  },
  createViewMatrix: function(x, y, z) {
      return new Float32Array([
          1,  0,  0,  0,
          0,  1,  0,  0,
          0,  0,  1,  0,
         -x, -y, -z,  1
      ]);
  }
};
