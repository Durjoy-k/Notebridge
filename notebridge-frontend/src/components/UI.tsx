import {ReactNode} from 'react'
export const Card=({children,className='' }:{children:ReactNode,className?:string})=><div className={`rounded-2xl border border-slate-200 bg-white shadow-soft ${className}`}>{children}</div>
export const SectionTitle=({title,sub,action}:{title:string,sub?:string,action?:ReactNode})=><div className="mb-5 flex items-end justify-between gap-4"><div><h2 className="text-lg font-extrabold tracking-tight">{title}</h2>{sub&&<p className="mt-1 text-sm text-slate-500">{sub}</p>}</div>{action}</div>
