import Equipment from "./Equipment";
import Logic from "../Logic";
import EquipmentData from "../Data/EquipmentData";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class EquipmentDialogNew extends cc.Component {
    @property(cc.Label)
    labelTile: cc.Label = null;
    @property(cc.Label)
    infoBase: cc.Label = null;//基础属性
    @property(cc.Label)
    info1: cc.Label = null;//附加词条1
    @property(cc.Label)
    info2: cc.Label = null;//附加词条2
    @property(cc.Label)
    info3: cc.Label = null;//附加词条3
    @property(cc.Label)
    infoSuit1: cc.Label = null;//套装附加词条1
    @property(cc.Label)
    infoSuit2: cc.Label = null;//套装附加词条2
    @property(cc.Label)
    infoSuit3: cc.Label = null;//套装附加词条3
    @property(cc.Label)
    infoDesc: cc.Label = null;//描述
    alpha = 0;
    showSpeed = 3;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    }

    start() {
        // Logic.setAlias(this.node);
        this.alpha = 0;
        this.node.opacity = 0;
        this.showSpeed = 30;
    }
    refreshDialog(equipment: EquipmentData) {
        this.labelTile.string = equipment.prefix + " " + equipment.nameEn;
        this.labelTile.node.color=this.labelTile.node.color.fromHEX(equipment.titlecolor);
        this.infoBase.string = equipment.infobase;
        this.info1.string = equipment.info1;
        this.info2.string = equipment.info2;
        this.info3.string = equipment.info3;
        this.infoSuit1.string = equipment.suit1;
        this.infoSuit2.string = equipment.suit2;
        this.infoSuit3.string = equipment.suit3;
        this.infoDesc.string = equipment.desc;
    }
    showDialog() {
        this.showSpeed = 3;
        this.node.opacity = 255;
    }
    hideDialog() {
        this.showSpeed = 30;
        this.node.opacity = 0;
    }

    update(dt) {
        // this.node.opacity = this.lerp(this.node.opacity, this.alpha, dt * this.showSpeed);
    }
    lerp(a, b, r) {
        return a + (b - a) * r;
    }
}
