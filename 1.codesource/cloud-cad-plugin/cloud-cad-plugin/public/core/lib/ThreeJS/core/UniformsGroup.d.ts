import { EventDispatcher } from './EventDispatcher';
import { Uniform } from './Uniform';
import { Usage } from '../constants';

export class UniformsGroup extends EventDispatcher {
    constructor();

    readonly isUniformsGroup: true;

    id: number;

    usage: Usage;

    uniforms: Uniform[];

    add(uniform: Uniform): this;

    remove(uniform: Uniform): this;

    setName(name: string): this;

    setUsage(value: Usage): this;

    dispose(): this;

    copy(source: UniformsGroup): this;

    clone(): UniformsGroup;
}
