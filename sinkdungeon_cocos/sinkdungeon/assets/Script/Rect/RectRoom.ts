import RectDoor from "./RectDoor";
import Dungeon from "../Dungeon";
import RoomType from "./RoomType";
import Logic from "../Logic";
import Random from "../Utils/Random";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


export default class RectRoom {
    //未清理
    public static readonly STATE_SLEEP = 0;
    //已发现
    public static readonly STATE_FOUND = 1;
    //已清理
    public static readonly STATE_CLEAR = 2;

    public static ROOM_WIDTH = Dungeon.WIDTH_SIZE;
    public static ROOM_HEIGHT = Dungeon.HEIGHT_SIZE;
    public static readonly TOPDOOR = 0;
    public static readonly BOTTOMDOOR = 1;
    public static readonly LEFTDOOR = 2;
    public static readonly RIGHTDOOR = 3;
    // The doors.0:top 1:bottom 2:left 3:right
    doors: RectDoor[];
    /// The type.房间类型
    roomType: RoomType;
    x: number;
    y: number;
    /// The state.房间状态
    state: number = RectRoom.STATE_SLEEP;
    //保存地图数据下标
    saveIndex = 0;
    //伪随机数种子
    seed = 0;

    constructor(x: number, y: number, roomType: RoomType) {
        this.x = x;
        this.y = y;
        this.roomType = roomType;
        this.seed = RectRoom.getRandomNum(0,100000000);
        this.init();
    }

    public initFromSave(room: RectRoom): RectRoom {
        if (!room) {
            return;
        }
        this.x = room.x;
        this.y = room.y;
        this.roomType = new RoomType(0,'');
        this.roomType.valueCopy(room.roomType);
        this.doors = room.doors;
        this.state = room.state;
        this.saveIndex = room.saveIndex;
        this.seed = room.seed?room.seed:RectRoom.getRandomNum(0,100000000);
        return this;
    }
    
    private init(): void {
        this.state = RectRoom.STATE_SLEEP;
        if (this.doors == null) {
            this.doors = new Array(4);
            for (let i = 0; i < 4; i++) {
                this.doors[i] = new RectDoor(i, false,false);
            }
        }
    }

    public isFound():boolean{
        return this.state == RectRoom.STATE_FOUND||this.state == RectRoom.STATE_CLEAR;
    }

    public get positionStr(): string {
        return `${this.x}${this.y}`;
    }
    static getRandomNum(min, max): number {//生成一个随机数从[min,max]
        return min + Math.round(Random.rand() * (max - min));
    }
}

