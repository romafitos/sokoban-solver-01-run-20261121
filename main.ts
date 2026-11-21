import{mkdirSync,readdirSync,readFileSync,writeFileSync}from'node:fs';
const I=process.env.MAKEFUN_INPUT_DIR??'/input',O=process.env.MAKEFUN_OUTPUT_DIR??'/output',D=[[0,-1,'u'],[0,1,'d'],[-1,0,'l'],[1,0,'r']];
function parse(t){let r=t.split('\n').filter(x=>x),w=Math.max(...r.map(x=>x.length)),a=new Uint8Array(w*r.length).fill(1),g=[],b=[],p=-1;
r.forEach((s,y)=>{for(let x=0;x<s.length;x++){let i=y*w+x,c=s[x];if(c!='#'){a[i]=0;if(c=='.'||c=='*'||c=='+')g.push(i);if(c=='$'||c=='*')b.push(i);if(c=='@'||c=='+')p=i}}});
return{w,a,g,b:b.sort((x,y)=>x-y),p}}
function live(w,a,g){let v=new Uint8Array(a.length),q=[...g];
for(let i=0;i<q.length;i++){let x=q[i];v[x]=1;for(let[dx,dy]of D){let d=dy*w+dx,y=x-d;if(!a[y]&&!a[y-d]&&!v[y]){v[y]=1;q.push(y)}}}return v}
function reach(w,a,o,f,m){m.fill(0);let s=[f],l=f;m[f]=1;while(s.length){let p=s.pop();if(p<l)l=p;for(let[dx,dy]of D){let q=p+dy*w+dx;if(!a[q]&&!o[q]&&!m[q]){m[q]=1;s.push(q)}}}return l}
function froz(w,a,o,g,t){for(let x of[t,t-1,t-w,t-w-1]){let b=x+1,c=x+w,d=c+1;if((a[x]||o[x])&&(a[b]||o[b])&&(a[c]||o[c])&&(a[d]||o[d])&&((o[x]&&!g[x])||(o[b]&&!g[b])||(o[c]&&!g[c])||(o[d]&&!g[d])))return 1}return 0}
function walk(w,a,o,f,t){if(f==t)return'';let v=new Int32Array(a.length).fill(-1),h=[],q=[f];v[f]=f;
for(let i=0;i<q.length;i++){let p=q[i];if(p==t)break;for(let[dx,dy,c]of D){let s=p+dy*w+dx;if(a[s]||o[s]||v[s]+1)continue;v[s]=p;h[s]=c;q.push(s)}}
if(v[t]<0)return'';let s='';for(let p=t;p!=f;p=v[p])s=h[p]+s;return s}
function solvePush(L){let{w,a,g,b:B,p:P}=L,n=a.length,G=new Uint8Array(n);
for(let x of g)G[x]=1;let V=live(w,a,g);if(B.some(x=>!V[x]))return null;
let o=new Uint8Array(n),m=new Uint8Array(n),m2=new Uint8Array(n),S=[B],Y=[P],F=[-1],K=new Set,ok=b=>b.every(x=>G[x]);
for(let x of B)o[x]=1;K.add(reach(w,a,o,P,m)+'|'+B);for(let x of B)o[x]=0;
let f=ok(B)?0:-1;
for(let h=0;f<0&&h<S.length;h++){let b=S[h];for(let x of b)o[x]=1;reach(w,a,o,Y[h],m);
for(let i=0;i<b.length&&f<0;i++){let x=b[i];for(let[dx,dy]of D){let d=dy*w+dx,t=x+d;
if(!m[x-d]||a[t]||o[t]||!V[t])continue;o[x]=0;o[t]=1;let z=froz(w,a,o,G,t),N=null,k='';
if(!z){N=b.slice();N[i]=t;N.sort((u,v)=>u-v);k=reach(w,a,o,x,m2)+'|'+N}
o[t]=0;o[x]=1;if(z||K.has(k))continue;if(S.length>=250000)return null
K.add(k);S.push(N);Y.push(x);F.push(h);if(ok(N)){f=S.length-1;break}}}
for(let x of b)o[x]=0}
if(f<0)return null;let p=[],s='';for(let q=f;q>0;q=F[q])p.push(q);p.reverse();let q=P,b=B;
for(let s2 of p){let N=S[s2],fr=b.find(x=>!N.includes(x)),to=N.find(x=>!b.includes(x)),d=to-fr;
for(let x of b)o[x]=1;s+=walk(w,a,o,q,fr-d);for(let x of b)o[x]=0;
s+=D.find(([dx,dy])=>dy*w+dx==d)[2];q=fr;b=N}return s}
function rooms(L){let{w,a,g,b,p}=L,V=live(w,a,g),r=Math.floor(p/w),c=new Uint8Array(a.length);
for(let i=r*w;i<(r+1)*w;i++)if(!a[i]&&!V[i])c[i]=1;
if(b.some(x=>c[x]))return null;
let t=new Int32Array(a.length).fill(-1),R=[];
for(let s=0;s<a.length;s++){if(a[s]||c[s]||t[s]>=0)continue;let q=[s];t[s]=R.length;
for(let i=0;i<q.length;i++)for(let[dx,dy]of D){let y=q[i]+dy*w+dx;if(!a[y]&&!c[y]&&t[y]<0){t[y]=R.length;q.push(y)}}
R.push({g:[],b:[]})}
for(let x of b)R[t[x]].b.push(x);
for(let x of g)if(t[x]>=0)R[t[x]].g.push(x);
if(g.some(x=>t[x]<0)||R.some(x=>x.b.length!=x.g.length))return null;
return R.filter(x=>x.b.length)}
function solve(t){let L=parse(t),R=rooms(L);if(!R)return solvePush(L)??'';
let p=L.p,m='',d=R.map(()=>0);
for(let i=0;i<R.length;i++){let a=L.a.slice();
for(let j=0;j<R.length;j++)if(j!=i)for(let x of d[j]?R[j].g:R[j].b)a[x]=1;
let s=solvePush({w:L.w,a,g:R[i].g,b:R[i].b,p});if(s==null)return'';
m+=s;for(let c of s)p+=c=='u'?-L.w:c=='d'?L.w:c=='l'?-1:1;d[i]=1}return m}
for(let id of readdirSync(I).sort()){let m=solve(readFileSync(I+'/'+id+'/level.txt','utf8'));mkdirSync(O+'/'+id,{recursive:!0});writeFileSync(O+'/'+id+'/solution.txt',m+'\n')}
