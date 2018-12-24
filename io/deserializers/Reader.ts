/*--------------------------------------------------------*\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: http://www.hprose.com/                 |
|                   http://www.hprose.org/                 |
|                                                          |
\*________________________________________________________*/
/*--------------------------------------------------------*\
|                                                          |
| hprose/io/deserializers/Reader.ts                        |
|                                                          |
| hprose Reader for TypeScript.                            |
|                                                          |
| LastModified: Dec 24, 2018                               |
| Author: Ma Bingyao <andot@hprose.com>                    |
|                                                          |
\*________________________________________________________*/

import ByteStream from '../ByteStream';
import TypeManager from '../TypeManager';
import TypeInfo from './TypeInfo';
import ReaderInterface from './ReaderInterface';
import Deserializers from './Deserializers';
import { readInt, readString, readCount } from './ValueReader';

class ReaderRefer {
    private readonly ref: any[] = [];
    public get lastIndex(): number {
        return this.ref.length - 1;
    };
    public add(value: any): void {
        this.ref.push(value);
    }
    public set(index: number, value: any): void {
        this.ref[index] = value;
    }
    public read(index: number): any {
        return this.ref[index];
    }
    public reset(): void {
        this.ref.length = 0;
    }
}

export default class Reader implements ReaderInterface {
    private readonly refer?: ReaderRefer;
    private readonly ref: TypeInfo[] = [];
    public defaultLongType: 'number' | 'string' = 'string';
    public defaultDictType: 'object' | 'map' = 'object';
    constructor(public readonly stream: ByteStream, simple: boolean = false) {
        this.refer = simple ? undefined : new ReaderRefer();
    }
    deserialize(type?: Function): any {
        return Deserializers.getInstance(type).deserialize(this);
    }
    read(tag: number, type?: Function): any {
        return Deserializers.getInstance(type).read(this, tag);
    }
    readClass(): void {
        const stream = this.stream;
        const name = readString(stream);
        const count = readCount(stream);
        const names: string[] = new Array<string>(count);
        const strDeserialize = Deserializers.getInstance(String);
        for (let i = 0; i < count; ++i) {
            names[i] = strDeserialize.deserialize(this);
        }
        stream.readByte();
        this.ref.push({
            name: name,
            names: names,
            type: TypeManager.getType(name)
        });
    }
    getTypeInfo(index: number): TypeInfo {
        return this.ref[index];
    }
    readReference(): any {
        return this.refer ? this.refer.read(readInt(this.stream)) : undefined;
    }
    addReference(value: any): void {
        if (this.refer) this.refer.add(value);
    }
    setReference(index: number, value: any): void {
        if (this.refer) this.refer.set(index, value);
    }
    get lastReferenceIndex(): number {
        return this.refer ? this.refer.lastIndex : -1;
    }
    reset(): void {
        if (this.refer) this.refer.reset();
        this.ref.length = 0;
    }
}