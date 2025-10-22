import React from 'react';
import '../../assets/styles/Dashboard/Chart.css';

const Chart = () => {
  const chartData = [
    { month: 'T1', income: 15000000, expense: 8000000 },
    { month: 'T2', income: 18000000, expense: 12000000 },
    { month: 'T3', income: 20000000, expense: 15000000 },
    { month: 'T4', income: 16000000, expense: 10000000 },
    { month: 'T5', income: 22000000, expense: 18000000 },
    { month: 'T6', income: 25000000, expense: 20000000 }
  ];

  const maxValue = Math.max(...chartData.map(d => Math.max(d.income, d.expense)));

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3>Biểu đồ thu chi</h3>
        <div className="chart-legend">
          <div className="legend-item">
            <div className="legend-color income"></div>
            <span>Thu nhập</span>
          </div>
          <div className="legend-item">
            <div className="legend-color expense"></div>
            <span>Chi tiêu</span>
          </div>
        </div>
      </div>
      
      <div className="chart-content">
        <div className="chart-bars">
          {chartData.map((data, index) => (
            <div key={index} className="bar-group">
              <div className="bar-container">
                <div 
                  className="bar income-bar"
                  style={{ 
                    height: `${(data.income / maxValue) * 100}%`,
                    animationDelay: `${index * 0.1}s`
                  }}
                ></div>
                <div 
                  className="bar expense-bar"
                  style={{ 
                    height: `${(data.expense / maxValue) * 100}%`,
                    animationDelay: `${index * 0.1}s`
                  }}
                ></div>
              </div>
              <div className="bar-label">{data.month}</div>
            </div>
          ))}
        </div>
        
        <div className="chart-y-axis">
          <div className="y-label">50M</div>
          <div className="y-label">40M</div>
          <div className="y-label">30M</div>
          <div className="y-label">20M</div>
          <div className="y-label">10M</div>
          <div className="y-label">0</div>
        </div>
      </div>
      
      <div className="chart-summary">
        <div className="summary-item">
          <span className="summary-label">Tổng thu:</span>
          <span className="summary-value income">
            {chartData.reduce((sum, d) => sum + d.income, 0).toLocaleString('vi-VN')} VND
          </span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Tổng chi:</span>
          <span className="summary-value expense">
            {chartData.reduce((sum, d) => sum + d.expense, 0).toLocaleString('vi-VN')} VND
          </span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Tiết kiệm:</span>
          <span className="summary-value savings">
            {(chartData.reduce((sum, d) => sum + d.income, 0) - 
              chartData.reduce((sum, d) => sum + d.expense, 0)).toLocaleString('vi-VN')} VND
          </span>
        </div>
      </div>
    </div>
  );
};

export default Chart;
