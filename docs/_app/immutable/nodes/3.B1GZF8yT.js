import"../chunks/CWj6FrbW.js";import{h as z,a as yt,d as st,b as Ft,E as Vt,c as Mt,am as Rt,j as Bt,_ as zt,R as gt,s as bt,f as Nt,p as Yt,T as Lt,e as Ot,a7 as _,J as w,K as g,a6 as j,t as S,v as c,a8 as N,G as Q,u as H,I as X,n as mt,z as R,a4 as Y,an as Ut,ao as qt,y as Jt}from"../chunks/CATxWoNE.js";import{a as Pt,f as A,b as p,d as V,t as Wt}from"../chunks/J_nSfQjz.js";import{i as Gt,e as wt,a as E,f as Zt}from"../chunks/CQW474mY.js";import{e as P,i as W,b as $t,s as Kt,c as Ht,d as Qt}from"../chunks/CgL2QFVg.js";import{c as dt}from"../chunks/Bpe1Qa6d.js";import{s as ut,p as M}from"../chunks/CEW8zpq9.js";import{s as kt}from"../chunks/m0BtxhTw.js";import{b as Xt,i as J}from"../chunks/CJUqzX-G.js";import{c as te}from"../chunks/CMWuI18S.js";import{h as _t}from"../chunks/CNTtip1J.js";import{b as ee}from"../chunks/i6GQrqKd.js";function ht(e,t,a,o,s,d){let m=z;z&&yt();var u,y,r=null;z&&st.nodeType===1&&(r=st,yt());var l=z?st:e,n;Ft(()=>{const i=t()||null;var b=i==="svg"?Rt:null;i!==u&&(n&&(i===null?Yt(n,()=>{n=null,y=null}):i===y?Lt(n):(Ot(n),wt(!1))),i&&i!==y&&(n=Mt(()=>{if(r=z?r:b?document.createElementNS(b,i):document.createElement(i),Pt(r,r),o){z&&Gt(i)&&r.append(document.createComment(""));var h=z?Bt(r):r.appendChild(zt());z&&(h===null?gt(!1):bt(h)),o(r,h)}Nt.nodes_end=r,l.before(r)})),u=i,u&&(y=u),wt(!0))},Vt),m&&(gt(!0),bt(l))}var xt={},it={},lt=34,K=10,ct=13;function At(e){return new Function("d","return {"+e.map(function(t,a){return JSON.stringify(t)+": d["+a+'] || ""'}).join(",")+"}")}function ne(e,t){var a=At(e);return function(o,s){return t(a(o),s,e)}}function It(e){var t=Object.create(null),a=[];return e.forEach(function(o){for(var s in o)s in t||a.push(t[s]=s)}),a}function C(e,t){var a=e+"",o=a.length;return o<t?new Array(t-o+1).join(0)+a:a}function oe(e){return e<0?"-"+C(-e,6):e>9999?"+"+C(e,6):C(e,4)}function ae(e){var t=e.getUTCHours(),a=e.getUTCMinutes(),o=e.getUTCSeconds(),s=e.getUTCMilliseconds();return isNaN(e)?"Invalid Date":oe(e.getUTCFullYear())+"-"+C(e.getUTCMonth()+1,2)+"-"+C(e.getUTCDate(),2)+(s?"T"+C(t,2)+":"+C(a,2)+":"+C(o,2)+"."+C(s,3)+"Z":o?"T"+C(t,2)+":"+C(a,2)+":"+C(o,2)+"Z":a||t?"T"+C(t,2)+":"+C(a,2)+"Z":"")}function re(e){var t=new RegExp('["'+e+`
\r]`),a=e.charCodeAt(0);function o(n,i){var b,h,f=s(n,function(x,v){if(b)return b(x,v-1);h=x,b=i?ne(x,i):At(x)});return f.columns=h||[],f}function s(n,i){var b=[],h=n.length,f=0,x=0,v,k=h<=0,I=!1;n.charCodeAt(h-1)===K&&--h,n.charCodeAt(h-1)===ct&&--h;function D(){if(k)return it;if(I)return I=!1,xt;var O,F=f,T;if(n.charCodeAt(F)===lt){for(;f++<h&&n.charCodeAt(f)!==lt||n.charCodeAt(++f)===lt;);return(O=f)>=h?k=!0:(T=n.charCodeAt(f++))===K?I=!0:T===ct&&(I=!0,n.charCodeAt(f)===K&&++f),n.slice(F+1,O-1).replace(/""/g,'"')}for(;f<h;){if((T=n.charCodeAt(O=f++))===K)I=!0;else if(T===ct)I=!0,n.charCodeAt(f)===K&&++f;else if(T!==a)continue;return n.slice(F,O)}return k=!0,n.slice(F,h)}for(;(v=D())!==it;){for(var L=[];v!==xt&&v!==it;)L.push(v),v=D();i&&(L=i(L,x++))==null||b.push(L)}return b}function d(n,i){return n.map(function(b){return i.map(function(h){return l(b[h])}).join(e)})}function m(n,i){return i==null&&(i=It(n)),[i.map(l).join(e)].concat(d(n,i)).join(`
`)}function u(n,i){return i==null&&(i=It(n)),d(n,i).join(`
`)}function y(n){return n.map(r).join(`
`)}function r(n){return n.map(l).join(e)}function l(n){return n==null?"":n instanceof Date?ae(n):t.test(n+="")?'"'+n.replace(/"/g,'""')+'"':n}return{parse:o,parseRows:s,format:m,formatBody:u,formatRows:y,formatRow:r,formatValue:l}}var se=re(","),ie=se.parse,le=A('<section id="demo-link"><h2>Link</h2> <p><a href="elements">Default element styles demo</a></p> <p><a href="fonts">Pudding-hosted font previews</a></p></section>');function ce(e){var t=le();p(e,t)}var de=A('<section id="demo-image"><h2>Image</h2> <p>img tag</p> <img src="../assets/demo/test.jpg" alt="cat" class="svelte-o47y6s"/> <p>background image</p> <div class="svelte-o47y6s"></div></section>');function ue(e){var t=de();p(e,t)}var he=A('<section id="demo-element"><h2>Dynamic Svelte Element</h2> <!></section>');function me(e){const t=[{tag:"h3",text:"I am a h3 tag."},{tag:"p",text:"I am p tag."}];var a=he(),o=_(w(a),2);P(o,17,()=>t,W,(s,d)=>{let m=()=>c(d).tag,u=()=>c(d).text;var y=V(),r=j(y);ht(r,m,!1,(l,n)=>{var i=Wt();S(()=>E(i,u())),p(n,i)}),p(s,y)}),g(a),p(e,a)}var fe=A("<p> </p>");function ve(e,t){var a=fe(),o=w(a);g(a),S(()=>E(o,`I am component A and my favorite number is ${t.number??""}.`)),p(e,a)}var pe=A("<p> </p>");function ye(e,t){var a=pe(),o=w(a);g(a),S(()=>E(o,`I am component B and my name is ${t.name??""}.`)),p(e,a)}var ge=A('<section id="demo-component"><h2>Dynamic Svelte Component</h2> <!></section>');function be(e){const t={A:ve,B:ye},a=[{component:"A",number:42},{component:"B",name:"Russell"}];var o=ge(),s=_(w(o),2);P(s,17,()=>a,W,(d,m)=>{var u=V();const y=N(()=>t[c(m).component]);var r=j(u);dt(r,()=>c(y),(l,n)=>{n(l,ut(()=>c(m)))}),p(d,u)}),g(o),p(e,o)}var we=A("<div><!></div>");function _e(e,t){Q(t,!0);let a=M(t,"root",3,null),o=M(t,"top",3,0),s=M(t,"bottom",3,0),d=M(t,"increments",3,100),m=M(t,"value",15,void 0),u=[],y=[],r=[],l=[],n;function i(){let v=0,k=0;for(let I=0;I<u.length;I++)u[I]>v&&(v=u[I],k=I);v>0?m(k):m(void 0)}function b(v,k){const I=G=>{G[0].isIntersecting;const tt=G[0].intersectionRatio;u[k]=tt,i()},D=o()?o()*-1:0,L=s()?s()*-1:0,O=`${D}px 0px ${L}px 0px`,F={root:a(),rootMargin:O,threshold:y};l[k]&&l[k].disconnect();const T=new IntersectionObserver(I,F);T.observe(v),l[k]=T}function h(){r.length&&r.forEach(b)}H(()=>{for(let v=0;v<d()+1;v++)y.push(v/d());r=n.querySelectorAll(":scope > *:not(iframe)"),h()}),H(()=>{o(),s(),h()});var f=we(),x=w(f);kt(x,()=>t.children??mt),g(f),Xt(f,v=>n=v,()=>n),p(e,f),X()}var xe=A('<div><p class="svelte-12sq0x6"> </p></div>'),Ie=A('<section id="scrolly"><h2 class="svelte-12sq0x6">Scrolly <span> </span></h2> <div class="spacer svelte-12sq0x6"></div> <!> <div class="spacer svelte-12sq0x6"></div></section>');function ke(e){let t=Y(void 0);var a=Ie(),o=w(a),s=_(w(o)),d=w(s,!0);g(s),g(o);var m=_(o,4);_e(m,{get value(){return c(t)},set value(u){R(t,u,!0)},children:(u,y)=>{var r=V(),l=j(r);P(l,16,()=>[0,1,2,3,4],W,(n,i,b)=>{var h=xe();const f=N(()=>c(t)===b);let x;var v=w(h),k=w(v,!0);g(v),g(h),S(I=>{x=$t(h,1,"step svelte-12sq0x6",null,x,I),E(k,i)},[()=>({active:c(f)})]),p(n,h)}),p(u,r)},$$slots:{default:!0}}),Ut(2),g(a),S(()=>E(d,c(t)||"-")),p(e,a)}const Ae=`{
	"title": "A Journey Through Infertility",
	"description": "An interactive journey about IVF, told from two perspectives.",
	"hed": "A Journey Through Infertility",
	"byline": "By <a href=https://pudding.cool/author/lam-vo/ target=_blank>Lam Vo</a>",
	"byline2": "With <a href=https://pudding.cool/author/jan-diehm/ target=_blank>Jan Diehm</a> and <a href=https://pudding.cool/author/michelle-pera-mcghee/ target=_blank>Michelle Pera-McGhee</a>",
	"byline3": "Illustrations by <a href=​​https://www.rosewongart.com/ target=_blank rel=external>Rose Wong</a>",
	"landing": {
		"text": "This is an interactive story about <strong>In Vitro Fertilization (IVF)</strong> told from two perspectives:"
	},
	"beats": {
		"mom": [
			{
				"id": "fertile",
				"text": "I never thought becoming a mom was going to be an issue for me. My paternal grandmother had 13 children. My mother’s mom had 6. I came from a fertile group of women. But alas, I was not able to become pregnant after 12 months of trying and was sent on the route of IVF."
			},
			{
				"id": "heartbreak",
				"text": "In vitro fertilization, which is more commonly known as IVF, is an obstacle course of logistics, a test of your physical and emotional stamina, and a drain on your savings. Your heart is broken again and again. And yet you have to muster the courage and blind hope to keep going."
			},
			{
				"id": "quest",
				"text": [
					{
						"type": "text",
						"value": "Many compare women who go through IVF to warriors."
					},
					{
						"type": "text",
						"value": "That’s likely because doing IVF can feel like a quest during which you face challenge after challenge."
					}
				]
			},
			{
				"id": "needles",
				"text": [
					{
						"type": "text",
						"value": "First there are the egg retrievals and making of embryos, commonly called a round of IVF."
					},
					{
						"type": "text",
						"value": "Your body is pierced by an ungodly amount of needles for this process."
					}
				]
			},
			{
				"id": "more-needles",
				"text": [
					{
						"type": "text",
						"value": "Over the course of each round (I have done five), you take in daily hormonal injections, first 2 and then 3 needles a day."
					},
					{
						"type": "text",
						"value": "You are also poked with needles every two or three days during doctor’s visits."
					},
					{
						"type": "text",
						"value": "Add to that even more needles, 10-30 at a time, during weekly fertility-related acupuncture sessions."
					}
				]
			},
			{
				"id": "logistics",
				"text": "Each cycle is also a test for your ability to handle logistics: fitting all the appointments into your life, arranging for all your medications to arrive on time and moving travel plans around whenever you have your period... It’s like solving a massive jigsaw puzzle."
			},
			{
				"id": "adversaries",
				"text": [
					{ "type": "text", "value": "There are adversaries, too." },
					{
						"type": "text",
						"value": "You have to take on giant healthcare bureaucrats — I had at least one of them falsely deny my claims."
					},
					{
						"type": "text",
						"value": "You have to talk to companies handling your medications to ensure you have dozens of needles and expensive medications at home."
					},
					{
						"type": "text",
						"value": "And if you’re unlucky, you have to take on the finance departments and support staff of your clinic to receive the information you need."
					}
				]
			},
			{
				"id": "go-wrong",
				"text": [
					{
						"type": "text",
						"value": "In this complex process, so many little things can go wrong."
					},
					{
						"type": "text",
						"value": "One time, our fertility clinic did not send in our prescription on time. I had to call my insurance, the company handling my prescription and my pharmacy 32 times in three days and my approvals still delayed the arrival of my medications. So I had to travel across the city to pick up medications a friend had left over from her cycle."
					}
				]
			},
			{
				"id": "wrong-clinic",
				"text": "Another time, I was sent to the wrong clinic for an appointment."
			},
			{
				"id": "owe-money",
				"text": [
					{
						"type": "text",
						"value": "And yet another, I received an automated text message from the fertility clinic falsely stating that I owed more than $10,000 while I was in the middle of sobbing over some other bad test results."
					},
					{
						"type": "text",
						"value": "(I left the clinic where all these mishaps happened soon after)."
					}
				]
			},
			{
				"id": "sanity",
				"text": "You lose resources — money, time and, very often, your sanity."
			},
			{
				"id": "hoops",
				"text": "And still, if you’ve braved all the hoops and hurdles you could be foiled by bad luck. Even if you retrieve as many eggs as your body can produce, they might not turn into healthy embryos. And even when all the conditions seem right, the embryo might not implant."
			},
			{
				"id": "help",
				"text": [
					{
						"type": "text",
						"value": "This entire journey is full of small wins and what feels like giant losses. Each feels more intense as time passes. You can work and work and work on everything and yet so much is out of your control. And what seems so hard for you, seems so easy for others. Since I began my journey six women around me have gotten pregnant, two through IVF at the same clinic where I started."
					},
					{
						"type": "text",
						"value": "But somehow, to have the chance to succeed, you have to keep going. And that’s where finding a bit of help is crucial."
					}
				]
			},
			{
				"id": "strength",
				"text": "Like with any quest, you meet people along the way. You bond with many who give you strength."
			},
			{
				"id": "simone",
				"text": "There was Simone, a close friend who went through IVF right before I started my journey and who walked me through every step and has continued to check in on every major milestone during my journey."
			},
			{
				"id": "friends",
				"text": "There were my friends whom I bumped into at the clinic and those who told me they were doing egg retrievals or IVF after I mentioned my own fertility struggles. We would walk alongside one another for part of each other’s journeys and even when our paths diverged, they’d still check in."
			},
			{
				"id": "online",
				"text": "There were the many women online. During moments of crippling anxiety and late night Google searches, I found solidarity in the countless women who had posted about their experiences on Reddit forums or on Facebook. Their collective encouragement felt like a crowd on the sidelines, cheering me on during a marathon."
			},
			{
				"id": "warriors",
				"text": [
					{
						"type": "text",
						"value": "And now, I’ve built my own little band of warriors. We cheer each other on. I’ve organized a little gathering. They’ve had me over for dinner. I donated some of my leftover medications to a friend before they expired. Eight other warriors later gave me their leftover meds worth about $8,000 in total so I could do another round of IVF."
					},
					{
						"type": "text",
						"value": "It’s a shitty club to be part of. But those of us who are find solidarity among us."
					}
				]
			},
			{
				"id": "end",
				"text": "You can’t do all this alone. And luckily, so many people are trying to help, because they are so excited for you to meet your baby."
			}
		],
		"baby": [
			{
				"id": "ivf",
				"text": "This is the story about how science can help our natural human reproductive system create a baby, a process known as IVF."
			},
			{
				"id": "follicles",
				"text": "It all starts with a bunch of follicles. Without IVF, one of those follicles grows and releases an egg each month. Basic sex-ed."
			},
			{
				"id": "inefficient",
				"text": "But this process is anything but basic. The odds of that egg becoming a healthy baby are quite slim. As some doctors put it, human reproduction is terribly inefficient, despite so many medical advances."
			},
			{
				"id": "egg",
				"text": "That’s where IVF can help. The IVF process stimulates all of the follicles with hormones to encourage each one to mature an egg."
			},
			{
				"id": "hormones",
				"text": "During my first round of IVF, I started with 8 follicles. Then came the 14 days of hormonal injections that helped those 8 follicles mature their eggs."
			},
			{
				"id": "first-cycle",
				"text": "7 of those eggs were retrieved by the doctors."
			},
			{
				"id": "fertilize",
				"text": "And embryologists were able to successfully fertilize 6."
			},
			{
				"id": "viable",
				"text": "Allowing the embryos to grow for 5 days gives embryologists the ability to identify the most viable ones. After those 5 days, only 3 embryos remained viable."
			},
			{
				"id": "genetic-testing",
				"text": "Then another crucial hurdle: genetic testing, which the doctors recommended for women like me who are above the age of 35. A laboratory analyzed samples of all three of our embryos. After 21 days, they informed us that all 3 of them were abnormal and would likely lead to miscarriages."
			},
			{
				"id": "lottery",
				"text": "IVF can feel like a cruel lottery system in this way. And what makes the whole cycle rougher is that each cycle takes roughly 40 days from start to finish before you know if an embryo could even have the chance of being implanted."
			},
			{
				"id": "perservere",
				"text": [
					{
						"type": "text",
						"value": "But if you have the wherewithal, and if your insurance covers more than one round, like mine did, you can persevere."
					},
					{
						"type": "text",
						"value": "I ended up doing four more cycles like this and only after the third cycle did two little embryos finally test normal. After a fourth retrieval, we finally had 4 embryos, each was frozen to be implanted later and each represented a 50-60% of a live birth."
					}
				]
			},
			{
				"id": "transfer",
				"text": [
					{
						"type": "text",
						"value": "After this step, it was finally time for an embryo transfer from a test tube into my uterus."
					},
					{
						"type": "text",
						"value": "The doctor thawed the healthiest embryo and transferred it into my womb. And despite the best of odds — a healthy uterus and good diagnostic tests — the embryo did not implant."
					}
				]
			},
			{
				"id": "journey",
				"text": [
					{
						"type": "text",
						"value": "Like with any other scientific process there are many additional variables you could introduce to potentially help your outcome."
					},
					{
						"type": "text",
						"value": "It’s not just the doctors, nurses, sonographers and other clinical staffers who are helping our lucky little embryos along the way."
					},
					{
						"type": "text",
						"value": "There are also a lot of other people who have different approaches to fertility. Each represents a different school of thought and people don’t always put credence in each of these parts, but it’s remarkable just how many folks may be part of your egg’s journey."
					}
				]
			},
			{
				"id": "nutritionist",
				"text": "There was the nutritionist who forwarded me instructions on what to eat to make a healthy embryo."
			},
			{
				"id": "doula",
				"text": "There was the fertility doula who helped me interpret each result, who found me a better clinic that ultimately got me on a hormonal protocol that yielded much better results and who helped me save thousands of dollars by fighting finance departments with me."
			},
			{
				"id": "acupuncturists",
				"text": "There are the acupuncturists who channeled a lot of ancient medicinal wisdom from East Asia and adjusted my treatment to each phase of my journey."
			},
			{
				"id": "microbiologist",
				"text": "And then there was the microbiologist who wrote a whole book in which she laid out what supplements may be helpful."
			},
			{
				"id": "finally",
				"text": "It took all these people, medical treatments for endometriosis and TK more transfers before I finally got pregnant."
			},
			{
				"id": "end",
				"text": "You can’t do all this alone. And luckily, so many people are trying to help, because they are so excited for the baby to meet its mom."
			}
		]
	}
}
`;var Te=A("<p><!></p>"),Ce=A("<section><!></section>");function je(e,t){Q(t,!0);let a=M(t,"components",19,()=>({})),o=M(t,"body",19,()=>[]);var s=V(),d=j(s);P(d,17,o,W,(m,u)=>{let y=()=>c(u).section,r=()=>c(u).content;var l=Ce();const n=N(()=>y().toLowerCase().replace(/[^a-z0-9]/g,"")),i=N(()=>a()[y()]);var b=w(l);{var h=x=>{var v=V(),k=j(v);dt(k,()=>c(i),(I,D)=>{D(I,ut(r))}),p(x,v)},f=x=>{var v=V(),k=j(v);P(k,17,r,W,(I,D,L,O)=>{let F=()=>c(D).type,T=()=>c(D).value;var G=V();const tt=N(()=>a()[F()]),Tt=N(()=>typeof T()=="string");var Ct=j(G);{var jt=U=>{var et=V(),nt=j(et);dt(nt,()=>c(tt),(ot,B)=>{B(ot,ut(T))}),p(U,et)},Et=(U,et)=>{{var nt=B=>{var Z=Te(),at=w(Z);_t(at,T),g(Z),p(B,Z)},ot=(B,Z)=>{{var at=q=>{var $=V(),rt=j($);ht(rt,F,!1,(ft,vt)=>{var pt=V(),Dt=j(pt);_t(Dt,T),p(vt,pt)}),p(q,$)},St=q=>{var $=V(),rt=j($);ht(rt,F,!1,(ft,vt)=>{Ht(ft,()=>({...T()}))}),p(q,$)};J(B,q=>{c(Tt)?q(at):q(St,!1)},Z)}};J(U,B=>{F()==="text"?B(nt):B(ot,!1)},et)}};J(Ct,U=>{c(tt)?U(jt):U(Et,!1)})}p(I,G)}),p(x,v)};J(b,x=>{c(i)?x(h):x(f,!1)})}g(l),S(()=>Kt(l,"id",c(n))),p(m,l)}),p(e,s),X()}var Ee=A('<p> </p> <progress max="100"></progress>',1);function Se(e,t){let a=M(t,"label",3,"A"),o=M(t,"value",3,0);var s=Ee(),d=j(s),m=w(d,!0);g(d);var u=_(d,2);S(()=>{E(m,a()),Qt(u,o())}),p(e,s)}var De=A('<section id="cms"><h2>MicroCMS</h2> <code><pre> </pre></code> <!></section>');function Fe(e,t){Q(t,!0);const{body:a}=te,o={Test:Se};var s=De(),d=_(w(s),2),m=w(d),u=w(m,!0);g(m),g(d);var y=_(d,2);je(y,{components:o,body:a}),g(s),S(r=>E(u,r),[()=>Ae.replace(/\t/g," ")]),p(e,s),X()}const Ve=(e,t=mt)=>{var a=Me(),o=w(a),s=w(o,!0);g(o);var d=_(o,2),m=w(d,!0);g(d),g(a),S(()=>{E(s,t().name),E(m,t().age)}),p(e,a)};var Me=A('<div class="person svelte-1ltx6da"><p class="svelte-1ltx6da"> </p> <p class="svelte-1ltx6da"> </p></div>'),Re=(e,t)=>qt(t),Be=(e,t)=>t.random(Math.floor(Math.random()*10)),ze=A('<h2>Svelte5</h2> <h3>Reactive variables 3 ways:</h3> <button class="svelte-1ltx6da">count++</button> <p class="svelte-1ltx6da"> </p> <p class="svelte-1ltx6da"> </p> <p class="svelte-1ltx6da"> </p> <h3>Children (previously slots):</h3> <div class="children"><!></div> <h3>Dispatch Event</h3> <button class="svelte-1ltx6da">Random</button>  <h3>Snippets</h3> <div class="people svelte-1ltx6da"></div>',1);function Ne(e,t){Q(t,!0),M(t,"age",3,30);const a=[{name:"John",age:30},{name:"Jill",age:45}];let o=Y(0),s=N(()=>c(o)*2),d=N(()=>c(o)*2),m=Y(0);H(()=>{R(m,c(o)*2)});var u=ze(),y=_(j(u),4);y.__click=[Re,o];var r=_(y,2),l=w(r);g(r);var n=_(r,2),i=w(n);g(n);var b=_(n,2),h=w(b);g(b);var f=_(b,4),x=w(f);kt(x,()=>t.children??mt),g(f);var v=_(f,4);v.__click=[Be,t];var k=_(v,4);P(k,21,()=>a,W,(I,D)=>{Ve(I,()=>c(D))}),g(k),S(()=>{E(l,`${c(o)??""} doubled is ${c(s)??""} (derived)`),E(i,`${c(o)??""} doubled is ${c(d)??""} (derived by)`),E(h,`${c(o)??""} doubled is ${c(m)??""} ($effect)`)}),p(e,u),X()}Zt(["click"]);const Ye=(e,t)=>{let a=Y(Jt(e)),o=Y(null),s=Y(!0),d=Y(void 0);const m=(r=!0)=>{R(s,r,!0),r===!0&&(R(d,null),R(o,null))},u=async()=>{try{const r=await fetch(c(a),t);if(!r.ok)throw new Error(`Unexpected error occurred (status ${r.status})`);let l;if(c(a).includes(".csv")){const n=await r.text();l=ie(n)}else l=await r.json();return[null,l]}catch(r){const{errorMessage:l="Unexpected error eccurred"}=r;return[l,null]}},y=async r=>{m(!0);const[l,n]=await u();if(r===c(a)){if(l){m(!1),R(d,l,!0);return}m(!1),R(o,n,!0)}};return H(()=>{y(c(a))}),{get data(){return c(o)},get loading(){return c(s)},get error(){return c(d)},get url(){return c(a)},set url(r){c(a)!==r&&R(a,r,!0)}}};var Le=A("<p>loading data...</p>"),Oe=A("<p> </p>"),Ue=A("<p>data loaded</p> <pre> </pre>",1),qe=A('<div class="c"><h2>Load Data</h2> <div class="response"><!></div></div>');function Je(e,t){Q(t,!0);const a=`${ee}/assets/demo/test.csv`,o=Ye(a);H(()=>{});var s=qe(),d=_(w(s),2),m=w(d);{var u=r=>{var l=Le();p(r,l)},y=(r,l)=>{{var n=b=>{var h=Oe(),f=w(h);g(h),S(()=>E(f,`error: ${o.error??""}`)),p(b,h)},i=b=>{var h=Ue(),f=_(j(h),2),x=w(f,!0);g(f),S(v=>E(x,v),[()=>JSON.stringify(o.data,null,2)]),p(b,h)};J(r,b=>{o.error?b(n):b(i,!1)},l)}};J(m,r=>{o.loading?r(u):r(y,!1)})}g(d),g(s),p(e,s),X()}var Pe=A('<div id="demo" class="svelte-m1ilu3"><h1>Demo</h1> <!> <!> <!> <!> <!> <!> <!> <!></div>');function We(e){let t=Y(0);function a(i){console.log(i)}var o=Pe(),s=_(w(o),2);Ne(s,{random:a,get value(){return c(t)},set value(i){R(t,i,!0)}});var d=_(s,2);ce(d);var m=_(d,2);ue(m);var u=_(m,2);me(u);var y=_(u,2);be(y);var r=_(y,2);Fe(r,{});var l=_(r,2);Je(l,{});var n=_(l,2);ke(n),g(o),p(e,o)}function rn(e){We(e)}export{rn as component};
