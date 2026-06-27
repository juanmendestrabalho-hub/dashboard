let chart;

function updateChartSafe(tasks) {
  if (typeof Chart === "undefined") return;

  const canvas = document.getElementById("chart");
  if (!canvas) return;

  const types = {};

  tasks.forEach(t => {
    types[t.type] = (types[t.type] || 0) + t.time;
  });

  if (chart) {
    chart.destroy();
    chart = null;
  }

  if (Object.keys(types).length === 0) return;

  chart = new Chart(canvas, {
    type: "bar",
    data: {
      labels: Object.keys(types),
      datasets: [{
        label: "Tempo por tipo",
        data: Object.values(types)
      }]
    }
  });
}
