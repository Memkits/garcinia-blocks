import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
assert.equal(process.env.GITHUB_ACTIONS,'true');assert.equal(process.platform,'linux');
assert.equal(execFileSync('calcit',['-v'],{encoding:'utf8'}).trim(),'0.30.1');
const run=(...a)=>execFileSync('calcit',['calcit.cirru',...a],{encoding:'utf8',maxBuffer:48e6,stdio:['ignore','pipe','pipe']});
const blob=()=>execFileSync('git',['hash-object','calcit.cirru'],{encoding:'utf8'}).trim();
assert.equal(blob(),'1e55be866c87170b325fdf031c040a6cb6b9ccc6');
const norm=v=>Array.isArray(v)?v.map(norm):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).map(([k,x])=>[k,k==='__edn_set'?x.map(norm).sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b))):norm(x)])):v;
const q=(...a)=>norm(JSON.parse(run('query',...a,'--format','json')).data);
const input=JSON.parse(readFileSync('reviewed.json','utf8'));
const before={config:norm(input.config.data),namespaces:input.namespaces.map(x=>norm(x.data)),defs:input.definitions.map(x=>norm(x.data))};
assert.equal(before.defs.length,16);assert.equal(before.defs.reduce((n,d)=>n+d.tests.length+d.examples.length,0),0);
assert.deepEqual(q('config'),before.config);assert.deepEqual(q('ns').namespaces.map(n=>q('ns',n)),before.namespaces);
for(const d of before.defs)assert.deepEqual(q('def',d.id),d);
const expected=structuredClone(before),ops=[],sites=[],counts={merge:0,unwrapOr:0,unwrap:0,watcher:0,hostEvent:0};
const show=(id,path)=>JSON.parse(run('tree','show',id,'--path','@'+path.join('.'),'--format','json')).tree;
const replace=(id,path,value)=>ops.push(['tree','replace',id,'--path','@'+path.join('.'),'--input-format','json-ast','--code',JSON.stringify(value)]);
const map=['::',"'Map","'Tag","'Dynamic"];
const watcherHint=['hint-fn',['{}',[':return',"'Unit"],[':args',['[]',map,map]]]];
const eventHint=['hint-fn',['{}',[':return',"'Unit"],[':args',['[]',"'js-ffi.browser/EventHost"]]]];
function walk(x,path,id){
  if(!Array.isArray(x)||['quote','quasiquote','comment',';','defmacro'].includes(x[0]))return x;
  const original=structuredClone(x);
  if(['merge','option:unwrap-or','option:unwrap'].includes(x[0])){
    assert.deepEqual(show(id,path),original);const old=x[0],next={merge:'.merge','option:unwrap-or':'.unwrap-or','option:unwrap':'.unwrap'}[old];replace(id,[...path,0],next);x[0]=next;
    counts[old==='merge'?'merge':old==='option:unwrap-or'?'unwrapOr':'unwrap']++;sites.push({id,path,original,replacement:next});
  }
  x=x.map((v,i)=>walk(v,[...path,i],id));
  let callback,hint,kind,index;
  if(x[0]==='add-watch!'){
    assert.ok(['app.main/main!','app.main/reload!'].includes(id));assert.equal(x[1],'*reel');assert.equal(x[2],':changes');index=3;callback=x[index];hint=watcherHint;kind='watcher';assert.deepEqual(callback[2],['render-app!']);
  }else if(x[0]==='add-event-listener!'){
    assert.equal(id,'app.main/main!');assert.equal(x[1],'|beforeunload');index=2;callback=x[index];hint=eventHint;kind='hostEvent';assert.deepEqual(callback[2],['persist-storage!']);
  }
  if(callback){
    assert.equal(callback[0],'fn');assert.equal(callback.length,3);assert.deepEqual(show(id,[...path,index]),original[index]);
    const p=[...path,index,2];ops.push(['tree','insert',id,'--path','@'+p.join('.'),'--at','before','--input-format','json-ast','--code',JSON.stringify(hint)]);callback.splice(2,0,structuredClone(hint));counts[kind]++;sites.push({id,path:p,inserted:hint});
  }
  return x;
}
for(const d of expected.defs)d.code=walk(d.code,[],d.id);
assert.deepEqual(counts,{merge:1,unwrapOr:3,unwrap:4,watcher:2,hostEvent:1});assert.equal(ops.length,11);
for(const d of before.defs)assert.deepEqual(expected.defs.find(x=>x.id===d.id).schema,d.schema);
for(const id of ['app.main/dispatch!','app.main/dispatch-wire!','app.main/render-app!','app.main/*reel','app.schema/store','app.updater/updater','app.updater/update-wire-store'])assert.deepEqual(expected.defs.find(d=>d.id===id),before.defs.find(d=>d.id===id));
const main=expected.defs.find(d=>d.id==='app.main/main!');assert.equal(main.code[5][0],'render-app!');assert.equal(main.code[8][0],'match');assert.equal(main.code[9][0],'add-event-listener!');assert.equal(main.code[10][0],'set-interval!');
const reload=expected.defs.find(d=>d.id==='app.main/reload!'),oldReload=before.defs.find(d=>d.id===reload.id);assert.deepEqual(reload.code[3][2][5],oldReload.code[3][2][5]);assert.deepEqual(reload.code[3][3],oldReload.code[3][3]);
mkdirSync('acceptance',{recursive:true});
for(const [name,value]of Object.entries({before,expected,sites,operations:ops}))writeFileSync('acceptance/'+name+'.json',JSON.stringify(value,null,2));
const txn=['edit','transaction','--file','acceptance/operations.json','--format','json'];
const preview=JSON.parse(run(...txn,'--dry-run'));assert.ok(preview.scoped_revision);
writeFileSync('acceptance/preview.json',JSON.stringify(preview,null,2));writeFileSync('acceptance/applied.json',run(...txn,'--expect-revision',preview.scoped_revision));
const after={config:q('config'),namespaces:q('ns').namespaces.map(n=>q('ns',n)),defs:expected.defs.map(d=>q('def',d.id))};assert.deepEqual(after,expected);
writeFileSync('acceptance/after.json',JSON.stringify(after,null,2));writeFileSync('acceptance/snapshot-after-blob.txt',blob());
writeFileSync('acceptance/summary.json',JSON.stringify({definitions:16,tests:0,examples:0,operations:11,counts,preserved:'All public schemas/ns/config/metadata and original6Nodeassertions;actual TODO placeholder unchanged,notnewproduct. RealMap store/mixedstatekeys/unknownfields/Enumandstoreidtimechecks preserved. HUD success/error subtrees unchanged;restore-before-save/render-first order retained. Only8methodheads+3actualRef/EventHostcallbackhints.0unsafe unchanged,nohelpers/casts/budgets/tests/frameworks/compiler rules.'},null,2));
