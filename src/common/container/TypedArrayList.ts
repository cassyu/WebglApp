
export class TypedArrayList<T extends Uint16Array | Float32Array | Uint8Array> {
    // 内部使用类型数组，类型数组必须是Uint16Array | Float32Array | Uint8Array之一
    private _array: T;

    // 如果需要在ArrayList<T>的构造函数中new一个类型数组，必须要提供该类型数组的构造函数签名
    private _typedArrayConstructor: ( new ( length: number ) => T );

    // _length表示当前已经使用过的元素个数，而_capacity是指当前已经预先内存分配好的的元素个数
    private _length: number;
    private _capacity: number;

    // 提供一个回调函数，当_capacity发生改变时，调用该回调函数
    public capacityChangedCallback: ( ( arrayList: TypedArrayList<T> ) => void ) | null;

    public constructor ( typedArrayConstructor: new ( capacity: number ) => T, capacity: number = 8 )
    {
        this._typedArrayConstructor = typedArrayConstructor;

        this._capacity = capacity; // 而预先分配内存的个数为capacity

        // 确保初始化时至少有8个元素的容量
        if ( this._capacity === 0 )
        {
            this._capacity = 8; // 默认分配8个元素内存
        }

        this._array = new this._typedArrayConstructor( this._capacity ); // 预先分配capacity个元素的内存

        this._length = 0;  // 初始化时，其_length为0

        this.capacityChangedCallback = null; //默认情况下，回调函数为null
    }

    public get length (): number 
    {
        return this._length;
    }

    public get capacity (): number
    {
        return this._capacity;
    }

    public get typeArray (): T
    {
        return this._array;
    }

    // 最简单高效的处理方式，直接设置_length为0，重用整个类型数组
    public clear (): void
    {
        this._length = 0;
    }

    public pushArray(nums:number[]):void{
        for(let i:number=0; i < nums.length;i++){
            this.push(nums[i]);
        }
    }

    public push ( num: number ): number
    {
        // 如果当前的length超过了预先分配的内存容量
        // 那就需要进行内存扩容
        if ( this._length >= this._capacity )
        {
            //如果最大容量数>0
            if ( this._capacity > 0 )
            {
                //增加当前的最大容量数(每次翻倍增加)
                this._capacity += this._capacity;
                console.log( "curr capacity = " + this._capacity );
            }
            let oldArray: T = this._array;
            this._array = new this._typedArrayConstructor( this._capacity );
            // 将oldArray中的数据复制到新建的array中
            this._array.set( oldArray );
            // 如果有回调函数，则调用回调函数
            if ( this.capacityChangedCallback )
            {
                this.capacityChangedCallback( this );
            }
        }

        this._array[ this._length ] = num;
        return this._length++;
    }

    public at ( idx: number ): number
    {
        if ( idx < 0 || idx >= this.length )
        {
            throw new Error( "索引越界！" );
        }
        // 都是number类型
        let ret: number = this._array[ idx ];
        return ret;
    }

    public subArray ( start: number = 0, end: number = this.length ): T
    {
        return this._array.subarray( start, end ) as T;
    }

    public slice ( start: number = 0, end: number = this.length ): T
    {
        return this._array.slice( start, end ) as T;
    }


}
