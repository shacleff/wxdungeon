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
import Shooter from './Shooter';
import Logic from './Logic';
import Dungeon from './Dungeon';
import Equipment from './Equipment/Equipment';
import EquipmentData from './Data/EquipmentData';
import MeleeWeapon from './MeleeWeapon';
import StatusManager from './Manager/StatusManager';
import DamageData from './Data/DamageData';
import InventoryManager from './Manager/InventoryManager';
import PlayerData from './Data/PlayerData';
import FloatinglabelManager from './Manager/FloatingLabelManager';
import Tips from './UI/Tips';
import Random from './Utils/Random';
import Shield from './Shield';
import TalentDash from './Talent/TalentDash';
import Actor from './Base/Actor';
import Talent from './Talent/Talent';
import AudioPlayer from './Utils/AudioPlayer';
import FromData from './Data/FromData';
import Achievements from './Achievement';
import TalentMagic from './Talent/TalentMagic';
import ItemData from './Data/ItemData';
import Item from './Item/Item';
import RoomType from './Rect/RoomType';
import Monster from './Monster';
import IndexZ from './Utils/IndexZ';
import PlayerAvatar from './PlayerAvatar';
import PlayerWeapon from './PlayerWeapon';
import { EventHelper } from './EventHelper';

@ccclass
export default class Player extends Actor {
    @property(cc.Vec3)
    pos: cc.Vec3 = cc.v3(0, 0);
    @property(FloatinglabelManager)
    floatinglabelManager: FloatinglabelManager = null;
    @property(cc.Prefab)
    walksmoke: cc.Prefab = null;
    private smokePool: cc.NodePool;
    @property(PlayerWeapon)
    weaponLeft: PlayerWeapon = null;
    @property(PlayerWeapon)
    weaponRight: PlayerWeapon = null;
    @property(Shooter)
    shooterEx: Shooter = null;
    @property(StatusManager)
    statusManager: StatusManager = null;
    @property(PlayerAvatar)
    avatar: PlayerAvatar = null;
    @property(Shield)
    shield: Shield = null;
    @property(cc.Node)
    remoteCooldown: cc.Node = null;

    isShow = false;
    isMoving = false;//是否移动中
    isDied = false;//是否死亡
    isFall = false;//是否跌落
    isStone = false;//是否石化
    isDizz = false;//是否眩晕
    invisible = false;//是否隐身
    baseAttackPoint: number = 1;

    //触碰到的装备
    touchedEquipment: Equipment;
    //触碰到的物品
    touchedItem: Item;
    //触碰到的提示
    touchedTips: Tips;
    private touchDelay = false;
    inventoryManager: InventoryManager;
    data: PlayerData;

    isFaceRight = true;
    isFaceUp = true;
    currentDir = 3;

    attackTarget: cc.Collider;
    rigidbody: cc.RigidBody;

    defaultPos = cc.v3(0, 0);

    talentDash: TalentDash;
    talentMagic: TalentMagic;
    isWeaponDashing = false;
    fistCombo = 0;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.inventoryManager = Logic.inventoryManager;
        this.data = Logic.playerData.clone();
        this.statusUpdate();
        this.pos = cc.v3(0, 0);
        this.isDied = false;
        this.isStone = false;
        this.isShow = false;
        this.scheduleOnce(()=>{this.isShow = true;},0.5)
        this.rigidbody = this.getComponent(cc.RigidBody);
        this.weaponLeft.init(this, true);
        this.weaponRight.init(this, false);
        this.remoteCooldown.width = 0;
        this.remoteCooldown.opacity = 200;
        // this.addFog();
        cc.director.on(EventHelper.PLAYER_TRIGGER
            , (event) => { this.triggerThings() });
        cc.director.on(EventHelper.PLAYER_USEITEM
            , (event) => { this.useItem(event.detail.itemData) });
        cc.director.on(EventHelper.PLAYER_SKILL
            , (event) => { this.useSkill() });
        cc.director.on(EventHelper.PLAYER_ATTACK
            , (event) => { this.meleeAttack() });
        cc.director.on(EventHelper.PLAYER_REMOTEATTACK_CANCEL
            , (event) => {
                if (this.shield && this.shield.data.equipmetType == Equipment.SHIELD) {
                    this.shield.cancel();
                }
            });
        cc.director.on(EventHelper.PLAYER_REMOTEATTACK
            , (event) => {
                if (this.shield && this.shield.data.equipmetType == Equipment.SHIELD) {
                    this.shield.use();
                } else {
                    this.remoteAttack();
                }
            });
        cc.director.on(EventHelper.PLAYER_STATUSUPDATE
            , (event) => { this.statusUpdate() });
        cc.director.on(EventHelper.PLAYER_TAKEDAMAGE
            , (event) => { this.takeDamage(event.detail.damage, event.detail.from) });

        if (Logic.mapManager.getCurrentRoomType().isEqual(RoomType.BOSS_ROOM)) {
            Logic.playerData.pos = cc.v3(Math.floor(Dungeon.WIDTH_SIZE / 2), 2);
        }
        if(Logic.playerData.pos.y==Dungeon.HEIGHT_SIZE-1){
            Logic.playerData.pos.y = Dungeon.HEIGHT_SIZE-2;
        }
        this.pos = Logic.playerData.pos.clone();
        this.defaultPos = Logic.playerData.pos.clone();
        this.baseAttackPoint = Logic.playerData.FinalCommon.damageMin;
        this.updatePlayerPos();
        this.shooterEx.player = this;
        this.shooterEx.isEx = true;
        this.smokePool = new cc.NodePool();
        cc.director.on(EventHelper.POOL_DESTORY_WALKSMOKE, (event) => {
            this.destroySmoke(event.detail.coinNode);
        })
        // this.talentShield.loadList(Logic.talentList);
        this.talentDash = this.getComponent(TalentDash);
        this.talentDash.init();
        this.talentDash.loadList(Logic.talentList);
        // this.talentDash.addTalent(Talent.DASH_11);
        this.talentMagic = this.getComponent(TalentMagic);
        this.talentMagic.init();
        this.talentMagic.loadList(Logic.talentList);
        // this.talentMagic.addTalent(Talent.MAGIC_09);
        this.playerAnim(PlayerAvatar.STATE_IDLE, this.currentDir);
        if (Logic.isCheatMode) {
            this.scheduleOnce(() => {
                this.addStatus(StatusManager.PERFECTDEFENCE, new FromData());
                // this.data.currentHealth = 1;
                // this.data.Common.maxHealth = 1;
                this.data.Common.damageMin = 999;
                this.data.Common.moveSpeed = 999;
                this.data.Common.damageBack = 2;
                this.data.Common.criticalStrikeRate = 50;
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
        this.avatar.hitLight(isStone);
    }
    private updateCombo() {
        if (!this.weaponRight.meleeWeapon.IsFist) {
            this.fistCombo = MeleeWeapon.COMBO1;
            return;
        }
        if (this.fistCombo == MeleeWeapon.COMBO1) {
            this.fistCombo = MeleeWeapon.COMBO2;
        } else if (this.fistCombo == MeleeWeapon.COMBO2) {
            this.fistCombo = MeleeWeapon.COMBO3;
        } else if (this.fistCombo == MeleeWeapon.COMBO3) {
            this.fistCombo = MeleeWeapon.COMBO1;
        } else {
            this.fistCombo = MeleeWeapon.COMBO1;
        }
        if (!this.weaponLeft.meleeWeapon.IsComboing && !this.weaponRight.meleeWeapon.IsComboing) {
            this.fistCombo = MeleeWeapon.COMBO1;
        }
    }
    dizzCharacter(dizzDuration: number) {
        if (dizzDuration > 0) {
            this.isDizz = true;
            this.rigidbody.linearVelocity = cc.Vec2.ZERO;
            this.playerAnim(PlayerAvatar.STATE_IDLE, this.currentDir);
            this.scheduleOnce(() => {
                this.isDizz = false;
            }, dizzDuration)
        }
    }
    hideCharacter(hideDuration: number) {
        if (hideDuration > 0) {
            this.invisible = true;
            this.scheduleOnce(() => {
                this.stopHiding();
            }, hideDuration)
        }
    }
    stopHiding() {
        this.invisible = false;
        this.statusManager.stopStatus(StatusManager.BOTTLE_INVISIBLE);
    }

    private statusUpdate() {
        if (!this.inventoryManager) {
            return;
        }
        this.data.EquipmentTotalData.valueCopy(this.inventoryManager.getTotalEquipmentData());
        cc.director.emit(EventHelper.HUD_UPDATE_PLAYER_INFODIALOG, { detail: { data: this.data } });
    }
    getWalkSmoke(parentNode: cc.Node, pos: cc.Vec3) {
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
        smokePrefab.zIndex = IndexZ.ACTOR;
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

    public changeEquipment(equipData: EquipmentData, spriteFrame: cc.SpriteFrame) {
        switch (equipData.equipmetType) {
            case Equipment.WEAPON:
                this.weaponRight.meleeWeapon.changeEquipment(equipData, spriteFrame, this.inventoryManager);
                break;
            case Equipment.REMOTE:
                this.weaponLeft.shooter.data = equipData.clone();
                this.weaponLeft.shooter.changeRes(this.weaponLeft.shooter.data.img);
                let c = cc.color(255, 255, 255).fromHEX(this.weaponLeft.shooter.data.color);
                this.weaponLeft.shooter.changeResColor(c);

                this.shield.data = new EquipmentData();
                this.updateEquipMent(this.shield.sprite, this.inventoryManager.shield.color
                    , Logic.spriteFrames[Equipment.EMPTY], this.shield.data.isHeavy == 1 ? 80 : 64);
                break;
            case Equipment.SHIELD:
                this.shield.data = equipData.clone();
                this.shield.node.color = cc.Color.WHITE.fromHEX(this.inventoryManager.shield.color);
                this.updateEquipMent(this.shield.sprite, this.inventoryManager.shield.color
                    , spriteFrame, this.shield.data.isHeavy == 1 ? 80 : 64);

                this.weaponLeft.shooter.data = new EquipmentData();
                this.weaponLeft.shooter.changeRes(this.weaponLeft.shooter.data.img);
                break;
            case Equipment.HELMET:
                this.avatar.hairSprite.node.opacity = this.inventoryManager.helmet.hideHair == 1 ? 0 : 255;
                this.updateEquipMent(this.avatar.helmetSprite, this.inventoryManager.helmet.color, spriteFrame);
                break;
            case Equipment.CLOTHES:
                this.updateEquipMent(this.avatar.clothesSprite, this.inventoryManager.clothes.color, spriteFrame);
                break;
            case Equipment.TROUSERS:
                let isLong = this.inventoryManager.trousers.trouserslong == 1;
                this.avatar.changeLegColor(isLong, this.inventoryManager.trousers.color);
                this.updateEquipMent(this.avatar.pantsSprite, this.inventoryManager.trousers.color, spriteFrame);
                break;
            case Equipment.GLOVES:
                this.updateEquipMent(this.weaponRight.meleeWeapon.GloveSprite, this.inventoryManager.gloves.color, spriteFrame);
                this.updateEquipMent(this.weaponLeft.meleeWeapon.GloveSprite, this.inventoryManager.gloves.color, spriteFrame);
                break;
            case Equipment.SHOES:
                this.updateEquipMent(this.avatar.shoesLeftSprite, this.inventoryManager.shoes.color, spriteFrame);
                this.updateEquipMent(this.avatar.shoesRightSprite, this.inventoryManager.shoes.color, spriteFrame);
                break;
            case Equipment.CLOAK:
                this.updateEquipMent(this.avatar.cloakSprite, this.inventoryManager.cloak.color, spriteFrame);
                break;
        }
        this.avatar.changeEquipDirSpriteFrame(this.inventoryManager, this.currentDir);
        this.shield.changeZIndexByDir(this.avatar.node.zIndex, this.currentDir);
        this.data.EquipmentTotalData.valueCopy(this.inventoryManager.getTotalEquipmentData());
        cc.director.emit(EventHelper.HUD_UPDATE_PLAYER_INFODIALOG, { detail: { data: this.data } });
        let health = this.data.getHealth();
        cc.director.emit(EventHelper.HUD_UPDATE_PLAYER_HEALTHBAR, { detail: { x: health.x, y: health.y } });
    }
    private updateEquipMent(sprite: cc.Sprite, color: string, spriteFrame: cc.SpriteFrame, size?: number): void {
        sprite.spriteFrame = spriteFrame;
        if (size && size > 0) {
            sprite.node.width = size;
            sprite.node.height = size;
        }
        let c = cc.color(255, 255, 255).fromHEX(color);
        sprite.node.color = c;
    }
    /**获取中心位置 */
    getCenterPosition(): cc.Vec3 {
        return this.node.position.clone().addSelf(cc.v3(0, 32 * this.node.scaleY));
    }
    updatePlayerPos() {
        this.node.position = Dungeon.getPosInMap(this.pos);
    }
    transportPlayer(pos: cc.Vec3) {
        if (!this.avatar.spriteNode) {
            return;
        }
        this.avatar.spriteNode.angle = 0;
        this.avatar.spriteNode.scale = 5;
        this.avatar.spriteNode.opacity = 255;
        this.avatar.spriteNode.x = 0;
        this.avatar.spriteNode.y = 0;
        this.pos = pos;
        this.changeZIndex(this.pos);
        this.updatePlayerPos();
    }
    changeZIndex(pos: cc.Vec3) {
        this.node.zIndex = IndexZ.getActorZIndex(this.node.position);
    }
    addStatus(statusType: string, from: FromData) {
        if (!this.node) {
            return;
        }
        this.statusManager.addStatus(statusType, from);
    }
    meleeAttack() {
        if (!this.weaponRight || this.isDizz || this.isDied || this.isFall
            || this.weaponRight.meleeWeapon.IsAttacking
            || this.weaponLeft.meleeWeapon.IsAttacking
            || this.shield.isDefendOrParrying) {
            return;
        }
        let pos = this.weaponRight.meleeWeapon.Hv.clone();
        if (!this.shield.isAniming) {
            this.isFaceRight = pos.x > 0;
        }
        this.isFaceUp = pos.y > 0;

        let isMiss = Logic.getRandomNum(0, 100) < this.data.StatusTotalData.missRate;
        if (isMiss) {
            this.showFloatFont(this.node.parent, 0, false, true, false);
        }
        this.updateCombo();
        if (this.fistCombo == MeleeWeapon.COMBO1) {
            this.weaponRight.meleeWeapon.attack(this.data, isMiss);
            this.weaponLeft.meleeWeapon.attackIdle(false);
        } else if (this.fistCombo == MeleeWeapon.COMBO2) {
            this.weaponRight.meleeWeapon.attackIdle(true);
            this.weaponLeft.meleeWeapon.attack(this.data, isMiss);
        } else if (this.fistCombo == MeleeWeapon.COMBO3) {
            this.weaponRight.meleeWeapon.attack(this.data, isMiss);
            this.weaponRight.meleeWeapon.DashTime(400);
            this.scheduleOnce(() => {
                this.weaponLeft.meleeWeapon.attack(this.data, isMiss);
            }, 0.15);
        }
        this.playerAnim(PlayerAvatar.STATE_ATTACK, this.currentDir);

        this.stopHiding();

    }
    useShield() {
        if (!this.weaponRight || this.isDizz || this.isDied || this.isFall
            || this.weaponRight.meleeWeapon.IsAttacking
            || this.weaponLeft.meleeWeapon.IsAttacking) {
            return;
        }
        if (this.shield.Status == Shield.STATUS_PARRY || this.shield.Status == Shield.STATUS_PUTDOWN) {
            return;
        }
    }
    remoteRate = 0;
    remoteAttack() {
        if (!this.data || this.isDizz || this.isDied || this.isFall || !this.weaponLeft.shooter) {
            return;
        }
        let fireSuccess = this.weaponLeft.remoteAttack(this.data,this.remoteCooldown);
        if (fireSuccess) {
            this.stopHiding();
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
                this.shooterEx.fireBullet(0, cc.v3(data.exBulletOffsetX, 24));
            }
        }
    }
    //特效受击
    remoteExHurt(blockLevel: number): void {
        for (let data of this.inventoryManager.list) {
            let needFire = false;
            if (data.exBulletTypeHurt.length > 0 && Random.getRandomNum(0, 100) < data.exBulletRate) {
                needFire = true;
                this.shooterEx.data.bulletType = data.exBulletTypeHurt;
            }
            if (blockLevel == Shield.BLOCK_PARRY && data.exBulletTypeParry.length > 0
                && Random.getRandomNum(0, 100) < data.exBulletRate) {
                needFire = true;
                this.shooterEx.data.bulletType = data.exBulletTypeParry;
            }
            if (blockLevel == Shield.BLOCK_NORMAL && data.exBulletTypeBlock.length > 0
                && Random.getRandomNum(0, 100) < data.exBulletRate) {
                needFire = true;
                this.shooterEx.data.bulletType = data.exBulletTypeBlock;
            }
            if (needFire) {
                this.shooterEx.data.bulletArcExNum = data.bulletArcExNum;
                this.shooterEx.data.bulletLineExNum = data.bulletLineExNum;
                this.shooterEx.data.bulletSize = data.bulletSize;
                this.shooterEx.fireBullet(0);
            }
        }
    }


    move(dir: number, pos: cc.Vec3, dt: number) {
        if (this.isDied || this.isFall || this.isDizz || !this.isShow) {
            return;
        }

        if (this.weaponRight.meleeWeapon.IsAttacking && !pos.equals(cc.Vec3.ZERO)) {
            pos = pos.mul(this.weaponRight.meleeWeapon.getMeleeSlowRatio());
        }
        if (this.weaponLeft.meleeWeapon.IsAttacking && !pos.equals(cc.Vec3.ZERO)) {
            pos = pos.mul(this.weaponLeft.meleeWeapon.getMeleeSlowRatio());
        }
        if (this.weaponLeft.isHeavyRemotoAttacking && !pos.equals(cc.Vec3.ZERO)) {
            pos = pos.mul(0.01);
        }
        if (this.shield.data.isHeavy == 1 && this.shield.Status > Shield.STATUS_IDLE) {
            pos = pos.mul(0.5);
        }
        if (this.talentMagic && this.talentMagic.magiccircle.isShow && !this.talentMagic.hashTalent(Talent.MAGIC_05)) {
            pos = pos.mul(0.3);
        }
        
        if (!pos.equals(cc.Vec3.ZERO)) {
            this.pos = Dungeon.getIndexInMap(this.node.position);
            this.data.pos = this.pos.clone();
        }
        if (!pos.equals(cc.Vec3.ZERO)) {
            this.shooterEx.setHv(cc.v3(pos.x, pos.y));
            this.weaponLeft.shooter.setHv(cc.v3(pos.x, pos.y));
            this.weaponRight.shooter.setHv(cc.v3(pos.x, pos.y));
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

        if (this.isMoving && !this.weaponLeft.meleeWeapon.IsAttacking && !this.weaponRight.meleeWeapon.IsAttacking) {
            if (!this.shield.isAniming) {
                this.isFaceRight = this.weaponLeft.meleeWeapon.Hv.x > 0;
            }
            this.isFaceUp = this.weaponLeft.meleeWeapon.Hv.y > 0;
        }
        //调整武器方向
        if (this.weaponRight.meleeWeapon && !pos.equals(cc.Vec3.ZERO) && !this.weaponRight.meleeWeapon.IsAttacking) {
            this.weaponRight.meleeWeapon.Hv = cc.v3(pos.x, pos.y);
        }
        if (this.weaponLeft.meleeWeapon && !pos.equals(cc.Vec3.ZERO) && !this.weaponLeft.meleeWeapon.IsAttacking) {
            this.weaponLeft.meleeWeapon.Hv = cc.v3(pos.x, pos.y);
        }
        if (this.isMoving && !this.isStone) {
            this.playerAnim(PlayerAvatar.STATE_WALK, dir);
        } else {
            this.playerAnim(PlayerAvatar.STATE_IDLE, dir);
        }
        if (dir != 4) {
            this.changeZIndex(this.pos);
        }
        if (dir != 4 && !this.shield.isAniming) {
            this.currentDir = dir;
            if (dir == PlayerAvatar.DIR_DOWN && this.isFaceUp) {
                dir = PlayerAvatar.DIR_UP;
            } else if (dir == PlayerAvatar.DIR_UP && !this.isFaceUp) {
                dir = PlayerAvatar.DIR_DOWN;
            }
            this.weaponLeft.changeZIndexByDir(this.avatar.node.zIndex, dir);
            this.weaponRight.changeZIndexByDir(this.avatar.node.zIndex, dir);
            this.avatar.changeEquipDirSpriteFrame(this.inventoryManager, dir);
            this.shield.changeZIndexByDir(this.avatar.node.zIndex, dir);
            this.avatar.changeAvatarByDir(dir);
        }
    }

    playerAnim(status: number, dir: number): void {
        if (status == PlayerAvatar.STATE_IDLE && this.avatar.status != PlayerAvatar.STATE_IDLE) {
            this.weaponLeft.shooter.playWalk(false);
            this.weaponRight.shooter.playWalk(false);
        }
        switch (status) {
            case PlayerAvatar.STATE_IDLE:
                if (this.avatar.status != PlayerAvatar.STATE_IDLE) {
                    this.weaponLeft.shooter.playWalk(false);
                    this.weaponRight.shooter.playWalk(false);
                }
                break;
            case PlayerAvatar.STATE_WALK:
                if (this.avatar.status != PlayerAvatar.STATE_ATTACK) {
                    this.weaponLeft.shooter.playWalk(true);
                    this.weaponRight.shooter.playWalk(true);
                }
                break;
            case PlayerAvatar.STATE_ATTACK:
                this.weaponLeft.shooter.playWalk(true);
                this.weaponRight.shooter.playWalk(true);
                break;
            case PlayerAvatar.STATE_FALL: break;
            case PlayerAvatar.STATE_DIE:
                break;
        }
        this.avatar.playAnim(status, dir);
    }

    start() {
        if (!this.node) {
            return;
        }
        this.changeZIndex(this.pos);
        let health = this.data.getHealth();
        cc.director.emit(EventHelper.HUD_UPDATE_PLAYER_HEALTHBAR, { detail: { x: health.x, y: health.y } });
    }
    fall() {
        if (this.isFall) {
            return;
        }
        this.isFall = true;
        this.avatar.playAnim(PlayerAvatar.STATE_FALL, this.currentDir);
        this.scheduleOnce(() => {
            this.transportPlayer(this.defaultPos);
            this.playerAnim(PlayerAvatar.STATE_IDLE, 1);
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
     * @param actor 来源单位(目前只有monster和boss)
     */
    takeDamage(damageData: DamageData, from?: FromData, actor?: Actor): boolean {
        if (!this.data) {
            return false;
        }
        //盾牌
        let blockLevel = this.shield.blockDamage(this, damageData, actor);
        let dd = this.data.getDamage(damageData, blockLevel);
        let dodge = this.data.FinalCommon.dodge / 100;
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
        cc.director.emit(EventHelper.HUD_UPDATE_PLAYER_HEALTHBAR, { detail: { x: health.x, y: health.y } });
        this.data.currentHealth = health.x;
        this.showFloatFont(this.node.parent, dd.getTotalDamage(), isDodge, false, false);
        if (this.data.currentHealth <= 0) {
            this.killed(from);
        }
        let valid = !isDodge && dd.getTotalDamage() > 0 && blockLevel != Shield.BLOCK_PARRY;
        if (valid || blockLevel == Shield.BLOCK_PARRY) {
            this.showDamageEffect(blockLevel);
        }
        return valid;
    }
    private showDamageEffect(blockLevel: number) {
        this.remoteExHurt(blockLevel);
        cc.director.emit(EventHelper.CAMERA_SHAKE, { detail: { isHeavyShaking: false } });
        if (blockLevel == Shield.BLOCK_NORMAL) {
            AudioPlayer.play(AudioPlayer.BOSS_ICEDEMON_HIT);
            cc.director.emit(EventHelper.HUD_DAMAGE_CORNER_SHOW);
        } else if (blockLevel == Shield.BLOCK_PARRY) {
            AudioPlayer.play(AudioPlayer.MELEE_PARRY);
        } else {
            AudioPlayer.play(AudioPlayer.PLAYER_HIT);
            cc.director.emit(EventHelper.HUD_DAMAGE_CORNER_SHOW);
        }
    }

    showFloatFont(dungeonNode: cc.Node, d: number, isDodge: boolean, isMiss: boolean, isCritical: boolean) {
        if (!this.floatinglabelManager) {
            return;
        }
        let flabel = this.floatinglabelManager.getFloaingLabel(dungeonNode);
        if (isDodge) {
            flabel.showDoge();
        } else if (isMiss) {
            flabel.showMiss();
        } else if (d != 0) {
            flabel.showDamage(-d, isCritical);
        } else {
            flabel.hideLabel();
        }
    }
    killed(from?: FromData) {
        if (this.isDied) {
            return;
        }
        this.isDied = true;
        this.avatar.playAnim(PlayerAvatar.STATE_DIE, this.currentDir);
        cc.director.emit(EventHelper.HUD_STOP_COUNTTIME);
        cc.director.emit(EventHelper.PLAY_AUDIO, { detail: { name: AudioPlayer.DIE } });
        Achievements.addPlayerDiedLifesAchievement();
        this.weaponLeft.node.opacity = 0;
        this.weaponRight.node.opacity = 0;
        this.scheduleOnce(() => {
            Logic.dieFrom.valueCopy(from);
            cc.audioEngine.stopMusic();
            cc.director.loadScene('gameover');
        }, 1.5);
    }
    //玩家行动
    playerAction(dir: number, pos: cc.Vec3, dt: number, dungeon: Dungeon) {
        if (this.weaponLeft.meleeWeapon && !this.weaponLeft.meleeWeapon.dungeon) {
            this.weaponLeft.meleeWeapon.dungeon = dungeon;
        }
        if (this.weaponRight.meleeWeapon && !this.weaponRight.meleeWeapon.dungeon) {
            this.weaponRight.meleeWeapon.dungeon = dungeon;
        }
        if (this.weaponRight.shooter && !this.weaponRight.shooter.dungeon) {
            this.weaponRight.shooter.dungeon = dungeon;
        }
        if (this.weaponLeft.shooter && !this.weaponLeft.shooter.dungeon) {
            this.weaponLeft.shooter.dungeon = dungeon;
        }
        if (this.shooterEx && !this.shooterEx.dungeon) {
            this.shooterEx.dungeon = dungeon;
        }
        if (this.talentDash && !this.talentDash.IsExcuting && !this.isWeaponDashing) {
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
        let stone = this.isStone;
        this.isStone = this.statusManager.hasStatus(StatusManager.STONE);
        if (stone == !this.isStone) {
            this.turnStone(this.isStone);
        }
        this.node.scaleX = this.isFaceRight ? 1 : -1;
        this.node.opacity = this.invisible ? 80 : 255;
    }
    private useSkill(): void {
        if (Logic.hashTalent(Talent.DASH_01)) {
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
            // EventHelper.emit(EventHelper.HUD_CONTROLLER_INTERACT_SHOW,false);
            if (this.touchedEquipment.shopTable) {
                if (Logic.coins >= this.touchedEquipment.shopTable.data.price) {
                    cc.director.emit(EventHelper.HUD_ADD_COIN, { detail: { count: -this.touchedEquipment.shopTable.data.price } });
                    cc.director.emit(EventHelper.PLAY_AUDIO, { detail: { name: AudioPlayer.COIN } });
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
            // EventHelper.emit(EventHelper.HUD_CONTROLLER_INTERACT_SHOW,false);
            if (this.touchedItem.shopTable) {
                if (Logic.coins >= this.touchedItem.shopTable.data.price) {
                    cc.director.emit(EventHelper.HUD_ADD_COIN, { detail: { count: -this.touchedItem.shopTable.data.price } });
                    cc.director.emit(EventHelper.PLAY_AUDIO, { detail: { name: AudioPlayer.COIN } });
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
            // EventHelper.emit(EventHelper.HUD_CONTROLLER_INTERACT_SHOW,false);
            this.touchedTips.next();
        }
    }
    onPreSolve(contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider): void {
        if (otherCollider.node.getComponent(Monster) && this.talentDash && (this.talentDash.IsExcuting || this.isWeaponDashing)) {
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
        // EventHelper.emit(EventHelper.HUD_CONTROLLER_INTERACT_SHOW,false);
    }
    onCollisionExit(other: cc.Collider, self: cc.Collider) {
        this.touchedEquipment = null;
        this.touchedItem = null;
        this.touchedTips = null;
        // EventHelper.emit(EventHelper.HUD_CONTROLLER_INTERACT_SHOW,false);
    }
    onCollisionStay(other: cc.Collider, self: cc.Collider) {
        if (this.touchDelay) {
            return;
        }
        let isInteract = false;
        let equipment = other.node.getComponent(Equipment);
        if (equipment) {
            isInteract = true;
            this.touchedEquipment = equipment;
        }
        let item = other.node.getComponent(Item);
        if (item) {
            isInteract = true;
            this.touchedItem = item;

        }
        let tips = other.node.getComponent(Tips);
        if (tips) {
            isInteract = true;
            this.touchedTips = tips;
        }
        if (isInteract) {
            // EventHelper.emit(EventHelper.HUD_CONTROLLER_INTERACT_SHOW,true);
            this.touchDelay = true;
            this.scheduleOnce(() => { this.touchDelay = false; }, 0.1);
        }

    }

    useItem(data: ItemData) {
        Item.userIt(data, this);
    }

}