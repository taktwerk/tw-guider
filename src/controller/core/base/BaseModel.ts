import { AfterInsert, AfterRemove, AfterUpdate, BaseEntity } from "typeorm";

export class BaseModel extends BaseEntity {

  set(data: any) {
    for (const d in data) {
      const e: any = this;
      e[d] = data[d];
    }
  }

  get(key: string) {
    try {
      const e: any = this;
      return e[key];
    } catch {
      return null;
    }
  }

  noCirculars(v: any) {
    const set = new Set();
    const noCirculars: any = (v: any) => {
      if (Array.isArray(noCirculars)) {
        return v.map(noCirculars);
      }
      if (typeof v === "object" && v !== null) {
        if (set.has(v)) {
          return undefined;
        }
        set.add(v);

        return Object.entries(
          Object.entries(v).map(([k, v]) => [k, noCirculars(v)])
        );
      }
      return v;
    };
    return noCirculars(v);
  }

  stringify(circObj: Object) {
    const replacerFunc = () => {
      const visited = new WeakSet();
      return (key: any, value: any) => {
        if (typeof value === "object" && value !== null) {
          if (visited.has(value)) {
            return;
          }
          visited.add(value);
        }
        return value;
      };
    };

    return JSON.stringify(circObj, replacerFunc());
  }

  static getClassName() {
    const classname = this.toString()
      .split("(" || /s+/)[0]
      .split(" " || /s+/)[1];
    return classname;
  }

  static createFromArray(datas: Array<any> = []): any {
    const objs = [];
    for (const data of datas) {
      const obj = new this();
      obj.set(data);
      objs.push(obj);
    }
    return objs;
  }

  static createNew(data: any): any {
    const obj = new this();
    obj.set(data);
    return obj;
  }

  @AfterRemove()
  @AfterUpdate()
  @AfterInsert()
  commitDatabase() {
    try {
      setTimeout(() => {
        (window as any).sqlite.saveToStore('guider');
      }, 1000);

    } catch(e) {
      console.log(e);
    }

  }
}
