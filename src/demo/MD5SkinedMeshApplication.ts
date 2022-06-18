import { CameraApplication } from "../lib/CameraApplication";
import { GLProgram } from "../webgl/WebGLProgram";
import { GLProgramCache } from "../webgl/WebGLProgramCache";
import { HttpRequest } from "../common/utils/HttpRequest";
import { vec3, mat4 } from "../common/math/TSM";
import { GLMeshBuilder, EVertexLayout } from "../webgl/WebGLMesh";
import { GLAttribState } from "../webgl/WebGLAttribState";
import { GLTextureCache } from "../webgl/WebGLTextureCache";
import { MD5SkinedMesh } from "../lib/MD5SkinedMesh";

export class MD5SkinedMeshApplication extends CameraApplication
{
    public program: GLProgram;
    public texBuilder:GLMeshBuilder;

    public angle:number = 0;
    public model:MD5SkinedMesh;

    public constructor ( canvas: HTMLCanvasElement )
    {
        super( canvas, { premultipliedAlpha: false }, true );
        this.program = GLProgramCache.instance.getMust( "texture" );
        this.texBuilder = new GLMeshBuilder( this.gl, GLAttribState.POSITION_BIT | GLAttribState.TEXCOORD_BIT, this.program, GLTextureCache.instance.getMust("default"), EVertexLayout.INTERLEAVED );
        this.model = new MD5SkinedMesh();
        this.camera.z = 4;
    }

    public async run():Promise<void>{
        let response: string = await HttpRequest.loadTextFileAsync( MD5SkinedMesh.path + "suit.md5mesh" );
        this.model.parse(response);
        await this.model.loadTextures(this.gl);
        response = await HttpRequest.loadTextFileAsync( MD5SkinedMesh.path + "suit_walk.md5anim");
        this.model.parseAnim(response);
        this.start();
    }

    public currFrame:number = 0;
    public update ( elapsedMsec: number, intervalSec: number ): void{
        super.update(elapsedMsec,intervalSec);
        this.currFrame++;
        this.currFrame %= this.model.anims[0].frames.length; // 连续播放
        this.model.playAnim(0,this.currFrame); // 更新0号动画序列
        this.angle += 0.5;
    }

    public render():void{
        this.matStack.loadIdentity();
        this.matStack.rotate(-90,vec3.right);

        this.matStack.rotate(this.angle,vec3.forward);
        mat4.product(this.camera.viewProjectionMatrix,this.matStack.modelViewMatrix,mat4.m0);
        this.model.drawBindPose(this.texBuilder,mat4.m0);

        this.matStack.pushMatrix();
        this.matStack.translate(new vec3([1.0,0,0]));
        mat4.product(this.camera.viewProjectionMatrix,this.matStack.modelViewMatrix,mat4.m0);
        this.model.drawAnimPose(this.texBuilder,mat4.m0);
        this.matStack.popMatrix();
        
    }
}