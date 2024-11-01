import { PerspectiveCamera, Vector3 } from 'three';

export class CameraControls {
  zoomSpeed = 1.0;
  panSpeed = 0.5;
  distance = 20.0; // Set a reasonable default distance
  target = new Vector3(0, 0, 0); // Center of the point cloud
  private sphericalCoords = {
    radius: this.distance,
    theta: Math.PI / 4,
    phi: Math.PI / 4,
  };

  constructor(private camera: PerspectiveCamera) {
    this.updateCameraPosition();
  }

  update(): void {
    this.camera.lookAt(this.target);
  }

  zoom(delta: number): void {
    this.sphericalCoords.radius += delta * this.zoomSpeed;
    this.sphericalCoords.radius = Math.max(5, this.sphericalCoords.radius); // Minimum zoom distance
    this.updateCameraPosition();
  }

  pan(deltaX: number, deltaY: number): void {
    const panOffset = new Vector3(
      -deltaX * this.panSpeed,
      deltaY * this.panSpeed,
      0
    );

    this.target.add(panOffset);
    this.updateCameraPosition();
  }

  rotate(deltaX: number, deltaY: number): void {
    const sensitivity = 0.005;
    this.sphericalCoords.theta -= deltaY * sensitivity; // Vertical rotation
    this.sphericalCoords.phi -= deltaX * sensitivity;   // Horizontal rotation

    // Clamp vertical rotation to prevent flipping
    this.sphericalCoords.theta = Math.max(0.1, Math.min(Math.PI - 0.1, this.sphericalCoords.theta));

    this.updateCameraPosition();
  }

  private updateCameraPosition(): void {
    const x =
      this.sphericalCoords.radius *
      Math.sin(this.sphericalCoords.theta) *
      Math.cos(this.sphericalCoords.phi);
    const y = this.sphericalCoords.radius * Math.cos(this.sphericalCoords.theta);
    const z =
      this.sphericalCoords.radius *
      Math.sin(this.sphericalCoords.theta) *
      Math.sin(this.sphericalCoords.phi);

    this.camera.position.set(x, y, z);
    this.camera.lookAt(this.target);
  }
}
