import { PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { PointCloudOctree, Potree } from '@pix4d/three-potree-loader';
import { CameraControls } from './camera-controls';

export class Viewer {
  private targetEl: HTMLElement | undefined;
  private renderer = new WebGLRenderer();
  private scene = new Scene();
  private camera = new PerspectiveCamera(45, NaN, 0.1, 1000);
  private cameraControls = new CameraControls(this.camera);
  private potree = new Potree();
  private pointClouds: PointCloudOctree[] = [];
  private prevTime: number | undefined;
  private reqAnimationFrameHandle: number | undefined;

  initialize(targetEl: HTMLElement): void {
    if (this.targetEl || !targetEl) return;

    this.targetEl = targetEl;
    targetEl.appendChild(this.renderer.domElement);

    this.resize();
    this.addEventListeners();
    window.addEventListener('resize', this.resize);

    requestAnimationFrame(this.loop);
  }

  destroy(): void {
    if (this.targetEl) {
      this.targetEl.removeChild(this.renderer.domElement);
      this.targetEl = undefined;
      this.removeEventListeners();
      window.removeEventListener('resize', this.resize);

      if (this.reqAnimationFrameHandle !== undefined) {
        cancelAnimationFrame(this.reqAnimationFrameHandle);
      }
    }
  }

  private addEventListeners(): void {
    window.addEventListener('wheel', this.handleWheel);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mousedown', this.handleMouseDown);
    window.addEventListener('mouseup', this.handleMouseUp);
  }

  private removeEventListeners(): void {
    window.removeEventListener('wheel', this.handleWheel);
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mousedown', this.handleMouseDown);
    window.removeEventListener('mouseup', this.handleMouseUp);
  }

  private handleWheel = (event: WheelEvent): void => {
    event.preventDefault();
    const delta = event.deltaY > 0 ? -1 : 1;
    this.cameraControls.zoom(delta);
  };

  private isDragging = false;
  private lastMouseX = 0;
  private lastMouseY = 0;

  private handleMouseDown = (event: MouseEvent): void => {
    this.isDragging = true;
    this.lastMouseX = event.clientX;
    this.lastMouseY = event.clientY;
  };

  private handleMouseUp = (): void => {
    this.isDragging = false;
  };

  private handleMouseMove = (event: MouseEvent): void => {
    if (!this.isDragging) return;

    const deltaX = event.clientX - this.lastMouseX;
    const deltaY = event.clientY - this.lastMouseY;

    this.cameraControls.rotate(deltaX, deltaY);
    this.lastMouseX = event.clientX;
    this.lastMouseY = event.clientY;
  };

  load(fileName: string, baseUrl: string): Promise<PointCloudOctree> {
    return this.potree
      .loadPointCloud(fileName, (url) => `${baseUrl}${url}`)
      .then((pco: PointCloudOctree) => {
        this.scene.add(pco);
        this.pointClouds.push(pco);

        this.cameraControls.zoom(0); // Set initial zoom level for default view
        return pco;
      });
  }

  update(dt: number): void {
    this.cameraControls.update();
    this.potree.updatePointClouds(this.pointClouds, this.camera, this.renderer);
  }

  render(): void {
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
    if (this.targetEl) {
      const { width, height } = this.targetEl.getBoundingClientRect();
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    }
  };
}
