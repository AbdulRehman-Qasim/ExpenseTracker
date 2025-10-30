import Link from 'next/link'
import { useMemo } from 'react'
import { Wallet, Plus, Home, PieChart, Settings, Tags } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Layout({ onOpenCreate, children, route }) {
  const tabs = useMemo(() => ([
    { href: '/', label: 'Home', icon: Home },
    { href: '/reports', label: 'Reports', icon: PieChart },
    { href: '/categories', label: 'Categories', icon: Tags },
    { href: '/settings', label: 'Settings', icon: Settings },
  ]), [])

  return (
    <div className="max-w-6xl mx-auto px-4 pb-24">
      <header className="sticky top-0 z-20 backdrop-blur bg-white/70 border-b border-slate-200">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0.9, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 12 }}
              className="p-2 rounded-xl bg-gradient-to-tr from-primary-600 to-accent-500 shadow-glow text-white"
            >
              <Wallet className="w-6 h-6" />
            </motion.div>
            <div>
              <h1 className="text-xl font-extrabold">Expense Tracker</h1>
              <p className="text-xs text-slate-500">Track, visualize, and manage your spending</p>
            </div>
          </div>
          <button className="btn" onClick={onOpenCreate}>
            <Plus className="w-4 h-4" />
            Add Expense
          </button>
        </div>
      </header>

      <main className="py-6 space-y-6">{children}</main>

      <nav className="fixed bottom-3 left-1/2 -translate-x-1/2 z-30">
        <div className="flex items-center gap-2 rounded-2xl bg-white/90 border border-slate-200 px-2 py-2 backdrop-blur shadow-xl">
          {tabs.map(t => {
            const Icon = t.icon
            const active = route === t.href
            return (
              <Link key={t.href} href={t.href} className={`flex items-center gap-2 px-3 py-2 rounded-xl transition ${active ? 'bg-primary-600 text-white shadow-glow' : 'hover:bg-slate-100 text-slate-700'}`}>
                <Icon className="w-5 h-5" />
                <span className="hidden sm:inline text-sm">{t.label}</span>
              </Link>
            )
          })}
          <button onClick={onOpenCreate} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 transition shadow-glow text-white">
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline text-sm">Add</span>
          </button>
        </div>
      </nav>
    </div>
  )
}
