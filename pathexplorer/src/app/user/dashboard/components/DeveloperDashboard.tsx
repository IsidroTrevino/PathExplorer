'use client';

import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut, Pie } from 'react-chartjs-2';
import { useEmployeeStats } from '@/app/user/dashboard/hooks/useEmployeeStats';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

export function DeveloperDashboard() {
  const { data, loading, error } = useEmployeeStats();
  const [chartsReady, setChartsReady] = useState(false);

  useEffect(() => {
    setChartsReady(true);
  }, []);

  if (loading || !chartsReady || !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-red-50 border-red-200">
        <CardContent className="pt-6">
          <p className="text-red-600">Error loading dashboard: {error}</p>
        </CardContent>
      </Card>
    );
  }

  const generateChartColors = (count: number) => {
    const baseColors = [
      { bg: 'rgba(53, 162, 235, 0.5)', border: 'rgba(53, 162, 235, 1)' },
      { bg: 'rgba(255, 99, 132, 0.5)', border: 'rgba(255, 99, 132, 1)' },
      { bg: 'rgba(75, 192, 192, 0.5)', border: 'rgba(75, 192, 192, 1)' },
      { bg: 'rgba(255, 206, 86, 0.5)', border: 'rgba(255, 206, 86, 1)' },
      { bg: 'rgba(153, 102, 255, 0.5)', border: 'rgba(153, 102, 255, 1)' },
      { bg: 'rgba(255, 159, 64, 0.5)', border: 'rgba(255, 159, 64, 1)' },
    ];

    return Array(count).fill(0).map((_, i) => baseColors[i % baseColors.length]);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Assignment percentage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(data.general.total_employees).toFixed(1)}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Your Certifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.personal.certifications.active + data.personal.certifications.expiring_soon + data.personal.certifications.expired}
            </div>
            <p className="text-xs text-muted-foreground">
              {data.personal.certifications.active} active, {data.personal.certifications.expiring_soon} expiring soon
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Hard Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.personal.skills.by_type.hard}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Soft Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.personal.skills.by_type.soft}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Technical Skills</CardTitle>
            <CardDescription>Most common technical skills across the company</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <Bar
                data={{
                  labels: data.general.top_technical_skills.map(skill => skill.name),
                  datasets: [
                    {
                      label: 'Count',
                      data: data.general.top_technical_skills.map(skill => skill.count),
                      backgroundColor: 'rgba(53, 162, 235, 0.5)',
                    },
                  ],
                }}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        precision: 0,
                      },
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Soft Skills</CardTitle>
            <CardDescription>Most common soft skills across the company</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <Bar
                data={{
                  labels: data.general.top_soft_skills.map(skill => skill.name),
                  datasets: [
                    {
                      label: 'Count',
                      data: data.general.top_soft_skills.map(skill => skill.count),
                      backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    },
                  ],
                }}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        precision: 0,
                      },
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Certification Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Doughnut
                data={{
                  labels: ['Active', 'Expiring Soon', 'Expired'],
                  datasets: [
                    {
                      data: [
                        data.personal.certifications.active,
                        data.personal.certifications.expiring_soon,
                        data.personal.certifications.expired,
                      ],
                      backgroundColor: [
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(255, 99, 132, 0.6)',
                      ],
                      borderColor: [
                        'rgba(75, 192, 192, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(255, 99, 132, 1)',
                      ],
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Certification Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {Object.keys(data.personal.certifications.by_type).length > 0 ? (
                <Pie
                  data={{
                    labels: Object.keys(data.personal.certifications.by_type),
                    datasets: [
                      {
                        data: Object.values(data.personal.certifications.by_type),
                        backgroundColor: generateChartColors(Object.keys(data.personal.certifications.by_type).length).map(c => c.bg),
                        borderColor: generateChartColors(Object.keys(data.personal.certifications.by_type).length).map(c => c.border),
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                      },
                    },
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground text-center">No certification types data available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Skills Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Pie
                data={{
                  labels: ['Hard Skills', 'Soft Skills'],
                  datasets: [
                    {
                      data: [data.personal.skills.by_type.hard, data.personal.skills.by_type.soft],
                      backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)'],
                      borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)'],
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Certifications</CardTitle>
          <CardDescription>Most common certifications across the company</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <Bar
              data={{
                labels: data.general.top_certifications.map(cert => cert.name),
                datasets: [
                  {
                    label: 'Count',
                    data: data.general.top_certifications.map(cert => cert.count),
                    backgroundColor: 'rgba(153, 102, 255, 0.5)',
                  },
                ],
              }}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      precision: 0,
                    },
                  },
                },
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
