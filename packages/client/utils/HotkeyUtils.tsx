import { PlatformUtils } from './PlatformUtils';

const META_KEY = PlatformUtils.isApple() ? 'meta' : 'ctrl';

export class HotkeysUtils {
  static Select = '1';
  static Pan = '2';
  static Fog = '3';
  static Draw = '4';
  static Shape = '5';
  static Measure = '6';
  static Note = '7';
  static Grid = 'g';
  static TemporaryPan = 'space';
  static ZoomIn = `${META_KEY}+=`;
  static ZoomOut = `${META_KEY}+-`;
  static ZoomToFit = `${META_KEY}+0`;
  static Delete1 = 'backspace';
  static Delete2 = 'delete';
  static Cancel = 'esc';
  static Submit = 'enter';
  static Up = 'up';
  static Right = 'right';
  static Down = 'down';
  static Left = 'left';
  static Adventurers = 'a';
  static Objects = 'o';
  static BattleMaps = 'b';
  static Chat = 'c';
  static CombatTracker = 't';
  static Monsters = 'm';
  static Spells = 's';
  static DiceRoller = 'd';
  static Shortcuts = 'k';
  static Undo = `${META_KEY}+z`;
  static Redo = `${META_KEY}+shift+z`;
  static Bold = `${META_KEY}+b`;
  static Italic = `${META_KEY}+i`;
  static Underline = `${META_KEY}+u`;
  static Heading1 = `${META_KEY}+alt+1`;
  static Heading2 = `${META_KEY}+alt+2`;
}
