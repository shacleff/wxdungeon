import Player from "../Player";
import Dungeon from "../Dungeon";
import Logic from "../Logic";
import Building from "./Building";
import IndexZ from "../Utils/IndexZ";
import BuildingData from "../Data/BuildingData";

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
export default class ShopTable extends Building {

    // LIFE-CYCLE CALLBACKS:
    static readonly EQUIPMENT = 0;
    static readonly ITEM = 1;
    info: cc.Node;
    label: cc.Label;

    onLoad() {
        this.info = this.node.getChildByName('info');
        this.label = this.info.getComponentInChildren(cc.Label);
    }

    start() {

    }
    showItem() {
        if (this.node.parent && !this.data.isSaled) {
            let dungeon = this.node.parent.getComponent(Dungeon);
            if (dungeon) {
                let rand4save = Logic.mapManager.getCurrentRoomRandom4Save();
                if(this.data.shopType == ShopTable.EQUIPMENT){
                    dungeon.addEquipment(Logic.getRandomEquipType(rand4save), this.data.defaultPos, this.data.equipdata, 3, this);
                }else if(this.data.shopType == ShopTable.ITEM){
                    dungeon.addItem(Dungeon.getPosInMap(this.data.defaultPos),Logic.getRandomItemType(rand4save),this);
                }
            }
        }
    }
    setDefaultPos(defaultPos: cc.Vec3) {
        this.data.defaultPos = defaultPos;
        this.node.position = Dungeon.getPosInMap(defaultPos);
        this.node.zIndex = IndexZ.getActorZIndex(this.node.position);
    }
    timeDelay = 0;
    update(dt) {
        this.timeDelay += dt;
        if (this.timeDelay > 0.2) {
            this.label.string = `${this.data.price}`;
            this.info.opacity = this.data.isSaled ? 0 : 255;
            let saveTable = Logic.mapManager.getCurrentMapBuilding(this.data.defaultPos);
            if (saveTable) {
                saveTable.isSaled = this.data.isSaled;
                saveTable.price = this.data.price;
            }
        }
    }
    onCollisionStay(other: cc.Collider, self: cc.Collider) {
        let player = other.node.getComponent(Player);
        if (player) {
        }
    }
    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        let player = other.node.getComponent(Player);
        if (player) {
        }
    }
    onCollisionExit(other: cc.Collider, self: cc.Collider) {
        let player = other.node.getComponent(Player);
        if (player) {
        }
    }
}
