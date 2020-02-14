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
import { EventConstant } from './EventConstant';
import Shooter from './Shooter';
import Logic from './Logic';
import Dungeon from './Dungeon';
import Equipment from './Equipment/Equipment';
import EquipmentData from './Data/EquipmentData';
import MeleeWeapon from './MeleeWeapon';
import RectDungeon from './Rect/RectDungeon';
import StatusManager from './Manager/StatusManager';
import DamageData from './Data/DamageData';
import InventoryManager from './Manager/InventoryManager';
import PlayerData from './Data/PlayerData';
import FloatinglabelManager from './Manager/FloatingLabelManager';
import Tips from './UI/Tips';
import Random from './Utils/Random';
import TalentShield from './Talent/TalentShield';
import TalentDash from './Talent/TalentDash';
import Actor from './Base/Actor';
import FlyWheel from './Item/FlyWheel';
import Talent from './Talent/Talent';
import AudioPlayer from './Utils/AudioPlayer';
import FromData from './Data/FromData';
import Achievements from './Achievement';
import TalentMagic from './Talent/TalentMagic';
import ItemData from './Data/ItemData';
import Item from './Item/Item';

@ccclass
export default class Player extends Actor {
    static readonly STATE_IDLE = 0;
    static readonly STATE_WALK = 1;
    static readonly STATE_ATTACK = 2;
    static readonly STATE_FALL = 3;
    static readonly STATE_DIE = 4;
    @property(cc.Vec2)
    pos: cc.Vec2 = cc.v2(0, 0);
    @property(FloatinglabelManager)
    floatinglabelManager: FloatinglabelManager = null;
    @property(cc.Prefab)
    walksmoke: cc.Prefab = null;
    private smokePool: cc.NodePool;
    @property(cc.Node)
    meleeWeaponNode: cc.Node = null;
    meleeWeapon: MeleeWeapon = null;
    @property(Shooter)
    shooter: Shooter = null;
    @property(Shooter)
    shooterEx: Shooter = null;
    @property(StatusManager)
    statusManager: StatusManager = null;
    // private playerItemSprite: cc.Sprite;
    hairSprite: cc.Sprite = null;
    weaponSprite: cc.Sprite = null;
    weaponLightSprite: cc.Sprite = null;
    weaponStabSprite: cc.Sprite = null;
    weaponStabLightSprite: cc.Sprite = null;
    helmetSprite: cc.Sprite = null;
    clothesSprite: cc.Sprite = null;
    trousersSprite: cc.Sprite = null;
    pantsSprite: cc.Sprite = null;
    glovesLeftSprite: cc.Sprite = null;
    shoesLeftSprite: cc.Sprite = null;
    shoesRightSprite: cc.Sprite = null;
    cloakSprite: cc.Sprite = null;
    bodySprite: cc.Sprite = null;
    isMoving = false;//是否移动中
    isAttacking = false;//是否近战攻击中
    isHeavyRemotoAttacking = false;//是否是重型远程武器,比如激光
    private sprite: cc.Node;
    anim: cc.Animation;
    isDied = false;//是否死亡
    isFall = false;//是否跌落
    isStone = false;//是否石化
    isDizz = false;//是否眩晕
    baseAttackPoint: number = 1;

    //触碰到的装备
    touchedEquipment: Equipment;
    //触碰到的物品
    touchedItem:Item;
    //触碰到的提示
    touchedTips: Tips;
    inventoryManager: InventoryManager;
    data: PlayerData;

    isFaceRight = true;

    attackTarget: cc.Collider;
    rigidbody: cc.RigidBody;

    defaultPos = cc.v2(0, 0);

    talentDash: TalentDash;
    talentShield: TalentShield;
    flyWheel: FlyWheel;
    talentMagic: TalentMagic;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.isAttacking = false;
        this.inventoryManager = Logic.inventoryManager;
        this.data = Logic.playerData;
        this.statusUpdate();
        this.pos = cc.v2(0, 0);
        this.isDied = false;
        this.isStone = false;
        this.anim = this.getComponent(cc.Animation);

        this.rigidbody = this.getComponent(cc.RigidBody);
        this.sprite = this.node.getChildByName('sprite');
        this.bodySprite = this.getSpriteChildSprite(['sprite', 'body', 'body']);
        // this.playerItemSprite = this.getSpriteChildSprite(['sprite', 'righthand', 'item']);
        this.hairSprite = this.getSpriteChildSprite(['sprite', 'body', 'head', 'hair']);
        this.weaponSprite = this.getSpriteChildSprite(['MeleeWeapon', 'sprite', 'weapon']);
        this.weaponLightSprite = this.getSpriteChildSprite(['MeleeWeapon', 'sprite', 'meleelight']);
        this.weaponStabSprite = this.getSpriteChildSprite(['MeleeWeapon', 'sprite', 'stabweapon']);
        this.weaponStabLightSprite = this.getSpriteChildSprite(['MeleeWeapon', 'sprite', 'stablight']);
        this.helmetSprite = this.getSpriteChildSprite(['sprite', 'body', 'head', 'helmet']);
        this.clothesSprite = this.getSpriteChildSprite(['sprite', 'body', 'body', 'clothes']);
        this.trousersSprite = this.getSpriteChildSprite(['sprite', 'body', 'legs']);
        this.pantsSprite = this.getSpriteChildSprite(['sprite', 'body', 'body', 'pants']);
        this.glovesLeftSprite = this.getSpriteChildSprite(['sprite', 'body', 'handleft', 'gloveleft']);
        this.shoesLeftSprite = this.getSpriteChildSprite(['sprite', 'body', 'legs', 'footleft', 'shoes']);
        this.shoesRightSprite = this.getSpriteChildSprite(['sprite', 'body', 'legs', 'footright', 'shoes']);
        this.cloakSprite = this.getSpriteChildSprite(['sprite', 'cloak']);
        cc.director.on(EventConstant.PLAYER_TRIGGER
            , (event) => { this.triggerThings() });
        cc.director.on(EventConstant.PLAYER_USEITEM
            , (event) => {this.useItem(event.detail.itemData)});
        cc.director.on(EventConstant.PLAYER_SKILL
            , (event) => { this.useSkill() });
        cc.director.on(EventConstant.PLAYER_ATTACK
            , (event) => { this.meleeAttack() });
        cc.director.on(EventConstant.PLAYER_REMOTEATTACK
            , (event) => { this.remoteAttack() });
        cc.director.on(EventConstant.PLAYER_STATUSUPDATE
            , (event) => { this.statusUpdate() });
        cc.director.on(EventConstant.PLAYER_TAKEDAMAGE
            , (event) => { this.takeDamage(event.detail.damage, event.detail.from) });

        if (Logic.mapManager.getCurrentRoomType() == RectDungeon.BOSS_ROOM) {
            Logic.playerData.pos = cc.v2(Math.floor(Dungeon.WIDTH_SIZE / 2), 2);
        }
        this.pos = Logic.playerData.pos.clone();
        this.defaultPos = Logic.playerData.pos.clone();
        this.baseAttackPoint = Logic.playerData.getDamageMin();
        this.updatePlayerPos();
        this.meleeWeapon = this.meleeWeaponNode.getComponent(MeleeWeapon);
        this.shooter.player = this;
        this.shooterEx.player = this;
        this.shooterEx.isEx = true;
        this.smokePool = new cc.NodePool();
        cc.director.on('destorysmoke', (event) => {
            this.destroySmoke(event.detail.coinNode);
        })
        // this.addComponent(TalentShield);
        this.talentShield = this.getComponent(TalentShield);
        this.talentShield.init();
        this.talentShield.loadList(Logic.talentList);
        // this.talentShield.addTalent(Talent.SHIELD_01);
        // this.talentShield.addTalent(Talent.SHIELD_06);
        // this.talentShield.addTalent(Talent.SHIELD_03);
        // this.talentShield.addTalent(Talent.SHIELD_13);
        // this.talentShield.addTalent(Talent.SHIELD_07);
        // this.talentShield.addTalent(Talent.SHIELD_11);
        this.talentDash = this.getComponent(TalentDash);
        this.talentDash.init();
        this.talentDash.loadList(Logic.talentList);
        // this.talentDash.addTalent(Talent.DASH_11);
        this.talentMagic = this.getComponent(TalentMagic);
        this.talentMagic.init();
        this.talentMagic.loadList(Logic.talentList);
        // this.talentMagic.addTalent(Talent.MAGIC_02);
        // this.talentMagic.addTalent(Talent.MAGIC_03);
        // this.talentMagic.addTalent(Talent.MAGIC_04);
        // this.talentMagic.addTalent(Talent.MAGIC_05);
        // this.talentMagic.addTalent(Talent.MAGIC_06);
        // this.talentMagic.addTalent(Talent.MAGIC_10);
        // this.talentMagic.addTalent(Talent.MAGIC_14);
        // this.talentMagic.addTalent(Talent.MAGIC_15);
        // this.talentMagic.addTalent(Talent.MAGIC_16);
        // this.talentMagic.addTalent(Talent.MAGIC_08);
        // this.talentMagic.addTalent(Talent.MAGIC_09);
        if (this.anim) {
            this.resetFoot();
            this.playerAnim(Player.STATE_WALK);
        }
        if (Logic.isCheatMode) {
            this.scheduleOnce(() => {
                this.addStatus(StatusManager.PERFECTDEFENCE, new FromData());
                // this.data.currentHealth = 1;
                // this.data.Common.maxHealth = 1;
                // this.data.Common.damageMin = 99;
                this.data.Common.criticalStrikeRate = 100;
                this.data.Common.remoteCritRate = 50;
            }, 0.2);
        }
    }
    actorName(): string {
        return 'Player';
    }
    /**
     * 
     * @param isStone 是否是石头
     * @param stoneLevel 石头等级：0：全身，1：身子和脚，2：脚 
     */
    private turnStone(isStone: boolean, stoneLevel?: number) {
        // let n = isStone ? 1 : 0;
        // this.bodySprite.setState(n);
        // this.hairSprite.setState(n);
        // this.helmetSprite.setState(n);
        // this.clothesSprite.setState(n);
        // this.trousersSprite.setState(n);
        // this.glovesLeftSprite.setState(n);
        // this.shoesLeftSprite.setState(n);
        // this.shoesRightSprite.setState(n);
        // if (stoneLevel == 1) {
        //     this.hairSprite.setState(0);
        //     this.helmetSprite.setState(0);
        // }
        // if (stoneLevel == 2) {
        //     this.bodySprite.setState(0);
        //     this.hairSprite.setState(0);
        //     this.helmetSprite.setState(0);
        //     this.clothesSprite.setState(0);
        //     this.glovesLeftSprite.setState(0);
        // }
    }


    private getSpriteChildSprite(childNames: string[]): cc.Sprite {
        let node = this.node;
        for (let name of childNames) {
            node = node.getChildByName(name);
        }
        return node.getComponent(cc.Sprite);
    }
    dizzCharacter(dizzDuration: number) {
        if (dizzDuration > 0) {
            this.isDizz = true;
            this.resetFoot();
            this.rigidbody.linearVelocity = cc.Vec2.ZERO;
            this.playerAnim(Player.STATE_IDLE);
            this.scheduleOnce(() => {
                this.isDizz = false;
            }, dizzDuration)
        }
    }
    private statusUpdate() {
        if (!this.inventoryManager) {
            return;
        }
        this.data.EquipmentTotalData.valueCopy(this.inventoryManager.getTotalEquipmentData());
        cc.director.emit(EventConstant.HUD_UPDATE_PLAYER_INFODIALOG, { detail: { data: this.data } });
    }
    getWalkSmoke(parentNode: cc.Node, pos: cc.Vec2) {
        let smokePrefab: cc.Node = null;
        if (this.smokePool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            smokePrefab = this.smokePool.get();
        }
        // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
        if (!smokePrefab || smokePrefab.active) {
            smokePrefab = cc.instantiate(this.walksmoke);
        }
        smokePrefab.parent = parentNode;
        smokePrefab.position = pos;
        smokePrefab.zIndex = 4000;
        smokePrefab.opacity = 255;
        smokePrefab.active = true;
    }

    destroySmoke(smokeNode: cc.Node) {
        if (!smokeNode) {
            return;
        }
        smokeNode.active = false;
        if (this.smokePool) {
            this.smokePool.put(smokeNode);
        }
    }

    changeEquipment(equipData: EquipmentData, spriteFrame: cc.SpriteFrame) {
        switch (equipData.equipmetType) {
            case 'weapon':
                this.meleeWeapon.isStab = equipData.stab == 1;
                this.meleeWeapon.isFar = equipData.far == 1;
                this.meleeWeapon.isReflect = equipData.isReflect == 1;
                this.meleeWeapon.isFist = false;
                this.meleeWeapon.setHands();
                if (equipData.stab == 1) {
                    this.weaponSprite.spriteFrame = null;
                    this.weaponStabSprite.spriteFrame = spriteFrame;
                    this.weaponStabLightSprite.spriteFrame = this.meleeWeapon.isFar ? Logic.spriteFrames['stablight'] : Logic.spriteFrames['stablight1'];
                } else {
                    this.weaponSprite.spriteFrame = spriteFrame;
                    this.weaponStabSprite.spriteFrame = null;
                }
                let color1 = cc.color(255, 255, 255).fromHEX(this.inventoryManager.weapon.color);
                let color2 = cc.color(255, 255, 255).fromHEX(this.inventoryManager.weapon.lightcolor);
                this.weaponSprite.node.color = color1;
                this.weaponLightSprite.node.color = color2;
                this.weaponStabSprite.node.color = color2;
                this.weaponStabLightSprite.node.color = color2;
                break;
            case 'remote': this.shooter.data = equipData.clone();
                this.shooter.changeRes(this.shooter.data.img);
                let c = cc.color(255, 255, 255).fromHEX(this.shooter.data.color);
                this.shooter.changeResColor(c);
                break;
            case 'helmet':
                this.hairSprite.node.opacity = this.inventoryManager.helmet.hideHair == 1 ? 0 : 255;
                this.updateEquipMent(this.helmetSprite, this.inventoryManager.helmet.color, spriteFrame);
                break;
            case 'clothes':
                this.updateEquipMent(this.clothesSprite, this.inventoryManager.clothes.color, spriteFrame);
                break;
            case 'trousers':
                let isLong = this.inventoryManager.trousers.trouserslong == 1;
                this.updateEquipMent(this.trousersSprite, isLong ? this.inventoryManager.trousers.color : '#ffffff', Logic.spriteFrames['playerlegs']);
                this.updateEquipMent(this.pantsSprite, this.inventoryManager.trousers.color, spriteFrame);
                break;
            case 'gloves':
                this.updateEquipMent(this.glovesLeftSprite, this.inventoryManager.gloves.color, spriteFrame);
                // this.updateEquipMent(this.glovesRightSprite, this.inventoryManager.gloves.color, spriteFrame);
                this.updateEquipMent(this.meleeWeapon.glovesStabSprite, this.inventoryManager.gloves.color, spriteFrame);
                this.updateEquipMent(this.meleeWeapon.glovesWaveSprite, this.inventoryManager.gloves.color, spriteFrame);

                break;
            case 'shoes':
                this.updateEquipMent(this.shoesLeftSprite, this.inventoryManager.shoes.color, spriteFrame);
                this.updateEquipMent(this.shoesRightSprite, this.inventoryManager.shoes.color, spriteFrame);
                break;
            case 'cloak':
                this.updateEquipMent(this.cloakSprite, this.inventoryManager.cloak.color, spriteFrame);
                break;
        }
        this.data.EquipmentTotalData.valueCopy(this.inventoryManager.getTotalEquipmentData());
        cc.director.emit(EventConstant.HUD_UPDATE_PLAYER_INFODIALOG, { detail: { data: this.data } });
        let health = this.data.getHealth();
        cc.director.emit(EventConstant.HUD_UPDATE_PLAYER_HEALTHBAR, { detail: { x: health.x, y: health.y } });
    }
    private updateEquipMent(sprite: cc.Sprite, color: string, spriteFrame: cc.SpriteFrame): void {
        sprite.spriteFrame = spriteFrame;
        let c = cc.color(255, 255, 255).fromHEX(color);
        sprite.node.color = c;
    }
    /**获取中心位置 */
    getCenterPosition(): cc.Vec2 {
        return this.node.position.clone().addSelf(cc.v2(0, 32 * this.node.scaleY));
    }
    updatePlayerPos() {
        // this.node.x = this.pos.x * 64 + 32;
        // this.node.y = this.pos.y * 64 + 32;
        this.node.position = Dungeon.getPosInMap(this.pos);
    }
    transportPlayer(pos: cc.Vec2) {
        if (!this.sprite) {
            return;
        }
        this.sprite.angle = 0;
        this.sprite.scale = 5;
        this.sprite.opacity = 255;
        this.sprite.x = 0;
        this.sprite.y = 0;
        this.pos = pos;
        this.changeZIndex(this.pos);
        this.updatePlayerPos();
    }
    changeZIndex(pos: cc.Vec2) {
        this.node.zIndex = 3000 + (Dungeon.HEIGHT_SIZE - pos.y) * 10 + 2;
    }
    addStatus(statusType: string, from: FromData) {
        if(!this.node){
            return;
        }
        if (this.talentShield.IsExcuting) {
            if (this.talentShield.canAddStatus(statusType)) {
                this.statusManager.addStatus(statusType, from);
            }
        } else {
            this.statusManager.addStatus(statusType, from);
        }
    }
    meleeAttack() {
        if (!this.meleeWeapon || this.isAttacking || this.isDizz || this.isDied || this.isFall || this.meleeWeapon.isAttacking) {
            return;
        }

        this.isAttacking = true;
        let pos = this.meleeWeapon.getHv().clone();
        if (pos.equals(cc.Vec2.ZERO)) {
            pos = cc.v2(1, 0);
        }
        pos = pos.normalizeSelf().mul(15);
        pos.x = this.isFaceRight ? pos.x : -pos.x;
        let speed = PlayerData.DefAULT_SPEED-this.data.getAttackSpeed();
        if (speed < 1) {
            //匕首上限
            if (this.meleeWeapon.isStab && !this.meleeWeapon.isFar) {
                speed = 0+speed;
            }
            //长剑上限
            if (!this.meleeWeapon.isStab && !this.meleeWeapon.isFar) {
                speed = 100+speed;
            }
            //长枪上限
            if (this.meleeWeapon.isStab && this.meleeWeapon.isFar) {
                speed = 150+speed;
            }
            //大剑上限
            if (!this.meleeWeapon.isStab && this.meleeWeapon.isFar) {
                speed = 300+speed;
            }
        }
        if(speed<0){
            speed = 0;
        }
        let spritePos = this.sprite.position.clone();
        let action = cc.sequence(cc.moveBy(0.1, -pos.x, -pos.y), cc.moveBy(0.1, pos.x, pos.y), cc.callFunc(() => {
            this.scheduleOnce(() => {
                this.sprite.position = spritePos.clone();
                this.isAttacking = false;
            }, speed / 1000);
        }, this));
        this.sprite.runAction(action);
        let isMiss = Logic.getRandomNum(0, 100) < this.data.StatusTotalData.missRate;
        if (isMiss) {
            this.showFloatFont(this.node.parent, 0, false, true,false);
        }
        this.playerAnim(Player.STATE_ATTACK);
        this.meleeWeapon.attack(this.data, isMiss);
        cc.director.emit(EventConstant.PLAY_AUDIO, { detail: { name: AudioPlayer.MELEE } });

    }
    remoteRate = 0;
    remoteAttack() {
        let canFire = false;
        if (!this.data || this.isDizz || this.isDied || this.isFall) {
            return;
        }
        let speed = PlayerData.DefAULT_SPEED - this.data.getRemoteSpeed();
        if (speed < 10) { speed = 10 }
        if (speed > Shooter.DefAULT_SPEED * 10) { speed = Shooter.DefAULT_SPEED * 10; }
        let currentTime = Date.now();
        if (currentTime - this.remoteRate > speed) {
            this.remoteRate = currentTime;
            canFire = true;
        }
        if (!canFire) {
            return;
        }
        this.isHeavyRemotoAttacking = this.isHeavyRemoteShooter();
        this.scheduleOnce(() => { this.isHeavyRemotoAttacking = false }, 0.2);
        if (this.shooter) {
            this.shooter.remoteDamagePlayer = this.data.getFinalRemoteDamage();
            this.shooter.fireBullet(0);
        }
    }
    //特效攻击
    remoteExAttack(comboType: number): void {
        for (let data of this.inventoryManager.list) {
            let canShoot = false;
            if (comboType == MeleeWeapon.COMBO1 && data.exBulletCombo1 > 0) {
                canShoot = true;
            }
            if (comboType == MeleeWeapon.COMBO2 && data.exBulletCombo2 > 0) {
                canShoot = true;
            }
            if (comboType == MeleeWeapon.COMBO3 && data.exBulletCombo3 > 0) {
                canShoot = true;
            }
            if (canShoot && data.exBulletTypeAttack.length > 0 && Random.getRandomNum(0, 100) < data.exBulletRate) {
                this.shooterEx.data.bulletType = data.exBulletTypeAttack;
                this.shooterEx.data.bulletArcExNum = data.bulletArcExNum;
                this.shooterEx.data.bulletLineExNum = data.bulletLineExNum;
                this.shooterEx.data.bulletSize = data.bulletSize;
                this.shooterEx.fireBullet(0, cc.v2(data.exBulletOffsetX, 24));
            }
        }
    }
    //特效受击
    remoteExHurt(): void {
        for (let data of this.inventoryManager.list) {
            if (data.exBulletTypeHurt.length > 0 && Random.getRandomNum(0, 100) < data.exBulletRate) {
                this.shooterEx.data.bulletType = data.exBulletTypeHurt;
                this.shooterEx.data.bulletArcExNum = data.bulletArcExNum;
                this.shooterEx.data.bulletLineExNum = data.bulletLineExNum;
                this.shooterEx.data.bulletSize = data.bulletSize;
                this.shooterEx.fireBullet(0);
            }
        }
    }
    isHeavyRemoteShooter(): boolean {
        return this.shooter.data.isHeavy == 1;
    }
    //暂时不用
    // rotatePlayer(dir: number, pos: cc.Vec2, dt: number) {
    //     if (!this.node || this.isDied || this.isFall) {
    //         return;
    //     }
    //     // if (this.shooter && !pos.equals(cc.Vec2.ZERO)) {
    //     //     this.shooter.setHv(cc.v2(pos.x, pos.y));
    //     // }
    //     if (this.meleeWeapon && !pos.equals(cc.Vec2.ZERO)) {
    //         this.meleeWeapon.setHv(cc.v2(pos.x, pos.y));
    //     }
    //     if (this.talentShield && !pos.equals(cc.Vec2.ZERO)) {
    //         this.talentShield.flyWheel.setHv(cc.v2(pos.x, pos.y));
    //     }
    // }
    move(dir: number, pos: cc.Vec2, dt: number) {
        if (this.isDied || this.isFall || this.isDizz) {
            return;
        }

        if (this.isAttacking && !pos.equals(cc.Vec2.ZERO)) {
            if (!this.meleeWeapon.isFar && this.meleeWeapon.isStab) {
                pos = pos.mul(0.6);
            } else if (this.meleeWeapon.isFar && this.meleeWeapon.isStab){
                pos = pos.mul(0.3);
            }else if (!this.meleeWeapon.isFar && !this.meleeWeapon.isStab){
                pos = pos.mul(0.3);
            }else {
                pos = pos.mul(0.1);
            }
        }
        if (this.isHeavyRemotoAttacking && !pos.equals(cc.Vec2.ZERO)) {
            pos = pos.mul(0.1);
        }
        if (this.talentMagic && this.talentMagic.magiccircle.isShow && !this.talentMagic.hashTalent(Talent.MAGIC_05)) {
            pos = pos.mul(0.5);
        }
        if (this.talentShield && this.talentShield.IsExcuting && !this.talentMagic.hashTalent(Talent.SHIELD_12)) {
            pos = pos.mul(0.5);
        }
        if (this.shooter && !pos.equals(cc.Vec2.ZERO)) {
            this.pos = Dungeon.getIndexInMap(this.node.position);
            this.shooter.setHv(cc.v2(pos.x, pos.y));
            //存档系统保存玩家位置
            Logic.profileManager.data.playerData.pos = this.pos.clone();
        }
        if (this.shooterEx && !pos.equals(cc.Vec2.ZERO)) {
            this.shooterEx.setHv(cc.v2(pos.x, pos.y));
        }

        //调整盾牌方向
        if (this.talentShield && !pos.equals(cc.Vec2.ZERO)) {
            this.talentShield.flyWheel.setHv(cc.v2(pos.x, pos.y));
        }
        let h = pos.x;
        let v = pos.y;
        let absh = Math.abs(h);
        let absv = Math.abs(v);

        let mul = absh > absv ? absh : absv;
        mul = mul == 0 ? 1 : mul;
        let movement = cc.v2(h, v);
        let speed = this.data.getMoveSpeed();
        if (speed < 0) {
            speed = 0;
        }
        movement = movement.mul(speed);
        this.rigidbody.linearVelocity = movement;
        this.isMoving = h != 0 || v != 0;

        if (this.isMoving && !this.isAttacking && !this.meleeWeapon.isAttacking) {
            this.isFaceRight = this.meleeWeapon.getHv().x > 0;
        }
        //调整武器方向
        if (this.meleeWeapon && !pos.equals(cc.Vec2.ZERO) && !this.meleeWeapon.isAttacking) {
            this.meleeWeapon.setHv(cc.v2(pos.x, pos.y));
        }
        if (this.isMoving && !this.isStone) {
            this.playerAnim(Player.STATE_WALK);
        } else {
            this.playerAnim(Player.STATE_IDLE);
        }

        let isUpDown = dir == 1 || dir == 0;
        if (isUpDown) {
            this.changeZIndex(this.pos);
        }
    }
    resetFoot() {
        this.trousersSprite.spriteFrame = Logic.spriteFrames['playerlegs'];
        this.shoesLeftSprite.node.parent.setPosition(2, -1);
        this.shoesLeftSprite.node.parent.angle = 0;
        this.shoesRightSprite.node.parent.setPosition(-2, -1);
        this.shoesRightSprite.node.parent.angle = 0;
    }
    playerAnim(animType: number, speed?: number): void {
        let walkName = "PlayerWalk";
        switch (animType) {
            case Player.STATE_IDLE:
                if (this.anim.getAnimationState(walkName).isPlaying) {
                    this.anim.play('PlayerIdle');
                    this.shooter.playWalk(false);
                }
                break;
            case Player.STATE_WALK:
                if (!this.anim.getAnimationState(walkName).isPlaying
                    && !this.anim.getAnimationState('PlayerFist').isPlaying
                    && !this.anim.getAnimationState('PlayerAttack').isPlaying) {
                    this.anim.play(walkName);
                    this.shooter.playWalk(true);
                }
                break;
            case Player.STATE_ATTACK:
                if ((!this.meleeWeapon.isFar && this.meleeWeapon.isStab) || (this.meleeWeapon.isFar && !this.meleeWeapon.isStab)) {
                    this.anim.play('PlayerFist');
                    if (this.meleeWeapon.isFar && !this.meleeWeapon.isStab) {
                        this.anim.getAnimationState('PlayerFist').speed = 1;
                    } else {
                        this.anim.getAnimationState('PlayerFist').speed = 2;
                    }
                } else {
                    this.anim.play('PlayerAttack');
                }
                this.shooter.playWalk(true);
                break;
            case Player.STATE_FALL: break;
            case Player.STATE_DIE: break;
        }
    }

    start() {
        if (!this.node) {
            return;
        }
        this.changeZIndex(this.pos);
        let health = this.data.getHealth();
        cc.director.emit(EventConstant.HUD_UPDATE_PLAYER_HEALTHBAR, { detail: { x: health.x, y: health.y } });
    }
    fall() {
        if (this.isFall) {
            return;
        }
        this.isFall = true;
        this.anim.play('PlayerFall');
        this.isAttacking = false;
        this.scheduleOnce(() => {
            this.transportPlayer(this.defaultPos);
            this.playerAnim(Player.STATE_IDLE);
            this.resetFoot();
            let dd = new DamageData();
            dd.realDamage = 1;
            this.takeDamage(dd, FromData.getClone('跌落', ''));
            this.isFall = false;
        }, 2);
    }
    /**
     * 挨打
     * @param damageData 伤害
     * @param from 来源信息
     * @param actor 来源单位(目前只有monster)
     */
    takeDamage(damageData: DamageData, from?: FromData, actor?: Actor): boolean {
        if (!this.data) {
            return false;
        }
        //盾牌
        this.talentShield.takeDamage(damageData, actor);
        //冰盾
        let dd = this.data.getDamage(damageData);
        let dodge = this.data.getDodge();
        let isDodge = Random.rand() <= dodge && dd.getTotalDamage() > 0;
        //无敌冲刺
        if (this.talentDash.hashTalent(Talent.DASH_12) && this.talentDash.IsExcuting && dd.getTotalDamage() > 0) {
            isDodge = true;
        }
        let isIceTaken = false;
        if (dd.getTotalDamage() > 0) {
            isIceTaken = this.talentMagic.takeIce();
        }
        if (isIceTaken) {
            isDodge = true;
        }
        dd = isDodge ? new DamageData() : dd;
        let health = this.data.getHealth();
        health.x -= dd.getTotalDamage();
        if (health.x > health.y) {
            health.x = health.y;
        }
        cc.director.emit(EventConstant.HUD_UPDATE_PLAYER_HEALTHBAR, { detail: { x: health.x, y: health.y } });
        Logic.playerData.currentHealth = health.x;
        this.showFloatFont(this.node.parent, dd.getTotalDamage(), isDodge, false,false);
        if (Logic.playerData.currentHealth <= 0) {
            this.killed(from);
        }
        let valid = !isDodge && dd.getTotalDamage() > 0;
        if (valid) {
            cc.director.emit(EventConstant.CAMERA_SHAKE,{detail:{isHeavyShaking:false}});
            cc.director.emit(EventConstant.HUD_DAMAGE_CORNER_SHOW);
            this.remoteExHurt();
            cc.director.emit(EventConstant.PLAY_AUDIO, { detail: { name: AudioPlayer.PLAYER_HIT } });
        }
        return valid;
    }

    showFloatFont(dungeonNode: cc.Node, d: number, isDodge: boolean, isMiss: boolean,isCritical:boolean) {
        if (!this.floatinglabelManager) {
            return;
        }
        let flabel = this.floatinglabelManager.getFloaingLabel(dungeonNode);
        if (isDodge) {
            flabel.showDoge();
        } else if (isMiss) {
            flabel.showMiss();
        } else if (d != 0) {
            flabel.showDamage(-d,isCritical);
        } else {
            flabel.hideLabel();
        }
    }
    killed(from?: FromData) {
        if (this.isDied) {
            return;
        }
        this.isDied = true;
        this.anim.play('PlayerDie');
        cc.director.emit(EventConstant.HUD_STOP_COUNTTIME);
        cc.director.emit(EventConstant.PLAY_AUDIO, { detail: { name: AudioPlayer.DIE } });
        Achievements.addPlayerDiedLifesAchievement();
        this.scheduleOnce(() => {
            Logic.profileManager.clearData();
            Logic.dieFrom.valueCopy(from);
            cc.audioEngine.stopMusic();
            cc.director.loadScene('gameover');
        }, 1.5);
    }
    //玩家行动
    playerAction(dir: number, pos: cc.Vec2, dt: number, dungeon: Dungeon) {
        if (this.meleeWeapon && !this.meleeWeapon.dungeon) {
            this.meleeWeapon.dungeon = dungeon;
        }
        if (this.shooter && !this.shooter.dungeon) {
            this.shooter.dungeon = dungeon;
        }
        if (this.shooterEx && !this.shooterEx.dungeon) {
            this.shooterEx.dungeon = dungeon;
        }
        if (this.talentDash && !this.talentDash.IsExcuting) {
            this.move(dir, pos, dt);
        }
    }

    smokeTimeDelay = 0;
    isSmokeTimeDelay(dt: number): boolean {
        this.smokeTimeDelay += dt;
        if (this.smokeTimeDelay > 0.3) {
            this.smokeTimeDelay = 0;
            return true;
        }
        return false;
    }

    update(dt) {

        if (this.isSmokeTimeDelay(dt) && this.isMoving) {
            this.getWalkSmoke(this.node.parent, this.node.position);
        }
        this.isStone = this.statusManager.hasStatus(StatusManager.STONE);
        this.turnStone(this.isStone);
        this.node.scaleX = this.isFaceRight ? 1 : -1;
    }
    private useSkill(): void {
        if (Logic.hashTalent(Talent.SHIELD_01)) {
            if (this.talentShield) {
                this.talentShield.useShield();
            }
        } else if (Logic.hashTalent(Talent.DASH_01)) {
            if (this.talentDash) {
                this.talentDash.useDash();
            }
        } else if (Logic.hashTalent(Talent.MAGIC_01)) {
            if (this.talentMagic) {
                this.talentMagic.useMagic();
            }
        }

    }

    triggerThings() {
        if (this.touchedEquipment && !this.touchedEquipment.isTaken) {
            if (this.touchedEquipment.shopTable) {
                if (Logic.coins >= this.touchedEquipment.shopTable.data.price) {
                    cc.director.emit(EventConstant.HUD_ADD_COIN, { detail: { count: -this.touchedEquipment.shopTable.data.price } });
                    cc.director.emit(EventConstant.PLAY_AUDIO, { detail: { name: AudioPlayer.COIN } });
                    this.touchedEquipment.taken();
                    this.touchedEquipment.shopTable.data.isSaled = true;
                    this.touchedEquipment = null;
                }
            } else {
                this.touchedEquipment.taken();
                this.touchedEquipment = null;
            }
        }
        if (this.touchedItem && !this.touchedItem.data.isTaken && this.touchedItem.data.canSave) {
            if (this.touchedItem.shopTable) {
                if (Logic.coins >= this.touchedItem.shopTable.data.price) {
                    cc.director.emit(EventConstant.HUD_ADD_COIN, { detail: { count: -this.touchedItem.shopTable.data.price } });
                    cc.director.emit(EventConstant.PLAY_AUDIO, { detail: { name: AudioPlayer.COIN } });
                    this.touchedItem.taken(this);
                    this.touchedItem.shopTable.data.isSaled = true;
                    this.touchedItem = null;
                }
            } else {
                this.touchedItem.taken(this);
                this.touchedItem = null;
            }
        }
        if (this.touchedTips) {
            this.touchedTips.next();
        }
    }
    //anim
    AttackFinish() {
        this.isAttacking = false;

    }
    onPreSolve(contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider): void{
        if(otherCollider.tag == 10){
            contact.disabledOnce = true;
        }
    }
    // onBeginContact(contact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider) {
    //     let equipment = otherCollider.body.node.getComponent(Equipment);
    //     if (equipment) {
    //         this.touchedEquipment = equipment;
    //     }
    // }
    // onEndContact(contact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider) {
    //     this.touchedEquipment = null;
    // }
    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        this.touchedEquipment = null;
        this.touchedItem = null;
        this.touchedTips = null;
    }
    onCollisionExit(other: cc.Collider, self: cc.Collider) {
        this.touchedEquipment = null;
        this.touchedItem = null;
        this.touchedTips = null;
    }
    onCollisionStay(other: cc.Collider, self: cc.Collider) {
        let equipment = other.node.getComponent(Equipment);
        if (equipment) {
            this.touchedEquipment = equipment;
        }
        let item = other.node.getComponent(Item);
        if(item){
            this.touchedItem = item;
        }
        let tips = other.node.getComponent(Tips);
        if (tips) {
            this.touchedTips = tips;
        }
    }

    useItem(data:ItemData){
        Item.userIt(data,this);
    }

}