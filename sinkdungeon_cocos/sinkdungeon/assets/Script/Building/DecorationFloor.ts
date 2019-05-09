import Dungeon from "../Dungeon";
import Logic from "../Logic";
import Building from "./Building";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class DecorationFloor extends Building {

    pos:cc.Vec2;

    changeRes(resName:string){
        let sprite = this.getComponent(cc.Sprite);
        sprite.spriteFrame = Logic.spriteFrames[resName];
        this.node.width = sprite.spriteFrame.getRect().width;
        this.node.height = sprite.spriteFrame.getRect().height;

    }
    setPos(pos:cc.Vec2){
        this.pos = pos;
        this.node.position = Dungeon.getPosInMap(pos);
    }
}