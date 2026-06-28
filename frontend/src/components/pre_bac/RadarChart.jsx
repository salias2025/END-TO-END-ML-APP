import React from 'react';
import {
  Radar,
  RadarChart as RechartsRadar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
  ResponsiveContainer
} from 'recharts';

export default function RadarChart({ studentData, clusterData }) {
  if (!studentData || !clusterData) {
    return <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>لا توجد بيانات لعرضها</div>;
  }

  const data = [
    { subject: 'الرياضيات', student: studentData.as2_math || 0, cluster: clusterData.math || 0 },
    { subject: 'الفيزياء', student: studentData.as2_physics || 0, cluster: clusterData.physics || 0 },
    { subject: 'العلوم', student: studentData.as2_science || 0, cluster: clusterData.science || 0 },
    { subject: 'اللغة العربية', student: studentData.as2_arabic || 0, cluster: clusterData.arabic || 0 },
    { subject: 'اللغات', student: studentData.as2_langues || 0, cluster: clusterData.langues || 0 }
  ];

  return (
    <div style={{ width: '100%', height: '400px', direction: 'rtl' }}>
      <h3 style={{ textAlign: 'center', color: '#333' }}>📊 مقارنة أدائك مع طلاب مجموعتك</h3>
      <p style={{ textAlign: 'center', color: '#666', fontSize: '14px' }}>
        الخط الأزرق = أنت | الخط البرتقالي = مجموعتك
      </p>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadar data={data} outerRadius="80%">
          <PolarGrid stroke="#e0e0e0" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#333', fontSize: 12 }} />
          <PolarRadiusAxis angle={90} domain={[0, 20]} tick={{ fill: '#666' }} />
          <Radar name="أنت" dataKey="student" stroke="#667eea" fill="#667eea" fillOpacity={0.3} />
          <Radar name="مجموعتك" dataKey="cluster" stroke="#f39c12" fill="#f39c12" fillOpacity={0.3} />
          <Legend wrapperStyle={{ color: '#333' }} />
        </RechartsRadar>
      </ResponsiveContainer>
    </div>
  );
}