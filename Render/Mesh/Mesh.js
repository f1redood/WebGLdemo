export default class Mesh {
  constructor(verts, inds, uvs) {
    [this.verts, this.inds, this.uvs] = [verts, inds, uvs];
  }
}
