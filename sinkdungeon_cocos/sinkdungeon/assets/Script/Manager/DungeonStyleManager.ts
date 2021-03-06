import Logic from "../Logic";
import Dungeon from "../Dungeon";
import DungeonStyleData from "../Data/DungeonStyleData";
import ParallexBackground from "../UI/ParallaxBackground";
import IndexZ from "../Utils/IndexZ";
import LevelData from "../Data/LevelData";

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
export default class DungeonStyleManager extends cc.Component {


    @property(cc.Node)
    background01: cc.Node = null;
    @property(cc.Node)
    floor: cc.Node = null;
    @property(cc.Prefab)
    parallaxBackground: cc.Prefab = null;
    styleData: DungeonStyleData;
    readonly darksides = 'darksides';

    runBackgroundAnim(resName: string) {
        if (!this.background01) {
            return;
        }
        let spf1 = Logic.spriteFrames[resName];
        let spf2 = Logic.spriteFrames[resName + '1'];
        if (!spf2) { spf2 = Logic.spriteFrames[resName]; }
        if (!spf1) {
            return;
        }
        this.background01.stopAllActions();
        let sprite = this.background01.getComponent(cc.Sprite);
        let action = cc.repeatForever(cc.sequence(
            cc.moveBy(0.4, 0, 0), cc.callFunc(() => { sprite.spriteFrame = spf1; }),
            cc.moveBy(0.4, 0, 0), cc.callFunc(() => { sprite.spriteFrame = spf2; })));
        this.background01.runAction(action);

    }
    addDecorations() {
        switch (Logic.chapterIndex) {
            case Logic.CHAPTER00: this.styleData = new DungeonStyleData('pipeline', 'restwall1', 'restsides', 'restdoor', 'restdoorframe', '#000000', 'tile_lab001'); break;
            case Logic.CHAPTER01: this.styleData = new DungeonStyleData('sea', 'shipwall1', 'shipsides', 'shipdoor', 'shipdoorframe', '#000000', 'tile_deck001'); break;
            case Logic.CHAPTER02: this.styleData = new DungeonStyleData('grass', 'junglewall1', 'junglesides', 'jungledoor', 'jungledoorframe', '#000000', 'tile_dirt001'); break;
            case Logic.CHAPTER03: this.styleData = new DungeonStyleData('sandsea', 'pyramidwall1', 'pyramidsides', 'pyramiddoor', 'pyramiddoorframe', '#000000', 'tile003'); break;
            case Logic.CHAPTER04: this.styleData = new DungeonStyleData('magmasea', 'dungeonwall1', 'dungeonsides', 'dungeondoor', 'dungeondoorframe', '#000000', 'tile004'); break;
            case Logic.CHAPTER05: this.styleData = new DungeonStyleData('magmasea', 'dungeonwall1', 'dungeonsides', 'dungeondoor', 'dungeondoorframe', '#000000', 'tile004'); break;
            case Logic.CHAPTER099: this.styleData = new DungeonStyleData('pipeline', 'restwall1', 'restsides', 'restdoor', 'restdoorframe', '#000000', 'tile_lab001'); break;

        }
        if (!this.styleData) {
            return;
        }
        this.addFloor();
        // this.background01.getComponent(cc.Sprite).spriteFrame = this.styleData.background ? Logic.spriteFrames[this.styleData.background] : null;
        // this.runBackgroundAnim(this.styleData.background);
        this.background01.getComponent(cc.Sprite).spriteFrame = null;
        this.addDecorateBg();
    }

    private addDecorateBg() {
        let bg = cc.instantiate(this.parallaxBackground);
        bg.parent = this.node;
        let pos = Dungeon.getPosInMap(cc.v3(Dungeon.WIDTH_SIZE / 2, Dungeon.HEIGHT_SIZE / 2));
        bg.setPosition(pos);
        bg.zIndex = IndexZ.BACKGROUND;
        let pbg = bg.getComponent(ParallexBackground);
        pbg.background.width = Dungeon.TILE_SIZE/2 * Dungeon.WIDTH_SIZE;
        pbg.background.height = Dungeon.TILE_SIZE/2 * (Dungeon.HEIGHT_SIZE + 4);
        pbg.background.color = cc.Color.WHITE.fromHEX(this.styleData.bg02color);
        pbg.init();
    }
    private addFloor() {
        let leveldata: LevelData = Logic.worldLoader.getCurrentLevelData();
        this.floor.width = Dungeon.TILE_SIZE/4 * (Dungeon.WIDTH_SIZE + 0);
        this.floor.height = Dungeon.TILE_SIZE/4 * (Dungeon.HEIGHT_SIZE + 0);
        let pos = Dungeon.getPosInMap(cc.v3(0, 0));
        this.floor.position = cc.v3(pos.x - Dungeon.TILE_SIZE/2, pos.y - Dungeon.TILE_SIZE/2);
        this.floor.zIndex = IndexZ.BACKGROUNDFLOOR;
        this.floor.getComponent(cc.Sprite).spriteFrame = Logic.spriteFrames[`${leveldata.floorRes}001`];
    }

}
