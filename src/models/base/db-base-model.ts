import {Platform, Events} from '@ionic/angular';
import {DbProvider} from '../../providers/db-provider';
import {AppSetting} from '../../services/app-setting';
import {DownloadService} from '../../services/download-service';

/**
 * Extend this abstract Helper class for every DB-Model.
 *
 * Make sure to implement all abstract properties and methods.
 */
export abstract class DbBaseModel {
    public static TYPE_NUMBER: number = 0;
    public static TYPE_STRING: number = 1;
    public static TYPE_DATE: number = 2;
    public static TYPE_BOOLEAN: number = 3;
    public static TYPE_OBJECT: number = 4;
    public static TYPE_DECIMAL: number = 5;

    private dbIsReady: boolean = false;
    private dbIsBusy: boolean = false;

    public updateCondition: any = [];

    // db helper's public and protected members
    /** primary key */
    public id: number;
    /** id's column name */
    public COL_ID: string = '_id';

    public UNIQUE_PAIR: string = '';

    // db helper's abstract contract
    /**
     * TAG used for Logging.
     * @type {string}
     */
    abstract TAG: string = 'DbBaseModel';
    /** this instance's table name for SQLite db */
    abstract TABLE_NAME: string;

    queryBuilder: string;
    queryWhereArray: [] = [];

    /**
     * Holds information about the SQLite table provided by
     * a column-name and its db schema type as shown in the example below.
     * Every row is a field-definition. E.g. following snippet.
     * ```
     * [
     *   // ...
     *   [HardwareApi.COL_NAME, 'VARCHAR(255)', DbBaseModel.TYPE_STRING],
     *   // ...
     * ]
     * ```
     * The above snippet is a field-definition for the field 'name' in the table 'hardware'.
     * 1st position: column name (in db)
     * 2nd position: column type (SQLite Schema Type)
     * 3th position: variable type (DbBaseModel.TYPE_<x>
     * 4th position: column name (in object) (optional)
     *
     * Example of TABLE declaration:
     * ```
     * TABLE: any = [
     *   [UserDb.COL_USER_SETTING, 'TEXT', DbBaseModel.TYPE_OBJECT ],
     *   [UserDb.COL_USER_ID, 'INT UNIQUE', DbBaseModel.TYPE_NUMBER, 'userId' ],
     *   [UserDb.COL_USER_ID, 'INT UNIQUE', DbBaseModel.TYPE_NUMBER, 'userId', true ],
     * ];
     * ```
     */
    abstract TABLE: any;

    /**
     * Loads an instance from a given db row (item).
     * @param item db row
     */
    public loadFromAttributes(item: any): DbBaseModel {
        this[this.COL_ID] = item[this.COL_ID];
        for (const column of this.TABLE) {
            // get column name (if defined in 4th column - otherwise get column name defined in 1st column)
            const columnName = column[3] ? column[3] : column[0];
            const value: any = item[column[0]];
            switch (column[2]) {
                case DbBaseModel.TYPE_NUMBER :
                    (<any> this)[columnName] = this.getNumberValue(value);
                    break;
                case DbBaseModel.TYPE_DECIMAL :
                    (<any> this)[columnName] = this.getDecimalValue(value);
                    break;
                case DbBaseModel.TYPE_STRING :
                    (<any> this)[columnName] = this.getStringValue(value);
                    break;
                case DbBaseModel.TYPE_DATE :
                    (<any> this)[columnName] = this.getDateValue(value);
                    break;
                case DbBaseModel.TYPE_BOOLEAN :
                    (<any> this)[columnName] = this.getBooleanValue(value);
                    break;
                case DbBaseModel.TYPE_OBJECT :
                    (<any> this)[columnName] = this.getObjectValue(value);
                    break;
            }
        }
        this.updateCondition = [[this.COL_ID, this[this.COL_ID]]];
        return this;
    }

    /**
     * Base Model Constructor (never directly called since we are an abstract class)
     * @param platform
     * @param db
     * @param events
     * @param downloadService
     */
    constructor(
        public platform: Platform,
        public db: DbProvider,
        public events: Events,
        public downloadService: DownloadService,
    ) {
    }

    /**
     * Initializes the database incl. the create table statement
     * when the database is ready.
     * @returns {Promise<T>}
     */
    private initDb(): Promise<any> {
        return new Promise((resolve) => {
            this.platform.ready().then(() => {
                this.db.init().then(() => {
                    this.dbCreateTable().then((res) => {
                        if (!res) {
                            console.log(this.TAG, 'Could not initialize db ' + AppSetting.DB_NAME);
                        }
                        resolve(res);
                    });
                });
            });
        });
    }

    /**
     * Promises that the db is ready for sql queries.
     * @returns {Promise<any>}
     */
    dbReady(): Promise<any> {
        return new Promise((resolve) => {
            if (this.dbIsReady) {
                resolve(this.db);
            } else {
                this.initDb().then((res) => {
                    if (res) {
                        this.dbIsReady = true;
                        resolve(this.db);
                    } else {
                        resolve(null);
                    }
                });
            }
        });
    }

    /**
     *
     * @returns {string}
     */
    private getCreateSQLQuery(): string {
        let query: string = 'CREATE TABLE IF NOT EXISTS ' + this.secure(this.TABLE_NAME) + ' (';
        let rows = [
            this.secure(this.COL_ID) + ' INTEGER PRIMARY KEY AUTOINCREMENT'
        ];
        for (let column of this.TABLE) {
            const name = column[0];
            const schema = column[1];
            rows.push(this.secure(name) + ' ' + schema);
        }
        query += rows.join(', ');

        if (this.UNIQUE_PAIR) {
            query += ', ' + this.UNIQUE_PAIR;
        }

        query += ')';

        return query;
    }

    /**
     * Creates the db table for the extended db class.
     * @returns {Promise<T>}
     */
    protected dbCreateTable(): Promise<any> {
        return new Promise((resolve) => {
            if (this.dbIsBusy) {
                resolve(false);
            } else {
                this.dbIsBusy = true;
                this.platform.ready().then(() => {
                    this.db.query(this.getCreateSQLQuery()).then((res) => {
                        this.dbIsReady = true;
                        this.dbIsBusy = false;
                        resolve(true);
                    }).catch((err) => {
                        this.dbIsBusy = false;
                        resolve(false);
                    });
                });
            }
        });
    }

    /**
     * Returns the entry by a given primary key for this Db Model.
     * @param id primary key
     * @param newObject (optional) this should be true if you call this function in a for-loop
     * @returns {Promise<any>}
     */
    public findById(id: number, newObject?: boolean): Promise<any> {
        return new Promise((resolve) => {
            this.dbReady().then((db) => {
                if (db == null) {
                    resolve(false);
                }
                const query = 'SELECT * FROM ' + this.secure(this.TABLE_NAME) + ' WHERE ' + this.secure(this.COL_ID) + ' = ' + id;
                console.log('query', query);
                db.query(query).then((res) => {
                    console.log('res', res);
                    if (res.rows.length === 1) {
                        if (newObject) {
                            let obj: DbBaseModel = new (<any>this.constructor);
                            obj.platform = this.platform;
                            obj.db = this.db;
                            obj.events = this.events;
                            obj.downloadService = this.downloadService;
                            obj.loadFromAttributes(res.rows.item(0));
                            resolve(obj);
                        } else {
                            resolve(this.loadFromAttributes(res.rows.item(0)));
                        }

                    } else {
                        resolve(false);
                    }
                }).catch((err) => {
                    resolve(false);
                });
            });
        });
    }

    /**
     * Returns all entries for this Db Model.
     * @param where optional condition to search
     * @param orderBy optional ORDER BY value
     * @param limit optional LIMIT value
     * @param join
     * @param selectFrom
     * @param groupBy
     * @returns {Promise<any[]>}
     */

    public searchAllAndGetRowsResult(where?: any, orderBy?: string, limit?: number, join?: string, selectFrom?: string, groupBy?: string): Promise<any> {
        const query = this.searchAllQuery(where, orderBy, limit, join, selectFrom, groupBy);
        const entries: any[] = [];

        return new Promise((resolve) => {
            this.dbReady().then((db) => {
                if (db == null) {
                    resolve(entries);
                } else {
                    console.log('queryqueryqueryqueryquery', query);
                    db.query(query).then((res) => {
                        if (res.rows.length > 0) {
                            resolve(res);
                            return;
                        }
                        resolve(entries);
                    }).catch((err) => {
                        resolve(entries);
                    });
                }

            });
        });
    }

    public searchAll(where?: any, orderBy?: string, limit?: number, join?: string, selectFrom?: string): Promise<any> {
        const query = this.searchAllQuery(where, orderBy, limit, join, selectFrom);
        const entries: any[] = [];

        return new Promise((resolve) => {
            this.dbReady().then((db) => {
                if (db == null) {
                    resolve(entries);
                } else {
                    console.log('queryqueryqueryqueryqueryquery', query);
                    db.query(query).then((res) => {
                        if (res.rows.length > 0) {
                            for (let i = 0; i < res.rows.length; i++) {
                                const obj = new (this.constructor as any);
                                obj.platform = this.platform;
                                obj.db = this.db;
                                obj.events = this.events;
                                obj.downloadService = this.downloadService;
                                obj.loadFromAttributes(res.rows.item(i));
                                entries.push(obj);
                            }
                        }
                        resolve(entries);
                    }).catch((err) => {
                        resolve(entries);
                    });
                }

            });
        });
    }

    public executeQueryAndGetModels(query) {
        const entries: any[] = [];

        return new Promise((resolve) => {
            this.dbReady().then((db) => {
                if (db == null) {
                    resolve(entries);
                } else {
                    db.query(query).then((res) => {
                        if (res.rows.length > 0) {
                            for (let i = 0; i < res.rows.length; i++) {
                                const obj: DbBaseModel = new (<any>this.constructor);
                                obj.platform = this.platform;
                                obj.db = this.db;
                                obj.events = this.events;
                                obj.downloadService = this.downloadService;
                                obj.loadFromAttributes(res.rows.item(i));
                                // console.debug(this.TAG, 'new instance', obj);
                                entries.push(obj);
                            }
                        }
                        resolve(entries);
                    }).catch((err) => {
                        resolve(entries);
                    });
                }
            });
        });
    }

    public searchAllQuery(where?: any, orderBy?: string, limit?: number, join?: string, selectFrom?: string, groupBy?: string): string {
        // create query
        let query = '';
        if (selectFrom) {
            query = selectFrom;
        } else {
            query = 'SELECT * FROM ' + this.secure(this.TABLE_NAME);
        }
        // add where condition
        if (join) {
            query = query + ' ' + join;
        }
        if (where) {
            query = query + ' WHERE ' + this.parseWhere(where);
        }
        // add group by
        if (groupBy) {
            query = query + ' GROUP BY ' + groupBy;
        }
        // add order by
        if (orderBy) {
            query = query + ' ORDER BY ' + orderBy;
        }
        // add limit
        if (limit) {
            query = query + ' LIMIT ' + limit;
        }

        return query;
    }

    /**
     * Returns all entries for this Db Model.
     * @param orderBy optional ORDER BY value
     * @param limit optional LIMIT value
     * @returns {Promise<any[]>}
     */
    public findAll(orderBy?: string, limit?: number): Promise<any[]> {
        // console.debug(this.TAG, 'findAll()');
        return this.searchAll(false, orderBy, limit);
    }

    /**
     * Returns all entries for this Db Model by a given WHERE-Condition.
     * @param condition WHERE-SQL Condition (e.g.: 'id = 1', ['id' => '1'], ['id', '>', '1'])
     * @param orderBy optional ORDER BY value
     * @param limit optional LIMIT value
     * @returns {Promise<any[]>}
     */
    public findAllWhere(condition: any, orderBy?: string, limit?: number): Promise<any[]> {
        return this.searchAll(this.parseWhere(condition), orderBy, limit);
    }

    public findAllByTemporaryWhere(conditionString: string, orderBy?: string, limit?: number): Promise<any> {
        return this.searchAll(conditionString, orderBy, limit);
    }

    public findFirst(condition, orderBy  = 'id ASC'): Promise<any> {
        return this.findAllWhere(condition, orderBy, 1);
    }

    public async getLastRecordLocalId() {
        const lastRecord = await this.find('_id DESC');

        return lastRecord ? lastRecord.id + 1 : 1;
    }

    /**
     * Returns one instance from this db model by an optional ordering
     * and a fix LIMIT which is 1.
     * @param orderBy optional ORDER BY
     * @returns {Promise<T>}
     */
    public find(orderBy?: string): Promise<any> {
        return new Promise((resolve) => {
            this.findAll(orderBy, 1).then((res) => {
                if (res.length === 1) {
                    resolve(res[0]);
                } else {
                    resolve(null);
                }
            });
        });
    }

    /**
     * Returns one instance from this db model by an optional ordering
     * and a fix LIMIT which is 1.
     * @param where WHERE Condition
     * @param orderBy optional ORDER BY
     * @returns {Promise<T>}
     */
    public findWhere(where: any, orderBy?: string): Promise<any> {
        return new Promise((resolve) => {
            this.findAllWhere(this.parseWhere(where), orderBy, 1).then((res) => {
                if (res.length === 1) {
                    resolve(res[0]);
                } else {
                    resolve(false);
                }
            });
        });
    }

    /**
     * Parse a condition into a string for sql.
     * @param condition String, ['key', 'value'], [['operator', 'key', 'value']], [['key', 'value'], ['key2', 'value2']]
     * @returns {string}
     */
    public parseWhere(condition: any): string {
        if (!condition) {
            return '';
        }

        let conditions = [];

        //  One string, just use that
        if (typeof condition === 'string') {
            conditions.push(condition);
        }
        //  Array gets interesting
        else if (Array.isArray(condition)) {
            //  Just a flat array with two values?
            if (condition.length === 2 && !Array.isArray(condition[0]) && !Array.isArray(condition[1])) {
                conditions.push(this.secure(condition[0]) + ' = ' + condition[1]);
            }
            //  Loop all the keys to see if anything needs to be done
            else {
                for (let cond of condition) {
                    //  one of the arrays is a string, ok fine
                    if (typeof cond === 'string') {
                        conditions.push(cond);
                    }
                    //  Or it's a key and value
                    else if (cond.length === 2) {
                        conditions.push(this.secure(cond[0]) + ' = \'' + cond[1] + '\'');
                    }
                    //  Or it's fancy and with an operator in first position
                    else {
                        conditions.push(this.secure(cond[1]) + ' ' + cond[0] + ' ' + cond[2]);
                    }
                }
            }
        } else {
            console.debug(this.TAG, 'findAllWhere condition error', condition);
        }
        return conditions.join(' AND ');
    }

    /**
     * Removes this entry from the DB Model's table.
     * @returns {Promise<any>}
     */
    public removeById(id: number): Promise<any> {
        return new Promise((resolve) => {
            this.dbReady().then((db) => {
                if (db == null) resolve(false);
                db.query('DELETE FROM ' + this.secure(this.TABLE_NAME) + ' WHERE ' + this.secure(this.COL_ID) + ' = ' + id).then(() => {
                    resolve(true);
                }).catch(() => {
                    resolve(false);
                });
            });
        });
    }

    /**
     * Removes all stored entries from this table.
     * @returns {Promise<any>}
     */
    public removeAll(condition?: any[]): Promise<any> {
        return new Promise((resolve) => {
            this.dbReady().then((db) => {
                if (db == null) resolve(false);
                let deleteQuery = 'DELETE FROM ' + this.secure(this.TABLE_NAME);
                if (condition.length) {
                    deleteQuery = deleteQuery + ' WHERE ' + this.parseWhere(condition);
                }

                db.query(deleteQuery).then(() => {
                    resolve(true);
                }).catch(() => {
                    resolve(false);
                });
            });
        });
    }

    /**
     * Stores this instance in sql lite db and creates a new entry
     * or updates this entry if the primary key is not empty.
     * @param forceCreation optional param to force creation
     */
    public save(forceCreation?: boolean): Promise<any> {
        return new Promise((resolve) => {
            // console.log('this[this.COL_ID] && !forceCreation', this[this.COL_ID] && !forceCreation);
            if (this[this.COL_ID] && !forceCreation) {
                this.update().then(() => resolve(true));
            } else {
                this.create().then(() => resolve(true));
            }
        });
    }

    /**
     * Returns an array with all column names.
     * @returns {string[]}
     */
    protected columnNames(): string[] {
        let columns: string[] = [];
        for (let column of this.TABLE) {
            columns.push(column[0]);
        }
        return columns;
    }

    /**
     * Returns all Column Types
     * @returns {number[]}
     */
    protected columnTypes(): number[] {
        let columns: number[] = [];
        for (let column of this.TABLE) {
            columns.push(column[2]);
        }
        return columns;
    }

    /**
     * Returns an array with all column names.
     * @returns {string[]}
     */
    protected attributeNames(): string[] {
        let columns: any[] = [];
        for (let column of this.TABLE) {
            columns.push(column[3] ? column[3] : column[0]);
        }
        return columns;
    }

    /**
     * Returns all names and values. Name and values are connected by an equals sign.
     * This array is may used for a SQL UPDATE statement.
     * @returns {string[]}
     */
    protected getColumnValueNames(): string[] {
        let columnValueNames: string[] = [];
        let columnNames = this.columnNames();
        let columnValues = this.columnValues();
        for (let i = 0; i < columnNames.length; i++) {
            let insert = this.secure(columnNames[i]) + ' = ' + columnValues[i];
            columnValueNames.push(insert);
        }
        return columnValueNames;
    }

    /**
     * Returns the object value for a given string value and its type.
     * @param value
     * @param type
     * @returns {string}
     */
    protected getObjectByType(value: string, type: number): any {
        switch (type) {
            case DbBaseModel.TYPE_NUMBER :
                return this.getNumberValue(value);
            case DbBaseModel.TYPE_STRING :
                return this.getStringValue(value);
            case DbBaseModel.TYPE_BOOLEAN :
                return this.getBooleanValue(parseInt(value));
            case DbBaseModel.TYPE_DATE :
                return this.getDateFromString(value);
            case DbBaseModel.TYPE_OBJECT :
                return this.getObjectValue(value);
            case DbBaseModel.TYPE_DECIMAL :
                return this.getDecimalValue(value);
        }
    }

    /**
     * Returns the string value for a given value and its type.
     * @param value
     * @param type
     * @returns {string}
     */
    protected getValueByType(value: any, type: number): string {
        switch (type) {
            case DbBaseModel.TYPE_NUMBER :
                return this.getValueNumber(value);
            case DbBaseModel.TYPE_STRING :
                return this.getValueString(value);
            case DbBaseModel.TYPE_BOOLEAN :
                return this.getValueBoolean(value);
            case DbBaseModel.TYPE_DATE :
                return this.getValueDate(value);
            case DbBaseModel.TYPE_OBJECT :
                return this.getValueObject(value);
            case DbBaseModel.TYPE_DECIMAL:
                return this.getValueDecimal(value);
        }
    }

    /**
     * Returns an array with all column names.
     * @returns {string[]}
     */
    protected columnValues(): any[] {
        let values: any[] = [];
        for (let column of this.TABLE) {
            let member = column[3] ? column[3] : column[0];
            let value: any = (<any>this)[(member)];
            values.push(this.getValueByType(value, column[2]));
        }
        return values;
    }

    /**
     * Creates this base model instances via INSERT SQL statement
     * in the local SQLite database.
     */
    public create(): Promise<any> {
        return new Promise((resolve) => {
            this.dbReady().then((db) => {
                if (db == null) {
                    resolve(false);
                } else {
                    let query = 'INSERT INTO ' + this.secure(this.TABLE_NAME) + ' (`' + this.columnNames().join('`, `') + '`) ' +
                        'VALUES (' + this.columnValues().join(', ') + ') ';
                    if (this.TAG === 'ProtocolDefaultModel' || this.TAG === 'ProtocolModel') {
                        console.log('insert query', query);
                    }
                    db.query(query).then((res) => {
                        //  Save ID in the model
                        console.log('after execute query');
                        this[this.COL_ID] = res.insertId;
                        this.updateCondition = [this.COL_ID, this[this.COL_ID]];
                        this.events.publish(this.TAG + ':create', this);
                        resolve(res);

                    }).catch((err) => {
                        console.log('errrr', err);
                        resolve(false);
                    });
                }
            });
        });
    }

    /**
     * Updates this base model instance in the local SQLite db.
     * Make sure to modify the `updateCondition` first if necessary.
     */
    protected update(): Promise<any> {
        return new Promise((resolve) => {
            this.dbReady().then((db) => {
                if (db == null) {
                    resolve(false);
                } else {
                    let query = 'UPDATE ' + this.secure(this.TABLE_NAME) + ' ' +
                        'SET ' + this.getColumnValueNames().join(', ') + ' WHERE ' + this.parseWhere(this.updateCondition);
                    if (this.TAG === 'ProtocolDefaultModel' || this.TAG === 'ProtocolModel') {
                        console.log('update query', query);
                    }
                    db.query(query).then((res) => {
                        this.events.publish(this.TAG + ':update', this);
                        resolve(res);
                    }).catch((err) => {
                        console.log('errrr', err);
                        resolve(false);
                    });
                }
            }).catch((err) => {
                console.log('dbReady errrr', err);
                resolve(false);
            });
        });
    }

    protected delete(): Promise<any> {
        return new Promise((resolve) => {
            this.dbReady().then((db) => {
                if (db == null) {
                    resolve(false);
                } else {
                    let query = 'DELETE FROM ' + this.secure(this.TABLE_NAME) + ' ' +
                        'WHERE ' + this.parseWhere(this.updateCondition);
                    db.query(query).then((res) => {
                        this.events.publish(this.TAG + ':delete', this);
                        resolve(res);
                    }).catch((err) => {
                        console.log('delete error', err);
                        resolve(false);
                    });
                }
            });
        });
    }

    /**
     * Quotes a passed text. E.g.: asdasd => 'asdasd'
     * @param text unquoted text
     * @returns {string} quoted text
     */
    protected quote(text: string): string {
        if (text === undefined) return null;
        return '\'' + text + '\'';
    }

    /**
     * Escapes a passed text. E.g.: {'bla':1} => {&quot;bla&quot;:1}
     * @param text unquoted text
     * @param inverse (optional)
     * @returns {string} quoted text
     */
    protected escape(text: string): string {
        if (text === undefined) return null;
        return text.replace(/\'/g, '&#39;');
    }

    /**
     * Escapes a passed text. E.g.: {'bla':1} => {&quot;bla&quot;:1}
     * @param text unquoted text
     * @param inverse (optional)
     * @returns {string} quoted text
     */
    protected unescape(text: string): string {
        if (text === undefined) {
            return null;
        }
        return text.replace(/&#39;/g, '\'');
    }

    /**
     * Secure a table name or row from reserved words
     * @param str
     * @returns {string}
     */
    public secure(str: string): string {
        return '`' + str + '`';
    }

    /**
     * Returns the Date value from a given SQL string.
     * @param date
     */
    protected getDateValue(date: number): Date {
        return date ? new Date(date * 1000) : null;
    }

    /**
     * Returns the Date value from a given date string.
     * @param date
     */
    protected getDateFromString(date: string | number): Date {
        if (Number.isInteger(date as number)) {
            /// if date is integer that it is seconds
            date = +date * 1000;
        }

        return date ? new Date(date) : null;
    }

    /**
     * Returns the number value from a given SQL string.
     * @param num
     */
    protected getNumberValue(num: string): number {
        return Number(num) !== Number.NaN ? Number.parseInt(num) : null;
    }

    /**
     * Returns the decimal number value from a given SQL string.
     * @param num
     */
    protected getDecimalValue(num: string): number {
        return Number(num) !== Number.NaN ? Number.parseFloat(num) : null;
    }

    /**
     * Returns the string value from a given SQL string.
     * @param str
     */
    protected getStringValue(str: string): string {
        return str ? this.unescape(str) : null;
    }

    /**
     * Returns the object value from a given SQL string.
     * @param str
     */
    protected getObjectValue(str: string): Object {
        return str ? JSON.parse(str) : null;
    }

    /**
     * Returns seconds that are calculated by a given time. (e.g. 09:22:00)
     * @param str
     * @returns {any}
     */
    protected getNumberFromTime(str: string): number {
        if (!str) return null;
        // split it at the colons
        let a = str.split(':');
        // minutes are worth 60 seconds. Hours are worth 60 minutes.
        let seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
        return seconds;
    }

    /**
     * Returns the boolean value from a given SQL string.
     * @param bool
     */
    protected getBooleanValue(bool: number): boolean {
        return bool == 1;
    }

    /**
     * Returns the SQL value from a given date.
     * @param date
     * @returns {number} timestamp
     */
    protected getValueDate(date: Date | number): string {
        if (!date) {
            return 'null';
        }
        if ((date instanceof Date)) {
            return '' + Math.floor(date.getTime() / 1000);
        } else if (Number.isInteger(date)) {
            return '' + date;
        }

        return 'null';
    }

    /**
     * Returns the SQL value from a given boolean.
     * @param bool
     * @returns {number}
     */
    protected getValueBoolean(bool: boolean): string {
        return bool ? '1' : '0';
    }

    /**
     * Returns the SQL value from a given string.
     * @param str
     * @returns {string}
     */
    protected getValueString(str: string): string {
        return str ? '\'' + this.escape(str) + '\'' : 'null';
    }

    /**
     * Returns the SQL value from a given number.
     * @param num
     * @returns {string}
     */
    protected getValueNumber(num: number): string {
        return num || num === 0 ? '' + num : 'null';
    }

    /**
     * Returns the SQL value from a given object.
     * @param num
     * @returns {string}
     */
    protected getValueObject(obj: Object): string {
        return obj ? this.quote(JSON.stringify(obj)) : 'null';
    }

    /**
     * Return the SQL value for a given decimal number
     * @param num
     * @returns {string}
     */
    protected getValueDecimal(num: number): string {
        return num ? '' + num : '0.00';
    }

    /**
     * Formats a given Date into 'Y-m-d H:i:s'
     * @param date
     * @returns {string}
     */
    protected formatApiDate(date: Date): string {
        if (!date) {
            return '';
        }

        // date
        let month: string = '' + (date.getMonth() + 1);
        if (month.length == 1) month = '0' + month;
        let day: string = '' + (date.getDate());
        if (day.length == 1) day = '0' + day;
        let year: string = '' + date.getFullYear();

        // time
        let hours: string = '' + (date.getHours());
        if (hours.length == 1) hours = '0' + hours;
        let minutes: string = '' + (date.getMinutes());
        if (minutes.length == 1) minutes = '0' + minutes;
        let seconds: string = '' + (date.getSeconds());
        if (seconds.length == 1) seconds = '0' + seconds;
        return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
    }
    //
    // select(select) {
    //
    // }
    //
    // where(condition) {
    //     let isAnd = '';
    //     if (this.queryWhereArray.length) {
    //         isAnd = 'AND';
    //     }
    //     this.queryWhereArray.push([condition, isAnd]);
    // }
    //
    // orWhere(condition) {
    //     this.queryWhereArray.push([condition, 'OR']);
    // }
}

