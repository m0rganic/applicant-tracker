/*! IndexedDBShim - v0.1.2 - 2013-04-21 */
var idbModules={};(function(e){function t(e,t,n,o){n.target=t,"function"==typeof t[e]&&t[e].apply(t,[n]),"function"==typeof o&&o()}function n(t,n,o){var i=new DOMException.constructor(0,n);throw i.name=t,i.message=n,i.stack=arguments.callee.caller,e.DEBUG&&console.log(t,n,o,i),i}var o=function(){this.length=0,this._items=[]};o.prototype={contains:function(e){return-1!==this._items.indexOf(e)},item:function(e){return this._items[e]},indexOf:function(e){return this._items.indexOf(e)},push:function(e){this._items.push(e),this.length+=1},splice:function(){this._items.splice.apply(this._items,arguments),this.length=this._items.length}},e.util={throwDOMException:n,callback:t,quote:function(e){return"'"+e+"'"},StringList:o}})(idbModules),function(e){var t=function(){return{encode:function(e){return JSON.stringify(e)},decode:function(e){return JSON.parse(e)}}}();e.Sca=t}(idbModules),function(e){var t=["","number","string","boolean","object","undefined"],n=function(){return{encode:function(e){return t.indexOf(typeof e)+"-"+JSON.stringify(e)},decode:function(e){return e===void 0?void 0:JSON.parse(e.substring(2))}}},o={number:n("number"),"boolean":n(),object:n(),string:{encode:function(e){return t.indexOf("string")+"-"+e},decode:function(e){return""+e.substring(2)}},undefined:{encode:function(){return t.indexOf("undefined")+"-undefined"},decode:function(){return void 0}}},i=function(){return{encode:function(e){return o[typeof e].encode(e)},decode:function(e){return o[t[e.substring(0,1)]].decode(e)}}}();e.Key=i}(idbModules),function(e){var t=function(e,t){return{type:e,debug:t,bubbles:!1,cancelable:!1,eventPhase:0,timeStamp:new Date}};e.Event=t}(idbModules),function(e){var t=function(){this.onsuccess=this.onerror=this.result=this.error=this.source=this.transaction=null,this.readyState="pending"},n=function(){this.onblocked=this.onupgradeneeded=null};n.prototype=t,e.IDBRequest=t,e.IDBOpenRequest=n}(idbModules),function(e,t){var n=function(e,t,n,o){this.lower=e,this.upper=t,this.lowerOpen=n,this.upperOpen=o};n.only=function(e){return new n(e,e,!0,!0)},n.lowerBound=function(e,o){return new n(e,t,o,t)},n.upperBound=function(e){return new n(t,e,t,open)},n.bound=function(e,t,o,i){return new n(e,t,o,i)},e.IDBKeyRange=n}(idbModules),function(e,t){function n(n,o,i,r,s,a){this.__range=n,this.source=this.__idbObjectStore=i,this.__req=r,this.key=t,this.direction=o,this.__keyColumnName=s,this.__valueColumnName=a,this.source.transaction.__active||e.util.throwDOMException("TransactionInactiveError - The transaction this IDBObjectStore belongs to is not active."),this.__offset=-1,this.__lastKeyContinued=t,this["continue"]()}n.prototype.__find=function(n,o,i,r){var s=this,a=["SELECT * FROM ",e.util.quote(s.__idbObjectStore.name)],u=[];a.push("WHERE ",s.__keyColumnName," NOT NULL"),s.__range&&(s.__range.lower||s.__range.upper)&&(a.push("AND"),s.__range.lower&&(a.push(s.__keyColumnName+(s.__range.lowerOpen?" >":" >= ")+" ?"),u.push(e.Key.encode(s.__range.lower))),s.__range.lower&&s.__range.upper&&a.push("AND"),s.__range.upper&&(a.push(s.__keyColumnName+(s.__range.upperOpen?" < ":" <= ")+" ?"),u.push(e.Key.encode(s.__range.upper)))),n!==t&&(s.__lastKeyContinued=n,s.__offset=0),s.__lastKeyContinued!==t&&(a.push("AND "+s.__keyColumnName+" >= ?"),u.push(e.Key.encode(s.__lastKeyContinued))),a.push("ORDER BY ",s.__keyColumnName),a.push("LIMIT 1 OFFSET "+s.__offset),e.DEBUG&&console.log(a.join(" "),u),o.executeSql(a.join(" "),u,function(n,o){if(1===o.rows.length){var r=e.Key.decode(o.rows.item(0)[s.__keyColumnName]),a="value"===s.__valueColumnName?e.Sca.decode(o.rows.item(0)[s.__valueColumnName]):e.Key.decode(o.rows.item(0)[s.__valueColumnName]);i(r,a)}else e.DEBUG&&console.log("Reached end of cursors"),i(t,t)},function(t,n){e.DEBUG&&console.log("Could not execute Cursor.continue"),r(n)})},n.prototype["continue"]=function(e){var n=this;this.__idbObjectStore.transaction.__addToTransactionQueue(function(o,i,r,s){n.__offset++,n.__find(e,o,function(e,o){n.key=e,n.value=o,r(n.key!==t?n:t,n.__req)},function(e){s(e)})})},n.prototype.advance=function(n){0>=n&&e.util.throwDOMException("Type Error - Count is invalid - 0 or negative",n);var o=this;this.__idbObjectStore.transaction.__addToTransactionQueue(function(e,i,r,s){o.__offset+=n,o.__find(t,e,function(e,n){o.key=e,o.value=n,r(o.key!==t?o:t,o.__req)},function(e){s(e)})})},n.prototype.update=function(n){var o=this;return this.__idbObjectStore.transaction.__addToTransactionQueue(function(i,r,s,a){o.__find(t,i,function(t){var r="UPDATE "+e.util.quote(o.__idbObjectStore.name)+" SET value = ? WHERE key = ?";e.DEBUG&&console.log(r,n,t),i.executeSql(r,[e.Sca.encode(n),e.Key.encode(t)],function(e,n){1===n.rowsAffected?s(t):a("No rowns with key found"+t)},function(e,t){a(t)})},function(e){a(e)})})},n.prototype["delete"]=function(){var n=this;return this.__idbObjectStore.transaction.__addToTransactionQueue(function(o,i,r,s){n.__find(t,o,function(i){var a="DELETE FROM  "+e.util.quote(n.__idbObjectStore.name)+" WHERE key = ?";e.DEBUG&&console.log(a,i),o.executeSql(a,[e.Key.encode(i)],function(e,n){1===n.rowsAffected?r(t):s("No rowns with key found"+i)},function(e,t){s(t)})},function(e){s(e)})})},e.IDBCursor=n}(idbModules),function(idbModules,undefined){function IDBIndex(e,t){this.indexName=this.name=e,this.__idbObjectStore=this.objectStore=this.source=t;var n=t.__storeProps&&t.__storeProps.indexList;n&&(n=JSON.parse(n)),this.keyPath=n&&n[e]&&n[e].keyPath||e,["multiEntry","unique"].forEach(function(t){this[t]=!!(n&&n[e]&&n[e].optionalParams&&n[e].optionalParams[t])},this)}IDBIndex.prototype.__createIndex=function(indexName,keyPath,optionalParameters){var me=this,transaction=me.__idbObjectStore.transaction;transaction.__addToTransactionQueue(function(tx,args,success,failure){me.__idbObjectStore.__getStoreProps(tx,function(){function error(){idbModules.util.throwDOMException(0,"Could not create new index",arguments)}2!==transaction.mode&&idbModules.util.throwDOMException(0,"Invalid State error, not a version transaction",me.transaction);var idxList=JSON.parse(me.__idbObjectStore.__storeProps.indexList);idxList[indexName]!==undefined&&idbModules.util.throwDOMException(0,"Index already exists on store",idxList);var columnName=indexName;idxList[indexName]={columnName:columnName,keyPath:keyPath,optionalParams:optionalParameters},me.__idbObjectStore.__storeProps.indexList=JSON.stringify(idxList);var sql=["ALTER TABLE",idbModules.util.quote(me.__idbObjectStore.name),"ADD",columnName,"BLOB"].join(" ");idbModules.DEBUG&&console.log(sql),tx.executeSql(sql,[],function(tx,data){tx.executeSql("SELECT * FROM "+idbModules.util.quote(me.__idbObjectStore.name),[],function(tx,data){(function initIndexForRow(i){if(data.rows.length>i)try{var value=idbModules.Sca.decode(data.rows.item(i).value),indexKey=eval("value['"+keyPath+"']");tx.executeSql("UPDATE "+idbModules.util.quote(me.__idbObjectStore.name)+" set "+columnName+" = ? where key = ?",[idbModules.Key.encode(indexKey),data.rows.item(i).key],function(){initIndexForRow(i+1)},error)}catch(e){initIndexForRow(i+1)}else idbModules.DEBUG&&console.log("Updating the indexes in table",me.__idbObjectStore.__storeProps),tx.executeSql("UPDATE __sys__ set indexList = ? where name = ?",[me.__idbObjectStore.__storeProps.indexList,me.__idbObjectStore.name],function(){me.__idbObjectStore.__setReadyState("createIndex",!0),success(me)},error)})(0)},error)},error)},"createObjectStore")})},IDBIndex.prototype.openCursor=function(e,t){var n=new idbModules.IDBRequest;return new idbModules.IDBCursor(e,t,this.source,n,this.indexName,"value"),n},IDBIndex.prototype.openKeyCursor=function(e,t){var n=new idbModules.IDBRequest;return new idbModules.IDBCursor(e,t,this.source,n,this.indexName,"key"),n},IDBIndex.prototype.__fetchIndexData=function(e,t){var n=this;return n.__idbObjectStore.transaction.__addToTransactionQueue(function(o,i,r,s){var a=["SELECT * FROM ",idbModules.util.quote(n.__idbObjectStore.name)," WHERE",n.indexName,"NOT NULL"],u=[];e!==undefined&&(a.push("AND",n.indexName," = ?"),u.push(idbModules.Key.encode(e))),idbModules.DEBUG&&console.log("Trying to fetch data for Index",a.join(" "),u),o.executeSql(a.join(" "),u,function(e,n){var o;o="count"==typeof t?n.rows.length:0===n.rows.length?undefined:"key"===t?idbModules.Key.decode(n.rows.item(0).key):idbModules.Sca.decode(n.rows.item(0).value),r(o)},s)})},IDBIndex.prototype.get=function(e){return this.__fetchIndexData(e,"value")},IDBIndex.prototype.getKey=function(e){return this.__fetchIndexData(e,"key")},IDBIndex.prototype.count=function(e){return this.__fetchIndexData(e,"count")},idbModules.IDBIndex=IDBIndex}(idbModules),function(idbModules){var IDBObjectStore=function(e,t,n){this.name=e,this.transaction=t,this.__ready={},this.__setReadyState("createObjectStore",n===void 0?!0:n),this.indexNames=new idbModules.util.StringList};IDBObjectStore.prototype.__setReadyState=function(e,t){this.__ready[e]=t},IDBObjectStore.prototype.__waitForReady=function(e,t){var n=!0;if(t!==void 0)n=this.__ready[t]===void 0?!0:this.__ready[t];else for(var o in this.__ready)this.__ready[o]||(n=!1);if(n)e();else{idbModules.DEBUG&&console.log("Waiting for to be ready",t);var i=this;window.setTimeout(function(){i.__waitForReady(e,t)},100)}},IDBObjectStore.prototype.__getStoreProps=function(e,t,n){var o=this;this.__waitForReady(function(){o.__storeProps?(idbModules.DEBUG&&console.log("Store properties - cached",o.__storeProps),t(o.__storeProps)):e.executeSql("SELECT * FROM __sys__ where name = ?",[o.name],function(e,n){1!==n.rows.length?t():(o.__storeProps={name:n.rows.item(0).name,indexList:n.rows.item(0).indexList,autoInc:n.rows.item(0).autoInc,keyPath:n.rows.item(0).keyPath},idbModules.DEBUG&&console.log("Store properties",o.__storeProps),t(o.__storeProps))},function(){t()})},n)},IDBObjectStore.prototype.__deriveKey=function(tx,value,key,callback){function getNextAutoIncKey(){tx.executeSql("SELECT * FROM sqlite_sequence where name like ?",[me.name],function(e,t){1!==t.rows.length?callback(0):callback(t.rows.item(0).seq)},function(e,t){idbModules.util.throwDOMException(0,"Data Error - Could not get the auto increment value for key",t)})}var me=this;me.__getStoreProps(tx,function(props){if(props||idbModules.util.throwDOMException(0,"Data Error - Could not locate defination for this table",props),props.keyPath)if(key!==void 0&&idbModules.util.throwDOMException(0,"Data Error - The object store uses in-line keys and the key parameter was provided",props),value)try{var primaryKey=eval("value['"+props.keyPath+"']");primaryKey?callback(primaryKey):"true"===props.autoInc?getNextAutoIncKey():idbModules.util.throwDOMException(0,"Data Error - Could not eval key from keyPath")}catch(e){idbModules.util.throwDOMException(0,"Data Error - Could not eval key from keyPath",e)}else idbModules.util.throwDOMException(0,"Data Error - KeyPath was specified, but value was not");else key!==void 0?callback(key):"false"===props.autoInc?idbModules.util.throwDOMException(0,"Data Error - The object store uses out-of-line keys and has no key generator and the key parameter was not provided. ",props):getNextAutoIncKey()})},IDBObjectStore.prototype.__insertData=function(tx,value,primaryKey,success,error){var paramMap={};primaryKey!==void 0&&(paramMap.key=idbModules.Key.encode(primaryKey));var indexes=JSON.parse(this.__storeProps.indexList);for(var key in indexes)try{paramMap[indexes[key].columnName]=idbModules.Key.encode(eval("value['"+indexes[key].keyPath+"']"))}catch(e){error(e)}var sqlStart=["INSERT INTO ",idbModules.util.quote(this.name),"("],sqlEnd=[" VALUES ("],sqlValues=[];for(key in paramMap)sqlStart.push(key+","),sqlEnd.push("?,"),sqlValues.push(paramMap[key]);sqlStart.push("value )"),sqlEnd.push("?)"),sqlValues.push(idbModules.Sca.encode(value));var sql=sqlStart.join(" ")+sqlEnd.join(" ");idbModules.DEBUG&&console.log("SQL for adding",sql,sqlValues),tx.executeSql(sql,sqlValues,function(){success(primaryKey)},function(e,t){error(t)})},IDBObjectStore.prototype.add=function(e,t){var n=this;return n.transaction.__addToTransactionQueue(function(o,i,r,s){n.__deriveKey(o,e,t,function(t){n.__insertData(o,e,t,r,s)})})},IDBObjectStore.prototype.put=function(e,t){var n=this;return n.transaction.__addToTransactionQueue(function(o,i,r,s){n.__deriveKey(o,e,t,function(t){var i="DELETE FROM "+idbModules.util.quote(n.name)+" where key = ?";o.executeSql(i,[idbModules.Key.encode(t)],function(o,i){idbModules.DEBUG&&console.log("Did the row with the",t,"exist? ",i.rowsAffected),n.__insertData(o,e,t,r,s)},function(e,t){s(t)})})})},IDBObjectStore.prototype.get=function(e){var t=this;return t.transaction.__addToTransactionQueue(function(n,o,i,r){t.__waitForReady(function(){var o=idbModules.Key.encode(e);idbModules.DEBUG&&console.log("Fetching",t.name,o),n.executeSql("SELECT * FROM "+idbModules.util.quote(t.name)+" where key = ?",[o],function(e,t){idbModules.DEBUG&&console.log("Fetched data",t);try{if(0===t.rows.length)return i();i(idbModules.Sca.decode(t.rows.item(0).value))}catch(n){idbModules.DEBUG&&console.log(n),i(void 0)}},function(e,t){r(t)})})})},IDBObjectStore.prototype["delete"]=function(e){var t=this;return t.transaction.__addToTransactionQueue(function(n,o,i,r){t.__waitForReady(function(){var o=idbModules.Key.encode(e);idbModules.DEBUG&&console.log("Fetching",t.name,o),n.executeSql("DELETE FROM "+idbModules.util.quote(t.name)+" where key = ?",[o],function(e,t){idbModules.DEBUG&&console.log("Deleted from database",t.rowsAffected),i()},function(e,t){r(t)})})})},IDBObjectStore.prototype.clear=function(){var e=this;return e.transaction.__addToTransactionQueue(function(t,n,o,i){e.__waitForReady(function(){t.executeSql("DELETE FROM "+idbModules.util.quote(e.name),[],function(e,t){idbModules.DEBUG&&console.log("Cleared all records from database",t.rowsAffected),o()},function(e,t){i(t)})})})},IDBObjectStore.prototype.count=function(e){var t=this;return t.transaction.__addToTransactionQueue(function(n,o,i,r){t.__waitForReady(function(){var o="SELECT * FROM "+idbModules.util.quote(t.name)+(e!==void 0?" WHERE key = ?":""),s=[];e!==void 0&&s.push(idbModules.Key.encode(e)),n.executeSql(o,s,function(e,t){i(t.rows.length)},function(e,t){r(t)})})})},IDBObjectStore.prototype.openCursor=function(e,t){var n=new idbModules.IDBRequest;return new idbModules.IDBCursor(e,t,this,n,"key","value"),n},IDBObjectStore.prototype.index=function(e){var t=new idbModules.IDBIndex(e,this);return t},IDBObjectStore.prototype.createIndex=function(e,t,n){var o=this;n=n||{},o.__setReadyState("createIndex",!1);var i=new idbModules.IDBIndex(e,o);return o.__waitForReady(function(){i.__createIndex(e,t,n)},"createObjectStore"),o.indexNames.push(e),i},IDBObjectStore.prototype.deleteIndex=function(e){var t=new idbModules.IDBIndex(e,this,!1);return t.__deleteIndex(e),t},idbModules.IDBObjectStore=IDBObjectStore}(idbModules),function(e){var t=0,n=1,o=2,i=function(o,i,r){if("number"==typeof i)this.mode=i,2!==i&&e.DEBUG&&console.log("Mode should be a string, but was specified as ",i);else if("string"==typeof i)switch(i){case"readwrite":this.mode=n;break;case"readonly":this.mode=t;break;default:this.mode=t}this.storeNames="string"==typeof o?[o]:o;for(var s=0;this.storeNames.length>s;s++)r.objectStoreNames.contains(this.storeNames[s])||e.util.throwDOMException(0,"The operation failed because the requested database object could not be found. For example, an object store did not exist but was being opened.",this.storeNames[s]);this.__active=!0,this.__running=!1,this.__requests=[],this.__aborted=!1,this.db=r,this.error=null,this.onabort=this.onerror=this.oncomplete=null};i.prototype.__executeRequests=function(){if(this.__running&&this.mode!==o)return e.DEBUG&&console.log("Looks like the request set is already running",this.mode),void 0;this.__running=!0;var t=this;window.setTimeout(function(){2===t.mode||t.__active||e.util.throwDOMException(0,"A request was placed against a transaction which is currently not active, or which is finished",t.__active),t.db.__db.transaction(function(n){function o(t,n){n&&(s.req=n),s.req.readyState="done",s.req.result=t,delete s.req.error;var o=e.Event("success");e.util.callback("onsuccess",s.req,o),a++,r()}function i(){s.req.readyState="done",s.req.error="DOMError";var t=e.Event("error",arguments);e.util.callback("onerror",s.req,t),a++,r()}function r(){return a>=t.__requests.length?(t.__active=!1,t.__requests=[],void 0):(s=t.__requests[a],s.op(n,s.args,o,i),void 0)}t.__tx=n;var s=null,a=0;try{r()}catch(u){e.DEBUG&&console.log("An exception occured in transaction",arguments),"function"==typeof t.onerror&&t.onerror()}},function(){e.DEBUG&&console.log("An error in transaction",arguments),"function"==typeof t.onerror&&t.onerror()},function(){e.DEBUG&&console.log("Transaction completed",arguments),"function"==typeof t.oncomplete&&t.oncomplete()})},1)},i.prototype.__addToTransactionQueue=function(t,n){this.__active||this.mode===o||e.util.throwDOMException(0,"A request was placed against a transaction which is currently not active, or which is finished.",this.__mode);var i=new e.IDBRequest;return i.source=this.db,this.__requests.push({op:t,args:n,req:i}),this.__executeRequests(),i},i.prototype.objectStore=function(t){return new e.IDBObjectStore(t,this)},i.prototype.abort=function(){!this.__active&&e.util.throwDOMException(0,"A request was placed against a transaction which is currently not active, or which is finished",this.__active)},i.prototype.READ_ONLY=0,i.prototype.READ_WRITE=1,i.prototype.VERSION_CHANGE=2,e.IDBTransaction=i}(idbModules),function(e){var t=function(t,n,o,i){this.__db=t,this.version=o,this.__storeProperties=i,this.objectStoreNames=new e.util.StringList;for(var r=0;i.rows.length>r;r++)this.objectStoreNames.push(i.rows.item(r).name);this.name=n,this.onabort=this.onerror=this.onversionchange=null};t.prototype.createObjectStore=function(t,n){var o=this;n=n||{},n.keyPath=n.keyPath||null;var i=new e.IDBObjectStore(t,o.__versionTransaction,!1),r=o.__versionTransaction;return r.__addToTransactionQueue(function(r,s,a){function u(){e.util.throwDOMException(0,"Could not create new object store",arguments)}o.__versionTransaction||e.util.throwDOMException(0,"Invalid State error",o.transaction);var c=["CREATE TABLE",e.util.quote(t),"(key BLOB",n.autoIncrement?", inc INTEGER PRIMARY KEY AUTOINCREMENT":"PRIMARY KEY",", value BLOB)"].join(" ");e.DEBUG&&console.log(c),r.executeSql(c,[],function(e){e.executeSql("INSERT INTO __sys__ VALUES (?,?,?,?)",[t,n.keyPath,n.autoIncrement?!0:!1,"{}"],function(){i.__setReadyState("createObjectStore",!0),a(i)},u)},u)}),o.objectStoreNames.push(t),i},t.prototype.deleteObjectStore=function(t){var n=function(){e.util.throwDOMException(0,"Could not delete ObjectStore",arguments)},o=this;!o.objectStoreNames.contains(t)&&n("Object Store does not exist"),o.objectStoreNames.splice(o.objectStoreNames.indexOf(t),1);var i=o.__versionTransaction;i.__addToTransactionQueue(function(){o.__versionTransaction||e.util.throwDOMException(0,"Invalid State error",o.transaction),o.__db.transaction(function(o){o.executeSql("SELECT * FROM __sys__ where name = ?",[t],function(o,i){i.rows.length>0&&o.executeSql("DROP TABLE "+e.util.quote(t),[],function(){o.executeSql("DELETE FROM __sys__ WHERE name = ?",[t],function(){},n)},n)})})})},t.prototype.close=function(){},t.prototype.transaction=function(t,n){var o=new e.IDBTransaction(t,n||1,this);return o},e.IDBDatabase=t}(idbModules),function(e){var t=4194304;if(window.openDatabase){var n=window.openDatabase("__sysdb__",1,"System Database",t);n.transaction(function(t){t.executeSql("SELECT * FROM dbVersions",[],function(){},function(){n.transaction(function(t){t.executeSql("CREATE TABLE IF NOT EXISTS dbVersions (name VARCHAR(255), version INT);",[],function(){},function(){e.util.throwDOMException("Could not create table __sysdb__ to save DB versions")})})})},function(){e.DEBUG&&console.log("Error in sysdb transaction - when selecting from dbVersions",arguments)});var o={open:function(o,i){function r(){if(!u){var t=e.Event("error",arguments);a.readyState="done",a.error="DOMError",e.util.callback("onerror",a,t),u=!0}}function s(s){var u=window.openDatabase(o,1,o,t);a.readyState="done",i===void 0&&(i=s||1),(0>=i||s>i)&&e.util.throwDOMException(0,"An attempt was made to open a database using a lower version than the existing version.",i),u.transaction(function(t){t.executeSql("CREATE TABLE IF NOT EXISTS __sys__ (name VARCHAR(255), keyPath VARCHAR(255), autoInc BOOLEAN, indexList BLOB)",[],function(){t.executeSql("SELECT * FROM __sys__",[],function(t,c){var d=e.Event("success");a.source=a.result=new e.IDBDatabase(u,o,i,c),i>s?n.transaction(function(t){t.executeSql("UPDATE dbVersions set version = ? where name = ?",[i,o],function(){var t=e.Event("upgradeneeded");t.oldVersion=s,t.newVersion=i,a.transaction=a.result.__versionTransaction=new e.IDBTransaction([],2,a.source),e.util.callback("onupgradeneeded",a,t,function(){var t=e.Event("success");e.util.callback("onsuccess",a,t)})},r)},r):e.util.callback("onsuccess",a,d)},r)},r)},r)}var a=new e.IDBOpenRequest,u=!1;return n.transaction(function(e){e.executeSql("SELECT * FROM dbVersions where name = ?",[o],function(e,t){0===t.rows.length?e.executeSql("INSERT INTO dbVersions VALUES (?,?)",[o,i||1],function(){s(0)},r):s(t.rows.item(0).version)},r)},r),a},deleteDatabase:function(o){function i(t){if(!a){s.readyState="done",s.error="DOMError";var n=e.Event("error");n.message=t,n.debug=arguments,e.util.callback("onerror",s,n),a=!0}}function r(){n.transaction(function(t){t.executeSql("DELETE FROM dbVersions where name = ? ",[o],function(){s.result=void 0;var t=e.Event("success");t.newVersion=null,t.oldVersion=u,e.util.callback("onsuccess",s,t)},i)},i)}var s=new e.IDBOpenRequest,a=!1,u=null;return n.transaction(function(n){n.executeSql("SELECT * FROM dbVersions where name = ?",[o],function(n,a){if(0===a.rows.length){s.result=void 0;var c=e.Event("success");return c.newVersion=null,c.oldVersion=u,e.util.callback("onsuccess",s,c),void 0}u=a.rows.item(0).version;var d=window.openDatabase(o,1,o,t);d.transaction(function(t){t.executeSql("SELECT * FROM __sys__",[],function(t,n){var o=n.rows;(function s(n){n>=o.length?t.executeSql("DROP TABLE __sys__",[],function(){r()},i):t.executeSql("DROP TABLE "+e.util.quote(o.item(n).name),[],function(){s(n+1)},function(){s(n+1)})})(0)},function(){r()})},i)})},i),s},cmp:function(t,n){return e.Key.encode(t)>e.Key.encode(n)?1:t===n?0:-1}};e.shimIndexedDB=o}}(idbModules),function(e,t){e.openDatabase!==void 0&&(e.shimIndexedDB=t.shimIndexedDB,e.shimIndexedDB&&(e.shimIndexedDB.__useShim=function(){e.indexedDB=t.shimIndexedDB,e.IDBDatabase=t.IDBDatabase,e.IDBTransaction=t.IDBTransaction,e.IDBCursor=t.IDBCursor,e.IDBKeyRange=t.IDBKeyRange},e.shimIndexedDB.__debug=function(e){t.DEBUG=e})),e.indexedDB=e.indexedDB||e.webkitIndexedDB||e.mozIndexedDB||e.oIndexedDB||e.msIndexedDB,e.indexedDB===void 0&&e.openDatabase!==void 0?e.shimIndexedDB.__useShim():(e.IDBDatabase=e.IDBDatabase||e.webkitIDBDatabase,e.IDBTransaction=e.IDBTransaction||e.webkitIDBTransaction,e.IDBCursor=e.IDBCursor||e.webkitIDBCursor,e.IDBKeyRange=e.IDBKeyRange||e.webkitIDBKeyRange,e.IDBTransaction||(e.IDBTransaction={}),e.IDBTransaction.READ_ONLY=e.IDBTransaction.READ_ONLY||"readonly",e.IDBTransaction.READ_WRITE=e.IDBTransaction.READ_WRITE||"readwrite")}(window,idbModules);
//@ sourceMappingURL=http://nparashuram.com/IndexedDBShim/dist/IndexedDBShim.min.map;
/** @license MIT - ©2013 Ruben Verborgh */
(function(){function e(){var c=function(u,f,i){if(u!==c){var v=e();return c.c.push({d:v,resolve:u,reject:f}),v.promise}for(var s=f?"resolve":"reject",a=0,p=c.c.length;p>a;a++){var h=c.c[a],l=h.d,j=h[s];typeof j!==t?l[s](i):n(j,i,l)}c=r(o,i,f)},o={then:function(e,r){return c(e,r)}};return c.c=[],{promise:o,resolve:function(e){c.c&&c(c,!0,e)},reject:function(e){c.c&&c(c,!1,e)}}}function r(r,c,o){return function(u,f){var i,v=o?u:f;return typeof v!==t?r:(n(v,c,i=e()),i.promise)}}function n(e,r,n){setTimeout(function(){try{var c=e(r);c&&typeof c.then===t?c.then(n.resolve,n.reject):n.resolve(c)}catch(o){n.reject(o)}})}var t="function";window.promiscuous={resolve:function(e){var n={};return n.then=r(n,e,!0),n},reject:function(e){var n={};return n.then=r(n,e,!1),n},deferred:e}})();;
(function(){var l=new function(){function d(a){return a?0:-1}var f=this.priority=function(a,b){for(var c=a.exprs,e=0,f=0,d=c.length;f<d;f++){var g=c[f];if(!~(g=g.e(g.v,b instanceof Date?b.getTime():b,b)))return-1;e+=g}return e},e=this.parse=function(a,b){a||(a={$eq:a});var c=[];if(a.constructor==Object)for(var d in a){var m=k[d]?d:"$trav",j=a[d],g=j;if(h[m]){if(~d.indexOf(".")){g=d.split(".");d=g.shift();for(var n={},l=n,p=0,s=g.length-1;p<s;p++)l=l[g[p]]={};l[g[p]]=j;g=j=n}if(j instanceof Array){g=
[];for(n=j.length;n--;)g.push(e(j[n]))}else g=e(j,d)}c.push(r(m,d,g))}else c.push(r("$eq",d,a));var q={exprs:c,k:b,test:function(a){return!!~q.priority(a)},priority:function(a){return f(q,a)}};return q},h=this.traversable={$and:!0,$or:!0,$nor:!0,$trav:!0,$not:!0},k=this.testers={$eq:function(a,b){return d(a.test(b))},$ne:function(a,b){return d(!a.test(b))},$lt:function(a,b){return a>b?0:-1},$gt:function(a,b){return a<b?0:-1},$lte:function(a,b){return a>=b?0:-1},$gte:function(a,b){return a<=b?0:-1},
$exists:function(a,b){return a===(null!=b)?0:-1},$in:function(a,b){if(b instanceof Array)for(var c=b.length;c--;){if(~a.indexOf(b[c]))return c}else return d(~a.indexOf(b));return-1},$not:function(a,b){if(!a.test)throw Error("$not test should include an expression, not a value. Use $ne instead.");return d(!a.test(b))},$type:function(a,b,c){return c?c instanceof a||c.constructor==a?0:-1:-1},$nin:function(a,b){return~k.$in(a,b)?-1:0},$mod:function(a,b){return b%a[0]==a[1]?0:-1},$all:function(a,b){for(var c=
a.length;c--;)if(-1==b.indexOf(a[c]))return-1;return 0},$size:function(a,b){return b?a==b.length?0:-1:-1},$or:function(a,b){for(var c=a.length,d=c;c--;)if(~f(a[c],b))return c;return 0==d?0:-1},$nor:function(a,b){for(var c=a.length;c--;)if(~f(a[c],b))return-1;return 0},$and:function(a,b){for(var c=a.length;c--;)if(!~f(a[c],b))return-1;return 0},$trav:function(a,b){if(b instanceof Array){for(var c=b.length;c--;){var d=b[c];if(d[a.k]&&~f(a,d[a.k]))return c}return-1}return f(a,b?b[a.k]:void 0)}},m={$eq:function(a){return a instanceof
RegExp?a:{test:a instanceof Function?a:function(b){return b instanceof Array?~b.indexOf(a):a==b}}},$ne:function(a){return m.$eq(a)}},r=function(a,b,c){c=c instanceof Date?c.getTime():c;return{k:b,v:m[a]?m[a](c):c,e:k[a]}}},h=function(d,f,e){"object"!=typeof f&&(e=f,f=void 0);if(e){if("function"!=typeof e)throw Error("Unknown sift selector "+e);}else e=function(d){return d};var h=e,k=l.parse(d);e=function(d){for(var e=[],a,b,c=0,f=d.length;c<f;c++)a=h(d[c]),~(b=k.priority(a))&&e.push({value:a,priority:b});
e.sort(function(a,b){return a.priority>b.priority?-1:1});d=Array(e.length);for(c=e.length;c--;)d[c]=e[c].value;return d};e.test=k.test;e.score=k.priority;e.query=d;return f?e(f):e};h.use=function(d){d.operators&&h.useOperators(d.operators)};h.useOperators=function(d){for(var f in d)h.useOperator(f,d[f])};h.useOperator=function(d,f){var e={},e="object"==typeof f?f:{test:f},h="$"+d;l.testers[h]=e.test;if(e.traversable||e.traverse)l.traversable[h]=!0};"undefined"!=typeof module&&"undefined"!=typeof module.exports?
module.exports=h:"undefined"!=typeof window&&(window.sift=h)})();
;
/*!
 * Copyright (c) 2013 Kinvey, Inc. All rights reserved.
 *
 * Licensed to Kinvey, Inc. under one or more contributor
 * license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership.  Kinvey, Inc. licenses this file to you under the
 * Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License.  You
 * may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
// Wrap in [IIFE](https://www.wikipedia.org/wiki/Immediately-invoked_function_expression).
(function() {

  // Setup.
  // ------

  // Establish the root object; `window` in the browser, `global` on the
  // server.
  var root = this;

  // Disable debug mode unless declared already.
  if('undefined' === typeof KINVEY_DEBUG) {
    /**
     * Debug mode. This is a global variable, which can be set anywhere,
     * anytime. Not available in the minified version of the library.
     *
     * @global
     * @type {boolean}
     * @default
     */
    KINVEY_DEBUG = false;
  }

  // Lightweight wrapper for `console.log` for easy debugging.
  // http://paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
  var log = function() {
    log.history = log.history || []; // Store logs to an array for reference.
    log.history.push(arguments);
    if(root.console) {
      root.console.log.call(root.console, Array.prototype.slice.call(arguments));
    }
  };

  // Define a function which returns a fresh copy of the library. Copies are
  // fully isolated from each other, making it very easy to communicate with
  // different apps within the same JavaScript-context.
  var kinveyFn = function() {
    /**
     * The library namespace. Contains all library functionality. Invoke as a
     * function (e.g. `Kinvey()`) to obtain a fresh copy of the library.
     *
     * @exports Kinvey
     */
    var Kinvey = function(options) {
      // Debug.
      if(KINVEY_DEBUG) {
        log('Obtaining a fresh copy of the library.', arguments);
      }

      // Create a fresh copy of the library.
      var Kinvey = kinveyFn();

      // Initialize the library if `options` are provided. If not, the
      // application should call `Kinvey.init` on the return value.
      if(null != options) {
        Kinvey.init(options);
      }

      // Return the copy.
      return Kinvey;
    };

    // From here, all library functionality will be appended to `Kinvey`.

    // Constants.
    // ----------

    /**
     * The Kinvey server.
     *
     * @constant
     * @type {string}
     * @default
     */
    Kinvey.API_ENDPOINT = 'https://baas.kinvey.com';

    /**
     * The Kinvey API version used when communicating with
     * [`Kinvey.API_ENDPOINT`](#API_ENDPOINT).
     *
     * @constant
     * @type {string}
     * @default
     */
    Kinvey.API_VERSION = '2';

    /**
     * The current version of the library.
     *
     * @constant
     * @type {string}
     * @default
     */
    Kinvey.SDK_VERSION = '1.0.0dev';

    // Properties.
    // -----------

    /**
     * Kinvey App Key.
     *
     * @private
     * @type {?string}
     */
    Kinvey.appKey = null;

    /**
     * Kinvey App Secret.
     *
     * @private
     * @type {?string}
     */
    Kinvey.appSecret = null;

    /**
     * Kinvey Master Secret.
     *
     * @private
     * @type {?string}
     */
    Kinvey.masterSecret = null;

    // Top-level functionality.
    // ------------------------

    // The namespaces of the Kinvey service.
    var DATA_STORE = 'appdata';
    var FILES = 'blob';
    var RPC = 'rpc';
    var USERS = 'user';
    /*var USER_GROUPS = 'group';*/

    // The library has a concept of an active user which represents the person
    // using the app. There can only be one user per copy of the library.

    // The active user.
    var activeUser = null;

    /**
     * Restores the active user (if any) from disk.
     *
     * @returns {Promise} The active user, or `null` if there is no active user.
     */
    var restoreActiveUser = function() {
      // Retrieve the authtoken from storage.
      var promise = Storage.get('activeUser');

      // If there is an authtoken, restore the active user from disk.
      return promise.then(function(authtoken) {
        if(null != authtoken) {
          // Debug.
          if(KINVEY_DEBUG) {
            log('Restoring the active user.');
          }

          // Set the active user to a near-empty user with only the authtoken set.
          var previous = Kinvey.setActiveUser({
            _kmd: {
              authtoken: authtoken
            }
          });

          // Retrieve the user. The `Kinvey.User.me` method will also update the
          // active user. On failure, reset the active user.
          return Kinvey.User.me().then(null, function(error) {
            // Debug.
            if(KINVEY_DEBUG) {
              log('Failed to restore the active user.', error);
            }

            Kinvey.setActiveUser(previous);
            return Kinvey.Defer.reject(error);
          });
        }
        return Kinvey.getActiveUser();
      });
    };

    /**
     * Returns the active user.
     *
     * @returns {?Object} The active user, or `null` if there is no active user.
     */
    Kinvey.getActiveUser = function() {
      return activeUser;
    };

    /**
     * Sets the active user.
     *
     * @param {?Object} The active user, or `null` to reset.
     * @throws {Kinvey.Error} `user` must contain: `_kmd.authtoken`.
     * @returns {?Object} The previous active user, or `null` if there was no
     *            previous active user.
     */
    Kinvey.setActiveUser = function(user) {
      // Debug.
      if(KINVEY_DEBUG) {
        log('Setting the active user.', arguments);
      }

      // Validate arguments.
      if(null != user && !(null != user._kmd && null != user._kmd.authtoken)) {
        throw new Kinvey.Error('user argument must contain: _kmd.authtoken.');
      }

      var result = Kinvey.getActiveUser(); // Previous.
      activeUser = user;

      // Update disk state in the background.
      if(null != user) { // Save the active user.
        Storage.save('activeUser', user._kmd.authtoken);
      }
      else { // Delete the active user.
        Storage.destroy('activeUser');
      }

      // Return the previous active user.
      return result;
    };

    /**
     * Initializes the library for use with Kinvey services.
     *
     * @param {Options} options Options.
     * @param {string}  options.appKey        App Key.
     * @param {string} [options.appSecret]    App Secret.
     * @param {string} [options.masterSecret] Master Secret. **Never use the
     *          Master Secret in client-side code.**
     * @param {Object} [options.sync]         Synchronization options.
     * @throws {Kinvey.Error} `options` must contain: `appSecret` or
     *                          `masterSecret`.
     * @returns {Promise} The active user.
     */
    Kinvey.init = function(options) {
      // Debug.
      if(KINVEY_DEBUG) {
        log('Initializing the copy of the library.', arguments);
      }

      // Validate arguments.
      options = options || {};
      if(null == options.appKey) {
        throw new Kinvey.Error('options argument must contain: appKey.');
      }
      if(null == options.appSecret && null == options.masterSecret) {
        throw new Kinvey.Error('options argument must contain: appSecret and/or masterSecret.');
      }

      // Save credentials.
      Kinvey.appKey = options.appKey;
      Kinvey.appSecret = null != options.appSecret ? options.appSecret : null;
      Kinvey.masterSecret = null != options.masterSecret ? options.masterSecret : null;

      // Initialize the synchronization namespace and restore the active user.
      var promise = Kinvey.Sync.init(options.sync).then(restoreActiveUser);
      return wrapCallbacks(promise, options);
    };

    /**
     * Pings the Kinvey service.
     *
     * @param {Object} [options] Options.
     * @returns {Promise} The response.
     */
    Kinvey.ping = function(options) {
      // Debug.
      if(KINVEY_DEBUG) {
        log('Pinging the Kinvey service.', arguments);
      }

      // Cast arguments.
      options = options || {};

      // The top-level ping is not compatible with `options.nocache`.
      options.nocache = null == Kinvey.appKey ? false : options.nocache;

      // Prepare the response. If the library copy has not been initialized yet,
      // ping anonymously.
      var promise = Kinvey.Persistence.read({
        namespace: DATA_STORE,
        auth: null != Kinvey.appKey ? Auth.All : Auth.None
      }, options);

      // Debug.
      if(KINVEY_DEBUG) {
        promise.then(function(response) {
          log('Pinged the Kinvey service.', response);
        }, function(error) {
          log('Failed to ping the Kinvey service.', error);
        });
      }

      // Return the response.
      return wrapCallbacks(promise, options);
    };

    // Error-handling.
    // ---------------

    // https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Error

    /**
     * The Kinvey Error class. Thrown whenever the library encounters an error.
     *
     * @class
     * @extends {Error}
     * @param {string} msg Error message.
     */
    Kinvey.Error = function(msg) {
      // Add stack for debugging purposes.
      this.name = 'Kinvey.Error';
      this.message = msg;
      this.stack = (new Error()).stack;

      // Debug.
      if(KINVEY_DEBUG) {
        log('A Kinvey.Error was thrown.', this.message, this.stack);
      }
    };
    Kinvey.Error.prototype = new Error();
    Kinvey.Error.prototype.constructor = Kinvey.Error;

    // ### Error definitions.

    // #### Server.
    Kinvey.Error.ENTITY_NOT_FOUND = 'EntityNotFound';
    Kinvey.Error.COLLECTION_NOT_FOUND = 'CollectionNotFound';
    Kinvey.Error.APP_NOT_FOUND = 'AppNotFound';
    Kinvey.Error.USER_NOT_FOUND = 'UserNotFound';
    Kinvey.Error.BLOB_NOT_FOUND = 'BlobNotFound';
    Kinvey.Error.INVALID_CREDENTIALS = 'InvalidCredentials';
    Kinvey.Error.KINVEY_INTERNAL_ERROR_RETRY = 'KinveyInternalErrorRetry';
    Kinvey.Error.KINVEY_INTERNAL_ERROR_STOP = 'KinveyInternalErrorStop';
    Kinvey.Error.USER_ALREADY_EXISTS = 'UserAlreadyExists';
    Kinvey.Error.USER_UNAVAILABLE = 'UserUnavailable';
    Kinvey.Error.DUPLICATE_END_USERS = 'DuplicateEndUsers';
    Kinvey.Error.INSUFFICIENT_CREDENTIALS = 'InsufficientCredentials';
    Kinvey.Error.WRITES_TO_COLLECTION_DISALLOWED = 'WritesToCollectionDisallowed';
    Kinvey.Error.INDIRECT_COLLECTION_ACCESS_DISALLOWED = 'IndirectCollectionAccessDisallowed';
    Kinvey.Error.APP_PROBLEM = 'AppProblem';
    Kinvey.Error.PARAMETER_VALUE_OUT_OF_RANGE = 'ParameterValueOutOfRange';
    Kinvey.Error.CORS_DISABLED = 'CORSDisabled';
    Kinvey.Error.INVALID_QUERY_SYNTAX = 'InvalidQuerySyntax';
    Kinvey.Error.MISSING_QUERY = 'MissingQuery';
    Kinvey.Error.JSON_PARSE_ERROR = 'JSONParseError';
    Kinvey.Error.MISSING_REQUEST_HEADER = 'MissingRequestHeader';
    Kinvey.Error.INCOMPLETE_REQUEST_BODY = 'IncompleteRequestBody';
    Kinvey.Error.MISSING_REQUEST_PARAMETER = 'MissingRequestParameter';
    Kinvey.Error.INVALID_IDENTIFIER = 'InvalidIdentifier';
    Kinvey.Error.BAD_REQUEST = 'BadRequest';
    Kinvey.Error.FEATURE_UNAVAILABLE = 'FeatureUnavailable';
    Kinvey.Error.API_VERSION_NOT_IMPLEMENTED = 'APIVersionNotImplemented';
    Kinvey.Error.API_VERSION_NOT_AVAILABLE = 'APIVersionNotAvailable';
    Kinvey.Error.INPUT_VALIDATION_FAILED = 'InputValidationFailed';
    Kinvey.Error.BL_RUNTIME_ERROR = 'BLRuntimeError';
    Kinvey.Error.BL_SYNTAX_ERROR = 'BLSyntaxError';
    Kinvey.Error.BL_TIMEOUT_ERROR = 'BLTimeoutError';
    Kinvey.Error.OAUTH_TOKEN_REFRESH_ERROR = 'OAuthTokenRefreshError';
    Kinvey.Error.BL_VIOLATION_ERROR = 'BLViolationError';
    Kinvey.Error.BL_INTERNAL_ERROR = 'BLInternalError';
    Kinvey.Error.THIRD_PARTY_TOS_UNACKED = 'ThirdPartyTOSUnacked';
    Kinvey.Error.STALE_REQUEST = 'StaleRequest';
    Kinvey.Error.DATA_LINK_PARSE_ERROR = 'DataLinkParseError';
    Kinvey.Error.NOT_IMPLEMENTED_ERROR = 'NotImplementedError';

    // #### Client.
    Kinvey.Error.DATABASE_ERROR = 'DatabaseError';
    Kinvey.Error.MISSING_APP_CREDENTIALS = 'MissingAppCredentials';
    Kinvey.Error.MISSING_MASTER_CREDENTIALS = 'MissingMasterCredentials';
    Kinvey.Error.NO_ACTIVE_USER = 'NoActiveUser';
    Kinvey.Error.REQUEST_ABORT_ERROR = 'RequestAbortError';
    Kinvey.Error.REQUEST_ERROR = 'RequestError';
    Kinvey.Error.REQUEST_TIMEOUT_ERROR = 'RequestTimeoutError';
    Kinvey.Error.SOCIAL_ERROR = 'SocialError';
    Kinvey.Error.SYNC_ERROR = 'SyncError';

    // All client-side errors are fully declared below.
    var ClientError = {};

    /**
     * Database error.
     *
     * @constant
     * @type {Object}
     * @default
     */
    ClientError[Kinvey.Error.DATABASE_ERROR] = {
      name: Kinvey.Error.DATABASE_ERROR,
      description: 'The database used for local persistence encountered an error.',
      debug: ''
    };

    /**
     * Missing app credentials.
     *
     * @constant
     * @type {Object}
     * @default
     */
    ClientError[Kinvey.Error.MISSING_APP_CREDENTIALS] = {
      name: Kinvey.Error.MISSING_APP_CREDENTIALS,
      description: 'Missing credentials: `Kinvey.appKey` and/or `Kinvey.appSecret`.',
      debug: 'Did you forget to call `Kinvey.init`?'
    };

    /**
     * Missing master credentials.
     *
     * @constant
     * @type {Object}
     * @default
     */
    ClientError[Kinvey.Error.MISSING_MASTER_CREDENTIALS] = {
      name: Kinvey.Error.MISSING_MASTER_CREDENTIALS,
      description: 'Missing credentials: `Kinvey.appKey` and/or `Kinvey.masterSecret`.',
      debug: 'Did you forget to call `Kinvey.init` with your Master Secret?'
    };

    /**
     * No active user.
     *
     * @constant
     * @type {Object}
     * @default
     */
    ClientError[Kinvey.Error.NO_ACTIVE_USER] = {
      name: Kinvey.Error.NO_ACTIVE_USER,
      description: 'No active user.',
      debug: 'Try creating a user or logging in first.'
    };

    /**
     * Request abort error.
     *
     * @constant
     * @type {Object}
     * @default
     */
    ClientError[Kinvey.Error.REQUEST_ABORT_ERROR] = {
      name: Kinvey.Error.REQUEST_TIMEOUT_ERROR,
      description: 'The request was aborted.',
      debug: ''
    };

    /**
     * Request error.
     *
     * @constant
     * @type {Object}
     * @default
     */
    ClientError[Kinvey.Error.REQUEST_ERROR] = {
      name: Kinvey.Error.REQUEST_ERROR,
      description: 'The request failed.',
      debug: ''
    };

    /**
     * Request timeout error.
     *
     * @constant
     * @type {Object}
     * @default
     */
    ClientError[Kinvey.Error.REQUEST_TIMEOUT_ERROR] = {
      name: Kinvey.Error.REQUEST_TIMEOUT_ERROR,
      description: 'The request timed out.',
      debug: ''
    };

    /**
     * Social error.
     *
     * @constant
     * @type {Object}
     * @default
     */
    ClientError[Kinvey.Error.SOCIAL_ERROR] = {
      name: Kinvey.Error.SOCIAL_ERROR,
      description: 'The social identity cannot be obtained.',
      debug: ''
    };

    /**
     * Sync error.
     *
     * @constant
     * @type {Object}
     * @default
     */
    ClientError[Kinvey.Error.SYNC_ERROR] = {
      name: Kinvey.Error.SYNC_ERROR,
      description: 'The synchronization operation cannot be completed.',
      debug: ''
    };

    // The `description` and `debug` properties can be overridden if desired. The
    // function below makes it easy to customize client errors.

    /**
     * Creates a new client-side error object.
     *
     * @param {string} name Error name (one of `Kinvey.Error.*` constants).
     * @param {Object} [dict] Dictionary.
     * @param {string} [dict.description] Error description.
     * @param {*} [dict.debug] Error debugging information.
     * @returns {Object} Client-side error object.
     */
    var clientError = function(name, dict) {
      // Cast arguments.
      var error = ClientError[name] || {
        name: name
      };

      // Return the error structure.
      dict = dict || {};
      return {
        name: error.name,
        description: dict.description || error.description || '',
        debug: dict.debug || error.debug || ''
      };
    };

    // Utils.
    // ------

    // Wraps asynchronous callbacks so they get called when a promise fulfills or
    // rejects. Note the `success` and `error` properties are extracted when
    // the promise is completed. This allows for intermediate processes to alter
    // the callbacks if necessary.
    var wrapCallbacks = function(promise, options) {
      promise.then(function(value) {
        if(options.success) { // Invoke the success handler.
          options.success(value);
        }
      }, function(reason) {
        if(options.error) { // Invoke the error handler.
          options.error(reason);
        }
      });
      return promise;
    };

    // Create helper functions that are used throughout the library. Inspired by
    // [underscore.js](http://underscorejs.org/).
    var isArray = Array.isArray || function(arg) {
        return '[object Array]' === Object.prototype.toString.call(arg);
      };
    var isFunction = function(fn) {
      if('function' !== typeof / . / ) {
        return 'function' === typeof fn;
      }
      return '[object Function]' === Object.prototype.toString.call(fn);
    };
    var isNumber = function(number) {
      return '[object Number]' === Object.prototype.toString.call(number) && !isNaN(number);
    };
    var isObject = function(obj) {
      return Object(obj) === obj;
    };
    var isRegExp = function(regExp) {
      return '[object RegExp]' === Object.prototype.toString.call(regExp);
    };
    var isString = function(str) {
      return '[object String]' === Object.prototype.toString.call(str);
    };

    var isEmpty = function(obj) {
      if(null == obj) {
        return true;
      }
      if(isArray(obj) || isString(obj)) {
        return 0 === obj.length;
      }
      for(var key in obj) {
        if(obj.hasOwnProperty(key)) {
          return false;
        }
      }
      return true;
    };

    // The library internals rely on adapters to implement certain functionalities.
    // Adapters must implement these functionalities according to an interface. An
    // adapter is applied to the internals through a `use` function.

    // If no adapter is specified, the internals throw an error instead.
    var methodNotImplemented = function(methodName) {
      return function() {
        throw new Kinvey.Error('Method not implemented: ' + methodName);
      };
    };

    // An adapter can be applied by a `use` function attached to an internal
    // namespace. Adapters must implement the `nsInterface`.
    var use = function(nsInterface) {
      return function(adapter) {
        var namespace = this;

        // Debug.
        if(KINVEY_DEBUG) {
          log('Applying an adapter.', namespace, adapter);
        }

        // Validate adapter.
        adapter = adapter || {};
        nsInterface.forEach(function(methodName) {
          if('function' !== typeof adapter[methodName]) {
            throw new Kinvey.Error('Adapter must implement method: ' + methodName);
          }
        });

        // Apply adapter to the internals.
        nsInterface.forEach(function(methodName) {
          namespace[methodName] = function() {
            // Ensure the adapter is used as `this` context.
            return adapter[methodName].apply(adapter, arguments);
          };
        });
      };
    };

    // Define the request Option type for documentation purposes.

    /**
     * @typedef {Object} Options
     * @property {function} [error]     Failure callback.
     * @property {Array}    [exclude]   List of relational fields not to save. Use
     *             in conjunction with `save` or `update`.
     * @property {boolean}  [fallback]  Fallback to the network if the request
     *             failed locally. Use in conjunction with `offline`.
     * @property {boolean}  [offline]   Initiate the request locally.
     * @property {boolean}  [refresh]   Persist the response locally.
     * @property {Object}   [relations] Map of relational fields to collections.
     * @property {boolean}  [skipBL]    Skip Business Logic. Use in conjunction
     *             with Master Secret.
     * @property {function} [success]   Success callback.
     * @property {integer}  [timeout]   The request timeout (ms).
     */

    // Define the `Storage` namespace, used to store application state.
    /**
     * @private
     * @namespace Storage
     */
    var Storage = {
      /**
       * Prepares a deletion from storage.
       *
       * @param {string} key The key.
       * @returns {Promise}
       */
      destroy: function(key) {
        return Storage._destroy(Storage._key(key));
      },

      /**
       * Prepares a retrieval from storage.
       *
       * @param {string} key The key.
       * @returns {Promise}
       */
      get: function(key) {
        return Storage._get(Storage._key(key));
      },

      /**
       * Prepares a save to storage.
       *
       * @param {string} key The key.
       * @param {*} value The value.
       * @returns {Promise}
       */
      save: function(key, value) {
        return Storage._save(Storage._key(key), value);
      },

      /**
       * Deletes a value from storage.
       *
       * @abstract
       * @method
       * @param {string} key The key.
       * @returns {Promise}
       */
      _destroy: methodNotImplemented('Storage.destroy'),

      /**
       * Retrieves a value from storage.
       *
       * @abstract
       * @method
       * @param {string} key The key.
       * @returns {*} The value.
       * @returns {Promise}
       */
      _get: methodNotImplemented('Storage.get'),

      /**
       * Formats the key.
       *
       * @param {string} key The key.
       * @returns {string} The formatted key.
       */
      _key: function(key) {
        // Namespace the key, so it is unique to the Kinvey application.
        return ['Kinvey', Kinvey.appKey, key].join('.');
      },

      /**
       * Saves a value to storage.
       *
       * @abstract
       * @method
       * @param {string} key The key.
       * @param {*} value The value.
       */
      _save: methodNotImplemented('Storage.set'),

      /**
       * Sets the implementation of `Storage` to the specified adapter.
       *
       * @method
       * @param {Object} adapter Object implementing the `Storage` interface.
       */
      use: use(['_destroy', '_get', '_save'])
    };

    // Deferreds.
    // ----------

    // The library relies on deferreds for asynchronous communication. The internal
    // implementation is defined by an adapter. Adapters must implement the
    // [Promises/A+ spec](http://promises-aplus.github.io/promises-spec/).

    /**
     * @namespace
     */
    Kinvey.Defer = {
      /**
       * Turns an array of promises into a promise for an array. If any of the
       * promises gets rejected, the whole array is rejected immediately.
       *
       * @param {Promise[]} promises List of promises.
       * @throws {Kinvey.Error} `promises` must be of type: `Array`.
       * @returns {Promise} The promise.
       */
      all: function(promises) {
        // Validate arguments.
        if(!isArray(promises)) {
          throw new Kinvey.Error('promises argument must be of type: Array.');
        }

        // If there are no promises, resolve immediately.
        var pending = promises.length;
        if(0 === pending) {
          return Kinvey.Defer.resolve([]);
        }

        // Prepare the response.
        var deferred = Kinvey.Defer.deferred();

        // For every promise, add its value to the response if fulfilled. If all
        // promises are fulfilled, fulfill the array promise. If one of the members
        // fail, reject the array promise immediately.
        var response = [];
        promises.forEach(function(promise, index) {
          promise.then(function(value) {
            // Update counter and append response in-place.
            pending -= 1;
            response[index] = value;

            // If all promises are fulfilled, fulfill the array promise.
            if(0 === pending) {
              deferred.resolve(response);
            }
          }, function(error) { // A member got rejected, reject the whole array.
            deferred.reject(error);
          });
        });

        // Return the promise.
        return deferred.promise;
      },

      /**
       * Fulfills a promise immediately.
       *
       * @param value
       * @returns {Promise} The promise.
       */
      resolve: function(value) {
        var deferred = Kinvey.Defer.deferred();
        deferred.resolve(value);
        return deferred.promise;
      },

      /**
       * Rejects a promise immediately.
       *
       * @param reason
       * @returns {Promise} The promise.
       */
      reject: function(reason) {
        var deferred = Kinvey.Defer.deferred();
        deferred.reject(reason);
        return deferred.promise;
      },

      /**
       * Creates a deferred (pending promise).
       *
       * @abstract
       * @method
       * @returns {Object} The deferred.
       */
      deferred: methodNotImplemented('Kinvey.Defer.deferred'),

      /**
       * Sets the implementation of `Kinvey.Defer` to the specified adapter.
       *
       * @method
       * @param {Object} adapter Object implementing the `Kinvey.Defer` interface.
       */
      use: use(['deferred'])
    };

    // Define the Promise type for documentation purposes.

    /**
     * @typedef {Object} Promise
     * @property {function} then Accessor to current state or eventual fulfillment
     *             value or rejection reason.
     */

    // Authentication.
    // ---------------

    // Access to the Kinvey service is authenticated through (implicit) user
    // credentials, Master Secret, or App Secret. A combination of these is often
    // accepted, but not always. Therefore, an extensive set of all possible
    // combinations is gathered here and presented as authentication policies.

    // The promise to handle concurrent requests when the active user is `null`.
    var implicitUserPromise = null;

    // Define authentication policies.
    var Auth = {

      // All policies must return a {Promise}. The value of a resolved promise must
      // be an object containing `scheme` and `username` and `password` or
      // `credentials`. The reason of rejection must be a `Kinvey.Error` constant.

      // https://tools.ietf.org/html/rfc2617

      /**
       * Authenticate through (1) user credentials, (2) Master Secret, or (3) App
       * Secret.
       *
       * @returns {Promise}
       */
      All: function() {
        return Auth.Session().then(null, Auth.Basic);
      },

      /**
       * Authenticate through App Secret.
       *
       * @returns {Promise}
       */
      App: function() {
        // Validate preconditions.
        if(null == Kinvey.appKey || null == Kinvey.appSecret) {
          var error = clientError(Kinvey.Error.MISSING_APP_CREDENTIALS);
          return Kinvey.Defer.reject(error);
        }

        // Prepare the response.
        var promise = Kinvey.Defer.resolve({
          scheme: 'Basic',
          username: Kinvey.appKey,
          password: Kinvey.appSecret
        });

        // Debug
        if(KINVEY_DEBUG) {
          promise.then(function(response) {
            log('Authenticating through App Secret.', response);
          });
        }

        // Return the response.
        return promise;
      },

      /**
       * Authenticate through (1) Master Secret, or (2) App Secret.
       *
       * @returns {Promise}
       */
      Basic: function() {
        return Auth.Master().then(null, Auth.App);
      },

      /**
       * Authenticate through (1) user credentials, or (2) Master Secret. If both
       * fail, an implicit user is created and (1) is attempted.
       *
       * @returns {Promise}
       */
      Default: function() {
        return Auth.UserDefault().then(null, function() {
          // Debug.
          if(KINVEY_DEBUG) {
            log('Creating an implicit user.');
          }

          // A race condition occurs when the active user is `null`, and multiple
          // requests are fired simultaneously. Normally, this would result in the
          // creation of multiple implicit users. The flow below ensures only one
          // implicit user can be created at the time, deferring any concurrent
          // requests until after the implicit user is created and ready for usage.

          // Debug.
          if(KINVEY_DEBUG && null !== implicitUserPromise) {
            log('An implicit user is already being created by another process, waiting.');
          }

          // If there is no implicit user being created right now, obtain the lock.
          if(null === implicitUserPromise) {
            // Create an implicit user.
            implicitUserPromise = Kinvey.User.create().then(function(user) {
              // Debug.
              if(KINVEY_DEBUG) {
                log('Created the implicit user.', user);
              }

              // Release the lock and return the response.
              implicitUserPromise = null;
              return user;
            }, function(error) {
              // Release the lock and forward the error.
              implicitUserPromise = null;
              return Kinvey.Defer.reject(error);
            });
          }

          // Authenticate using the implicit user.
          return implicitUserPromise.then(Auth.Session);
        });
      },

      /**
       * Authenticate through Master Secret.
       *
       * @returns {Promise}
       */
      Master: function() {
        // Validate preconditions.
        if(null == Kinvey.appKey || null == Kinvey.masterSecret) {
          var error = clientError(Kinvey.Error.MISSING_MASTER_CREDENTIALS);
          return Kinvey.Defer.reject(error);
        }

        // Prepare the response.
        var promise = Kinvey.Defer.resolve({
          scheme: 'Basic',
          username: Kinvey.appKey,
          password: Kinvey.masterSecret
        });

        // Debug.
        if(KINVEY_DEBUG) {
          promise.then(function(response) {
            log('Authenticating through Master Secret.', response);
          });
        }

        // Return the response.
        return promise;
      },

      /**
       * Do not authenticate.
       *
       * @returns {Promise}
       */
      None: function() {
        return Kinvey.Defer.resolve(null);
      },

      /**
       * Authenticate through user credentials.
       *
       * @returns {Promise}
       */
      Session: function() {
        // Validate preconditions.
        var user = Kinvey.getActiveUser();
        if(null === user) {
          var error = clientError(Kinvey.Error.NO_ACTIVE_USER);
          return Kinvey.Defer.reject(error);
        }

        // Prepare the response.
        var promise = Kinvey.Defer.resolve({
          scheme: 'Kinvey',
          credentials: user._kmd.authtoken
        });

        // Debug.
        if(KINVEY_DEBUG) {
          promise.then(function(response) {
            log('Authenticating through user credentials.', response);
          });
        }

        // Return the response.
        return promise;
      },

      /**
       * Authenticate through (1) user credentials, or (2) Master Secret.
       *
       * @returns {Promise}
       */
      UserDefault: function() {
        return Auth.Session().then(null, Auth.Master);
      }
    };

    // ACL.
    // ----

    // Wrapper for setting permissions on document-level (i.e. entities and users).

    /**
     * The Kinvey.Acl class.
     *
     * @class
     * @param {Object} [document] The document.
     * @throws {Kinvey.Error} `document` must be of type: `Object`.
     */
    Kinvey.Acl = function(document) {
      // Validate arguments.
      if(null != document && !isObject(document)) {
        throw new Kinvey.Error('document argument must be of type: Object.');
      }

      // Cast arguments.
      document = document || {};
      document._acl = document._acl || {};

      /**
       * The ACL.
       *
       * @private
       * @member {Object}
       */
      this._acl = document._acl;
    };

    // Define the ACL methods.
    Kinvey.Acl.prototype = {
      /**
       * Adds a user to the list of users that are explicitly allowed to read the
       * entity.
       *
       * @param {string} user The user id.
       * @returns {Kinvey.Acl} The ACL.
       */
      addReader: function(user) {
        this._acl.r = this._acl.r || [];
        if(-1 === this._acl.r.indexOf(user)) {
          this._acl.r.push(user);
        }
        return this;
      },

      /**
       * Adds a user group to the list of user groups that are explicitly allowed
       * to read the entity.
       *
       * @param {string} group The group id.
       * @returns {Kinvey.Acl} The ACL.
       */
      addReaderGroup: function(group) {
        this._acl.groups = this._acl.groups || {};
        this._acl.groups.r = this._acl.groups.r || [];
        if(-1 === this._acl.groups.r.indexOf(group)) {
          this._acl.groups.r.push(group);
        }
        return this;
      },

      /**
       * Adds a user group to the list of user groups that are explicitly allowed
       * to modify the entity.
       *
       * @param {string} group The group id.
       * @returns {Kinvey.Acl} The ACL.
       */
      addWriterGroup: function(group) {
        this._acl.groups = this._acl.groups || {};
        this._acl.groups.w = this._acl.groups.w || [];
        if(-1 === this._acl.groups.w.indexOf(group)) {
          this._acl.groups.w.push(group);
        }
        return this;
      },

      /**
       * Adds a user to the list of users that are explicitly allowed to modify the
       * entity.
       *
       * @param {string} user The user id.
       * @returns {Kinvey.Acl} The ACL.
       */
      addWriter: function(user) {
        this._acl.w = this._acl.w || [];
        if(-1 === this._acl.w.indexOf(user)) {
          this._acl.w.push(user);
        }
        return this;
      },

      /**
       * Returns the user id of the user that originally created the entity.
       *
       * @returns {?string} The user id, or `null` if not set.
       */
      getCreator: function() {
        return this._acl.creator || null;
      },

      /**
       * Returns the list of users that are explicitly allowed to read the entity.
       *
       * @returns {Array} The list of users.
       */
      getReaders: function() {
        return this._acl.r || [];
      },

      /**
       * Returns the list of user groups that are explicitly allowed to read the
       * entity.
       *
       * @returns {Array} The list of user groups.
       */
      getReaderGroups: function() {
        return this._acl.groups ? this._acl.groups.r : [];
      },

      /**
       * Returns the list of user groups that are explicitly allowed to read the
       * entity.
       *
       * @returns {Array} The list of user groups.
       */
      getWriterGroups: function() {
        return this._acl.groups ? this._acl.groups.w : [];
      },

      /**
       * Returns the list of users that are explicitly allowed to modify the
       * entity.
       *
       * @returns {Array} The list of users.
       */
      getWriters: function() {
        return this._acl.w || [];
      },

      /**
       * Returns whether the entity is globally readable.
       *
       * @returns {boolean}
       */
      isGloballyReadable: function() {
        return this._acl.gr || false;
      },

      /**
       * Returns whether the entity is globally writable.
       *
       * @returns {boolean}
       */
      isGloballyWritable: function() {
        return this._acl.gw || false;
      },

      /**
       * Removes a user from the list of users that are explicitly allowed to read
       * the entity.
       *
       * @param {string} user The user id.
       * @returns {Kinvey.Acl} The ACL.
       */
      removeReader: function(user) {
        var pos;
        if(this._acl.r && -1 !== (pos = this._acl.r.indexOf(user))) {
          this._acl.r.splice(pos, 1);
        }
        return this;
      },

      /**
       * Removes a user group from the list of user groups that are explicitly
       * allowed to read the entity.
       *
       * @param {string} group The group id.
       * @returns {Kinvey.Acl} The ACL.
       */
      removeReaderGroup: function(group) {
        var pos;
        if(this._acl.groups && this._acl.groups.r && -1 !== (pos = this._acl.groups.r.indexOf(group))) {
          this._acl.groups.r.splice(pos, 1);
        }
        return this;
      },

      /**
       * Removes a user group from the list of user groups that are explicitly
       * allowed to modify the entity.
       *
       * @param {string} group The group id.
       * @returns {Kinvey.Acl} The ACL.
       */
      removeWriterGroup: function(group) {
        var pos;
        if(this._acl.groups && this._acl.groups.w && -1 !== (pos = this._acl.groups.w.indexOf(group))) {
          this._acl.groups.w.splice(pos, 1);
        }
        return this;
      },

      /**
       * Removes a user from the list of users that are explicitly allowed to
       * modify the entity.
       *
       * @param {string} user The user id.
       * @returns {Kinvey.Acl} The ACL.
       */
      removeWriter: function(user) {
        var pos;
        if(this._acl.w && -1 !== (pos = this._acl.w.indexOf(user))) {
          this._acl.w.splice(pos, 1);
        }
        return this;
      },

      /**
       * Specifies whether the entity is globally readable.
       *
       * @param {boolean} [gr=true] Make the entity globally readable.
       * @returns {Kinvey.Acl} The ACL.
       */
      setGloballyReadable: function(gr) {
        this._acl.gr = gr || false;
        return this;
      },

      /**
       * Specifies whether the entity is globally writable.
       *
       * @param {boolean} [gw=true] Make the entity globally writable.
       * @returns {Kinvey.ACL}
       */
      setGloballyWritable: function(gw) {
        this._acl.gw = gw || false;
        return this;
      },

      /**
       * Returns JSON representation of the document ACL.
       *
       * @returns {Object} The document ACL.
       */
      toJSON: function() {
        return this._acl;
      }
    };

    // Aggregation.
    // ------------

    // The `Kinvey.Group` class provides an easy way to build aggregations, which
    // can then be passed to one of the REST API wrappers to group application
    // data. Internally, the class builds a MongoDB aggregation.

    /**
     * The `Kinvey.Group` class.
     *
     * @class
     */
    Kinvey.Group = function() {
      /**
       * The query applied to the result set.
       *
       * @private
       * @member {?Kinvey.Query}
       */
      this._query = null;

      /**
       * The initial structure of the document to be returned.
       *
       * @private
       * @member {Object}
       */
      this._initial = {};

      /**
       * The fields to group by.
       *
       * @private
       * @member {Object}
       */
      this._key = {};

      /**
       * The MapReduce function.
       *
       * @private
       * @member {string}
       */
      this._reduce = function() {}.toString();
    };

    // Define the aggregation methods.
    Kinvey.Group.prototype = {
      /**
       * Sets the field to group by.
       *
       * @param {string} field The field.
       * @returns {Kinvey.Group} The aggregation.
       */
      by: function(field) {
        this._key[field] = true;
        return this;
      },

      /**
       * Sets the initial structure of the document to be returned.
       *
       * @param {Object|string} objectOrKey The initial structure, or key to set.
       * @param {*} value [value] The value of `key`.
       * @throws {Kinvey.Error} `object` must be of type: `Object`.
       * @returns {Kinvey.Group} The aggregation.
       */
      initial: function(objectOrKey, value) {
        // Validate arguments.
        if('undefined' === typeof value && !isObject(objectOrKey)) {
          throw new Kinvey.Error('objectOrKey argument must be of type: Object.');
        }

        // Set or append the initial structure.
        if(isObject(objectOrKey)) {
          this._initial = objectOrKey;
        }
        else {
          this._initial[objectOrKey] = value;
        }
        return this;
      },

      /**
       * Post processes the raw response by applying sort, limit, and skip. These
       * modifiers are provided through the aggregation query.
       *
       * @param {Array} response The raw response.
       * @throws {Kinvey.Error} `response` must be of type: `Array`.
       * @returns {Array} The processed response.
       */
      postProcess: function(response) {
        // If there is a query, process it.
        if(null === this._query) {
          return response;
        }
        return this._query._postProcess(response);
      },

      /**
       * Sets the query to apply to the result set.
       *
       * @param {Kinvey.Query} query The query.
       * @throws {Kinvey.Error} `query` must be of type: `Kinvey.Query`.
       * @returns {Kinvey.Group} The aggregation.
       */
      query: function(query) {
        // Validate arguments.
        if(!(query instanceof Kinvey.Query)) {
          throw new Kinvey.Error('query argument must be of type: Kinvey.Query.');
        }

        this._query = query;
        return this;
      },

      /**
       * Sets the MapReduce function.
       *
       * @param {function|string} fn The function.
       * @throws {Kinvey.Error} `fn` must be of type: `function` or `string`.
       * @returns {Kinvey.Group} The aggregation.
       */
      reduce: function(fn) {
        // Cast arguments.
        if(isFunction(fn)) {
          fn = fn.toString();
        }

        // Validate arguments.
        if(!isString(fn)) {
          throw new Kinvey.Error('fn argument must be of type: function or string.');
        }

        this._reduce = fn;
        return this;
      },

      /**
       * Returns JSON representation of the aggregation.
       *
       * @returns {Object} JSON object-literal.
       */
      toJSON: function() {
        return {
          key: this._key,
          initial: this._initial,
          reduce: this._reduce,
          condition: null !== this._query ? this._query.toJSON().filter : {}
        };
      }
    };

    // Pre-define a number of reduce functions. All return a preseeded
    // `Kinvey.Group`.

    /**
     * Counts all elements in the group.
     *
     * @param {string} [field] The field, or `null` to perform a global count.
     * @returns {Kinvey.Group} The aggregation.
     */
    Kinvey.Group.count = function(field) {
      // Return the aggregation.
      var agg = new Kinvey.Group();

      // If a field was specified, count per field.
      if(null != field) {
        agg.by(field);
      }

      agg.initial({
        result: 0
      });
      agg.reduce(function(doc, out) {
        out.result += 1;
      });
      return agg;
    };

    /**
     * Sums together the numeric values for the specified field.
     *
     * @param {string} field The field.
     * @returns {Kinvey.Group} The aggregation.
     */
    Kinvey.Group.sum = function(field) {
      // Escape arguments.
      field = field.replace('\'', '\\\'');

      // Return the aggregation.
      var agg = new Kinvey.Group();
      agg.initial({
        result: 0
      });
      agg.reduce('function(doc, out) { out.result += doc["' + field + '"]; }');
      return agg;
    };

    /**
     * Finds the minimum of the numeric values for the specified field.
     *
     * @param {string} field The field.
     * @returns {Kinvey.Group} The aggregation.
     */
    Kinvey.Group.min = function(field) {
      // Escape arguments.
      field = field.replace('\'', '\\\'');

      // Return the aggregation.
      var agg = new Kinvey.Group();
      agg.initial({
        result: 'Infinity'
      });
      agg.reduce('function(doc, out) { out.result = Math.min(out.result, doc["' + field + '"]); }');
      return agg;
    };

    /**
     * Finds the maximum of the numeric values for the specified field.
     *
     * @param {string} field The field.
     * @returns {Kinvey.Group} The aggregation.
     */
    Kinvey.Group.max = function(field) {
      // Escape arguments.
      field = field.replace('\'', '\\\'');

      // Return the aggregation.
      var agg = new Kinvey.Group();
      agg.initial({
        result: '-Infinity'
      });
      agg.reduce('function(doc, out) { out.result = Math.max(out.result, doc["' + field + '"]); }');
      return agg;
    };

    /**
     * Finds the average of the numeric values for the specified field.
     *
     * @param {string} field The field.
     * @returns {Kinvey.Group} The aggregation.
     */
    Kinvey.Group.average = function(field) {
      // Escape arguments.
      field = field.replace('\'', '\\\'');

      // Return the aggregation.
      var agg = new Kinvey.Group();
      agg.initial({
        count: 0,
        result: 0
      });
      agg.reduce(
        'function(doc, out) {' +
        '  out.result = (out.result * out.count + doc["' + field + '"]) / (out.count + 1);' +
        '  out.count += 1;' +
        '}');
      return agg;
    };

    // Data Store.
    // -----------

    // REST API wrapper for data storage.

    // The Kinvey DataStore wrapper.
    Kinvey.DataStore = {
      /**
       * Retrieves all documents matching the provided query.
       *
       * @param {string} collection Collection.
       * @param {Kinvey.Query} [query] The query.
       * @param {Options} [options] Options.
       * @throws {Kinvey.Error} `query` must be of type: `Kinvey.Query`.
       * @returns {Promise} A list of documents.
       */
      find: function(collection, query, options) {
        // Debug.
        if(KINVEY_DEBUG) {
          log('Retrieving documents by query.', arguments);
        }

        // Validate arguments.
        if(null != query && !(query instanceof Kinvey.Query)) {
          throw new Kinvey.Error('query argument must be of type: Kinvey.Query.');
        }

        // Cast arguments.
        options = options || {};

        // Prepare the response.
        var promise = Kinvey.Persistence.read({
          namespace: DATA_STORE,
          collection: collection,
          query: query || null,
          auth: Auth.Default,
          local: {
            req: true,
            res: true
          }
        }, options);

        // Debug.
        if(KINVEY_DEBUG) {
          promise.then(function(response) {
            log('Retrieved the documents by query.', response);
          }, function(error) {
            log('Failed to retrieve the documents by query.', error);
          });
        }

        // Return the response.
        return wrapCallbacks(promise, options);
      },

      /**
       * Retrieves a document.
       *
       * @param {string} collection Collection.
       * @param {string} id Document id.
       * @param {Options} [options] Options.
       * @returns {Promise} The document.
       */
      get: function(collection, id, options) {
        // Debug.
        if(KINVEY_DEBUG) {
          log('Retrieving a document.', arguments);
        }

        // Cast arguments.
        options = options || {};

        // Prepare the response.
        var promise = Kinvey.Persistence.read({
          namespace: DATA_STORE,
          collection: collection,
          id: id,
          auth: Auth.Default,
          local: {
            req: true,
            res: true
          }
        }, options);

        // Debug.
        if(KINVEY_DEBUG) {
          promise.then(function(response) {
            log('Retrieved the document.', response);
          }, function(error) {
            log('Failed to retrieve the document.', error);
          });
        }

        // Return the response.
        return wrapCallbacks(promise, options);
      },

      /**
       * Saves a (new) document.
       *
       * @param {string} collection Collection.
       * @param {Object} document Document.
       * @param {Options} [options] Options.
       * @returns {Promise} The new document.
       */
      save: function(collection, document, options) {
        // Debug.
        if(KINVEY_DEBUG) {
          log('Saving a (new) document.', arguments);
        }

        // Cast arguments.
        options = options || {};

        // If the document has an `_id`, perform an update instead.
        if(null != document._id) {
          // Debug.
          if(KINVEY_DEBUG) {
            log('The document has an _id, updating instead.', arguments);
          }

          return Kinvey.DataStore.update(collection, document, options);
        }

        // Prepare the response.
        var promise = Kinvey.Persistence.create({
          namespace: DATA_STORE,
          collection: collection,
          data: document,
          auth: Auth.Default,
          local: {
            req: true,
            res: true
          }
        }, options);

        // Debug.
        if(KINVEY_DEBUG) {
          promise.then(function(response) {
            log('Saved the new document.', response);
          }, function(error) {
            log('Failed to save the new document.', error);
          });
        }

        // Return the response.
        return wrapCallbacks(promise, options);
      },

      /**
       * Updates an existing document. If the document does not exist, however, it
       * is created.
       *
       * @param {string} collection Collection.
       * @param {Object} document Document.
       * @param {Options} [options] Options.
       * @throws {Kinvey.Error} `document` must contain: `_id`.
       * @returns {Promise} The (new) document.
       */
      update: function(collection, document, options) {
        // Debug.
        if(KINVEY_DEBUG) {
          log('Updating a document.', arguments);
        }

        // Validate arguments.
        if(null == document._id) {
          throw new Kinvey.Error('document argument must contain: _id');
        }

        // Cast arguments.
        options = options || {};

        // Prepare the response.
        var promise = Kinvey.Persistence.update({
          namespace: DATA_STORE,
          collection: collection,
          id: document._id,
          data: document,
          auth: Auth.Default,
          local: {
            req: true,
            res: true
          }
        }, options);

        // Debug.
        if(KINVEY_DEBUG) {
          promise.then(function(response) {
            log('Updated the document.', response);
          }, function(error) {
            log('Failed to update the document.', error);
          });
        }

        // Return the response.
        return wrapCallbacks(promise, options);
      },

      /**
       * Deletes all documents matching the provided query.
       *
       * @param {string} collection Collection.
       * @param {Kinvey.Query} [query] The query.
       * @param {Options} [options] Options.
       * @throws {Kinvey.Error} `query` must be of type: `Kinvey.Query`.
       * @returns {Promise} The response.
       */
      clean: function(collection, query, options) {
        // Debug.
        if(KINVEY_DEBUG) {
          log('Deleting documents by query.', arguments);
        }

        // Cast and validate arguments.
        options = options || {};
        query = query || new Kinvey.Query();
        if(!(query instanceof Kinvey.Query)) {
          throw new Kinvey.Error('query argument must be of type: Kinvey.Query.');
        }

        // Prepare the response.
        var promise = Kinvey.Persistence.destroy({
          namespace: DATA_STORE,
          collection: collection,
          query: query,
          auth: Auth.Default,
          local: {
            req: true,
            res: true
          }
        }, options);

        // Debug.
        if(KINVEY_DEBUG) {
          promise.then(function(response) {
            log('Deleted the documents.', response);
          }, function(error) {
            log('Failed to delete the documents.', error);
          });
        }

        // Return the response.
        return wrapCallbacks(promise, options);
      },

      /**
       * Deletes a document.
       *
       * @param {string} collection Collection.
       * @param {string} id Document id.
       * @param {Options} [options] Options.
       * @param {boolean} [options.silent=false] Succeed if the document did not
       *          exist prior to deleting.
       * @returns {Promise} The response.
       */
      destroy: function(collection, id, options) {
        // Debug.
        if(KINVEY_DEBUG) {
          log('Deleting a document.', arguments);
        }

        // Cast arguments.
        options = options || {};

        // Prepare the response.
        var promise = Kinvey.Persistence.destroy({
          namespace: DATA_STORE,
          collection: collection,
          id: id,
          auth: Auth.Default,
          local: {
            req: true,
            res: true
          }
        }, options).then(null, function(error) {
          // If `options.silent`, treat `ENTITY_NOT_FOUND` as success.
          if(options.silent && Kinvey.Error.ENTITY_NOT_FOUND === error.name) {
            // Debug.
            if(KINVEY_DEBUG) {
              log('The document does not exist. Returning success because of the silent flag.');
            }

            return {
              count: 0
            }; // The response.
          }
          return Kinvey.Defer.reject(error);
        });

        // Debug.
        if(KINVEY_DEBUG) {
          promise.then(function(response) {
            log('Deleted the document.', response);
          }, function(error) {
            log('Failed to delete the document.', error);
          });
        }

        // Return the response.
        return wrapCallbacks(promise, options);
      },

      /**
       * Performs a count operation.
       *
       * @param {string} collection The collection.
       * @param {Kinvey.Query} [query] The query.
       * @param {Options} [options] Options.
       * @throws {Kinvey.Error} `query` must be of type: `Kinvey.Query`.
       * @returns {Promise} The response.
       */
      count: function(collection, query, options) {
        // Debug.
        if(KINVEY_DEBUG) {
          log('Counting the number of documents.', arguments);
        }

        // Validate arguments.
        if(null != query && !(query instanceof Kinvey.Query)) {
          throw new Kinvey.Error('query argument must be of type: Kinvey.Query.');
        }

        // Cast arguments.
        options = options || {};

        // Prepare the response.
        var promise = Kinvey.Persistence.read({
          namespace: DATA_STORE,
          collection: collection,
          id: '_count',
          query: query || null,
          auth: Auth.Default,
          local: {
            req: true
          }
        }, options).then(function(response) {
          return response.count;
        });

        // Debug.
        if(KINVEY_DEBUG) {
          promise.then(function(response) {
            log('Counted the number of documents.', response);
          }, function(error) {
            log('Failed to count the number of documents.', error);
          });
        }

        // Return the response.
        return wrapCallbacks(promise, options);
      },

      /**
       * Performs a group operation.
       *
       * @param {string} collection The collection.
       * @param {Kinvey.Aggregation} aggregation The aggregation.
       * @param {Options} [options] Options.
       * @throws {Kinvey.Error} `aggregation` must be of type `Kinvey.Group`.
       * @returns {Promise} The response.
       */
      group: function(collection, aggregation, options) {
        // Debug.
        if(KINVEY_DEBUG) {
          log('Grouping documents', arguments);
        }

        // Validate arguments.
        if(!(aggregation instanceof Kinvey.Group)) {
          throw new Kinvey.Error('aggregation argument must be of type: Kinvey.Group.');
        }

        // Cast arguments.
        options = options || {};

        // Prepare the response.
        var promise = Kinvey.Persistence.create({
          namespace: DATA_STORE,
          collection: collection,
          id: '_group',
          data: aggregation.toJSON(),
          auth: Auth.Default,
          local: {
            req: true
          }
        }, options).then(function(response) {
          // Process the raw response.
          return aggregation.postProcess(response);
        });

        // Debug.
        if(KINVEY_DEBUG) {
          promise.then(function(response) {
            log('Grouped the documents.', response);
          }, function(error) {
            log('Failed to group the documents.', error);
          });
        }

        // Return the response.
        return wrapCallbacks(promise, options);
      }
    };

    // Files.
    // ------

    // REST API wrapper for files.

    /**
     * @namespace
     */
    Kinvey.File = {
      /**
       * Deletes a file.
       *
       * @param {string} name Name.
       * @param {Options} [options] Options.
       * @param {boolean} [options.silent=false] Succeed if the file did not exist
       *          prior to deleting.
       * @returns {Promise} The response.
       */
      destroy: function(name, options) {
        // Debug.
        if(KINVEY_DEBUG) {
          log('Deleting a file.', arguments);
        }

        // Cast arguments.
        options = options || {};

        // Prepare the response.
        var promise = Kinvey.Persistence.read({
          namespace: FILES,
          collection: 'remove-loc',
          id: name,
          auth: Auth.Default
        }, options).then(function(response) {
          return Kinvey.File._destroy(response.URI);
        }, function(error) {
          // If `options.silent`, treat `BLOB_NOT_FOUND` as success.
          if(options.silent && Kinvey.Error.BLOB_NOT_FOUND === error.name) {
            // Debug.
            if(KINVEY_DEBUG) {
              log('The file does not exist. Returning success because of the silent flag.');
            }

            return null;
          }
          return Kinvey.Defer.reject(error);
        });

        // Debug.
        if(KINVEY_DEBUG) {
          promise.then(function(response) {
            log('Deleted the file.', response);
          }, function(error) {
            log('Failed to delete the file.', error);
          });
        }

        // Return the response.
        return wrapCallbacks(promise, options);
      },

      /**
       * Downloads a file.
       *
       * @param {string} name Name.
       * @param {Options} [options] Options.
       * @param {boolean} [options.stream=false] Stream instead of download.
       * @returns {Promise} The download URI if `options.stream`, the response
       *            otherwise.
       */
      download: function(name, options) {
        // Debug.
        if(KINVEY_DEBUG) {
          log('Downloading a file.', arguments);
        }

        // Cast arguments.
        options = options || {};

        // Prepare the response.
        var promise = Kinvey.Persistence.read({
          namespace: FILES,
          collection: 'download-loc',
          id: name,
          auth: Auth.Default
        }, options).then(function(response) {
          // If `options.stream`, return the URI instead of downloading it.
          if(options.stream) {
            // Debug.
            if(KINVEY_DEBUG) {
              log('Returning the download URI because of the stream flag.');
            }

            return response.URI;
          }
          return Kinvey.File._download(response.URI, options);
        });

        // Debug.
        if(KINVEY_DEBUG) {
          promise.then(function(response) {
            log('Downloaded the file.', response);
          }, function(error) {
            log('Failed to download the file.', error);
          });
        }

        // Return the response.
        return wrapCallbacks(promise, options);
      },

      /**
       * Streams a file.
       *
       * @param {string} name Name.
       * @param {Options} [options] Options.
       * @returns {Promise} The download URI.
       */
      stream: function(name, options) {
        // Debug.
        if(KINVEY_DEBUG) {
          log('Streaming a file.', arguments);
        }

        // Forward to `Kinvey.File.download`, with the `stream` flag set.
        options = options || {};
        options.stream = true;
        return Kinvey.File.download(name, options);
      },

      /**
       * Uploads a file.
       *
       * @param {string} name Name.
       * @param {*} file Content.
       * @param {Options} [options] Options.
       * @param {boolean} [options.encode=false] Encode content prior to saving.
       * @returns {Promise} The response.
       */
      upload: function(name, content, options) {
        // Debug.
        if(KINVEY_DEBUG) {
          log('Uploading a file.', arguments);
        }

        // Cast arguments.
        options = options || {};

        // If `options.encode`, encode the content.
        if(options.encode) {
          content = Kinvey.Persistence.Net.base64(content);
        }

        // Prepare the response.
        var promise = Kinvey.Persistence.read({
          namespace: FILES,
          collection: 'upload-loc',
          id: name,
          auth: Auth.Default
        }, options).then(function(response) {
          return Kinvey.File._upload(content, response.URI, options);
        });

        // Debug.
        if(KINVEY_DEBUG) {
          promise.then(function(response) {
            log('Uploaded the file.', response);
          }, function(error) {
            log('Failed to upload the file.', error);
          });
        }

        // Return the response.
        return wrapCallbacks(promise, options);
      },

      /**
       * Deletes a file from Azure using the
       * [Azure Delete Blob](http://msdn.microsoft.com/en-us/library/windowsazure/dd179413.aspx).
       *
       * @abstract
       * @method
       * @param {string} uri Azure URI.
       * @param {Options} [options] Options.
       * @param {Object} [options.headers] Additional request headers.
       * @returns {Promise} The response.
       */
      _destroy: methodNotImplemented('Kinvey.File._destroy'),

      /**
       * Downloads a file from Azure using the
       * [Azure Get Blob](http://msdn.microsoft.com/en-us/library/windowsazure/dd179440.aspx).
       *
       * @abstract
       * @method
       * @param {string} uri Azure URI.
       * @param {Options} [options] Options.
       * @param {Object} [options.headers] Additional request headers.
       * @returns {Promise} The response.
       */
      _download: methodNotImplemented('Kinvey.File._download'),

      /**
       * Uploads a file to Azure using the
       * [Azure Put Blob](http://msdn.microsoft.com/en-us/library/windowsazure/dd179451.aspx).
       *
       * @abstract
       * @method
       * @param {string} content File content.
       * @param {string} uri Azure URI.
       * @param {Options} [options] Options.
       * @param {Object} [options.headers] Additional request headers.
       * @returns {Promise} The response.
       */
      _upload: methodNotImplemented('Kinvey.File._upload'),

      /**
       * Sets the Azure implementation of `Kinvey.File` to the specified adapter.
       *
       * @method
       * @param {Object} adapter Object implementing the `Kinvey.File` interface.
       */
      use: use(['_destroy', '_download', '_upload'])
    };

    // Metadata.
    // ---------

    // Wrapper for accessing the `_acl` and `_kmd` properties of a document
    // (i.e. entity and users).

    /**
     * The Kinvey.Metadata class.
     *
     * @class
     * @param {Object} document The document.
     * @throws {Kinvey.Error} `document` must be of type: `Object`.
     */
    Kinvey.Metadata = function(document) {
      // Validate arguments.
      if(!isObject(document)) {
        throw new Kinvey.Error('document argument must be of type: Object.');
      }

      /**
       * The ACL.
       *
       * @private
       * @member {Kinvey.Acl}
       */
      this._acl = null;

      /**
       * The document.
       *
       * @private
       * @member {Object}
       */
      this._document = document;
    };

    // Define the Metadata methods.
    Kinvey.Metadata.prototype = {
      /**
       * Returns the document ACL.
       *
       * @returns {Kinvey.Acl} The ACL.
       */
      getAcl: function() {
        if(null === this._acl) {
          this._acl = new Kinvey.Acl(this._document);
        }
        return this._acl;
      },

      /**
       * Returns the date when the entity was created.
       *
       * @returns {?Date} Created at date, or `null` if not set.
       */
      getCreatedAt: function() {
        if(null != this._document._kmd && null != this._document._kmd.ect) {
          return new Date(this._document._kmd.ect);
        }
        return null;
      },

      /**
       * Returns the email verification status.
       *
       * @returns {?Object} The email verification status, or `null` if not set.
       */
      getEmailVerification: function() {
        if(null != this._document._kmd && null != this._document._kmd.emailVerification) {
          return this._document._kmd.emailVerification.status;
        }
        return null;
      },

      /**
       * Returns the date when the entity was last modified.
       *
       * @returns {?Date} Last modified date, or `null` if not set.
       */
      getLastModified: function() {
        if(null != this._document._kmd && null != this._document._kmd.lmt) {
          return new Date(this._document._kmd.lmt);
        }
        return null;
      },

      /**
       * Sets the document ACL.
       *
       * @param {Kinvey.Acl} acl The ACL.
       * @throws {Kinvey.Error} `acl` must be of type: `Kinvey.Acl`.
       * @returns {Kinvey.Metadata} The metadata.
       */
      setAcl: function(acl) {
        // Validate arguments.
        if(!(acl instanceof Kinvey.Acl)) {
          throw new Kinvey.Error('acl argument must be of type: Kinvey.Acl.');
        }

        this._acl = null; // Reset.
        this._document._acl = acl.toJSON();
        return this;
      },

      /**
       * Returns JSON representation of the document.
       *
       * @returns {Object} The document.
       */
      toJSON: function() {
        return this._document;
      }
    };

    // Relational Data.
    // ----------------

    // Helper function to get and set a nested property in a document.
    var nested = function(document, dotProperty, value) {
      if(!dotProperty) { // Top-level document.
        document = 'undefined' === typeof value ? document : value;
        return document;
      }

      var obj = document;
      var parts = dotProperty.split('.');

      // Traverse the document until the nested property is located.
      var current;
      while((current = parts.shift()) && null != obj && obj.hasOwnProperty(current)) {
        if(0 === parts.length) { // Return the (new) property value.
          obj[current] = 'undefined' === typeof value ? obj[current] : value;
          return obj[current];
        }
        obj = obj[current]; // Continue traversing.
      }
      return null; // Property not found.
    };

    /**
     * @private
     * @namespace
     */
    var KinveyReference = {
      /**
       * Retrieves relations for a document.
       * NOTE This method should be used in conjunction with local persistence.
       *
       * @param {Array|Object} document The document, or list of documents.
       * @param {Options} options Options.
       * @returns {Promise} The document.
       */
      get: function(document, options) {
        // Debug.
        if(KINVEY_DEBUG) {
          log('Retrieving relations for a document.', document, options);
        }

        // If a list of documents was passed in, retrieve all relations in parallel.
        if(isArray(document)) {
          var promises = document.map(function(member) {
            return KinveyReference.get(member, options);
          });
          return Kinvey.Defer.all(promises);
        }

        // Cast arguments.
        options = options || {};
        options.exclude = options.exclude || [];
        options.relations = options.relations || {};

        // Temporarily reset some options to avoid infinite recursion and invoking
        // the callbacks multiple times.
        var error = options.error;
        var relations = options.relations;
        var success = options.success;
        delete options.error;
        delete options.relations;
        delete options.success;

        // Re-order the relations in order of deepness, so the partial responses
        // propagate properly. Moreover, relations with the same depth can safely
        // be retrieved in parallel.
        var properties = [];
        Object.keys(relations).forEach(function(relation) {
          var index = relation.split('.').length;
          properties[index] = (properties[index] || []).concat(relation);
        });

        // Prepare the response.
        var promise = Kinvey.Defer.resolve(null);

        // Retrieve all (relational) documents. Starts with the top-level relations.
        properties.forEach(function(relationalLevel) {
          promise = promise.then(function() {
            var promises = relationalLevel.map(function(property) {
              var reference = nested(document, property); // The reference.

              // Retrieve the relation(s) in parallel.
              var isArrayRelation = isArray(reference);
              var promises = (isArrayRelation ? reference : [reference]).map(function(member) {
                // Do not retrieve if the property is not a reference, or it is
                // explicitly excluded.
                if(null == member || 'KinveyRef' !== member._type || -1 !== options.exclude.indexOf(property)) {
                  return Kinvey.Defer.resolve(member);
                }

                // Forward to the `Kinvey.User` or `Kinvey.DataStore` namespace.
                var promise;
                if(USERS === member._collection) {
                  promise = Kinvey.User.get(member._id, options);
                }
                else {
                  promise = Kinvey.DataStore.get(member._collection, member._id, options);
                }

                // Return the response.
                return promise.then(null, function() {
                  // If the retrieval failed, retain the reference.
                  return Kinvey.Defer.resolve(member);
                });
              });

              // Return the response.
              return Kinvey.Defer.all(promises).then(function(responses) {
                // Replace the references in the document with the relations.
                nested(document, property, isArrayRelation ? responses : responses[0]);
              });
            });
            return Kinvey.Defer.all(promises);
          });
        });

        // All documents are retrieved.
        return promise.then(function() {
          // Debug.
          if(KINVEY_DEBUG) {
            log('Retrieved relations for the document.', document);
          }

          // Restore the options and return the response.
          options.error = error;
          options.relations = relations;
          options.success = success;
          return document;
        }, function(reason) {
          // Debug.
          if(KINVEY_DEBUG) {
            log('Failed to retrieve relations for the document.', document);
          }

          // Restore the options and return the error.
          options.error = error;
          options.relations = relations;
          options.success = success;
          return Kinvey.Defer.reject(reason);
        });
      },

      /**
       * Saves a document and its relations.
       *
       * @param {string} collection The collection.
       * @param {Array|Object} document The document, or list of documents.
       * @param {Options} options Options.
       * @param {boolean} [options.force] Succeed even if the relations could
       *          not be saved successfully.
       * @returns {Promise} The document.
       */
      save: function(collection, document, options) {
        // Debug.
        if(KINVEY_DEBUG) {
          log('Saving a document with relations.', collection, document, options);
        }

        // If a list of documents was passed in, retrieve all relations in parallel.
        if(isArray(document)) {
          var promises = document.map(function(member) {
            return KinveyReference.save(collection, member, options);
          });
          return Kinvey.Defer.all(promises);
        }

        // Cast arguments.
        options = options || {};
        options.exclude = options.exclude || [];
        options.relations = options.relations || {};

        // Temporarily reset some options to avoid infinite recursion and invoking
        // the callbacks multiple times.
        var error = options.error;
        var relations = options.relations;
        var success = options.success;
        delete options.error;
        delete options.relations;
        delete options.success;

        // Re-order the relations in order of deepness, so the partial responses
        // propagate properly. Moreover, relations with the same depth can safely
        // be saved in parallel.
        var properties = [];
        relations[''] = collection; // Add the top-level document.
        Object.keys(relations).forEach(function(relation) {
          // The top-level document must be the only document with index 0.
          var index = '' === relation ? 0 : relation.split('.').length;
          properties[index] = (properties[index] || []).concat(relation);
        });

        // Prepare the response.
        var documents = {}; // Partial responses.
        var promise = Kinvey.Defer.resolve(null);

        // Save all (relational) documents. Start with the deepest relations.
        properties.reverse().forEach(function(relationalLevel) {
          promise = promise.then(function() {
            var promises = relationalLevel.map(function(property) {
              var collection = relations[property];
              var obj = nested(document, property); // The relational document.

              // Save the relation(s) in parallel.
              var isArrayRelation = isArray(obj);
              var promises = (isArrayRelation ? obj : [obj]).map(function(member) {
                // Do not save if the property is not a document or a reference
                // already, or it is explicitly excluded.
                if(null == member || 'KinveyRef' === member._type || -1 !== options.exclude.indexOf(property)) {
                  return Kinvey.Defer.resolve(member);
                }

                // Forward to the `Kinvey.User` or `Kinvey.DataStore` namespace.
                var promise;
                if(USERS === collection) {
                  // If the referenced user is new, create with `state` set to false.
                  var isNew = null == member._id;
                  options.state = isNew && '' !== property ? options.state || false : options.state;
                  promise = Kinvey.User[isNew ? 'create' : 'update'](member, options);
                }
                else {
                  promise = Kinvey.DataStore.save(collection, member, options);
                }

                // Return the response.
                return promise.then(null, function(error) {
                  // If `options.force`, succeed if the save failed.
                  if(options.force && '' !== property) {
                    return member;
                  }
                  return Kinvey.Defer.reject(error);
                });
              });

              // Return the response.
              return Kinvey.Defer.all(promises).then(function(responses) {
                // Replace the relations in the original document with references.
                var reference = responses.map(function(response) {
                  // Do not convert non-relations to references.
                  if(null == response || null == response._id) {
                    return response;
                  }
                  return {
                    _type: 'KinveyRef',
                    _collection: collection,
                    _id: response._id
                  };
                });

                // Update the original document and add the partial response.
                if(!isArrayRelation) {
                  reference = reference[0];
                  responses = responses[0];
                }
                nested(document, property, reference);
                documents[property] = responses;
              });
            });
            return Kinvey.Defer.all(promises);
          });
        });

        // All documents are saved. Replace the references in the document with the
        // actual relational document, starting with the top-level document.
        return promise.then(function() {
          var response = documents['']; // The top-level document.
          properties.reverse().forEach(function(relationalLevel) {
            relationalLevel.forEach(function(property) {
              nested(response, property, documents[property]);
            });
          });

          // Debug.
          if(KINVEY_DEBUG) {
            log('Saved the document with relations.', response);
          }

          // Restore the options and return the response.
          delete relations['']; // Remove the added top-level document.
          options.error = error;
          options.relations = relations;
          options.success = success;
          return response;
        }, function(reason) {
          // Debug.
          if(KINVEY_DEBUG) {
            log('Failed to save the document with relations.', error);
          }

          // Restore the options and return the error.
          delete relations['']; // Remove the added top-level document.
          options.error = error;
          options.relations = relations;
          options.success = success;
          return Kinvey.Defer.reject(reason);
        });
      }
    };

    // Social Identities.
    // ------------------

    // An app can remove friction by not requiring users to create special
    // usernames and passwords just for the app. Instead, the app can offer options
    // for users to login using social identities. The flow of obtaining the tokens
    // from the social party is defined below.

    // List of supported providers, and their OAuth version.
    var supportedProviders = {
      facebook: 2,
      google: 2,
      linkedIn: 1,
      twitter: 1
    };

    /**
     * @namespace
     */
    Kinvey.Social = {
      /**
       * Links a social identity to the provided (if any) Kinvey user.
       *
       * @param {Object} [user] The associated user.
       * @param {string} provider The provider.
       * @param {Options} [options] Options.
       * @param {boolean} [options.create=true] Create a new user if no user with
       *          the provided social identity exists.
       * @throws {Kinvey.Error} `provider` is not supported.
       * @returns {Promise} The user.
       */
      connect: function(user, provider, options) {
        // Debug.
        if(KINVEY_DEBUG) {
          log('Linking a social identity to a Kinvey user.', arguments);
        }

        // Cast and validate arguments.
        options = options || {};
        options.create = 'undefined' !== typeof options.create ? options.create : true;
        if(!Kinvey.Social.isSupported(provider)) {
          throw new Kinvey.Error('provider argument is not supported.');
        }

        // Remove callbacks from `options` to avoid multiple calls.
        var success = options.success;
        var error = options.error;
        delete options.success;
        delete options.error;

        // Obtain the OAuth tokens.
        var method = 1 === supportedProviders[provider] ? 'oAuth1' : 'oAuth2';
        var promise = Kinvey.Social[method](provider, options).then(function(tokens) {
          // Update the user data.
          user = user || {};

          // If the user is the active user, forward to `Kinvey.User.update`.
          var activeUser = Kinvey.getActiveUser();
          user._socialIdentity = user._socialIdentity || {};
          user._socialIdentity[provider] = tokens;
          if(null !== activeUser && activeUser._id === user._id) {
            options._provider = provider; // Force tokens to be updated.
            return Kinvey.User.update(user, options);
          }

          // Attempt logging in with the tokens.
          user._socialIdentity = {};
          user._socialIdentity[provider] = tokens;
          return Kinvey.User.login(user, null, options).then(null, function(error) {
            // If `options.create`, attempt to signup as a new user if no user with
            // the identity exists.
            if(options.create && Kinvey.Error.USER_NOT_FOUND === error.name) {
              return Kinvey.User.signup(user, options);
            }
            return Kinvey.Defer.reject(error);
          });
        });

        // Restore the options and return the response.
        promise = promise.then(function(response) {
          options.success = success;
          options.error = error;
          return response;
        });
        return wrapCallbacks(promise, options);
      },

      /**
       * Removes a social identity from the provided Kinvey user.
       *
       * @param {Object} [user] The user.
       * @param {string} provider The provider.
       * @param {Options} [options] Options.
       * @throws {Kinvey.Error} `provider` is not supported.
       * @returns {Promise} The user.
       */
      disconnect: function(user, provider, options) {
        // Debug.
        if(KINVEY_DEBUG) {
          log('Unlinking a social identity from a Kinvey user.', arguments);
        }

        // Cast and validate arguments.
        if(!Kinvey.Social.isSupported(provider)) {
          throw new Kinvey.Error('provider argument is not supported.');
        }

        // Update the user data.
        user._socialIdentity = user._socialIdentity || {};
        user._socialIdentity[provider] = null;

        // If the user exists, forward to `Kinvey.User.update`. Otherwise, resolve
        // immediately.
        if(null == user._id) {
          var promise = Kinvey.Defer.resolve(user);
          return wrapCallbacks(promise, options);
        }
        return Kinvey.User.update(user, options);
      },

      /**
       * Links a Facebook identity to the provided (if any) Kinvey user.
       *
       * @param {Object} [user] The associated user.
       * @param {Options} [options] Options.
       * @returns {Promise} The user.
       */
      facebook: function(user, options) {
        // Debug.
        if(KINVEY_DEBUG) {
          log('Linking a Facebook identity to a Kinvey user.', arguments);
        }

        // Forward to `Kinvey.Social.connect`.
        return Kinvey.Social.connect(user, 'facebook', options);
      },

      /**
       * Links a Google+ identity to the provided (if any) Kinvey user.
       *
       * @param {Object} [user] The associated user.
       * @param {Options} [options] Options.
       * @returns {Promise} The user.
       */
      google: function(user, options) {
        // Debug.
        if(KINVEY_DEBUG) {
          log('Linking a Google+ identity to a Kinvey user.', arguments);
        }

        // Forward to `Kinvey.Social.connect`.
        return Kinvey.Social.connect(user, 'google', options);
      },

      /**
       * Returns whether a social provider is supported.
       *
       * @param {string} provider The provider.
       * @returns {boolean}
       */
      isSupported: function(provider) {
        return supportedProviders.hasOwnProperty(provider);
      },

      /**
       * Links a LinkedIn identity to the provided (if any) Kinvey user.
       *
       * @param {Object} [user] The associated user.
       * @param {Options} [options] Options.
       * @returns {Promise} The user.
       */
      linkedIn: function(user, options) {
        // Debug.
        if(KINVEY_DEBUG) {
          log('Linking a LinkedIn identity to a Kinvey user.', arguments);
        }

        // Forward to `Kinvey.Social.connect`.
        return Kinvey.Social.connect(user, 'linkedIn', options);
      },

      /**
       * Links a Twitter identity to the provided (if any) Kinvey user.
       *
       * @param {Object} [user] The associated user.
       * @param {Options} [options] Options.
       * @returns {Promise} The user.
       */
      twitter: function(user, options) {
        // Debug.
        if(KINVEY_DEBUG) {
          log('Linking a Twitter identity to a Kinvey user.', arguments);
        }

        // Forward to `Kinvey.Social.connect`.
        return Kinvey.Social.connect(user, 'twitter', options);
      },

      /**
       * Performs the OAuth1.0a flow to obtain the tokens for the specified
       * provider.
       *
       * @abstract
       * @method
       * @param {string} provider The provider.
       * @param {Options} [options] Options.
       * @returns {Promise} The OAuth 1.0a tokens.
       */
      oAuth1: methodNotImplemented('Kinvey.Social.oAuth1'),

      /**
       * Performs the OAuth2.0 flow to obtain the tokens for the specified
       * provider.
       *
       * @abstract
       * @method
       * @param {string} provider The provider.
       * @param {Options} [options] Options.
       * @returns {Promise} The OAuth2.0 tokens.
       */
      oAuth2: methodNotImplemented('Kinvey.Social.oAuth2'),

      /**
       * Sets the implementation of `Kinvey.Social` to the specified adapter.
       *
       * @method
       * @param {Object} adapter Object implementing the `Kinvey.Social`
       *          interface.
       */
      use: use(['oAuth1', 'oAuth2'])
    };

    // Users.
    // ------

    // REST API wrapper for user management with the Kinvey services. Note the
    // [active user](http://devcenter.kinvey.com/guides/users#ActiveUser) is not
    // exclusively managed in this namespace: `Kinvey.getActiveUser` and
    // `Kinvey.Auth.Session` operate on the active user as well.

    /**
     * @namespace
     */
    Kinvey.User = {
      /**
       * Signs up a new user.
       *
       * @param {Object} [data] User data.
       * @param {Options} [options] Options.
       * @returns {Promise} The new user.
       */
      signup: function(data, options) {
        // Debug.
        if(KINVEY_DEBUG) {
          log('Signing up a new user.', arguments);
        }

        // Forward to `Kinvey.User.create`. Signup, however, always marks the
        // created user as the active user.
        options = options || {};
        options.state = true; // Overwrite.
        return Kinvey.User.create(data, options);
      },

      /**
       * Logs in an existing user.
       * NOTE If `options._provider`, this method should trigger a BL script.
       *
       * @param {Object|string} usernameOrData Username, or user data.
       * @param {string} [password] Password.
       * @param {Options} [options] Options.
       * @param {boolean} [options._provider] Login via Business Logic. May only
       *          be used internally to provide social login for browsers.
       * @returns {Promise} The active user.
       */
      login: function(usernameOrData, password, options) {
        // Debug.
        if(KINVEY_DEBUG) {
          log('Logging in an existing user.', arguments);
        }

        // Cast arguments.
        options = options || {};
        if(!isObject(usernameOrData)) {
          usernameOrData = {
            username: usernameOrData,
            password: password
          };
        }

        // Logout the current active user first, then proceed with logging in
        // with the specified credentials.
        return Kinvey.User.logout({
          force: true,
          silent: true
        }).then(function() {
          // Prepare the response.
          var promise = Kinvey.Persistence.create({
            namespace: USERS,
            collection: options._provider ? null : 'login',
            data: usernameOrData,
            flags: options._provider ? {
              provider: options._provider
            } : {},
            auth: Auth.App,
            local: {
              res: true
            }
          }, options).then(function(user) {
            // Set and return the active user.
            Kinvey.setActiveUser(user);
            return user;
          });

          // Debug.
          if(KINVEY_DEBUG) {
            promise.then(function(response) {
              log('Logged in the user.', response);
            }, function(error) {
              log('Failed to login the user.', error);
            });
          }

          // Return the response.
          return wrapCallbacks(promise, options);
        });
      },

      /**
       * Logs out the active user.
       *
       * @param {Options} [options] Options.
       * @param {boolean] [options.force=false] Reset the active user even if an
       *          `InvalidCredentials` error is returned.
       * @param {boolean} [options.silent=false] Succeed when there is no active
       *          user.
       * @returns {Promise} The previous active user.
       */
      logout: function(options) {
        // Cast arguments.
        options = options || {};

        // If `options.silent`, resolve immediately if there is no active user.
        var promise;
        if(options.silent && null === Kinvey.getActiveUser()) {
          promise = Kinvey.Defer.resolve(null);
        }
        else { // Otherwise, attempt to logout the active user.
          // Debug.
          if(KINVEY_DEBUG) {
            log('Logging out the active user.', arguments);
          }

          // Prepare the response.
          promise = Kinvey.Persistence.create({
            namespace: USERS,
            collection: '_logout',
            auth: Auth.Session
          }, options).then(null, function(error) {
            // If `options.force`, clear the active user on `INVALID_CREDENTIALS`.
            if(options.force && Kinvey.Error.INVALID_CREDENTIALS === error.name) {
              // Debug.
              if(KINVEY_DEBUG) {
                log('The user credentials are invalid. Returning success because of the force flag.');
              }
              return null;
            }
            return Kinvey.Defer.reject(error);
          }).then(function() {
            // Reset the active user, and return the previous active user. Make
            // sure to delete the authtoken.
            var previous = Kinvey.setActiveUser(null);
            if(null !== previous) {
              delete previous._kmd.authtoken;
            }
            return previous;
          });

          // Debug.
          if(KINVEY_DEBUG) {
            promise.then(function(response) {
              log('Logged out the active user.', response);
            }, function(error) {
              log('Failed to logout the active user.', error);
            });
          }
        }

        // Return the response.
        return wrapCallbacks(promise, options);
      },

      /**
       * Retrieves information on the active user.
       *
       * @param {Options} [options] Options.
       * @returns {Promise} The active user.
       */
      me: function(options) {
        // Debug.
        if(KINVEY_DEBUG) {
          log('Retrieving information on the active user.', arguments);
        }

        // Cast arguments.
        options = options || {};

        // Prepare the response.
        var promise = Kinvey.Persistence.read({
          namespace: USERS,
          collection: '_me',
          auth: Auth.Session,
          local: {
            res: true
          }
        }, options).then(function(user) {
          // The response is a fresh copy of the active user. However, the response
          // does not contain `_kmd.authtoken`. Therefore, extract it from the
          // stale copy.
          user._kmd = user._kmd || {};
          user._kmd.authtoken = Kinvey.getActiveUser()._kmd.authtoken;

          // Set and return the active user.
          Kinvey.setActiveUser(user);
          return user;
        });

        // Debug.
        if(KINVEY_DEBUG) {
          promise.then(function(response) {
            log('Retrieved information on the active user.', response);
          }, function(error) {
            log('Failed to retrieve information on the active user.', error);
          });
        }

        // Return the response.
        return wrapCallbacks(promise, options);
      },

      /**
       * Requests e-mail verification for a user.
       *
       * @param {string} username Username.
       * @param {Options} [options] Options.
       * @returns {Promise} The response.
       */
      verifyEmail: function(username, options) {
        // Debug.
        if(KINVEY_DEBUG) {
          log('Requesting e-mail verification.', arguments);
        }

        // Cast arguments.
        options = options || {};

        // Prepare the response.
        var promise = Kinvey.Persistence.create({
          namespace: RPC,
          collection: username,
          id: 'user-email-verification-initiate',
          auth: Auth.App
        }, options);

        // Debug.
        if(KINVEY_DEBUG) {
          promise.then(function(response) {
            log('Requested e-mail verification.', response);
          }, function(error) {
            log('Failed to request e-mail verification.', error);
          });
        }

        // Return the response.
        return wrapCallbacks(promise, options);
      },

      /**
       * Requests a username reminder for a user.
       *
       * @param {string} email E-mail.
       * @param {Options} [options] Options.
       * @returns {Promise} The response.
       */
      forgotUsername: function(email, options) {
        // Debug.
        if(KINVEY_DEBUG) {
          log('Requesting a username reminder.', arguments);
        }

        // Cast arguments.
        options = options || {};

        // Prepare the response.
        var promise = Kinvey.Persistence.create({
          namespace: RPC,
          id: 'user-forgot-username',
          data: {
            email: email
          },
          auth: Auth.App
        }, options);

        // Debug.
        if(KINVEY_DEBUG) {
          promise.then(function(response) {
            log('Requested a username reminder.', response);
          }, function(error) {
            log('Failed to request a username reminder.', error);
          });
        }

        // Return the response.
        return wrapCallbacks(promise, options);
      },

      /**
       * Requests a password reset for a user.
       *
       * @param {string} username Username.
       * @param {Options} [options] Options.
       * @returns {Promise} The response.
       */
      resetPassword: function(username, options) {
        // Debug.
        if(KINVEY_DEBUG) {
          log('Requesting a password reset.', arguments);
        }

        // Cast arguments.
        options = options || {};

        // Prepare the response.
        var promise = Kinvey.Persistence.create({
          namespace: RPC,
          collection: username,
          id: 'user-password-reset-initiate',
          auth: Auth.App
        }, options);

        // Debug.
        if(KINVEY_DEBUG) {
          promise.then(function(response) {
            log('Requested a password reset.', response);
          }, function(error) {
            log('Failed to request a password reset.', error);
          });
        }

        // Return the response.
        return wrapCallbacks(promise, options);
      },

      /**
       * Checks whether a username exists.
       *
       * @param {string} username Username to check.
       * @param {Options} [options] Options.
       * @returns {Promise} `true` if username exists, `false` otherwise.
       */
      exists: function(username, options) {
        // Debug.
        if(KINVEY_DEBUG) {
          log('Checking whether a username exists.', arguments);
        }

        // Cast arguments.
        options = options || {};

        // Prepare the response.
        var promise = Kinvey.Persistence.create({
          namespace: RPC,
          id: 'check-username-exists',
          data: {
            username: username
          },
          auth: Auth.App
        }, options).then(function(response) {
          return response.usernameExists;
        });

        // Debug.
        if(KINVEY_DEBUG) {
          promise.then(function(response) {
            log('Checked whether the username exists.', response);
          }, function(error) {
            log('Failed to check whether the username exists.', error);
          });
        }

        // Return the response.
        return wrapCallbacks(promise, options);
      },

      /**
       * Creates a new user.
       *
       * @param {Object} [data] User data.
       * @param {Options} [options] Options.
       * @param {boolean} [options.state=true] Save created user as the
       *          active user.
       * @returns {Promise} The new user.
       */
      create: function(data, options) {
        // Debug.
        if(KINVEY_DEBUG) {
          log('Creating a new user.', arguments);
        }

        // Cast arguments.
        options = options || {};

        // If `options.state`, logout the active user.
        var promise;
        if(false !== options.state) {
          promise = Kinvey.User.logout({
            force: true,
            silent: true
          });
        }
        else {
          promise = Kinvey.Defer.resolve(null);
        }

        // Create the new user.
        return promise.then(function() {
          // Prepare the response.
          var promise = Kinvey.Persistence.create({
            namespace: USERS,
            data: data || {},
            auth: Auth.App
          }, options).then(function(user) {
            // If `options.state`, set the active user.
            if(false !== options.state) {
              Kinvey.setActiveUser(user);
            }
            return user;
          });

          // Debug.
          if(KINVEY_DEBUG) {
            promise.then(function(response) {
              log('Created the new user.', response);
            }, function(error) {
              log('Failed to create the new user.', error);
            });
          }

          // Return the response.
          return wrapCallbacks(promise, options);
        });
      },

      /**
       * Updates a user. To create a user, use `Kinvey.User.create` or
       * `Kinvey.User.signup`.
       *
       * @param {Object} data User data.
       * @param {Options} [options] Options.
       * @param {string} [options._provider] Do not strip the `access_token` for
       *          this provider. Should only be used internally.
       * @throws {Kinvey.Error} `data` must contain: `_id`.
       * @returns {Promise} The user.
       */
      update: function(data, options) {
        // Debug.
        if(KINVEY_DEBUG) {
          log('Updating a user.', arguments);
        }

        // Validate arguments.
        if(null == data._id) {
          throw new Kinvey.Error('data argument must contain: _id');
        }

        // Cast arguments.
        options = options || {};

        // Delete the social identities’ access tokens, unless the identity is
        // `options._provider`. The tokens will be re-added after updating.
        var tokens = [];
        if(null != data._socialIdentity) {
          for(var identity in data._socialIdentity) {
            if(data._socialIdentity.hasOwnProperty(identity)) {
              if(null != data._socialIdentity[identity] && identity !== options._provider) {
                tokens.push({
                  provider: identity,
                  access_token: data._socialIdentity[identity].access_token,
                  access_token_secret: data._socialIdentity[identity].access_token_secret
                });
                delete data._socialIdentity[identity].access_token;
                delete data._socialIdentity[identity].access_token_secret;
              }
            }
          }
        }

        // Prepare the response.
        var promise = Kinvey.Persistence.update({
          namespace: USERS,
          id: data._id,
          data: data,
          auth: Auth.UserDefault,
          local: {
            res: true
          }
        }, options).then(function(user) {
          // Re-add the social identities’ access tokens.
          tokens.forEach(function(identity) {
            var provider = identity.provider;
            if(null != user._socialIdentity && null != user._socialIdentity[provider]) {
              ['access_token', 'access_token_secret'].forEach(function(field) {
                if(null != identity[field]) {
                  user._socialIdentity[provider][field] = identity[field];
                }
              });
            }
          });

          // If we just updated the active user, refresh it.
          var activeUser = Kinvey.getActiveUser();
          if(null !== activeUser && activeUser._id === user._id) {
            // Debug.
            if(KINVEY_DEBUG) {
              log('Updating the active user because the updated user was the active user.');
            }

            Kinvey.setActiveUser(user);
          }
          return user;
        });

        // Debug.
        if(KINVEY_DEBUG) {
          promise.then(function(response) {
            log('Updated the user.', response);
          }, function(error) {
            log('Failed to update the user.', error);
          });
        }

        // Return the response.
        return wrapCallbacks(promise, options);
      },

      /**
       * Retrieves all users matching the provided query.
       *
       * @param {Kinvey.Query} [query] The query.
       * @param {Options} [options] Options.
       * @param {boolean} [discover=false] Use
       *          [User Discovery](http://devcenter.kinvey.com/guides/users#lookup).
       * @throws {Kinvey.Error} `query` must be of type: `Kinvey.Query`.
       * @returns {Promise} A list of users.
       */
      find: function(query, options) {
        // Debug.
        if(KINVEY_DEBUG) {
          log('Retrieving users by query.', arguments);
        }

        // Validate arguments.
        if(null != query && !(query instanceof Kinvey.Query)) {
          throw new Kinvey.Error('query argument must be of type: Kinvey.Query.');
        }

        // Cast arguments.
        options = options || {};

        // If `options.discover`, use
        // [User Discovery](http://devcenter.kinvey.com/guides/users#lookup)
        // instead of querying the user namespace directly.
        var promise;
        if(options.discover) {
          // Debug.
          if(KINVEY_DEBUG) {
            log('Using User Discovery because of the discover flag.');
          }

          // Prepare the response.
          promise = Kinvey.Persistence.create({
            namespace: USERS,
            collection: '_lookup',
            data: query ? query.toJSON().filter : null,
            auth: Auth.Default,
            local: {
              req: true,
              res: true
            }
          }, options);
        }
        else {
          // Prepare the response.
          promise = Kinvey.Persistence.read({
            namespace: USERS,
            query: query || null,
            auth: Auth.Default,
            local: {
              req: true,
              res: true
            }
          }, options);
        }

        // Debug.
        if(KINVEY_DEBUG) {
          promise.then(function(response) {
            log('Retrieved the users by query.', response);
          }, function(error) {
            log('Failed to retrieve the users by query.', error);
          });
        }

        // Return the response.
        return wrapCallbacks(promise, options);
      },

      /**
       * Retrieves a user.
       *
       * @param {string} id User id.
       * @param {Options} [options] Options.
       * @returns {Promise} The user.
       */
      get: function(id, options) {
        // Debug.
        if(KINVEY_DEBUG) {
          log('Retrieving a user.', arguments);
        }

        // Cast arguments.
        options = options || {};

        // Prepare the response.
        var promise = Kinvey.Persistence.read({
          namespace: USERS,
          id: id,
          auth: Auth.Default,
          local: {
            req: true,
            res: true
          }
        }, options);

        // Debug.
        if(KINVEY_DEBUG) {
          promise.then(function(response) {
            log('Retrieved the user.', response);
          }, function(error) {
            log('Failed to return the user.', error);
          });
        }

        // Return the response.
        return wrapCallbacks(promise, options);
      },

      /**
       * Deletes a user.
       *
       * @param {string} id User id.
       * @param {Options} [options] Options.
       * @param {boolean} [options.hard=false] Perform a hard delete.
       * @param {boolean} [options.silent=false] Succeed if the user did not exist
       *          prior to deleting.
       * @returns {Promise} The response.
       */
      destroy: function(id, options) {
        // Debug.
        if(KINVEY_DEBUG) {
          log('Deleting a user.', arguments);
        }

        // Cast arguments.
        options = options || {};

        // Prepare the response.
        var promise = Kinvey.Persistence.destroy({
          namespace: USERS,
          id: id,
          flags: options.hard ? {
            hard: true
          } : {},
          auth: Auth.UserDefault,
          local: {
            res: true
          }
        }, options).then(function(response) {
          // If we just deleted the active user, unset it here.
          var activeUser = Kinvey.getActiveUser();
          if(null !== activeUser && activeUser._id === id) {
            // Debug.
            if(KINVEY_DEBUG) {
              log('Deleting the active user because the deleted user was the active user.');
            }

            Kinvey.setActiveUser(null);
          }
          return response;
        }, function(error) {
          // If `options.silent`, treat `USER_NOT_FOUND` as success.
          if(options.silent && Kinvey.Error.USER_NOT_FOUND === error.name) {
            // Debug.
            if(KINVEY_DEBUG) {
              log('The user does not exist. Returning success because of the silent flag.');
            }

            return null;
          }
          return Kinvey.Defer.reject(error);
        });

        // Debug.
        if(KINVEY_DEBUG) {
          promise.then(function(response) {
            log('Deleted the user.', response);
          }, function(error) {
            log('Failed to delete the user.', error);
          });
        }

        // Return the response.
        return wrapCallbacks(promise, options);
      },

      /**
       * Restores a previously disabled user.
       *
       * @param {string} id User id.
       * @param {Options} [options] Options.
       * @returns {Promise} The response.
       */
      restore: function(id, options) {
        // Debug.
        if(KINVEY_DEBUG) {
          log('Restoring a previously disabled user.', arguments);
        }

        // Cast arguments.
        options = options || {};

        // Prepare the response.
        var promise = Kinvey.Persistence.create({
          namespace: USERS,
          collection: id,
          id: '_restore',
          auth: Auth.Master
        }, options);

        // Debug.
        if(KINVEY_DEBUG) {
          promise.then(function(response) {
            log('Restored the previously disabled user.', response);
          }, function(error) {
            log('Failed to restore the previously disabled user.', error);
          });
        }

        // Return the response.
        return wrapCallbacks(promise, options);
      },

      /**
       * Performs a count operation.
       *
       * @param {Kinvey.Query} [query] The query.
       * @param {Options} [options] Options.
       * @throws {Kinvey.Error} `query` must be of type: `Kinvey.Query`.
       * @returns {Promise} The response.
       */
      count: function(query, options) {
        // Debug.
        if(KINVEY_DEBUG) {
          log('Counting the number of users.', arguments);
        }

        // Validate arguments.
        if(null != query && !(query instanceof Kinvey.Query)) {
          throw new Kinvey.Error('query argument must be of type: Kinvey.Query.');
        }

        // Cast arguments.
        options = options || {};

        // Prepare the response.
        var promise = Kinvey.Persistence.read({
          namespace: USERS,
          id: '_count',
          query: query || null,
          auth: Auth.Default,
          local: {
            req: true
          }
        }, options).then(function(response) {
          return response.count;
        });

        // Debug.
        if(KINVEY_DEBUG) {
          promise.then(function(response) {
            log('Counted the number of users.', response);
          }, function(error) {
            log('Failed to count the number of users.', error);
          });
        }

        // Return the response.
        return wrapCallbacks(promise, options);
      },

      /**
       * Performs a group operation.
       *
       * @param {Kinvey.Aggregation} aggregation The aggregation.
       * @param {Options} [options] Options.
       * @throws {Kinvey.Error} `aggregation` must be of type `Kinvey.Group`.
       * @returns {Promise} The response.
       */
      group: function(aggregation, options) {
        // Debug.
        if(KINVEY_DEBUG) {
          log('Grouping users.', arguments);
        }

        // Validate arguments.
        if(!(aggregation instanceof Kinvey.Group)) {
          throw new Kinvey.Error('aggregation argument must be of type: Kinvey.Group.');
        }

        // Cast arguments.
        options = options || {};

        // Prepare the response.
        var promise = Kinvey.Persistence.create({
          namespace: USERS,
          id: '_group',
          data: aggregation.toJSON(),
          auth: Auth.Default,
          local: {
            req: true
          }
        }, options).then(function(response) {
          // Process the raw response.
          return aggregation.postProcess(response);
        });

        // Debug.
        if(KINVEY_DEBUG) {
          promise.then(function(response) {
            log('Grouped the users.', response);
          }, function(error) {
            log('Failed to group the users.', error);
          });
        }

        // Return the response.
        return wrapCallbacks(promise, options);
      }
    };

    // Querying.
    // ---------

    // The `Kinvey.Query` class provides an easy way to build queries, which can
    // then be passed to one of the REST API wrappers to query application data.
    // Internally, the class builds a MongoDB query.

    /**
     * The Kinvey.Query class.
     *
     * @class
     * @param {Object} [options] Options.
     * @param {Object} [options.filter] Filter.
     * @param {Object} [options.sort] Sort.
     * @param {number} [options.skip] Skip.
     * @param {number} [options.limit] Limit.
     */
    Kinvey.Query = function(options) {
      // Cast arguments.
      options = options || {};

      /**
       * The MongoDB query.
       *
       * @private
       * @member {Object}
       */
      this._filter = options.filter || {};

      /**
       * The sorting order.
       *
       * @private
       * @member {Object}
       */
      this._sort = options.sort || {};

      /**
       * Number of documents to select.
       *
       * @private
       * @member {?number}
       */
      this._limit = options.limit || null;

      /**
       * Number of documents to skip from the start.
       *
       * @private
       * @member {number}
       */
      this._skip = options.skip || 0;

      /**
       * Maintain reference to the parent query in case the query is part of a
       * join.n
       *
       * @private
       * @member {?Kinvey.Query}
       */
      this._parent = null;
    };

    // Define the query methods.
    Kinvey.Query.prototype = {
      // Comparison.

      /**
       * Adds an equal to filter to the query. Requires `field` to equal `value`.
       * Any existing filters on `field` will be discarded.
       * http://docs.mongodb.org/manual/reference/operators/#comparison
       *
       * @param {string} field Field.
       * @param {*} value Value.
       * @returns {Kinvey.Query} The query.
       */
      equalTo: function(field, value) {
        this._filter[field] = value;
        return this;
      },

      /**
       * Adds a contains filter to the query. Requires `field` to contain at least
       * one of the members of `list`.
       * http://docs.mongodb.org/manual/reference/operator/in/
       *
       * @param {string} field Field.
       * @param {Array} values List of values.
       * @throws {Kinvey.Error} `values` must be of type: `Array`.
       * @returns {Kinvey.Query} The query.
       */
      contains: function(field, values) {
        // Validate arguments.
        if(!isArray(values)) {
          throw new Kinvey.Error('values argument must be of type: Array.');
        }

        return this._addFilter(field, '$in', values);
      },

      /**
       * Adds a contains all filter to the query. Requires `field` to contain all
       * members of `list`.
       * http://docs.mongodb.org/manual/reference/operator/all/
       *
       * @param {string} field Field.
       * @param {Array} values List of values.
       * @throws {Kinvey.Error} `values` must be of type: `Array`.
       * @returns {Kinvey.Query} The query.
       */
      containsAll: function(field, values) {
        // Validate arguments.
        if(!isArray(values)) {
          throw new Kinvey.Error('values argument must be of type: Array.');
        }

        return this._addFilter(field, '$all', values);
      },

      /**
       * Adds a greater than filter to the query. Requires `field` to be greater
       * than `value`.
       * http://docs.mongodb.org/manual/reference/operator/gt/
       *
       * @param {string} field Field.
       * @param {number|string} value Value.
       * @throws {Kinvey.Error} `value` must be of type: `number` or `string`.
       * @returns {Kinvey.Query} The query.
       */
      greaterThan: function(field, value) {
        // Validate arguments.
        if(!(isNumber(value) || isString(value))) {
          throw new Kinvey.Error('value argument must be of type: number or string.');
        }

        return this._addFilter(field, '$gt', value);
      },

      /**
       * Adds a greater than or equal to filter to the query. Requires `field` to
       * be greater than or equal to `value`.
       * http://docs.mongodb.org/manual/reference/operator/gte/
       *
       * @param {string} field Field.
       * @param {number|string} value Value.
       * @throws {Kinvey.Error} `value` must be of type: `number` or `string`.
       * @returns {Kinvey.Query} The query.
       */
      greaterThanOrEqualTo: function(field, value) {
        // Validate arguments.
        if(!(isNumber(value) || isString(value))) {
          throw new Kinvey.Error('value argument must be of type: number or string.');
        }

        return this._addFilter(field, '$gte', value);
      },

      /**
       * Adds a less than filter to the query. Requires `field` to be less than
       * `value`.
       * http://docs.mongodb.org/manual/reference/operator/lt/
       *
       * @param {string} field Field.
       * @param {number|string} value Value.
       * @throws {Kinvey.Error} `value` must be of type: `number` or `string`.
       * @returns {Kinvey.Query} The query.
       */
      lessThan: function(field, value) {
        // Validate arguments.
        if(!(isNumber(value) || isString(value))) {
          throw new Kinvey.Error('value argument must be of type: number or string.');
        }

        return this._addFilter(field, '$lt', value);
      },

      /**
       * Adds a less than or equal to filter to the query. Requires `field` to be
       * less than or equal to `value`.
       * http://docs.mongodb.org/manual/reference/operator/lte/
       *
       * @param {string} field Field.
       * @param {number|string} value Value.
       * @throws {Kinvey.Error} `value` must be of type: `number` or `string`.
       * @returns {Kinvey.Query} The query.
       */
      lessThanOrEqualTo: function(field, value) {
        // Validate arguments.
        if(!(isNumber(value) || isString(value))) {
          throw new Kinvey.Error('value argument must be of type: number or string.');
        }

        return this._addFilter(field, '$lte', value);
      },

      /**
       * Adds a not equal to filter to the query. Requires `field` not to equal
       * `value`.
       * http://docs.mongodb.org/manual/reference/operator/ne/
       *
       * @param {string} field Field.
       * @param {*} value Value.
       * @returns {Kinvey.Query} The query.
       */
      notEqualTo: function(field, value) {
        return this._addFilter(field, '$ne', value);
      },

      /**
       * Adds a not contained in filter to the query. Requires `field` not to
       * contain any of the members of `list`.
       * http://docs.mongodb.org/manual/reference/operator/nin/
       *
       * @param {string} field Field.
       * @param {Array} values List of values.
       * @throws {Kinvey.Error} `values` must be of type: `Array`.
       * @returns {Kinvey.Query} The query.
       */
      notContainedIn: function(field, values) {
        // Validate arguments.
        if(!isArray(values)) {
          throw new Kinvey.Error('values argument must be of type: Array.');
        }

        return this._addFilter(field, '$nin', values);
      },

      // Logical. The operator precedence is as defined as: AND-NOR-OR.

      /**
       * Performs a logical AND operation on the query and the provided queries.
       * http://docs.mongodb.org/manual/reference/operator/and/
       *
       * @param {...Kinvey.Query|Object} Queries.
       * @throws {Kinvey.Error} `query` must be of type: `Kinvey.Query[]` or `Object[]`.
       * @returns {Kinvey.Query} The query.
       */
      and: function() {
        // AND has highest precedence. Therefore, even if this query is part of a
        // JOIN already, apply it on this query.
        return this._join('$and', Array.prototype.slice.call(arguments));
      },

      /**
       * Performs a logical NOR operation on the query and the provided queries.
       * http://docs.mongodb.org/manual/reference/operator/nor/
       *
       * @param {...Kinvey.Query|Object} Queries.
       * @throws {Kinvey.Error} `query` must be of type: `Kinvey.Query[]` or `Object[]`.
       * @returns {Kinvey.Query} The query.
       */
      nor: function() {
        // NOR is preceded by AND. Therefore, if this query is part of an AND-join,
        // apply the NOR onto the parent to make sure AND indeed precedes NOR.
        if(null !== this._parent && null != this._parent._filter.$and) {
          return this._parent.nor.apply(this._parent, arguments);
        }
        return this._join('$nor', Array.prototype.slice.call(arguments));
      },

      /**
       * Performs a logical OR operation on the query and the provided queries.
       * http://docs.mongodb.org/manual/reference/operator/or/
       *
       * @param {...Kinvey.Query|Object} Queries.
       * @throws {Kinvey.Error} `query` must be of type: `Kinvey.Query[]` or `Object[]`.
       * @returns {Kinvey.Query} The query.
       */
      or: function() {
        // OR has lowest precedence. Therefore, if this query is part of any join,
        // apply the OR onto the parent to make sure OR has indeed the lowest
        // precedence.
        if(null !== this._parent) {
          return this._parent.or.apply(this._parent, arguments);
        }
        return this._join('$or', Array.prototype.slice.call(arguments));
      },

      // Element.

      /**
       * Adds an exists filter to the query. Requires `field` to exist if `flag` is
       * `true`, or not to exist if `flag` is `false`.
       * http://docs.mongodb.org/manual/reference/operator/exists/
       *
       * @param {string} field Field.
       * @param {boolean} [flag=true] The exists flag.
       * @returns {Kinvey.Query} The query.
       */
      exists: function(field, flag) {
        flag = 'undefined' === typeof flag ? true : flag || false; // Cast.
        return this._addFilter(field, '$exists', flag);
      },

      /**
       * Adds a modulus filter to the query. Requires `field` modulo `divisor` to
       * have remainder `remainder`.
       * http://docs.mongodb.org/manual/reference/operator/mod/
       *
       * @param {string} field Field.
       * @param {number} divisor Divisor.
       * @param {number} [remainder=0] Remainder.
       * @throws {Kinvey.Error} * `divisor` must be of type: `number`.
       *                         * `remainder` must be of type: `number`.
       * @returns {Kinvey.Query} The query.
       */
      mod: function(field, divisor, remainder) {
        // Cast arguments.
        if(isString(divisor)) {
          divisor = parseFloat(divisor);
        }
        if('undefined' === typeof remainder) {
          remainder = 0;
        }
        else if(isString(remainder)) {
          remainder = parseFloat(remainder);
        }

        // Validate arguments.
        if(!isNumber(divisor)) {
          throw new Kinvey.Error('divisor arguments must be of type: number.');
        }
        if(!isNumber(remainder)) {
          throw new Kinvey.Error('remainder argument must be of type: number.');
        }

        return this._addFilter(field, '$mod', [divisor, remainder]);
      },

      // JavaScript.

      /**
       * Adds a match filter to the query. Requires `field` to match `regExp`.
       * http://docs.mongodb.org/manual/reference/operator/regex/
       *
       * @param {string} field Field.
       * @param {RegExp|string} regExp Regular expression.
       * @param {Object} [options] Options.
       * @param {boolean} [options.ignoreCase=inherit] Toggles case insensitivity.
       * @param {boolean} [options.multiline=inherit] Toggles multiline matching.
       * @param {boolean} [options.extended=false] Toggles extended capability.
       * @param {boolean} [options.dotMatchesAll=false] Toggles dot matches all.
       * @returns {Kinvey.Query} The query.
       */
      matches: function(field, regExp, options) {
        // Cast arguments.
        if(!isRegExp(regExp)) {
          regExp = new RegExp(regExp);
        }

        // Flags.
        options = options || {};
        var flags = [];
        if((regExp.ignoreCase || options.ignoreCase) && false !== options.ignoreCase) {
          flags.push('i');
        }
        if((regExp.multiline || options.multiline) && false !== options.multiline) {
          flags.push('m');
        }
        if(options.extended) {
          flags.push('x');
        }
        if(options.dotMatchesAll) {
          flags.push('s');
        }

        // `$regex` and `$options` are separate filters.
        var result = this._addFilter(field, '$regex', regExp.source);
        if(0 !== flags.length) {
          this._addFilter(field, '$options', flags.join(''));
        }
        return result;
      },

      // Geospatial.

      /**
       * Adds a near filter to the query. Requires `field` to be a coordinate
       * within `maxDistance` of `coord`. Sorts documents from nearest to farthest.
       * http://docs.mongodb.org/manual/reference/operator/near/
       *
       * @param {string} field The field.
       * @param {Array.<number, number>} coord The coordinate (longitude, latitude).
       * @param {number} [maxDistance] The maximum distance (miles).
       * @throws {Kinvey.Error} `coord` must be of type: `Array.<number, number>`.
       * @returns {Kinvey.Query} The query.
       */
      near: function(field, coord, maxDistance) {
        // Validate arguments.
        if(!isArray(coord) || null == coord[0] || null == coord[1]) {
          throw new Kinvey.Error('coord argument must be of type: Array.<number, number>.');
        }

        // Cast arguments.
        coord[0] = parseFloat(coord[0]);
        coord[1] = parseFloat(coord[1]);

        // `$nearSphere` and `$maxDistance` are separate filters.
        var result = this._addFilter(field, '$near', [coord[0], coord[1]]);
        if(null != maxDistance) {
          this._addFilter(field, '$maxDistance', maxDistance);
        }
        return result;
      },

      /**
       * Adds a within box filter to the query. Requires `field` to be a coordinate
       * within the bounds of the rectangle defined by `bottomLeftCoord`,
       * `bottomRightCoord`.
       * http://docs.mongodb.org/manual/reference/operator/box/
       *
       * @param {string} field The field.
       * @param {Array.<number, number>} bottomLeftCoord The bottom left coordinate
       *          (longitude, latitude).
       * @param {Array.<number, number>} upperRightCoord The bottom right
       *          coordinate (longitude, latitude).
       * @throws {Kinvey.Error} * `bottomLeftCoord` must be of type: `Array.<number, number>`.
       *                         * `bottomRightCoord` must be of type: `Array.<number, number>`.
       * @returns {Kinvey.Query} The query.
       */
      withinBox: function(field, bottomLeftCoord, upperRightCoord) {
        // Validate arguments.
        if(!isArray(bottomLeftCoord) || null == bottomLeftCoord[0] || null == bottomLeftCoord[1]) {
          throw new Kinvey.Error('bottomLeftCoord argument must be of type: Array.<number, number>.');
        }
        if(!isArray(upperRightCoord) || null == upperRightCoord[0] || null == upperRightCoord[1]) {
          throw new Kinvey.Error('upperRightCoord argument must be of type: Array.<number, number>.');
        }

        // Cast arguments.
        bottomLeftCoord[0] = parseFloat(bottomLeftCoord[0]);
        bottomLeftCoord[1] = parseFloat(bottomLeftCoord[1]);
        upperRightCoord[0] = parseFloat(upperRightCoord[0]);
        upperRightCoord[1] = parseFloat(upperRightCoord[1]);

        var coords = [
          [bottomLeftCoord[0], bottomLeftCoord[1]],
          [upperRightCoord[0], upperRightCoord[1]]
        ];
        return this._addFilter(field, '$within', {
          $box: coords
        });
      },

      /**
       * Adds a within polygon filter to the query. Requires `field` to be a
       * coordinate within the bounds of the polygon defined by `coords`.
       * http://docs.mongodb.org/manual/reference/operator/polygon/
       *
       * @param {string} field The field.
       * @param {Array.Array.<number, number>} coords List of coordinates.
       * @throws {Kinvey.Error} `coords` must be of type `Array.Array.<number, number>`.
       * @returns {Kinvey.Query} The query.
       */
      withinPolygon: function(field, coords) {
        // Validate arguments.
        if(!isArray(coords) || 3 > coords.length) {
          throw new Kinvey.Error('coords argument must be of type: Array.Array.<number, number>.');
        }

        // Cast and validate arguments.
        coords = coords.map(function(coord) {
          if(null == coord[0] || null == coord[1]) {
            throw new Kinvey.Error('coords argument must be of type: Array.Array.<number, number>.');
          }
          return [parseFloat(coord[0]), parseFloat(coord[1])];
        });

        return this._addFilter(field, '$within', {
          $polygon: coords
        });
      },

      // Array.

      /**
       * Adds a size filter to the query. Requires `field` to be an `Array` with
       * exactly `size` members.
       * http://docs.mongodb.org/manual/reference/operator/size/
       *
       * @param {string} field Field.
       * @param {number} size Size.
       * @throws {Kinvey.Error} `size` must be of type: `number`.
       * @returns {Kinvey.Query} The query.
       */
      size: function(field, size) {
        // Cast arguments.
        if(isString(size)) {
          size = parseFloat(size);
        }

        // Validate arguments.
        if(!isNumber(size)) {
          throw new Kinvey.Error('size argument must be of type: number.');
        }

        return this._addFilter(field, '$size', size);
      },

      // Modifiers.

      /**
       * Sets the number of documents to select.
       *
       * @param {number} [limit] Limit.
       * @throws {Kinvey.Error} `limit` must be of type: `number`.
       * @returns {Kinvey.Query} The query.
       */
      limit: function(limit) {
        // Cast arguments.
        limit = limit || null;
        if(isString(limit)) {
          limit = parseFloat(limit);
        }

        // Validate arguments.
        if(null != limit && !isNumber(limit)) {
          throw new Kinvey.Error('limit argument must be of type: number.');
        }

        // Set limit on the top-level query.
        if(null !== this._parent) {
          this._parent.limit(limit);
        }
        else {
          this._limit = limit;
        }
        return this;
      },

      /**
       * Sets the number of documents to skip from the start.
       *
       * @param {number} skip Skip.
       * @throws {Kinvey.Error} `skip` must be of type: `number`.
       * @returns {Kinvey.Query} The query.
       */
      skip: function(skip) {
        // Cast arguments.
        if(isString(skip)) {
          skip = parseFloat(skip);
        }

        // Validate arguments.
        if(!isNumber(skip)) {
          throw new Kinvey.Error('skip argument must be of type: number.');
        }

        // Set skip on the top-level query.
        if(null !== this._parent) {
          this._parent.skip(skip);
        }
        else {
          this._skip = skip;
        }
        return this;
      },

      /**
       * Adds an ascending sort modifier to the query. Sorts by `field`, ascending.
       *
       * @param {string} field Field.
       * @returns {Kinvey.Query} The query.
       */
      ascending: function(field) {
        // Add sort on the top-level query.
        if(null !== this._parent) {
          this._parent.ascending(field);
        }
        else {
          this._sort[field] = 1;
        }
        return this;
      },

      /**
       * Adds an descending sort modifier to the query. Sorts by `field`,
       * descending.
       *
       * @param {string} field Field.
       * @returns {Kinvey.Query} The query.
       */
      descending: function(field) {
        // Add sort on the top-level query.
        if(null !== this._parent) {
          this._parent.descending(field);
        }
        else {
          this._sort[field] = -1;
        }
        return this;
      },

      /**
       * Sets the sort for the query. Any existing sort parameters will be
       * discarded.
       *
       * @param {Object} [sort] Sort.
       * @throws {Kinvey.Error} `sort` must be of type: `Object`.
       * @returns {Kinvey.Query} The query.
       */
      sort: function(sort) {
        // Validate arguments.
        if(null != sort && !isObject(sort)) {
          throw new Kinvey.Error('sort argument must be of type: Object.');
        }

        // Set sort on the top-level query.
        if(null !== this._parent) {
          this._parent.sort(sort);
        }
        else {
          this._sort = sort || {};
        }
        return this;
      },

      /**
       * Returns JSON representation of the query.
       *
       * @returns {Object} JSON object-literal.
       */
      toJSON: function() {
        // If the query is part of a join, return the top-level JSON representation
        // instead.
        if(null !== this._parent) {
          return this._parent.toJSON();
        }

        // Return set of parameters.
        return {
          filter: this._filter,
          sort: this._sort,
          skip: this._skip,
          limit: this._limit
        };
      },

      /**
       * Adds a filter to the query.
       *
       * @private
       * @param {string} field
       * @param {string} condition Condition.
       * @param {*} value Value.
       * @returns {Kinvey.Query} The query.
       */
      _addFilter: function(field, condition, value) {
        // Initialize the field selector.
        if(!isObject(this._filter[field])) {
          this._filter[field] = {};
        }
        this._filter[field][condition] = value;
        return this;
      },

      /**
       * Joins the current query with another query using an operator.
       *
       * @private
       * @param {string} operator Operator.
       * @param {Kinvey.Query[]|Object[]} queries Queries.
       * @throws {Kinvey.Error} `query` must be of type: `Kinvey.Query[]` or `Object[]`.
       * @returns {Kinvey.Query} The query.
       */
      _join: function(operator, queries) {
        // Cast, validate, and parse arguments. If `queries` are supplied, obtain
        // the `filter` for joining. The eventual return function will be the
        // current query.
        var result = this;
        queries = queries.map(function(query) {
          if(!(query instanceof Kinvey.Query)) {
            if(isObject(query)) { // Cast argument.
              query = new Kinvey.Query(query);
            }
            else {
              throw new Kinvey.Error('query argument must be of type: Kinvey.Query[] or Object[].');
            }
          }
          return query.toJSON().filter;
        });

        // If there are no `queries` supplied, create a new (empty) `Kinvey.Query`.
        // This query is the right-hand side of the join expression, and will be
        // returned to allow for a fluent interface.
        if(0 === queries.length) {
          result = new Kinvey.Query();
          queries = [result.toJSON().filter];
          result._parent = this; // Required for operator precedence and `toJSON`.
        }

        // Join operators operate on the top-level of `_filter`. Since the `toJSON`
        // magic requires `_filter` to be passed by reference, we cannot simply re-
        // assign `_filter`. Instead, empty it without losing the reference.
        var currentQuery = {};
        for(var member in this._filter) {
          if(this._filter.hasOwnProperty(member)) {
            currentQuery[member] = this._filter[member];
            delete this._filter[member];
          }
        }

        // `currentQuery` is the left-hand side query. Join with `queries`.
        this._filter[operator] = [currentQuery].concat(queries);

        // Return the current query if there are `queries`, and the new (empty)
        // `Kinvey.Query` otherwise.
        return result;
      },

      /**
       * Post processes the raw response by applying sort, limit, and skip.
       *
       * @private
       * @param {Array} response The raw response.
       * @throws {Kinvey.Error} `response` must be of type: `Array`.
       * @returns {Array} The processed response.
       */
      _postProcess: function(response) {
        // Validate arguments.
        if(!isArray(response)) {
          throw new Kinvey.Error('response argument must be of type: Array.');
        }

        // Sorting.
        // NOTE Sorting on dot-separated (nested) fields is not supported.
        var _this = this;
        response = response.sort(function(a, b) {
          for(var field in _this._sort) {
            if(_this._sort.hasOwnProperty(field)) {
              // Elements which do not contain the field should always be sorted
              // lower.
              if('undefined' !== typeof a[field] && 'undefined' === typeof b[field]) {
                return -1;
              }
              if('undefined' !== typeof b[field] && 'undefined' === typeof a[field]) {
                return 1;
              }

              // Sort on the current field. The modifier adjusts the sorting order
              // (ascending (-1), or descending(1)). If the fields are equal,
              // continue sorting based on the next field (if any).
              if(a[field] !== b[field]) {
                var modifier = _this._sort[field]; // 1 or -1.
                return(a[field] < b[field] ? -1 : 1) * modifier;
              }
            }
          }
          return 0;
        });

        // Limit and skip.
        if(null !== this._limit) {
          return response.slice(this._skip, this._skip + this._limit);
        }
        return response.slice(this._skip);
      }
    };

    // Persistence.
    // ------------

    // The library provides ways to store data in a variety of locations. By
    // default, all data will be stored in the remote backend. However, the
    // namespace below provides means to switch between the local (optionally
    // read-only) and remote backend. The interface of all backends must follow
    // CRUD for easy interoperability between backends.

    // Define a function to merge user-defined persistence options with state as
    // defined by `Kinvey.Sync`.
    var persistenceOptions = function(options) {
      var isEnabled = Kinvey.Sync.isEnabled();
      var isOnline = Kinvey.Sync.isOnline();
      options.fallback = isEnabled && isOnline && false !== options.fallback;
      options.offline = isEnabled && (!isOnline || options.offline);
      options.refresh = isEnabled && isOnline && false !== options.refresh;
      return options;
    };

    /**
     * @namespace
     */
    Kinvey.Persistence = {
      /**
       * Performs a create operation.
       *
       * @param {Request} request The request.
       * @param {Options} options Options.
       * @returns {Promise} The response.
       */
      create: function(request, options) {
        // Add support for references.
        if(options.relations) {
          var collection = USERS === request.namespace ? USERS : request.collection;
          return KinveyReference.save(collection, request.data, options);
        }

        // Cast arguments.
        request.local = request.local || {};
        options = persistenceOptions(options);

        // If `options.offline`, use local.
        if(request.local.req && options.offline) {
          // Debug.
          if(KINVEY_DEBUG) {
            log('Using local persistence.');
          }

          return Kinvey.Persistence.Local.create(request, options).then(null, function(error) {
            // On rejection, if `options.fallback`, perform aggregation requests
            // against net.
            if(options.fallback && '_group' === request.id) {
              // Debug.
              if(KINVEY_DEBUG) {
                log('Local persistence failed. Use net persistence because of the fallback flag.');
              }

              options.offline = false; // Overwrite to avoid infinite recursion.
              return Kinvey.Persistence.create(request, options);
            }
            return Kinvey.Defer.reject(error);
          });
        }

        // Debug.
        if(KINVEY_DEBUG) {
          log('Using net persistence.');
        }

        // Use net. If `options.refresh`, persist the response locally.
        var promise = Kinvey.Persistence.Net.create(request, options);
        if(request.local.res && options.refresh) {
          // Debug.
          if(KINVEY_DEBUG) {
            log('Persisting the response locally.');
          }

          return promise.then(function(response) {
            // The request `data` is the response from the network.
            request.data = response;
            return Kinvey.Persistence.Local.create(request, options).then(function() {
              // Return the original response.
              return response;
            });
          });
        }
        return promise;
      },

      /**
       * Performs a read operation.
       *
       * @param {Request} request The request.
       * @param {Options} options Options.
       * @returns {Promise} The response.
       */
      read: function(request, options) {
        // Cast arguments.
        request.local = request.local || {};
        options = persistenceOptions(options);

        // If `options.offline`, use local.
        if(request.local.req && options.offline) {
          // Debug.
          if(KINVEY_DEBUG) {
            log('Using local persistence.');
          }

          return Kinvey.Persistence.Local.read(request, options).then(null, function(error) {
            // On rejection, if `options.fallback`, perform the request against
            // net.
            if(options.fallback) {
              // Debug.
              if(KINVEY_DEBUG) {
                log('Local persistence failed. Use net persistence because of the fallback flag.');
              }

              options.offline = false; // Overwrite to avoid infinite recursion.
              return Kinvey.Persistence.read(request, options);
            }
            return Kinvey.Defer.reject(error);
          });
        }

        // Debug.
        if(KINVEY_DEBUG) {
          log('Using net persistence.');
        }

        // Use net. If `options.refresh`, persist the response locally.
        var promise = Kinvey.Persistence.Net.read(request, options);
        if(request.local.res && options.refresh) {
          // Debug.
          if(KINVEY_DEBUG) {
            log('Persisting the response locally.');
          }

          return promise.then(function(response) {
            // Add support for references.
            var promise;
            if(options.relations) {
              var offline = options.offline;
              options.offline = true; // Force local persistence.
              options.track = false; // The documents are not subject to synchronization.
              var collection = USERS === request.namespace ? USERS : request.collection;
              promise = KinveyReference.save(collection, response, options).then(function() {
                // Restore the options.
                options.offline = offline;
                delete options.track;
              });
            }
            else { // Save at once.
              request.data = response; // The request data is the network response.
              promise = Kinvey.Persistence.Local.create(request, options);
            }

            // Return the original response.
            return promise.then(function() {
              return response;
            });
          }, function(error) {
            // If `ENTITY_NOT_FOUND`, persist the response locally by initiating a
            // delete request locally.
            if(Kinvey.Error.ENTITY_NOT_FOUND === error.name) {
              return Kinvey.Persistence.Local.destroy(request, options).then(function() {
                // Return the original response.
                return Kinvey.Defer.reject(error);
              });
            }
            return Kinvey.Defer.reject(error);
          });
        }
        return promise;
      },

      /**
       * Performs an update operation.
       *
       * @param {Request} request The request.
       * @param {Options} options Options.
       * @returns {Promise} The response.
       */
      update: function(request, options) {
        // Add support for references.
        if(options.relations) {
          var collection = USERS === request.namespace ? USERS : request.collection;
          return KinveyReference.save(collection, request.data, options);
        }

        // Cast arguments.
        request.local = request.local || {};
        options = persistenceOptions(options);

        // If `options.offline`, use local.
        if(request.local.req && options.offline) {
          // Debug.
          if(KINVEY_DEBUG) {
            log('Using local persistence.');
          }

          return Kinvey.Persistence.Local.update(request, options);
        }

        // Debug.
        if(KINVEY_DEBUG) {
          log('Using net persistence..');
        }

        // Use net. If `options.refresh`, persist the response locally.
        var promise = Kinvey.Persistence.Net.update(request, options);
        if(request.local.res && options.refresh) {
          // Debug.
          if(KINVEY_DEBUG) {
            log('Persisting the response locally.');
          }

          return promise.then(function(response) {
            // The request `data` is the response from the network.
            request.data = response;
            return Kinvey.Persistence.Local.update(request, options).then(function() {
              // Return the original response.
              return response;
            });
          });
        }
        return promise;
      },

      /**
       * Performs a delete operation.
       *
       * @param {Request} request The request.
       * @param {Options} options Options.
       * @returns {Promise} The response.
       */
      destroy: function(request, options) {
        // Cast arguments.
        request.local = request.local || {};
        options = persistenceOptions(options);

        // If `options.offline`, use local.
        if(request.local.req && options.offline) {
          // Debug.
          if(KINVEY_DEBUG) {
            log('Using local persistence.');
          }

          return Kinvey.Persistence.Local.destroy(request, options);
        }

        // Debug.
        if(KINVEY_DEBUG) {
          log('Using net persistence.');
        }

        // Use net. If `options.refresh`, persist the response locally.
        var promise = Kinvey.Persistence.Net.destroy(request, options);
        if(request.local.res && options.refresh) {
          // Debug.
          if(KINVEY_DEBUG) {
            log('Persisting the response locally.');
          }

          return promise.then(function(response) {
            // Initiate the same request against local.
            return Kinvey.Persistence.Local.destroy(request, options).then(function() {
              // Return the original response.
              return response;
            }, function(error) {
              // If `ENTITY_NOT_FOUND`, the local database was already up-to-date.
              if(Kinvey.Error.ENTITY_NOT_FOUND === error.name) {
                // Return the original response.
                return response;
              }
              return Kinvey.Defer.reject(error);
            });
          });
        }
        return promise;
      }
    };

    // Define the Request type for documentation purposes.

    /**
     * @typedef {Object} Request
     * @property {string}       namespace    Namespace.
     * @property {string}       [collection] The collection.
     * @property {string}       [id]         The id.
     * @property {Kinvey.Query} [query]      Query.
     * @property {Object}       [flags]      Flags.
     * @property {*}            [data]       Data.
     * @property {function}     auth         Authentication.
     * @property {Object}       [local]      Cacheability of the request.
     * @property {boolean}      [local.req]  The request is executable locally.
     * @property {boolean}      [local.res]  The response is persistable locally.
     */

    // Database.
    // ---------

    // To enable local persistence, application data must be physically stored on
    // the device. The `Database` namespace exposes the API to do just that.

    /**
     * @private
     * @namespace
     */
    var Database = {
      /**
       * Saves multiple (new) documents.
       *
       * @abstract
       * @method
       * @param {string} collection The collection.
       * @param {Object[]} documents List of documents.
       * @param {Options} options Options.
       * @returns {Promise} The response.
       */
      batch: methodNotImplemented('Database.batch'),

      /**
       * Deletes all documents matching the provided query.
       * NOTE This method is not transaction-safe.
       *
       * @abstract
       * @method
       * @param {string} collection The collection.
       * @param {Kinvey.Query} [query] The query.
       * @param {Options} options Options.
       * @returns {Promise} The response.
       */
      clean: methodNotImplemented('Database.clean'),

      /**
       * Counts the number of documents matching the provided query.
       *
       * @abstract
       * @method
       * @param {string} collection The collection.
       * @param {Kinvey.Query} [query] The query.
       * @param {Options} options Options.
       * @returns {Promise} The response.
       */
      count: methodNotImplemented('Database.count'),

      /**
       * Deletes a document.
       *
       * @abstract
       * @method
       * @param {string} collection The collection.
       * @param {string} id The document id.
       * @param {Options} options Options.
       * @returns {Promise} The response.
       */
      destroy: methodNotImplemented('Database.destroy'),

      /**
       * Retrieves all documents matching the provided query.
       *
       * @abstract
       * @method
       * @param {string} collection The collection.
       * @param {Kinvey.Query} [query] The query.
       * @param {Options} options Options.
       * @returns {Promise} The response.
       */
      find: methodNotImplemented('Database.find'),

      /**
       * Retrieves a document, and updates it within the same transaction.
       * NOTE This method must be transaction-safe.
       *
       * @abstract
       * @method
       * @param {string} collection The collection.
       * @param {Kinvey.Query} [query] The query.
       * @param {function} fn The update function.
       * @returns {Promise} The response.
       */
      findAndModify: methodNotImplemented('Database.findAndModify'),

      /**
       * Retrieves a document.
       *
       * @abstract
       * @method
       * @param {string} collection The collection.
       * @param {string} id The document id.
       * @param {Options} options Options.
       * @returns {Promise} The response.
       */
      get: methodNotImplemented('Database.get'),

      /**
       * Performs an aggregation.
       *
       * @abstract
       * @method
       * @param {string} collection The collection.
       * @param {Object} aggregation The aggregation object-literal.
       * @param {Options} options Options.
       * @returns {Promise} The response.
       */
      group: methodNotImplemented('Database.group'),

      /**
       * Saves a (new) document.
       *
       * @abstract
       * @method
       * @param {string} collection The collection.
       * @param {Object} document The document.
       * @param {Options} options Options.
       * @returns {Promise} The response.
       */
      save: methodNotImplemented('Database.save'),

      /**
       * Updates a document.
       *
       * @abstract
       * @method
       * @param {string} collection The collection.
       * @param {Object} document The document.
       * @param {Options} options Options.
       * @returns {Promise} The response.
       */
      update: methodNotImplemented('Database.update'),

      /**
       * Sets the implementation of `Database` to the specified adapter.
       *
       * @method
       * @param {Object} adapter Object implementing the `Database` interface.
       */
      use: use([
          'batch', 'clean', 'count', 'destroy', 'find', 'findAndModify', 'get',
          'group', 'save', 'update'
      ])
    };

    // Local persistence.
    // ------------------

    // The local persistence namespace translates persistence requests into calls
    // to persist data locally. The local persistence is accessible through the
    // `Database` namespace.

    /**
     * @namespace
     */
    Kinvey.Persistence.Local = {
      /**
       * Initiates a create request.
       *
       * @param {Request} request The request.
       * @param {Options} options Options.
       * @returns {Promise} The response.
       */
      create: function(request, options) {
        // Debug.
        if(KINVEY_DEBUG) {
          log('Initiating a create request.', arguments);
        }

        // Cast arguments.
        options = options || {};

        // Normalize “collections” of the user namespace.
        var collection = USERS === request.namespace ? USERS : request.collection;

        // The create request can be an aggregation, or (batch) save of documents.
        // The latter two change application data, and are therefore subject to
        // synchronization.
        if('_group' === request.id) { // Aggregation.
          return Database.group(collection, request.data, options);
        }

        // (Batch) save.
        var method = isArray(request.data) ? 'batch' : 'save';
        var promise = Database[method](collection, request.data, options);
        return promise.then(function(response) {
          // If `options.offline`, the request is subject to synchronization.
          if(options.offline && false !== options.track) {
            // Debug.
            if(KINVEY_DEBUG) {
              log('Notifying the synchronization functionality.', response);
            }

            return Sync.notify(collection, response, options).then(function() {
              // Return the original response.
              return response;
            });
          }
          return response;
        });
      },

      /**
       * Initiates a create request.
       *
       * @param {Request} request The request.
       * @param {Options} options Options.
       * @returns {Promise} The response.
       */
      read: function(request, options) {
        // Debug.
        if(KINVEY_DEBUG) {
          log('Initiating a read request.', arguments);
        }

        // Cast arguments.
        options = options || {};

        // Normalize “collections” of the user namespace.
        var collection = USERS === request.namespace ? USERS : request.collection;

        // The read request can be a count, query, or simple get. Neither change
        // any application data, and therefore none are subject to synchronization.
        if('_count' === request.id) { // Count.
          return Database.count(collection, request.query, options);
        }

        // Query the collection, or retrieve a single document.
        var promise;
        if(null == request.id) { // Query.
          promise = Database.find(collection, request.query, options);
        }
        else { // Single document.
          promise = Database.get(collection, request.id, options);
        }
        return promise.then(function(response) {
          // Add support for references.
          if(options.relations) {
            return KinveyReference.get(response, options);
          }
          return response;
        });
      },

      /**
       * Initiates a create request.
       *
       * @param {Request} request The request.
       * @param {Options} options Options.
       * @returns {Promise} The response.
       */
      update: function(request, options) {
        // Debug.
        if(KINVEY_DEBUG) {
          log('Initiating an update request.', arguments);
        }

        // Cast arguments.
        options = options || {};

        // Normalize “collections” of the user namespace.
        var collection = USERS === request.namespace ? USERS : request.collection;

        // All update operations change application data, and are therefore subject
        // to synchronization.
        var promise = Database.update(collection, request.data, options);
        return promise.then(function(response) {
          // If `options.offline`, the response is subject to synchronization.
          if(options.offline && false !== options.track) {
            // Debug.
            if(KINVEY_DEBUG) {
              log('Notifying the synchronization functionality.', response);
            }

            return Sync.notify(collection, response, options).then(function() {
              // Return the original response.
              return response;
            });
          }
          return response;
        });
      },

      /**
       * Initiates a create request.
       *
       * @param {Request} request The request.
       * @param {Options} options Options.
       * @returns {Promise} The response.
       */
      destroy: function(request, options) {
        // Debug.
        if(KINVEY_DEBUG) {
          log('Initiating a delete request.', arguments);
        }

        // Cast arguments.
        options = options || {};

        // Normalize “collections” of the user namespace.
        var collection = USERS === request.namespace ? USERS : request.collection;

        // The delete request can be a clean or destroy of documents. Both change
        // application data, and are therefore subject to synchronization.
        var promise;
        if(null == request.id) { // Clean documents.
          promise = Database.clean(collection, request.query, options);
        }
        else { // Destroy a single document.
          promise = Database.destroy(collection, request.id, options);
        }
        return promise.then(function(response) {
          // If `options.offline`, the request is subject to synchronization.
          if(options.offline && false !== options.track) {
            // Debug.
            if(KINVEY_DEBUG) {
              log('Notifying the synchronization functionality.', response);
            }

            return Sync.notify(collection, response.documents, options).then(function() {
              // Return the original response.
              return response;
            });
          }
          return response;
        });
      }
    };

    // Network persistence.
    // --------------------

    // The actual execution of a network request must be defined by an adapter.

    /**
     * @namespace
     */
    Kinvey.Persistence.Net = {
      /**
       * Initiates a create request.
       *
       * @param {Request} request The request.
       * @param {Options} options Options.
       * @returns {Promise} The response.
       */
      create: function(request, options) {
        // Debug.
        if(KINVEY_DEBUG) {
          log('Initiating a create request.', arguments);
        }

        // Initiate the network request.
        request.method = 'POST';
        return Kinvey.Persistence.Net._request(request, options);
      },

      /**
       * Initiates a read request.
       *
       * @param {Request} request The request.
       * @param {Options} options Options.
       * @returns {Promise} The response.
       */
      read: function(request, options) {
        // Debug.
        if(KINVEY_DEBUG) {
          log('Initiating a read request.', arguments);
        }

        // Cast arguments.
        options = options || {};

        // Add support for references.
        if(options.relations) {
          // Resolve all relations not explicitly excluded.
          options.exclude = options.exclude || [];
          var resolve = Object.keys(options.relations).filter(function(member) {
            return -1 === options.exclude.indexOf(member);
          });

          request.flags = request.flags || {};
          request.flags.retainReferences = false;
          request.flags.resolve = resolve.join(',');
        }

        // Initiate the network request.
        request.method = 'GET';
        return Kinvey.Persistence.Net._request(request, options);
      },

      /**
       * Initiates an update request.
       *
       * @param {Request} request The request.
       * @param {Options} options Options.
       * @returns {Promise} The response.
       */
      update: function(request, options) {
        // Debug.
        if(KINVEY_DEBUG) {
          log('Initiating an update request.', arguments);
        }

        // Initiate the network request.
        request.method = 'PUT';
        return Kinvey.Persistence.Net._request(request, options);
      },

      /**
       * Initiates a delete request.
       *
       * @param {Request} request The request.
       * @param {Options} options Options.
       * @returns {Promise} The response.
       */
      destroy: function(request, options) {
        // Debug.
        if(KINVEY_DEBUG) {
          log('Initiating a delete request.', arguments);
        }

        // Initiate the network request.
        request.method = 'DELETE';
        return Kinvey.Persistence.Net._request(request, options);
      },

      /**
       * Initiates a network request to the Kinvey service.
       *
       * @param {Request} request The request.
       * @param {string} request.method The request method.
       * @param {Options} options Options.
       * @throws {Kinvey.Error} * `request` must contain: `method`.
       *                         * `request` must contain: `namespace`.
       *                         * `request` must contain: `auth`.
       * @returns {Promise}
       */
      _request: function(request, options) {
        // Validate arguments.
        if(null == request.method) {
          throw new Kinvey.Error('request argument must contain: method.');
        }
        if(null == request.namespace) {
          throw new Kinvey.Error('request argument must contain: namespace.');
        }
        if(null == request.auth) {
          throw new Kinvey.Error('request argument must contain: auth.');
        }

        // Validate preconditions.
        var error;
        if(null == Kinvey.appKey && Auth.None !== request.auth) {
          error = clientError(Kinvey.Error.MISSING_APP_CREDENTIALS);
          return Kinvey.Defer.reject(error);
        }
        if(null == Kinvey.masterSecret && options.skipBL) {
          error = clientError(Kinvey.Error.MISSING_MASTER_CREDENTIALS);
          return Kinvey.Defer.reject(error);
        }

        // Build, escape, and join URL segments.
        // Format: <API_ENDPOINT>/<namespace>[/<Kinvey.appKey>][/<collection>][/<id>]
        var segments = [request.namespace, Kinvey.appKey, request.collection, request.id];
        segments = segments.filter(function(value) {
          // Exclude empty optional segment. Note the required namespace cannot be
          // empty at this point (enforced above).
          return null != value;
        }).map(Kinvey.Persistence.Net.encode);
        var url = [Kinvey.API_ENDPOINT].concat(segments).join('/') + '/';

        // Build query string.
        var flags = request.flags || {};
        if(request.query) { // Add query fragments.
          var query = request.query.toJSON();
          flags.query = query.filter;
          if(null !== query.limit) {
            flags.limit = query.limit;
          }
          if(0 !== query.skip) {
            flags.skip = query.skip;
          }
          if(!isEmpty(query.sort)) {
            flags.sort = query.sort;
          }
        }

        // If `options.nocache`, add a cache busting query string. This is useful
        // for Android < 4.0 which caches all requests aggressively.
        if(options.nocache) {
          flags._ = Math.random().toString(36).substr(2);
        }

        // Format fragments.
        var params = [];
        for(var key in flags) {
          if(flags.hasOwnProperty(key)) {
            var value = isString(flags[key]) ? flags[key] : JSON.stringify(flags[key]);
            params.push(
              Kinvey.Persistence.Net.encode(key) + '=' + Kinvey.Persistence.Net.encode(value));
          }
        }

        // Append query string if there are `params`.
        if(0 < params.length) {
          url += '?' + params.join('&');
        }

        // Set headers.
        var headers = {
          Accept: 'application/json',
          'X-Kinvey-API-Version': Kinvey.API_VERSION,
          'X-Kinvey-Device-Information': this.info()
        };
        if(null != request.data) {
          headers['Content-Type'] = 'application/json; charset=utf-8';
        }

        // Set skip BL header.
        if(options.skipBL) {
          headers['X-Kinvey-Skip-Business-Logic'] = true;
        }

        // Set debug headers.
        if(KINVEY_DEBUG) {
          headers['X-Kinvey-Trace-Request'] = true;
          headers['X-Kinvey-Force-Debug-Log-Credentials'] = true;
        }

        // Authorization.
        var promise = request.auth().then(function(auth) {
          if(null !== auth) {
            // Format credentials.
            var credentials = auth.credentials;
            if(null != auth.username) {
              credentials = Kinvey.Persistence.Net.base64(auth.username + ':' + auth.password);
            }

            // Append header.
            headers.Authorization = auth.scheme + ' ' + credentials;
          }
        });

        // Invoke the network layer.
        return promise.then(function() {
          var response = Kinvey.Persistence.Net.request(
            request.method,
            url,
            headers,
            request.data,
            options);

          // Add a descriptive message to `InvalidCredentials` error so the user
          // knows what’s going on.
          return response.then(null, function(error) {
            if(Kinvey.Error.INVALID_CREDENTIALS === error.name) {
              error.debug = 'The tokens used to execute the request are expired. Please ' +
                'run `Kinvey.User.logout({ force: true })`, and then log back in using ' +
                '`Kinvey.User.login(username, password)` to solve this issue.';
            }
            return Kinvey.Defer.reject(error);
          });
        });
      },

      /**
       * Base64-encodes a value.
       *
       * @abstract
       * @method
       * @param {string} value Value.
       * @returns {string} Base64-encoded value.
       */
      base64: methodNotImplemented('Kinvey.Persistence.Net.base64'),

      /**
       * Encodes a value for use in the URL.
       *
       * @abstract
       * @method
       * @param {string} value Value.
       * @returns {string} Encoded value.
       */
      encode: methodNotImplemented('Kinvey.Persistence.Net.encode'),

      /**
       * Returns device information.
       *
       * @abstract
       * @method
       * @returns {string} Device information.
       */
      info: methodNotImplemented('Kinvey.Persistence.Net.info'),

      /**
       * Initiates a network request.
       *
       * @abstract
       * @method
       * @param {string}  method    Method.
       * @param {string}  url       URL.
       * @param {Object}  [headers] Headers.
       * @param {?Object} [body]    Body.
       * @param {Options} [options] Options.
       * @returns {Promise} The promise.
       */
      request: methodNotImplemented('Kinvey.Persistence.Net.request'),

      /**
       * Sets the implementation of `Kinvey.Persistence.Net` to the specified
       * adapter.
       *
       * @method
       * @param {Object} adapter Object implementing the `Kinvey.Persistence.Net`
       *          interface.
       */
      use: use(['base64', 'encode', 'info', 'request'])
    };

    // Synchronization.
    // ----------------

    // Synchronization consists of two major namespaces: `Sync` and `Kinvey.Sync`.
    // The former contains the synchronization code, as well as multiple properties
    // used to maintain the application state throughout its lifetime. The
    // `Kinvey.Sync` namespace exposes a number of methods to the outside world.
    // Most of these methods delegate back to `Sync`. Therefore, `Kinvey.Sync`
    // provides the public interface for synchronization.

    /**
     * @private
     * @namespace
     */
    var Sync = {
      /**
       * Flag whether local persistence is enabled.
       *
       * @property {boolean}
       */
      enabled: false,

      /**
       * Flag whether the application resides in an online state.
       *
       * @property {boolean}
       */
      online: true,

      /**
       * The identifier where the synchronization metadata is stored.
       *
       * @property {string}
       */
      system: 'system.sync',

      /**
       * Counts the number of documents pending synchronization. If `collection` is
       * provided, it returns the count of that collection only.
       *
       * @param {string} [collection] The collection.
       * @param {Options} [options] Options.
       * @returns {Promise} The response.
       */
      count: function(collection, options) {
        // Cast arguments.
        options = options || {};

        // If a collection was provided, count that collection only.
        if(null != collection) {
          return Database.get(Sync.system, collection, options).then(function(response) {
            // Return the count.
            return response.size;
          }, function(error) {
            // If `ENTITY_NOT_FOUND`, there are no documents pending
            // synchronization.
            if(Kinvey.Error.ENTITY_NOT_FOUND === error.name) {
              return 0;
            }
            return Kinvey.Defer.reject(error);
          });
        }

        // Aggregate the count of all collections.
        var agg = Kinvey.Group.sum('size').toJSON();
        return Database.group(Sync.system, agg, options).then(function(response) {
          // Return the aggregation result, or 0 if the aggregation was empty.
          return response[0] ? response[0].result : 0;
        });
      },

      /**
       * Initiates a synchronization operation.
       *
       * @param {Options} options Options.
       * @returns {Promise} The response.
       */
      execute: function(options) {
        // Obtain all the collections that need to be synchronized.
        var query = new Kinvey.Query().greaterThan('size', 0);
        return Database.find(Sync.system, query, options).then(function(response) {
          // Synchronize all the collections in parallel.
          var promises = response.map(function(collection) {
            return Sync._collection(collection._id, collection.documents, options);
          });
          return Kinvey.Defer.all(promises);
        });
      },

      /**
       * Handler to flag the provided `documents` for synchronization.
       *
       * @param {string} collection The collection.
       * @param {Array|Object} documents The document, or list of documents.
       * @param {Options} [options] Options.
       * @returns {Promise} The promise.
       */
      notify: function(collection, documents, options) {
        // Update the metadata for the provided collection in a single transaction.
        return Database.findAndModify(Sync.system, collection, function(metadata) {
          // Cast arguments.
          documents = isArray(documents) ? documents : [documents];
          metadata = metadata || {
            _id: collection,
            documents: {},
            size: 0
          };

          // Add each document to the metadata ( id => timestamp ).
          documents.forEach(function(document) {
            if(!metadata.documents.hasOwnProperty(document._id)) {
              metadata.size += 1;
            }
            var timestamp = null != document._kmd ? document._kmd.lmt : null;
            metadata.documents[document._id] = timestamp;
          });

          // Return the new metadata.
          return metadata;
        }, options).then(function() {
          // Return an empty response.
          return null;
        });
      },

      /**
       * Synchronizes the provided collection.
       *
       * @param {string} collection The collection.
       * @param {Object} documents Object of documents ( id => timestamp ).
       * @param {Options} [options] Options.
       * @returns {Promise} The response.
       */
      _collection: function(collection, documents, options) {
        // Prepare the response.
        var result = {
          collection: collection,
          success: [],
          error: []
        };

        // Obtain the actual documents from local and net.
        var identifiers = Object.keys(documents);
        var request = {
          namespace: USERS === collection ? USERS : DATA_STORE,
          collection: USERS === collection ? null : collection,
          query: new Kinvey.Query().contains('_id', identifiers),
          auth: Auth.Default
        };

        // Step 1: obtain the documents from local and net.
        var promises = [
          Kinvey.Persistence.Local.read(request, options),
          Kinvey.Persistence.Net.read(request, options)
        ];
        return Kinvey.Defer.all(promises).then(function(responses) {
          // `responses` is a list of documents. Re-format as object
          // ( id => document ).
          var response = {
            local: {},
            net: {}
          };
          responses[0].forEach(function(document) {
            response.local[document._id] = document;
          });
          responses[1].forEach(function(document) {
            response.net[document._id] = document;
          });
          return response;
        }).then(function(response) {
          // Step 2: categorize the documents in the collection.
          var promises = identifiers.map(function(id) {
            return Sync._document(
              collection, {
              id: id,
              timestamp: documents[id]
            }, // The document metadata.
            response.local[id] || null, // The local document.
            response.net[id] || null, // The net document.
            options).then(null, function(response) {
              // Rejection occurs when a conflict could not be resolved. Append the
              // id to the errors, and resolve.
              result.error.push(response.id);
              return null;
            });
          });
          return Kinvey.Defer.all(promises);
        }).then(function(responses) {
          // Step 3: commit the documents in the collection.
          var created = responses.filter(function(response) {
            return null != response && null !== response.document;
          });
          var destroyed = responses.filter(function(response) {
            return null != response && null === response.document;
          });

          // Save and destroy all documents in parallel.
          var promises = [
            Sync._save(collection, created, options),
            Sync._destroy(collection, destroyed, options)
          ];
          return Kinvey.Defer.all(promises);
        }).then(function(responses) {
          // Merge the response.
          result.success = result.success.concat(responses[0].success, responses[1].success);
          result.error = result.error.concat(responses[0].error, responses[1].error);

          // Step 4: update the metadata.
          return Database.findAndModify(Sync.system, collection, function(metadata) {
            // Remove each document from the metadata.
            result.success.forEach(function(id) {
              if(metadata.documents.hasOwnProperty(id)) {
                metadata.size -= 1;
                delete metadata.documents[id];
              }
            });

            // Return the new metadata.
            return metadata;
          }, options);
        }).then(function() {
          // Step 5: return the synchronization result.
          return result;
        });
      },

      /**
       * Deletes the provided documents using both local and network persistence.
       *
       * @param {string} collection The collection.
       * @param {Array} documents List of documents.
       * @param {Options} [options] Options.
       * @returns {Array} List of document ids.
       */
      _destroy: function(collection, documents, options) {
        // Cast arguments.
        documents = documents.map(function(composite) {
          return composite.id;
        });

        // If there are no documents to delete, resolve immediately.
        if(0 === documents.length) {
          return Kinvey.Defer.resolve({
            success: [],
            error: []
          });
        }

        // Build the request.
        var request = {
          namespace: USERS === collection ? USERS : DATA_STORE,
          collection: USERS === collection ? null : collection,
          query: new Kinvey.Query().contains('_id', documents),
          auth: Auth.Default
        };

        // Delete from local and net in parallel. Deletion is an atomic action,
        // therefore the documents will either all be part of `success` or `error`.
        var promises = [
          Kinvey.Persistence.Local.destroy(request, options),
          Kinvey.Persistence.Net.destroy(request, options)
        ];
        return Kinvey.Defer.all(promises).then(function() {
          return {
            success: documents,
            error: []
          };
        }, function() {
          return {
            success: [],
            error: documents
          };
        });
      },

      /**
       * Compares the local and net versions of the provided document. Fulfills
       * with the winning document, or rejects if no winner can be picked.
       *
       * @param {string} collection The collection.
       * @param {Object} metadata The document metadata.
       * @param {?Object} local The local document.
       * @param {?Object} net The net document.
       * @param {Options} [options] Options.
       * @returns {Promise} The response.
       */
      _document: function(collection, metadata, local, net, options) {
        // Resolve if the remote copy does not exist or if both timestamps match.
        // Reject otherwise.
        if(null === net || (null != net._kmd && metadata.timestamp === net._kmd.lmt)) {
          return Kinvey.Defer.resolve({
            id: metadata.id,
            document: local
          });
        }

        // A conflict was detected. Attempt to resolve it by invoking the conflict
        // handler.
        if(null != options.conflict) {
          // The conflict handler should return a promise which either resolves
          // with the winning document, or gets rejected.
          return options.conflict(collection, local, net).then(function(document) {
            return {
              id: metadata.id,
              document: document
            };
          }, function() {
            return Kinvey.Defer.reject({
              id: metadata.id,
              document: [local, net]
            });
          });
        }
        return Kinvey.Defer.reject({
          id: metadata.id,
          document: [local, net]
        });
      },

      /**
       * Saves the provided documents using both local and network persistence.
       *
       * @param {string} collection The collection.
       * @param {Array} documents List of documents.
       * @param {Options} [options] Options.
       * @returns {Array} List of document ids.
       */
      _save: function(collection, documents, options) {
        // Cast arguments.
        documents = documents.map(function(composite) {
          return composite.document;
        });

        // Build the request.
        var request = {
          namespace: USERS === collection ? USERS : DATA_STORE,
          collection: USERS === collection ? null : collection,
          auth: Auth.Default
        };

        // Save documents on net.
        var error = []; // Track errors of individual update operations.
        var promises = documents.map(function(document) {
          // Update the request parameters and save the document.
          request.id = document._id;
          request.data = document;
          return Kinvey.Persistence.Net.update(request, options).then(null, function() {
            // Rejection should not break the entire synchronization. Instead,
            // append the document id to `error`, and resolve.
            error.push(document._id);
            return null;
          });
        });
        return Kinvey.Defer.all(promises).then(function(responses) {
          // `responses` is an `Array` of documents. Update the request parameters
          // and batch save all documents.
          request.id = null;
          request.data = responses;
          return Kinvey.Persistence.Local.create(request, options);
        }).then(function(response) {
          // Build the final response.
          return {
            success: response.map(function(document) {
              return document._id;
            }),
            error: error
          };
        }, function() {
          // Build the final response.
          return {
            success: [],
            error: documents.map(function(document) {
              return document._id;
            })
          };
        });
      }
    };

    // Expose public methods of `Sync` as the `Kinvey.Sync` namespace.

    /**
     * @namespace
     */
    Kinvey.Sync = {
      /**
       * Counts the number of documents pending synchronization. If `collection` is
       * provided, it returns the count of that collection only.
       *
       * @param {string} [collection] The collection.
       * @param {Options} [options] Options.
       * @returns {Promise} The response.
       */
      count: function(collection, options) {
        // Debug.
        if(KINVEY_DEBUG) {
          log('Counting the number of documents pending synchronization.', arguments);
        }

        // Validate preconditions.
        if(!Kinvey.Sync.isOnline()) {
          var error = clientError(Kinvey.Error.SYNC_ERROR, {
            debug: 'Sync is not enabled, or the application resides in offline mode.'
          });
          return Kinvey.Defer.reject(error);
        }

        // Cast arguments.
        options = options || {};

        // Prepare the response.
        var promise = Sync.count(collection, options);

        // Debug.
        if(KINVEY_DEBUG) {
          promise.then(function(response) {
            log('Counted the number of documents pending synchronization.', response);
          }, function(error) {
            log('Failed to count the number of documents pending synchronization.', error);
          });
        }

        // Return the response.
        return wrapCallbacks(promise, options);
      },

      /**
       * Initiates a synchronization operation.
       *
       * @param {Options}  [options]          Options.
       * @param {function} [options.conflict] The conflict handler.
       * @param {Object}   [options.user]     Login with these credentials prior
       *          to initiating the synchronization operation.
       * @returns {Promise} The response.
       */
      execute: function(options) {
        // Debug.
        if(KINVEY_DEBUG) {
          log('Synchronizing the application.', arguments);
        }

        // Validate preconditions.
        if(!Kinvey.Sync.isOnline()) {
          var error = clientError(Kinvey.Error.SYNC_ERROR, {
            debug: 'Sync is not enabled, or the application resides in offline mode.'
          });
          return Kinvey.Defer.reject(error);
        }

        // Cast arguments.
        options = options || {};

        // Attempt to login with the user context prior to synchronizing.
        var promise;
        if(null != options.user) {
          // Debug.
          if(KINVEY_DEBUG) {
            log('Attempting to login with a user context.', options.user);
          }

          // Prepare the response.
          promise = Kinvey.User.login(options.user).then(function() {
            // The user is now logged in. Re-start the synchronization operation.
            delete options.user; // We don’t need this anymore.
            return Kinvey.Sync.execute(options);
          });

          // Debug.
          if(KINVEY_DEBUG) {
            promise.then(null, function(error) {
              log('Failed to login with the user context.', error);
            });
          }

          // Return the response.
          promise.then(null, options.error);
          return promise;
        }

        // Prepare the response.
        promise = Sync.execute(options);

        // Debug.
        if(KINVEY_DEBUG) {
          promise.then(function(response) {
            log('Synchonized the application.', response);
          }, function(error) {
            log('Failed to synchronize the application.', error);
          });
        }

        // Return the response.
        return wrapCallbacks(promise, options);
      },

      /**
       * Initializes the synchronization namespace.
       *
       * @param {Object}  [options]              Options.
       * @param {boolean} [options.enable=false] Enable local persistence.
       * @param {boolean} [options.online]       The initial application state.
       * @returns {Promise} The promise.
       */
      init: function(options) {
        // Debug.
        if(KINVEY_DEBUG) {
          log('Initializing the synchronization functionality.', arguments);
        }

        // Cast arguments.
        options = options || {};

        // Save applicable options.
        Sync.enabled = null != options ? options.enable : false;
        Sync.online = 'undefined' !== typeof options.online ? options.online : Sync.online;

        // Resolve immediately.
        return Kinvey.Defer.resolve(null);
      },

      /**
       * Returns whether local persistence is active.
       *
       * @returns {boolean} The enable status.
       */
      isEnabled: function() {
        return Sync.enabled;
      },

      /**
       * Returns whether the application resides in an online state.
       *
       * @returns {boolean} The online status.
       */
      isOnline: function() {
        return Sync.online;
      },

      /**
       * Switches the application state to offline.
       *
       * @returns {Promise} The promise.
       */
      offline: function() {
        // Debug.
        if(KINVEY_DEBUG) {
          log('Switching the application state to offline.');
        }

        // Validate preconditions.
        if(!Kinvey.Sync.isEnabled()) {
          var error = clientError(Kinvey.Error.SYNC_ERROR, {
            debug: 'Sync is not enabled.'
          });
          return Kinvey.Defer.reject(error);
        }

        // Flip flag.
        Sync.online = false;

        // Resolve immediately.
        return Kinvey.Defer.resolve(null);
      },

      /**
       * Switches the application state to online.
       *
       * @param {Options} [options]           Options.
       * @param {boolean} [options.sync=true] Initiate a synchronization operation
       *          on mode change.
       * @returns {Promise} The response.
       */
      online: function(options) {
        // Debug.
        if(KINVEY_DEBUG) {
          log('Switching the application state to online.', arguments);
        }

        // Validate preconditions.
        if(!Kinvey.Sync.isEnabled()) {
          var error = clientError(Kinvey.Error.SYNC_ERROR, {
            debug: 'Sync is not enabled.'
          });
          return Kinvey.Defer.reject(error);
        }

        // Cast arguments.
        options = options || {};

        // Flip flag.
        var previous = Sync.online;
        Sync.online = true;

        // Initiate a synchronization operation if the mode changed.
        if(false !== options.sync && previous !== Sync.online) {
          return Kinvey.Sync.execute(options);
        }
        return Kinvey.Defer.resolve(null);
      },

      /**
       * Prefers the local document over the net document.
       *
       * @param {string} collection The collection.
       * @param {?Object} local The local document.
       * @param {?Object} net The net document.
       * @returns {Promise} The winning document.
       */
      clientAlwaysWins: function(collection, local) {
        return Kinvey.Defer.resolve(local);
      },

      /**
       * Prefers the net document over the local document.
       *
       * @param {string} collection The collection.
       * @param {?Object} local The local document.
       * @param {?Object} net The net document.
       * @returns {Promise} The winning document.
       */
      serverAlwaysWins: function(collection, local, net) {
        return Kinvey.Defer.resolve(net);
      }
    };

    /* global promiscuous: true */

    // Use `promiscuous` as `Kinvey.Defer` adapter.
    if('undefined' !== typeof promiscuous) {
      Kinvey.Defer.use(promiscuous);
    }

    /* jshint evil: true */
    /* global sift: true */

    // `Database` adapter for [IndexedDB](http://www.w3.org/TR/IndexedDB/).
    var IDBAdapter = {
      /**
       * The reference to an opened instance of IndexedDB.
       *
       * @property {IDBRequest}
       */
      db: null,

      /**
       * The reference to the underlying IndexedDB implementation.
       *
       * @property {IDBFactory}
       */
      impl: root.indexedDB || root.webkitIndexedDB || root.mozIndexedDB || root.oIndexedDB || root.msIndexedDB,

      /**
       * Status whether the database is currently performing an upgrade operation.
       *
       * @property {boolean}
       */
      inTransaction: false,

      /**
       * Generates an object id.
       *
       * @param {integer} [length=24] The length of the object id.
       * @returns {string} The id.
       */
      objectID: function(length) {
        length = length || 24;
        var chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        var result = '';
        for(var i = 0, j = chars.length; i < length; i += 1) {
          var pos = Math.floor(Math.random() * j);
          result += chars.substring(pos, pos + 1);
        }
        return result;
      },

      /**
       * A list of operations queued while the database was `inTransaction`.
       *
       * @property {Array.<function>}
       */
      pending: [],

      /**
       * Obtains a transaction handle to the provided collection.
       * NOTE IndexedDB automatically commits transactions that haven’t been used
       * in an event loop tick. Therefore, deferreds cannot be used. See
       * https://github.com/promises-aplus/promises-spec/issues/45.
       *
       * @param {string} collection The collection.
       * @param {boolean} [write=false] `true` to request write access in addition
       *                    to read.
       * @param {function} success Success callback.
       * @param {function} error Failure callback.
       * @param {boolean} [force=false] Continue even if a concurrent transaction
       *          is active.
       */
      transaction: function(collection, write, success, error, force) {
        // Validate preconditions.
        if(!/^[a-zA-Z0-9\-]{1,128}/.test(collection)) {
          return error(clientError(Kinvey.Error.INVALID_IDENTIFIER, {
            description: 'The collection name has an invalid format.',
            debug: 'The collection name may only contain alphanumeric characters and dashes.'
          }));
        }
        if(null === IDBAdapter.dbname) {
          return error(clientError(Kinvey.Error.DATABASE_ERROR, {
            description: 'Missing database name.',
            debug: 'Did you forget to call `IDBAdapter.init`?'
          }));
        }

        // Cast arguments.
        write = write || false;

        // If there is a database handle, try to be smart.
        if(null !== IDBAdapter.db) {
          // If the collection exists, obtain and return the transaction handle.
          if(IDBAdapter.db.objectStoreNames.contains(collection)) {
            var mode = write ? 'readwrite' : 'readonly';
            var txn = IDBAdapter.db.transaction([collection], mode);
            var store = txn.objectStore(collection);
            return success(store);
          }

          // The collection does not exist. If we want to read only, return an error
          // and do not create the collection.
          else if(!write) { // Do not create.
            return error(clientError(Kinvey.Error.COLLECTION_NOT_FOUND, {
              description: 'This collection not found for this app backend',
              debug: {
                collection: collection
              }
            }));
          }
        }

        // There is no database handle, or the collection needs to be created. Both
        // are done through a database upgrade operation. This operation cannot be
        // executed concurrently. Therefore, queue any concurrent operations.
        if(true !== force && IDBAdapter.inTransaction) {
          return IDBAdapter.pending.push(function() {
            IDBAdapter.transaction(collection, write, success, error);
          });
        }
        IDBAdapter.inTransaction = true; // Switch flag.

        // An upgrade operation is initiated by re-opening the database with an
        // higher version number.
        var request;
        if(null !== IDBAdapter.db) { // Re-open.
          var version = IDBAdapter.db.version + 1;
          request = IDBAdapter.impl.open(IDBAdapter.db.name, version);
        }
        else { // Open the current version.
          // Validate preconditions.
          if(null == Kinvey.appKey) {
            IDBAdapter.inTransaction = false; // Restore.
            return error(clientError(Kinvey.Error.MISSING_APP_CREDENTIALS));
          }

          var dbName = 'Kinvey.' + Kinvey.appKey;
          request = IDBAdapter.impl.open(dbName);
        }

        // If the database is opened with an higher version than its current, the
        // `upgradeneeded` event is fired. Save the handle to the database, and
        // create the collection.
        request.onupgradeneeded = function() {
          IDBAdapter.db = request.result;
          IDBAdapter.db.createObjectStore(collection, {
            keyPath: '_id'
          });
        };

        // The `success` event is fired after `upgradeneeded` terminates. Again,
        // save the handle to the database.
        request.onsuccess = function() {
          IDBAdapter.db = request.result;

          // If a second instance of the same IndexedDB database performs an
          // upgrade operation, the `versionchange` event is fired. Then, close the
          // database to allow the external upgrade to proceed.
          IDBAdapter.db.onversionchange = function() { // Reset.
            IDBAdapter.db.close();
            IDBAdapter.db = null;
          };

          // Try to obtain the collection handle by recursing. Append the `success`
          // handler to empty the queue upon success. Set the `force` flag so all
          // but the current transaction are still queued.
          return IDBAdapter.transaction(collection, write, function(store) {
            var result = success(store); // The original success handler.

            // The database handle has been established, we can now safely empty
            // the queue. The queue must be emptied before invoking the concurrent
            // operations to avoid infinite recursion.
            IDBAdapter.inTransaction = false;
            if(0 !== IDBAdapter.pending.length) {
              var pending = IDBAdapter.pending;
              IDBAdapter.pending = [];
              pending.forEach(function(fn) {
                fn();
              });
            }

            return result;
          }, error, true);
        };

        // The `blocked` event is not handled. In case such an event occurs, it
        // will resolve itself since the `versionchange` event handler will close
        // the conflicting database and enable the `blocked` event to continue. We
        // do, however, need to handle any other errors.
        request.onerror = function(event) {
          error(clientError(Kinvey.Error.DATABASE_ERROR, {
            debug: event
          }));
        };
      },

      /**
       * @augments {Database.batch}
       */
      batch: function(collection, documents /*, options*/ ) {
        // If there are no documents, return.
        if(0 === documents.length) {
          return Kinvey.Defer.resolve(documents);
        }

        // Prepare the response.
        var deferred = Kinvey.Defer.deferred();

        // Obtain the transaction handle.
        IDBAdapter.transaction(collection, true, function(store) {
          // Save all documents in a single transaction. Instead of the `success`
          // event, bind to the `complete` event.
          var request = store.transaction;
          documents.forEach(function(document) {
            document._id = document._id || IDBAdapter.objectID();
            store.put(document);
          });
          request.oncomplete = function() {
            deferred.resolve(documents);
          };
          request.onerror = function(event) {
            var error = clientError(Kinvey.Error.DATABASE_ERROR, {
              debug: event
            });
            deferred.reject(error);
          };
        }, function(error) { // Reject.
          deferred.reject(error);
        });

        // Return the promise.
        return deferred.promise;
      },

      /**
       * @augments {Database.clean}
       */
      clean: function(collection, query, options) {
        // Deleting should not take the query sort, limit, and skip into account.
        if(null != query) { // Reset.
          query.sort(null).limit(null).skip(0);
        }

        // Obtain the documents to be deleted via `IDBAdapter.find`.
        return IDBAdapter.find(collection, query, options).then(function(documents) {
          // If there are no documents matching the query, return.
          if(0 === documents.length) {
            return {
              count: 0,
              documents: []
            };
          }

          // Prepare the response.
          var deferred = Kinvey.Defer.deferred();

          // Obtain the transaction handle.
          IDBAdapter.transaction(collection, true, function(store) {
            // Delete all documents in a single transaction. Instead of the
            // `success` event, bind to the `complete` event.
            var request = store.transaction;
            documents.forEach(function(document) {
              store['delete'](document._id);
            });
            request.oncomplete = function() {
              deferred.resolve({
                count: documents.length,
                documents: documents
              });
            };
            request.onerror = function(event) {
              var error = clientError(Kinvey.Error.DATABASE_ERROR, {
                debug: event
              });
              deferred.reject(error);
            };
          });

          // Return the promise.
          return deferred.promise;
        });
      },

      /**
       * @augments {Database.count}
       */
      count: function(collection, query, options) {
        // Counting should not take the query sort, limit, and skip into account.
        if(null != query) { // Reset.
          query.sort(null).limit(null).skip(0);
        }

        // Forward to `IDBAdapter.find`, and return the response count.
        return IDBAdapter.find(collection, query, options).then(function(response) {
          return {
            count: response.length
          };
        });
      },

      /**
       * @augments {Database.destroy}
       */
      destroy: function(collection, id /*, options*/ ) {
        // Prepare the response.
        var deferred = Kinvey.Defer.deferred();

        // Obtain the transaction handle.
        IDBAdapter.transaction(collection, true, function(store) {
          // Find and delete the document. If the document could not be found,
          // throw an `ENTITY_NOT_FOUND` error.
          var request = store.transaction;
          var document = store.get(id);
          store['delete'](id);
          request.oncomplete = function() {
            if(null == document.result) {
              return deferred.reject(clientError(Kinvey.Error.ENTITY_NOT_FOUND, {
                description: 'This entity not found in the collection',
                debug: {
                  collection: collection,
                  id: id
                }
              }));
            }
            deferred.resolve({
              count: 1,
              documents: [document.result]
            });
          };
          request.onerror = function(event) {
            var error = clientError(Kinvey.Error.DATABASE_ERROR, {
              debug: event
            });
            deferred.reject(error);
          };
        }, function(error) { // Reject.
          deferred.reject(error);
        });

        // Return the promise.
        return deferred.promise;
      },

      /**
       * @augments {Database.find}
       */
      find: function(collection, query /*, options*/ ) {
        // Prepare the response.
        var deferred = Kinvey.Defer.deferred();

        // Obtain the transaction handle.
        IDBAdapter.transaction(collection, false, function(store) {
          // Retrieve all documents.
          var request = store.openCursor();
          var response = [];
          request.onsuccess = function() {
            var cursor = request.result;
            if(null != cursor) {
              response.push(cursor.value);
              cursor['continue']();
            }
            else {
              deferred.resolve(response);
            }
          };
          request.onerror = function(event) {
            deferred.reject(clientError(Kinvey.DATABASE_ERROR, {
              debug: event
            }));
          };
        }, function(error) {
          // If the error is `COLLECTION_NOT_FOUND`, return the empty set.
          if(Kinvey.Error.COLLECTION_NOT_FOUND === error.name) {
            return deferred.resolve([]);
          }
          return deferred.reject(error);
        });

        // Return the promise.
        return deferred.promise.then(function(response) {
          // Post process the response by applying the query. If there is no query,
          // exit here.
          if(null == query) {
            return response;
          }

          // Filters.
          response = sift(query.toJSON().filter, response);

          // Post process.
          return query._postProcess(response);
        });
      },

      /**
       * @augments {Database.findAndModify}
       */
      findAndModify: function(collection, id, fn /*, options*/ ) {
        // Prepare the response.
        var deferred = Kinvey.Defer.deferred();

        // Obtain the transaction handle.
        IDBAdapter.transaction(collection, true, function(store) {
          var document = null;

          // Obtain and change the document.
          var request = store.get(id);
          request.onsuccess = function() {
            document = fn(request.result || null); // Apply change function.
            store.put(document);
          };

          // Retrieve and save the document in a single transaction. Instead of the
          // `success` event, bind to the `complete` event.
          var txn = store.transaction;
          txn.oncomplete = function() {
            deferred.resolve(document);
          };
          txn.onerror = function(event) {
            var error = clientError(Kinvey.Error.DATABASE_ERROR, {
              debug: event
            });
            deferred.reject(error);
          };
        }, function(error) { // Reject.
          deferred.reject(error);
        });

        // Return the promise.
        return deferred.promise;
      },

      /**
       * @augments {Database.get}
       */
      get: function(collection, id /*, options*/ ) {
        // Prepare the response.
        var deferred = Kinvey.Defer.deferred();

        // Obtain the transaction handle.
        IDBAdapter.transaction(collection, false, function(store) {
          // Retrieve the document.
          var request = store.get(id);
          request.onsuccess = function() {
            if(null != request.result) {
              return deferred.resolve(request.result);
            }
            deferred.reject(clientError(Kinvey.Error.ENTITY_NOT_FOUND, {
              description: 'This entity not found in the collection',
              debug: {
                collection: collection,
                id: id
              }
            }));
          };
          request.onerror = function(event) { // Reject.
            deferred.reject(clientError(Kinvey.Error.DATABASE_ERROR, {
              debug: event
            }));
          };
        }, function(error) { // Reject.
          // If the error is `COLLECTION_NOT_FOUND`, convert to `ENTITY_NOT_FOUND`.
          if(Kinvey.Error.COLLECTION_NOT_FOUND === error.name) {
            error = clientError(Kinvey.Error.ENTITY_NOT_FOUND, {
              description: 'This entity not found in the collection',
              debug: {
                collection: collection,
                id: id
              }
            });
          }
          deferred.reject(error);
        });

        // Return the promise.
        return deferred.promise;
      },

      /**
       * @augments {Database.group}
       */
      group: function(collection, aggregation, options) {
        // Cast arguments. This casts the reduce string to reduce function.
        var reduce = aggregation.reduce.replace(/function[\s\S]*?\([\s\S]*?\)/, '');
        aggregation.reduce = new Function(['doc', 'out'], reduce);

        // Obtain documents subject to aggregation.
        var query = new Kinvey.Query({
          filter: aggregation.condition
        });
        return IDBAdapter.find(collection, query, options).then(function(documents) {
          // Prepare the grouping.
          var groups = {};

          // Segment documents into groups.
          documents.forEach(function(document) {
            // Determine the group the document belongs to.
            // NOTE Dot-separated (nested) fields are not supported.
            var group = {};
            for(var name in aggregation.key) {
              if(aggregation.key.hasOwnProperty(name)) {
                group[name] = document[name];
              }
            }

            // Initialize the group (if not done yet).
            var key = JSON.stringify(group);
            if(null == groups[key]) {
              groups[key] = group;
              for(var attr in aggregation.initial) { // Add initial attributes.
                if(aggregation.initial.hasOwnProperty(attr)) {
                  groups[key][attr] = aggregation.initial[attr];
                }
              }
            }

            // Run the reduce function on the group and document.
            aggregation.reduce(document, groups[key]);
          });

          // Cast the groups to the response.
          var response = [];
          for(var segment in groups) {
            if(groups.hasOwnProperty(segment)) {
              response.push(groups[segment]);
            }
          }
          return response;
        });
      },

      /**
       * @augments {Database.save}
       */
      save: function(collection, document /*, options*/ ) {
        // Cast arguments.
        document._id = document._id || IDBAdapter.objectID();

        // Prepare the response.
        var deferred = Kinvey.Defer.deferred();

        // Obtain the transaction handle.
        IDBAdapter.transaction(collection, true, function(store) {
          // Save the document.
          var request = store.put(document);
          request.onsuccess = function() {
            deferred.resolve(document);
          };
          request.onerror = function(event) {
            var error = clientError(Kinvey.Error.DATABASE_ERROR, {
              debug: event
            });
            deferred.reject(error);
          };
        }, function(error) { // Reject.
          deferred.reject(error);
        });

        // Return the promise.
        return deferred.promise;
      },

      /**
       * @augments {Database.update}
       */
      update: function(collection, document, options) {
        // Forward to `IDBAdapter.save`.
        return IDBAdapter.save(collection, document, options);
      }
    };

    // Use IndexedDB adapter.
    if('undefined' !== typeof IDBAdapter.impl && 'undefined' !== typeof sift) {
      Database.use(IDBAdapter);

      // Add `Kinvey.Query` operators not supported by `sift`.
      ['near', 'regex', 'within'].forEach(function(operator) {
        sift.useOperator(operator, function() {
          throw new Kinvey.Error(operator + ' query operator is not supported locally.');
        });
      });
    }

    // `Kinvey.Social` adapter for performing the OAuth flow.
    var SocialAdapter = {
      /**
       * @augments {Kinvey.Social.oAuth1}
       */
      oAuth1: function(provider, options) {
        // Debug.
        if(KINVEY_DEBUG) {
          log('Obtaining OAuth1.0a credentials for a provider.', arguments);
        }

        // Step 1: obtain a request token.
        return SocialAdapter.requestToken(provider, options).then(function(tokens) {
          // Check for errors.
          if(tokens.error || tokens.denied) {
            var error = clientError(Kinvey.Error.SOCIAL_ERROR, {
              debug: tokens
            });
            return Kinvey.Defer.reject(error);
          }

          // Return the tokens.
          return {
            oauth_token: tokens.oauth_token,
            oauth_token_secret: tokens.oauth_token_secret,
            oauth_verifier: tokens.oauth_verifier
          };
        }).then(function(tokens) {
          // Step 2: convert the request token into an access token.
          return Kinvey.Persistence.Net.create({
            namespace: USERS,
            data: tokens,
            flags: {
              provider: provider,
              step: 'verifyToken'
            },
            auth: Auth.App
          }, options);
        }).then(function(tokens) {
          // Step 3: utilize the access token.
          options._provider = provider; // Hack `Kinvey.User.login`.
          return tokens;
        });
      },

      /**
       * @augments {Kinvey.Social.oAuth2}
       */
      oAuth2: function(provider, options) {
        // Debug.
        if(KINVEY_DEBUG) {
          log('Obtaining OAuth2.0 credentials for a provider.', arguments);
        }

        // Generate a unique token to protect against CSRF.
        options.state = Math.random().toString(36).substr(2);

        // Step 1: obtain an access token.
        return SocialAdapter.requestToken(provider, options).then(function(tokens) {
          var error;

          // The state tokens should match.
          if(tokens.state !== options.state) {
            error = clientError(Kinvey.Error.SOCIAL_ERROR, {
              debug: 'The state parameters did not match (CSRF attack?).'
            });
            return Kinvey.Defer.reject(error);
          }

          // Check for errors.
          if(tokens.error) {
            error = clientError(Kinvey.Error.SOCIAL_ERROR, {
              debug: tokens
            });
            return Kinvey.Defer.reject(error);
          }

          // Return the tokens.
          return {
            access_token: tokens.access_token,
            expires_in: tokens.expires_in
          };
        });
      },

      /**
       * Obtains a request token.
       *
       * @param {string} provider The provider.
       * @param {Options} options Options.
       * @returns {Promise} The response and tokens.
       */
      requestToken: function(provider, options) {
        // Open the login dialog. This step consist of getting the dialog url,
        // after which the dialog is opened.
        var redirect = options.redirect || root.location.toString();
        return Kinvey.Persistence.Net.create({
          namespace: USERS,
          data: {
            redirect: redirect,
            state: options.state
          },
          flags: {
            provider: provider,
            step: 'requestToken'
          },
          auth: Auth.App
        }, options).then(function(response) {
          // Obtain the tokens from the login dialog.
          var deferred = Kinvey.Defer.deferred();

          // Open the dialog. Once the popup returns to the redirect url, we can
          // access it.
          var popup = root.open(response.url, 'KinveyOAuth2');

          // Popup management.
          var elapsed = 0; // Time elapsed since opening the popup.
          var interval = 100; //100 ms.
          var timer = root.setInterval(function() {
            var error;

            // The popup closed unexpectedly.
            if(null == popup.location) {
              root.clearTimeout(timer); // Stop listening.

              // Return the response.
              error = clientError(Kinvey.Error.SOCIAL_ERROR, {
                debug: 'The popup was closed unexpectedly.'
              });
              deferred.reject(error);
            }

            // The user waited too long to reply to the authorization request.
            else if(options.timeout && elapsed > options.timeout) { // Timeout.
              root.clearTimeout(timer); // Stop listening.
              popup.close();

              // Return the response.
              error = clientError(Kinvey.Error.SOCIAL_ERROR, {
                debug: 'The user waited too long to reply to the authorization request.'
              });
              deferred.reject(error);
            }

            // If `popup.location.host`, the popup was redirected back.
            else if(popup.location.host) {
              root.clearTimeout(timer); // Stop listening.
              popup.close();

              // Extract tokens from the url.
              var location = popup.location;
              var tokenString = location.search.substring(1) + '&' + location.hash.substring(1);
              var tokens = SocialAdapter.tokenize(tokenString);
              if(null != response.oauth_token_secret) { // OAuth 1.0a.
                tokens.oauth_token_secret = response.oauth_token_secret;
              }

              deferred.resolve(tokens);
            }

            // Update elapsed time.
            elapsed += interval;
          }, interval);

          // Return the promise.
          return deferred.promise;
        });
      },

      /**
       * Tokenizes a string.
       *
       * @example foo=bar&baz=qux -> { foo: "bar", baz: "qux" }
       * @param {string} string The token string.
       * @returns {Object} The tokens.
       */
      tokenize: function(string) {
        var tokens = {};
        string.split('&').forEach(function(pair) {
          var segments = pair.split('=', 2).map(root.decodeURIComponent);
          if(segments[0]) {
            tokens[segments[0]] = segments[1];
          }
        });
        return tokens;
      }
    };

    // Use the browser adapter.
    Kinvey.Social.use(SocialAdapter);

    /* global localStorage: true */

    // `Storage` adapter for
    // [localStorage](http://www.w3.org/TR/webstorage/#the-localstorage-attribute).
    if('undefined' !== typeof localStorage) {
      var localStorageAdapter = {
        /**
         * @augments {Storage._destroy}
         */
        _destroy: function(key) {
          localStorage.removeItem(key);
          return Kinvey.Defer.resolve(null);
        },

        /**
         * @augments {Storage._get}
         */
        _get: function(key) {
          var value = localStorage.getItem(key);
          return Kinvey.Defer.resolve(value ? JSON.parse(value) : null);
        },

        /**
         * @augments {Storage._save}
         */
        _save: function(key, value) {
          localStorage.setItem(key, JSON.stringify(value));
          return Kinvey.Defer.resolve(null);
        }
      };

      // Use `localStorage` adapter.
      Storage.use(localStorageAdapter);
    }

    /* global _: true, Backbone: true, jQuery: true */

    // Backbone.
    // ---------

    // All Backbone shim functionality will be appended to `Kinvey.Backbone`.

    /**
     * @namespace
     */
    Kinvey.Backbone = {};

    /**
     * Returns the active user as `Kinvey.Backbone.User` instance.
     *
     * @returns {?Kinvey.Backbone.User} The user model, or `null` if there is no
     *            active user.
     */
    Kinvey.Backbone.getActiveUser = function() {
      var user = Kinvey.getActiveUser();
      return null !== user ? new Kinvey.Backbone.User(user) : null;
    };

    // Error-handling.
    // ---------------

    // Backbone errors.
    Kinvey.Error.NOT_LOGGED_IN = 'NotLoggedIn';

    /**
     * Not logged in.
     *
     * @constant
     * @type {Object}
     * @default
     */
    ClientError[Kinvey.Error.NOT_LOGGED_IN] = {
      name: Kinvey.Error.NOT_LOGGED_IN,
      description: 'This user is not logged in.',
      debug: ''
    };

    // Utils.
    // ------

    // Define the Sync mixin.
    var SyncMixin = {
      /**
       * Invokes the persistence layer.
       * http://backbonejs.org/#Sync
       *
       * @returns {Promise} The response.
       */
      sync: function() {
        return Kinvey.Backbone.Sync.apply(this, arguments);
      }
    };

    // Helper function to wrap the optional callbacks with a default success and
    // error callback.
    var backboneWrapCallbacks = function(model, options, mutate) {
      // Cast arguments.
      mutate = 'undefined' === typeof mutate ? true : mutate;

      // Extend the success callback.
      var success = options.success;
      options.success = function(response) {
        // If `mutate`, update the model.
        if(mutate) {
          if(model instanceof Backbone.Model) {
            if(!model.set(model.parse(response, options), options)) {
              return false;
            }
          }
          else { // Update the collection.
            var method = options.reset ? 'reset' : 'set';
            model[method](response, options);
          }
        }

        // Invoke the application-level success handler.
        if(success) {
          success(model, response, options);
        }

        // Trigger the `sync` event.
        if(mutate) {
          model.trigger('sync', model, response, options);
        }
      };

      // Extend the error callback.
      var error = options.error;
      options.error = function(response) {
        // Invoke the application-level error handler.
        if(error) {
          error(model, response, options);
        }

        // Trigger the `error` event.
        if(mutate) {
          model.trigger('error', model, response, options);
        }
      };
    };

    // Deferreds.
    // ----------

    // Helper function to translate a `Kinvey.Defer` to a Backbone compatible
    // promise. This helper is necessary because jQuery “promises” are
    // [not really](http://domenic.me/2012/10/14/youre-missing-the-point-of-promises/)
    // promises. If Backbone relies on Zepto, return the Kinvey promise as Zepto
    // does not have the concept of deferreds.
    var kinveyToBackbonePromise = function(kinveyPromise, options) {
      // Backbone expects multiple arguments as part of the resolve or reject
      // handler. Add these here.
      var promise = kinveyPromise.then(function(value) {
        var args = options.xhr ? [options.xhr.statusText, options.xhr] : [];
        return [value].concat(args);
      }, function(reason) {
        var args = options.xhr ? [options.xhr.statusText, options.xhr] : [null, null];
        return Kinvey.Defer.reject(args.concat([reason]));
      });

      // If Backbone does not rely on jQuery, return the Kinvey promise.
      if('undefined' === typeof jQuery || 'undefined' === typeof jQuery.Deferred) {
        return promise;
      }

      // Convert the Kinvey promise into a jQuery deferred and return it.
      var deferred = jQuery.Deferred();
      promise.then(function(args) {
        deferred.resolve.apply(deferred, args);
      }, function(args) {
        deferred.reject.apply(deferred, args);
      });
      return deferred.promise();
    };

    // Data Store.
    // -----------

    // Expose a `Kinvey.Backbone` model and collection mixin which can be used to
    // extend Backbone’s model and collection. Mixins follow the
    // [mixin](http://ricostacruz.com/backbone-patterns/#mixins) pattern.

    // Define the model mixin. It preseeds the models’ `id`, as well as its `sync`
    // function.

    /**
     * @namespace
     */
    Kinvey.Backbone.ModelMixin = _.extend({}, SyncMixin, {
      /**
       * The models’ unique key.
       * http://backbonejs.org/#Model-idAttribute
       *
       * @property {string}
       */
      idAttribute: '_id',

      /**
       * List of the models’ relations.
       *
       * @property {Array}
       */
      relations: []
    });

    // Define the collection mixin. It preseeds the `sync`, and adds the
    // aggregation and query related methods.

    /**
     * @namespace
     */
    Kinvey.Backbone.CollectionMixin = _.extend({}, SyncMixin, {
      /**
       * The collections’ query, applied to the clean and fetch methods.
       *
       * @property {Kinvey.Query}
       */
      query: null,

      /**
       * Cleans the collection.
       *
       * @param {Object} [options] Options.
       * @returns {Promise} The response, status, and xhr objects.
       */
      clean: function(options) {
        // Cast arguments.
        options = options ? _.clone(options) : {};
        options.parse = 'undefined' === typeof options.parse ? true : options.parse;
        backboneWrapCallbacks(this, options);

        // Invoke the persistence layer.
        return this.sync('delete', this, options);
      },

      /**
       * Counts the number of documents in the collection.
       *
       * @param {Object} options Options.
       * @returns {Promise} The response, status, and xhr objects.
       */
      count: function(options) {
        // Cast arguments.
        options = _.clone(options) || {};
        options.subject = this; // Used by the persistence layer.
        backboneWrapCallbacks(this, options, false);

        // Prepare the response.
        var collection = _.result(this, 'url');
        var query = options.query || this.query;
        var promise;
        if(USERS === collection) {
          promise = Kinvey.User.count(query, options);
        }
        else {
          promise = Kinvey.DataStore.count(collection, query, options);
        }

        // Return the response.
        return kinveyToBackbonePromise(promise, options);
      },

      /**
       * Performs a group operation.
       *
       * @param {Kinvey.Aggregation} aggregation The aggregation.
       * @param {Object} options Options.
       * @returns {Promise} The response, status, and xhr objects.
       */
      group: function(aggregation, options) {
        // Cast arguments.
        options = _.clone(options) || {};
        options.subject = this; // Used by the persistence layer.
        backboneWrapCallbacks(this, options, false);

        // Apply query.
        var query = options.query || this.query;
        if(null != query) {
          aggregation.query(query);
        }

        // Prepare the response.
        var collection = _.result(this, 'url');
        var promise;
        if(USERS === collection) {
          promise = Kinvey.User.group(aggregation, options);
        }
        else {
          promise = Kinvey.DataStore.group(collection, aggregation, options);
        }

        // Return the response.
        return kinveyToBackbonePromise(promise, options);
      }
    });

    // Metadata.
    // ---------

    // The `Kinvey.Metadata` methods are mixed into Backbone models. To maintain
    // the correct context, keep a `_metadata` property. Internally, the metadata
    // (and ACL) operate on the models `attributes` property.
    // NOTE Modifying the metadata (including the ACL) won’t emit `change` events.

    // Helper function to lazy-initialize the metadata instance.
    var backboneWrapMetadata = function(fn) {
      return function() {
        if(null === this._metadata) {
          this._metadata = new Kinvey.Metadata(this.attributes);
        }
        return fn.apply(this._metadata, arguments);
      };
    };

    // Extend the mixin with the metadata functionality.
    _.extend(Kinvey.Backbone.ModelMixin, {
      // The email verification metadata method is added in
      // `Kinvey.Backbone.UserMixin`.

      /**
       * The models’ metadata.
       *
       * @private
       * @property {Kinvey.Metadata}
       */
      _metadata: null,

      /**
       * Returns the models’ ACL.
       *
       * @returns {Kinvey.Acl}
       */
      getAcl: backboneWrapMetadata(Kinvey.Metadata.prototype.getAcl),

      /**
       * Returns the date when the entity was created.
       *
       * @returns {?Date} Created at date, or `null` if not set.
       */
      getCreatedAt: backboneWrapMetadata(Kinvey.Metadata.prototype.getCreatedAt),

      /**
       * Returns the date when the entity was last modified.
       *
       * @returns {?Date} Last modified date, or `null` if not set.
       */
      getLastModified: backboneWrapMetadata(Kinvey.Metadata.prototype.getLastModified),

      /**
       * Sets the models’ ACL.
       *
       * @param {Kinvey.Acl} The acl.
       * @returns {Backbone.Model} The model.
       */
      setAcl: function() {
        backboneWrapMetadata(Kinvey.Metadata.prototype.setAcl).apply(this, arguments);
        return this;
      }
    });

    // Users.
    // ------

    // Expose a `Kinvey.Backbone` user model and user collection mixin can be used
    // to extend Backbone’s model and collection.

    // Define the general user mixin. It preseeds the `url`.
    var UserMixin = {
      /**
       * The models’ resource location.
       * http://backbonejs.org/#Model-url
       *
       * @property {string}
       */
      url: USERS
    };

    // Define the user model and collection mixins.

    /**
     * @namespace
     */
    Kinvey.Backbone.UserMixin = _.extend({}, Kinvey.Backbone.ModelMixin, UserMixin, {
      /**
       * Links a social identity to the user.
       *
       * @param {string} provider The provider.
       * @param {Object} [options] Options.
       * @returns {Promise} The model, response, and options objects.
       */
      connect: function(provider, options) {
        // Cast arguments.
        options = options ? _.clone(options) : {};
        options.parse = 'undefined' === typeof options.parse ? true : options.parse;
        options.subject = this; // Used by the persistence layer.
        backboneWrapCallbacks(this, options);

        // Return the response.
        var promise = Kinvey.Social.connect(this.attributes, provider, options);
        return kinveyToBackbonePromise(promise, options);
      },

      /**
       * Removes a social identity from the user.
       */
      disconnect: function(provider, options) {
        // Cast arguments.
        options = options ? _.clone(options) : {};
        options.parse = 'undefined' === typeof options.parse ? true : options.parse;
        options.subject = this; // Used by the persistence layer.
        backboneWrapCallbacks(this, options);

        // Return the response.
        var promise = Kinvey.Social.disconnect(this.attributes, provider, options);
        return kinveyToBackbonePromise(promise, options);
      },

      /**
       * Returns the email verification status.
       *
       * @returns {?Object} The email verification status, or `null` if not set.
       */
      getEmailVerification: backboneWrapMetadata(Kinvey.Metadata.prototype.getEmailVerification),

      /**
       * Returns whether the user is logged in.
       *
       * @returns {boolean}
       */
      isLoggedIn: function() {
        var user = Kinvey.getActiveUser();
        if(null !== user) {
          var kmd = this.get('_kmd');
          return null != kmd && kmd.authtoken === user._kmd.authtoken;
        }
        return false;
      },

      /**
       * Logs in an existing user.
       *
       * @param {Object|string} usernameOrData Username, or user data.
       * @param {string} [password] Password.
       * @param {Object} [options] Options.
       * @returns {Promise} The model, response, and options objects.
       */
      login: function(usernameOrData, password, options) {
        // Cast arguments.
        options = options ? _.clone(options) : {};
        options.parse = 'undefined' === typeof options.parse ? true : options.parse;
        options.subject = this; // Used by the persistence layer.
        backboneWrapCallbacks(this, options);

        // Return the response.
        var promise = Kinvey.User.login(usernameOrData, password, options);
        return kinveyToBackbonePromise(promise, options);
      },

      /**
       * Logs out the user.
       *
       * @param {Object} [options] Options.
       * @returns {Promise} The model, response, and options objects.
       */
      logout: function(options) {
        // Cast arguments.
        options = options ? _.clone(options) : {};
        options.parse = 'undefined' === typeof options.parse ? true : options.parse;
        options.subject = this; // Used by the persistence layer.
        backboneWrapCallbacks(this, options);

        // Validate preconditions.
        var promise;
        if(!this.isLoggedIn()) {
          var error = clientError(Kinvey.Error.NOT_LOGGED_IN);
          promise = Kinvey.Defer.reject(error);
          wrapCallbacks(promise, options);
        }
        else {
          promise = Kinvey.User.logout(options);
        }

        // Return the response.
        return kinveyToBackbonePromise(promise, options);
      },

      /**
       * Retrieves information on the user.
       *
       * @param {Options} [options] Options.
       * @returns {Promise} The model, response, and options objects.
       */
      me: function(options) {
        // Cast arguments.
        options = options ? _.clone(options) : {};
        options.parse = 'undefined' === typeof options.parse ? true : options.parse;
        options.subject = this; // Used by the persistence layer.
        backboneWrapCallbacks(this, options);

        // Validate preconditions.
        var promise;
        if(!this.isLoggedIn()) {
          var error = clientError(Kinvey.Error.NOT_LOGGED_IN);
          promise = Kinvey.Defer.reject(error);
          wrapCallbacks(promise, options);
        }
        else {
          promise = Kinvey.User.me(options);
        }

        // Return the response.
        return kinveyToBackbonePromise(promise, options);
      }
    });

    /**
     * @namespace
     */
    Kinvey.Backbone.StaticUserMixin = {
      /**
       * Requests e-mail verification for a user.
       *
       * @param {string} username Username.
       * @param {Options} [options] Options.
       * @returns {Promise} The response, status, and xhr objects.
       */
      verifyEmail: function(username, options) {
        // Cast arguments.
        options = options || {};

        // Return the response.
        var promise = Kinvey.User.verifyEmail(username, options);
        return kinveyToBackbonePromise(promise, options);
      },

      /**
       * Requests a username reminder for a user.
       *
       * @param {string} email E-mail.
       * @param {Options} [options] Options.
       * @returns {Promise} The response, status, and xhr objects.
       */
      forgotUsername: function(email, options) {
        // Cast arguments.
        options = options || {};

        // Return the response.
        var promise = Kinvey.User.forgotUsername(email, options);
        return kinveyToBackbonePromise(promise, options);
      },

      /**
       * Requests a password reset for a user.
       *
       * @param {string} username Username.
       * @param {Options} [options] Options.
       * @returns {Promise} The response, status, and xhr objects.
       */
      resetPassword: function(username, options) {
        // Cast arguments.
        options = options || {};

        // Return the response.
        var promise = Kinvey.User.resetPassword(username, options);
        return kinveyToBackbonePromise(promise, options);
      },

      /**
       * Checks whether a username exists.
       *
       * @param {string} username Username to check.
       * @param {Options} [options] Options.
       * @returns {Promise} The response, status, and xhr objects.
       */
      exists: function(username, options) {
        // Cast arguments.
        options = options || {};

        // Return the response.
        var promise = Kinvey.User.exists(username, options);
        return kinveyToBackbonePromise(promise, options);
      },

      /**
       * Restores a previously disabled user.
       *
       * @param {string} id User id.
       * @param {Options} [options] Options.
       * @returns {Promise} The response, status, and xhr objects.
       */
      restore: function(id, options) {
        // Cast arguments.
        options = options || {};

        // Return the response.
        var promise = Kinvey.User.restore(id, options);
        return kinveyToBackbonePromise(promise, options);
      }
    };

    /**
     * @namespace
     */
    Kinvey.Backbone.UserCollectionMixin = _.extend(
      _.omit(Kinvey.Backbone.CollectionMixin, 'clean'), // Users cannot be cleaned.
    UserMixin);

    // Persistence.
    // ------------

    // The `Kinvey.Backbone.Sync` method translates a Backbone CRUD method to
    // either a `Kinvey.DataStore` or `Kinvey.User` method.

    /**
     * Returns an object containing all (nested) relations of the specified model.
     *
     * @param {string} mode The mode, read or write.
     * @param {Backbone.Model} model The model.
     * @throws {Kinvey.Error} collection or relatedModel must be set on the
     *           relation.
     * @returns {Object} The relations to in- and exclude.
     */
    var backboneRelations = function(mode, model) {
      // Prepare the response.
      var exclude = [];
      var relations = {};

      // The exclude property to check.
      var prop = 'read' === mode ? 'autoFetch' : 'autoSave';

      // Helper function to add relations to the stack.
      var stack = [];
      var addToStack = function(relations, depth, prefix) {
        relations.forEach(function(relation) {
          stack.push({
            relation: relation,
            depth: depth || 0,
            prefix: prefix || null
          });
        });
      };
      addToStack(model.relations || []);

      // Traverse the stack and add the relations to the response.
      var item;
      while(null != (item = stack.shift())) {
        var depth = item.depth;
        var prefix = item.prefix;
        var relation = item.relation;

        // Include relations up to 10 levels deep.
        if(10 === depth) {
          continue;
        }

        // Obtain the relations’ prototype (if any).
        var relatedModel = null;
        if(relation.relatedModel) {
          // `relatedModel` is either a string resolving to a global scope object,
          // or a reference to a `Backbone.AssociatedModel` class.
          relatedModel = (root[relation.relatedModel] || relation.relatedModel).prototype;
        }

        // Obtain, validate, and cast the collection.
        var collection = relation.collection || _.result(relatedModel, 'url');
        if(null == collection) {
          throw new Kinvey.Error('collection or relatedModel must be set on the relation.');
        }
        if(0 === collection.indexOf('/')) { // Strip the leading slash (if any).
          collection = collection.substr(1);
        }

        // Add the relation.
        var key = null !== prefix ? prefix + '.' + relation.key : relation.key;
        relations[key] = collection;
        if(false === relation[prop]) {
          exclude.push(key);
        }

        // Add any nested relations to the stack.
        if(false !== relation[prop] && null != relatedModel && !isEmpty(relatedModel.relations)) {
          addToStack(relatedModel.relations, depth + 1, key);
        }
      }

      // Return the response.
      return {
        exclude: exclude,
        relations: relations
      };
    };

    /**
     * Translates and invokes a Kinvey method from a Backbone CRUD method.
     *
     * @param {string} method The CRUD method.
     * @param {string} collection The collection.
     * @param {?string} id The document id (if any).
     * @param {?Object} document The document (if any).
     * @param {Object} options Options.
     * @throws {Kinvey.Error} `id` must not be null.
     * @returns {Promise} The response.
     */
    var backboneToKinveyCRUD = function(method, collection, id, data, options) {
      // Cast arguments. An explicit `id` should override `data._id`.
      if(null != id && isObject(data)) {
        data._id = id;
      }

      // Use a query if `id` and `data` is not a document.
      var query = null == id && (!isObject(data) || isArray(data));

      // Translate Backbone methods to Kinvey methods.
      var namespace = USERS === collection ? Kinvey.User : Kinvey.DataStore;
      var methodMap = {
        create: namespace[USERS === collection ? 'create' : 'save'],
        read: query ? namespace.find : namespace.get,
        update: namespace.update,
        'delete': query ? namespace.clean : namespace.destroy
      };

      // Build arguments. Both `Kinvey.DataStore` and `Kinvey.User` expect the
      // document id or data, together with `options`. `Kinvey.DataStore`, however,
      // requires an initial collection argument.
      var args = [
        query ? options.query : ('read' === method || 'delete' === method ? id : data),
        options
      ];
      if(USERS !== collection) {
        args.unshift(collection);
      }

      // Invoke the Kinvey method.
      return methodMap[method].apply(namespace, args);
    };

    /**
     * Persist a Backbone model to the Kinvey backend.
     *
     * @param {string} method The CRUD method.
     * @param {Object} model The model to be saved, or the collection to be read.
     * @param {Object} options Callbacks, and request options.
     * @throws {Kinvey.Error} `model` or `options` must contain: url.
     * @returns {Promise} The response.
     */
    Kinvey.Backbone.Sync = function(method, model, options) {
      // Cast and validate arguments.
      options.query = options.query || model.query; // Attach a (optional) query.
      options.subject = model; // Used by the persistence layer.

      // Extend the success handler to translate `silentFail` to silent when
      // executing inside the Kinvey core.
      var silent = options.silent;
      var success = options.success;
      options.silent = options.silentFail || false;
      options.success = function(response) {
        options.silent = silent; // Reset.

        // Invoke the application-level success handler.
        if(success) {
          success(response);
        }
      };

      // Obtain the url and document data.
      var data = options.attrs || model.toJSON(options);
      var url = options.url || _.result(model, 'url');
      if(null == url) {
        throw new Kinvey.Error('model or options argument must contain: url.');
      }

      // Strip the leading slash (if any).
      if(0 === url.indexOf('/')) {
        url = url.substr(1);
      }

      // Extract the collection and document id from the url.
      var segments = url.split('/');
      var collection = segments[0];
      var id = segments[1] || data._id || null;

      // Add support for references for both collections and models.
      var relations = this.model ? this.model.prototype.relations : this.relations;
      if(!isEmpty(relations)) {
        var mode = 'read' === method ? 'read' : 'write';
        relations = backboneRelations(mode, this.model ? this.model.prototype : this);
        options.exclude = relations.exclude;
        options.relations = relations.relations;
      }

      // Translate to `Kinvey` core function call and return the response.
      var promise = backboneToKinveyCRUD(method, collection, id, data, options);
      return kinveyToBackbonePromise(promise, options);
    };

    /* jshint browser: true */

    // `Kinvey.Persistence.Net` adapter for
    // [Backbone.ajax](http://backbonejs.org/#Sync-ajax).
    var BackboneAjax = {
      /**
       * The device information string.
       *
       * @property {string}
       */
      deviceInformation: (function() {
        // Try the most common browsers.
        var ua = navigator.userAgent.toLowerCase();

        // User-Agent patterns.
        var rChrome = /(chrome)\/([\w]+)/;
        var rFirefox = /(firefox)\/([\w.]+)/;
        var rIE = /(msie) ([\w.]+)/i;
        var rOpera = /(opera)(?:.*version)?[ \/]([\w.]+)/;
        var rSafari = /(safari)\/([\w.]+)/;

        var browser = rChrome.exec(ua) || rFirefox.exec(ua) || rIE.exec(ua) ||
          rOpera.exec(ua) || rSafari.exec(ua) || [];

        // Build device information.
        return [
          'js-backbone/1.0.0dev', (navigator.platform || 'unknown').replace(' ', '_').toLowerCase(), // OS.
        browser[1] || 'unknown', // Browser name.
        browser[2] || 'unknown', // Browser version.
        0 // Device ID.
        ].join(' ');
      }()),

      /**
       * @augments {Kinvey.Persistence.Net.request}
       */
      base64: function(value) {
        return btoa(value);
      },

      /**
       * @augments {Kinvey.Persistence.Net.encode}
       */
      encode: encodeURIComponent,

      /**
       * @augments {Kinvey.Persistence.Net.info}
       */
      info: function() {
        return BackboneAjax.deviceInformation;
      },

      /**
       * @augments {Kinvey.Persistence.Net.request}
       */
      request: function(method, url, headers, body, options) {
        // Cast arguments.
        headers = headers || {};
        options = options || {};

        // Append header for compatibility with Android 2.2, 2.3.3, and 3.2.
        // http://www.kinvey.com/blog/item/179-how-to-build-a-service-that-supports-every-android-browser
        if('GET' === method && null != root.location && null != root.location.protocol) {
          headers['X-Kinvey-Origin'] = root.location.protocol + '//' + root.location.host;
        }

        // Prepare the response.
        var deferred = Kinvey.Defer.deferred();

        // Listen for request completion.
        var complete = function(request, textStatus) {
          // Parse response.
          // NOTE request.responseJSON is not available in jQuery < 2.0 nor Zepto.
          var response = request.responseText || null;
          try { // Most likely, response is formatted as JSON.
            response = JSON.parse(response);
          }
          catch(e) {}

          // Success implicates 2xx (Successful), or 304 (Not Modified).
          var status = request.status;
          if(2 === parseInt(status / 100, 10) || 304 === status) {
            // Debug.
            if(KINVEY_DEBUG) {
              log('The network request terminated successfully.', status, response);
            }

            // Resolve the promise.
            deferred.resolve(response);
          }
          else {
            // Format the response as client-side error object.
            if(null != response && null != response.error) { // Server-side error.
              response = {
                name: response.error,
                description: response.description || '',
                debug: response.debug || ''
              };
            }
            else { // Client-side error.
              var dict = { // Dictionary for common errors.
                abort: Kinvey.Error.REQUEST_ABORT_ERROR,
                error: Kinvey.Error.REQUEST_ERROR,
                timeout: Kinvey.Error.REQUEST_TIMEOUT_ERROR
              };
              var error = dict[textStatus] || dict.error;

              // Translate common error into a client-error. Set `debug` property
              // to the response, or the request if the response is empty.
              response = clientError(error, {
                debug: response || request
              });
            }

            // Debug.
            if(KINVEY_DEBUG) {
              log('The network request failed.', textStatus, response);
            }

            // Reject the promise.
            deferred.reject(response);
          }
        };

        // Debug.
        if(KINVEY_DEBUG) {
          log('Initiating a network request.', method, url, body, headers);
        }

        // Initiate the request.
        var xhr = options.xhr = Backbone.ajax({
          complete: complete,
          crossDomain: false, // Kinvey has full CORS support, so this is fine.
          data: body ? JSON.stringify(body) : null,
          dataType: 'json',
          headers: headers,
          processData: false,
          timeout: options.timeout,
          type: method,
          url: url,
          beforeSend: function() {
            if(options.beforeSend) { // Invoke the application-level handler.
              return options.beforeSend.apply(this, arguments);
            }
          }
        });

        // Trigger the `request` event on the subject. The subject should be a
        // Backbone model or collection.
        if(null != options.subject) {
          // Remove `options.subject`.
          var subject = options.subject;
          delete options.subject;

          // Trigger the `request` event if the subject has a `trigger` method.
          if(isFunction(subject.trigger)) {
            subject.trigger('request', subject, xhr, options);
          }
        }

        // Return the response.
        return deferred.promise;
      }
    };

    // Use Backbone adapter.
    if('undefined' !== typeof Backbone) {
      Kinvey.Persistence.Net.use(BackboneAjax);
    }

    // Export.

    // Extend Backbone model and collection to provide built-in models and
    // collections for entities and users. Even though the user model and
    // collection are close to the entity model and collection mixins, no
    // no inheritance is applied:
    // Kinvey.Backbone.User is not an instance of Kinvey.Backbone.Model.

    // By default, extend `Backbone.Model`. However, for better integration with
    // references, use `Backbone.AssociatedModel` instead if it is available.
    var backboneModel;
    if('undefined' !== typeof Backbone.AssociatedModel) {
      backboneModel = Backbone.AssociatedModel;
    }
    else {
      backboneModel = Backbone.Model;
    }

    // Define the `Kinvey.Backbone` classes.

    /**
     * The Kinvey.Backbone.Model class.
     *
     * @class
     */
    Kinvey.Backbone.Model = backboneModel.extend(Kinvey.Backbone.ModelMixin);

    /**
     * The Kinvey.Backbone.Collection class.
     *
     * @class
     */
    Kinvey.Backbone.Collection = Backbone.Collection.extend(
    // The mixin does not have access to the parent class, therefore the
    // functionality below is only available on `Kinvey.Backbone.Collection`.
    _.extend({}, Kinvey.Backbone.CollectionMixin, {
      /**
       * The model class that the collection contains.
       * http://backbonejs.org/#Collection-model
       *
       * @property {Kinvey.Backbone.Model}
       */
      model: Kinvey.Backbone.Model,

      /**
       * Initializes the collection.
       * http://backbonejs.org/#Collection-constructor
       *
       * @param {Array} [models] List of models.
       * @param {Object} [options] Options.
       * @param {Kinvey.Query} [options.query] The collection query.
       * @throws {Kinvey.Error} `options.query` must be of type: `Kinvey.Query`.
       */
      initialize: function(models, options) {
        // Call parent.
        var result = Backbone.Collection.prototype.initialize.apply(this, arguments);

        // Cast arguments.
        options = options || {};

        // Validate arguments.
        if(null != options.query && !(options.query instanceof Kinvey.Query)) {
          throw new Kinvey.Error('options.query argument must be of type: Kinvey.Query.');
        }
        this.query = options.query || null;

        // Return the parent’s response.
        return result;
      }
    }));


    // Define the `Kinvey.Backbone` classes.

    /**
     * The Kinvey.Backbone.User class.
     *
     * @class
     */
    Kinvey.Backbone.User = backboneModel.extend(
      Kinvey.Backbone.UserMixin, // Class properties.
    Kinvey.Backbone.StaticUserMixin // Static properties.
    );

    /**
     * The Kinvey.Backbone.UserCollection class.
     *
     * @class
     */
    Kinvey.Backbone.UserCollection = Backbone.Collection.extend(
    // The mixin does not have access to the parent class, therefore the
    // functionality below is only available on `Kinvey.Backbone.UserCollection`.
    _.extend({}, Kinvey.Backbone.UserCollectionMixin, {
      /**
       * The model class that the collection contains.
       * http://backbonejs.org/#Collection-model
       *
       * @property {Kinvey.Backbone.User}
       */
      model: Kinvey.Backbone.User,

      /**
       * Initializes the collection.
       * http://backbonejs.org/#Collection-constructor
       * NOTE `initialize` is identical for both the entity and user collection.
       *
       * @param {Array} [models] List of users.
       * @param {Object} [options] Options.
       * @param {Kinvey.Query} [options.query] The collection query.
       * @throws {Kinvey.Error} `options.query` must be of type: `Kinvey.Query`.
       */
      initialize: Kinvey.Backbone.Collection.prototype.initialize
    }));

    // Return the copy.
    return Kinvey;
  };

  // Exports.
  // --------

  // The top-level namespace, which is a copy of the library namespace.
  // Exported for the server, as AMD module, and for the browser.
  var Kinvey = kinveyFn();
  if('object' === typeof module && 'object' === typeof module.exports) {
    module.exports = Kinvey;
  }
  else if('function' === typeof define && define.amd) {
    define('Kinvey', [], function() {
      return Kinvey;
    });
  }
  else {
    root.Kinvey = Kinvey;
  }

}.call(this));
