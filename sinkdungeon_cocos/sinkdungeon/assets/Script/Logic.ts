import PlayerData from "./Data/PlayerData";
import { EventConstant } from "./EventConstant";
import EquipmentData from "./Data/EquipmentData";
import MapManager from "./Manager/MapManager";
import Dungeon from "./Dungeon";
import MonsterData from "./Data/MonsterData";
import StatusData from "./Data/StatusData";
import InventoryManager from "./Manager/InventoryManager";
import ProfileData from "./Data/ProfileData";
import BulletData from "./Data/BulletData";
import ItemData from "./Data/ItemData";
import Random from "./Utils/Random";
import TalentData from "./Data/TalentData";
import ProfileManager from "./Manager/ProfileManager";

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
export default class Logic extends cc.Component {
    static readonly BOSS_LEVEL_1: number = 10;
    static readonly CHAPTER00: number = 0;
    static readonly CHAPTER01: number = 1;
    static readonly CHAPTER02: number = 2;
    static readonly CHAPTER03: number = 3;
    static readonly CHAPTER04: number = 4;
    static equipments: { [key: string]: EquipmentData } = null;
    static equipmentNameList:string[] = [];
    //怪物json
    static monsters: { [key: string]: MonsterData } = null;
    //图片资源
    static spriteFrames: { [key: string]: cc.SpriteFrame } = null;
    //状态json
    static debuffs: { [key: string]: StatusData } = null;
    //子弹json
    static bullets: { [key: string]: BulletData } = null;
    //子弹json
    static items: { [key: string]: ItemData } = null;

    static level = 0;
    static chapterName = 0;

    static playerData: PlayerData = new PlayerData();
    static inventoryManager: InventoryManager = new InventoryManager();

    static talentList:TalentData[] = new Array();
    static hasTalentMap: { [key: number]: boolean } = {};
    static isPickedTalent = false;

    static mapManager: MapManager = new MapManager();
    static coins = 0;//金币
    static ammo = 30;//子弹
    static killCount = 0;//杀敌数
    static time = '00:00:00';
    static seed = 5;
    static isFirst = 0;
    static isCheatMode = false;//作弊

    static profileManager:ProfileManager = new ProfileManager();

    onLoad() {
        //关闭调试
        // cc.director.setDisplayStats(false);
        cc.game.setFrameRate(60);
        cc.game.addPersistRootNode(this.node);
        // cc.view.enableAntiAlias(false);
        // cc.macro.DOWNLOAD_MAX_CONCURRENT = 10;
        let manager = cc.director.getCollisionManager();
        manager.enabled = true;
        cc.director.getPhysicsManager().enabled = true;
        // manager.enabledDebugDraw = true;
        //     cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit |
        // cc.PhysicsManager.DrawBits.e_pairBit |
        // cc.PhysicsManager.DrawBits.e_centerOfMassBit |
        // cc.PhysicsManager.DrawBits.e_jointBit |
        // cc.PhysicsManager.DrawBits.e_shapeBit
        ;
        cc.director.on(EventConstant.LOADINGNEXTLEVEL, (event) => {
            this.loadingNextLevel();
        });
        cc.director.on(EventConstant.LOADINGROOM, (event) => {
            this.loadingNextRoom(event.detail.dir);
        });
    }

    start() {
       
    }
    static saveData(){
        Logic.profileManager.data.playerData = Logic.playerData.clone();
        Logic.profileManager.saveData();
    }
    static resetData() {
        Logic.profileManager.data = new ProfileData();
        Logic.level = Logic.profileManager.data.level;
        Logic.playerData = Logic.profileManager.data.playerData.clone();
        Logic.inventoryManager = Logic.profileManager.data.inventoryManager;
        Logic.talentList = Logic.profileManager.data.talentList;
        Logic.ammo = Logic.profileManager.data.ammo;
        Logic.hasTalentMap = {};
        Logic.mapManager.reset(Logic.level);
        Logic.mapManager.loadDataFromSave();
        Dungeon.WIDTH_SIZE = 15;
        Dungeon.HEIGHT_SIZE = 9;
        let c = cc.sys.localStorage.getItem('coin');
        Logic.coins = c ? parseInt(c) : 0;
        Logic.isPickedTalent = false;
    }
    static loadList(talentList: TalentData[]) {
        Logic.talentList = talentList;
        Logic.hasTalentMap = {};
        for (let t of talentList) {
            let temp = new TalentData();
            temp.valueCopy(t);
            Logic.talentList.push(temp);
            Logic.hasTalentMap[temp.id] = true;
        }
    }
    static addTalent(id: number) :boolean{
        let data = new TalentData();
        data.id = id;
        let hasit = false;
        for (let t of Logic.talentList) {
            if(id == t.id){
                hasit = true;
            }
        }
        if(!hasit){
            Logic.talentList.push(data);
            Logic.hasTalentMap[data.id] = true;
            Logic.isPickedTalent = true;
            return true;
        }
        return false;
    }
    static hashTalent(id: number): boolean {
        return Logic.hasTalentMap[id]&&Logic.hasTalentMap[id]==true;
    }
    
    static changeDungeonSize() {
        let mapData: string[][] = Logic.mapManager.getCurrentMapData().map;
        if (mapData && mapData.length > 0) {
            Dungeon.WIDTH_SIZE = mapData.length;
            Dungeon.HEIGHT_SIZE = mapData[0].length;
            // Logic.playerData.pos=cc.v2(Math.round(Dungeon.WIDTH_SIZE/2-1),Math.round(Dungeon.HEIGHT_SIZE/2-1));
        }
    }
    loadingNextRoom(dir: number) {
        let room = Logic.mapManager.loadingNextRoom(dir);
        if (room) {
            Logic.changeDungeonSize();
            switch (dir) {
                case 0: Logic.playerData.pos = cc.v2(Math.round(Dungeon.WIDTH_SIZE / 2 - 1), 0); break;
                case 1: Logic.playerData.pos = cc.v2(Math.round(Dungeon.WIDTH_SIZE / 2 - 1), Dungeon.HEIGHT_SIZE - 1); break;
                case 2: Logic.playerData.pos = cc.v2(Dungeon.WIDTH_SIZE - 1, Math.round(Dungeon.HEIGHT_SIZE / 2 - 1)); break;
                case 3: Logic.playerData.pos = cc.v2(0, Math.round(Dungeon.HEIGHT_SIZE / 2 - 1)); break;
            }
            cc.director.loadScene('loading');
            
        }
    }
    loadingNextLevel() {
        Logic.level++;
        //最多五层
        if (Logic.level > 5 && Logic.chapterName >= Logic.CHAPTER04) {
            cc.director.loadScene('gamefinish')
            
        } else {
            if(Logic.chapterName < Logic.CHAPTER04 && Logic.level > 5){
                Logic.profileManager.data.chapterName++;
                Logic.chapterName++;
                Logic.level = 1;
            }
            Logic.mapManager.reset(Logic.level);
            Logic.profileManager.data.currentPos = Logic.mapManager.currentPos.clone();
            Logic.profileManager.data.rectDungeon = Logic.mapManager.rectDungeon;
            
            Logic.changeDungeonSize();
            Logic.playerData.pos = cc.v2(Math.round(Dungeon.WIDTH_SIZE / 2 - 1), Math.round(Dungeon.HEIGHT_SIZE / 2 - 1));
            Logic.isPickedTalent = false;
            cc.director.loadScene('loading');
        }
    }
    
    static isBossLevel(level: number): boolean {
        return level == Logic.BOSS_LEVEL_1;
    }
    static getRandomNum(min, max): number {//生成一个随机数从[min,max]
        return min + Math.round(Random.rand() * (max - min));
    }
    static getHalfChance(): boolean {
        return Random.rand() > 0.5;
    }
    static getChance(rate:number):boolean{
        return Logic.getRandomNum(0, 100) < rate;
    }
    static getDistance(v1, v2) {
        let x = v1.x - v2.x;
        let y = v1.y - v2.y;
        return Math.sqrt(x * x + y * y);
    }
    static genNonDuplicateID():string{
        return Number(Random.rand().toString().substr(3,16) + Date.now()).toString(36);
      }
    /**随机装备名字 */
    static getRandomEquipType():string{
        return Logic.equipmentNameList[Random.getRandomNum(1,Logic.equipmentNameList.length-1)];
    }
}
