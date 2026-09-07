import React, {useEffect, useRef, useState} from "react";
import {createRoot} from "react-dom/client";
import * as THREE from "three";
import "./styles.css";

const GITHUB="https://github.com/Pavanyata999";
const LINKEDIN="https://www.linkedin.com/in/yata-pavan-kumar-51176518b";
const EMAIL="pavanyata123@gmail.com";

const sections=["home","experience","projects","network","rag","vision","skills","education","publication","contact"];

function NeuralScene({active}) {
  const ref=useRef(null);
  useEffect(()=>{
    const mount=ref.current;
    let renderer;
    try { renderer=new THREE.WebGLRenderer({antialias:true,alpha:true}); } catch (err) {
      console.warn("3D renderer unavailable; using CSS fallback.", err);
      return;
    }
    renderer.setPixelRatio(Math.min(devicePixelRatio,1.5)); renderer.setSize(innerWidth,innerHeight);
    mount.appendChild(renderer.domElement);
    const scene=new THREE.Scene();
    const camera=new THREE.PerspectiveCamera(50,innerWidth/innerHeight,.1,100); camera.position.z=7;
    const root=new THREE.Group(); scene.add(root);
    scene.add(new THREE.AmbientLight(0x94cfff,1.4));
    const l1=new THREE.PointLight(0x48eaff,8,20); l1.position.set(4,2,5); scene.add(l1);
    const l2=new THREE.PointLight(0x9c78ff,6,20); l2.position.set(-4,-2,4); scene.add(l2);

    const core=new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.25,3),
      new THREE.MeshBasicMaterial({color:0x163846,wireframe:true,transparent:true,opacity:.75})
    ); root.add(core);
    const points=[];
    for(let i=0;i<100;i++){
      const a=i*2.399, b=i*1.618, r=1.25+(i%22)*.15;
      const p=new THREE.Vector3(Math.cos(a)*r,Math.sin(b)*r*.65,Math.sin(a)*r*.62);
      points.push(p);
      const m=new THREE.Mesh(new THREE.SphereGeometry(i%17===0?.065:.025,7,7),new THREE.MeshBasicMaterial({color:i%17===0?0xffffff:0x54dfff}));
      m.position.copy(p); root.add(m);
    }
    for(let i=0;i<90;i++){
      const geo=new THREE.BufferGeometry().setFromPoints([points[i],points[(i*7+11)%points.length]]);
      root.add(new THREE.Line(geo,new THREE.LineBasicMaterial({color:0x54dfff,transparent:true,opacity:.12})));
    }

    const starsGeo=new THREE.BufferGeometry(), arr=new Float32Array(1600);
    for(let i=0;i<1600;i++){arr[i*3]=(Math.random()-.5)*32;arr[i*3+1]=(Math.random()-.5)*20;arr[i*3+2]=(Math.random()-.5)*22}
    starsGeo.setAttribute("position",new THREE.BufferAttribute(arr,3));
    const stars=new THREE.Points(starsGeo,new THREE.PointsMaterial({color:0x8deaff,size:.018,transparent:true,opacity:.55}));
    scene.add(stars);

    const sat=new THREE.Group(); sat.visible=false; scene.add(sat);
    sat.add(new THREE.Mesh(new THREE.BoxGeometry(1.5,.2,.75),new THREE.MeshStandardMaterial({color:0xc6cdd2,metalness:.85,roughness:.25})));
    [-1,1].forEach(x=>{const p=new THREE.Mesh(new THREE.BoxGeometry(.8,.035,.52),new THREE.MeshStandardMaterial({color:0x1b527a,metalness:.4,roughness:.25}));p.position.x=x*1.12;sat.add(p)});

    const net=new THREE.Group(); net.visible=false; scene.add(net); const np=[];
    for(let i=0;i<62;i++){const p=new THREE.Vector3((Math.random()-.5)*7,(Math.random()-.5)*4.5,(Math.random()-.5)*5);np.push(p);const n=new THREE.Mesh(new THREE.SphereGeometry(i===18?.09:.032,7,7),new THREE.MeshBasicMaterial({color:i===18?0xffd166:0x50e3ff}));n.position.copy(p);net.add(n)}
    for(let i=0;i<48;i++){const g=new THREE.BufferGeometry().setFromPoints([np[i],np[(i*5+9)%np.length]]);net.add(new THREE.Line(g,new THREE.LineBasicMaterial({color:0x50e3ff,transparent:true,opacity:.2})))}

    const vec=new THREE.Group(); vec.visible=false; scene.add(vec);
    for(let i=0;i<230;i++){const a=i*2.41,b=i*.73,r=1.3+(i%23)*.095;const p=new THREE.Vector3(Math.cos(a)*r,Math.sin(b)*1.55,Math.sin(a)*r);const m=new THREE.Mesh(new THREE.SphereGeometry(i%13===0?.05:.019,6,6),new THREE.MeshBasicMaterial({color:i%13===0?0xffffff:0xb18cff}));m.position.copy(p);vec.add(m)}

    let mx=0,my=0,raf;
    const move=e=>{mx=(e.clientX/innerWidth-.5)*.35;my=(e.clientY/innerHeight-.5)*.25};
    const resize=()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)};
    addEventListener("pointermove",move); addEventListener("resize",resize);
    const clock=new THREE.Clock();
    function loop(){raf=requestAnimationFrame(loop);const t=clock.getElapsedTime();core.rotation.x=t*.08;core.rotation.y=t*.13;root.rotation.y+=.0025;stars.rotation.y=t*.003;sat.rotation.y=t*.18;net.rotation.y=t*.035;vec.rotation.y=t*.025;camera.position.x+=(mx-camera.position.x)*.02;camera.position.y+=(-my-camera.position.y)*.02;camera.lookAt(0,0,0);renderer.render(scene,camera)}
    loop();
    return()=>{cancelAnimationFrame(raf);removeEventListener("pointermove",move);removeEventListener("resize",resize);renderer.dispose();mount.removeChild(renderer.domElement)}
  },[]);
  useEffect(()=>{
    const map={home:"hero",experience:"sat",projects:"net",network:"net",rag:"vec",vision:"vision",skills:"hero",education:"hero",publication:"vision",contact:"hero"};
    ref.current.dataset.mode=map[active]||"hero";
  },[active]);
  return <div ref={ref} className="three"/>;
}

function App(){
  const [active,setActive]=useState("home"), [menu,setMenu]=useState(false);
  useEffect(()=>{
    const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&setActive(e.target.id)),{rootMargin:"-35% 0px -55% 0px"});
    sections.forEach(id=>document.getElementById(id)&&io.observe(document.getElementById(id)));
    return()=>io.disconnect();
  },[]);
  const go=id=>{document.getElementById(id)?.scrollIntoView({behavior:"smooth"});setMenu(false)};
  return <div className="app">
    <NeuralScene active={active}/>
    <header><button className="logo" onClick={()=>go("home")}>YPK<span> / </span>AI</button><button className="hamb" onClick={()=>setMenu(!menu)}>{menu?"×":"☰"}</button>
      <nav className={menu?"show":""}>{sections.map((s,i)=><button className={active===s?"active":""} onClick={()=>go(s)} key={s}>{String(i).padStart(2,"0")} {s.toUpperCase()}</button>)}</nav>
    </header>

    <main>
      <section id="home" className="page hero"><div className="content">
        <div className="eyebrow">AI / ML ENGINEER · HYDERABAD · INDIA</div>
        <h1>YATA<br/><span>PAVAN</span><br/>KUMAR<span className="dot">.</span></h1>
        <p className="lead">I engineer intelligent systems across <b>machine learning, computer vision, geospatial AI, RAG and backend engineering</b> — turning complex data into systems people can actually use.</p>
        <div className="buttons"><button onClick={()=>go("projects")}>EXPLORE THE WORK ↓</button><a href={GITHUB} target="_blank">GITHUB ↗</a><a href={LINKEDIN} target="_blank">LINKEDIN ↗</a></div>
        <div className="heroMeta"><span>PYTHON · ML · DL · LLMs</span><span>RESEARCH + ENGINEERING</span></div>
      </div><div className="scroll">SCROLL / SYSTEM ONLINE</div></section>

      <section id="experience" className="page"><div className="content experience">
        <div className="eyebrow">01 · EXPERIENCE / NRSC · ISRO</div>
        <h2>EARTH<br/><i>OBSERVED.</i><br/>DATA<br/>UNDERSTOOD.</h2>
        <div className="role"><span>RESEARCH INTERN</span><b>NRSC · ISRO</b><small>HYDERABAD · MAR 2026 — PRESENT</small></div>
        <p>Working with satellite and geospatial datasets in a mission-driven research environment. Focus areas include <b>INSAT-3D atmospheric data, water vapour, precipitation, data processing and environmental pattern analysis.</b></p>
        <div className="detailGrid">
          <div><b>01</b><strong>RAW SATELLITE DATA</strong><p>Work with large-scale satellite outputs and geospatial climate datasets.</p></div>
          <div><b>02</b><strong>PYTHON PIPELINES</strong><p>Build extraction, cleaning and analysis workflows from the ground up.</p></div>
          <div><b>03</b><strong>ENVIRONMENTAL AI</strong><p>Apply ML, deep learning and computer vision concepts to Earth-observation problems.</p></div>
          <div><b>04</b><strong>RESEARCH COLLABORATION</strong><p>Work alongside ISRO scientists and engineers on real research workflows.</p></div>
        </div>
      </div></section>

      <section id="projects" className="page"><div className="content wide">
        <div className="eyebrow">02 · PROJECT ARCHIVE</div><h2>FOUR<br/><i>SYSTEMS.</i><br/>FOUR<br/>PROBLEMS.</h2>
        <p>From live packet intelligence to satellite segmentation, visual search and retrieval-augmented generation.</p>
        <div className="projectList">
          <article onClick={()=>go("network")}><div className="num">01</div><div><small>SECURITY / MAY 2025</small><h3>NETWORK TRAFFIC<br/>ANALYZER</h3><p>Real-time traffic monitoring + ML anomaly detection.</p></div><strong>89%</strong></article>
          <article onClick={()=>go("rag")}><div className="num">02</div><div><small>GENERATIVE AI / JUL — NOV 2025</small><h3>AI DOCUMENT<br/>QA · RAG</h3><p>PDF ingestion, retrieval and context-aware answers.</p></div><strong>FAISS</strong></article>
          <article onClick={()=>go("vision")}><div className="num">03</div><div><small>COMPUTER VISION / FEB — APR 2025</small><h3>CONTENT-BASED<br/>IMAGE RETRIEVAL</h3><p>CNN embeddings + cosine similarity for visual search.</p></div><strong>91%</strong></article>
          <article onClick={()=>go("vision")}><div className="num">04</div><div><small>RESEARCH / JUL — NOV 2024</small><h3>SAR OIL SPILL<br/>DETECTION</h3><p>DeepGrad-SAR hybrid segmentation with explainable AI.</p></div><strong>94.79%</strong></article>
        </div>
      </div></section>

      <section id="network" className="page"><div className="content detail"><div className="eyebrow">03 · NETWORK INTELLIGENCE</div><h2>WATCH<br/><i>THE PACKETS.</i></h2>
        <div className="tech">PYTHON · PYSHARK · SCIKIT-LEARN · MACHINE LEARNING</div>
        <p>Built a tool to capture and monitor <b>live network traffic</b>, using machine-learning anomaly detection to flag unusual behavior and identify potential network threats.</p>
        <div className="flow"><span>LIVE PACKETS</span><i>→</i><span>PYSHARK</span><i>→</i><span>FEATURES</span><i>→</i><span>ML DETECTOR</span><i>→</i><span>ALERT</span></div>
        <div className="metricRow"><div><b>89%</b><small>DETECTION ACCURACY</small></div><div><b>PACKET</b><small>LEVEL FEATURES</small></div><div><b>REAL-TIME</b><small>MONITORING</small></div></div>
        <p className="sub">Feature extraction includes <b>packet size, protocol type and traffic patterns</b>, feeding a reliable anomaly-detection workflow.</p>
        <a className="source" href="https://github.com/Pavanyata999/network-traffic-analyzer_AI" target="_blank">VIEW SOURCE ↗</a>
      </div></section>

      <section id="rag" className="page"><div className="content detail right"><div className="eyebrow">04 · GENERATIVE AI / RAG</div><h2>GIVE<br/><i>DOCUMENTS</i><br/>MEMORY.</h2>
        <div className="tech">PYTHON · FASTAPI · LANGCHAIN · FAISS · LLM APIs · RAG</div>
        <p>An end-to-end <b>AI-powered PDF question-answering system</b> designed to retrieve relevant document context before generating an answer.</p>
        <div className="ragFlow"><div><b>01</b><span>DOCUMENT<br/>PARSING</span></div><div><b>02</b><span>CHUNKING<br/>& CLEANING</span></div><div><b>03</b><span>EMBEDDING<br/>INDEX</span></div><div><b>04</b><span>FAISS<br/>SEARCH</span></div><div><b>05</b><span>LLM<br/>ANSWER</span></div></div>
        <p className="sub">The pipeline combines text extraction, chunking, vector retrieval and LLM API integration to produce context-aware responses instead of relying on model memory alone.</p>
        <a className="source" href="https://github.com/Pavanyata999/hackrx-fastapi-qa" target="_blank">VIEW RAG SYSTEM ↗</a>
      </div></section>

      <section id="vision" className="page"><div className="content wide"><div className="eyebrow">05 · COMPUTER VISION LAB</div>
        <div className="visionBlock"><div><h2>SEE<br/><i>SIMILARITY.</i></h2><div className="tech">CNN · FLASK · COSINE SIMILARITY</div><p>Content-Based Image Retrieval lets a user upload an image and retrieve visually similar images using <b>CNN feature extraction</b> and similarity matching.</p><div className="bigMetric">91<small>% RETRIEVAL ACCURACY</small></div></div><div className="visualCard"><div className="scan">IMAGE<br/>EMBEDDING</div><div className="vlines"><span/><span/><span/><span/><span/></div><div className="scan">SIMILARITY<br/>SPACE</div></div></div>
        <div className="oil"><div><div className="eyebrow">06 · SATELLITE COMPUTER VISION</div><h2>FIND<br/><i>THE SPILL.</i></h2></div><div><p><b>DeepGrad-SAR</b> is an explainable hybrid semantic-segmentation framework for oil-spill detection in SAR imagery. It combines DeepLabV3+ multi-scale context with SegNet boundary refinement and attention-based fusion.</p><div className="oilStats"><b>94.79%<small>ACCURACY</small></b><b>78.28%<small>IoU</small></b><b>89.45%<small>RECALL</small></b><b>87.82%<small>DICE</small></b></div></div></div>
        <div className="oilPipeline"><span>SOS DATASET</span><i>→</i><span>256×256</span><i>→</i><span>DEEPLABV3+</span><i>+</i><span>SEGNET</span><i>→</i><span>ATTENTION FUSION</span><i>→</i><span>GRAD-CAM</span><i>→</i><span>PIXEL MASK</span></div>
        <p className="sub">The detailed report describes 8,070 image-mask pairs from Sentinel-1 and ALOS PALSAR, preprocessing with resizing/normalization and augmentation, BCE + Dice loss with Adam, and evaluation using Accuracy, Precision, Recall, IoU, Dice and ROC-AUC.</p>
        <a className="source" href="https://github.com/Pavanyata999/Oil_Spill_Hybrid" target="_blank">VIEW SOURCE ↗</a>
      </div></section>

      <section id="skills" className="page"><div className="content"><div className="eyebrow">07 · CAPABILITY MATRIX</div><h2>THE<br/><i>STACK.</i></h2>
        <div className="skillGrid">
          <div><small>01 / LANGUAGES</small><h3>PYTHON</h3><p>C · Java · JavaScript · SQL</p></div>
          <div><small>02 / AI & ML</small><h3>DEEP LEARNING</h3><p>Computer Vision · ML · TensorFlow · scikit-learn · LLMs · Generative AI · RAG</p></div>
          <div><small>03 / BACKEND</small><h3>FASTAPI</h3><p>REST APIs · Node.js · Express.js · MongoDB</p></div>
          <div><small>04 / DATA</small><h3>PYDATA</h3><p>Pandas · NumPy · Xarray · NetCDF4 · FAISS</p></div>
          <div><small>05 / CLOUD & DEV</small><h3>ENGINEERING</h3><p>Google Cloud · AWS (Basic) · Git · Linux · Docker · VS Code</p></div>
          <div><small>06 / NETWORK & IOT</small><h3>EDGE</h3><p>Wireshark · Cisco Packet Tracer · OSI/TCP-IP · Arduino · Raspberry Pi · NodeMCU</p></div>
        </div>
      </div></section>

      <section id="education" className="page"><div className="content right"><div className="eyebrow">08 · EDUCATION</div><h2>ARTIFICIAL<br/><i>INTELLIGENCE.</i></h2>
        <div className="edu"><b>B.TECH · ARTIFICIAL INTELLIGENCE</b><span>Anurag University · Hyderabad</span><small>2022 — 2026</small><em>8.38 / 10 CGPA</em></div>
        <div className="edu"><b>INTERMEDIATE · MPC</b><span>Little Flower Junior College · Hyderabad</span><small>2020 — 2022</small><em>82.6%</em></div>
        <div className="edu"><b>CLASS X · CBSE</b><span>Siddhartha Public School · Hyderabad</span><small>2014 — 2020</small><em>7.28 / 10 CGPA</em></div>
      </div></section>

      <section id="publication" className="page"><div className="content"><div className="eyebrow">09 · RESEARCH PUBLICATION</div><h2>FROM<br/><i>PROJECT</i><br/>TO PAPER.</h2>
        <div className="paper"><small>ARXIV · JAN 2026 · 2601.12015</small><h3>SAR-BASED MARINE OIL SPILL DETECTION USING THE DEEPSEGFUSION ARCHITECTURE</h3><p><b>Yata Pavan Kumar</b> · Pediredla Pradeep · Goli Himanish · M. Swathi</p><p>Hybrid satellite-image segmentation combining SegNet and DeepLabV3+ with attention-based fusion for oil-spill detection in SAR imagery.</p><a className="source" href="https://arxiv.org/abs/2601.12015" target="_blank">READ THE PAPER ↗</a></div>
        <div className="certs"><span>GOOGLE CLOUD · GENERATIVE AI</span><span>MICROSOFT & LINKEDIN · CAREER ESSENTIALS IN GENERATIVE AI</span><span>CISCO · PYTHON ESSENTIALS</span><span>CISCO · INTRODUCTION TO CYBERSECURITY</span></div>
      </div></section>

      <section id="contact" className="page contact"><div className="content center"><div className="eyebrow">10 · CONNECTION ESTABLISHED</div><h2>LET'S BUILD<br/><i>WHAT'S NEXT.</i></h2><p>AI engineering, research and production-minded systems. Open to opportunities where intelligent software meets meaningful problems.</p><div className="contactLinks"><a href={"mailto:"+EMAIL}>EMAIL ↗<small>{EMAIL}</small></a><a href={GITHUB} target="_blank">GITHUB ↗<small>PAVANYATA999</small></a><a href={LINKEDIN} target="_blank">LINKEDIN ↗<small>YATA PAVAN KUMAR</small></a></div></div><footer>YATA PAVAN KUMAR · AI / ML ENGINEER · 2026</footer></section>
    </main>
  </div>
}
createRoot(document.getElementById("root")).render(<App/>);
