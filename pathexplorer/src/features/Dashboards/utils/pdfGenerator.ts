import jsPDF from 'jspdf';
import { format } from 'date-fns';
import html2canvas from 'html2canvas-pro';
import { TfsStats } from '@/features/Dashboards/useTFSStats';
import { ManagerStats } from '@/features/Dashboards/useManagerStats';
import { UserDetails } from '@/features/context/userContext';

const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const PAGE_MARGIN_TOP = 15;
const PAGE_MARGIN_BOTTOM = 15;
const PAGE_MARGIN_LEFT = 14;
const PAGE_MARGIN_RIGHT = 14;
const CONTENT_WIDTH = PAGE_WIDTH - PAGE_MARGIN_LEFT - PAGE_MARGIN_RIGHT;

const LINE_HEIGHT = 7;
const SECTION_SPACING = 10;
const CHART_SPACING = 5;

const CHART_HEIGHT = 80;
const CHART_HEIGHT_SMALL = 60;

async function addHeaderWithLogo(doc: jsPDF) {
  return new Promise<void>((resolve) => {
    const img = new Image();
    img.src = '/accenture/Acc_GT_Dimensional_RGB.png';
    img.onload = function() {
      const logoWidth = 7;
      const logoHeight = (img.height / img.width) * logoWidth;

      doc.addImage(
        img,
        'PNG',
        PAGE_MARGIN_LEFT,
        PAGE_MARGIN_TOP,
        logoWidth,
        logoHeight,
      );

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(
        'PathExplorer',
        PAGE_MARGIN_LEFT + logoWidth + 2,
        PAGE_MARGIN_TOP + (logoHeight / 2) + 1,
      );

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      const dateString = `Report generated: ${format(new Date(), 'MMM d, yyyy')}`;
      doc.text(
        dateString,
        PAGE_WIDTH - PAGE_MARGIN_RIGHT,
        PAGE_MARGIN_TOP + (logoHeight / 2),
        { align: 'right' },
      );

      doc.setLineWidth(0.5);
      doc.line(
        PAGE_MARGIN_LEFT,
        PAGE_MARGIN_TOP + logoHeight + 5,
        PAGE_WIDTH - PAGE_MARGIN_RIGHT,
        PAGE_MARGIN_TOP + logoHeight + 5,
      );

      resolve();
    };

    img.onerror = function() {
      console.error('Error loading logo image');
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('pathexplorer', PAGE_MARGIN_LEFT, PAGE_MARGIN_TOP + 5);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      const dateString = `Report generated: ${format(new Date(), 'MMM d, yyyy')}`;
      doc.text(dateString, PAGE_WIDTH - PAGE_MARGIN_RIGHT, PAGE_MARGIN_TOP + 5, { align: 'right' });

      doc.setLineWidth(0.5);
      doc.line(
        PAGE_MARGIN_LEFT,
        PAGE_MARGIN_TOP + 10,
        PAGE_WIDTH - PAGE_MARGIN_RIGHT,
        PAGE_MARGIN_TOP + 10,
      );

      resolve();
    };
  });
}

async function captureChart(chartRef: React.RefObject<HTMLDivElement | null>): Promise<string | null> {
  if (!chartRef.current) {
    console.warn('Chart reference is null');
    return null;
  }

  try {
    const canvas = await html2canvas(chartRef.current, {
      backgroundColor: '#FFFFFF',
      scale: 2,
      logging: false,
      useCORS: true,
      allowTaint: true,
    });

    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Error capturing chart:', error);
    return null;
  }
}

async function addTextWithPaging(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
): Promise<number> {
  let currentY = y;
  const pageHeight = doc.internal.pageSize.height;
  const lines = doc.splitTextToSize(text, maxWidth);

  for (const line of lines) {
    if (currentY + lineHeight > pageHeight - PAGE_MARGIN_BOTTOM) {
      doc.addPage();
      currentY = PAGE_MARGIN_TOP + 30;
      await addHeaderWithLogo(doc);
    }

    doc.text(line, x, currentY);
    currentY += lineHeight;
  }

  return currentY;
}

async function addChart(
  doc: jsPDF,
  chartRef: React.RefObject<HTMLDivElement | null> | undefined,
  chartKey: string,
  title: string,
  x: number,
  y: number,
  width: number,
  height: number,
): Promise<number> {
  let currentY = y;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  const titleHeight = 7;

  if (currentY + titleHeight + height + 5 > doc.internal.pageSize.height - PAGE_MARGIN_BOTTOM) {
    doc.addPage();
    currentY = PAGE_MARGIN_TOP + 30;
    await addHeaderWithLogo(doc);
  }

  doc.text(title, x, currentY);
  currentY += titleHeight;

  if (!chartRef) {
    console.warn(`Chart ref for ${chartKey} is missing`);
    return currentY + 5;
  }

  const chartImg = await captureChart(chartRef);

  if (chartImg) {
    doc.addImage(chartImg, 'PNG', x, currentY, width, height);
    currentY += height + 5;
  } else {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(150, 150, 150);
    doc.text('(Chart could not be generated)', x, currentY + 10);
    currentY += 20;
    doc.setTextColor(0, 0, 0);
  }

  return currentY + CHART_SPACING;
}

export async function generateDashboardPDF(
  data: ManagerStats | TfsStats,
  dashboardType: 'manager' | 'tfs',
  chartRefs?: Record<string, React.RefObject<HTMLDivElement | null>>,
  userDetails?: UserDetails | null,
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  await addHeaderWithLogo(doc);

  const img = new Image();
  img.src = '/accenture/Acc_GT_Dimensional_RGB.png';
  const logoWidth = 7;
  const logoHeight = (img.height / img.width) * logoWidth || 5;

  let yPos = PAGE_MARGIN_TOP + logoHeight + 20;

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  const title = `${dashboardType.toUpperCase()} Dashboard Report`;
  doc.text(title, PAGE_MARGIN_LEFT, yPos);
  yPos += 10;

  const halfWidth = (CONTENT_WIDTH - 10) / 2;
  let leftColumnYPos = yPos;
  let rightColumnYPos = yPos;

  // Left column: Summary
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Summary', PAGE_MARGIN_LEFT, leftColumnYPos);
  leftColumnYPos += 7;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  if (dashboardType === 'tfs') {
    const tfsData = data as TfsStats;
    leftColumnYPos = await addTextWithPaging(
      doc,
      `Unassigned Employees: ${tfsData.employees.not_assigned}`,
      PAGE_MARGIN_LEFT,
      leftColumnYPos,
      halfWidth,
      LINE_HEIGHT,
    );

    leftColumnYPos = await addTextWithPaging(
      doc,
      `Pending Assignment Requests: ${tfsData.requests.pending_assignments}`,
      PAGE_MARGIN_LEFT,
      leftColumnYPos,
      halfWidth,
      LINE_HEIGHT,
    );
  } else if (dashboardType === 'manager') {
    const managerData = data as ManagerStats;
    const stats = [
      `Total Employees: ${managerData.employees.total}`,
      `Assigned Employees: ${managerData.employees.assigned}`,
      `Not Assigned Employees: ${managerData.employees.not_assigned}`,
      `Active Projects: ${managerData.projects.active}`,
      `Average Assignment: ${(managerData.assignment.average_assignment_percentage * 100).toFixed(1)}%`,
    ];

    for (const stat of stats) {
      leftColumnYPos = await addTextWithPaging(
        doc,
        stat,
        PAGE_MARGIN_LEFT,
        leftColumnYPos,
        halfWidth,
        LINE_HEIGHT,
      );
    }
  }

  // Right column: Employee Information
  if (userDetails) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Report Generated By:', PAGE_MARGIN_LEFT + halfWidth + 10, rightColumnYPos);
    rightColumnYPos += 7;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    const fullName = `${userDetails.name} ${userDetails.last_name_1} ${userDetails.last_name_2}`.trim();
    doc.text(`Name: ${fullName}`, PAGE_MARGIN_LEFT + halfWidth + 10, rightColumnYPos);
    rightColumnYPos += LINE_HEIGHT;

    doc.text(`Email: ${userDetails.email}`, PAGE_MARGIN_LEFT + halfWidth + 10, rightColumnYPos);
    rightColumnYPos += LINE_HEIGHT;

    doc.text(`Position: ${userDetails.position}`, PAGE_MARGIN_LEFT + halfWidth + 10, rightColumnYPos);
    rightColumnYPos += LINE_HEIGHT;

  }

  yPos = Math.max(leftColumnYPos, rightColumnYPos) + SECTION_SPACING;

  if (dashboardType === 'tfs') {

    yPos = await addChart(
      doc,
      chartRefs?.missingEmployees,
      'missingEmployees',
      'Projects With Missing Employees',
      PAGE_MARGIN_LEFT,
      yPos,
      CONTENT_WIDTH,
      CHART_HEIGHT,
    );

    const halfWidth = (CONTENT_WIDTH - 5) / 2;

    const yAfterChart1 = await addChart(
      doc,
      chartRefs?.topProjectSkills,
      'topProjectSkills',
      'Top Project Skills',
      PAGE_MARGIN_LEFT,
      yPos,
      halfWidth,
      CHART_HEIGHT_SMALL,
    );

    const yAfterChart2 = await addChart(
      doc,
      chartRefs?.assignmentOverview,
      'assignmentOverview',
      'Assignment Overview',
      PAGE_MARGIN_LEFT + halfWidth + 5,
      yPos,
      halfWidth,
      CHART_HEIGHT_SMALL,
    );

  } else if (dashboardType === 'manager') {

    const halfWidth = (CONTENT_WIDTH - 5) / 2;

    const yAfterChart1 = await addChart(
      doc,
      chartRefs?.employeesByRole,
      'employeesByRole',
      'Employees by Role',
      PAGE_MARGIN_LEFT,
      yPos,
      halfWidth,
      CHART_HEIGHT_SMALL,
    );

    const yAfterChart2 = await addChart(
      doc,
      chartRefs?.topProjectSkills,
      'topProjectSkills',
      'Top Project Skills',
      PAGE_MARGIN_LEFT + halfWidth + 5,
      yPos,
      halfWidth,
      CHART_HEIGHT_SMALL,
    );

    yPos = Math.max(yAfterChart1, yAfterChart2);

    const yAfterChart3 = await addChart(
      doc,
      chartRefs?.assignmentOverview,
      'assignmentOverview',
      'Assignment Overview',
      PAGE_MARGIN_LEFT,
      yPos,
      halfWidth,
      CHART_HEIGHT_SMALL,
    );

    const yAfterChart4 = await addChart(
      doc,
      chartRefs?.employeesBySeniority,
      'employeesBySeniority',
      'Employees by Seniority',
      PAGE_MARGIN_LEFT + halfWidth + 5,
      yPos,
      halfWidth,
      CHART_HEIGHT_SMALL,
    );

    yPos = Math.max(yAfterChart3, yAfterChart4);

    yPos = await addChart(
      doc,
      chartRefs?.topProjectsByEmployees,
      'topProjectsByEmployees',
      'Top Projects by Employees',
      PAGE_MARGIN_LEFT,
      yPos,
      CONTENT_WIDTH,
      CHART_HEIGHT,
    );
  }

  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `Page ${i} of ${totalPages}`,
      PAGE_WIDTH / 2,
      PAGE_HEIGHT - 10,
      { align: 'center' },
    );
  }

  doc.save(`${dashboardType}_dashboard_report_${format(new Date(), 'yyyyMMdd_HHmmss')}.pdf`);
}
