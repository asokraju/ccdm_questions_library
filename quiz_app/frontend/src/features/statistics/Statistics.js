import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

function Statistics({ progress, onBack }) {
  const topicChartRef = useRef(null);
  const subtopicChartRef = useRef(null);
  const topicChartInstance = useRef(null);
  const subtopicChartInstance = useRef(null);

  useEffect(() => {
    // Cleanup previous charts
    if (topicChartInstance.current) {
      topicChartInstance.current.destroy();
      topicChartInstance.current = null;
    }
    if (subtopicChartInstance.current) {
      subtopicChartInstance.current.destroy();
      subtopicChartInstance.current = null;
    }

    // Create topic chart
    if (topicChartRef.current && Object.keys(progress.topicStats).length > 0) {
      const ctx = topicChartRef.current.getContext('2d');
      const topicData = {
        labels: Object.keys(progress.topicStats),
        datasets: [
          {
            label: 'Correct',
            data: Object.values(progress.topicStats).map(stat => stat.correct),
            backgroundColor: 'rgba(40, 167, 69, 0.5)',
            borderColor: 'rgba(40, 167, 69, 1)',
            borderWidth: 1
          },
          {
            label: 'Incorrect',
            data: Object.values(progress.topicStats).map(stat => stat.incorrect),
            backgroundColor: 'rgba(220, 53, 69, 0.5)',
            borderColor: 'rgba(220, 53, 69, 1)',
            borderWidth: 1
          }
        ]
      };

      topicChartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: topicData,
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Performance by Topic'
            }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }

    // Create subtopic chart
    if (subtopicChartRef.current && Object.keys(progress.subtopicStats).length > 0) {
      const ctx = subtopicChartRef.current.getContext('2d');
      const subtopicLabels = Object.keys(progress.subtopicStats);
      const subtopicData = subtopicLabels.map(label => ({
        correct: progress.subtopicStats[label].correct,
        incorrect: progress.subtopicStats[label].incorrect,
        total: progress.subtopicStats[label].correct + progress.subtopicStats[label].incorrect,
        percentage: (progress.subtopicStats[label].correct / 
          (progress.subtopicStats[label].correct + progress.subtopicStats[label].incorrect) * 100).toFixed(1)
      }));

      const chartData = {
        labels: subtopicLabels,
        datasets: [{
          label: 'Correct Percentage',
          data: subtopicData.map(d => d.percentage),
          backgroundColor: 'rgba(0, 123, 255, 0.5)',
          borderColor: 'rgba(0, 123, 255, 1)',
          borderWidth: 1
        }]
      };

      subtopicChartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: {
          indexAxis: 'y',
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Performance by Subtopic (%)'
            },
            tooltip: {
              callbacks: {
                afterLabel: function(context) {
                  const index = context.dataIndex;
                  const data = subtopicData[index];
                  return `${data.correct} correct out of ${data.total}`;
                }
              }
            }
          },
          scales: {
            x: {
              beginAtZero: true,
              max: 100
            }
          }
        }
      });
    }

    return () => {
      if (topicChartInstance.current) {
        topicChartInstance.current.destroy();
        topicChartInstance.current = null;
      }
      if (subtopicChartInstance.current) {
        subtopicChartInstance.current.destroy();
        subtopicChartInstance.current = null;
      }
    };
  }, [progress]);

  const totalQuestions = progress.correct + progress.incorrect;
  const accuracy = totalQuestions > 0 
    ? ((progress.correct / totalQuestions) * 100).toFixed(1)
    : 0;

  return (
    <div>
      <button className="secondary back-button" onClick={onBack}>
        Back to Menu
      </button>
      
      <div className="card">
        <h2>Your Statistics</h2>
        
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-value">{totalQuestions}</div>
            <div className="stat-label">Total Questions</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{color: '#28a745'}}>
              {progress.correct}
            </div>
            <div className="stat-label">Correct Answers</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{color: '#dc3545'}}>
              {progress.incorrect}
            </div>
            <div className="stat-label">Incorrect Answers</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{accuracy}%</div>
            <div className="stat-label">Accuracy</div>
          </div>
        </div>
      </div>
      
      {Object.keys(progress.topicStats).length > 0 && (
        <div className="card chart-container">
          <canvas ref={topicChartRef}></canvas>
        </div>
      )}
      
      {Object.keys(progress.subtopicStats).length > 0 && (
        <div className="card chart-container">
          <canvas ref={subtopicChartRef}></canvas>
        </div>
      )}
    </div>
  );
}

export default Statistics;