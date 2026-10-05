function renderTermSnapshot(){
 const root=document.getElementById('termSnapshotContent');root.replaceChildren();
 document.getElementById('termSnapshotTitle').textContent=L('2026年度 '+({Spring:'春',Summer:'夏',Autumn:'秋',Winter:'冬'}[selectedQuarter]||selectedQuarter)+'学期の予定','AY2026 '+selectedQuarter+' plan');
 const visible=myTimetable.filter(x=>effectiveQuarter(x)===null||effectiveQuarter(x)===selectedQuarter);
 const grid=document.createElement('div');grid.className='snapshotGrid';root.append(grid);
 const put=(text,col,row,cls,span=1)=>{const el=document.createElement('div');el.className=cls;el.textContent=text;el.style.gridColumn=col;el.style.gridRow=row+' / span '+span;grid.append(el);return el;};
 DAYS.forEach((d,i)=>put(L(d,DAY_EN[d]),i+2,1,'snapshotDay'));
 for(let p=1;p<=6;p++){put(String(p),1,p+1,'snapshotPeriod');DAYS.forEach((d,i)=>put('',i+2,p+1,'snapshotCell'));}
 const extras=[];
 for(const item of visible){
  const periods=parseDayPeriod(item.day);let shown=false;
  DAYS.forEach((day,i)=>{
   const slots=[...new Set(periods.filter(p=>p.day===day&&+p.period>=1&&+p.period<=6).map(p=>+p.period))].sort((a,b)=>a-b);
   while(slots.length){const start=slots.shift();let span=1;while(slots[0]===start+span){slots.shift();span++;}
    const el=put(courseNameForTeachingLanguage(item),i+2,start+1,'snapshotCourse',span);if(item.room){const meta=document.createElement('small');meta.textContent=item.room;el.append(meta);}shown=true;
   }
  });
  if(!shown||periods.some(p=>+p.period>6))extras.push(item);
 }
 if(!visible.length){const p=document.createElement('p');p.className='snapshotExtra';p.textContent=L('この学期の授業はまだ追加されていません。','No courses added for this quarter.');root.append(p);}
 if(extras.length){const heading=document.createElement('strong');heading.textContent=L('集中講義・曜日未定など','Intensive / other courses');heading.className='snapshotExtra';root.append(heading);extras.forEach(x=>{const p=document.createElement('p');p.className='snapshotExtra';p.textContent=courseNameForTeachingLanguage(x)+(x.intensiveDates?.length?' · '+x.intensiveDates.join(', '):x.day?' · '+x.day:'');root.append(p);});}
 const note=document.createElement('p');note.className='snapshotExtra';note.textContent=L('叡啓Navi · 履修予定（正式登録とは連動しません）\n学期未確定の集中講義も掲載。共有前に内容を確認してください。','Eikei Navi · planned courses, not official registration.\nIncludes intensive courses with an undetermined quarter. Check before sharing.');root.append(note);
}
document.getElementById('openTermSnapshot').addEventListener('click',()=>{renderTermSnapshot();document.getElementById('termSnapshotDialog').showModal();});
document.getElementById('closeTermSnapshot').addEventListener('click',()=>document.getElementById('termSnapshotDialog').close());
let termShareFile=null;
function createTermShareCanvas(){
 const visible=myTimetable.filter(x=>effectiveQuarter(x)===null||effectiveQuarter(x)===selectedQuarter);
 const extras=visible.filter(x=>!parseDayPeriod(x.day).length||parseDayPeriod(x.day).some(p=>!DAYS.includes(p.day)||+p.period>6));
 const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1260+extras.length*100;
 const ctx=canvas.getContext('2d');ctx.fillStyle='#fffaf2';ctx.fillRect(0,0,canvas.width,canvas.height);
 const write=(text,x,y,maxWidth,size=24,bold=false)=>{
  ctx.font=(bold?'700 ':'400 ')+size+'px system-ui, sans-serif';ctx.fillStyle='#302b24';
  let line='',lines=[];for(const char of String(text)){if(ctx.measureText(line+char).width>maxWidth&&line){lines.push(line);line=char;}else line+=char;}if(line)lines.push(line);
  lines.forEach((s,i)=>ctx.fillText(s,x,y+i*(size+9)));return lines.length*(size+9);
 };
 write('叡啓Navi',40,54,1000,28,true);
 write(L('2026年度 '+({Spring:'春',Summer:'夏',Autumn:'秋',Winter:'冬'}[selectedQuarter]||selectedQuarter)+'学期の予定','AY2026 '+selectedQuarter+' plan'),40,112,1000,38,true);
 write(L('履修予定 · 正式登録とは連動しません','Planned courses · not official registration'),40,157,1000,23);
 const left=68,top=226,width=196,rowHeight=144;
 DAYS.forEach((day,d)=>{
  const x=left+d*width;write(L(day,DAY_EN[day]),x+75,207,110,25,true);
  for(let p=1;p<=6;p++){ctx.fillStyle='#ede7dc';ctx.fillRect(x+3,top+(p-1)*rowHeight,width-6,rowHeight-6);}
  let p=1;while(p<=6){
   const here=visible.filter(item=>parseDayPeriod(item.day).some(slot=>slot.day===day&&+slot.period===p));
   const signature=JSON.stringify(here.map(item=>item.code||item.key||item.courseJp));let span=1;
   while(p+span<=6&&JSON.stringify(visible.filter(item=>parseDayPeriod(item.day).some(slot=>slot.day===day&&+slot.period===p+span)).map(item=>item.code||item.key||item.courseJp))===signature)span++;
   if(here.length){const y=top+(p-1)*rowHeight;ctx.fillStyle='#f9d9c7';ctx.fillRect(x+3,y,width-6,span*rowHeight-6);
    let offset=y+34;for(const item of here)offset+=write(courseNameForTeachingLanguage(item),x+15,offset,width-30,24,true)+10;
   }p+=span;
  }
 });
 for(let p=1;p<=6;p++)write(String(p),25,top+(p-1)*rowHeight+35,35,25,true);
 let y=1135;
 if(extras.length){write(L('集中講義・曜日未定など（学期未確定を含む）','Intensive / other (including undetermined quarters)'),40,y,1000,23,true);y+=45;for(const item of extras){y+=write(courseNameForTeachingLanguage(item),40,y,1000,24)+20;}}
 write(L('共有用 · 教室・Teamsコード・個人メモなし','For sharing · no rooms, Teams codes or personal notes'),40,y+30,1000,21);
 return canvas;
}
document.getElementById('openTermSnapshot').addEventListener('click',async()=>{
 const button=document.getElementById('prepareTermShare'),status=document.getElementById('termShareStatus');
 button.disabled=true;termShareFile=null;status.textContent=L('共有画像を準備中…','Preparing image…');
 try{
  const canvas=createTermShareCanvas();const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!blob)throw Error('Image generation failed');
  if(!document.getElementById('termSnapshotDialog').open)return;
  termShareFile=new File([blob],'eikei-navi-'+selectedQuarter.toLowerCase()+'.png',{type:'image/png'});
  const supported=!!(window.isSecureContext&&navigator.share&&navigator.canShare&&navigator.canShare({files:[termShareFile]}));
  button.disabled=!supported;
  status.textContent=supported?L('科目名・曜日・時限だけを共有します。相手が保存・転送する可能性があります。','Shares course names, days and periods only. Recipients may save or forward it.'):L('この端末・ブラウザでは画像共有に対応していません。公開版をSafariまたはChromeでお試しください。自動ダウンロードは行いません。','Image sharing unavailable. Try the published site in Safari or Chrome. No automatic download.');
 }catch{status.textContent=L('画像を作成できませんでした。画面を開き直してください。','Could not create image. Reopen this view.');}
});
document.getElementById('prepareTermShare').addEventListener('click',async()=>{
 if(!termShareFile)return;
 const status=document.getElementById('termShareStatus');
 try{await navigator.share({files:[termShareFile]});status.textContent=L('共有画面の操作が完了しました。','Sharing dialog completed.');}
 catch(error){status.textContent=error.name==='AbortError'?L('共有をキャンセルしました。','Sharing cancelled.'):L('共有できませんでした。画像のダウンロードは行っていません。','Could not share. No image was downloaded.');}
});
document.getElementById('termSnapshotDialog').addEventListener('close',()=>{termShareFile=null;});
