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
import { Bar, Doughnut } from 'react-chartjs-2';
import { useManagerStats } from '@/features/Dashboards/useManagerStats';
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

export function ManagerDashboard() {
  const { data, loading, error } = useManagerStats();
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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.employees.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Assigned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.employees.assigned}</div>
            <p className="text-xs text-muted-foreground">
              {((data.employees.assigned / data.employees.total) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Not Assigned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.employees.not_assigned}</div>
            <p className="text-xs text-muted-foreground">
              {((data.employees.not_assigned / data.employees.total) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.projects.active}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Employees by Role</CardTitle>
            <CardDescription>Distribution of employees across different roles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <Bar
                data={{
                  labels: Object.keys(data.employees.by_role),
                  datasets: [
                    {
                      label: 'Employees',
                      data: Object.values(data.employees.by_role),
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
            <CardTitle>Top Project Skills</CardTitle>
            <CardDescription>Most in-demand skills across projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <Bar
                data={{
                  labels: data.skills.top_7_project_skills.map(skill => skill.skill_name),
                  datasets: [
                    {
                      label: 'Count',
                      data: data.skills.top_7_project_skills.map(skill => skill.count),
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Assignment Overview</CardTitle>
            <CardDescription>Current assignment status of employees</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Doughnut
                data={{
                  labels: ['Assigned', 'Not Assigned'],
                  datasets: [
                    {
                      data: [data.employees.assigned, data.employees.not_assigned],
                      backgroundColor: [
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(255, 99, 132, 0.6)',
                      ],
                      borderColor: [
                        'rgba(75, 192, 192, 1)',
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
            <div className="mt-4 text-center">
              <p className="text-sm font-medium">Average Assignment</p>
              <p className="text-2xl font-bold">{(data.assignment.average_assignment_percentage * 100).toFixed(1)}%</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Employees by Seniority</CardTitle>
            <CardDescription>Distribution by years of experience</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <Bar
                data={{
                  labels: data.employees.by_seniority.map(item =>
                    item.seniority === 0 ? 'Not specified' :
                      item.seniority === 1 ? '1 year' :
                        `${item.seniority} years`,
                  ),
                  datasets: [
                    {
                      label: 'Employees',
                      data: data.employees.by_seniority.map(item => item.count),
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

      <Card>
        <CardHeader>
          <CardTitle>Top Projects by Employees</CardTitle>
          <CardDescription>Projects with the most employees assigned</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            {data.projects.top_5_by_employees.length > 0 ? (
              <Bar
                data={{
                  labels: data.projects.top_5_by_employees.map(project => project.project_name),
                  datasets: [
                    {
                      label: 'Employees',
                      data: data.projects.top_5_by_employees.map(project => project.employee_count),
                      backgroundColor: 'rgba(255, 159, 64, 0.5)',
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
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground text-center">No projects with assigned employees</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
