'use client';

export default function ProfessionalPathPage() {
  const experiences = [
    {
      date: 'January 2020',
      title: 'Back-End Developer',
      company: 'Trading Algorithm Backtester',
      description:
        'Worked on the Automated Trading Backtesting System, developing Python scripts to analyze historical financial data. Built a robust logging system to track trading strategies’ performance. Optimized database queries in PostgreSQL, reducing data processing time by 40%.',
    },
    {
      date: 'July 2021',
      title: 'Front-End Developer',
      company: 'E-Learning Platform',
      description:
        'Contributed to the Interactive Learning Management System (LMS), creating an engaging UI with React and Material-UI. Implemented real-time student progress tracking using WebSockets. Improved accessibility features to comply with WCAG standards.',
    },
    {
      date: 'September 2021',
      title: 'Full-Stack Developer',
      company: 'Customer Relationship Management (CRM) System',
      description:
        'Developed APIs for the CRM System Enhancement Project, integrating real-time customer insights using Node.js and Express. Built interactive dashboards in Vue.js, providing sales teams with data-driven recommendations. Migrated authentication systems to OAuth 2.0 for better security.',
    },
    {
      date: 'January 2022',
      title: 'Mobile Developer',
      company: 'FinTech App',
      description:
        'Led the development of the Mobile Banking App, improving user retention by 20%. Built native iOS and Android applications using Swift and Kotlin. Integrated biometric authentication for secure and seamless logins.',
    },
    {
      date: 'March 2023',
      title: 'DevOps Engineer',
      company: 'Infrastructure Support',
      description:
        'Become better at communicating with my teams and consistently giving updates on how my part of the project is going.',
    },
    {
      date: 'December 2024',
      title: 'Android App Development',
      company: 'CI/CD & Automation',
      description:
        'Managing the Infrastructure as Code (IaC) Transition Project, implementing Terraform and Kubernetes. Automated deployment pipelines using Jenkins and GitHub Actions. Reduced deployment time by 50% and improved system reliability.',
    },
    {
      date: 'Present',
      title: 'Cloud Architect',
      company: 'Scalable Systems & AI Integration',
      description:
        'Planning to lead cloud-based projects integrating AI-driven analytics. Focused on cost-efficient architecture using AWS Lambda and serverless technologies. Aiming to build highly scalable solutions with multi-region failover strategies.',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold">Professional Path</h1>
      <p className="text-gray-600 mb-6">Visualize your career growth and future opportunities.</p>
      <hr className="mb-12 border-gray-300" />

      <div className="relative">
        {/* Línea vertical centrada en la misma columna que las bolitas */}
        <div className="absolute left-[191.5px] top-5 bottom-0 w-[2px] bg-[#D9BFFF] z-0" />

        <div className="space-y-16">
          {experiences.map((exp, idx) => (
            <div
              key={idx}
              className="grid grid-cols-[160px_32px_1fr] items-start gap-4 relative z-10 max-w-4xl"
            >
              {/* Fecha */}
              <div className="text-right pr-2 text-sm font-semibold text-gray-900 pt-1">
                {exp.date}
              </div>

              {/* Punto */}
              <div className="relative flex justify-center z-10">
                <span className="w-4 h-4 rounded-full bg-[#D9BFFF] absolute top-1.5 z-20" />
              </div>

              {/* Contenido */}
              <div className="pl-2">
                <h3 className="text-lg font-bold text-purple-700">{exp.title}</h3>
                <h4 className="text-sm font-semibold underline text-[#B980FF]">{exp.company}</h4>
                <p className="text-gray-700 text-sm mt-1">{exp.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-20 max-w-4xl">
        <h2 className="text-xl font-bold mb-1">Renew your certifications</h2>
        <p className="text-sm text-gray-600">
          Check the expired certifications and, if you have the new document, upload the necessary information.
        </p>
      </div>
    </div>
  );
}
