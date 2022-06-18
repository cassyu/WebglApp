import { GLProgram } from "./WebGLProgram";
import { Dictionary } from "../common/container/Dictionary";

// 单例设计模式
export class GLProgramCache
{
    // 只初始化一次，使用的是public static readonly声明方式
    public static readonly instance: GLProgramCache = new GLProgramCache();

    private _dict: Dictionary<GLProgram>;

    // 私有构造函数
    private constructor ()
    {
        this._dict = new Dictionary<GLProgram>();
        console.log( "create new GLProgramCache!!" );
    }

    public set ( key: string, value: GLProgram )
    {
        this._dict.insert( key, value );
    }

    // 可能返回undefined类型
    public getMaybe ( key: string ): GLProgram | undefined
    {
        let ret: GLProgram | undefined = this._dict.find( key );
        return ret;
    }

    // 如果返回undefined，直接抛错
    public getMust ( key: string ): GLProgram
    {
        let ret: GLProgram | undefined = this._dict.find( key );
        if ( ret === undefined )
        {
            throw new Error( key + "对应的Program不存在!!!" );
        }
        return ret;
    }

    public remove ( key: string ): boolean
    {
        return this._dict.remove( key );
    }
}