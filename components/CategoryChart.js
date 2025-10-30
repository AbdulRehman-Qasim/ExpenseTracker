import { useMemo } from 'react'
import { Doughnut } from 'react-chartjs-2'
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js'
Chart.register(ArcElement, Tooltip, Legend)

const palette = ['#6C5CE7', '#00D2D3', '#FFC75F', '#FF9671', '#845EC2', '#2BB673', '#F9F871']

export default function CategoryChart({ items }) {
  const data = useMemo(() => {
    const sums = {}
    items.forEach(i => {
      const k = i.category || 'Other'
      sums[k] = (sums[k] || 0) + Number(i.amount || 0)
    })
    const labels = Object.keys(sums)
    const values = Object.values(sums)
    return {
      labels,
      datasets: [
        {
          label: 'Spending by Category',
          data: values,
          backgroundColor: labels.map((_, idx) => palette[idx % palette.length]),
          borderWidth: 0,
        },
      ],
    }
  }, [items])

  const options = {
    cutout: '62%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: 'rgba(17,24,39,0.8)' }
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.label}: $${Number(ctx.raw).toFixed(2)}`
        }
      }
    }
  }

  return (
    <div className="card p-4">
      <h3 className="font-bold mb-2">Spending by Category</h3>
      {items.length ? (
        <Doughnut data={data} options={options} />
      ) : (
        <div className="text-sm text-white/60 py-10 text-center">Add some expenses to see the chart</div>
      )}
    </div>
  )
}
