import { PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { PointCloudOctree, Potree } from '@pix4d/three-potree-loader';
import { CameraControls } from './camera-controls';

export class Viewer {
  private targetEl: HTMLElement | undefined;
  private renderer: WebGLRenderer | undefined; // Set renderer to undefined initially
  private scene = new Scene();
  private camera = new PerspectiveCamera(45, 1, 0.1, 1000); // Set initial aspect ratio to 1
  private cameraControls = new CameraControls(this.camera);
  private potree = new Potree();
  private pointClouds: PointCloudOctree[] = [];
  private prevTime: number | undefined;
  private reqAnimationFrameHandle: number | undefined;

  initialize(targetEl: HTMLElement): void {
    if (!targetEl || this.targetEl) return; // Ensure targetEl is provided

    this.targetEl = targetEl;
    this.renderer = new WebGLRenderer({ antialias: true }); // Initialize the renderer
    this.renderer.setSize(targetEl.clientWidth, targetEl.clientHeight); // Set initial size
    this.renderer.setClearColor(0x000000); // Set background color to black

    targetEl.appendChild(this.renderer.domElement);

    this.resize(); // Resize the renderer to match the container
    window.addEventListener('resize', this.resize); // Add resize listener

    requestAnimationFrame(this.loop); // Start the animation loop
  }

  destroy(): void {
    if (this.targetEl) {
      this.targetEl.removeChild(this.renderer?.domElement); // Remove renderer's DOM element
      this.targetEl = undefined;

      window.removeEventListener('resize', this.resize);
      if (this.reqAnimationFrameHandle !== undefined) {
        cancelAnimationFrame(this.reqAnimationFrameHandle);
      }
    }
  }

  load(fileName: string, baseUrl: string): Promise<PointCloudOctree> {
    return this.potree
      .loadPointCloud(fileName, (url) => `${baseUrl}${url}`)
      .then((pco: PointCloudOctree) => {
        this.scene.add(pco);
        this.pointClouds.push(pco);
        return pco;
      });
  }

  update(dt: number): void {
    if (!this.renderer) return; // Ensure the renderer is initialized
    this.cameraControls.update(dt);
    this.potree.updatePointClouds(this.pointClouds, this.camera, this.renderer);
  }

  render(): void {
    if (!this.renderer) return; // Ensure the renderer is initialized
    this.renderer.clear();
    this.renderer.render(this.scene, this.camera);
  }

  loop = (time: number): void => {
    this.reqAnimationFrameHandle = requestAnimationFrame(this.loop);

    const prevTime = this.prevTime;
    this.prevTime = time;
    if (prevTime === undefined) return;

    this.update(time - prevTime);
    this.render();
  };

  resize = () => {
    if (this.targetEl && this.renderer) {
      const { width, height } = this.targetEl.getBoundingClientRect();
      this.renderer.setSize(width, height); // Set renderer size
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    }
  };
}
