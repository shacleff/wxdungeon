import Actor from "../Base/Actor";
import DamageData from "../Data/DamageData";
import FromData from "../Data/FromData";
import BuildingData from "../Data/BuildingData";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export abstract default class Building extends Actor {
    data:BuildingData = new BuildingData();
    takeDamage(damage: DamageData):boolean{
        return false;
    }
    addStatus(statusType: string, from: FromData) {
    }
    actorName(){
        return '';
    }
}
