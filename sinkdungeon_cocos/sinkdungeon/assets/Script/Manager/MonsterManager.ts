import Monster from "../Monster";
import MonsterData from "../Data/MonsterData";
import Dungeon from "../Dungeon";
import Logic from "../Logic";
import Slime from "../Boss/Slime";
import MonsterRandomAttr from "./MonsterRandomAttr";
import RoomType from "../Rect/RoomType";
import Boss from "../Boss/Boss";

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
export default class MonsterManager extends cc.Component {
    public static readonly BOSS_KRAKEN = 'BOSS_KRAKEN';
    public static readonly MONSTER_SLIME = 'monster000';
    public static readonly MONSTER_GOBLIN = 'monster001';
    public static readonly MONSTER_MUMMY = 'monster002';
    public static readonly MONSTER_ANUBIS = 'monster003';
    public static readonly MONSTER_PIRATE = 'monster004';
    public static readonly MONSTER_SAILOR = 'monster005';
    public static readonly MONSTER_OCTOPUS = 'monster006';
    public static readonly MONSTER_KILLER = 'monster007';
    public static readonly MONSTER_STRONGSAILOR = 'monster008';
    public static readonly MONSTER_CHEST = 'monster009';
    public static readonly MONSTER_GARGOYLE = 'monster010';
    public static readonly MONSTER_CHICKEN = 'monster011';
    public static readonly MONSTER_SCARAB = 'monster012';
    public static readonly MONSTER_GOBLIN_ARCHER = 'monster013';
    public static readonly MONSTER_TERRORDRONE = 'monster014';
    public static readonly MONSTER_WEREWOLF = 'monster015';
    public static readonly MONSTER_DUMMY = 'monster016';
    public static readonly MONSTER_ZEBRA = 'monster017';
    public static readonly MONSTER_GIRAFFE = 'monster018';
    public static readonly MONSTER_ZOOMBIE = 'monster019';
    public static readonly MONSTER_ELECTRICEYE = 'monster020';
    public static readonly MONSTER_FISH = 'monster021';
    public static readonly MONSTER_CROCODILE = 'monster022'
    public static readonly MONSTER_SNAKE = 'monster023'
    public static readonly MONSTER_DEMON = 'monster024'
    public static readonly MONSTER_WARLOCK = 'monster025'
    public static readonly MONSTER_SPIDER = 'monster026'
    public static readonly MONSTER_BOOMER = 'monster027'
    public static readonly MONSTER_SANDSTATUE = 'monster028'
    public static readonly MONSTER_HIPPO = 'monster029'

    // LIFE-CYCLE CALLBACKS:

    // update (dt) {}

    // LIFE-CYCLE CALLBACKS:
    @property(cc.Prefab)
    monster: cc.Prefab = null;
    @property(cc.Prefab)
    kraken: cc.Prefab = null;
    @property(cc.Prefab)
    captain: cc.Prefab = null;
    @property(cc.Prefab)
    slime: cc.Prefab = null;
    @property(cc.Prefab)
    warmachine = null;
    @property(cc.Prefab)
    rah = null;
    @property(cc.Prefab)
    iceDemon = null;
    @property(cc.Prefab)
    evilEye = null;
    @property(cc.Prefab)
    dryad = null;
    @property(cc.Prefab)
    sphinx = null;
    @property(cc.Prefab)
    dragon = null;
    readonly maxHealth00 = 200;
    readonly maxHealth01 = 300;
    readonly maxHealth02 = 300;
    readonly maxHealth03 = 400;
    readonly maxHealth04 = 400;
    readonly maxHealth05 = 500;
    readonly maxHealth06 = 500;
    readonly maxHealth07 = 600;
    readonly maxHealth08 = 600;
    readonly maxHealth09 = 800;

    private monsters: Monster[] = new Array();//房间怪物列表
    private bosses: Boss[] = new Array();
    get monsterList() {
        return this.monsters;
    }
    get bossList() {
        return this.bosses;
    }
    monsterRandomAttr: MonsterRandomAttr = new MonsterRandomAttr;

    /**添加怪物 */
    public addMonsterFromData(resName: string, indexPos: cc.Vec3, dungeon: Dungeon) {
        this.addMonster(this.getMonster(resName, dungeon), indexPos);
    }
    public addMonstersAndBossFromMap(dungeon: Dungeon, mapDataStr: string, indexPos: cc.Vec3) {
        if (mapDataStr == 'a0') {
            this.addMonsterFromData(MonsterManager.MONSTER_ZEBRA, indexPos, dungeon);
        }
        else if (mapDataStr == 'a1') {
            this.addMonsterFromData(MonsterManager.MONSTER_TERRORDRONE, indexPos, dungeon);
        }
        else if (mapDataStr == 'a2') {
            this.addMonsterFromData(MonsterManager.MONSTER_KILLER, indexPos, dungeon);
        }
        else if (mapDataStr == 'a3') {
            this.addMonsterFromData(MonsterManager.MONSTER_ZOOMBIE, indexPos, dungeon);
        }
        else if (mapDataStr == 'a4') {
            this.addMonsterFromData(MonsterManager.MONSTER_ELECTRICEYE, indexPos, dungeon);
        }
        else if (mapDataStr == 'a5') {
            this.addMonsterFromData(MonsterManager.MONSTER_GIRAFFE, indexPos, dungeon);
        }
        else if (mapDataStr == 'b0') {
            this.addMonsterFromData(MonsterManager.MONSTER_PIRATE, indexPos, dungeon);
        }
        else if (mapDataStr == 'b1') {
            this.addMonsterFromData(MonsterManager.MONSTER_SAILOR, indexPos, dungeon);
        }
        else if (mapDataStr == 'b2') {
            this.addMonsterFromData(MonsterManager.MONSTER_OCTOPUS, indexPos, dungeon);
        }
        else if (mapDataStr == 'b3') {
            this.addMonsterFromData(MonsterManager.MONSTER_FISH, indexPos, dungeon);
        }
        else if (mapDataStr == 'b4') {
            this.addMonsterFromData(MonsterManager.MONSTER_BOOMER, indexPos, dungeon);
        }
        else if (mapDataStr == 'b5') {
            this.addMonsterFromData(MonsterManager.MONSTER_STRONGSAILOR, indexPos, dungeon);
        }
        else if (mapDataStr == 'c0') {
            this.addMonsterFromData(MonsterManager.MONSTER_SLIME, indexPos, dungeon);
        }
        else if (mapDataStr == 'c1') {
            this.addMonsterFromData(MonsterManager.MONSTER_GOBLIN, indexPos, dungeon);
        }
        else if (mapDataStr == 'c2') {
            this.addMonsterFromData(MonsterManager.MONSTER_GOBLIN_ARCHER, indexPos, dungeon);
        }
        else if (mapDataStr == 'c3') {
            this.addMonsterFromData(MonsterManager.MONSTER_SNAKE, indexPos, dungeon);
        }
        else if (mapDataStr == 'c4') {
            this.addMonsterFromData(MonsterManager.MONSTER_WEREWOLF, indexPos, dungeon);
        }
        else if (mapDataStr == 'c5') {
            this.addMonsterFromData(MonsterManager.MONSTER_CHICKEN, indexPos, dungeon);
        }
        else if (mapDataStr == 'c6') {
            this.addMonsterFromData(MonsterManager.MONSTER_HIPPO, indexPos, dungeon);
        }
        else if (mapDataStr == 'd0') {
            this.addMonsterFromData(MonsterManager.MONSTER_MUMMY, indexPos, dungeon);
        }
        else if (mapDataStr == 'd1') {
            this.addMonsterFromData(MonsterManager.MONSTER_ANUBIS, indexPos, dungeon);
        }
        else if (mapDataStr == 'd2') {
            this.addMonsterFromData(MonsterManager.MONSTER_SCARAB, indexPos, dungeon);
            this.addMonsterFromData(MonsterManager.MONSTER_SCARAB, indexPos, dungeon);
            this.addMonsterFromData(MonsterManager.MONSTER_SCARAB, indexPos, dungeon);
            this.addMonsterFromData(MonsterManager.MONSTER_SCARAB, indexPos, dungeon);
            this.addMonsterFromData(MonsterManager.MONSTER_SCARAB, indexPos, dungeon);
        }
        else if (mapDataStr == 'd3') {
            this.addMonsterFromData(MonsterManager.MONSTER_CROCODILE, indexPos, dungeon);
        }
        else if (mapDataStr == 'd4') {
            this.addMonsterFromData(MonsterManager.MONSTER_SANDSTATUE, indexPos, dungeon);
        }
        else if (mapDataStr == 'e0') {
            this.addMonsterFromData(MonsterManager.MONSTER_ELECTRICEYE, indexPos, dungeon);
        }
        else if (mapDataStr == 'e1') {
            this.addMonsterFromData(MonsterManager.MONSTER_DEMON, indexPos, dungeon);
        }
        else if (mapDataStr == 'e2') {
            this.addMonsterFromData(MonsterManager.MONSTER_WARLOCK, indexPos, dungeon);
        }
        else if (mapDataStr == 'e3') {
            this.addMonsterFromData(MonsterManager.MONSTER_SPIDER, indexPos, dungeon);
        }
        else if (mapDataStr == 'e4') {
            this.addMonsterFromData(MonsterManager.MONSTER_GARGOYLE, indexPos, dungeon);
        }
        else if (mapDataStr == 'f0') {
            this.addMonsterFromData(MonsterManager.MONSTER_CHEST, indexPos, dungeon);
        }
        else if (mapDataStr == 'g0') {
            this.addMonsterFromData(MonsterManager.MONSTER_DUMMY, indexPos, dungeon);
        }
        else if (mapDataStr == 'z0') {
            this.addBoss(this.iceDemon, 'iconboss000', this.maxHealth00, 0, 2, indexPos, dungeon);
        }
        else if (mapDataStr == 'z1') {
            this.addBoss(this.warmachine, 'iconboss001', this.maxHealth01, 2, 3.5, indexPos, dungeon);
        }
        else if (mapDataStr == 'z2') {
            this.addBoss(this.captain, 'iconboss002', this.maxHealth02, 2, 0, indexPos, dungeon);
        }
        else if (mapDataStr == 'z3') {
            dungeon.shakeForKraken();
            this.addBoss(this.kraken, 'iconboss003', this.maxHealth03, 2, 3.5
                , cc.v3(Math.floor(Dungeon.WIDTH_SIZE / 2), Dungeon.HEIGHT_SIZE + 4), dungeon);
        }
        else if (mapDataStr == 'z4') {
            this.addBossSlime(0, indexPos, dungeon);
        }
        else if (mapDataStr == 'z5') {
            this.addBoss(this.dryad, 'iconboss005', this.maxHealth05, 2, 2, indexPos, dungeon);
        }
        else if (mapDataStr == 'z6') {
            this.addBoss(this.rah, 'iconboss006', this.maxHealth06, 2, 2, indexPos, dungeon);
        }
        else if (mapDataStr == 'z7') {
            this.addBoss(this.sphinx, 'iconboss007', this.maxHealth07, 2, 2, indexPos, dungeon);
        }
        else if (mapDataStr == 'z8') {
            this.addBoss(this.evilEye, 'iconboss008', this.maxHealth08, 2, 2, indexPos, dungeon);
        }
        else if (mapDataStr == 'z9') {
            this.addBoss(this.dragon, 'iconboss009', this.maxHealth09, 5, 2, indexPos, dungeon);
        }
    }
    /**
     * 
     * @param resName 图片
     * @param monsterNode Monster prefab的结点
     * @param parent 父节点
     */
    private getMonster(resName: string, dungeon: Dungeon): Monster {
        let monsterPrefab: cc.Node = null;
        monsterPrefab = cc.instantiate(this.monster);
        monsterPrefab.active = false;
        monsterPrefab.parent = dungeon.node;
        let monster = monsterPrefab.getComponent(Monster);
        let data = new MonsterData();
        let rand4save = Logic.mapManager.getCurrentRoomRandom4Save();
        monster.dungeon = dungeon;
        data.valueCopy(Logic.monsters[resName]);
        //10%几率随机属性
        if (rand4save.rand() < 0.1) {
            this.monsterRandomAttr.addRandomAttrs(2, rand4save);
            data = this.monsterRandomAttr.updateMonsterData(data);
            monster.attrmap = this.monsterRandomAttr.attrmap;
        }
        //5%的几率变异
        let variationRate = 5;
        let up = 0;
        if (Logic.mapManager.getCurrentRoomType().isEqual(RoomType.DANGER_ROOM)) {
            up = 10;
        }
        if (Logic.mapManager.getCurrentRoomType().isEqual(RoomType.INSANE_ROOM)) {
            up = 30;
        }
        variationRate = variationRate + Logic.chapterIndex * 2 + Logic.level * 2 + up;
        monster.isVariation = rand4save.getRandomNum(0, 100) < variationRate;
        if (monster.isVariation) {
            data.Common.maxHealth = data.Common.maxHealth * 2;
            data.Common.damageMin = data.Common.damageMin * 2;
            data.currentHealth = data.currentHealth * 2;
            if (data.melee > 0) {
                data.melee = data.melee > 1 ? data.melee - 1 : 1;
            }
            if (data.remote > 0) {
                data.remote = data.remote > 1 ? data.remote - 1 : 1;
            }
            if (data.dash > 0) {
                data.dash = data.dash > 1 ? data.dash - 1 : 1;
            }
            data.Common.moveSpeed = data.Common.moveSpeed > 0 ? (data.Common.moveSpeed + 100) : 0;
        }
        //5%几率添加元素
        let rand = rand4save.getRandomNum(0, 100);
        let df = rand4save.getRandomNum(80, 100);
        let er = rand4save.getRandomNum(80, 100);
        let isAddElement = rand <= 5;
        rand = rand4save.getRandomNum(0, 4);
        if (isAddElement) {
            data.Common.magicDamage += 1;
            data.Common.magicDefence = data.Common.magicDefence + df > 100 ? 100 : data.Common.magicDefence + df;
            switch (rand) {
                case 0:
                    data.Common.iceRate = data.Common.iceRate + er > 100 ? 100 : data.Common.iceRate + er;
                    data.bodyColor = '#CCFFFF';
                    break;
                case 1:
                    data.Common.fireRate = data.Common.fireRate + er > 100 ? 100 : data.Common.fireRate + er;
                    data.bodyColor = '#FF6633';
                    break;
                case 2:
                    data.Common.lighteningRate = data.Common.lighteningRate + er > 100 ? 100 : data.Common.lighteningRate + er;
                    data.bodyColor = '#0099FF';
                    break;
                case 3:
                    data.Common.toxicRate = data.Common.toxicRate + er > 100 ? 100 : data.Common.toxicRate + er;
                    data.bodyColor = '#66CC00';
                    break;
                case 4:
                    data.Common.curseRate = data.Common.curseRate + er > 100 ? 100 : data.Common.curseRate + er;
                    data.bodyColor = '#660099';
                    break;
            }
        }

        monster.data = data;

        monster.isDisguising = data.disguise > 0;
        if (monster.isDisguising) {
            monster.changeBodyRes(data.resName, Monster.RES_DISGUISE);
        } else {
            monster.changeBodyRes(resName);
        }
        monster.addAttrIcon();

        return monster;
    }
    private addMonster(monster: Monster, pos: cc.Vec3) {
        //激活
        monster.node.active = true;
        monster.pos = pos;
        monster.node.position = Dungeon.getPosInMap(pos);
        this.monsterList.push(monster);
    }
    public addBossSlime(type: number, index: cc.Vec3, dungeon: Dungeon) {
        if (!this.bosses) {
            return;
        }
        this.bosses.push(this.getSlime(dungeon, index.clone(), type));
    }

    private addBoss(prefabAsset: cc.Prefab, resName: string, maxHealth: number, attackPoint: number, delayTime: number, indexPos: cc.Vec3, dungeon: Dungeon) {
        let prefab = cc.instantiate(prefabAsset);
        prefab.active = false;
        prefab.parent = dungeon.node;
        let boss = prefab.getComponent(Boss);
        boss.dungeon = dungeon;
        let data = new MonsterData();
        data.resName = resName;
        data.updateHA(maxHealth, maxHealth, attackPoint);
        boss.data = data;
        boss.transportBoss(indexPos.x, indexPos.y);
        boss.healthBar = dungeon.bossHealthBar;
        boss.node.active = true;
        this.bosses.push(boss);
        this.scheduleOnce(() => {
            boss.showBoss();
        }, delayTime);
    }

    private getSlime(dungeon: Dungeon, posIndex: cc.Vec3, type: number): Slime {
        let prefab: cc.Node = null;
        prefab = cc.instantiate(this.slime);
        prefab.active = false;
        prefab.parent = dungeon.node;
        let slime = prefab.getComponent(Slime);
        slime.dungeon = dungeon;
        let data = new MonsterData();
        data.resName = "iconboss004";
        data.Common.moveSpeed = 200;
        switch (type) {
            case 0: data.updateHA(this.maxHealth04, this.maxHealth04, 2); slime.scaleSize = 2; break;
            case 1: data.updateHA(200, 200, 2); slime.scaleSize = 1.5; break;
            case 2: data.updateHA(100, 100, 2); slime.scaleSize = 1; break;
            case 3: data.updateHA(50, 50, 2); slime.scaleSize = 0.5; break;
            case 4: data.updateHA(25, 25, 2); slime.scaleSize = 0.3; break;
            case 5: data.updateHA(10, 10, 1); slime.scaleSize = 0.2; break;
            default: data.updateHA(5, 5, 1); slime.scaleSize = 0.2; break;
        }
        slime.slimeType = type;
        slime.node.scaleY = slime.scaleSize;
        slime.node.scaleX = slime.scaleSize;
        slime.data = data;
        slime.transportBoss(posIndex.x, posIndex.y);
        slime.healthBar = dungeon.bossHealthBar;
        slime.node.active = true;
        this.bosses.push(slime);
        return slime;
    }
    addRandomMonsters(dungeon: Dungeon) {
        let arr = new Array();
        let rand4save = Logic.mapManager.getCurrentRoomRandom4Save();
        let num = rand4save.getRandomNum(1, 3);
        let up = 0;
        if (Logic.mapManager.getCurrentRoomType().isEqual(RoomType.DANGER_ROOM)) {
            up = 2;
        }
        if (Logic.mapManager.getCurrentRoomType().isEqual(RoomType.INSANE_ROOM)) {
            up = 5;
        }
        switch (Logic.chapterIndex) {
            case Logic.CHAPTER00: arr = [MonsterManager.MONSTER_ZEBRA, MonsterManager.MONSTER_TERRORDRONE, MonsterManager.MONSTER_KILLER
                , MonsterManager.MONSTER_ZOOMBIE, MonsterManager.MONSTER_ELECTRICEYE, MonsterManager.MONSTER_GIRAFFE];
                num = rand4save.getRandomNum(1, 3);
                break;
            case Logic.CHAPTER01: arr = [MonsterManager.MONSTER_PIRATE, MonsterManager.MONSTER_SAILOR, MonsterManager.MONSTER_OCTOPUS
                , MonsterManager.MONSTER_STRONGSAILOR
                , MonsterManager.MONSTER_FISH, MonsterManager.MONSTER_BOOMER];
                num = rand4save.getRandomNum(2, 3); break;
            case Logic.CHAPTER02: arr = [MonsterManager.MONSTER_SLIME, MonsterManager.MONSTER_GOBLIN, MonsterManager.MONSTER_GOBLIN_ARCHER
                , MonsterManager.MONSTER_WEREWOLF, MonsterManager.MONSTER_SNAKE, MonsterManager.MONSTER_CHICKEN, MonsterManager.MONSTER_HIPPO];
                num = rand4save.getRandomNum(2, 4); break;
            case Logic.CHAPTER03: arr = [MonsterManager.MONSTER_MUMMY, MonsterManager.MONSTER_ANUBIS, MonsterManager.MONSTER_SCARAB, MonsterManager.MONSTER_CROCODILE
                , MonsterManager.MONSTER_SANDSTATUE];
                num = rand4save.getRandomNum(2, 5); break;
            case Logic.CHAPTER04: arr = [MonsterManager.MONSTER_GARGOYLE, MonsterManager.MONSTER_WARLOCK, MonsterManager.MONSTER_DEMON, MonsterManager.MONSTER_ELECTRICEYE
                , MonsterManager.MONSTER_SPIDER];
                num = rand4save.getRandomNum(3, 6); break;
            case Logic.CHAPTER05: arr = [MonsterManager.MONSTER_GARGOYLE, MonsterManager.MONSTER_WARLOCK, MonsterManager.MONSTER_DEMON, MonsterManager.MONSTER_ELECTRICEYE
                , MonsterManager.MONSTER_SPIDER];
                num = rand4save.getRandomNum(3, 6); break;
            case Logic.CHAPTER099: arr = [MonsterManager.MONSTER_ZEBRA, MonsterManager.MONSTER_TERRORDRONE, MonsterManager.MONSTER_KILLER
                , MonsterManager.MONSTER_ZOOMBIE, MonsterManager.MONSTER_ELECTRICEYE, MonsterManager.MONSTER_GIRAFFE];
                num = rand4save.getRandomNum(1, 3);
                break;
        }
        let indexmap = [];
        for (let i = 0; i < dungeon.floorIndexmap.length; i++) {
            indexmap.push(dungeon.floorIndexmap[i]);
        }
        for (let i = 0; i <= num + up; i++) {
            if (indexmap.length < 1) {
                continue;
            }
            let randindex = rand4save.getRandomNum(0, indexmap.length - 1);
            let pos = indexmap[randindex];
            indexmap.splice(randindex, 1);
            dungeon.addMonsterFromData(arr[rand4save.getRandomNum(0, arr.length - 1)], pos.x, pos.y);
        }
    }

}
