import { Layer } from './type/interface';
import { McDbLayer } from 'McCore/mcDb/layer/mcDbLayer';
declare const _default: import('vue').DefineComponent<import('vue').ExtractPropTypes<{
    layerInfo: {
        type: () => Layer;
        required: true;
    };
    isFrozen: {
        type: BooleanConstructor;
        default: boolean;
    };
    selectPointer: {
        type: BooleanConstructor;
        default: boolean;
    };
    entity: {
        type: () => McDbLayer;
    };
}>, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<{
    layerInfo: {
        type: () => Layer;
        required: true;
    };
    isFrozen: {
        type: BooleanConstructor;
        default: boolean;
    };
    selectPointer: {
        type: BooleanConstructor;
        default: boolean;
    };
    entity: {
        type: () => McDbLayer;
    };
}>> & Readonly<{}>, {
    isFrozen: boolean;
    selectPointer: boolean;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {}, HTMLDivElement>;
export default _default;
