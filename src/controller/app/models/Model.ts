declare var window: any;
export class Model {

  className = 'Empty';

  set(data: any, saveLocal = false) {
    for(let d in data) {
      let e: any = this;
      e[d] = data[d];
    }

    if(saveLocal) {
      this.saveLocal();
    }
  }

  get(key: string) {
    try {
      let e: any = this;
      return e[key];
    } catch {
      return null;
    }
  }

  noCirculars(v: any){
    const set = new Set;
    const noCirculars:any = (v:any) => {
      if(Array.isArray(noCirculars))
        return v.map(noCirculars);
      if(typeof v === "object" && v !== null) {
        if(set.has(v)) return undefined;
        set.add(v);

        return Object.entries(Object.entries(v)
         .map(([k, v]) => ([k, noCirculars(v)])));
      }
      return v;
    };
    return noCirculars(v);
  };

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

    return JSON.stringify(circObj, replacerFunc())
  }

  saveLocal() {
    const data = this.stringify(this);
    localStorage.setItem(this.className, data);
  }

  loadFromLocal() {
    const data: any = localStorage.getItem(this.className);
    try {
      this.set(JSON.parse(data));
    } catch {
      //
    }
  }

  static getClassName() {
    let classname = this.toString().split ('(' || /s+/)[0].split (' ' || /s+/)[1];
    return classname;
  }

  static createFromArray(datas: Array<any> = []): any {
    let objs = [];
    for(let data of datas){
      let obj =  new this;
      obj.set(data);
      objs.push(obj);
    }
    return objs;
  }

  static create(data: any): any {
    let obj =  new this;
    obj.set(data);
    return obj;
  }
}
