// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Logic from "./Logic";
import InventoryManager from "./Manager/InventoryManager";
import AvatarData from "./Data/AvatarData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PlayerAvatar extends cc.Component {

    static readonly DIR_UP = 0;
    static readonly DIR_DOWN = 1;
    static readonly DIR_LEFT = 2;
    static readonly DIR_RIGHT = 3;
    static readonly STATE_IDLE = 0;
    static readonly STATE_WALK = 1;
    static readonly STATE_ATTACK = 2;
    static readonly STATE_FALL = 3;
    static readonly STATE_DIE = 4;
    dir = PlayerAvatar.DIR_RIGHT;
    status = PlayerAvatar.STATE_IDLE;
    anim: cc.Animation;
    cloakSprite: cc.Sprite = null;
    legLeftSprite: cc.Sprite = null;
    legRightSprite: cc.Sprite = null;
    footLeftSprite: cc.Sprite = null;
    footRightSprite: cc.Sprite = null;
    shoesLeftSprite: cc.Sprite = null;
    shoesRightSprite: cc.Sprite = null;
    headSprite: cc.Sprite = null;
    faceSprite: cc.Sprite = null;
    eyesSprite: cc.Sprite = null;
    hairSprite: cc.Sprite = null;
    helmetSprite: cc.Sprite = null;
    bodySprite: cc.Sprite = null;
    pantsSprite: cc.Sprite = null;
    clothesSprite: cc.Sprite = null;
    avatarNode: cc.Node = null;
    spriteNode: cc.Node = null;
    data: AvatarData;
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.init();
    }
    private init() {
        this.data = Logic.playerData.AvatarData.clone();
        this.anim = this.getComponent(cc.Animation);
        this.avatarNode = this.getSpriteChildNode(['sprite', 'avatar']);
        this.spriteNode = this.getSpriteChildNode(['sprite']);
        this.cloakSprite = this.getSpriteChildSprite(['sprite', 'cloak']);
        this.legLeftSprite = this.getSpriteChildSprite(['sprite', 'avatar', 'legleft']);
        this.legRightSprite = this.getSpriteChildSprite(['sprite', 'avatar', 'legright']);
        this.footLeftSprite = this.getSpriteChildSprite(['sprite', 'avatar', 'legleft', 'foot']);
        this.footRightSprite = this.getSpriteChildSprite(['sprite', 'avatar', 'legright', 'foot']);
        this.shoesLeftSprite = this.getSpriteChildSprite(['sprite', 'avatar', 'legleft', 'foot', 'shoes']);
        this.shoesRightSprite = this.getSpriteChildSprite(['sprite', 'avatar', 'legright', 'foot', 'shoes']);
        this.headSprite = this.getSpriteChildSprite(['sprite', 'avatar', 'head']);
        this.faceSprite = this.getSpriteChildSprite(['sprite', 'avatar', 'head', 'face']);
        this.eyesSprite = this.getSpriteChildSprite(['sprite', 'avatar', 'head', 'eyes']);
        this.hairSprite = this.getSpriteChildSprite(['sprite', 'avatar', 'head', 'hair']);
        this.helmetSprite = this.getSpriteChildSprite(['sprite', 'avatar', 'head', 'helmet']);
        this.bodySprite = this.getSpriteChildSprite(['sprite', 'avatar', 'body']);
        this.pantsSprite = this.getSpriteChildSprite(['sprite', 'avatar', 'body', 'pants']);
        this.clothesSprite = this.getSpriteChildSprite(['sprite', 'avatar', 'body', 'clothes']);
        this.headSprite.node.color = cc.Color.WHITE.fromHEX(this.data.skinColor);
        this.faceSprite.node.color = cc.Color.WHITE.fromHEX(this.data.faceColor);
        this.eyesSprite.node.color = cc.Color.WHITE.fromHEX(this.data.eyesColor);
        this.hairSprite.node.color = cc.Color.WHITE.fromHEX(this.data.hairColor);
        this.bodySprite.node.color = cc.Color.WHITE.fromHEX(this.data.skinColor);
        this.legLeftSprite.node.color = cc.Color.WHITE.fromHEX(this.data.skinColor);
        this.legRightSprite.node.color = cc.Color.WHITE.fromHEX(this.data.skinColor);
        this.footLeftSprite.node.color = cc.Color.WHITE.fromHEX(this.data.skinColor);
        this.footRightSprite.node.color = cc.Color.WHITE.fromHEX(this.data.skinColor);
        this.hairSprite.node.stopAllActions();
        this.changeAvatarByDir(PlayerAvatar.DIR_RIGHT);
        let index = 0;
        this.schedule(() => {
            this.hairSprite.spriteFrame = Logic.spriteFrames[this.data.hairResName + this.idlehair[index++]];
            if (index > 1) {
                index = 0;
            }
        }, 0.2, cc.macro.REPEAT_FOREVER, 0.1);
    }
    private getSpriteChildSprite(childNames: string[]): cc.Sprite {
        let node = this.node;
        for (let name of childNames) {
            node = node.getChildByName(name);
        }
        return node.getComponent(cc.Sprite);
    }
    private getSpriteChildNode(childNames: string[]): cc.Node {
        let node = this.node;
        for (let name of childNames) {
            node = node.getChildByName(name);
        }
        return node;
    }
    playAnim(status: number, dir: number) {
        if (!this.anim) {
            this.init();
        }
        switch (status) {
            case PlayerAvatar.STATE_IDLE:
                if (this.status != status
                    && PlayerAvatar.STATE_DIE != this.status) {
                    this.playIdle(dir);
                }
                break;
            case PlayerAvatar.STATE_WALK:
                if ((this.status != status || this.dir != dir)
                    && PlayerAvatar.STATE_ATTACK != this.status
                    && PlayerAvatar.STATE_DIE != this.status) {
                    this.playWalk(dir);
                }
                break;
            case PlayerAvatar.STATE_ATTACK:
                if (PlayerAvatar.STATE_DIE != this.status) {
                    this.playAttack(dir);
                }
                break;
            case PlayerAvatar.STATE_DIE:
                if (PlayerAvatar.STATE_DIE != this.status) {
                    this.playDie();
                }
                break;
            case PlayerAvatar.STATE_FALL:
                if (PlayerAvatar.STATE_DIE != this.status) {
                    this.anim.play('AvatarFall');
                }
                break;
        }
        this.status = status;
        this.dir = dir;
    }

    changeLegColor(isLong: boolean, colorHex: string) {
        if (isLong) {
            this.legLeftSprite.node.color = cc.Color.WHITE.fromHEX(colorHex);
            this.legRightSprite.node.color = cc.Color.WHITE.fromHEX(colorHex);
            this.footLeftSprite.node.color = cc.Color.WHITE.fromHEX(colorHex);
            this.footRightSprite.node.color = cc.Color.WHITE.fromHEX(colorHex);
        } else {
            this.legLeftSprite.node.color = cc.Color.WHITE.fromHEX(this.data.skinColor);
            this.legRightSprite.node.color = cc.Color.WHITE.fromHEX(this.data.skinColor);
            this.footLeftSprite.node.color = cc.Color.WHITE.fromHEX(this.data.skinColor);
            this.footRightSprite.node.color = cc.Color.WHITE.fromHEX(this.data.skinColor);
        }

    }
    hitLight(isHit: boolean) {
        this.bodySprite.getMaterial(0).setProperty('addColor', isHit ? cc.color(200, 200, 200, 100) : cc.Color.TRANSPARENT);
        this.headSprite.getMaterial(0).setProperty('addColor', isHit ? cc.color(200, 200, 200, 100) : cc.Color.TRANSPARENT);
        this.hairSprite.getMaterial(0).setProperty('addColor', isHit ? cc.color(200, 200, 200, 100) : cc.Color.TRANSPARENT);
        this.faceSprite.getMaterial(0).setProperty('addColor', isHit ? cc.color(200, 200, 200, 100) : cc.Color.TRANSPARENT);
        this.eyesSprite.getMaterial(0).setProperty('addColor', isHit ? cc.color(200, 200, 200, 100) : cc.Color.TRANSPARENT);
        // this.handLeftSprite.getMaterial(0).setProperty('addColor',isHit?cc.color(200,200,200,100):cc.Color.TRANSPARENT);
        // this.handRightSprite.getMaterial(0).setProperty('addColor',isHit?cc.color(200,200,200,100):cc.Color.TRANSPARENT);
        this.legLeftSprite.getMaterial(0).setProperty('addColor', isHit ? cc.color(200, 200, 200, 100) : cc.Color.TRANSPARENT);
        this.legRightSprite.getMaterial(0).setProperty('addColor', isHit ? cc.color(200, 200, 200, 100) : cc.Color.TRANSPARENT);
        this.footLeftSprite.getMaterial(0).setProperty('addColor', isHit ? cc.color(200, 200, 200, 100) : cc.Color.TRANSPARENT);
        this.footLeftSprite.getMaterial(0).setProperty('addColor', isHit ? cc.color(200, 200, 200, 100) : cc.Color.TRANSPARENT);

    }
    changeEquipDirSpriteFrame(inventoryManager: InventoryManager, dir: number) {
        this.cloakSprite.node.zIndex = dir == 0 ? this.avatarNode.zIndex + 1 : this.avatarNode.zIndex - 1;
        if (dir == 0 && Logic.spriteFrames['behind' + inventoryManager.helmet.img]) {
            this.helmetSprite.spriteFrame = Logic.spriteFrames['behind' + inventoryManager.helmet.img];
        } else if (dir == 1 && Logic.spriteFrames['front' + inventoryManager.helmet.img]) {
            this.helmetSprite.spriteFrame = Logic.spriteFrames['front' + inventoryManager.helmet.img];
        } else {
            this.helmetSprite.spriteFrame = Logic.spriteFrames[inventoryManager.helmet.img];
        }
        if (dir == 0 && Logic.spriteFrames['behind' + inventoryManager.clothes.img]) {
            this.clothesSprite.spriteFrame = Logic.spriteFrames['behind' + inventoryManager.clothes.img];
        } else if (dir == 1 && Logic.spriteFrames['front' + inventoryManager.clothes.img]) {
            this.clothesSprite.spriteFrame = Logic.spriteFrames['front' + inventoryManager.clothes.img];
        } else {
            this.clothesSprite.spriteFrame = Logic.spriteFrames[inventoryManager.clothes.img];
        }
    }
    private playDie() {
        this.anim.play('AvatarDie');
    }
    private playIdle(dir: number) {
        this.anim.play('AvatarIdle');

    }
    idlehair = [0, 1];
    changeAvatarByDir(dir: number,isFaceUp?:number) {
        let eyesprefix = this.data.eyesResName;
        let faceprefix = this.data.faceResName;
        switch (dir) {
            case PlayerAvatar.DIR_UP:
                this.idlehair = [2, 3];
                this.eyesSprite.spriteFrame = null;
                this.faceSprite.spriteFrame = null;
                break;
            case PlayerAvatar.DIR_DOWN:
                this.idlehair = [0, 1];
                this.eyesSprite.spriteFrame = Logic.spriteFrames[eyesprefix + 0];
                this.faceSprite.spriteFrame = Logic.spriteFrames[faceprefix + 0];
                break;
            case PlayerAvatar.DIR_LEFT:
                this.idlehair = [4, 5];
                this.eyesSprite.spriteFrame = Logic.spriteFrames[eyesprefix + 1];
                this.faceSprite.spriteFrame = Logic.spriteFrames[faceprefix + 1];
                break;
            case PlayerAvatar.DIR_RIGHT:
                this.idlehair = [4, 5];
                this.eyesSprite.spriteFrame = Logic.spriteFrames[eyesprefix + 1];
                this.faceSprite.spriteFrame = Logic.spriteFrames[faceprefix + 1];
                break;
        }
        this.hairSprite.spriteFrame = Logic.spriteFrames[this.data.hairResName + this.idlehair[0]];
        if (dir != 4) {
            this.cloakSprite.node.zIndex = dir == 0 ? this.avatarNode.zIndex + 1 : this.avatarNode.zIndex - 1;
        }
    }
    private playWalk(dir: number) {
        this.anim.play(dir == PlayerAvatar.DIR_UP || dir == PlayerAvatar.DIR_DOWN ? 'AvatarWalkVertical' : 'AvatarWalkHorizontal');
    }
    private playAttack(dir: number) {
        this.anim.play(dir == PlayerAvatar.DIR_UP || dir == PlayerAvatar.DIR_DOWN ? 'AvatarAttackVertical' : 'AvatarAttackHorizontal');
        let offsetX = 0;
        let offsetY = 0;
        switch (dir) {
            case PlayerAvatar.DIR_UP:
                offsetY = -16;
                break;
            case PlayerAvatar.DIR_DOWN:
                offsetY = 16;
                break;
            case PlayerAvatar.DIR_LEFT:
                offsetX = -16;
                break;
            case PlayerAvatar.DIR_RIGHT:
                offsetX = -16;
                break;
        }
        cc.tween(this.spriteNode).stop();
        cc.tween(this.spriteNode).to(0.1, { position: cc.v3(offsetX, offsetY) })
            .to(0.1, { position: cc.v3(-offsetX, -offsetY) })
            .to(0.1, { position: cc.v3(0, 0) }).delay(0.1).call(() => {
                this.playAnim(PlayerAvatar.STATE_IDLE, dir);
            }).start();
    }

    start() {

    }

    // update (dt) {}
}
