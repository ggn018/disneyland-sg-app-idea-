// Shared helpers — Disneyland Singapore app prototype
"use strict";
var DLSG = (function(){

  // ---- storage ----
  function get(key, fallback){
    try{ var v = localStorage.getItem("dlsg_" + key); return v ? JSON.parse(v) : fallback; }
    catch(e){ return fallback; }
  }
  function set(key, val){
    try{ localStorage.setItem("dlsg_" + key, JSON.stringify(val)); }catch(e){}
  }

  // ---- language ----
  var LANGS = [
    { id:"en", label:"EN" }, { id:"zh", label:"中文" },
    { id:"ms", label:"BM" }, { id:"ta", label:"TA" }
  ];
  function getLang(){ return get("lang", "en"); }
  function setLang(l){ set("lang", l); }

  // ---- cart (F&B) ----
  function getCart(){ return get("cart", {}); }
  function setCart(c){ set("cart", c); }
  function cartCount(){
    var c = getCart(); var n = 0;
    Object.keys(c).forEach(function(k){ n += c[k].qty || 0; });
    return n;
  }

  // ---- orders ----
  function getOrders(){ return get("orders", []); }
  function addOrder(order){
    var o = getOrders(); order.id = "ord" + Date.now(); order.time = new Date().toISOString();
    o.unshift(order); set("orders", o); return order;
  }

  // ---- reservations ----
  function getReservations(){ return get("reservations", []); }
  function addReservation(r){
    var all = getReservations(); r.id = "res" + Date.now(); all.unshift(r); set("reservations", all); return r;
  }

  // ---- plan ----
  function getPlan(){ return get("plan", null); }
  function setPlan(p){ set("plan", p); }

  // ---- tickets / wallet ----
  function getTickets(){ return get("tickets", []); }
  function addTicket(t){
    var all = getTickets(); t.id = "tix" + Date.now(); all.unshift(t); set("tickets", all); return t;
  }

  // ---- feedback ----
  function getFeedback(){ return get("feedback", []); }
  function addFeedback(f){
    var all = getFeedback(); f.id = "fb" + Date.now(); f.time = new Date().toISOString(); all.unshift(f); set("feedback", all); return f;
  }

  // ---- guest name ----
  function getName(){ return get("name", "Guest"); }
  function setName(n){ set("name", n); }

  // ---- toast ----
  function toast(msg){
    var el = document.getElementById("dlsgToast");
    if(!el){
      el = document.createElement("div");
      el.id = "dlsgToast"; el.className = "toast";
      el.innerHTML = '<span class="tick"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3"><path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round"/></svg></span><span id="dlsgToastMsg"></span>';
      document.body.appendChild(el);
    }
    document.getElementById("dlsgToastMsg").textContent = msg;
    el.classList.add("show");
    clearTimeout(el._t);
    el._t = setTimeout(function(){ el.classList.remove("show"); }, 2600);
  }

  // ---- bottom nav ----
  var NAV_ITEMS = [
    { key:"home", label:"Home", href:"index.html", icon:function(c){ return '<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="'+c+'" stroke-width="2"><path d="M3 11l9-8 9 8" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 10v10h14V10" stroke-linecap="round" stroke-linejoin="round"/></svg>'; } },
    { key:"store", label:"Store", href:"store.html", icon:function(c){ return '<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="'+c+'" stroke-width="2"><path d="M3 9l1.5-5h15L21 9" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 9v11h16V9" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 20v-6h6v6" stroke-linecap="round" stroke-linejoin="round"/></svg>'; } },
    { key:"map", label:"Map", href:"map.html", center:true, icon:function(c){ return '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="'+c+'" stroke-width="2"><path d="M9 20l-6 2V6l6-2 6 2 6-2v16l-6 2-6-2z" stroke-linejoin="round"/><path d="M9 4v16M15 6v16" /></svg>'; } },
    { key:"plan", label:"Plan", href:"plan.html", icon:function(c){ return '<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="'+c+'" stroke-width="2"><rect x="4" y="5" width="16" height="16" rx="2.5"/><path d="M4 10h16M9 3v4M15 3v4" stroke-linecap="round"/></svg>'; } },
    { key:"me", label:"Me", href:"me.html", icon:function(c){ return '<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="'+c+'" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" stroke-linecap="round"/></svg>'; } }
  ];
  function renderBottomNav(activeKey, mountId){
    var mount = document.getElementById(mountId || "bottomNavMount");
    if(!mount) return;
    var wrap = document.createElement("div");
    wrap.className = "bottomnav";
    NAV_ITEMS.forEach(function(it){
      var active = it.key === activeKey;
      var color = active ? "#1B2A4A" : "#B9BEC9";
      var a = document.createElement("a");
      a.href = it.href;
      if(it.center){
        a.className = "bn-center" + (active ? " active" : "");
        a.innerHTML = '<div class="circle">' + it.icon("#fff") + '</div><span class="lbl" style="color:' + color + '">' + it.label + '</span>';
      } else {
        a.className = active ? "active" : "";
        a.innerHTML = it.icon(color) + '<span class="lbl">' + it.label + '</span>';
      }
      wrap.appendChild(a);
    });
    mount.appendChild(wrap);
  }

  return {
    get:get, set:set,
    LANGS:LANGS, getLang:getLang, setLang:setLang,
    getCart:getCart, setCart:setCart, cartCount:cartCount,
    getOrders:getOrders, addOrder:addOrder,
    getReservations:getReservations, addReservation:addReservation,
    getPlan:getPlan, setPlan:setPlan,
    getTickets:getTickets, addTicket:addTicket,
    getFeedback:getFeedback, addFeedback:addFeedback,
    getName:getName, setName:setName,
    toast:toast, renderBottomNav:renderBottomNav
  };
})();
