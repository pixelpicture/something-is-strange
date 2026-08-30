export interface StoredValue { key:string; value:string; }
export interface AnalyticsEvent { name:string; properties?:Record<string,string|number|boolean>; }
export interface PlatformAdapter {
  nowMs():number;
  vibrate(kind:'light'|'success'|'error'):void;
  load(key:string):Promise<string|null>;
  save(value:StoredValue):Promise<void>;
  track(event:AnalyticsEvent):void;
  shareResult?(payload:{score:number;rank:string;imagePath?:string}):Promise<void>;
}

export class LocalPlatformAdapter implements PlatformAdapter {
  private store=new Map<string,string>();
  nowMs(){return performance.now();}
  vibrate(){/* intentionally inert in local evidence harness */}
  async load(key:string){return this.store.get(key)??null;}
  async save(v:StoredValue){this.store.set(v.key,v.value);}
  track(){/* local adapter emits no network traffic */}
}
