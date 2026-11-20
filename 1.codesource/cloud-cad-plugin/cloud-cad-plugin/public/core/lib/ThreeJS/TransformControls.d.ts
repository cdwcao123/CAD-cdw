import { Camera } from './cameras/Camera';
import { Object3D } from './core/Object3D';
import { Raycaster } from './core/Raycaster';



export class TransformControls extends Object3D {

  constructor(camera: Camera, domElement: HTMLCanvasElement);

  
  object: Object3D;

  updateMatrixWorld() :void;

  pointerHover( pointer:{x:number, y:number, button:number} ) :void;

  pointerDown( pointer:{x:number, y:number, button:number} ) :void;

  pointerMove( pointer:{x:number, y:number, button:number} ) :void;

  pointerUp( pointer:{x:number, y:number, button:number} ) :void;

  dispose() :void;

  
  attach(object: Object3D): this;

  
  detach() :this;

  reset() :void

  getRaycaster() :Raycaster;

  

  getMode() :string;

  setMode( mode:string ) :void;

  setTranslationSnap( translationSnap:number|null ) :void;

  setRotationSnap( rotationSnap:number|null ) :void;

  setScaleSnap( scaleSnap :number|null ) :void;

  setSize( size :number) :void;

  setSpace( space:string ):void;
}
