import test from 'node:test';
import assert from 'node:assert/strict';
import { criarReproducao, selecionarPrevia } from '../src/lib/headspacePlayback.js';
const deferred = () => { let resolve, reject; const promise = new Promise((a,b)=>{resolve=a;reject=b}); return {promise,resolve,reject}; };
function fixture(resolver) {
 const changes=[];
 const audio={src:'',paused:true,error:null,currentTime:0,load(){},pause(){this.paused=true;},removeAttribute(){this.src='';},play(){this.paused=false;return Promise.resolve();}};
 const control=criarReproducao({audio,resolver,estado:s=>changes.push(s)});
 return {audio,control,changes};
}
const song = id => ({id,titulo:id,origem:'catalogo'});
test('a última seleção vence mesmo se a busca anterior terminar depois', async()=>{
 const a=deferred(),b=deferred();const f=fixture(s=>s.id==='a'?a.promise:b.promise);
 const first=f.control.carregar(song('a'));const second=f.control.carregar(song('b'));
 b.resolve('b.mp3');await second;a.resolve('a.mp3');await first;
 assert.equal(f.audio.src,'b.mp3');assert.equal(f.audio.paused,false);f.control.fechar();
});
test('busca sem resultado não deixa a música anterior disponível com outro nome; play tenta a seleção novamente', async()=>{
 let n=0;const f=fixture(()=>{if(++n===1)throw new Error('Sem prévia.');return Promise.resolve('nova.mp3')});
 await f.control.carregar({id:'demo',origem:'demo',url:'demo.wav'});
 await f.control.carregar(song('nova'));assert.equal(f.audio.src,'');assert.equal(f.audio.paused,true);
 await f.control.alternar(song('nova'));assert.equal(f.audio.src,'nova.mp3');assert.equal(f.audio.paused,false);f.control.fechar();
});
test('parar durante a busca impede o início tardio do áudio', async()=>{
 const request=deferred();const f=fixture(()=>request.promise);const loading=f.control.carregar(song('a'));
 f.control.parar();request.resolve('a.mp3');await loading;
 assert.equal(f.audio.src,'');assert.equal(f.audio.paused,true);f.control.fechar();
});
test('rejeição atrasada do play antigo não exibe erro na faixa atual',async()=>{
 const old=deferred();const f=fixture();let n=0;f.audio.play=function(){this.paused=false;return ++n===1?old.promise:Promise.resolve()};
 const first=f.control.carregar({id:'a',url:'a.wav'});await f.control.carregar({id:'b',url:'b.wav'});
 old.reject(Object.assign(new Error(),{name:'AbortError'}));await first;
 assert.equal(f.audio.src,'b.wav');assert.equal(f.changes.at(-1).aviso,'');f.control.fechar();
});
test('prévia exige título completo e artista; não substitui por outra música do artista',()=>{
 const f={titulo:'I Want You Back',artista:'The Jackson 5'};
 const wrong={trackName:'I’ll Be There',artistName:'Jackson 5',previewUrl:'errada'};
 assert.equal(selecionarPrevia(f,[wrong]),undefined);
 assert.equal(selecionarPrevia(f,[wrong,{trackName:'I Want You Back (Remastered)',artistName:'Jackson 5',previewUrl:'certa'}]),'certa');
});
