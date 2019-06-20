import { EventConstant } from "../EventConstant";
import Player from "../Player";
import DamageData from "../Data/DamageData";

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
export default class KrakenSwingHand extends cc.Component {
    @property
    damage = 2;
    // LIFE-CYCLE CALLBACKS:
    isShow = false;

    // onLoad () {}

    start () {
        this.isShow = false;
    }
    onCollisionEnter(other:cc.Collider,self:cc.Collider){
        let player = other.node.getComponent(Player);
        if(player && this.isShow && this.node.active){
            this.node.stopAllActions();
            let dd = new DamageData();
            dd.physicalDamage = this.damage;
            cc.director.emit(EventConstant.PLAYER_TAKEDAMAGE,{detail:{damage:dd,actorName:this.actorName()}});
        }
    }
    actorName(){
        return '海妖';
    }
    // update (dt) {}
}
