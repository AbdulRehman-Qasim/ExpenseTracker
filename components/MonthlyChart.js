import { useMemo } from 'react'
import { Bar } from 'react-chartjs-2'
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'
Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

export default function MonthlyChart({ items }) {
  const { labels, values } = useMemo(() => {
    const map = new Map()
    items.forEach(i => {
      const d = new Date(i.spent_at)
      const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`
      map.set(key, (map.get(key)||0) + Number(i.amount||0))
    })
    const keys = Array.from(map.keys()).sort()
    return { labels: keys, values: keys.map(k => map.get(k)) }
  }, [items])

  const data = {
    labels,
    datasets: [
      {
        label: 'Monthly Spend',
        data: values,
        backgroundColor: 'rgba(99,102,241,0.6)',
        borderRadius: 8,
      },
    ],
  }
  const options = {
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: 'rgba(17,24,39,0.8)' } },
      y: { grid: { color: 'rgba(148,163,184,0.2)' }, ticks: { color: 'rgba(17,24,39,0.8)' } },
    }
  }

  return (
    <div className="card p-4">
      <h3 className="font-bold mb-2">Monthly Spend</h3>
      {items.length ? <Bar data={data} options={options} /> : <div className="text-sm text-slate-500 py-10 text-center">No data yet</div>}
    </div>
  )
}
