import Dungeon from "../Dungeon";
import Logic from "../Logic";
import EquipmentData from "../Data/EquipmentData";
import EquipmentDescData from "../Data/EquipmentDescData";
import Equipment from "../Equipment/Equipment";
import ShopTable from "../Building/ShopTable";
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

const { ccclass, property } = cc._decorator;

@ccclass
export default class EquipmentManager extends cc.Component {
    public static readonly TYPE_WEAPON = 'weapon';
    public static readonly TYPE_REMOTE = 'remote';
    public static readonly TYPE_CLOTHES = 'clothes';
    public static readonly TYPE_HELMET = 'helmet';
    public static readonly TYPE_CLOAK = 'cloak';
    public static readonly TYPE_TROUSERS = 'trousers';
    public static readonly TYPE_SHOES = 'shoes';
    public static readonly TYPE_GLOVES = 'gloves';

    public static readonly EMPTY = "emptyequipment";
    public static readonly WEAPON_DINNERFORK = "weapon000";
    public static readonly WEAPON_KNIFE = "weapon001";
    public static readonly WEAPON_CHOPPER = "weapon002";
    public static readonly WEAPON_HUGEBLADE = "weapon003";
    public static readonly WEAPON_PITCHFORK = "weapon004";
    public static readonly WEAPON_HUGEAXE = "weapon005";
    public static readonly WEAPON_CROWBAR = "weapon006";
    public static readonly WEAPON_KATANA = "weapon007";
    public static readonly WEAPON_FRUITKNIFE = "weapon008";
    public static readonly WEAPON_HAPPYFIRE = "weapon009";
    public static readonly WEAPON_SADICE = "weapon010";
    public static readonly WEAPON_EGYPTWAND = "weapon011";
    public static readonly WEAPON_TOXICDAGGER = "weapon012";
    public static readonly WEAPON_OLDROOTDAGGER = "weapon013";
    public static readonly WEAPON_COOKCHOPPER = "weapon014";
    public static readonly WEAPON_LIGHTENINGBLADE = "weapon015";
    public static readonly WEAPON_JUNGLEFORK = "weapon016";
    public static readonly WEAPON_KUNAI = "weapon017";
    public static readonly WEAPON_DEATH = "weapon018";
    public static readonly WEAPON_SHADOW = "weapon019";
    public static readonly WEAPON_BLOOD = "weapon020";
    public static readonly REMOTE_CROSSBOW = "remote001";
    public static readonly REMOTE_LONGBOW = "remote002";
    public static readonly REMOTE_WAND = "remote003";
    public static readonly REMOTE_ALIENGUN = "remote004";
    public static readonly REMOTE_WINCHESTER = "remote005";
    public static readonly REMOTE_RPG = "remote006";
    public static readonly REMOTE_SHURIKEN = "remote007";
    public static readonly REMOTE_CHICKEN = "remote008";
    public static readonly CLOTHES_VEST = "clothes001";
    public static readonly CLOTHES_SHIRT = "clothes002";
    public static readonly CLOTHES_NAVY = "clothes003";
    public static readonly CLOTHES_PIRATE = "clothes004";
    public static readonly CLOTHES_BUCKET = "clothes005";
    public static readonly CLOTHES_REDROBE = "clothes006";
    public static readonly CLOTHES_WHITEROBE = "clothes007";
    public static readonly CLOTHES_GENTLEMAN = "clothes008";
    public static readonly CLOTHES_RADIATION = "clothes009";
    public static readonly CLOTHES_JUNGLE = "clothes010";
    public static readonly CLOTHES_PHARAOH = "clothes011";
    public static readonly CLOTHES_KNIGHT = "clothes012";
    public static readonly CLOTHES_DEATH = "clothes013";
    public static readonly CLOTHES_ENERGY = "clothes014";
    public static readonly HELMET_BUCKETHAT = "helmet002";
    public static readonly HELMET_PIRATEHAT = "helmet003";
    public static readonly HELMET_REDHAT = "helmet004";
    public static readonly HELMET_WHITEHAT = "helmet005";
    public static readonly HELMET_PHARAOH = "helmet006";
    public static readonly HELMET_CAT = "helmet007";
    public static readonly HELMET_CHIEF = "helmet008";
    public static readonly HELMET_HORUS = "helmet009";
    public static readonly HELMET_GENTLEMAN = "helmet010";
    public static readonly HELMET_CHICKEN = "helmet011";
    public static readonly HELMET_DUCK = "helmet012";
    public static readonly HELMET_GOOSE = "helmet013";
    public static readonly HELMET_RADIATION = "helmet014";
    public static readonly HELMET_JUNGLE = "helmet015";
    public static readonly HELMET_ANUBIS = "helmet016";
    public static readonly HELMET_KNIGHT = "helmet017";
    public static readonly HELMET_DEATH = "helmet018";
    public static readonly HELMET_ENERY = "helmet019";
    public static readonly CLOAK_WARRIOR = "cloak001";
    public static readonly TROUSERS_LONG = "trousers001";
    public static readonly TROUSERS_SHORT = "trousers002";
    public static readonly TROUSERS_RADIATION = "trousers003";
    public static readonly TROUSERS_JUNGLE = "trousers004";
    public static readonly TROUSERS_PHARAOH = "trousers005";
    public static readonly TROUSERS_KNIGHT = "trousers006";
    public static readonly TROUSERS_DEATH = "trousers007";
    public static readonly TROUSERS_ENERGY = "trousers008";
    public static readonly GLOVES_WARRIOR = "gloves001";
    public static readonly GLOVES_DEMON = "gloves002";
    public static readonly GLOVES_BLOODCRAW = "gloves003";
    public static readonly GLOVES_RADIATION = "gloves004";
    public static readonly GLOVES_JUNGLE = "gloves005";
    public static readonly GLOVES_PHARAOH = "gloves006";
    public static readonly GLOVES_KNIGHT = "gloves007";
    public static readonly GLOVES_DEATH = "gloves008";
    public static readonly GLOVES_ENERGY = "gloves009";
    public static readonly SHOES_WARRIOR = "shoes001";
    public static readonly SHOES_SKATEBOARD = "shoes002";
    public static readonly SHOES_DEMON = "shoes003";
    public static readonly SHOES_RADIATION = "shoes004";
    public static readonly SHOES_JUNGLE = "shoes005";
    public static readonly SHOES_PHARAOH = "shoes006";
    public static readonly SHOES_KNIGHT = "shoes007";
    public static readonly SHOES_DEATH = "shoes008";
    public static readonly SHOES_ENERGY = "shoes009";

    //暴击的(暴击)
    public static readonly COLOR_CRITICALSTRIKE = "#DC143C";//猩红
    //迅捷的(攻击速度)
    public static readonly COLOR_ATTACKSPPED = "#5F9EA0";//军校蓝
    //灵动的(移动速度)
    public static readonly COLOR_MOVESPEED = "#00BFFF";//深天蓝
    //飘逸的(闪避几率)
    public static readonly COLOR_DODGE = "#FFFF00";//黄色
    //坚固的(防御力)
    public static readonly COLOR_STABLE = "#DEB887";//结实的树棕色
    //强力的(攻击力)
    public static readonly COLOR_POWERFUL = "#9370DB";//适中的兰花紫
    //健康的(最大生命值)
    public static readonly COLOR_HEALTHY = "#90EE90";//淡绿色
    //邪恶的(生命汲取)
    public static readonly COLOR_LIFEDRAIN = "#FFC0CB";//粉红
    //温暖的(生命恢复)
    public static readonly COLOR_RECOVERY = "#ADFF2F";//绿黄色
    @property(cc.Prefab)
    equipment: cc.Prefab = null;



    // LIFE-CYCLE CALLBACKS:

    onLoad() {
    }
    /*灰色（粗糙）→白色（普通）→绿色（精良）→蓝色（优秀）→紫色（史诗）→橙色（传说）
    箱子的等级1,2,3越来越高*/
    //criticalstrike strong stable drain recovery fast quick agile healthy 
    getRandomDesc(data: EquipmentData, chestQuality?: number): EquipmentDescData {
        let desc = new EquipmentDescData();

        // let arr = ['rough', 'normal', 'good', 'excellent', 'epic', 'legend']
        let arr = ['', '普通的', '精良的', '优秀的', '史诗的', '传说的']
        let colors = ['#dcdcdc', '#ffffff', '#00ff00', '#0000ff', '#800080', '#ffa500']
        let level = 0;
        //暴击0-50减去装备自带
        let criticalStrikeRate = cc.v2(0, 0);
        if (this.isTheEquipType(data.equipmetType, [EquipmentManager.TYPE_WEAPON, EquipmentManager.TYPE_HELMET
            , EquipmentManager.TYPE_GLOVES, EquipmentManager.TYPE_CLOAK, EquipmentManager.TYPE_REMOTE])
            && data.Common.criticalStrikeRate > 0) {
                let csk = 50 - data.Common.criticalStrikeRate;
                if(csk<5){csk=5;}
            criticalStrikeRate = this.getRandomQuality(0, csk, chestQuality);
            level = criticalStrikeRate.y > level ? criticalStrikeRate.y : level;
            desc.prefix += criticalStrikeRate.y > 2 ? '暴击' : '';
            desc.color = this.getMixColor('#000000'
                , criticalStrikeRate.y > 2 ? EquipmentManager.COLOR_CRITICALSTRIKE : '#000000');
        }

        //基础攻击0-5
        let damageMin = cc.v2(0, 0);
        if (this.isTheEquipType(data.equipmetType, [EquipmentManager.TYPE_WEAPON, EquipmentManager.TYPE_GLOVES
            , EquipmentManager.TYPE_CLOTHES, EquipmentManager.TYPE_REMOTE])
            && data.Common.damageMin > 0) {
            damageMin = this.getRandomQuality(0, 5, chestQuality);
            level = damageMin.y > level ? damageMin.y : level;
        }
        //最大攻击0-5
        let damageMax = cc.v2(0, 0);
        if (this.isTheEquipType(data.equipmetType, [EquipmentManager.TYPE_WEAPON, EquipmentManager.TYPE_GLOVES
            , EquipmentManager.TYPE_CLOTHES, EquipmentManager.TYPE_REMOTE])
            && data.Common.damageMax > 0) {
            damageMax = this.getRandomQuality(damageMin.x, damageMin.x + 5, chestQuality);
            level = damageMax.y > level ? damageMax.y : level;
            desc.prefix += damageMax.y > 2 ? '强力' : '';
            desc.color = this.getMixColor(desc.color
                , damageMax.y > 2 ? EquipmentManager.COLOR_POWERFUL : '#000000');
        }
        //物理防御0-5
        let defence = cc.v2(0, 0);
        if (this.isTheEquipType(data.equipmetType, [EquipmentManager.TYPE_HELMET, EquipmentManager.TYPE_GLOVES
            , EquipmentManager.TYPE_CLOAK, EquipmentManager.TYPE_TROUSERS, EquipmentManager.TYPE_SHOES
            , EquipmentManager.TYPE_CLOTHES])
            && data.Common.defence > 0) {
            defence = this.getRandomQuality(0, 5, chestQuality);
            level = defence.y > level ? defence.y : level;
            desc.prefix += defence.y > 2 ? '坚固' : '';
            desc.color = this.getMixColor(desc.color
                , defence.y > 2 ? EquipmentManager.COLOR_STABLE : '#000000');
        }
        //吸血0%-50%
        let lifeDrain = cc.v2(0, 0);
        if (this.isTheEquipType(data.equipmetType, [EquipmentManager.TYPE_WEAPON, EquipmentManager.TYPE_HELMET
            , EquipmentManager.TYPE_GLOVES, EquipmentManager.TYPE_REMOTE])
            && data.Common.lifeDrain > 0) {
                let ld = 50 - data.Common.lifeDrain;
                if(ld<5){ld = 5;}
            lifeDrain = this.getRandomQuality(0, ld, chestQuality);
            level = lifeDrain.y > level ? lifeDrain.y : level;
            desc.prefix += lifeDrain.y > 2 ? '邪恶' : '';
            desc.color = this.getMixColor(desc.color
                , lifeDrain.y > 2 ? EquipmentManager.COLOR_LIFEDRAIN : '#000000');
        }
        //生命回复10% 0-5
        //为了防止过于imba只有1/10的可能回血
        let lifeRecovery = cc.v2(0, 0);
        if (this.isTheEquipType(data.equipmetType, [EquipmentManager.TYPE_HELMET
            , EquipmentManager.TYPE_GLOVES, EquipmentManager.TYPE_CLOAK, EquipmentManager.TYPE_TROUSERS
            , EquipmentManager.TYPE_SHOES, EquipmentManager.TYPE_CLOTHES])
            && data.Common.lifeRecovery > 0) {
            lifeRecovery = Random.rand() < 0.1 ? this.getRandomQuality(0, 5, chestQuality) : cc.v2(0, 0);
            level = lifeRecovery.y > level ? lifeRecovery.y : level;
            desc.prefix += lifeRecovery.y > 2 ? '温暖' : '';
            desc.color = this.getMixColor(desc.color
                , lifeRecovery.y > 2 ? EquipmentManager.COLOR_RECOVERY : '#000000');
        }
        //移动速度0-50减去装备自带移动速度
        let moveSpeed = cc.v2(0, 0);
        if (this.isTheEquipType(data.equipmetType, [EquipmentManager.TYPE_CLOAK, EquipmentManager.TYPE_TROUSERS
            , EquipmentManager.TYPE_SHOES, EquipmentManager.TYPE_CLOTHES])
            && data.Common.moveSpeed > 0) {
            let ms = 50 - data.Common.moveSpeed;
            if (ms < 5) { ms = 5; }
            moveSpeed = this.getRandomQuality(0, ms, chestQuality);
            level = moveSpeed.y > level ? moveSpeed.y : level;
            desc.prefix += moveSpeed.y > 2 ? '灵动' : '';
            desc.color = this.getMixColor(desc.color
                , moveSpeed.y > 2 ? EquipmentManager.COLOR_MOVESPEED : '#000000');
        }
        //攻击速度0-30减去装备自带攻速
        let attackSpeed = cc.v2(0, 0);
        if (this.isTheEquipType(data.equipmetType, [EquipmentManager.TYPE_WEAPON
            , EquipmentManager.TYPE_GLOVES, EquipmentManager.TYPE_CLOTHES
            , EquipmentManager.TYPE_REMOTE])
            && data.Common.attackSpeed > 0) {
            let as = 30 - data.Common.attackSpeed;
            if (as < 5) { as = 5; }
            attackSpeed = this.getRandomQuality(0, as, chestQuality);
            level = attackSpeed.y > level ? attackSpeed.y : level;
            desc.prefix += attackSpeed.y > 2 ? '迅捷' : '';
            desc.color = this.getMixColor(desc.color
                , attackSpeed.y > 2 ? EquipmentManager.COLOR_ATTACKSPPED : '#000000');
        }
        //闪避0-30减去装备自带闪避
        let dodge = cc.v2(0, 0);
        if (this.isTheEquipType(data.equipmetType, [EquipmentManager.TYPE_HELMET
            , EquipmentManager.TYPE_CLOAK, EquipmentManager.TYPE_TROUSERS
            , EquipmentManager.TYPE_SHOES, EquipmentManager.TYPE_CLOTHES])
            && data.Common.dodge > 0) {
            let d1 = 30 - data.Common.dodge;
            if (d1 < 5) { d1 = 5; }
            dodge = this.getRandomQuality(0, d1, chestQuality);
            level = dodge.y > level ? dodge.y : level;
            desc.prefix += dodge.y > 2 ? '飘逸' : '';
            desc.color = this.getMixColor(desc.color
                , dodge.y > 2 ? EquipmentManager.COLOR_DODGE : '#000000');
        }
        //生命值0-5
        let health = cc.v2(0, 0);
        if (this.isTheEquipType(data.equipmetType, [EquipmentManager.TYPE_HELMET
            , EquipmentManager.TYPE_GLOVES, EquipmentManager.TYPE_CLOAK, EquipmentManager.TYPE_TROUSERS
            , EquipmentManager.TYPE_SHOES, EquipmentManager.TYPE_CLOTHES])
            && data.Common.maxHealth > 0) {
            health = this.getRandomQuality(0, 5, chestQuality);
            level = health.y > level ? health.y : level;
            desc.prefix += health.y > 2 ? '健康' : '';
            desc.color = this.getMixColor(desc.color
                , health.y > 2 ? EquipmentManager.COLOR_HEALTHY : '#000000');
        }
        let damageRate = 0.1;
        //流血伤害0-5
        let realDamage = Random.rand() < damageRate ? this.getRandomQuality(0, 5, chestQuality) : cc.v2(0, 0);
        level = realDamage.y > level ? realDamage.y : level;
        desc.prefix += realDamage.y > 2 ? '锋利' : '';
        //冰伤害0-5
        let iceDamage = Random.rand() < damageRate ? this.getRandomQuality(0, 5, chestQuality) : cc.v2(0, 0);
        level = iceDamage.y > level ? iceDamage.y : level;
        desc.prefix += iceDamage.y > 2 ? '寒冷' : '';
        //火伤害0-5
        let fireDamage = Random.rand() < damageRate ? this.getRandomQuality(0, 5, chestQuality) : cc.v2(0, 0);
        level = fireDamage.y > level ? fireDamage.y : level;
        desc.prefix += fireDamage.y > 2 ? '炎热' : '';
        //雷伤害0-5
        let lighteningDamage = Random.rand() < damageRate ? this.getRandomQuality(0, 5, chestQuality) : cc.v2(0, 0);
        level = lighteningDamage.y > level ? lighteningDamage.y : level;
        desc.prefix += lighteningDamage.y > 2 ? '闪电' : '';
        //毒伤害0-5
        let toxicDamage = Random.rand() < damageRate ? this.getRandomQuality(0, 5, chestQuality) : cc.v2(0, 0);
        level = toxicDamage.y > level ? toxicDamage.y : level;
        desc.prefix += toxicDamage.y > 2 ? '毒素' : '';
        //诅咒伤害0-5
        let curseDamage = Random.rand() < 0.1 ? this.getRandomQuality(0, 5, chestQuality) : cc.v2(0, 0);
        level = curseDamage.y > level ? curseDamage.y : level;
        desc.prefix += curseDamage.y > 2 ? '诅咒' : '';

        let defenceNum = 60;
        let defenceRate = 0.1;
        //冰抗性0-60 0.1几率
        let iceDefence = Random.rand() < defenceRate ? this.getRandomQuality(0, defenceNum, chestQuality) : cc.v2(0, 0);
        level = iceDefence.y > level ? iceDefence.y : level;
        //火抗性0-60 0.1几率
        let fireDefence = Random.rand() < defenceRate ? this.getRandomQuality(0, defenceNum, chestQuality) : cc.v2(0, 0);
        level = fireDefence.y > level ? fireDefence.y : level;
        //雷抗性0-60 0.1几率
        let lighteningDefence = Random.rand() < defenceRate ? this.getRandomQuality(0, defenceNum, chestQuality) : cc.v2(0, 0);
        level = lighteningDefence.y > level ? lighteningDefence.y : level;
        //毒抗性0-60 0.1几率
        let toxicDefence = Random.rand() < defenceRate ? this.getRandomQuality(0, defenceNum, chestQuality) : cc.v2(0, 0);
        level = toxicDefence.y > level ? toxicDefence.y : level;
        //诅咒抗性0-60 0.1几率
        let curseDefence = Random.rand() < defenceRate ? this.getRandomQuality(0, defenceNum, chestQuality) : cc.v2(0, 0);
        level = curseDefence.y > level ? curseDefence.y : level;

        let rateNum = 60;
        let rateRate = 0.05;
        //流血几率0-60
        let realRate = Random.rand() < rateRate ? this.getRandomQuality(0, rateNum, chestQuality) : cc.v2(0, 0);
        level = realRate.y > level ? realRate.y : level;
        //冰几率0-60
        let iceRate = Random.rand() < rateRate ? this.getRandomQuality(0, rateNum, chestQuality) : cc.v2(0, 0);
        level = iceRate.y > level ? iceRate.y : level;
        //火几率0-60
        let fireRate = Random.rand() < rateRate ? this.getRandomQuality(0, rateNum, chestQuality) : cc.v2(0, 0);
        level = fireRate.y > level ? fireRate.y : level;
        //雷几率0-60
        let lighteningRate = Random.rand() < rateRate ? this.getRandomQuality(0, rateNum, chestQuality) : cc.v2(0, 0);
        level = lighteningRate.y > level ? lighteningRate.y : level;
        //毒几率0-60
        let toxicRate = Random.rand() < rateRate ? this.getRandomQuality(0, rateNum, chestQuality) : cc.v2(0, 0);
        level = toxicRate.y > level ? toxicRate.y : level;
        //诅咒几率0-60
        let curseRate = Random.rand() < rateRate ? this.getRandomQuality(0, rateNum, chestQuality) : cc.v2(0, 0);
        level = curseRate.y > level ? curseRate.y : level;

        desc.prefix = arr[level] + desc.prefix;
        desc.titlecolor = colors[level];
        desc.level = level;
        desc.color = desc.color == '#000000' ? '#ffffff' : desc.color;


        desc.criticalStrikeRate = criticalStrikeRate.x;
        desc.damageMin = damageMin.x;
        desc.damageMax = damageMax.x;
        desc.defence = defence.x;
        desc.lifeDrain = lifeDrain.x;
        desc.lifeRecovery = lifeRecovery.x;
        desc.moveSpeed = moveSpeed.x;
        desc.attackSpeed = attackSpeed.x;
        desc.dodge = dodge.x;
        desc.health = health.x;
        desc.realDamage = realDamage.x;
        desc.iceDamage = iceDamage.x;
        desc.fireDamage = fireDamage.x;
        desc.lighteningDamage = lighteningDamage.x;
        desc.toxicDamage = toxicDamage.x;
        desc.curseDamage = curseDamage.x;
        desc.iceDefence = iceDefence.x;
        desc.fireDefence = fireDefence.x;
        desc.lighteningDefence = lighteningDefence.x;
        desc.toxicDefence = toxicDefence.x;
        desc.curseDefence = curseDefence.x;
        desc.realRate = realRate.x;
        desc.iceRate = iceRate.x;
        desc.fireRate = fireRate.x;
        desc.lighteningRate = lighteningRate.x;
        desc.toxicRate = toxicRate.x;
        desc.curseRate = curseRate.x;
        return desc;
    }
    isTheEquipType(theType: string, types: string[]): boolean {
        let isTheType = false;
        for (let t of types) {
            if (t == theType) {
                isTheType = true;
            }
        }
        return isTheType;
    }
    //0.5% 0.25% 0.1% 0.05% 0.01%
    //white 0-0.05 green 0.05-0.075 blue 0.075-0.085 purple 0.085-0.009 orange 0.09-0.0091
    //x:qulity y:level 1-5
    getRandomQuality(min: number, max: number, chestQuality: number): cc.Vec2 {
        let per = (max - min) / 5;
        let quality = Random.rand();
        //箱子出来的物品有10%的几率生成和箱子属性相关的优质属性
        if (chestQuality && quality > 0.9) {
            switch (chestQuality) {
                case 1: quality = Random.rand() > 0.2 ? 0.04 : 0.5; break;
                case 2: quality = Random.rand() > 0.2 ? 0.06 : 0.08; break;
                case 3: quality = Random.rand() > 0.2 ? 0.086 : 0.09; break;
            }
        }
        let data = cc.v2(0, 0);
        if (quality < 0.05) {
            data.x = Logic.getRandomNum(0, per);
            data.y = 1;
        } else if (quality >= 0.05 && quality < 0.075) {
            data.x = Logic.getRandomNum(per, per * 2);
            data.y = 2;
        } else if (quality >= 0.075 && quality < 0.085) {
            data.x = Logic.getRandomNum(per * 2, per * 3);
            data.y = 3;
        } else if (quality >= 0.085 && quality < 0.09) {
            data.x = Logic.getRandomNum(per * 3, per * 4);
            data.y = 4;
        } else if (quality >= 0.09 && quality < 0.091) {
            data.x = Logic.getRandomNum(per * 4, per * 5);
            data.y = 5;
        }
        data.x = parseFloat(data.x.toFixed(0));
        return data;
    }
    getEquipment(equipType: string, pos: cc.Vec2, parent: cc.Node, equipData?: EquipmentData, chestQuality?: number, shopTable?: ShopTable): Equipment {
        let equipmentPrefab = cc.instantiate(this.equipment);
        equipmentPrefab.parent = parent;
        equipmentPrefab.position = Dungeon.getPosInMap(pos);
        equipmentPrefab.zIndex = 3000 + (Dungeon.HEIGHT_SIZE - pos.y) * 10 + 3;
        let equipment = equipmentPrefab.getComponent(Equipment);
        equipment.pos = pos;
        if (equipData) {
            //复制已有装备
            if (shopTable) {
                equipment.shopTable = shopTable;
                shopTable.data.equipdata = equipData.clone();
                shopTable.data.price = 15 * (equipData.level + 1);
            }
            equipment.refresh(equipData);
        } else {
            //添加新装备
            let data = new EquipmentData();
            data.valueCopy(Logic.equipments[equipType]);
            data.uuid = data.genNonDuplicateID();
            let desc = this.getRandomDesc(data, chestQuality);
            data.infobase = this.getEquipmentInfoBase(desc, data);
            data.info1 = this.getEquipmentInfo1(desc, data);
            data.info2 = this.getEquipmentInfo2(desc, data);
            data.info3 = this.getEquipmentInfo3(desc, data);
            data.infobasecolor = '#fffff0';//象牙
            data.infocolor1 = '#98FB98';//苍白的绿色
            data.infocolor2 = '#87CEFA';//淡蓝色
            data.infocolor3 = '#9370DB';//适中的紫色
            data.Common.criticalStrikeRate += desc.criticalStrikeRate;
            data.Common.damageMin += desc.damageMin;
            data.Common.damageMax += desc.damageMax;
            data.Common.defence += desc.defence;
            data.Common.lifeDrain += desc.lifeDrain;
            data.Common.lifeRecovery += desc.lifeRecovery;
            data.Common.moveSpeed += desc.moveSpeed;
            data.Common.attackSpeed += desc.attackSpeed;
            data.Common.dodge += desc.dodge;
            data.Common.maxHealth += desc.health;
            data.Common.realDamage += desc.realDamage;
            data.Common.iceDamage += desc.iceDamage;
            data.Common.fireDamage += desc.fireDamage;
            data.Common.lighteningDamage += desc.lighteningDamage;
            data.Common.toxicDamage += desc.toxicDamage;
            data.Common.curseDamage += desc.curseDamage;
            data.Common.iceDefence += desc.iceDefence;
            data.Common.fireDefence += desc.fireDefence;
            data.Common.lighteningDefence += desc.lighteningDefence;
            data.Common.toxicDefence += desc.toxicDefence;
            data.Common.curseDefence += desc.curseDefence;
            data.Common.realRate += desc.realRate;
            data.Common.iceRate += desc.iceRate;
            data.Common.fireRate += desc.fireRate;
            data.Common.lighteningRate += desc.lighteningRate;
            data.Common.toxicRate += desc.toxicRate;
            data.Common.curseRate += desc.curseRate;
            data.prefix = desc.prefix;
            data.titlecolor = desc.titlecolor;
            if (desc.color != "#ffffff") {
                data.color = desc.color;
                if(data.lightcolor != "#ffffff"){
                    data.lightcolor = this.getMixColor(desc.color,data.lightcolor);
                }else{
                    data.lightcolor = desc.color;
                }
            }
            data.level = desc.level;
            if (shopTable) {
                equipment.shopTable = shopTable;
                shopTable.data.equipdata = data.clone();
                shopTable.data.price = 15 * (desc.level + 1);
            }
            equipment.refresh(data);
        }
        return equipment;

    }
    getEquipmentInfoBase(desc: EquipmentDescData, data: EquipmentData): string {
        let info = ``;
        info += data.Common.remoteDamage + desc.remoteDamage == 0 ? `` : `远程伤害${data.Common.remoteDamage}${desc.remoteDamage == 0 ? '' : '+' + desc.remoteDamage}\n`;
        info += data.Common.remoteCritRate + desc.remoteCritRate == 0 ? `` : `远程暴击率${data.Common.remoteCritRate}${desc.remoteCritRate == 0 ? '' : '+' + desc.remoteCritRate}\n`;
        info += data.Common.remoteSpeed + desc.remoteSpeed == 0 ? `` : `远程攻速${data.Common.remoteSpeed}${desc.remoteSpeed == 0 ? '' : '+' + desc.remoteSpeed}\n`;
        info += data.Common.damageMin + desc.damageMin == 0 ? `` : `攻击${data.Common.damageMin}${desc.damageMin == 0 ? '' : '+' + desc.damageMin} 最大攻击力${data.Common.damageMax}${desc.damageMax == 0 ? '' : '+' + desc.damageMax}\n`;
        info += data.Common.damageMin + desc.damageMin == 0 && data.Common.damageMax != 0 ? `最大攻击力${data.Common.damageMax}${desc.damageMax == 0 ? '' : '+' + desc.damageMax}\n` : ``
        info += data.Common.defence + desc.defence == 0 ? `` : `防御${data.Common.defence}${desc.defence == 0 ? '' : '+' + desc.defence}\n`;
        info += data.Common.maxHealth + desc.health == 0 ? `` : `生命${data.Common.maxHealth}${desc.health == 0 ? '' : '+' + desc.health}\n`;
        if (info.length > 0 && info.lastIndexOf('\n') != -1) {
            info = info.substring(0, info.lastIndexOf('\n'));
        }
        info = info.replace('+-', '-');
        return info;
    }
    getEquipmentInfo1(desc: EquipmentDescData, data: EquipmentData): string {
        let info = ``;
        info += data.Common.criticalStrikeRate + desc.criticalStrikeRate == 0 ? `` : `暴击${data.Common.criticalStrikeRate}${desc.criticalStrikeRate == 0 ? '' : '+' + desc.criticalStrikeRate}%\n`;
        info += data.Common.lifeDrain + desc.lifeDrain == 0 ? `` : `吸血${data.Common.lifeDrain}${desc.lifeDrain == 0 ? '' : '+' + desc.lifeDrain}%\n`;
        info += data.Common.lifeRecovery + desc.lifeRecovery == 0 ? `` : `回复${data.Common.lifeRecovery}${desc.lifeRecovery == 0 ? '' : '+' + desc.lifeRecovery}\n`;
        info += data.Common.moveSpeed + desc.moveSpeed == 0 ? `` : `移速${data.Common.moveSpeed}${desc.moveSpeed == 0 ? '' : '+' + desc.moveSpeed}\n`;
        info += data.Common.attackSpeed + desc.attackSpeed == 0 ? `` : `攻速${data.Common.attackSpeed}${desc.attackSpeed == 0 ? '' : '+' + desc.attackSpeed}\n`;
        info += data.Common.dodge + desc.dodge == 0 ? `` : `闪避${data.Common.dodge}${desc.dodge == 0 ? '' : '+' + desc.dodge}%\n`;
        if (info.length > 0 && info.lastIndexOf('\n') != -1) {
            info = info.substring(0, info.lastIndexOf('\n'));
        }
        info = info.replace('+-', '-');
        return info;
    }
    getEquipmentInfo2(desc: EquipmentDescData, data: EquipmentData): string {
        let info = ``;
        info += data.isReflect == 0 ? `` : `反弹子弹\n`;
        info += data.Common.realDamage + desc.realDamage == 0 ? `` : `攻击附加${data.Common.realDamage}${desc.realDamage == 0 ? '' : '+' + desc.realDamage}点流血伤害\n`;
        info += data.Common.realRate + desc.realRate == 0 ? `` : `攻击有${data.Common.realRate}${desc.realRate == 0 ? '' : '+' + desc.realRate}%几率释放流血\n`;
        info += data.Common.iceDamage + desc.iceDamage == 0 ? `` : `攻击附加${data.Common.iceDamage}${desc.iceDamage == 0 ? '' : '+' + desc.iceDamage}点冰伤害\n`;
        info += data.Common.iceRate + desc.iceRate == 0 ? `` : `攻击有${data.Common.iceRate}${desc.iceRate == 0 ? '' : '+' + desc.iceRate}%几率释放冰冻\n`;
        info += data.Common.fireDamage + desc.fireDamage == 0 ? `` : `攻击附加${data.Common.fireDamage}${desc.fireDamage == 0 ? '' : '+' + desc.fireDamage}点火伤害\n`;
        info += data.Common.fireRate + desc.fireRate == 0 ? `` : `攻击有${data.Common.fireRate}${desc.fireRate == 0 ? '' : '+' + desc.fireRate}%几率释放燃烧\n`;
        info += data.Common.lighteningDamage + desc.lighteningDamage == 0 ? `` : `攻击附加${data.Common.lighteningDamage}${desc.lighteningDamage == 0 ? '' : '+' + desc.lighteningDamage}点雷伤害\n`;
        info += data.Common.lighteningRate + desc.lighteningRate == 0 ? `` : `攻击有${data.Common.lighteningRate}${desc.lighteningRate == 0 ? '' : '+' + desc.lighteningRate}%几率释放闪电\n`;
        info += data.Common.toxicDamage + desc.toxicDamage == 0 ? `` : `攻击附加${data.Common.toxicDamage}${desc.toxicDamage == 0 ? '' : '+' + desc.toxicDamage}点毒伤害\n`;
        info += data.Common.toxicRate + desc.toxicRate == 0 ? `` : `毒攻击有${data.Common.toxicRate}${desc.toxicRate == 0 ? '' : '+' + desc.toxicRate}%几率释放毒素\n`;
        info += data.Common.curseDamage + desc.curseDamage == 0 ? `` : `攻击附加 ${data.Common.curseDamage}${desc.curseDamage == 0 ? '' : '+' + desc.curseDamage}点诅咒伤害\n`;
        info += data.Common.curseRate + desc.curseRate == 0 ? `` : `攻击有${data.Common.curseRate}${desc.curseRate == 0 ? '' : '+' + desc.curseRate}%几率释放诅咒\n`;
        if (info.length > 0 && info.lastIndexOf('\n') != -1) {
            info = info.substring(0, info.lastIndexOf('\n'));
        }
        info = info.replace('+-', '-');
        return info;
    }
    getEquipmentInfo3(desc: EquipmentDescData, data: EquipmentData): string {
        let info = ``;
        info += data.Common.iceDefence + desc.iceDefence == 0 ? `` : `冰抗性${data.Common.iceDefence}${desc.iceDefence == 0 ? '' : '+' + desc.iceDefence}%\n`;
        info += data.Common.fireDefence + desc.fireDefence == 0 ? `` : `火抗性${data.Common.fireDefence}${desc.fireDefence == 0 ? '' : '+' + desc.fireDefence}%\n`;
        info += data.Common.lighteningDefence + desc.lighteningDefence == 0 ? `` : `雷抗性${data.Common.lighteningDefence}${desc.lighteningDefence == 0 ? '' : '+' + desc.lighteningDefence}%\n`;
        info += data.Common.toxicDefence + desc.toxicDefence == 0 ? `` : `毒抗性${data.Common.toxicDefence}${desc.toxicDefence == 0 ? '' : '+' + desc.toxicDefence}%\n`;
        info += data.Common.curseDefence + desc.curseDefence == 0 ? `` : `诅咒抗性${data.Common.curseDefence}${desc.curseDefence == 0 ? '' : '+' + desc.curseDefence}%\n`;
        if (info.length > 0 && info.lastIndexOf('\n') != -1) {
            info = info.substring(0, info.lastIndexOf('\n'));
        }
        info = info.replace('+-', '-');
        return info;
    }

    start() {

    }

    getMixColor(color1: string, color2: string): string {
        let c1 = cc.color().fromHEX(color1);
        let c2 = cc.color().fromHEX(color2);
        let c3 = cc.color();
        let r = c1.getR() + c2.getR();
        let g = c1.getG() + c2.getG();
        let b = c1.getB() + c2.getB();

        c3.setR(r > 255 ? 255 : r);
        c3.setG(g > 255 ? 255 : g);
        c3.setB(b > 255 ? 255 : b);
        return '#' + c3.toHEX('#rrggbb');
    }

    

    // update (dt) {}
}
