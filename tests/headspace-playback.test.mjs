import test from 'node:test';
import assert from 'node:assert/strict';
import { criarReproducao, selecionarPrevia } from '../src/lib/headspacePlayback.js';
const deferred = () => { let resolve, reject; const promise = new Promise((a,b)=>{resolve=a;reject=b}); return {promise,resolve,reject}; };
function fixture(resolver, opcoes = {}) {
 const changes=[];
 const audio={src:'',paused:true,error:null,currentTime:0,load(){},pause(){this.paused=true;},removeAttribute(){this.src='';},play(){this.paused=false;return Promise.resolve();}};
 const control=criarReproducao({audio,resolver,estado:s=>changes.push(s),...opcoes});
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
const esperar = ms => new Promise(resolve => setTimeout(resolve, ms));
test('falha de mídia renova a URL e recupera automaticamente a mesma faixa', async()=>{
 let buscas=0,plays=0;const states=[];
 const audio={src:'',paused:true,error:null,load(){this.error=null;},pause(){this.paused=true;},removeAttribute(){this.src='';},play(){if(++plays===1)return Promise.reject(Object.assign(new Error('network'),{name:'AbortError'}));this.paused=false;return Promise.resolve();}};
 const control=criarReproducao({audio,resolver:async f=>`${f.id}-${++buscas}.m4a`,estado:s=>states.push(s),atrasos:[0,0]});
 await control.carregar(song('abc'));await esperar(20);
 assert.equal(buscas,2);assert.equal(audio.src,'abc-2.m4a');assert.equal(audio.paused,false);assert.equal(states.at(-1).aviso,'');control.fechar();
});
test('recuperação é limitada e comunica uma indisponibilidade persistente',async()=>{
 let tentativas=0;const f=fixture(async()=>{tentativas++;throw new TypeError('Failed to fetch');},{atrasos:[0,0]});const control=f.control;
 await control.carregar(song('abc'));await esperar(30);
 assert.equal(tentativas,3);assert.match(f.changes.at(-1).aviso,/Clique em Tocar/);assert.equal(f.changes.at(-1).buscando,false);control.fechar();
});
test('parar cancela a recuperação pendente, sem áudio tardio',async()=>{
 let tentativas=0;const f=fixture(async()=>{tentativas++;throw new TypeError('Failed to fetch');},{atrasos:[10,10]});const control=f.control;
 await control.carregar(song('abc'));control.parar();await esperar(30);
 assert.equal(tentativas,1);assert.equal(f.audio.src,'');assert.equal(f.audio.paused,true);control.fechar();
});
test('uma nova seleção cancela a retentativa da anterior',async()=>{
 const requests=[];const f=fixture(async f=>{requests.push(f.id);if(f.id==='a')throw new TypeError('Failed to fetch');return 'b.m4a';},{atrasos:[10,10]});const control=f.control;
 await control.carregar(song('a'));await control.carregar(song('b'));await esperar(30);
 assert.deepEqual(requests,['a','b']);assert.equal(f.audio.src,'b.m4a');assert.equal(f.audio.paused,false);control.fechar();
});
test('erro de mídia e rejeição de play não duplicam a retentativa',async()=>{
 const old=deferred();let plays=0,requests=0;const f=fixture(async()=>`abc-${++requests}.m4a`,{atrasos:[0,0]});
 f.audio.play=function(){this.paused=false;return ++plays===1?old.promise:Promise.resolve()};
 const control=f.control;
 const loading=control.carregar(song('abc'));await esperar(0);
 f.audio.error={code:2};control.erro();old.reject(new Error('network'));await loading;await esperar(20);
 assert.equal(requests,2);assert.equal(f.audio.src,'abc-2.m4a');control.fechar();
});
