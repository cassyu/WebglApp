import { GLTexture } from "./WebGLTexture";
import { Dictionary } from "../common/container/Dictionary";

export class GLTextureCache{
    public static readonly instance: GLTextureCache = new GLTextureCache();

    public set(key:string,value:GLTexture){
        this._dict.insert(key,value);
    }

    public getMaybe(key:string):GLTexture|undefined{
        let ret:GLTexture|undefined = this._dict.find(key);
        return ret;
    }

    public getMust(key:string):GLTexture {
        let ret:GLTexture|undefined = this._dict.find(key);
        if(ret === undefined){
            throw new Error(key+"对应的Program不存在!!!");
        }
        return ret;
    }

    public remove(key:string):boolean{
        return this._dict.remove(key);
    }

    private _dict:Dictionary<GLTexture>;
    // 私有构造函数
    private constructor(){
        this._dict = new Dictionary<GLTexture>();
    }
}
