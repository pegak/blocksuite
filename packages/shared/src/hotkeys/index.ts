import hotkeys, { KeyHandler } from 'hotkeys-js';
hotkeys.filter = () => true;
type Options = {
  scope?: string;
  element?: HTMLElement | null;
  keyup?: boolean | null;
  keydown?: boolean | null;
  capture?: boolean;
  splitKey?: string;
};

export class Hotkeys {
  private _hotkeys: typeof hotkeys;
  private _hotkeyScope: Options['scope'];
  constructor() {
    this._hotkeys = hotkeys;
  }

  addHotkey(
    hotkey: string,
    scope: Options['scope'],
    element: Options['element'],
    callback: KeyHandler
  ) {
    this._hotkeys(hotkey, { scope, element }, callback);
  }

  removeHotkey(hotkey: string | Array<string>) {
    this._hotkeys.unbind(...(Array.isArray(hotkey) ? hotkey : [hotkey]));
  }

  useHotkey(scope: string) {
    this._hotkeyScope = scope;
    this._hotkeys.setScope(this._hotkeyScope);
  }
}
