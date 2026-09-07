import { useState } from "react";
import { HelpCircle, MoreVertical } from "lucide-react";
import type { TicketGroup, Country } from "../types";
export function MyTicketsPage({ticketGroups,countries,currentCountry,onCountryChange}:any){
 const [tab,setTab]=useState("upcoming");
 const [show,setShow]=useState(false);
 const groups=ticketGroups;
 return <div className="min-h-screen bg-[#f2f2f2]">
 <header className="bg-black text-white sticky top-0 z-50">
 <div className="flex items-center justify-between p-4"><div></div><div className="flex items-center gap-2"><h1 className="text-2xl font-bold">My Events</h1><button onClick={()=>setShow(true)}>{currentCountry?.flag}</button></div><HelpCircle/></div>
 <div className="flex"><button className="flex-1 py-4 border-b-4 border-white">UPCOMING</button><button className="flex-1 py-4 text-gray-500">PAST</button></div></header>
 {show&&<div className="fixed inset-0 bg-black/40"><div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[80vh] overflow-auto"><h2 className="text-3xl font-bold text-center p-6">Change Location</h2>{countries?.map((c:any)=><button key={c.code} onClick={()=>{onCountryChange(c.code);setShow(false)}} className="w-full text-left p-6 border-t flex gap-3"><span>{c.flag}</span>{c.name}</button>)}</div></div>}
 <div className="p-4 space-y-6">
 {groups.map((g:any)=><div key={g.id} className="bg-white shadow overflow-hidden">
 <img src={g.eventImage} className="w-full h-72 object-cover"/>
 <div className="bg-[#1e1e1e] text-white p-5">
 <div className="font-bold">{g.date} • {g.time}</div>
 <h2 className="text-4xl font-extrabold uppercase mt-3">{g.eventName}</h2>
 <p className="mt-4">{g.venue} - {g.location}</p></div>
 <button className="w-full bg-[#026CDF] text-white py-4 text-2xl font-bold">View Tickets</button>
 <div className="p-5"><div className="flex justify-between"><div><h3 className="text-2xl font-bold">Order #{g.id}</h3><p>x1 Ticket</p></div><MoreVertical/></div>
 <div className="mt-5 border bg-gray-100"><div className="p-4 font-bold border-b">TICKET</div><div className="grid grid-cols-3 p-4"><div><div>SECTION</div><div className="text-3xl font-bold">N110</div></div><div><div>ROW</div><div className="text-3xl font-bold">24</div></div><div><div>SEAT</div><div className="text-3xl font-bold">14</div></div></div></div>
 <h4 className="text-2xl font-bold mt-6">MORE OPTIONS</h4>
 <div className="h-52 bg-gray-200 mt-4 rounded flex items-center justify-center">Venue Map / Transfer / Sell</div>
 </div></div>)}
 </div></div>}
