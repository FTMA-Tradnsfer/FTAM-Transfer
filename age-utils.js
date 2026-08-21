// FTMA age utilities — age is always calculated from birth date using Korea time.
(function(){
  'use strict';
  function koreaTodayParts(){
    const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
    const out={};
    parts.forEach(p=>{if(p.type!=='literal')out[p.type]=Number(p.value)});
    return out;
  }
  window.ftmaCalculateAge=function(birthDate){
    if(!birthDate)return null;
    const m=String(birthDate).match(/^(\d{4})-(\d{2})-(\d{2})/);
    if(!m)return null;
    const birthY=Number(m[1]),birthM=Number(m[2]),birthD=Number(m[3]);
    const today=koreaTodayParts();
    let age=today.year-birthY;
    if(today.month<birthM || (today.month===birthM && today.day<birthD))age--;
    return age>=0?age:null;
  };
  window.ftmaAgeOr=function(birthDate,fallback){
    const age=window.ftmaCalculateAge(birthDate);
    return age==null?fallback:age;
  };
})();
