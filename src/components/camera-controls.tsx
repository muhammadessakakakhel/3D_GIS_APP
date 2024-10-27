import { PerspectiveCamera, Vector3 } from 'three';

export class CameraControls {
  rotationSpeed = 0.001;
  distance = 10.0;
  target = new Vector3();
  private angle = 0.0;

  constructor(private camera: PerspectiveCamera) {
    // Set an initial camera position to avoid undefined errors
    this.camera.position.set(0, 0, this.distance);
    this.camera.lookAt(this.target);
  }

  update(dt: number): void {
    this.angle += this.rotationSpeed * dt;

    const x = Math.sin(this.angle) * this.distance;
    const z = Math.cos(this.angle) * this.distance;
    this.camera.position.set(x, 0, z);
    this.camera.lookAt(this.target);
  }
}
