export default class MeshPool {
  meshes = [];
  
  add(mesh) {
    this.meshes.push(mesh);
  }

  render(gl) {
    var verts = [];
    var inds = [];
    
    for (var mesh of this.meshes) {
      for (var v = 0; v < mesh.verts.length; v++) {
        verts.push(mesh.verts[v*3]);
        verts.push(mesh.verts[v*3 + 1]);
        verts.push(mesh.verts[v*3 + 2]);

        verts.push(mesh.uvs[v*2]);
        verts.push(mesh.uvs[v*2 + 1]);
      }

      inds = mesh.inds;
    }

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.DYNAMIC_DRAW);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(inds), gl.DYNAMIC_DRAW);

    gl.drawElements(gl.TRIANGLES, inds.length, gl.UNSIGNED_SHORT, 0);
  }
}
