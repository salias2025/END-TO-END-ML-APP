import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function HabitsChart({ studentData }) {
  if (!studentData) {
    return <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>لا توجد بيانات لعرضها</div>;
  }

  const efficiency = studentData.as2_avg_global / (studentData.weekly_study_hours + 0.1);

  const data = [
    {
      name: 'ساعات الدراسة',
      أنت: studentData.weekly_study_hours,
      الهدف: 18
    },
    {
      name: 'كفاءة الدراسة',
      أنت: parseFloat(efficiency.toFixed(2)),
      الهدف: 1.2
    },
    {
      name: 'انتظام الدراسة',
      أنت: parseFloat((studentData.study_consistency * 20).toFixed(1)),
      الهدف: 16
    },
    {
      name: 'ساعات النوم',
      أنت: studentData.sleep_hours,
      الهدف: 8
    }
  ];

  const formatLabel = (name) => {
    const labels = {
      'ساعات الدراسة': 'ساعات الدراسة\nأسبوعياً',
      'كفاءة الدراسة': 'كفاءة الدراسة\n(نقطة/ساعة)',
      'انتظام الدراسة': 'انتظام الدراسة\n(من 0 إلى 20)',
      'ساعات النوم': 'ساعات النوم\nليلاً'
    };
    return labels[name] || name;
  };

  return (
    <div style={{ width: '100%', height: '350px', direction: 'rtl' }}>
      <h3 style={{ textAlign: 'center', color: '#333' }}>📊 مقارنة عادات دراستك مع الأهداف المثالية</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="name" tick={{ fill: '#333', fontSize: 12 }} tickFormatter={formatLabel} />
          <YAxis tick={{ fill: '#666' }} />
          <Tooltip 
            contentStyle={{ direction: 'rtl', color: '#333' }}
            formatter={(value) => typeof value === 'number' ? value.toFixed(2) : value}
          />
          <Legend wrapperStyle={{ color: '#333' }} />
          <Bar dataKey="أنت" fill="#667eea" radius={[4, 4, 0, 0]} />
          <Bar dataKey="الهدف" fill="#2ecc71" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}