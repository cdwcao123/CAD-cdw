import { BufferGeometry } from './../core/BufferGeometry';
export class WireframeGeometry<TBufferGeometry extends BufferGeometry = BufferGeometry> extends BufferGeometry {
    constructor(geometry?: TBufferGeometry);

    
    type: string;

    parameters: {
        geometry: TBufferGeometry;
    };
}
