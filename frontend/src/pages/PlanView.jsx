import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Coffee, Dumbbell, Info, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import api from '../api/axios';

const PlanView = () => {
  const { id } = useParams();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await api.get(`/plans/${id}`);
        setPlan(res.data);
      } catch {
        setError('Failed to load plan. It might not exist or you do not have permission.');
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, [id]);

  const downloadPDF = () => {
    const { dietChart, workoutPlan } = plan;
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();
    const marginBottom = 20;
    let y = 20;

    const checkPageBreak = (needed) => {
      if (y + needed > pageHeight - marginBottom) {
        doc.addPage();
        y = 20;
      }
    };

    doc.setFontSize(20);
    doc.setTextColor(0, 255, 204);
    doc.text('FitSync AI - Personalized Plan', pageWidth / 2, y, { align: 'center' });
    y += 15;

    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date(plan.createdAt).toLocaleDateString()}`, pageWidth / 2, y, { align: 'center' });
    y += 15;

    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Your Concern', 20, y);
    y += 8;
    doc.setFontSize(11);
    doc.setTextColor(80);
    const concernLines = doc.splitTextToSize(plan.concern, pageWidth - 40);
    checkPageBreak(concernLines.length * 6 + 15);
    doc.text(concernLines, 20, y);
    y += concernLines.length * 6 + 15;

    checkPageBreak(10);
    doc.setFontSize(16);
    doc.setTextColor(0, 180, 0);
    doc.text('Diet Chart', 20, y);
    y += 10;
    doc.setFontSize(11);
    doc.setTextColor(80);
    if (dietChart.summary) {
      const summaryLines = doc.splitTextToSize(dietChart.summary, pageWidth - 40);
      checkPageBreak(summaryLines.length * 5 + 5);
      doc.text(summaryLines, 20, y);
      y += summaryLines.length * 5 + 5;
    }
    if (dietChart.dailyCalories) {
      checkPageBreak(10);
      doc.setFontSize(12);
      doc.setTextColor(0, 150, 100);
      doc.text(`Daily Target: ${dietChart.dailyCalories}`, 20, y);
      y += 10;
    }
    if (dietChart.meals) {
      dietChart.meals.forEach((meal) => {
        checkPageBreak(20);
        doc.setFontSize(12);
        doc.setTextColor(0, 100, 60);
        doc.text(`${meal.name}${meal.calories ? ` (${meal.calories})` : ''}`, 20, y);
        y += 6;
        doc.setFontSize(10);
        doc.setTextColor(80);
        const recLines = doc.splitTextToSize(meal.recommendation, pageWidth - 45);
        doc.text(recLines, 25, y);
        y += recLines.length * 5 + 8;
      });
    }

    checkPageBreak(10);
    y += 10;
    doc.setFontSize(16);
    doc.setTextColor(100, 0, 200);
    doc.text('Workout Plan', 20, y);
    y += 10;
    doc.setFontSize(11);
    doc.setTextColor(80);
    if (workoutPlan.summary) {
      const wsLines = doc.splitTextToSize(workoutPlan.summary, pageWidth - 40);
      checkPageBreak(wsLines.length * 5 + 5);
      doc.text(wsLines, 20, y);
      y += wsLines.length * 5 + 5;
    }
    if (workoutPlan.frequency) {
      checkPageBreak(10);
      doc.setFontSize(12);
      doc.setTextColor(80, 0, 150);
      doc.text(`Frequency: ${workoutPlan.frequency}`, 20, y);
      y += 10;
    }
    if (workoutPlan.exercises) {
      workoutPlan.exercises.forEach((day) => {
        checkPageBreak(20);
        doc.setFontSize(12);
        doc.setTextColor(60, 0, 120);
        doc.text(`${day.day} - ${day.focus}`, 20, y);
        y += 6;
        doc.setFontSize(10);
        doc.setTextColor(80);
        if (day.routines) {
          day.routines.forEach((r) => {
            doc.text(`• ${r}`, 25, y);
            y += 5;
          });
        }
        y += 4;
      });
    }

    doc.save(`FitSync-Plan-${plan._id}.pdf`);
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '4rem' }}><h3 className="gradient-text">Loading Plan...</h3></div>;
  if (error) return <div style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--error)' }}><h3>{error}</h3><Link to="/dashboard" style={{ color: 'var(--accent-primary)' }}>Go back to dashboard</Link></div>;
  if (!plan) return null;

  const { dietChart, workoutPlan } = plan;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <Link to="/dashboard" className="btn-secondary" style={{ padding: '0.5rem', display: 'flex', borderRadius: '50%' }}>
          <ArrowLeft size={20} />
        </Link>
        <h1 className="gradient-text" style={{ margin: 0, flex: 1 }}>Your Personalized Plan</h1>
        <button onClick={downloadPDF} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Download size={18} /> Download PDF
        </button>
      </div>
      
      <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent-secondary)' }}>
        <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 0 0.5rem 0' }}>
          <Info size={18} color="var(--accent-secondary)" /> Your Concern / Goal
        </h4>
        <p style={{ color: 'var(--text-muted)', margin: 0 }}>"{plan.concern}"</p>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        
        {/* Diet Chart Section */}
        <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-panel">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)', marginBottom: '1rem' }}>
              <Coffee size={24} /> Diet Chart
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>{dietChart.summary}</p>
            {dietChart.dailyCalories && (
              <div style={{ display: 'inline-block', padding: '0.5rem 1rem', background: 'rgba(0, 255, 204, 0.1)', borderRadius: '20px', color: 'var(--accent-primary)', fontWeight: '600', marginBottom: '1.5rem' }}>
                Target: {dietChart.dailyCalories}
              </div>
            )}
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {dietChart.meals && dietChart.meals.map((meal, index) => (
                <div key={index} style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', borderLeft: '3px solid var(--accent-primary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <h4 style={{ margin: 0, color: 'var(--text-main)' }}>{meal.name}</h4>
                    {meal.calories && <span style={{ fontSize: '0.85rem', color: 'var(--accent-primary)' }}>{meal.calories}</span>}
                  </div>
                  <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-muted)' }}>{meal.recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Workout Plan Section */}
        <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-panel" style={{ animationDelay: '0.1s' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-secondary)', marginBottom: '1rem' }}>
              <Dumbbell size={24} /> Workout Plan
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>{workoutPlan.summary}</p>
            {workoutPlan.frequency && (
              <div style={{ display: 'inline-block', padding: '0.5rem 1rem', background: 'rgba(112, 0, 255, 0.1)', borderRadius: '20px', color: 'var(--accent-secondary)', fontWeight: '600', marginBottom: '1.5rem' }}>
                Frequency: {workoutPlan.frequency}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {workoutPlan.exercises && workoutPlan.exercises.map((day, index) => (
                <div key={index} style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', borderLeft: '3px solid var(--accent-secondary)' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-main)' }}>{day.day} <span style={{ color: 'var(--text-muted)', fontWeight: 'normal', fontSize: '0.9rem' }}>• {day.focus}</span></h4>
                  <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                    {day.routines && day.routines.map((routine, rIdx) => (
                      <li key={rIdx} style={{ marginBottom: '0.3rem' }}>{routine}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PlanView;
