'use client';

import { useState, useEffect, useRef } from 'react';
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
import { Bar, Doughnut } from 'react-chartjs-2';
import { useTfsStats } from '@/app/user/dashboard/hooks/useTFSStats';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DownloadReportButton } from './DownloadReportButton';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

export function TFSDashboard() {
  const { data, loading, error } = useTfsStats();
  const [chartsReady, setChartsReady] = useState(false);

  // In TFSDashboard.tsx
  const chartRefs = {
    missingEmployees: useRef<HTMLDivElement>(null),
    topProjectSkills: useRef<HTMLDivElement>(null),
    assignmentOverview: useRef<HTMLDivElement>(null),
  };

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

  return (
    <div className="space-y-6">
      <div className="flex justify-end mb-4">
        <DownloadReportButton
          dashboardType="tfs"
          data={data}
          chartRefs={chartRefs}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Unassigned Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.employees.not_assigned}</div>
            <p className="text-xs text-muted-foreground">
              Available for project assignment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Assignment Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.requests.pending_assignments}</div>
            <p className="text-xs text-muted-foreground">
              Waiting for approval
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Projects With Missing Employees</CardTitle>
          <CardDescription>Top projects that need more employees</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80" ref={chartRefs.missingEmployees}>
            <Bar
              data={{
                labels: data.projects.top_5_missing_employees.map(project => project.project_name),
                datasets: [
                  {
                    label: 'Missing Employees',
                    data: data.projects.top_5_missing_employees.map(project => project.missing),
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Project Skills</CardTitle>
            <CardDescription>Most in-demand skills across projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80" ref={chartRefs.topProjectSkills}>
              <Bar
                data={{
                  labels: data.skills.top_7_project_skills.map(skill => skill.skill_name),
                  datasets: [
                    {
                      label: 'Count',
                      data: data.skills.top_7_project_skills.map(skill => skill.count),
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
            <CardTitle>Assignment Overview</CardTitle>
            <CardDescription>Current assignment status and pending requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64" ref={chartRefs.assignmentOverview}>
              <Doughnut
                data={{
                  labels: ['Unassigned Employees', 'Pending Requests'],
                  datasets: [
                    {
                      data: [data.employees.not_assigned, data.requests.pending_assignments],
                      backgroundColor: [
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                      ],
                      borderColor: [
                        'rgba(75, 192, 192, 1)',
                        'rgba(255, 206, 86, 1)',
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
      </div>
    </div>
  );
}
