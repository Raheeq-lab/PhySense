'use client';
import {useEffect,useState} from 'react';

const key='physense.appearance';

export function useAppearance(){
  const[dusk,setDusk]=useState(false);
  useEffect(()=>{const frame=requestAnimationFrame(()=>{let saved='day';try{saved=localStorage.getItem(key)??'day'}catch{}const enabled=saved==='dusk';setDusk(enabled);document.documentElement.dataset.appearance=enabled?'dusk':'day'});return()=>cancelAnimationFrame(frame)},[]);
  const toggle=()=>setDusk(current=>{const next=!current;document.documentElement.dataset.appearance=next?'dusk':'day';try{localStorage.setItem(key,next?'dusk':'day')}catch{}return next});
  return{dusk,toggle};
}
